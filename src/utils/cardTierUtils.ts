// FitHero FUT Card Level Progression & Tier Definitions
import { UserProfile } from '../types';

export interface CardTierInfo {
  tierId: 'bronze' | 'silver' | 'gold' | 'diamond' | 'red_icon' | 'mythic';
  minLevel: number;
  tierNumber: number;
  tierName: string;
  tierSubtitle: string;
  themeTitle: string;
  cardBg: string;
  badgeBg: string;
  badgeText: string;
  textColor: string;
  subText: string;
  statColor: string;
  labelColor: string;
  holoClass: string;
  glowShadow: string;
  frameAccent: string;
  cardBorder: string;
  headerAccent: string;
  rarityTag: string;
}

export const CARD_TIERS: Record<string, CardTierInfo> = {
  bronze: {
    tierId: 'bronze',
    minLevel: 1,
    tierNumber: 1,
    tierName: 'Бронзовый Новичок',
    tierSubtitle: 'Бронзовый Новичок (Уровень 1-4)',
    themeTitle: 'БРОНЗОВЫЙ РАНГ',
    cardBg: 'from-[#1c120c] via-[#2d1b12] to-[#120a06]',
    badgeBg: 'bg-[#78350F]',
    badgeText: 'text-amber-100',
    textColor: 'text-amber-100',
    subText: 'text-amber-300/80',
    statColor: 'text-white',
    labelColor: 'text-amber-200/90',
    holoClass: 'from-amber-600/15 via-transparent to-amber-900/20',
    glowShadow: '0 20px 40px -10px rgba(120, 53, 15, 0.3)',
    frameAccent: 'border-amber-700/40 bg-amber-950/40',
    cardBorder: 'border-amber-700/50',
    headerAccent: 'text-amber-400',
    rarityTag: 'РАНГ 1 • НОВИЧОК'
  },
  silver: {
    tierId: 'silver',
    minLevel: 5,
    tierNumber: 2,
    tierName: 'Серебряный Атлет',
    tierSubtitle: 'Серебряный Атлет (Уровень 5-8)',
    themeTitle: 'СЕРЕБРЯНЫЙ РАНГ',
    cardBg: 'from-[#0f172a] via-[#1e293b] to-[#090d16]',
    badgeBg: 'bg-slate-300 text-slate-900',
    badgeText: 'text-slate-900 font-black',
    textColor: 'text-slate-100',
    subText: 'text-slate-300',
    statColor: 'text-white',
    labelColor: 'text-slate-300',
    holoClass: 'from-slate-300/20 via-slate-100/10 to-slate-500/20',
    glowShadow: '0 20px 40px -10px rgba(148, 163, 184, 0.3)',
    frameAccent: 'border-slate-500/40 bg-slate-800/40',
    cardBorder: 'border-slate-400/50',
    headerAccent: 'text-slate-200',
    rarityTag: 'РАНГ 2 • СЕРЕБРО'
  },
  gold: {
    tierId: 'gold',
    minLevel: 9,
    tierNumber: 3,
    tierName: 'Золотая Элита',
    tierSubtitle: 'Золотая Элита (Уровень 9-12)',
    themeTitle: 'ЗОЛОТОЙ РАНГ',
    cardBg: 'from-[#2e1d03] via-[#4d3306] to-[#170e01]',
    badgeBg: 'bg-gradient-to-r from-amber-400 to-yellow-500',
    badgeText: 'text-slate-950 font-black',
    textColor: 'text-amber-50',
    subText: 'text-amber-200',
    statColor: 'text-white',
    labelColor: 'text-amber-300',
    holoClass: 'from-yellow-300/25 via-amber-200/10 to-amber-600/25',
    glowShadow: '0 25px 45px -10px rgba(217, 119, 6, 0.4)',
    frameAccent: 'border-amber-400/40 bg-amber-950/40',
    cardBorder: 'border-amber-400/60',
    headerAccent: 'text-amber-300',
    rarityTag: 'РАНГ 3 • ЗОЛОТО'
  },
  diamond: {
    tierId: 'diamond',
    minLevel: 13,
    tierNumber: 4,
    tierName: 'Алмазный Чемпион',
    tierSubtitle: 'Алмазный Чемпион (Уровень 13-17)',
    themeTitle: 'АЛМАЗНЫЙ РАНГ',
    cardBg: 'from-[#03152d] via-[#092957] to-[#020b17]',
    badgeBg: 'bg-[#1664B0]',
    badgeText: 'text-white font-black',
    textColor: 'text-white',
    subText: 'text-sky-200',
    statColor: 'text-white',
    labelColor: 'text-sky-300',
    holoClass: 'from-cyan-400/25 via-sky-300/15 to-blue-600/35',
    glowShadow: '0 25px 45px -10px rgba(22, 100, 176, 0.45)',
    frameAccent: 'border-sky-400/50 bg-sky-950/40',
    cardBorder: 'border-sky-400/60',
    headerAccent: 'text-sky-300',
    rarityTag: 'РАНГ 4 • АЛМАЗ'
  },
  red_icon: {
    tierId: 'red_icon',
    minLevel: 18,
    tierNumber: 5,
    tierName: 'Легендарная Икона',
    tierSubtitle: 'Легендарная Икона (Уровень 18-24)',
    themeTitle: 'ЛЕГЕНДАРНЫЙ РАНГ',
    cardBg: 'from-[#220205] via-[#45050d] to-[#120103]',
    badgeBg: 'bg-[#D21624]',
    badgeText: 'text-white font-black',
    textColor: 'text-white',
    subText: 'text-rose-200',
    statColor: 'text-white',
    labelColor: 'text-rose-300',
    holoClass: 'from-amber-400/25 via-rose-500/15 to-red-600/35',
    glowShadow: '0 25px 45px -10px rgba(210, 22, 36, 0.45)',
    frameAccent: 'border-rose-500/50 bg-red-950/40',
    cardBorder: 'border-[#D21624]/70',
    headerAccent: 'text-rose-400',
    rarityTag: 'РАНГ 5 • ЛЕГЕНДА'
  },
  mythic: {
    tierId: 'mythic',
    minLevel: 25,
    tierNumber: 6,
    tierName: 'Мифический Титан',
    tierSubtitle: 'Мифический Титан (Уровень 25+)',
    themeTitle: 'МИФИЧЕСКИЙ РАНГ 99',
    cardBg: 'from-[#050507] via-[#121217] to-[#020203]',
    badgeBg: 'bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500',
    badgeText: 'text-white font-black',
    textColor: 'text-white',
    subText: 'text-amber-300',
    statColor: 'text-white',
    labelColor: 'text-amber-400',
    holoClass: 'from-purple-500/30 via-pink-500/20 to-amber-400/30',
    glowShadow: '0 25px 50px -10px rgba(245, 158, 11, 0.5)',
    frameAccent: 'border-amber-400/60 bg-zinc-900/60',
    cardBorder: 'border-amber-400/80',
    headerAccent: 'text-amber-400',
    rarityTag: 'РАНГ 6 • МИФИЧЕСКИЙ'
  }
};

// Aliases for legacy and studio selector keys
export function resolveTierForProfile(profile: UserProfile): CardTierInfo {
  const theme = profile.fifaCardTheme;
  
  if (!theme || theme === 'auto') {
    return getTierByLevel(profile.level);
  }

  if (theme === 'blue_totw') return CARD_TIERS.diamond;
  if (theme === 'onyx') return CARD_TIERS.silver;
  if (CARD_TIERS[theme]) return CARD_TIERS[theme];

  return getTierByLevel(profile.level);
}

export function getTierByLevel(level: number): CardTierInfo {
  if (level >= 25) return CARD_TIERS.mythic;
  if (level >= 18) return CARD_TIERS.red_icon;
  if (level >= 13) return CARD_TIERS.diamond;
  if (level >= 9) return CARD_TIERS.gold;
  if (level >= 5) return CARD_TIERS.silver;
  return CARD_TIERS.bronze;
}
