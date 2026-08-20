import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Flame,
  Dumbbell,
  Activity,
  Zap,
  Brain,
  Shield,
  Sparkles,
  Edit3,
  Check,
  ChevronRight,
  Share2,
  Quote,
  Palette,
  Gift
} from 'lucide-react';
import { UserProfile, Achievement, ActiveTab } from '../types';
import { calculateOvr } from '../data/initialData';
import { triggerHaptic } from '../utils/haptics';
import { openTelegramLink } from '../utils/telegram';
import { TrophyArtBadge } from './TrophyArtBadge';
import { AthleteAvatar } from './AthleteAvatar';
import { FifaCard } from './FifaCard';

interface ProfileViewProps {
  profile: UserProfile;
  achievements: Achievement[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onClaimReward: (achievementId: string) => void;
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

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  achievements,
  onUpdateProfile,
  onNavigateTab,
  onClaimReward
}) => {
  const ovr = calculateOvr(profile);

  // Status/Bio Editing State
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [currentBio, setCurrentBio] = useState(
    profile.bio || 'Стремлюсь к 99 OVR во всех четырех дисциплинах. Тренируюсь каждый день с FitHero.'
  );
  const [bioInput, setBioInput] = useState(currentBio);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const stats = profile.stats || {
    strength: 1,
    endurance: 1,
    agility: 1,
    intellect: 1
  };

  const statItems = [
    { label: 'Сила (СИЛ)', value: stats.strength, icon: Dumbbell, color: 'text-[#D21624]' },
    { label: 'Выносливость (ВЫН)', value: stats.endurance, icon: Activity, color: 'text-[#1664B0]' },
    { label: 'Ловкость (ЛОВ)', value: stats.agility, icon: Zap, color: 'text-amber-500' },
    { label: 'Интеллект (ИНТ)', value: stats.intellect, icon: Brain, color: 'text-indigo-500' }
  ];

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const unclaimedAchievements = achievements.filter((a) => a.unlocked && !a.claimed);
  const totalAchievements = achievements.length;
  const progressPercent = Math.round((unlockedAchievements.length / totalAchievements) * 100);

  const handleSaveBio = (overrideText?: string) => {
    const textToSave = (overrideText !== undefined ? overrideText : bioInput).trim();
    if (!textToSave) return;

    triggerHaptic('success');
    setCurrentBio(textToSave);
    setIsEditingBio(false);
    onUpdateProfile({ bio: textToSave });

    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const handleShareProfile = () => {
    triggerHaptic('medium');
    const shareText = `🔥 Профиль атлета ${profile.name} в FitHero TMA:\n⭐ Рейтинг: ${ovr} ОБЩ (Уровень ${profile.level})\n💬 «${currentBio}»\n🔥 Стрик: ${profile.streakDays} дней | Трофеев: ${unlockedAchievements.length}/${totalAchievements}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: `${profile.name} - FitHero Profile`,
        text: shareText,
        url: shareUrl
      }).catch(() => {
        // Fallback to Telegram share
        const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        openTelegramLink(tgShareUrl);
      });
    } else {
      const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
      openTelegramLink(tgShareUrl);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).catch(() => {});
      }
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Top Profile Hero Card */}
      <div className="bg-white rounded-3xl p-5 shadow-2xs relative overflow-hidden">
        <div className="flex items-start gap-4">
          {/* Avatar with OVR badge */}
          <div className="relative shrink-0">
            <AthleteAvatar
              src={profile.avatarUrl}
              name={profile.name}
              id={profile.id}
              className="w-18 h-18 rounded-2xl object-cover shadow-2xs ring-2 ring-stone-100"
            />
            <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white font-mono font-black text-xs px-2 py-0.5 rounded-xl shadow-xs border border-white/20">
              {ovr} ОБЩ
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">{profile.countryCode || '🇷🇺'}</span>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase truncate">
                {profile.clubName || 'Telegram Fit Club'}
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 leading-tight truncate mt-0.5">
              {profile.name}
            </h2>
            <p className="text-xs font-mono font-bold text-[#D21624]">
              {profile.username}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="bg-stone-100 text-slate-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg">
                УР. {profile.level}
              </span>
              <span className="bg-stone-100 text-slate-600 text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg truncate">
                {profile.positionTitle || 'ALL (Новичок)'}
              </span>
            </div>
          </div>
        </div>

        {/* Bio / Status Section */}
        <div className="mt-4 pt-3.5 border-t border-stone-100">
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

        {/* Quick Numbers Bar */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-stone-100 text-center">
          <div className="bg-stone-50 rounded-2xl p-2.5">
            <span className="text-[9px] font-mono text-slate-400 uppercase block">Стрик</span>
            <span className="text-sm font-mono font-black text-[#D21624] flex items-center justify-center gap-0.5 mt-0.5">
              <Flame className="w-3.5 h-3.5" /> {profile.streakDays} дн
            </span>
          </div>
          <div className="bg-stone-50 rounded-2xl p-2.5">
            <span className="text-[9px] font-mono text-slate-400 uppercase block">Тренировок</span>
            <span className="text-sm font-mono font-black text-slate-900 mt-0.5">
              {profile.totalWorkouts}
            </span>
          </div>
          <div className="bg-stone-50 rounded-2xl p-2.5">
            <span className="text-[9px] font-mono text-slate-400 uppercase block">Трофеев</span>
            <span className="text-sm font-mono font-black text-slate-900 mt-0.5">
              {unlockedAchievements.length}/{totalAchievements}
            </span>
          </div>
        </div>
      </div>

      {/* Main Hub Portals: Карточка & Награды */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Portal 1: Карточка Атлета */}
        <button
          onClick={() => {
            triggerHaptic('medium');
            onNavigateTab('fifa_card');
          }}
          className="bg-white hover:bg-stone-50 border border-stone-100 rounded-3xl p-4.5 text-left shadow-2xs transition-all active:scale-[0.98] group flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-amber-400 shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
              <span>Студия</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-black text-slate-900">Карточка атлета</h3>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-black px-1.5 py-0.2 rounded-md">
                {ovr} OVR
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Кастомизация скинов, темы, позиции и экспорт карточки
            </p>
          </div>
        </button>

        {/* Portal 2: Награды и Трофеи */}
        <button
          onClick={() => {
            triggerHaptic('medium');
            onNavigateTab('achievements');
          }}
          className="bg-white hover:bg-stone-50 border border-stone-100 rounded-3xl p-4.5 text-left shadow-2xs transition-all active:scale-[0.98] group flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D21624] to-red-700 flex items-center justify-center text-white shadow-xs relative">
              <Trophy className="w-5 h-5" />
              {unclaimedAchievements.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-white animate-pulse" />
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-400 group-hover:text-slate-900 transition-colors">
              <span>Зал славы</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-black text-slate-900">Награды и Трофеи</h3>
              {unclaimedAchievements.length > 0 && (
                <span className="bg-red-100 text-[#D21624] text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md animate-bounce">
                  +{unclaimedAchievements.length}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {unlockedAchievements.length} из {totalAchievements} открыто ({progressPercent}%)
            </p>
          </div>
        </button>
      </div>

      {/* Athletic Attributes Section */}
      <div className="bg-white rounded-3xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-600" /> АТЛЕТИЧЕСКИЕ ХАРАКТЕРИСТИКИ
          </h3>
          <span className="text-[10px] font-mono font-bold text-slate-400">
            МАКС. 99
          </span>
        </div>

        <div className="space-y-3">
          {statItems.map((st) => {
            const Icon = st.icon;
            return (
              <div key={st.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 font-bold text-slate-700">
                    <Icon className={`w-3.5 h-3.5 ${st.color}`} /> {st.label}
                  </span>
                  <span className="font-black text-slate-900">{st.value}/99</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-slate-900"
                    style={{ width: `${Math.min(100, Math.max(1, st.value))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unlocked Trophies Showcase Preview */}
      <div className="bg-white rounded-3xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#D21624]" /> ЗАЛ СЛАВЫ
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Разблокированные трофеи и коллекция
            </p>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light');
              onNavigateTab('achievements');
            }}
            className="text-[10px] font-mono font-bold text-[#1664B0] hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-xl transition-colors"
          >
            Смотреть все →
          </button>
        </div>

        {unlockedAchievements.length === 0 ? (
          <div className="text-center py-6 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
            <Trophy className="w-8 h-8 text-stone-300 mx-auto mb-1.5" />
            <p className="text-xs text-slate-600 font-bold">Пока нет открытых наград</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Выполняйте тренировки, чтобы открыть первые трофеи
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5">
            {unlockedAchievements.slice(0, 6).map((ach) => (
              <div
                key={ach.id}
                onClick={() => {
                  triggerHaptic('light');
                  onNavigateTab('achievements');
                }}
                className="bg-stone-50 hover:bg-stone-100 rounded-2xl p-2.5 flex flex-col items-center text-center shadow-2xs cursor-pointer transition-all active:scale-95"
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

      {/* Share / Profile Action */}
      <button
        onClick={handleShareProfile}
        className="w-full py-3 rounded-2xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs bg-stone-100 hover:bg-stone-200 text-slate-800 active:scale-98"
      >
        {copiedShare ? (
          <>
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700">Текст профиля скопирован!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4 text-slate-600" />
            <span>Поделиться карточкой и профилем</span>
          </>
        )}
      </button>
    </div>
  );
};
