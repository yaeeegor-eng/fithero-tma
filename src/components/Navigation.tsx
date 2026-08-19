import React from 'react';
import { Home, LayoutGrid, Award, CalendarDays, Trophy, Users, Activity } from 'lucide-react';
import { ActiveTab } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  unclaimedAchievementsCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  unclaimedAchievementsCount = 0
}) => {
  const tabs = [
    { id: 'home' as ActiveTab, label: 'Главная', icon: Home },
    { id: 'feed' as ActiveTab, label: 'Лента', icon: Activity },
    { id: 'exercises' as ActiveTab, label: 'Тренировки', icon: LayoutGrid },
    { id: 'fifa_card' as ActiveTab, label: 'Карточка', icon: Award },
    { id: 'achievements' as ActiveTab, label: 'Награды', icon: Trophy, hasBadge: unclaimedAchievementsCount > 0 },
    { id: 'leaderboard' as ActiveTab, label: 'Рейтинг', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md pb-safe shadow-md">
      <div className="flex items-center justify-around max-w-lg mx-auto px-0.5 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('light');
                onTabChange(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all duration-150 ${
                isActive
                  ? 'text-[#D21624]'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-105 stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.hasBadge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D21624]" />
                )}
              </div>

              <span
                className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap font-mono ${
                  isActive ? 'font-black' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
