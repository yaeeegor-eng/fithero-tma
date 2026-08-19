import React, { useState } from 'react';
import {
  Dumbbell,
  ShieldAlert,
  Zap,
  Footprints,
  Compass,
  Wind,
  Sparkles,
  Brain,
  BookOpen,
  Flame,
  Crown,
  Trophy,
  Award,
  Lock
} from 'lucide-react';
import { Achievement } from '../types';

interface TrophyArtBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showLockOverlay?: boolean;
}

// Bespoke Neo-Brutalist Vector / SVG & Gradient Badge Config for every achievement
export const TROPHY_ART_STYLES: Record<string, {
  bgGradient: string;
  accentColor: string;
  glowColor: string;
  icon: React.ComponentType<{ className?: string }>;
  pattern: string;
  subIcon?: React.ComponentType<{ className?: string }>;
  ringColor: string;
}> = {
  pushup_novice: {
    bgGradient: 'from-[#D21624] via-red-900 to-black',
    accentColor: '#D21624',
    glowColor: 'rgba(210, 22, 36, 0.4)',
    icon: Dumbbell,
    pattern: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)',
    ringColor: 'border-red-500/40'
  },
  pushup_master: {
    bgGradient: 'from-slate-800 via-slate-900 to-black',
    accentColor: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.3)',
    icon: ShieldAlert,
    pattern: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%)',
    ringColor: 'border-cyan-500/40'
  },
  pushup_titan: {
    bgGradient: 'from-[#D21624] via-purple-950 to-black',
    accentColor: '#F43F5E',
    glowColor: 'rgba(244, 63, 94, 0.5)',
    icon: Zap,
    pattern: 'radial-gradient(circle at 50% 50%, rgba(210,22,36,0.3) 0%, transparent 70%)',
    ringColor: 'border-rose-500/50'
  },
  run_starter: {
    bgGradient: 'from-[#1664B0] via-blue-900 to-black',
    accentColor: '#60A5FA',
    glowColor: 'rgba(22, 100, 176, 0.4)',
    icon: Footprints,
    pattern: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.25) 0%, transparent 60%)',
    ringColor: 'border-blue-400/40'
  },
  run_marathoner: {
    bgGradient: 'from-amber-600 via-amber-900 to-black',
    accentColor: '#FBBF24',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    icon: Compass,
    pattern: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
    ringColor: 'border-amber-400/50'
  },
  stretch_flexible: {
    bgGradient: 'from-emerald-700 via-teal-950 to-black',
    accentColor: '#34D399',
    glowColor: 'rgba(52, 211, 153, 0.3)',
    icon: Wind,
    pattern: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.2) 0%, transparent 70%)',
    ringColor: 'border-emerald-400/40'
  },
  stretch_zen: {
    bgGradient: 'from-slate-700 via-slate-900 to-black',
    accentColor: '#A78BFA',
    glowColor: 'rgba(167, 139, 250, 0.3)',
    icon: Sparkles,
    pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)',
    ringColor: 'border-purple-400/40'
  },
  read_bookworm: {
    bgGradient: 'from-indigo-800 via-slate-900 to-black',
    accentColor: '#818CF8',
    glowColor: 'rgba(129, 140, 248, 0.3)',
    icon: BookOpen,
    pattern: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
    ringColor: 'border-indigo-400/40'
  },
  read_scholar: {
    bgGradient: 'from-violet-900 via-purple-950 to-black',
    accentColor: '#C084FC',
    glowColor: 'rgba(192, 132, 252, 0.4)',
    icon: Brain,
    pattern: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.2) 0%, transparent 60%)',
    ringColor: 'border-purple-400/50'
  },
  streak_fire_3: {
    bgGradient: 'from-[#D21624] via-orange-950 to-black',
    accentColor: '#FB923C',
    glowColor: 'rgba(251, 146, 60, 0.4)',
    icon: Flame,
    pattern: 'radial-gradient(circle at 50% 70%, rgba(255,100,0,0.3) 0%, transparent 60%)',
    ringColor: 'border-orange-500/50'
  },
  streak_fire_7: {
    bgGradient: 'from-amber-500 via-red-950 to-black',
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    icon: Crown,
    pattern: 'radial-gradient(circle at 50% 30%, rgba(255,215,0,0.3) 0%, transparent 60%)',
    ringColor: 'border-yellow-400/60'
  },
  quad_athlete: {
    bgGradient: 'from-slate-900 via-[#1664B0] to-[#D21624]',
    accentColor: '#FFFFFF',
    glowColor: 'rgba(255, 255, 255, 0.4)',
    icon: Trophy,
    pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)',
    ringColor: 'border-white/50'
  }
};

