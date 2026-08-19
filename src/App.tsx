/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Exercise,
  WorkoutLogEntry,
  LeaderboardUser,
  ActiveTab,
  StatType,
  UserStats,
  Achievement,
  SocialPost,
  PublicUserProfile
} from './types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_RECENT_LOGS,
  INITIAL_LEADERBOARD,
  getXpRequiredForLevel,
  calculateOvr
} from './data/initialData';
import { INITIAL_EXERCISES } from './data/exercisesData';
import { INITIAL_ACHIEVEMENTS } from './data/achievementsData';
import {
  INITIAL_SOCIAL_POSTS,
  COMMUNITY_PROFILES,
  buildPublicProfileFromLocal
} from './data/socialData';
import { TelegramHeader } from './components/TelegramHeader';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { ExerciseCatalogView } from './components/ExerciseCatalogView';
import { FifaCardStudio } from './components/FifaCardStudio';
import { CalendarView } from './components/CalendarView';
import { LeaderboardView } from './components/LeaderboardView';
import { AchievementsView } from './components/AchievementsView';
import { FeedView } from './components/FeedView';
import { CreatePostModal } from './components/CreatePostModal';
import { UserProfileModal } from './components/UserProfileModal';
import { LevelUpCelebration } from './components/LevelUpCelebration';
import { triggerHaptic } from './utils/haptics';
import { initTelegramApp, getTelegramUser } from './utils/telegram';

const MAX_DAILY_LOGS_PER_EXERCISE = 5;

