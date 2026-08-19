import React, { useState } from 'react';
import {
  X,
  Flame,
  Trophy,
  Dumbbell,
  Activity,
  Zap,
  Brain,
  Shield,
  UserPlus,
  UserCheck,
  Award,
  Sparkles,
  Swords,
  Heart
} from 'lucide-react';
import { PublicUserProfile, Achievement } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { TrophyArtBadge } from './TrophyArtBadge';
import { AthleteAvatar } from './AthleteAvatar';
import { calculateOvr } from '../data/initialData';

interface UserProfileModalProps {
  user: PublicUserProfile;
  achievementsList?: Achievement[];
  onClose: () => void;
  onFollowToggle?: (userId: string) => void;
  isCurrentUser?: boolean;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  achievementsList = [],
  onClose,
  onFollowToggle,
  isCurrentUser = false
}) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [followers, setFollowers] = useState(user.followersCount || 100);
  const [cheered, setCheered] = useState(false);
  const [challenged, setChallenged] = useState(false);

  const stats = user.stats || {
    strength: 75,
    endurance: 75,
    agility: 75,
    intellect: 75
  };

  const statItems = [
    { label: 'Сила (СИЛ)', value: stats.strength, color: '#D21624', icon: Dumbbell },
    { label: 'Выносливость (ВЫН)', value: stats.endurance, color: '#1664B0', icon: Activity },
    { label: 'Ловкость (ЛОВ)', value: stats.agility, color: '#0F172A', icon: Zap },
    { label: 'Интеллект (ИНТ)', value: stats.intellect, color: '#475569', icon: Brain }
  ];

  // User achievements to showcase
  const userTrophies = (user.achievements || achievementsList).filter((a) => a.unlocked);

  const handleFollow = () => {
    triggerHaptic('medium');
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setFollowers((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));
    if (onFollowToggle) onFollowToggle(user.id);
  };

  const handleCheer = () => {
    triggerHaptic('success');
    setCheered(true);
    setTimeout(() => setCheered(false), 2500);
  };

  const handleChallenge = () => {
    triggerHaptic('heavy');
    setChallenged(true);
    setTimeout(() => setChallenged(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FCFAF7] rounded-3xl p-5 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto no-scrollbar relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-slate-600 active:scale-95 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-5 shadow-2xs relative overflow-hidden mb-3.5">
          <div className="flex items-start gap-4">
            {/* Avatar with OVR Badge */}
            <div className="relative shrink-0">
              <AthleteAvatar
                src={user.avatarUrl}
                name={user.name}
                id={user.id}
                className="w-18 h-18 rounded-2xl object-cover shadow-2xs ring-2 ring-stone-100"
              />
              <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white font-mono font-black text-xs px-2 py-0.5 rounded-xl shadow-xs border border-white/20">
                {user.ovr} ОБЩ
              </div>
            </div>

            {/* Name & Club Info */}
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">{user.countryCode}</span>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase truncate">
                  {user.clubName}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 leading-tight truncate mt-0.5">
                {user.name}
              </h2>
              <p className="text-xs font-mono font-bold text-[#D21624]">
                {user.username}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="bg-stone-100 text-slate-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg">
                  УР. {user.level}
                </span>
                <span className="bg-stone-100 text-slate-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg">
                  {user.positionTitle}
                </span>
              </div>
            </div>
          </div>

          {/* Bio text */}
          {user.bio && (
            <p className="text-xs text-slate-600 font-medium mt-3.5 pt-3 border-t border-stone-100 italic leading-relaxed">
              «{user.bio}»
            </p>
          )}

          {/* Key Metrics Row */}
          <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-stone-100 text-center">
            <div className="bg-stone-50 rounded-2xl p-2">
              <span className="text-[9px] font-mono text-slate-400 uppercase block">Стрик</span>
              <span className="text-sm font-mono font-black text-[#D21624] flex items-center justify-center gap-0.5">
                <Flame className="w-3.5 h-3.5" /> {user.streakDays} дн
              </span>
            </div>
            <div className="bg-stone-50 rounded-2xl p-2">
              <span className="text-[9px] font-mono text-slate-400 uppercase block">Тренировок</span>
              <span className="text-sm font-mono font-black text-slate-900">
                {user.totalWorkouts}
              </span>
            </div>
            <div className="bg-stone-50 rounded-2xl p-2">
              <span className="text-[9px] font-mono text-slate-400 uppercase block">Подписчики</span>
              <span className="text-sm font-mono font-black text-slate-900">
                {followers}
              </span>
            </div>
          </div>

          {/* Action Buttons for non-current user */}
          {!isCurrentUser && (
            <div className="grid grid-cols-3 gap-2 mt-3.5 pt-2">
              <button
                onClick={handleFollow}
                className={`py-2.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 ${
                  isFollowing
                    ? 'bg-stone-100 text-slate-700 hover:bg-stone-200'
                    : 'bg-[#D21624] hover:bg-red-700 text-white'
                }`}
              >
                {isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                {isFollowing ? 'В друзьях' : 'Подписка'}
              </button>

              <button
                onClick={handleCheer}
                className={`py-2.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 ${
                  cheered
                    ? 'bg-emerald-500 text-white'
                    : 'bg-stone-100 text-slate-800 hover:bg-stone-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {cheered ? 'Респект!' : 'Респект'}
              </button>

              <button
                onClick={handleChallenge}
                className={`py-2.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 ${
                  challenged
                    ? 'bg-purple-600 text-white'
                    : 'bg-stone-100 text-slate-800 hover:bg-stone-200'
                }`}
              >
                <Swords className="w-3.5 h-3.5" />
                {challenged ? 'Вызов отправлен' : 'Дуэль'}
              </button>
            </div>
          )}
        </div>

        {/* 4 Core Athletic Stats Bento */}
        <div className="bg-white rounded-3xl p-5 shadow-2xs mb-3.5">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-600" /> АТЛЕТИЧЕСКИЕ ХАРАКТЕРИСТИКИ
          </h3>

          <div className="space-y-3">
            {statItems.map((st) => {
              const Icon = st.icon;
              return (
                <div key={st.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 font-bold text-slate-700">
                      <Icon className="w-3.5 h-3.5 text-slate-400" /> {st.label}
                    </span>
                    <span className="font-black text-slate-900">{st.value}/99</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-slate-900"
                      style={{ width: `${Math.min(100, st.value)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unlocked Trophies & Bespoke Skins */}
        <div className="bg-white rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#D21624]" /> ЗАЛ СЛАВЫ ({userTrophies.length})
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              НАГРАДЫ И ДОСТИЖЕНИЯ
            </span>
          </div>

          {userTrophies.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs font-mono">
              Пока нет разблокированных трофеев
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              {userTrophies.slice(0, 6).map((ach) => (
                <div
                  key={ach.id}
                  className="bg-stone-50 rounded-2xl p-2.5 flex flex-col items-center text-center shadow-2xs group hover:bg-stone-100 transition-all"
                >
                  <TrophyArtBadge achievement={ach} size="sm" showLockOverlay={false} />
                  <span className="text-[10px] font-black text-slate-900 mt-1.5 truncate max-w-full leading-tight">
                    {ach.title}
                  </span>
                  <span className="text-[8px] font-mono font-bold text-[#D21624] truncate max-w-full">
                    {ach.skin?.skinBadge || ach.tier.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
