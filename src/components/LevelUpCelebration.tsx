import React, { useEffect } from 'react';
import { Award, Sparkles, Flame, Check, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface LevelUpCelebrationProps {
  newLevel: number;
  profile: UserProfile;
  onClose: () => void;
  onOpenFifaCard: () => void;
}

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({
  newLevel,
  profile,
  onClose,
  onOpenFifaCard
}) => {
  useEffect(() => {
    triggerHaptic('success');
    // Launch celebratory bursts
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const timeout = setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 max-w-sm w-full border-2 border-amber-400 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-300">
        {/* Animated Trophy / Level Badge */}
        <div className="relative inline-block mx-auto mt-2">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex flex-col items-center justify-center">
              <Award className="w-10 h-10 text-amber-400 animate-bounce" />
              <span className="text-xl font-black text-white -mt-1">
                УР. {newLevel}
              </span>
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-amber-300 absolute -top-2 -right-2 animate-spin" />
        </div>

        <div>
          <span className="text-xs font-black uppercase text-amber-400 tracking-widest">
            Новый уровень достигнут!
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white mt-1">
            Поздравляем, Чемпион!
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Твои характеристики выросли, а карточка атлета получила апгрейд общего рейтинга (ОБЩ)!
          </p>
        </div>

        {/* Stats Growth Card */}
        <div className="bg-white/10 rounded-2xl p-3 border border-white/15 text-xs text-left space-y-1.5 font-bold">
          <div className="flex items-center justify-between text-slate-200">
            <span>💪 Сила (СИЛ):</span>
            <span className="text-emerald-400 font-extrabold">{profile.stats.strength} (+1)</span>
          </div>
          <div className="flex items-center justify-between text-slate-200">
            <span>⚡️ Выносливость (ВЫН):</span>
            <span className="text-emerald-400 font-extrabold">{profile.stats.endurance} (+1)</span>
          </div>
          <div className="flex items-center justify-between text-slate-200">
            <span>🌪 Ловкость (ЛОВ):</span>
            <span className="text-emerald-400 font-extrabold">{profile.stats.agility} (+1)</span>
          </div>
          <div className="flex items-center justify-between text-slate-200">
            <span>🧠 Интеллект (ИНТ):</span>
            <span className="text-emerald-400 font-extrabold">{profile.stats.intellect} (+1)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              triggerHaptic('medium');
              onOpenFifaCard();
              onClose();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
          >
            Посмотреть карточку атлета <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-white/10 text-slate-300 font-bold text-xs hover:bg-white/20 active:scale-95 transition-all"
          >
            Продолжить тренировки
          </button>
        </div>
      </div>
    </div>
  );
};