export default function App() {
  // Load user profile
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fithero_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_USER_PROFILE;
  });

  // Always enforce the clean canonical 4 disciplines
  const [exercises] = useState<Exercise[]>(INITIAL_EXERCISES);

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogEntry[]>(() => {
    const saved = localStorage.getItem('fithero_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_RECENT_LOGS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('fithero_achievements');
    if (saved) {
      try {
        const parsed: Achievement[] = JSON.parse(saved);
        return INITIAL_ACHIEVEMENTS.map((initAch) => {
          const match = parsed.find((p) => p.id === initAch.id);
          if (match) {
            return {
              ...initAch,
              unlocked: match.unlocked,
              claimed: match.claimed,
              progress: match.progress,
              unlockedAt: match.unlockedAt
            };
          }
          return initAch;
        });
      } catch {}
    }
    return INITIAL_ACHIEVEMENTS;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedStatFilter, setSelectedStatFilter] = useState<StatType | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<{ newLevel: number } | null>(null);

  // Social Feed State
  const [posts, setPosts] = useState<SocialPost[]>(() => {
    const saved = localStorage.getItem('fithero_posts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_SOCIAL_POSTS;
  });

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [prefilledPostWorkout, setPrefilledPostWorkout] = useState<WorkoutLogEntry | null>(null);
  const [viewingUserProfile, setViewingUserProfile] = useState<PublicUserProfile | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fithero_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('fithero_logs', JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  useEffect(() => {
    localStorage.setItem('fithero_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('fithero_posts', JSON.stringify(posts));
  }, [posts]);

  // Clean old exercises cache & Initialize Telegram Mini App
  useEffect(() => {
    localStorage.removeItem('fithero_exercises');

    // Initialize Telegram WebApp environment
    initTelegramApp();

    // Auto-detect Telegram user name/photo if not already customized
    const tgUser = getTelegramUser();
    if (tgUser) {
      setProfile((prev) => {
        // If current name is default, update with Telegram user details
        const isDefaultName = !prev.name || prev.name === 'Атлет #7' || prev.name.startsWith('Атлет');
        if (isDefaultName && tgUser.first_name) {
          const fullName = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ');
          return {
            ...prev,
            name: fullName,
            username: tgUser.username ? `@${tgUser.username}` : prev.username,
            avatarUrl: tgUser.photo_url || prev.avatarUrl
          };
        }
        return prev;
      });
    }
  }, []);

  // Recalculate achievement progress based on workout history & stats
  const syncAchievementsProgress = (
    currentLogs: WorkoutLogEntry[],
    currentProfile: UserProfile
  ) => {
    const todayStr = new Date().toISOString().split('T')[0];

    // Compute metrics
    let totalPushups = 0;
    let totalRunKm = 0;
    let totalStretchSessions = 0;
    let totalReadingSessions = 0;
    const todayCategories = new Set<string>();

    currentLogs.forEach((log) => {
      const title = log.exerciseTitle.toLowerCase();
      if (title.includes('отжиман')) {
        const match = log.repsOrDistance.match(/(\d+)/);
        totalPushups += match ? parseInt(match[1], 10) : 15;
      } else if (title.includes('бег')) {
        const match = log.repsOrDistance.match(/([\d.]+)/);
        totalRunKm += match ? parseFloat(match[1]) : 5.0;
      } else if (title.includes('растяж') || log.category === 'flexibility' || log.category === 'agility') {
        totalStretchSessions += 1;
      } else if (title.includes('чтен') || log.category === 'mind') {
        totalReadingSessions += 1;
      }

      if (log.dateStr === todayStr) {
        if (title.includes('отжиман')) todayCategories.add('strength');
        if (title.includes('бег')) todayCategories.add('endurance');
        if (title.includes('растяж')) todayCategories.add('agility');
        if (title.includes('чтен')) todayCategories.add('intellect');
      }
    });

    setAchievements((prev) =>
      prev.map((ach) => {
        let prog = ach.progress;
        if (ach.id === 'pushup_novice') prog = Math.min(ach.maxProgress, totalPushups);
        if (ach.id === 'pushup_master') prog = Math.min(ach.maxProgress, totalPushups);
        if (ach.id === 'pushup_titan') prog = Math.min(ach.maxProgress, totalPushups);
        if (ach.id === 'run_starter') prog = Math.min(ach.maxProgress, Math.round(totalRunKm * 10) / 10);
        if (ach.id === 'run_marathoner') prog = Math.min(ach.maxProgress, Math.round(totalRunKm * 10) / 10);
        if (ach.id === 'stretch_flexible') prog = Math.min(ach.maxProgress, totalStretchSessions);
        if (ach.id === 'stretch_zen') prog = Math.min(ach.maxProgress, totalStretchSessions);
        if (ach.id === 'read_bookworm') prog = Math.min(ach.maxProgress, totalReadingSessions);
        if (ach.id === 'read_scholar') prog = Math.min(ach.maxProgress, totalReadingSessions);
        if (ach.id === 'streak_fire_3') prog = Math.min(ach.maxProgress, currentProfile.streakDays);
        if (ach.id === 'streak_fire_7') prog = Math.min(ach.maxProgress, currentProfile.streakDays);
        if (ach.id === 'quad_athlete') prog = Math.min(ach.maxProgress, todayCategories.size);

        const isNewlyUnlocked = !ach.unlocked && prog >= ach.maxProgress;

        return {
          ...ach,
          progress: prog,
          unlocked: ach.unlocked || prog >= ach.maxProgress,
          unlockedAt: isNewlyUnlocked ? todayStr : ach.unlockedAt
        };
      })
    );
  };

  // Update profile handler
  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  // Claim achievement reward
  const handleClaimAchievementReward = (achievementId: string) => {
    const ach = achievements.find((a) => a.id === achievementId);
    if (!ach || !ach.unlocked || ach.claimed) return;

    triggerHaptic('success');

    // Mark as claimed
    setAchievements((prev) =>
      prev.map((a) => (a.id === achievementId ? { ...a, claimed: true } : a))
    );

    // Apply XP and Stats
    let newXp = profile.currentXp + ach.rewardXp;
    let currentLvl = profile.level;
    let targetXp = profile.maxXp;
    let didLevelUp = false;

    const updatedStats = { ...profile.stats };
    if (ach.statReward) {
      const statKey = ach.statReward.stat;
      updatedStats[statKey] = Math.min(99, updatedStats[statKey] + ach.statReward.amount);
    }

    while (newXp >= targetXp) {
      newXp -= targetXp;
      currentLvl += 1;
      targetXp = getXpRequiredForLevel(currentLvl);
      didLevelUp = true;
      updatedStats.strength = Math.min(99, updatedStats.strength + 1);
      updatedStats.endurance = Math.min(99, updatedStats.endurance + 1);
      updatedStats.agility = Math.min(99, updatedStats.agility + 1);
      updatedStats.intellect = Math.min(99, updatedStats.intellect + 1);
    }

    setProfile((prev) => ({
      ...prev,
      level: currentLvl,
      currentXp: newXp,
      maxXp: targetXp,
      stats: updatedStats
    }));

    if (didLevelUp) {
      setLevelUpInfo({ newLevel: currentLvl });
    }
  };

  // Process completed workout with anti-fraud limit check
  const handleLogWorkout = (result: {
    exercise: Exercise;
    durationMinutes: number;
    setsCompleted: number;
    repsOrDistance: string;
    caloriesBurned: number;
    xpEarned: number;
    statsEarned: Partial<UserStats>;
  }) => {
    const todayStr = new Date().toISOString().split('T')[0];

    // Anti-fraud validation: maximum 5 logs for this exercise today
    const countToday = workoutLogs.filter((log) => {
      if (log.dateStr !== todayStr) return false;
      if (log.exerciseId === result.exercise.id) return true;
      const titleLower = result.exercise.title.toLowerCase();
      const logTitleLower = log.exerciseTitle.toLowerCase();
      if (titleLower.includes('отжиман') && logTitleLower.includes('отжиман')) return true;
      if (titleLower.includes('бег') && logTitleLower.includes('бег')) return true;
      if (titleLower.includes('растяж') && logTitleLower.includes('растяж')) return true;
      if (titleLower.includes('чтени') && logTitleLower.includes('чтени')) return true;
      return false;
    }).length;

    if (countToday >= MAX_DAILY_LOGS_PER_EXERCISE) {
      triggerHaptic('error');
      alert(`Дневной лимит (максимум ${MAX_DAILY_LOGS_PER_EXERCISE} в день) для этой дисциплины достигнут.`);
      return;
    }

    // Check streak
    let newStreak = profile.streakDays;
    let newLongest = profile.longestStreak;

    if (profile.lastWorkoutDate !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (profile.lastWorkoutDate === yesterdayStr) {
        newStreak += 1;
      } else if (!profile.lastWorkoutDate) {
        newStreak = 1;
      } else {
        newStreak = 1;
      }
      if (newStreak > newLongest) {
        newLongest = newStreak;
      }
    }

    // Apply stats & XP
    let newXp = profile.currentXp + result.xpEarned;
    let currentLvl = profile.level;
    let targetXp = profile.maxXp;
    let didLevelUp = false;

    const updatedStats = { ...profile.stats };
    if (result.statsEarned.strength) updatedStats.strength = Math.min(99, updatedStats.strength + result.statsEarned.strength);
    if (result.statsEarned.endurance) updatedStats.endurance = Math.min(99, updatedStats.endurance + result.statsEarned.endurance);
    if (result.statsEarned.agility) updatedStats.agility = Math.min(99, updatedStats.agility + result.statsEarned.agility);
    if (result.statsEarned.intellect) updatedStats.intellect = Math.min(99, updatedStats.intellect + result.statsEarned.intellect);

    while (newXp >= targetXp) {
      newXp -= targetXp;
      currentLvl += 1;
      targetXp = getXpRequiredForLevel(currentLvl);
      didLevelUp = true;
      updatedStats.strength = Math.min(99, updatedStats.strength + 1);
      updatedStats.endurance = Math.min(99, updatedStats.endurance + 1);
      updatedStats.agility = Math.min(99, updatedStats.agility + 1);
      updatedStats.intellect = Math.min(99, updatedStats.intellect + 1);
    }

    const newProfile: UserProfile = {
      ...profile,
      level: currentLvl,
      currentXp: newXp,
      maxXp: targetXp,
      totalWorkouts: profile.totalWorkouts + 1,
      streakDays: newStreak,
      longestStreak: newLongest,
      lastWorkoutDate: todayStr,
      stats: updatedStats
    };

    setProfile(newProfile);

    // Create log entry
    const newLog: WorkoutLogEntry = {
      id: `log_${Date.now()}`,
      exerciseId: result.exercise.id,
      exerciseTitle: result.exercise.title,
      category: result.exercise.category,
      timestamp: Date.now(),
      dateStr: todayStr,
      durationMinutes: result.durationMinutes,
      setsCompleted: result.setsCompleted,
      repsOrDistance: result.repsOrDistance,
      caloriesBurned: result.caloriesBurned,
      xpEarned: result.xpEarned,
      statsEarned: result.statsEarned
    };

    const nextLogs = [newLog, ...workoutLogs];
    setWorkoutLogs(nextLogs);

    // Update achievements
    syncAchievementsProgress(nextLogs, newProfile);

    if (didLevelUp) {
      setLevelUpInfo({ newLevel: currentLvl });
    }
  };

  // Social Feed: Publish Post
  const handlePublishPost = (postData: Omit<SocialPost, 'id' | 'timestamp' | 'likesCount' | 'fireCount' | 'muscleCount' | 'comments'>) => {
    const userOvr = calculateOvr(profile);
    const newPost: SocialPost = {
      ...postData,
      id: `post_${Date.now()}`,
      userId: 'current_user',
      userName: profile.name,
      userUsername: profile.username,
      userAvatar: profile.avatarUrl,
      userLevel: profile.level,
      userOvr: userOvr,
      userClub: profile.clubName || 'Telegram Fit Club',
      timestamp: Date.now(),
      likesCount: 1,
      isLiked: true,
      fireCount: 1,
      isFired: true,
      muscleCount: 0,
      comments: []
    };

    setPosts((prev) => [newPost, ...prev]);

    // Social reward: +20 XP
    setProfile((prev) => ({
      ...prev,
      currentXp: Math.min(prev.maxXp - 1, prev.currentXp + 20)
    }));

    setIsCreatePostOpen(false);
    setPrefilledPostWorkout(null);
    setActiveTab('feed');
  };

  // Social Feed: Reaction Toggle
  const handleToggleReaction = (postId: string, reaction: 'like' | 'fire' | 'muscle') => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        if (reaction === 'fire') {
          const next = !p.isFired;
          return {
            ...p,
            isFired: next,
            fireCount: next ? p.fireCount + 1 : Math.max(0, p.fireCount - 1)
          };
        }
        if (reaction === 'muscle') {
          const next = !p.isMuscled;
          return {
            ...p,
            isMuscled: next,
            muscleCount: next ? p.muscleCount + 1 : Math.max(0, p.muscleCount - 1)
          };
        }
        if (reaction === 'like') {
          const next = !p.isLiked;
          return {
            ...p,
            isLiked: next,
            likesCount: next ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
          };
        }
        return p;
      })
    );
  };

  // Social Feed: Add Comment
  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      userId: 'current_user',
      userName: profile.name,
      userAvatar: profile.avatarUrl,
      text,
      timestamp: Date.now()
    };

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p))
    );
  };

  // Open User Profile Modal
  const handleOpenUserProfile = (user: PublicUserProfile) => {
    setViewingUserProfile(user);
  };

  const handleOpenExercisesTab = (statFilter?: StatType) => {
    setSelectedStatFilter(statFilter || null);
    setActiveTab('exercises');
  };

  const unclaimedAchievementsCount = achievements.filter((a) => a.unlocked && !a.claimed).length;

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-slate-900 font-sans flex justify-center selection:bg-[#1664B0] selection:text-white">
      {/* Mobile Telegram Mini App Container Wrapper */}
      <div className="w-full max-w-lg min-h-screen flex flex-col relative bg-[#FCFAF7] shadow-2xl">
        {/* Telegram Header */}
        <TelegramHeader
          profile={profile}
          onOpenCardStudio={() => setActiveTab('fifa_card')}
          onOpenProfileModal={() => {
            const userOvr = calculateOvr(profile);
            const myPublicProfile = buildPublicProfileFromLocal(profile, achievements);
            myPublicProfile.ovr = userOvr;
            handleOpenUserProfile(myPublicProfile);
          }}
        />

        {/* Dynamic Tab Views */}
        <main className="flex-1 p-4">
          {activeTab === 'home' && (
            <DashboardView
              profile={profile}
              recentLogs={workoutLogs}
              achievements={achievements}
              onOpenExercisesTab={handleOpenExercisesTab}
              onOpenFifaCardStudio={() => setActiveTab('fifa_card')}
              onOpenCalendarTab={() => setActiveTab('calendar')}
              onOpenAchievementsTab={() => setActiveTab('achievements')}
            />
          )}

          {activeTab === 'feed' && (
            <FeedView
              posts={posts}
              currentProfile={profile}
              recentLogs={workoutLogs}
              onOpenCreatePost={() => {
                setPrefilledPostWorkout(workoutLogs[0] || null);
                setIsCreatePostOpen(true);
              }}
              onOpenUserProfile={handleOpenUserProfile}
              onToggleReaction={handleToggleReaction}
              onAddComment={handleAddComment}
            />
          )}

          {activeTab === 'exercises' && (
            <ExerciseCatalogView
              exercises={exercises}
              workoutLogs={workoutLogs}
              onLogWorkout={handleLogWorkout}
              initialCategoryFilter={selectedStatFilter}
            />
          )}

          {activeTab === 'fifa_card' && (
            <FifaCardStudio
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsView
              achievements={achievements}
              profile={profile}
              onClaimReward={handleClaimAchievementReward}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              profile={profile}
              workoutLogs={workoutLogs}
            />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardView
              users={leaderboard}
              currentUserProfile={profile}
              onOpenUserProfile={handleOpenUserProfile}
            />
          )}
        </main>

        {/* Bottom App Navigation */}
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          unclaimedAchievementsCount={unclaimedAchievementsCount}
        />

        {/* Create Post Modal */}
        {isCreatePostOpen && (
          <CreatePostModal
            profile={profile}
            recentLogs={workoutLogs}
            prefilledWorkout={prefilledPostWorkout}
            onClose={() => {
              setIsCreatePostOpen(false);
              setPrefilledPostWorkout(null);
            }}
            onPublishPost={handlePublishPost}
          />
        )}

        {/* User Profile Modal */}
        {viewingUserProfile && (
          <UserProfileModal
            user={viewingUserProfile}
            achievementsList={achievements}
            isCurrentUser={viewingUserProfile.id === 'current_user' || viewingUserProfile.id === profile.id}
            onClose={() => setViewingUserProfile(null)}
          />
        )}

        {/* Level Up Celebratory Modal */}
        {levelUpInfo && (
          <LevelUpCelebration
            newLevel={levelUpInfo.newLevel}
            profile={profile}
            onClose={() => setLevelUpInfo(null)}
            onOpenFifaCard={() => {
              setLevelUpInfo(null);
              setActiveTab('fifa_card');
            }}
          />
        )}
      </div>
    </div>
  );
}
