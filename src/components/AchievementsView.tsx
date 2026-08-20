import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Flame,
  Dumbbell,
  Activity,
  Zap,
  Brain,
  Gift,
  X,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { Achievement, UserProfile } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { TrophyArtBadge } from './TrophyArtBadge';

interface AchievementsViewProps {
  achievements: Achievement[];
  profile: UserProfile;
  onClaimReward: (achievementId: string) => void;
  onBack?: () => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  achievements,
  profile,
  onClaimReward,
  onBack
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inspectedAchievement, setInspectedAchievement] = useState<Achievement | null>(null);

  const totalCount = achievements.length;
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const unclaimedCount = achievements.filter((a) => a.unlocked && !a.claimed).length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const categories = [
    { id: 'all', label: 'Все ранги', icon: Trophy },
    { id: 'strength', label: 'Сила', icon: Dumbbell },
    { id: 'endurance', label: 'Выносливость', icon: Activity },
    { id: 'agility', label: 'Ловкость', icon: Zap },
    { id: 'intellect', label: 'Интеллект', icon: Brain },
    { id: 'streaks', label: 'Стрики', icon: Flame }
  ];

  const filteredAchievements = achievements.filter(
    (a) => selectedCategory === 'all' || a.category === selectedCategory
  );

  const getTierDetails = (tier: Achievement['tier']) => {
    switch (tier) {
      case 'diamond':
        return { label: 'АЛМАЗ', bgBadge: 'bg-slate-900 text-white' };
      case 'gold':
        return { label: 'ЗОЛОТО', bgBadge: 'bg-slate-900 text-white' };
      case 'silver':
        return { label: 'СЕРЕБРО', bgBadge: 'bg-stone-200 text-slate-800' };
      default:
        return { label: 'БРОНЗА', bgBadge: 'bg-stone-100 text-slate-700' };
    }
  };

  const getStatLabel = (stat: string) => {
    switch (stat.toLowerCase()) {
      case 'strength': return 'СИЛ';
      case 'endurance': return 'ВЫН';
      case 'agility': return 'ЛОВ';
      case 'intellect': return 'ИНТ';
      default: return stat.toUpperCase();
    }
  };

  return (
    <div className="space-y-3.5 pb-24 max-w-lg mx-auto">
      {/* Top Bento Header in #D21624 */}
      <div className="bg-[#D21624] text-white rounded-3xl p-5 shadow-2xs relative overflow-hidden">
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-start gap-3">
            {onBack && (
              <button
                onClick={() => {
                  triggerHaptic('light');
                  onBack();
                }}
                className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white active:scale-95 transition-all shrink-0 mt-0.5"
                title="Назад в Профиль"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-100 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-white" /> ЗАЛ СЛАВЫ АТЛЕТА
              </span>
              <h2 className="text-xl font-black tracking-tight mt-1 text-white">
                Трофеи и Достижения
              </h2>
              <p className="text-xs text-red-100 mt-0.5 font-medium">
                Каждый трофей обладает уникальным коллекционным арт-скином и бонусами
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-3xl font-mono font-black text-white leading-none block">
              {unlockedCount}/{totalCount}
            </span>
            <span className="text-[9px] font-mono font-bold text-red-100 uppercase tracking-wider">
              {progressPercent}% ОТКРЫТО
            </span>
          </div>
        </div>

        {/* Precision Progress Bar */}
        <div className="mt-4 pt-3 border-t border-red-500/40 flex items-center gap-3">
          <div className="flex-1 h-2 bg-red-950/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {unclaimedCount > 0 && (
            <span className="bg-white text-[#D21624] text-[9px] font-mono font-bold px-2.5 py-1 rounded-xl shrink-0 shadow-xs">
              +{unclaimedCount} ДОСТУПНО
            </span>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                triggerHaptic('light');
                setSelectedCategory(cat.id);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-stone-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Achievements Bento List */}
      <div className="space-y-3.5">
        {filteredAchievements.map((ach) => {
          const tier = getTierDetails(ach.tier);
          const percent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));
          const canClaim = ach.unlocked && !ach.claimed;
          const skin = ach.skin;

          return (
            <div
              key={ach.id}
              onClick={() => {
                triggerHaptic('light');
                setInspectedAchievement(ach);
              }}
              className={`bg-white rounded-3xl p-4.5 shadow-2xs transition-all relative overflow-hidden cursor-pointer ${
                ach.claimed
                  ? 'bg-stone-50/70'
                  : ach.unlocked
                  ? 'hover:shadow-xs'
                  : 'opacity-85'
              }`}
            >
              {/* Card Header & Artwork Showcase */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-3.5">
                  {/* Bespoke Trophy Art Badge */}
                  <TrophyArtBadge achievement={ach} size="md" />

                  <div>
                    {/* Skin Tag & Tier */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-md bg-stone-100 text-slate-800">
                        {skin ? skin.skinBadge : tier.label}
                      </span>
                      {skin?.rarity && (
                        <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">
                          • {skin.rarity}
                        </span>
                      )}
                      {ach.claimed && (
                        <span className="text-[9px] font-mono font-bold text-slate-600 bg-stone-100 px-2 py-0.5 rounded-md">
                          ПОЛУЧЕНО
                        </span>
                      )}
                    </div>

                    {/* Achievement Title & Unique Skin Name */}
                    <h3 className="text-sm font-black text-slate-900 mt-0.5 leading-tight">
                      {ach.title}
                    </h3>
                    {skin && (
                      <p className="text-[11px] font-mono font-bold text-[#D21624] tracking-tight">
                        {skin.skinName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rewards Tag */}
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-900 bg-stone-100 px-2.5 py-1 rounded-xl block shadow-2xs">
                    +{ach.rewardXp} ОПТ
                  </span>
                  {ach.statReward && (
                    <span className="text-[10px] font-mono font-bold text-slate-500 block mt-1">
                      +{ach.statReward.amount} {getStatLabel(ach.statReward.stat)}
                    </span>
                  )}
                </div>
              </div>

              {/* Skin Lore Quote */}
              {skin?.skinLore && (
                <p className="text-xs text-slate-600 font-medium my-2 bg-stone-50 p-2.5 rounded-2xl italic leading-relaxed">
                  «{skin.skinLore}»
                </p>
              )}

              {/* Progress Track */}
              <div className="space-y-1.5 mt-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
                  <span>ПРОГРЕСС:</span>
                  <span>
                    {ach.progress} / {ach.maxProgress} {ach.unit} ({percent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-slate-900"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Claim Reward Button or Inspect Prompt */}
              {canClaim ? (
                <div className="mt-3.5 pt-3 border-t border-stone-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic('success');
                      onClaimReward(ach.id);
                    }}
                    className="w-full py-3 bg-[#D21624] hover:bg-red-700 text-white rounded-2xl font-mono text-xs font-bold shadow-2xs active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <Gift className="w-4 h-4" /> Забрать награду (+{ach.rewardXp} ОПТ)
                  </button>
                </div>
              ) : (
                <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Нажмите для полного арт-осмотра
                  </span>
                  <span>{ach.unlocked ? '✓ РАЗБЛОКИРОВАН' : '🔒 ЗАБЛОКИРОВАН'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Trophy Skin 3D Bento Inspection Modal */}
      {inspectedAchievement && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setInspectedAchievement(null)}
        >
          <div
            className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setInspectedAchievement(null)}
              className="absolute top-4 right-4 z-30 p-2 rounded-2xl bg-black/50 hover:bg-black/70 text-white active:scale-95 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Grand Hero Art Showcase */}
            <div className="relative w-full mb-3.5">
              <TrophyArtBadge achievement={inspectedAchievement} size="hero" />
            </div>

            {/* Modal Titles */}
            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900 leading-tight">
                {inspectedAchievement.title}
              </h3>
              <p className="text-xs font-mono font-bold text-[#D21624] mt-0.5">
                {inspectedAchievement.skin?.skinName}
              </p>
            </div>

            {/* Lore Box */}
            <div className="my-3 bg-stone-50 p-3 rounded-2xl text-center">
              <p className="text-xs text-slate-700 italic font-medium leading-relaxed">
                «{inspectedAchievement.skin?.skinLore || inspectedAchievement.description}»
              </p>
            </div>

            {/* Stats & Rewards Bento Cells */}
            <div className="grid grid-cols-2 gap-2 text-center mb-3.5">
              <div className="bg-stone-50 rounded-2xl p-2.5">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Опыт атлета</span>
                <span className="text-sm font-mono font-black text-slate-900">
                  +{inspectedAchievement.rewardXp} XP
                </span>
              </div>
              <div className="bg-stone-50 rounded-2xl p-2.5">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Улучшение OVR</span>
                <span className="text-sm font-mono font-black text-slate-900">
                  {inspectedAchievement.statReward
                    ? `+${inspectedAchievement.statReward.amount} ${inspectedAchievement.statReward.stat.toUpperCase()}`
                    : 'Базовый'}
                </span>
              </div>
            </div>

            {/* Progress Status */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500">
                <span>ПРОГРЕСС ВЫПОЛНЕНИЯ:</span>
                <span>
                  {inspectedAchievement.progress} / {inspectedAchievement.maxProgress} {inspectedAchievement.unit}
                </span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-slate-900"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (inspectedAchievement.progress / inspectedAchievement.maxProgress) * 100
                      )
                    )}%`
                  }}
                />
              </div>
            </div>

            {/* Claim or Status Button */}
            {inspectedAchievement.unlocked && !inspectedAchievement.claimed ? (
              <button
                onClick={() => {
                  triggerHaptic('success');
                  onClaimReward(inspectedAchievement.id);
                  setInspectedAchievement(null);
                }}
                className="w-full py-3.5 bg-[#D21624] hover:bg-red-700 text-white rounded-2xl font-mono text-xs font-bold shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4" /> Забрать награду (+{inspectedAchievement.rewardXp} XP)
              </button>
            ) : (
              <button
                onClick={() => setInspectedAchievement(null)}
                className="w-full py-3 bg-stone-100 text-slate-700 rounded-2xl font-mono text-xs font-bold hover:bg-stone-200 transition-all"
              >
                Закрыть арт-осмотр
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
