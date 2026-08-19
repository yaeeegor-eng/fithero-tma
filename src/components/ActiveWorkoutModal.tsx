import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, X, Sparkles, Flame, Clock, Dumbbell } from 'lucide-react';
import { Exercise, UserStats } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface ActiveWorkoutModalProps {
  exercise: Exercise;
  onClose: () => void;
  onCompleteWorkout: (result: {
    durationMinutes: number;
    setsCompleted: number;
    repsOrDistance: string;
    caloriesBurned: number;
    xpEarned: number;
    statsEarned: Partial<UserStats>;
  }) => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  exercise,
  onClose,
  onCompleteWorkout
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [currentSet, setCurrentSet] = useState(1);
  const totalSets = exercise.defaultSets || 4;
  const repsPerSet = exercise.defaultReps || 15;
  const [completedReps, setCompletedReps] = useState(repsPerSet);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleNextSet = () => {
    triggerHaptic('medium');
    if (currentSet < totalSets) {
      setCurrentSet((prev) => prev + 1);
    } else {
      handleFinishWorkout();
    }
  };

  const handleFinishWorkout = () => {
    triggerHaptic('success');
    const minutes = Math.max(1, Math.round(secondsElapsed / 60));
    onCompleteWorkout({
      durationMinutes: minutes,
      setsCompleted: currentSet,
      repsOrDistance: `${currentSet * completedReps} повт.`,
      caloriesBurned: exercise.calories,
      xpEarned: exercise.xpReward,
      statsEarned: exercise.statGain
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
      <div className="bg-[#EFE8DE] rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-stone-300 animate-in slide-in-from-bottom-6">
        {/* Modal Top Bar */}
        <div className="bg-white/80 backdrop-blur-xs px-4 py-3 border-b border-stone-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#1664B0] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
              Live Режим
            </span>
            <span className="text-xs font-extrabold text-slate-700">
              {exercise.difficulty}
            </span>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-stone-200 text-slate-500 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workout Info & Interactive Timer */}
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-slate-900 leading-tight">
              {exercise.title}
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              {exercise.subtitle}
            </p>
          </div>

          {/* Big Circular Timer / Set Progress */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col items-center justify-center relative">
            <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-mono mb-2">
              {formatTime(secondsElapsed)}
            </div>

            {/* Set Indicator */}
            <div className="flex items-center gap-1.5 mb-4">
              {Array.from({ length: totalSets }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx + 1 < currentSet
                      ? 'w-6 bg-emerald-500'
                      : idx + 1 === currentSet
                      ? 'w-8 bg-[#1664B0]'
                      : 'w-2.5 bg-stone-200'
                  }`}
                />
              ))}
            </div>

            <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
              Сет {currentSet} из {totalSets} • {completedReps} повторений
            </span>

            {/* Rewards Pill */}
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-stone-100 w-full justify-around text-xs font-bold">
              <div className="flex items-center gap-1 text-[#1664B0]">
                <Sparkles className="w-3.5 h-3.5" /> +{exercise.xpReward} XP
              </div>
              <div className="flex items-center gap-1 text-[#D21624]">
                <Flame className="w-3.5 h-3.5" /> {exercise.calories} ккал
              </div>
              <div className="flex items-center gap-1 text-emerald-700">
                <Dumbbell className="w-3.5 h-3.5" />
                {Object.entries(exercise.statGain)
                  .map(([st, val]) => `+${val} ${st.substring(0, 3).toUpperCase()}`)
                  .join(', ')}
              </div>
            </div>
          </div>

          {/* Tips / Instructions */}
          {exercise.videoTips && (
            <div className="bg-white/70 rounded-2xl p-4 border border-stone-200 text-xs space-y-2">
              <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                💡 Техника выполнения:
              </h4>
              <ul className="space-y-1.5 text-slate-600 pl-4 list-disc font-medium">
                {exercise.videoTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Floating Control Bar */}
        <div className="bg-white p-4 border-t border-stone-300 flex items-center gap-3">
          <button
            onClick={() => {
              triggerHaptic('light');
              setIsActive(!isActive);
            }}
            className="p-3 rounded-2xl bg-stone-100 text-slate-700 hover:bg-stone-200 active:scale-95 transition-all"
            title={isActive ? 'Пауза' : 'Продолжить'}
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setSecondsElapsed(0);
            }}
            className="p-3 rounded-2xl bg-stone-100 text-slate-700 hover:bg-stone-200 active:scale-95 transition-all"
            title="Сброс таймера"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleNextSet}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-[#1664B0] text-white font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all shadow-md"
          >
            {currentSet < totalSets ? (
              <>Следующий сет ({currentSet}/{totalSets})</>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Завершить тренировку
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
