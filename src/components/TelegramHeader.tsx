import React from 'react';
import { Flame, Award } from 'lucide-react';
import { UserProfile } from '../types';
import { calculateOvr } from '../data/initialData';
import { triggerHaptic } from '../utils/haptics';
import { AthleteAvatar } from './AthleteAvatar';

interface TelegramHeaderProps {
  profile: UserProfile;
  onOpenCardStudio: () => void;
  onOpenProfileModal?: () => void;
}

export const TelegramHeader: React.FC<TelegramHeaderProps> = ({
  profile,
  onOpenCardStudio,
  onOpenProfileModal
}) => {
  const ovr = calculateOvr(profile);
  const xpPercent = Math.min(100, Math.round((profile.currentXp / profile.maxXp) * 100));

  return (
    <header className="sticky top-0 z-30 bg-[#FCFAF7]/95 backdrop-blur-md px-4 pt-3 pb-3">
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        {/* User Info & Level */}
        <button
          onClick={() => {
            triggerHaptic('light');
            if (onOpenProfileModal) onOpenProfileModal();
          }}
          className="flex items-center gap-3 text-left group transition-transform active:scale-98"
        >
          <div className="relative">
            <AthleteAvatar
              src={profile.avatarUrl}
              name={profile.name}
              id={profile.id}
              className="w-10 h-10 rounded-2xl object-cover shadow-2xs"
            />
            <span className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md shadow-2xs">
              УР. {profile.level}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                АТЛЕТ
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1664B0]" />
            </div>
            <h1 className="text-sm font-black text-slate-900 tracking-tight leading-tight truncate max-w-[140px]">
              {profile.name}
            </h1>
          </div>
        </button>

        {/* Action Badges: Streak & FIFA Card OVR */}
        <div className="flex items-center gap-2">
          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-2xl shadow-2xs" title="Дней тренировок подряд">
            <Flame className="w-3.5 h-3.5 text-[#D21624]" />
            <span className="text-xs font-mono font-black text-slate-900">
              {profile.streakDays} дн.
            </span>
          </div>

          {/* FIFA Card Quick Opener Button */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              onOpenCardStudio();
            }}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white px-3.5 py-1.5 rounded-2xl font-mono text-xs font-bold shadow-2xs active:scale-95 transition-all"
            title="Открыть карточку атлета"
          >
            <Award className="w-3.5 h-3.5 text-stone-300" />
            <span>ОБЩ {ovr}</span>
          </button>
        </div>
      </div>

      {/* Sleek XP Bar */}
      <div className="max-w-lg mx-auto mt-2 pt-1.5 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-stone-200/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-900 rounded-full transition-all duration-500"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
        <span className="text-[9px] font-mono font-bold text-slate-400 whitespace-nowrap">
          {profile.currentXp}/{profile.maxXp} ОПТ
        </span>
      </div>
    </header>
  );
};
