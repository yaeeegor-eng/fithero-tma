// FitHero FUT Card Level Progression & Tier Definitions
import { UserProfile } from '../types';

export const MAX_LEVEL = 50;

export interface CardTierInfo {
  tierId: 'bronze' | 'silver' | 'gold' | 'diamond' | 'red_icon' | 'mythic';
  minLevel: number;
  maxLevel: number;
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
  glassBg: string;
  glassBorder: string;
  chipBg: string;
  accentHex: string;
  primaryHex: string;
  secondaryHex: string;
}

export const CARD_TIERS: Record<string, CardTierInfo> = {
  bronze: {
    tierId: 'bronze',
    minLevel: 1,
    maxLevel: 10,
    tierNumber: 1,
    tierName: 'Бронзовый Новичок',
    tierSubtitle: 'Бронзовый Новичок (Уровни 1–10)',
    themeTitle: 'BRONZE TIER',
    cardBg: 'from-[#221711] via-[#1a110a] to-[#0d0805]',
    badgeBg: 'bg-amber-900/60 backdrop-blur-md border border-amber-600/40 text-amber-200',
    badgeText: 'text-amber-200 font-bold',
    textColor: 'text-amber-100',
    subText: 'text-amber-300/70',
    statColor: 'text-white',
    labelColor: 'text-amber-300/80',
    holoClass: 'from-amber-500/10 via-transparent to-amber-700/15',
    glowShadow: '0 20px 40px -10px rgba(180, 83, 9, 0.25)',
    frameAccent: 'border-amber-600/30',
    cardBorder: 'border-amber-700/40',
    headerAccent: 'text-amber-400',
    rarityTag: 'БРОНЗА',
    glassBg: 'bg-amber-950/20 backdrop-blur-md',
    glassBorder: 'border-white/10',
    chipBg: 'bg-white/5 border border-white/10',
    accentHex: '#D97706',
    primaryHex: '#221711',
    secondaryHex: '#0d0805'
  },
  silver: {
    tierId: 'silver',
    minLevel: 11,
    maxLevel: 20,
    tierNumber: 2,
    tierName: 'Серебряный Атлет',
    tierSubtitle: 'Серебряный Атлет (Уровни 11–20)',
    themeTitle: 'SILVER TIER',
    cardBg: 'from-[#1e2530] via-[#121720] to-[#0a0d13]',
    badgeBg: 'bg-slate-700/60 backdrop-blur-md border border-slate-400/40 text-slate-200',
    badgeText: 'text-slate-100 font-bold',
    textColor: 'text-slate-100',
    subText: 'text-slate-400',
    statColor: 'text-white',
    labelColor: 'text-slate-300/80',
    holoClass: 'from-slate-300/15 via-transparent to-slate-500/15',
    glowShadow: '0 20px 40px -10px rgba(148, 163, 184, 0.25)',
    frameAccent: 'border-slate-400/30',
    cardBorder: 'border-slate-500/40',
    headerAccent: 'text-slate-300',
    rarityTag: 'СЕРЕБРО',
    glassBg: 'bg-slate-900/30 backdrop-blur-md',
    glassBorder: 'border-white/10',
    chipBg: 'bg-white/5 border border-white/10',
    accentHex: '#94A3B8',
    primaryHex: '#1e2530',
    secondaryHex: '#0a0d13'
  },
  gold: {
    tierId: 'gold',
    minLevel: 21,
    maxLevel: 30,
    tierNumber: 3,
    tierName: 'Золотая Элита',
    tierSubtitle: 'Золотая Элита (Уровни 21–30)',
    themeTitle: 'GOLD ELITE',
    cardBg: 'from-[#2b200b] via-[#1c1404] to-[#0e0901]',
    badgeBg: 'bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-200',
    badgeText: 'text-amber-200 font-bold',
    textColor: 'text-amber-50',
    subText: 'text-amber-200/70',
    statColor: 'text-white',
    labelColor: 'text-amber-300/80',
    holoClass: 'from-amber-400/15 via-yellow-200/5 to-amber-600/20',
    glowShadow: '0 25px 45px -10px rgba(245, 158, 11, 0.3)',
    frameAccent: 'border-amber-400/40',
    cardBorder: 'border-amber-500/40',
    headerAccent: 'text-amber-300',
    rarityTag: 'ЗОЛОТО',
    glassBg: 'bg-amber-950/25 backdrop-blur-md',
    glassBorder: 'border-amber-400/20',
    chipBg: 'bg-white/5 border border-amber-400/15',
    accentHex: '#F59E0B',
    primaryHex: '#2b200b',
    secondaryHex: '#0e0901'
  },
  diamond: {
    tierId: 'diamond',
    minLevel: 31,
    maxLevel: 40,
    tierNumber: 4,
    tierName: 'Алмазный Чемпион',
    tierSubtitle: 'Алмазный Чемпион (Уровни 31–40)',
    themeTitle: 'DIAMOND',
    cardBg: 'from-[#0d1e38] via-[#091426] to-[#040810]',
    badgeBg: 'bg-sky-500/20 backdrop-blur-md border border-sky-400/40 text-sky-200',
    badgeText: 'text-sky-200 font-bold',
    textColor: 'text-white',
    subText: 'text-sky-200/70',
    statColor: 'text-white',
    labelColor: 'text-sky-300/80',
    holoClass: 'from-cyan-400/20 via-sky-300/5 to-blue-600/25',
    glowShadow: '0 25px 45px -10px rgba(14, 165, 233, 0.35)',
    frameAccent: 'border-sky-400/40',
    cardBorder: 'border-sky-500/40',
    headerAccent: 'text-sky-300',
    rarityTag: 'АЛМАЗ',
    glassBg: 'bg-sky-950/30 backdrop-blur-md',
    glassBorder: 'border-sky-400/20',
    chipBg: 'bg-white/5 border border-sky-400/15',
    accentHex: '#0EA5E9',
    primaryHex: '#0d1e38',
    secondaryHex: '#040810'
  },
  red_icon: {
    tierId: 'red_icon',
    minLevel: 41,
    maxLevel: 50,
    tierNumber: 5,
    tierName: 'Легендарная Икона',
    tierSubtitle: 'Легендарная Икона (Уровни 41–50)',
    themeTitle: 'LEGEND ICON',
    cardBg: 'from-[#2b0c10] via-[#1a0609] to-[#0d0203]',
    badgeBg: 'bg-rose-600/25 backdrop-blur-md border border-rose-500/40 text-rose-200',
    badgeText: 'text-rose-200 font-bold',
    textColor: 'text-white',
    subText: 'text-rose-200/70',
    statColor: 'text-white',
    labelColor: 'text-rose-300/80',
    holoClass: 'from-rose-500/20 via-amber-400/10 to-red-600/25',
    glowShadow: '0 25px 45px -10px rgba(210, 22, 36, 0.4)',
    frameAccent: 'border-rose-500/40',
    cardBorder: 'border-rose-500/50',
    headerAccent: 'text-rose-300',
    rarityTag: 'ЛЕГЕНДА',
    glassBg: 'bg-rose-950/30 backdrop-blur-md',
    glassBorder: 'border-rose-500/25',
    chipBg: 'bg-white/5 border border-rose-500/20',
    accentHex: '#D21624',
    primaryHex: '#2b0c10',
    secondaryHex: '#0d0203'
  },
  mythic: {
    tierId: 'mythic',
    minLevel: 41,
    maxLevel: 50,
    tierNumber: 5,
    tierName: 'Мифический Титан',
    tierSubtitle: 'Мифический Титан (Уровень 50 MAX)',
    themeTitle: 'MYTHIC 50',
    cardBg: 'from-[#1a1226] via-[#0f0a17] to-[#07040b]',
    badgeBg: 'bg-purple-500/20 backdrop-blur-md border border-purple-400/40 text-purple-200',
    badgeText: 'text-purple-200 font-bold',
    textColor: 'text-white',
    subText: 'text-purple-200/70',
    statColor: 'text-white',
    labelColor: 'text-purple-300/80',
    holoClass: 'from-purple-500/20 via-pink-400/10 to-amber-400/20',
    glowShadow: '0 25px 50px -10px rgba(168, 85, 247, 0.4)',
    frameAccent: 'border-purple-400/40',
    cardBorder: 'border-purple-500/50',
    headerAccent: 'text-purple-300',
    rarityTag: 'МИФИК',
    glassBg: 'bg-purple-950/30 backdrop-blur-md',
    glassBorder: 'border-purple-400/25',
    chipBg: 'bg-white/5 border border-purple-400/20',
    accentHex: '#A855F7',
    primaryHex: '#1a1226',
    secondaryHex: '#07040b'
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
  if (level >= 41) return CARD_TIERS.red_icon;
  if (level >= 31) return CARD_TIERS.diamond;
  if (level >= 21) return CARD_TIERS.gold;
  if (level >= 11) return CARD_TIERS.silver;
  return CARD_TIERS.bronze;
}
