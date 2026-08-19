export type StatType = 'strength' | 'endurance' | 'agility' | 'intellect';

export interface UserStats {
  strength: number;    // Сила (STR)
  endurance: number;   // Выносливость (END)
  agility: number;     // Ловкость (AGI)
  intellect: number;   // Интеллект (INT)
}

export interface UserProfile {
  id?: string;
  name: string;
  username: string;
  avatarUrl: string;
  avatarPreset: string;
  level: number;
  currentXp: number;
  maxXp: number;
  totalWorkouts: number;
  streakDays: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
  stats: UserStats;
  fifaCardTheme: 'auto' | 'bronze' | 'silver' | 'gold' | 'blue_totw' | 'red_icon' | 'diamond' | 'onyx' | 'mythic';
  positionTitle: string;
  clubName: string;
  countryCode: string;
}

export interface Exercise {
  id: string;
  title: string;
  subtitle: string;
  category: 'strength' | 'cardio' | 'agility' | 'mind' | 'flexibility';
  primaryStat: StatType;
  secondaryStat?: StatType;
  statGain: {
    strength?: number;
    endurance?: number;
    agility?: number;
    intellect?: number;
  };
  xpReward: number;
  durationMinutes: number;
  difficulty: 'Легкий' | 'Средний' | 'Хардкор' | 'Высокий';
  calories: number;
  muscleGroups: string[];
  equipment: string[];
  icon: string;
  description: string;
  defaultSets?: number;
  defaultReps?: number;
  videoTips?: string[];
}

export interface WorkoutLogEntry {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  category: string;
  timestamp: number;
  dateStr: string; // YYYY-MM-DD
  durationMinutes: number;
  setsCompleted: number;
  repsOrDistance: string;
  caloriesBurned: number;
  xpEarned: number;
  statsEarned: Partial<UserStats>;
  notes?: string;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  username: string;
  avatar: string;
  level: number;
  ovr: number;
  weeklyXp: number;
  streak: number;
  badge: string;
  league: 'Бронза' | 'Серебро' | 'Золото' | 'Алмаз' | 'Чемпионы';
  isCurrentUser?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'strength' | 'endurance' | 'agility' | 'intellect' | 'general' | 'streaks';
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  unlocked: boolean;
  claimed: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  unit: string;
  rewardXp: number;
  statReward?: { stat: StatType; amount: number };
  skin?: {
    skinName: string;
    skinBadge: string;
    skinLore: string;
    accentColor: string;
    iconSymbol: string;
    rarity: string;
    skinImageUrl: string;
  };
}

export interface SocialComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: number;
}

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userUsername: string;
  userAvatar: string;
  userLevel: number;
  userOvr: number;
  userClub?: string;
  timestamp: number;
  text: string;
  imageUrl?: string;
  workoutSummary?: {
    title: string;
    category: string;
    statGain?: string;
    statsEarned?: Partial<UserStats>;
    durationMinutes?: number;
    calories?: number;
    xpEarned: number;
    details: string;
  };
  likesCount: number;
  isLiked?: boolean;
  fireCount: number;
  isFired?: boolean;
  muscleCount: number;
  isMuscled?: boolean;
  comments: SocialComment[];
}

export interface PublicUserProfile {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  level: number;
  ovr: number;
  clubName: string;
  countryCode: string;
  streakDays: number;
  longestStreak: number;
  totalWorkouts: number;
  bio: string;
  stats: UserStats;
  fifaCardTheme: 'auto' | 'bronze' | 'silver' | 'gold' | 'blue_totw' | 'red_icon' | 'diamond' | 'onyx' | 'mythic';
  positionTitle: string;
  unlockedTrophiesCount: number;
  followersCount: number;
  isFollowing?: boolean;
  achievements?: Achievement[];
}

export type ActiveTab = 'home' | 'feed' | 'exercises' | 'fifa_card' | 'calendar' | 'leaderboard' | 'achievements';
