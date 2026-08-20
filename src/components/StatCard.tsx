import React from 'react';
import { Dumbbell, Activity, Zap, Brain } from 'lucide-react';
import { StatType } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface StatCardProps {
  type: StatType;
  value: number;
  onSelectStatCategory: (type: StatType) => void;
}

const STAT_CONFIG = {
  strength: {
    title: 'Сила',
    abbr: 'СИЛ',
    icon: Dumbbell,
    color: '#D21624',
    bgIcon: 'bg-stone-100 text-[#D21624]',
    textColor: 'text-[#D21624]',
    barColor: 'bg-[#D21624]',
    discipline: 'Отжимания • Подсчет повторений'
  },
  endurance: {
    title: 'Выносливость',
    abbr: 'ВЫН',
    icon: Activity,
    color: '#1664B0',
    bgIcon: 'bg-stone-100 text-[#1664B0]',
    textColor: 'text-[#1664B0]',
    barColor: 'bg-[#1664B0]',
    discipline: 'Бег • Кардио-трекинг'
  },
  agility: {
    title: 'Ловкость',
    abbr: 'ЛОВ',
    icon: Zap,
    color: '#0f172a',
    bgIcon: 'bg-stone-100 text-slate-800',
    textColor: 'text-slate-900',
    barColor: 'bg-slate-900',
    discipline: 'Растяжка • Мобильность'
  },
  intellect: {
    title: 'Интеллект',
    abbr: 'ИНТ',
    icon: Brain,
    color: '#0f172a',
    bgIcon: 'bg-stone-100 text-slate-800',
    textColor: 'text-slate-900',
    barColor: 'bg-slate-900',
    discipline: 'Чтение • Развитие мышления'
  }
};

export const StatCard: React.FC<StatCardProps> = ({ type, value, onSelectStatCategory }) => {
  const config = STAT_CONFIG[type];
  const Icon = config.icon;
  const percentage = Math.min(100, Math.max(1, value));

  return (
    <div
      onClick={() => {
        triggerHaptic('light');
        onSelectStatCategory(type);
      }}
      className="bg-white rounded-3xl p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-[0.98] group flex flex-col justify-between"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-2xl ${config.bgIcon} flex items-center justify-center`}>
            <Icon className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-900 tracking-tight">
                {config.title}
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                {config.abbr}
              </span>
            </div>
            <span className="text-[10px] font-medium text-slate-400 block">
              {config.discipline}
            </span>
          </div>
        </div>

        {/* High-Impact Stat Number */}
        <div className="flex items-baseline gap-0.5">
          <span className={`text-2xl font-mono font-black ${config.textColor} tracking-tight leading-none`}>
            {value}
          </span>
          <span className="text-[10px] font-mono font-bold text-slate-300">/99</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden mt-1">
        <div
          className={`h-full ${config.barColor} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
