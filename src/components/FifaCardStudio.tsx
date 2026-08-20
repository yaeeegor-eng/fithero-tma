import React, { useState } from 'react';
import { Download, Share2, Sparkles, Check, Image as ImageIcon, Edit3, Award, Lock, Shield, ChevronRight, Upload, RefreshCw, Camera } from 'lucide-react';
import { UserProfile } from '../types';
import { FifaCard } from './FifaCard';
import { PRESET_AVATARS } from '../data/initialData';
import { generateFifaCardPng } from '../utils/cardRenderer';
import { triggerHaptic } from '../utils/haptics';
import { CARD_TIERS, getTierByLevel, resolveTierForProfile } from '../utils/cardTierUtils';
import { getTelegramUser } from '../utils/telegram';
import confetti from 'canvas-confetti';

interface FifaCardStudioProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export const FifaCardStudio: React.FC<FifaCardStudioProps> = ({ profile, onUpdateProfile }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editName, setEditName] = useState(profile.name);
  const [editClub, setEditClub] = useState(profile.clubName);
  const [editPosition, setEditPosition] = useState(profile.positionTitle);
  const [editCountry, setEditCountry] = useState(profile.countryCode || '🇷🇺');
  const [editBio, setEditBio] = useState(profile.bio || 'Стремлюсь к 99 OVR во всех четырех дисциплинах. Тренируюсь каждый день с FitHero.');

  const openEditModal = () => {
    setEditName(profile.name);
    setEditClub(profile.clubName);
    setEditPosition(profile.positionTitle);
    setEditCountry(profile.countryCode || '🇷🇺');
    setEditBio(profile.bio || 'Стремлюсь к 99 OVR во всех четырех дисциплинах. Тренируюсь каждый день с FitHero.');
    setShowEditModal(true);
  };

  const currentTier = resolveTierForProfile(profile);
  const userTierByLevel = getTierByLevel(profile.level);

  // Available theme options with required level checks (10 levels per card tier)
  const themeOptions: Array<{
    id: UserProfile['fifaCardTheme'];
    name: string;
    levelReq: number;
    color: string;
    desc: string;
    isAuto?: boolean;
  }> = [
    {
      id: 'auto',
      name: `⚡ Авто-эволюция: ${userTierByLevel.tierName}`,
      levelReq: 1,
      color: userTierByLevel.badgeBg,
      desc: 'Автоматически повышает ранг каждые 10 уровней',
      isAuto: true
    },
    {
      id: 'bronze',
      name: CARD_TIERS.bronze.tierName,
      levelReq: CARD_TIERS.bronze.minLevel,
      color: 'bg-[#78350F]',
      desc: 'Бронзовый стиль атлета (Уровни 1–10)'
    },
    {
      id: 'silver',
      name: CARD_TIERS.silver.tierName,
      levelReq: CARD_TIERS.silver.minLevel,
      color: 'bg-slate-400',
      desc: 'Серебряный хромированный ранг (Уровни 11–20)'
    },
    {
      id: 'gold',
      name: CARD_TIERS.gold.tierName,
      levelReq: CARD_TIERS.gold.minLevel,
      color: 'bg-amber-400',
      desc: 'Золотая элитная чемпионская карта (Уровни 21–30)'
    },
    {
      id: 'diamond',
      name: CARD_TIERS.diamond.tierName,
      levelReq: CARD_TIERS.diamond.minLevel,
      color: 'bg-[#1664B0]',
      desc: 'Алмазный ультрамариновый сапфир (Уровни 31–40)'
    },
    {
      id: 'red_icon',
      name: CARD_TIERS.red_icon.tierName,
      levelReq: CARD_TIERS.red_icon.minLevel,
      color: 'bg-[#D21624]',
      desc: 'Легендарная карта FitHero Master (Уровни 41–50)'
    },
    {
      id: 'mythic',
      name: CARD_TIERS.mythic.tierName,
      levelReq: CARD_TIERS.mythic.minLevel,
      color: 'bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500',
      desc: 'Обсидиановый 99 OVR статус (Уровень 50 MAX)'
    }
  ];

  const handleDownloadCard = async () => {
    try {
      setIsExporting(true);
      triggerHaptic('medium');

      const pngData = await generateFifaCardPng(profile, 'fifa-card-preview');
      const link = document.createElement('a');
      link.download = `FitHero_Card_${profile.name.replace(/\s+/g, '_')}.png`;
      link.href = pngData;
      link.click();

      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 }
      });
      triggerHaptic('success');
    } catch (err) {
      console.error('Failed to export card', err);
      triggerHaptic('error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareTelegram = () => {
    triggerHaptic('success');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    const text = `Моя карточка атлета в FitHero TMA:\nРанг: ${currentTier.tierName} (Ур. ${profile.level})\nСИЛ: ${profile.stats.strength} | ВЫН: ${profile.stats.endurance} | ЛОВ: ${profile.stats.agility} | ИНТ: ${profile.stats.intellect}\nСтрик: ${profile.streakDays} дней!`;
    
    if (navigator.share) {
      navigator.share({
        title: `FitHero Карточка Атлета - ${profile.name}`,
        text: text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 3000);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName,
      clubName: editClub,
      positionTitle: editPosition,
      countryCode: editCountry,
      bio: editBio
    });
    setShowEditModal(false);
    triggerHaptic('success');
  };

  return (
    <div className="space-y-4 pb-24 max-w-lg mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-5 shadow-2xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#D21624] uppercase tracking-wider mb-0.5">
            <Award className="w-4 h-4" /> СТУДИЯ КАРТОЧКИ АТЛЕТА
          </div>
          <h2 className="text-base font-black text-slate-900 leading-snug">
            Карточка игрока
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Стиль карты эволюционирует с ростом твоего уровня
          </p>
        </div>

        <button
          onClick={() => {
            triggerHaptic('light');
            openEditModal();
          }}
          className="flex items-center gap-1 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-mono font-bold px-3.5 py-2.5 rounded-2xl transition-all active:scale-95 shrink-0"
        >
          <Edit3 className="w-3.5 h-3.5" /> Настроить
        </button>
      </div>

      {/* Card Visualizer Showcase */}
      <div className="py-2 flex flex-col items-center">
        <FifaCard profile={profile} />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={handleDownloadCard}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-3.5 px-4 rounded-2xl font-mono text-xs font-bold shadow-2xs active:scale-98 transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Сохранение...' : 'Скачать карту'}
        </button>

        <button
          onClick={handleShareTelegram}
          className="flex items-center justify-center gap-2 bg-[#1664B0] hover:bg-blue-800 text-white py-3.5 px-4 rounded-2xl font-mono text-xs font-bold shadow-2xs active:scale-98 transition-all"
        >
          <Share2 className="w-4 h-4" />
          {copiedNotification ? 'Скопировано!' : 'Поделиться'}
        </button>
      </div>

      {/* Level Progression Status Bento Cell */}
      <div className="bg-white rounded-3xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              ТЕКУЩИЙ РАНГ КАРТОЧКИ
            </span>
            <h3 className="text-sm font-black text-slate-900">
              {currentTier.tierName}
            </h3>
          </div>
          <div className="text-right">
            <span className="bg-stone-100 text-slate-900 font-mono font-black text-xs px-2.5 py-1 rounded-xl">
              {profile.level >= 50 ? 'УР. 50 (MAX)' : `УР. ${profile.level} / 50`}
            </span>
          </div>
        </div>

        {/* Level Progression Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono font-bold text-slate-500">
            <span>{profile.level >= 50 ? 'Достигнут абсолютный максимум!' : 'Прогресс до следующего уровня'}</span>
            <span>{profile.level >= 50 ? 'MAX LVL' : `${profile.currentXp} / ${profile.maxXp} XP`}</span>
          </div>
          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D21624] rounded-full transition-all duration-500"
              style={{ width: `${profile.level >= 50 ? 100 : Math.min(100, (profile.currentXp / profile.maxXp) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Theme & Tier Picker */}
      <div className="bg-white rounded-3xl p-5 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
            СТИЛИ & РАНГИ КАРТЫ
          </h3>
          <span className="text-[10px] font-mono font-bold text-slate-400">
            Разблокировано: {themeOptions.filter((t) => profile.level >= t.levelReq).length}/{themeOptions.length}
          </span>
        </div>

        <div className="space-y-2">
          {themeOptions.map((t) => {
            const isUnlocked = profile.level >= t.levelReq;
            const isSelected = profile.fifaCardTheme === t.id || (!profile.fifaCardTheme && t.id === 'auto');

            return (
              <button
                key={t.id}
                disabled={!isUnlocked}
                onClick={() => {
                  if (!isUnlocked) {
                    triggerHaptic('error');
                    return;
                  }
                  triggerHaptic('light');
                  onUpdateProfile({ fifaCardTheme: t.id });
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? 'border-slate-900 bg-stone-50 ring-1 ring-slate-900 shadow-2xs'
                    : isUnlocked
                    ? 'border-stone-100 hover:bg-stone-50'
                    : 'border-stone-100 opacity-50 bg-stone-50/50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl ${t.color} shadow-xs shrink-0 flex items-center justify-center`}>
                    {!isUnlocked && <Lock className="w-3.5 h-3.5 text-white/80" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900 truncate">
                        {t.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#D21624] shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {t.desc}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  {!isUnlocked ? (
                    <span className="text-[9px] font-mono font-bold bg-stone-200 text-slate-600 px-2 py-0.5 rounded-lg">
                      с {t.levelReq} ур.
                    </span>
                  ) : isSelected ? (
                    <span className="text-[9px] font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded-lg">
                      АКТИВЕН
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Avatar Presets Selection */}
      <div className="bg-white rounded-3xl p-5 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
            ФОТО / АВАТАР АТЛЕТА
          </h3>
          {(() => {
            const tg = getTelegramUser();
            if (tg && tg.photo_url) {
              return (
                <button
                  onClick={() => {
                    triggerHaptic('success');
                    onUpdateProfile({ avatarUrl: tg.photo_url, avatarPreset: 'telegram' });
                  }}
                  className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#1664B0] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-xl transition-all"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Фото из Telegram</span>
                </button>
              );
            }
            return null;
          })()}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {PRESET_AVATARS.map((item) => {
            const isSelected = profile.avatarUrl === item.url;
            return (
              <button
                key={item.id}
                onClick={() => {
                  triggerHaptic('light');
                  onUpdateProfile({ avatarUrl: item.url, avatarPreset: item.id });
                }}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all p-1 bg-stone-50 ${
                  isSelected
                    ? 'border-slate-900 scale-105 shadow-2xs ring-2 ring-slate-900/10'
                    : 'border-stone-100 opacity-80 hover:opacity-100'
                }`}
              >
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-xl"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Upload Custom Avatar */}
        <label className="flex items-center justify-center gap-2 w-full py-2.5 border-2 border-dashed border-stone-200 hover:border-slate-900 rounded-2xl cursor-pointer text-xs font-mono font-bold text-slate-600 hover:text-slate-900 transition-all bg-stone-50/50">
          <Upload className="w-3.5 h-3.5" />
          <span>Загрузить своё фото для карточки</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  if (event.target?.result) {
                    triggerHaptic('success');
                    onUpdateProfile({
                      avatarUrl: event.target.result as string,
                      avatarPreset: 'custom'
                    });
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </label>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-black text-slate-900 mb-1">
              Редактирование карточки
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">
              Измените отображаемые на карточке данные атлета
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">Имя атлета</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D21624]/20"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-slate-700 block mb-1">Клуб / Команда</label>
                <input
                  type="text"
                  value={editClub}
                  onChange={(e) => setEditClub(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D21624]/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-mono font-bold text-slate-700 block mb-1">Позиция</label>
                  <input
                    type="text"
                    value={editPosition}
                    onChange={(e) => setEditPosition(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D21624]/20"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-mono font-bold text-slate-700 block mb-1">Флаг страны</label>
                  <input
                    type="text"
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D21624]/20"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono font-bold text-slate-700 block">Статус / О себе (Bio)</label>
                  <span className="text-[10px] font-mono text-slate-400">{editBio.length}/140</span>
                </div>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value.slice(0, 140))}
                  rows={2}
                  placeholder="Ваш личный девиз или статус атлета..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D21624]/20 resize-none"
                  required
                />
                
                {/* Fast Bio Presets */}
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {[
                    '🎯 Стремлюсь к 99 OVR',
                    '🔥 Дисциплина каждый день',
                    '⚡ Быстрее, сильнее, умнее',
                    '🏆 Строю лучшую версию себя'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        setEditBio(preset);
                      }}
                      className="text-[10px] font-mono bg-stone-100 hover:bg-stone-200 text-slate-700 px-2 py-0.5 rounded-lg transition-colors truncate max-w-full"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-stone-100 text-slate-700 text-xs font-mono font-bold hover:bg-stone-200 transition-all"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-mono font-bold hover:bg-black shadow-2xs transition-all"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
