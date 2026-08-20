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
  Edit3,
  Check,
  Share2,
  Quote
} from 'lucide-react';
import { PublicUserProfile, Achievement } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { TrophyArtBadge } from './TrophyArtBadge';
import { AthleteAvatar } from './AthleteAvatar';
import confetti from 'canvas-confetti';

interface UserProfileModalProps {
  user: PublicUserProfile;
  achievementsList?: Achievement[];
  onClose: () => void;
  onFollowToggle?: (userId: string) => void;
  isCurrentUser?: boolean;
  onUpdateBio?: (newBio: string) => void;
  onOpenCardStudio?: () => void;
}

const STATUS_PRESETS = [
  '🎯 Стремлюсь к 99 OVR в 4 дисциплинах',
  '🔥 Дисциплина каждый день без компромиссов',
  '⚡ Быстрее, сильнее, умнее с каждым днем',
  '🏋️‍♂️ Силовой прогресс и стальной характер',
  '🧘 Внутренний баланс и чистый разум',
  '🏆 Строю лучшую версию себя с FitHero',
  '🚀 Только вперед к вершине лидерборда',
  '💪 100 отжиманий каждое утро — мой стандарт'
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  achievementsList = [],
  onClose,
  onFollowToggle,
  isCurrentUser = false,
  onUpdateBio,
  onOpenCardStudio
}) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [followers, setFollowers] = useState(user.followersCount || 100);
  const [cheered, setCheered] = useState(false);
  const [challenged, setChallenged] = useState(false);

  // Status/Bio Editing State
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [currentBio, setCurrentBio] = useState(
    user.bio || 'Стремлюсь к 99 OVR во всех четырех дисциплинах. Тренируюсь каждый день с FitHero.'
  );
  const [bioInput, setBioInput] = useState(currentBio);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

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

  const handleSaveBio = (overrideText?: string) => {
    const textToSave = (overrideText !== undefined ? overrideText : bioInput).trim();
    if (!textToSave) return;

    triggerHaptic('success');
    setCurrentBio(textToSave);
    setIsEditingBio(false);

    if (onUpdateBio) {
      onUpdateBio(textToSave);
    }

    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const handleShareProfile = () => {
    triggerHaptic('medium');
    const shareText = `Профиль атлета ${user.name} в FitHero TMA:\n⭐ Рейтинг: ${user.ovr} ОБЩ (Уровень ${user.level})\n💬 «${currentBio}»\n🔥 Стрик: ${user.streakDays} дней | Трофеев: ${userTrophies.length}`;

    if (navigator.share) {
      navigator.share({
        title: `${user.name} - Профиль FitHero`,
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
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

          {/* Bio / Status Section */}
          <div className="mt-3.5 pt-3 border-t border-stone-100">
            {isCurrentUser ? (
              <div>
                {!isEditingBio ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Quote className="w-3 h-3 text-[#1664B0]" /> СТАТУС В ПРОФИЛЕ
                      </span>
                      <button
                        onClick={() => {
                          triggerHaptic('light');
                          setBioInput(currentBio);
                          setIsEditingBio(true);
                        }}
                        className="text-[10px] font-mono font-bold text-[#1664B0] hover:text-blue-800 flex items-center gap-1 py-0.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Изменить статус</span>
                      </button>
                    </div>

                    <p
                      onClick={() => {
                        triggerHaptic('light');
                        setBioInput(currentBio);
                        setIsEditingBio(true);
                      }}
                      className="text-xs text-slate-700 font-medium italic leading-relaxed cursor-pointer hover:text-slate-900 transition-all bg-stone-50/80 hover:bg-stone-100 p-2.5 rounded-2xl border border-dashed border-stone-200"
                      title="Нажмите, чтобы изменить статус"
                    >
                      «{currentBio}»
                    </p>

                    {showSavedToast && (
                      <div className="text-[10px] font-mono font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                        <Check className="w-3 h-3" /> Статус успешно обновлен!
                      </div>
                    )}
                  </div>
                ) : (
                  /* Active Inline Status Editor */
                  <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 space-y-2.5 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-700 uppercase flex items-center gap-1">
                        <Edit3 className="w-3 h-3 text-[#D21624]" /> Ваш статус атлета
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">
                        {bioInput.length}/140
                      </span>
                    </div>

                    <textarea
                      value={bioInput}
                      onChange={(e) => setBioInput(e.target.value.slice(0, 140))}
                      rows={2}
                      placeholder="Напишите свой статус или девиз..."
                      className="w-full px-3 py-2 rounded-xl bg-white text-xs font-medium text-slate-900 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#D21624]/20 resize-none shadow-2xs"
                      autoFocus
                    />

                    {/* Quick Preset Badges */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-400 block">Быстрые варианты:</span>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto no-scrollbar">
                        {STATUS_PRESETS.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              triggerHaptic('light');
                              setBioInput(preset);
                            }}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-lg transition-all text-left ${
                              bioInput === preset
                                ? 'bg-slate-900 text-white font-bold'
                                : 'bg-white hover:bg-stone-200 text-slate-700 border border-stone-200'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('light');
                          setIsEditingBio(false);
                        }}
                        className="flex-1 py-1.5 rounded-xl bg-stone-200 text-slate-700 text-xs font-mono font-bold hover:bg-stone-300 transition-all"
                      >
                        Отмена
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveBio()}
                        className="flex-1 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono font-bold hover:bg-black shadow-2xs transition-all flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Сохранить
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Public profile view */
              user.bio && (
                <p className="text-xs text-slate-600 font-medium italic leading-relaxed">
                  «{user.bio}»
                </p>
              )
            )}
          </div>

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

          {/* Action Buttons for current user */}
          {isCurrentUser ? (
            <div className="grid grid-cols-2 gap-2 mt-3.5 pt-2">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setBioInput(currentBio);
                  setIsEditingBio((prev) => !prev);
                }}
                className="py-2.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs bg-stone-100 hover:bg-stone-200 text-slate-800 active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#1664B0]" />
                {isEditingBio ? 'Скрыть редактор' : 'Изменить статус'}
              </button>

              <button
                onClick={() => {
                  triggerHaptic('medium');
                  onClose();
                  if (onOpenCardStudio) onOpenCardStudio();
                }}
                className="py-2.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs bg-slate-900 hover:bg-black text-white active:scale-95"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Карточка атлета
              </button>
            </div>
          ) : (
            /* Action Buttons for non-current user */
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
