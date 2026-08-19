import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Flame,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
  Award
} from 'lucide-react';
import { UserProfile, WorkoutLogEntry } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface CalendarViewProps {
  profile: UserProfile;
  workoutLogs: WorkoutLogEntry[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ profile, workoutLogs }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const daysOfWeek = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

  // Days in current month calculation
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map workouts by dateStr (YYYY-MM-DD)
  const logsByDate: Record<string, WorkoutLogEntry[]> = {};
  workoutLogs.forEach((log) => {
    if (!logsByDate[log.dateStr]) {
      logsByDate[log.dateStr] = [];
    }
    logsByDate[log.dateStr].push(log);
  });

  const handlePrevMonth = () => {
    triggerHaptic('light');
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    triggerHaptic('light');
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Monthly statistics
  const totalMonthWorkouts = workoutLogs.filter((log) => {
    const d = new Date(log.timestamp);
    return d.getMonth() === month && d.getFullYear() === year;
  }).length;

  const totalCaloriesBurned = workoutLogs.reduce((sum, l) => sum + l.caloriesBurned, 0);
  const totalMinutes = workoutLogs.reduce((sum, l) => sum + l.durationMinutes, 0);

  return (
    <div className="space-y-3.5 pb-24 max-w-lg mx-auto">
      {/* Hero Streak Bento Cell in #D21624 */}
      <div className="bg-[#D21624] text-white rounded-3xl p-5 shadow-2xs relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-red-100 uppercase tracking-widest mb-1">
              <Flame className="w-3.5 h-3.5 text-white" /> СТРИК ДИСЦИПЛИНЫ
            </div>
            <div className="text-3xl font-mono font-black tracking-tight">
              {profile.streakDays} <span className="text-base font-medium text-red-100">дней подряд</span>
            </div>
            <p className="text-xs text-red-100 mt-0.5 font-medium">
              Рекорд: <strong className="text-white font-mono">{profile.longestStreak} дн</strong> • Индекс регулярности 94%
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/10 flex flex-col items-center justify-center text-center">
            <Award className="w-5 h-5 text-white" />
            <span className="text-[9px] font-mono font-bold text-white mt-0.5">ТОП 5%</span>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-red-500/40 text-center">
          <div className="bg-black/10 rounded-2xl p-2.5">
            <span className="text-[10px] font-mono text-red-100 block uppercase">Сессий</span>
            <span className="text-sm font-mono font-black text-white">{profile.totalWorkouts}</span>
          </div>
          <div className="bg-black/10 rounded-2xl p-2.5">
            <span className="text-[10px] font-mono text-red-100 block uppercase">В месяц</span>
            <span className="text-sm font-mono font-black text-white">{totalMonthWorkouts}</span>
          </div>
          <div className="bg-black/10 rounded-2xl p-2.5">
            <span className="text-[10px] font-mono text-red-100 block uppercase">Время</span>
            <span className="text-sm font-mono font-black text-white">{totalMinutes} мин</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Calendar Bento Cell */}
      <div className="bg-white rounded-3xl p-5 shadow-2xs space-y-3.5">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-slate-800" />
            {monthNames[month]} {year}
          </h3>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl hover:bg-stone-100 text-slate-600 transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl hover:bg-stone-100 text-slate-600 transition-all active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center font-mono font-bold text-[10px] text-slate-400 py-1">
          {daysOfWeek.map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid Matrix */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {/* Empty previous month slots */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Current Month Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayLogs = logsByDate[dateStr] || [];
            const hasWorkout = dayLogs.length > 0;
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <div
                key={dayNum}
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-1 text-xs font-mono font-bold transition-all ${
                  hasWorkout
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : isToday
                    ? 'bg-stone-200 text-slate-900'
                    : 'bg-stone-50 text-slate-700 hover:bg-stone-100'
                }`}
              >
                <span>{dayNum}</span>

                {/* Workout Indicators */}
                {hasWorkout && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {dayLogs.slice(0, 3).map((_, idx) => (
                      <span
                        key={idx}
                        className="w-1.5 h-1.5 rounded-full bg-white inline-block"
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* History Log List Bento Cell */}
      <div className="bg-white rounded-3xl p-5 shadow-2xs space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
          ИСТОРИЯ ТРЕНИРОВОК
        </h3>

        <div className="space-y-2">
          {workoutLogs.map((log) => (
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
                    {log.dateStr} • {log.repsOrDistance} • {log.durationMinutes} мин
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-slate-900 block">
                  +{log.xpEarned} ОПТ
                </span>
                <span className="text-[9px] font-mono text-slate-400">
                  {log.caloriesBurned} ккал
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