export const TrophyArtBadge: React.FC<TrophyArtBadgeProps> = ({
  achievement,
  size = 'md',
  showLockOverlay = true
}) => {
  const [imageError, setImageError] = useState(false);
  const style = TROPHY_ART_STYLES[achievement.id] || {
    bgGradient: 'from-slate-800 to-black',
    accentColor: '#D21624',
    glowColor: 'rgba(210, 22, 36, 0.3)',
    icon: Award,
    pattern: 'none',
    ringColor: 'border-white/20'
  };

  const Icon = style.icon;

  const sizeClasses = {
    sm: 'w-10 h-10 rounded-xl',
    md: 'w-14 h-14 rounded-2xl',
    lg: 'w-20 h-20 rounded-3xl',
    hero: 'w-full h-44 rounded-2xl'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
    hero: 'w-14 h-14'
  };

  const hasPhotoUrl = Boolean(achievement.skin?.skinImageUrl && !imageError);

  return (
    <div
      className={`relative overflow-hidden shrink-0 flex items-center justify-center shadow-2xs ${
        sizeClasses[size]
      } ${
        achievement.unlocked ? 'bg-gradient-to-br ' + style.bgGradient : 'bg-stone-900'
      }`}
      style={{
        boxShadow: achievement.unlocked && size !== 'hero' ? `0 4px 14px ${style.glowColor}` : undefined
      }}
    >
      {/* Background Graphic Pattern */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{ backgroundImage: style.pattern, backgroundSize: '100% 100%' }}
      />

      {/* Optional Photo Artwork Layer if provided & loaded */}
      {hasPhotoUrl && (
        <img
          src={achievement.skin?.skinImageUrl}
          alt={achievement.title}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            achievement.unlocked ? 'opacity-80 mix-blend-luminosity' : 'opacity-40 grayscale'
          }`}
        />
      )}

      {/* Cyber Geometric Hex/Grid Mesh Overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.6) 1px, transparent 0)',
          backgroundSize: size === 'hero' ? '16px 16px' : '10px 10px'
        }}
      />

      {/* Central Bespoke Vector Art Icon & Emblem */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <div
          className={`p-2 rounded-2xl flex items-center justify-center transition-transform ${
            achievement.unlocked
              ? 'text-white drop-shadow-md'
              : 'text-stone-500'
          }`}
          style={{
            filter: achievement.unlocked ? `drop-shadow(0 2px 6px ${style.accentColor})` : 'none'
          }}
        >
          <Icon className={`${iconSizes[size]} stroke-[2]`} />
        </div>

        {size === 'hero' && achievement.skin && (
          <span className="text-[11px] font-mono font-black tracking-widest uppercase text-white/90 bg-black/40 px-3 py-1 rounded-xl mt-1 border border-white/10 backdrop-blur-xs">
            {achievement.skin.skinBadge}
          </span>
        )}
      </div>

      {/* Lock State Overlay */}
      {!achievement.unlocked && showLockOverlay && (
        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
          <div className="p-1.5 rounded-xl bg-black/60 border border-white/10 text-white/80">
            <Lock className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Unlocked Radiant Corner Indicator */}
      {achievement.unlocked && size !== 'hero' && (
        <div className="absolute bottom-1 right-1 z-20 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
      )}
    </div>
  );
};
