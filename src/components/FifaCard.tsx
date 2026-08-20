import React from 'react';
import { UserProfile } from '../types';
import { calculateOvr } from '../data/initialData';
import { Shield, Sparkles, Zap, Flame } from 'lucide-react';
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

  const stats = [
    { label: 'СИЛ', value: profile.stats.strength },
    { label: 'ВЫН', value: profile.stats.endurance },
    { label: 'ЛОВ', value: profile.stats.agility },
    { label: 'ИНТ', value: profile.stats.intellect },
    { label: 'ОПТ', value: xpStat },
    { label: 'СЕР', value: streakStat }
  ];

  return (
    <div
      id={id}
      className={`relative w-72 sm:w-80 select-none mx-auto transition-all duration-300 ${className}`}
      style={{
        filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.35))'
      }}
    >
      {/* Modern Soft UI + Glassmorphic Outer Card Container */}
      <div
        className={`relative w-full rounded-[32px] p-3 bg-gradient-to-b ${tier.cardBg} border ${tier.cardBorder} overflow-hidden text-left`}
        style={{
          boxShadow: tier.glowShadow
        }}
      >
        {/* Holographic Ambient Light Glow & Specular Sheen */}
        {showHoloEffect && (
          <div
            className={`absolute inset-0 bg-gradient-to-tr ${tier.holoClass} pointer-events-none opacity-60 mix-blend-overlay`}
          />
        )}

        {/* Minimalist Micro-Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '16px 16px'
          }}
        />

        {/* 60% HERO PHOTO CONTAINER WITH INTEGRATED GLASS OVERLAYS */}
        <div className="relative w-full h-72 sm:h-80 rounded-[26px] overflow-hidden bg-black/40 border border-white/10 shadow-inner group">
          {/* Main Photo filling the entire 60% viewport */}
          <AthleteAvatar
            src={profile.avatarUrl}
            name={profile.name}
            id={profile.id}
            className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
          />

          {/* Soft Bottom Shadow/Vignette to seamlessly blend image into lower glass controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/40 pointer-events-none" />

          {/* Floating Top-Left Glassmorphic OVR Badge */}
          <div className="absolute top-3 left-3 flex flex-col items-center">
            <div className="px-3 py-1.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 shadow-lg text-center flex flex-col items-center">
              <span className={`text-3xl sm:text-4xl font-mono font-black ${tier.textColor} leading-none tracking-tight`}>
                {ovr}
              </span>
              <span className={`text-[9px] font-mono font-black uppercase ${tier.headerAccent} tracking-wider mt-0.5`}>
                {profile.positionTitle.split(' ')[0] === 'ALL' ? 'УНИВЕРСАЛ' : profile.positionTitle.split(' ')[0]}
              </span>
            </div>

            {/* Country & Shield micro-pills */}
            <div className="flex items-center gap-1.5 mt-1.5 px-2 py-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/15">
              <span className="text-sm leading-none" title="Страна">
                {profile.countryCode || '🇷🇺'}
              </span>
              <div className="w-3.5 h-3.5 rounded-full bg-white/15 flex items-center justify-center">
                <Shield className="w-2.5 h-2.5 text-white fill-white/60" />
              </div>
            </div>
          </div>

          {/* Floating Top-Right Glassmorphic Tier & Level Badge */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            <div className={`px-2.5 py-1 rounded-xl text-[9px] font-mono font-black uppercase tracking-wider ${tier.badgeBg} shadow-md`}>
              {tier.rarityTag}
            </div>
            <div className="px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/15 text-[9px] font-mono font-black text-white/90">
              УР. {profile.level}
            </div>
          </div>

          {/* Minimalist Player Name Bar pinned over bottom edge of photo */}
          <div className="absolute bottom-2.5 inset-x-2.5 p-2 rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 text-center shadow-lg">
            <h2 className={`text-base sm:text-lg font-black uppercase tracking-wide ${tier.textColor} truncate leading-tight`}>
              {profile.name}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-0.5 text-[10px] font-mono text-white/70">
              <span className="truncate max-w-[140px]">{profile.clubName || 'FitHero Club'}</span>
              <span className="text-white/30">•</span>
              <span className={`font-bold ${tier.headerAccent}`}>{tier.themeTitle}</span>
            </div>
          </div>
        </div>

        {/* LOWER SECTION: 6 MINIMALIST GLASS STAT CARDS */}
        <div className="mt-2.5 grid grid-cols-6 gap-1.5 relative z-10">
          {stats.map((st) => (
            <div
              key={st.label}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/10 shadow-xs transition-all hover:bg-white/[0.12]"
            >
              <span className={`text-[10px] font-mono font-bold ${tier.labelColor} tracking-wider leading-none mb-1`}>
                {st.label}
              </span>
              <span className={`text-sm sm:text-base font-mono font-black ${tier.statColor} leading-none`}>
                {st.value}
              </span>
            </div>
          ))}
        </div>

        {/* Minimalist Card Footer */}
        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/10 text-[8px] font-mono font-medium text-white/40 px-1">
          <span>FITHERO • 2026</span>
          <span className="uppercase tracking-wider">{tier.tierName}</span>
        </div>
      </div>
    </div>
  );
};

