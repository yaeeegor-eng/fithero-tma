import React from 'react';
import {
  Flame,
  Play,
  Trophy,
  Dumbbell,
  ChevronRight,
  ArrowUpRight,
  Target,
  Check
} from 'lucide-react';
import { UserProfile, StatType, Exercise, WorkoutLogEntry, Achievement } from '../types';
import { StatCard } from './StatCard';
import { calculateOvr } from '../data/initialData';
import { triggerHaptic } from '../utils/haptics';

interface DashboardViewProps {
  profile: UserProfile;
  recentLogs: WorkoutLogEntry[];
  achievements?: Achievement[];
  onOpenExercisesTab: (statFilter?: StatType) => void;
  onOpenFifaCardStudio: () => void;
  onOpenCalendarTab: () => void;
  onOpenAchievementsTab: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  recentLogs,
  achievements = [],
  onOpenExercisesTab,
  onOpenFifaCardStudio,
  onOpenCalendarTab,
  onOpenAchievementsTab
}) => {
  const ovr = calculateOvr(profile);

  // Dynamic 7-day week calculation (Monday - Sunday)
  const now = new Date();
  const currentDayOfWeek = (now.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - currentDayOfWeek);
  monday.setHours(0, 0, 0, 0);

  const dayLabels = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

  // Collect all unique date strings with actual workouts
  const completedDateStrings = new Set<string>();
  recentLogs.forEach((log) => {
    if (log.dateStr) {
      completedDateStrings.add(log.dateStr);
    }
  });
  if (profile.lastWorkoutDate) {
    completedDateStrings.add(profile.lastWorkoutDate);
  }

  const days = dayLabels.map((dayLabel, index) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + index);
    const y = dayDate.getFullYear();
    const m = String(dayDate.getMonth() + 1).padStart(2, '0');
    const d = String(dayDate.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    const isToday = index === currentDayOfWeek;
    const isPast = index < currentDayOfWeek;
    const isFuture = index > currentDayOfWeek;
    const done = completedDateStrings.has(dateStr);

    return {
      day: dayLabel,
      dateStr,
      done,
      isToday,
      isPast,
      isFuture
    };
  });

  const weeklyBars = dayLabels.map((dayLabel, index) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + index);
    const y = dayDate.getFullYear();
    const m = String(dayDate.getMonth() + 1).padStart(2, '0');
    const d = String(dayDate.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;

    const dayXp = recentLogs
      .filter((l) => l.dateStr === dateStr)
      .reduce((sum, l) => sum + (l.xpEarned || 0), 0);

    const isToday = index === currentDayOfWeek;
    const heightPercent = dayXp > 0 ? Math.min(100, Math.max(25, (dayXp / 80) * 100)) : 10;

    return {
      day: dayLabel,
      height: `${heightPercent}%`,
      active: isToday,
      dayXp
    };
  });

  const totalWeekXp = weeklyBars.reduce((sum, b) => sum + b.dayXp, 0);

  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;
  const unclaimedAchievementsCount = achievements.filter((a) => a.unlocked && !a.claimed).length;

  return (
    <div className="space-y-3.5 pb-24 max-w-lg mx-auto">
      {/* Bento Top Header Unit */}
      <div className="grid grid-cols-4 gap-3 items-stretch">
        <div className="col-span-3 bg-white rounded-3xl p-4.5 shadow-2xs flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            ТРЕНИРОВОЧНЫЙ ДЕНЬ
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight mt-1">
            Дисциплина формирует твои характеристики
          </h2>
        </div>

        {/* FUT Card Bento Cell */}
        <button
          onClick={() => {
            triggerHaptic('medium');
            onOpenFifaCardStudio();
          }}
          className="col-span-1 bg-white rounded-3xl p-3 shadow-2xs flex flex-col items-center justify-center hover:bg-stone-50 active:scale-95 transition-all group"
        >
          <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-mono font-black text-base shadow-xs">
            {ovr}
          </div>
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider mt-1.5">
            КАРТА
          </span>
        </button>
      </div>

      {/* Modern Bento Streak Block in #1664B0 */}
      <div className="bg-[#1664B0] text-white rounded-3xl p-5 shadow-2xs relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Top Metric Header */}
        <div className="flex items-start justify-between relative z-10 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-blue-100">
              <Flame className="w-3.5 h-3.5 text-white fill-white" />
              <span>СТРИК ДИСЦИПЛИНЫ</span>
            </div>

            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-4xl font-mono font-black tracking-tight leading-none text-white">
                {profile.streakDays}
              </span>
              <span className="text-xs font-semibold text-blue-100">
                дней подряд
              </span>
            </div>

            <div className="text-[11px] font-medium text-blue-100/90 pt-1 flex items-center gap-2">
              <span>Рекорд: <strong className="text-white font-mono">{profile.longestStreak} дн</strong></span>
              <span className="text-blue-300">•</span>
              <span>Стабильность: <strong className="text-white font-mono">94%</strong></span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl px-3.5 py-2.5 text-right">
            <span className="text-[9px] font-mono font-bold text-blue-200 uppercase tracking-wider block">
              СЕССИЙ ВСЕГО
            </span>
            <span className="text-xl font-mono font-black text-white leading-tight block">
              {profile.totalWorkouts}
            </span>
          </div>
        </div>

        {/* Minimalist 7-Day Precision Tracker */}
        <div className="pt-3 border-t border-white/15 relative z-10">
          <div className="grid grid-cols-7 gap-2">
            {days.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span
                  className={`text-[9px] font-mono font-bold transition-colors ${
                    d.isToday ? 'text-white font-black' : 'text-blue-200'
                  }`}
                >
                  {d.day}
                </span>

                <div
                  className={`w-full aspect-square max-w-[38px] rounded-2xl flex items-center justify-center text-xs font-mono font-bold transition-all relative ${
                    d.done
                      ? d.isToday
                        ? 'bg-white text-[#1664B0] shadow-md ring-2 ring-white scale-105'
                        : 'bg-white text-[#1664B0] shadow-xs'
                      : d.isToday
                      ? 'bg-white/20 text-white ring-2 ring-white/70 shadow-xs'
                      : 'bg-white/10 text-blue-200/40'
                  }`}
                >
                  {d.done ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : d.isToday ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  ) : (
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Showcase Bento Banner */}
      <div
        onClick={() => {
          triggerHaptic('light');
          onOpenAchievementsTab();
        }}
        className="bg-white rounded-3xl p-4 shadow-2xs flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-stone-100 text-slate-900 flex items-center justify-center">
            <Trophy className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black text-slate-900 tracking-tight">
                Зал Славы & Достижения
              </h4>
              {unclaimedAchievementsCount > 0 && (
                <span className="bg-[#D21624] text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                  +{unclaimedAchievementsCount} НАГРАД
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Разблокировано {unlockedAchievementsCount} из {achievements.length || 12} трофеев
            </p>
          </div>
        </div>

        <div className="flex items-center text-xs font-bold text-slate-400">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* 4 Core RPG Stats Bento Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-slate-700" /> ХАРАКТЕРИСТИКИ АТЛЕТА
          </h3>
          <span className="text-xs font-mono font-bold text-slate-400">
            OVR: <strong className="text-slate-900">{ovr}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StatCard
            type="strength"
            value={profile.stats.strength}
            onSelectStatCategory={() => onOpenExercisesTab('strength')}
          />
          <StatCard
            type="endurance"
            value={profile.stats.endurance}
            onSelectStatCategory={() => onOpenExercisesTab('endurance')}
          />
          <StatCard
            type="agility"
            value={profile.stats.agility}
            onSelectStatCategory={() => onOpenExercisesTab('agility')}
          />
          <StatCard
            type="intellect"
            value={profile.stats.intellect}
            onSelectStatCategory={() => onOpenExercisesTab('intellect')}
          />
        </div>
      </div>

      {/* Weekly Progress Bar Graph Bento Cell */}
      <div className="bg-white rounded-3xl p-4.5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              НЕДЕЛЬНЫЙ ОБЪЕМ ОПЫТА
            </h3>
            <p className="text-xs text-slate-400 font-medium">Динамика прогресса атлета</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-900 bg-stone-100 px-2.5 py-1 rounded-xl">
            +{totalWeekXp > 0 ? totalWeekXp : (recentLogs.length > 0 ? recentLogs[0].xpEarned : 35)} XP
          </span>
        </div>

        <div className="flex items-end justify-between h-24 pt-3 px-2">
          {weeklyBars.map((bar, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
              <div className="w-full max-w-[22px] bg-stone-100 h-16 rounded-xl flex items-end justify-center p-0.5 overflow-hidden">
                <div
                  className={`w-full rounded-lg transition-all duration-500 ${
                    bar.active
                      ? 'bg-slate-900'
                      : 'bg-stone-300 hover:bg-stone-400'
                  }`}
                  style={{ height: bar.height }}
                />
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-400">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Launch Workout Banner in #D21624 */}
      <div className="bg-[#D21624] text-white rounded-3xl p-4.5 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase text-red-100 tracking-wider">
            ПЛИТКИ ДИСЦИПЛИН
          </span>
          <h3 className="text-sm font-black leading-tight mt-0.5">
            Зафиксируй тренировку и повысь OVR
          </h3>
        </div>

        <button
          onClick={() => {
            triggerHaptic('medium');
            onOpenExercisesTab();
          }}
          className="bg-white text-[#D21624] px-4 py-2.5 rounded-2xl font-mono text-xs font-black shadow-2xs hover:bg-stone-50 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-[#D21624]" /> Начать
        </button>
      </div>

      {/* Recent Workouts Feed Bento Cell */}
      <div className="bg-white rounded-3xl p-4.5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
            ПОСЛЕДНИЕ ЗАПИСИ
          </h3>
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenCalendarTab();
            }}
            className="text-xs font-bold text-slate-500 flex items-center gap-0.5 hover:text-slate-900"
          >
            Журнал <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentLogs.slice(0, 3).map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-stone-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white text-slate-800 flex items-center justify-center font-bold shadow-2xs">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">
                    {log.exerciseTitle}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 font-medium">
                    {log.repsOrDistance} • {log.durationMinutes} мин
                  </span>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-xl shadow-2xs">
                +{log.xpEarned} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
