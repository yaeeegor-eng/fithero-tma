import React, { useState } from 'react';
import {
  Search,
  Dumbbell,
  Activity,
  Zap,
  Brain,
  Flame,
  Clock,
  Sparkles,
  Play,
  CheckCircle,
  Filter,
  Camera,
  Upload,
  BookOpen,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { Exercise, StatType, UserStats, WorkoutLogEntry } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { PushupsCameraModal } from './PushupsCameraModal';
import { StretchingCameraModal } from './StretchingCameraModal';
import { RunningScreenshotModal } from './RunningScreenshotModal';
import { ReadingVerificationModal } from './ReadingVerificationModal';

const MAX_DAILY_LOGS_PER_EXERCISE = 5;

interface ExerciseCatalogViewProps {
  exercises: Exercise[];
  workoutLogs: WorkoutLogEntry[];
  onLogWorkout: (result: {
    exercise: Exercise;
    durationMinutes: number;
    setsCompleted: number;
    repsOrDistance: string;
    caloriesBurned: number;
    xpEarned: number;
    statsEarned: Partial<UserStats>;
  }) => void;
  initialCategoryFilter?: StatType | null;
}

export const ExerciseCatalogView: React.FC<ExerciseCatalogViewProps> = ({
  exercises,
  workoutLogs,
  onLogWorkout,
  initialCategoryFilter
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>(initialCategoryFilter || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active workout modal states
  const [activePushupExercise, setActivePushupExercise] = useState<Exercise | null>(null);
  const [activeStretchExercise, setActiveStretchExercise] = useState<Exercise | null>(null);
  const [activeRunExercise, setActiveRunExercise] = useState<Exercise | null>(null);
  const [activeReadingExercise, setActiveReadingExercise] = useState<Exercise | null>(null);

  // Quick Log modal state
  const [quickLogExercise, setQuickLogExercise] = useState<Exercise | null>(null);
  const [quickSets, setQuickSets] = useState(4);
  const [quickReps, setQuickReps] = useState(15);
  const [quickMinutes, setQuickMinutes] = useState(15);

  const todayStr = new Date().toISOString().split('T')[0];

  // Anti-fraud count helper
  const getTodayLogsCount = (exercise: Exercise): number => {
    return workoutLogs.filter((log) => {
      if (log.dateStr !== todayStr) return false;
      if (log.exerciseId === exercise.id) return true;
      const titleLower = exercise.title.toLowerCase();
      const logTitleLower = log.exerciseTitle.toLowerCase();
      if (titleLower.includes('отжиман') && logTitleLower.includes('отжиман')) return true;
      if (titleLower.includes('бег') && logTitleLower.includes('бег')) return true;
      if (titleLower.includes('растяж') && logTitleLower.includes('растяж')) return true;
      if (titleLower.includes('чтени') && logTitleLower.includes('чтени')) return true;
      return false;
    }).length;
  };

  const categories = [
    { id: 'all', label: 'Все 4 дисциплины', icon: Filter },
    { id: 'strength', label: 'Сила', icon: Dumbbell },
    { id: 'endurance', label: 'Выносливость', icon: Activity },
    { id: 'agility', label: 'Ловкость', icon: Zap },
    { id: 'intellect', label: 'Интеллект', icon: Brain },
  ];

  const filteredExercises = exercises.filter((ex) => {
    const matchesFilter =
      selectedFilter === 'all' ||
      ex.primaryStat === selectedFilter ||
      (selectedFilter === 'intellect' && (ex.category === 'mind' || ex.primaryStat === 'intellect')) ||
      (selectedFilter === 'endurance' && (ex.category === 'cardio' || ex.primaryStat === 'endurance')) ||
      (selectedFilter === 'agility' && (ex.category === 'flexibility' || ex.primaryStat === 'agility'));

    const matchesSearch =
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroups.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const handleLaunchExercise = (exercise: Exercise) => {
    const todayCount = getTodayLogsCount(exercise);
    if (todayCount >= MAX_DAILY_LOGS_PER_EXERCISE) {
      triggerHaptic('error');
      alert(`Дневной лимит для дисциплины "${exercise.title}" исчерпан (максимум ${MAX_DAILY_LOGS_PER_EXERCISE} в день). Приходите завтра!`);
      return;
    }

    triggerHaptic('medium');
    const id = exercise.id.toLowerCase();
    const title = exercise.title.toLowerCase();

    if (id.includes('pushup') || title.includes('отжимания')) {
      setActivePushupExercise(exercise);
    } else if (id.includes('stretch') || title.includes('растяжка') || exercise.category === 'flexibility') {
      setActiveStretchExercise(exercise);
    } else if (id.includes('run') || title.includes('бег') || exercise.category === 'cardio') {
      setActiveRunExercise(exercise);
    } else if (id.includes('read') || title.includes('чтение') || exercise.category === 'mind') {
      setActiveReadingExercise(exercise);
    }
  };

  const handleQuickLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLogExercise) return;

    const todayCount = getTodayLogsCount(quickLogExercise);
    if (todayCount >= MAX_DAILY_LOGS_PER_EXERCISE) {
      triggerHaptic('error');
      alert(`Дневной лимит (5/5) для этой дисциплины исчерпан.`);
      setQuickLogExercise(null);
      return;
    }

    triggerHaptic('success');
    onLogWorkout({
      exercise: quickLogExercise,
      durationMinutes: quickMinutes,
      setsCompleted: quickSets,
      repsOrDistance: `${quickSets} x ${quickReps}`,
      caloriesBurned: quickLogExercise.calories,
      xpEarned: quickLogExercise.xpReward,
      statsEarned: quickLogExercise.statGain
    });
    setQuickLogExercise(null);
  };

  return (
    <div className="space-y-3.5 pb-24 max-w-lg mx-auto">
      {/* Top Anti-Fraud Rule Bento Cell */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-white/10 text-white">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              ЛИМИТ СЕССИЙ: 5 В ДЕНЬ
            </h4>
            <p className="text-[10px] text-slate-400 font-medium">
              Антифрод-верификация для честного рейтинга
            </p>
          </div>
        </div>
      </div>

      {/* Top Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск дисциплин..."
          className="w-full bg-white pl-10 pr-4 py-3 rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden shadow-2xs"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                triggerHaptic('light');
                setSelectedFilter(cat.id);
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

      {/* 4 Core Disciplines List */}
      <div className="space-y-3.5">
        {filteredExercises.map((exercise) => {
          const statEntries = Object.entries(exercise.statGain);
          const isPushups = exercise.id.includes('pushup') || exercise.title.includes('Отжимания');
          const isRunning = exercise.id.includes('run') || exercise.title.includes('Бег');
          const isStretch = exercise.id.includes('stretch') || exercise.title.includes('Растяжка');
          const isReading = exercise.id.includes('read') || exercise.title.includes('Чтение');

          const todayCount = getTodayLogsCount(exercise);
          const isLimitReached = todayCount >= MAX_DAILY_LOGS_PER_EXERCISE;

          return (
            <div
              key={exercise.id}
              className={`bg-white rounded-3xl p-5 shadow-2xs transition-all relative overflow-hidden ${
                isLimitReached
                  ? 'opacity-80'
                  : 'hover:shadow-xs'
              }`}
            >
              {/* Header: Title, Specialization Tag, Daily Limit Badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    {isPushups && (
                      <span className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase text-slate-800 bg-stone-100 px-2.5 py-1 rounded-xl">
                        <Camera className="w-3 h-3 text-[#D21624]" /> НЕЙРОСЕТЬ • ПОВТОРЫ
                      </span>
                    )}
                    {isRunning && (
                      <span className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase text-slate-800 bg-stone-100 px-2.5 py-1 rounded-xl">
                        <Upload className="w-3 h-3 text-[#1664B0]" /> РАСПОЗНАВАНИЕ ТРЕКА
                      </span>
                    )}
                    {isStretch && (
                      <span className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase text-slate-800 bg-stone-100 px-2.5 py-1 rounded-xl">
                        <Camera className="w-3 h-3 text-slate-700" /> ДАТЧИК СТАБИЛЬНОСТИ
                      </span>
                    )}
                    {isReading && (
                      <span className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase text-slate-800 bg-stone-100 px-2.5 py-1 rounded-xl">
                        <BookOpen className="w-3 h-3 text-slate-700" /> ПРОВЕРКА ИНСАЙТА
                      </span>
                    )}

                    <span
                      className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 ${
                        isLimitReached
                          ? 'bg-red-50 text-[#D21624]'
                          : 'bg-stone-100 text-slate-700'
                      }`}
                    >
                      {isLimitReached ? <Lock className="w-2.5 h-2.5" /> : null}
                      {todayCount}/{MAX_DAILY_LOGS_PER_EXERCISE}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    {exercise.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {exercise.subtitle}
                  </p>
                </div>

                <span className="text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded-xl shrink-0 bg-stone-100 text-slate-800">
                  {exercise.primaryStat === 'strength'
                    ? 'СИЛА'
                    : exercise.primaryStat === 'endurance'
                    ? 'ВЫНОСЛИВОСТЬ'
                    : exercise.primaryStat === 'agility'
                    ? 'ЛОВКОСТЬ'
                    : 'ИНТЕЛЛЕКТ'}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 font-normal my-2.5 leading-relaxed bg-stone-50 p-3 rounded-2xl">
                {exercise.description}
              </p>

              {/* Stat Gains and Badges */}
              <div className="flex flex-wrap items-center gap-1.5 my-2.5">
                <div className="flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold text-slate-800">
                  <Sparkles className="w-3 h-3 text-slate-600" /> +{exercise.xpReward} ОПТ
                </div>

                {statEntries.map(([stat, val]) => (
                  <div
                    key={stat}
                    className="flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold text-slate-800"
                  >
                    +{val}{' '}
                    {stat === 'strength'
                      ? 'СИЛ'
                      : stat === 'endurance'
                      ? 'ВЫН'
                      : stat === 'agility'
                      ? 'ЛОВ'
                      : 'ИНТ'}
                  </div>
                ))}

                <div className="flex items-center gap-1 text-slate-400 text-[10px] font-mono font-bold ml-auto">
                  <Clock className="w-3 h-3 text-slate-400" /> {exercise.durationMinutes} мин.
                  <span className="mx-1">•</span>
                  <Flame className="w-3 h-3 text-[#D21624]" /> {exercise.calories} ккал
                </div>
              </div>

              {/* Progress Dots Indicator */}
              <div className="flex items-center justify-between py-2 px-3 bg-stone-50 rounded-2xl mb-3 text-[10px] font-mono font-bold text-slate-500">
                <span>СЕССИИ СЕГОДНЯ ({todayCount}/5):</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: MAX_DAILY_LOGS_PER_EXERCISE }).map((_, dotIdx) => (
                    <div
                      key={dotIdx}
                      className={`w-2 h-2 rounded-full transition-all ${
                        dotIdx < todayCount
                          ? 'bg-slate-900'
                          : 'bg-stone-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Main Action Buttons */}
              {isLimitReached ? (
                <div className="bg-stone-100 rounded-2xl p-3 text-center text-xs font-mono font-bold text-slate-600 flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" /> Дневной лимит (5/5) исчерпан
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLaunchExercise(exercise)}
                    className="flex-1 flex items-center justify-center gap-2 text-white py-3.5 px-4 rounded-2xl font-mono text-xs font-black shadow-2xs active:scale-98 transition-all bg-slate-900 hover:bg-black"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    {isPushups
                      ? 'Открыть камеру'
                      : isRunning
                      ? 'Загрузить скриншот'
                      : isStretch
                      ? 'Начать растяжку'
                      : 'Записать инсайт'}
                  </button>

                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      setQuickLogExercise(exercise);
                      setQuickSets(exercise.defaultSets || 3);
                      setQuickReps(exercise.defaultReps || 15);
                      setQuickMinutes(exercise.durationMinutes || 15);
                    }}
                    className="p-3.5 bg-stone-100 hover:bg-stone-200 text-slate-700 rounded-2xl font-bold text-xs active:scale-95 transition-all shadow-2xs"
                    title="Ручной ввод данных"
                  >
                    <CheckCircle className="w-4 h-4 text-slate-700" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {activePushupExercise && (
        <PushupsCameraModal
          exercise={activePushupExercise}
          onClose={() => setActivePushupExercise(null)}
          onCompleteWorkout={(result) => {
            onLogWorkout({
              exercise: activePushupExercise,
              ...result
            });
            setActivePushupExercise(null);
          }}
        />
      )}

      {activeStretchExercise && (
        <StretchingCameraModal
          exercise={activeStretchExercise}
          onClose={() => setActiveStretchExercise(null)}
          onCompleteWorkout={(result) => {
            onLogWorkout({
              exercise: activeStretchExercise,
              ...result
            });
            setActiveStretchExercise(null);
          }}
        />
      )}

      {activeRunExercise && (
        <RunningScreenshotModal
          exercise={activeRunExercise}
          onClose={() => setActiveRunExercise(null)}
          onCompleteWorkout={(result) => {
            onLogWorkout({
              exercise: activeRunExercise,
              ...result
            });
            setActiveRunExercise(null);
          }}
        />
      )}

      {activeReadingExercise && (
        <ReadingVerificationModal
          exercise={activeReadingExercise}
          onClose={() => setActiveReadingExercise(null)}
          onCompleteWorkout={(result) => {
            onLogWorkout({
              exercise: activeReadingExercise,
              ...result
            });
            setActiveReadingExercise(null);
          }}
        />
      )}

      {/* Quick Log Manual Fallback Modal */}
      {quickLogExercise && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900 mb-1">
              Быстрая запись
            </h3>
            <p className="text-xs text-slate-500 mb-4">{quickLogExercise.title}</p>

            <form onSubmit={handleQuickLogSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Подходы / Сеты</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={quickSets}
                    onChange={(e) => setQuickSets(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border-none text-sm font-bold text-slate-900 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Повторений / Объем</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={quickReps}
                    onChange={(e) => setQuickReps(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border-none text-sm font-bold text-slate-900 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Время (минут)</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={quickMinutes}
                  onChange={(e) => setQuickMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border-none text-sm font-bold text-slate-900 font-mono"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickLogExercise(null)}
                  className="flex-1 py-3 rounded-2xl bg-stone-100 text-slate-700 text-xs font-bold hover:bg-stone-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-slate-900 text-white text-xs font-mono font-bold hover:bg-black shadow-xs"
                >
                  Зафиксировать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
