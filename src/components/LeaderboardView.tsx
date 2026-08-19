import React, { useState } from 'react';
import { Trophy, Award, Flame, User } from 'lucide-react';
import { LeaderboardUser, UserProfile, PublicUserProfile } from '../types';
import { calculateOvr } from '../data/initialData';
import { COMMUNITY_PROFILES } from '../data/socialData';
import { triggerHaptic } from '../utils/haptics';
import { AthleteAvatar } from './AthleteAvatar';

interface LeaderboardViewProps {
  users: LeaderboardUser[];
  currentUserProfile: UserProfile;
  onOpenUserProfile: (user: PublicUserProfile) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  users,
  currentUserProfile,
  onOpenUserProfile
}) => {
  const [activeLeague, setActiveLeague] = useState<LeaderboardUser['league']>('Золото');

  const leagues: LeaderboardUser['league'][] = ['Чемпионы', 'Алмаз', 'Золото', 'Серебро', 'Бронза'];

  const filteredUsers = users.filter((u) => u.league === activeLeague);
  const currentOvr = calculateOvr(currentUserProfile);

  const handleUserClick = (user: LeaderboardUser) => {
    triggerHaptic('light');
    const existing = COMMUNITY_PROFILES[user.id];
    if (existing) {
      onOpenUserProfile(existing);
    } else {
      onOpenUserProfile({
        id: user.id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatar,
        level: user.level,
        ovr: user.ovr,
        clubName: 'FitHero Club',
        countryCode: '🇷🇺',
        streakDays: user.streak,
        longestStreak: user.streak + 4,
        totalWorkouts: user.level * 8,
        bio: 'Атлет сезонного рейтинга FitHero. Развиваю все 4 дисциплины.',
        stats: currentUserProfile.stats,
        fifaCardTheme: 'gold',
        positionTitle: 'ALL (Универсал)',
        unlockedTrophiesCount: 6,
        followersCount: 150,
        isFollowing: false
      });
    }
  };

  return (
    <div className="space-y-3.5 pb-24 max-w-lg mx-auto">
      {/* Weekly Tournament Bento Header in #D21624 */}
      <div className="bg-[#D21624] text-white rounded-3xl p-5 shadow-2xs relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-red-100 uppercase tracking-widest mb-1">
              <Trophy className="w-3.5 h-3.5 text-white" /> СЕЗОННЫЙ РЕЙТИНГ АТЛЕТОВ
            </div>
            <h2 className="text-base font-black tracking-tight leading-tight text-white">
              Лига Атлетов FitHero
            </h2>
            <p className="text-xs text-red-100 mt-0.5 font-medium">
              Топ-3 атлета недели повышают статус дивизиона
            </p>
          </div>

          <div className="text-right">
            <span className="text-[9px] font-mono font-bold uppercase text-red-100 block">ДО ФИНИША</span>
            <span className="text-sm font-mono font-bold text-white">2 дн. 14 ч.</span>
          </div>
        </div>
      </div>

      {/* League Selection Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {leagues.map((lg) => {
          const isSelected = activeLeague === lg;
          return (
            <button
              key={lg}
              onClick={() => {
                triggerHaptic('light');
                setActiveLeague(lg);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-mono font-bold tracking-tight whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-stone-50'
              }`}
            >
              {lg.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Top 3 Podium Bento Cell */}
      {filteredUsers.length >= 3 && (
        <div className="bg-white rounded-3xl p-5 shadow-2xs">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
            ПЬЕДЕСТАЛ ДИВИЗИОНА (НАЖМИТЕ ДЛЯ ПРОФИЛЯ)
          </h3>

          <div className="flex items-end justify-center gap-2 pt-1 pb-1">
            {/* 2nd Place */}
            <div
              onClick={() => handleUserClick(filteredUsers[1])}
              className="flex-1 flex flex-col items-center text-center cursor-pointer group"
            >
              <div className="relative mb-2">
                <AthleteAvatar
                  src={filteredUsers[1].avatar}
                  name={filteredUsers[1].name}
                  id={filteredUsers[1].id}
                  className="w-12 h-12 rounded-2xl object-cover shadow-2xs group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-stone-200 text-slate-800 text-[10px] font-mono font-black flex items-center justify-center">
                  2
                </span>
              </div>
              <h4 className="text-xs font-black text-slate-900 truncate max-w-[85px] group-hover:text-[#D21624] transition-colors">
                {filteredUsers[1].name.split(' ')[0]}
              </h4>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {filteredUsers[1].ovr} ОБЩ
              </span>
              <div className="w-full h-12 bg-stone-100 rounded-t-2xl mt-2 flex items-center justify-center font-mono font-bold text-slate-500 text-xs">
                #2
              </div>
            </div>

            {/* 1st Place */}
            <div
              onClick={() => handleUserClick(filteredUsers[0])}
              className="flex-1 flex flex-col items-center text-center -mt-3 cursor-pointer group"
            >
              <div className="relative mb-2">
                <AthleteAvatar
                  src={filteredUsers[0].avatar}
                  name={filteredUsers[0].name}
                  id={filteredUsers[0].id}
                  className="w-15 h-15 rounded-3xl object-cover shadow-xs group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-lg bg-slate-900 text-white text-[10px] font-mono font-black flex items-center justify-center">
                  1
                </span>
              </div>
              <h4 className="text-xs font-black text-slate-900 truncate max-w-[95px] group-hover:text-[#D21624] transition-colors">
                {filteredUsers[0].name.split(' ')[0]}
              </h4>
              <span className="text-xs font-mono font-black text-[#D21624]">
                {filteredUsers[0].ovr} ОБЩ
              </span>
              <div className="w-full h-16 bg-slate-900 rounded-t-2xl mt-2 flex items-center justify-center font-mono font-black text-white text-xs">
                #1
              </div>
            </div>

            {/* 3rd Place */}
            <div
              onClick={() => handleUserClick(filteredUsers[2])}
              className="flex-1 flex flex-col items-center text-center cursor-pointer group"
            >
              <div className="relative mb-2">
                <AthleteAvatar
                  src={filteredUsers[2].avatar}
                  name={filteredUsers[2].name}
                  id={filteredUsers[2].id}
                  className="w-12 h-12 rounded-2xl object-cover shadow-2xs group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-stone-200 text-slate-800 text-[10px] font-mono font-black flex items-center justify-center">
                  3
                </span>
              </div>
              <h4 className="text-xs font-black text-slate-900 truncate max-w-[85px] group-hover:text-[#D21624] transition-colors">
                {filteredUsers[2].name.split(' ')[0]}
              </h4>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                {filteredUsers[2].ovr} ОБЩ
              </span>
              <div className="w-full h-9 bg-stone-100 rounded-t-2xl mt-2 flex items-center justify-center font-mono font-bold text-slate-500 text-xs">
                #3
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table List Bento Cell */}
      <div className="bg-white rounded-3xl p-4.5 shadow-2xs space-y-2">
        {filteredUsers.map((user, idx) => {
          const isCurrentUser = user.isCurrentUser;
          return (
            <div
              key={user.id}
              onClick={() => handleUserClick(user)}
              className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer hover:shadow-2xs ${
                isCurrentUser
                  ? 'bg-stone-100 ring-2 ring-[#D21624]/20'
                  : 'bg-stone-50 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 font-mono font-black text-xs text-slate-400 text-center">
                  #{idx + 1}
                </span>

                <AthleteAvatar
                  src={user.avatar}
                  name={user.name}
                  id={user.id}
                  className="w-10 h-10 rounded-2xl object-cover shadow-2xs"
                />

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-slate-900 leading-tight">
                      {user.name}
                    </h4>
                    {isCurrentUser && (
                      <span className="bg-[#D21624] text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-md">
                        ВЫ
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono font-bold text-slate-500">
                    {user.username} • {user.badge}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-black text-slate-900 block">
                  {user.ovr} ОБЩ
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {user.weeklyXp} ОПТ/нед
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
