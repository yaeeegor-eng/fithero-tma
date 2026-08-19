import React from 'react';
import { UserProfile } from '../types';
import { calculateOvr } from '../data/initialData';
import { Shield, Sparkles, Flame, Zap, Award, Dumbbell, Activity, Brain } from 'lucide-react';
import { AthleteAvatar } from './AthleteAvatar';
import { resolveTierForProfile } from '../utils/cardTierUtils';

interface FifaCardProps {
  profile: UserProfile;
  id?: string;
  className?: string;
  showHoloEffect?: boolean;
}

export const FifaCard: React.FC<FifaCardProps> = ({
  profile,
  id = 'fifa-card-preview',
  className = '',
  showHoloEffect = true
}) => {
  const ovr = calculateOvr(profile);
  const tier = resolveTierForProfile(profile);

  const xpStat = Math.min(99, Math.round((profile.currentXp / profile.maxXp) * 100));
  const streakStat = Math.min(99, profile.streakDays * 4 + 35);

  return (
    <div
      id={id}
      className={`relative w-72 sm:w-80 select-none mx-auto transition-all duration-300 ${className}`}
      style={{
        filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.25))'
      }}
    >
      {/* Neo-Brutalist Bento FUT Card Outer Frame with Rounded 32px Corners */}
      <div
        className={`relative w-full rounded-[32px] p-4 bg-gradient-to-b ${tier.cardBg} border ${tier.cardBorder} overflow-hidden shadow-2xl text-left`}
        style={{
          boxShadow: tier.glowShadow
        }}
      >
        {/* Holographic Light Reflection Sheen */}
        {showHoloEffect && (
          <div
            className={`absolute inset-0 bg-gradient-to-tr ${tier.holoClass} pointer-events-none opacity-50 mix-blend-overlay`}
          />
        )}

        {/* Micro-dot / Geometric Background Grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '12px 12px'
          }}
        />

        {/* Top Tier Banner */}
        <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
          <div className="flex items-center gap-1.5">
            <div className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-black ${tier.badgeBg} ${tier.badgeText} shadow-xs`}>
              {tier.rarityTag}
            </div>
          </div>
          <span className={`text-[9px] font-mono font-black uppercase tracking-wider ${tier.headerAccent}`}>
            {tier.themeTitle}
          </span>
        </div>

        {/* Upper Bento Section: OVR & Laconic Athlete Frame */}
        <div className="grid grid-cols-12 gap-3 items-center mb-3 relative z-10">
          {/* Left Column: Big OVR, Position, Flag, Shield */}
          <div className="col-span-5 flex flex-col items-start pl-1">
            <span className={`text-5xl sm:text-6xl font-mono font-black ${tier.textColor} leading-none tracking-tighter drop-shadow-sm`}>
              {ovr}
            </span>
            <span className={`text-xs font-mono font-black uppercase ${tier.headerAccent} tracking-wider mt-0.5`}>
              {profile.positionTitle.split(' ')[0] === 'ALL' ? 'УНИВЕРСАЛ' : profile.positionTitle.split(' ')[0]}
            </span>

            {/* Country and Club Badge Mini-Row */}
            <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-white/10 w-full">
              <span className="text-xl shrink-0" title="Страна">
                {profile.countryCode || '🇷🇺'}
              </span>
              <div className="w-5 h-5 rounded-lg bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shrink-0">
                <Shield className="w-3 h-3 text-white fill-white/50" />
              </div>
            </div>
          </div>

          {/* Right Column: Clean, Laconic Athlete Portrait Bento Container */}
          <div className="col-span-7 flex justify-end">
            <div className={`relative p-1 rounded-2xl border ${tier.frameAccent} shadow-md overflow-hidden bg-black/20 group`}>
              <AthleteAvatar
                src={profile.avatarUrl}
                name={profile.name}
                id={profile.id}
                className="w-28 sm:w-32 h-28 sm:h-32 rounded-xl object-cover"
              />
              <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded-md text-[9px] font-mono font-black text-white border border-white/20">
                УР. {profile.level}
              </div>
            </div>
          </div>
        </div>

        {/* Player Name and Club Bento Strip */}
        <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-2.5 mb-3 text-center relative z-10 border border-white/10">
          <h2 className={`text-base sm:text-lg font-black uppercase tracking-wider ${tier.textColor} truncate leading-tight`}>
            {profile.name}
          </h2>
          <p className={`text-[10px] font-mono font-bold ${tier.subText} uppercase tracking-wider truncate mt-0.5`}>
            {profile.clubName || 'Фитнес-клуб Telegram'}
          </p>
        </div>

        {/* 6 Core Athletic Stats Bento Grid */}
        <div className="grid grid-cols-2 gap-2 relative z-10">
          {/* Left Stats Column */}
          <div className="bg-black/20 rounded-2xl p-2 space-y-1.5 border border-white/5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className={`font-bold text-[11px] ${tier.labelColor}`}>СИЛ (Сила)</span>
              <span className={`font-black text-xs ${tier.statColor}`}>{profile.stats.strength}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className={`font-bold text-[11px] ${tier.labelColor}`}>ВЫН (Выносл)</span>
              <span className={`font-black text-xs ${tier.statColor}`}>{profile.stats.endurance}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className={`font-bold text-[11px] ${tier.labelColor}`}>ЛОВ (Ловкость)</span>
              <span className={`font-black text-xs ${tier.statColor}`}>{profile.stats.agility}</span>
            </div>
          </div>

          {/* Right Stats Column */}
          <div className="bg-black/20 rounded-2xl p-2 space-y-1.5 border border-white/5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className={`font-bold text-[11px] ${tier.labelColor}`}>ИНТ (Ум)</span>
              <span className={`font-black text-xs ${tier.statColor}`}>{profile.stats.intellect}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className={`font-bold text-[11px] ${tier.labelColor}`}>ОПТ (Опыт)</span>
              <span className={`font-black text-xs ${tier.statColor}`}>{xpStat}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className={`font-bold text-[11px] ${tier.labelColor}`}>СЕР (Серия)</span>
              <span className={`font-black text-xs ${tier.statColor}`}>{streakStat}</span>
            </div>
          </div>
        </div>

        {/* Footer Micro-Badge */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10 text-[8px] font-mono font-bold text-white/50 relative z-10 px-1">
          <span>FITHERO • СЕЗОН 2026</span>
          <span className="uppercase">{tier.tierName}</span>
        </div>
      </div>
    </div>
  );
};
