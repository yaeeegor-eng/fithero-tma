import { UserProfile, LeaderboardUser, Achievement, WorkoutLogEntry } from '../types';
import { PRESET_AVATARS as PRESET_AVATAR_MAP, createSvgAvatarDataUri } from '../utils/avatarUtils';
import { TelegramUser } from '../utils/telegram';
import { MAX_LEVEL } from '../utils/cardTierUtils';

export function calculateOvr(profile: UserProfile): number {
  const { strength, endurance, agility, intellect } = profile.stats;
  // Base weighted average
  const base = (strength * 0.32) + (endurance * 0.28) + (agility * 0.22) + (intellect * 0.18);
  // Level bonus (1 to 50 max)
  const levelMultiplier = 1 + (Math.min(MAX_LEVEL, profile.level) - 1) * 0.012;
  const rawOvr = Math.round(base * levelMultiplier);
  return Math.min(99, Math.max(50, rawOvr));
}

/**
 * FitHero XP progression curve:
 * - Max level = 50.
 * - Levels 1–10 (Bronze): Takes ~1 week of daily training (~810 cumulative XP).
 *   (Level 1: 50 XP, Level 2: 60 XP, ... Level 9: 130 XP).
 * - Levels 11–20 (Silver): Takes ~1–2 months (~3,500 cumulative XP).
 * - Levels 21–30 (Gold): Takes ~3–5 months (~10,000 cumulative XP).
 * - Levels 31–40 (Diamond): Takes ~6–8 months (~20,000 cumulative XP).
 * - Levels 41–50 (Legendary): Takes ~12 months (~36,000–40,000 cumulative XP).
 */
export function getXpRequiredForLevel(level: number): number {
  if (level >= MAX_LEVEL) return 999999;
  if (level <= 1) return 50;
  if (level <= 9) {
    // 50, 60, 70, 80, 90, 100, 110, 120, 130 (Sum = 810 XP, ~7 days of workouts)
    return 40 + level * 10;
  }
  if (level <= 20) {
    // Levels 10 to 20: 150 -> 350
    return 130 + (level - 9) * 20;
  }
  if (level <= 30) {
    // Levels 21 to 30: 388 -> 730
    return 350 + (level - 20) * 38;
  }
  if (level <= 40) {
    // Levels 31 to 40: 800 -> 1340
    return 740 + (level - 30) * 60;
  }
  // Levels 41 to 49 (reaching 50): 1440 -> 2160
  return 1350 + (level - 40) * 90;
}

export function createStarterProfile(tgUser?: TelegramUser | null): UserProfile {
  if (tgUser && (tgUser.first_name || tgUser.id)) {
    const fullName = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ').trim() || `Атлет #${tgUser.id}`;
    const initials = (fullName.split(' ').filter(Boolean).map((w) => w[0]).join('') || 'АТ').slice(0, 2).toUpperCase();
    const fallbackSvg = createSvgAvatarDataUri(initials, '#0F172A', '#D21624', 'striker');
    const avatar = tgUser.photo_url || fallbackSvg;
    const username = tgUser.username ? `@${tgUser.username}` : `@id${tgUser.id || 'user'}`;

    return {
      name: fullName,
      username: username,
      avatarUrl: avatar,
      avatarPreset: 'striker',
      level: 1,
      currentXp: 0,
      maxXp: getXpRequiredForLevel(1),
      totalWorkouts: 0,
      streakDays: 0,
      longestStreak: 0,
      lastWorkoutDate: '',
      bio: 'Стремлюсь к 99 OVR. Дисциплина каждый день.',
      stats: {
        strength: 50,
        endurance: 50,
        agility: 50,
        intellect: 50
      },
      fifaCardTheme: 'auto',
      positionTitle: 'ALL (Новичок)',
      clubName: 'Telegram Fit Club',
      countryCode: tgUser.language_code === 'ru' ? '🇷🇺' : '🌐'
    };
  }

  return INITIAL_USER_PROFILE;
}

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Алекс Смирнов',
  username: '@alex_fit',
  avatarUrl: PRESET_AVATAR_MAP.alex,
  avatarPreset: 'striker',
  level: 8,
  currentXp: 45,
  maxXp: getXpRequiredForLevel(8),
  totalWorkouts: 28,
  streakDays: 14,
  longestStreak: 21,
  lastWorkoutDate: new Date().toISOString().split('T')[0],
  bio: 'Стремлюсь к 99 OVR во всех четырех дисциплинах. Тренируюсь каждый день с FitHero.',
  stats: {
    strength: 72,    // Сила
    endurance: 78,   // Выносливость
    agility: 68,     // Ловкость
    intellect: 65    // Интеллект
  },
  fifaCardTheme: 'auto',
  positionTitle: 'ALL (Универсал)',
  clubName: 'Telegram Fit Club',
  countryCode: '🇷🇺'
};

export { INITIAL_ACHIEVEMENTS, getFreshAchievements } from './achievementsData';

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    id: '1',
    rank: 1,
    name: 'Илья «Spartan» Воронов',
    username: '@spartan_ilya',
    avatar: PRESET_AVATAR_MAP.spartan,
    level: 32,
    ovr: 91,
    weeklyXp: 620,
    streak: 38,
    badge: '🏆 Топ 1 СНГ',
    league: 'Чемпионы'
  },
  {
    id: '2',
    rank: 2,
    name: 'Елена Белова',
    username: '@elena_fit_pro',
    avatar: PRESET_AVATAR_MAP.elena,
    level: 26,
    ovr: 88,
    weeklyXp: 540,
    streak: 29,
    badge: '⚡ Скоростной демон',
    league: 'Чемпионы'
  },
  {
    id: '3',
    rank: 3,
    name: 'Максим Громов',
    username: '@gromov_power',
    avatar: PRESET_AVATAR_MAP.gromov,
    level: 22,
    ovr: 86,
    weeklyXp: 480,
    streak: 24,
    badge: '🛡️ Стена',
    league: 'Алмаз'
  },
  {
    id: 'current_user',
    rank: 4,
    name: 'Алекс Смирнов',
    username: '@alex_fit',
    avatar: PRESET_AVATAR_MAP.alex,
    level: 8,
    ovr: 79,
    weeklyXp: 310,
    streak: 14,
    badge: '🔥 На подъеме',
    league: 'Бронза',
    isCurrentUser: true
  },
  {
    id: '5',
    rank: 5,
    name: 'Артем Казаков',
    username: '@kazakov_mma',
    avatar: PRESET_AVATAR_MAP.kazakov,
    level: 6,
    ovr: 75,
    weeklyXp: 260,
    streak: 9,
    badge: '🥋 Боец',
    league: 'Бронза'
  },
  {
    id: '6',
    rank: 6,
    name: 'Анна Соколова',
    username: '@anna_sokol',
    avatar: PRESET_AVATAR_MAP.anna,
    level: 5,
    ovr: 74,
    weeklyXp: 220,
    streak: 12,
    badge: '🧘 Йогиня',
    league: 'Бронза'
  }
];

export const INITIAL_RECENT_LOGS: WorkoutLogEntry[] = [
  {
    id: 'log_1',
    exerciseId: 'pushups_camera',
    exerciseTitle: 'Отжимания от пола',
    category: 'Сила',
    timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    dateStr: new Date().toISOString().split('T')[0],
    durationMinutes: 10,
    setsCompleted: 2,
    repsOrDistance: '30 отжиманий',
    caloriesBurned: 45,
    xpEarned: 35,
    statsEarned: { strength: 2, endurance: 1 }
  },
  {
    id: 'log_2',
    exerciseId: 'running_screenshot',
    exerciseTitle: 'Бег (Кросс / Улица / Дорожка)',
    category: 'Выносливость',
    timestamp: Date.now() - 1000 * 60 * 60 * 26, // yesterday
    dateStr: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    durationMinutes: 28,
    setsCompleted: 1,
    repsOrDistance: '5.2 км (4:55 мин/км)',
    caloriesBurned: 340,
    xpEarned: 50,
    statsEarned: { endurance: 3, agility: 1 }
  },
  {
    id: 'log_3',
    exerciseId: 'stretching_camera',
    exerciseTitle: 'Растяжка и Мобильность',
    category: 'Ловкость',
    timestamp: Date.now() - 1000 * 60 * 60 * 50, // 2 days ago
    dateStr: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    durationMinutes: 15,
    setsCompleted: 4,
    repsOrDistance: '4 позы растяжки',
    caloriesBurned: 70,
    xpEarned: 30,
    statsEarned: { agility: 3, strength: 1 }
  },
  {
    id: 'log_4',
    exerciseId: 'reading_intellect',
    exerciseTitle: 'Осознанное чтение',
    category: 'Интеллект',
    timestamp: Date.now() - 1000 * 60 * 60 * 74, // 3 days ago
    dateStr: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    durationMinutes: 20,
    setsCompleted: 1,
    repsOrDistance: '1 прочитанная глава',
    caloriesBurned: 35,
    xpEarned: 30,
    statsEarned: { intellect: 3, endurance: 1 }
  }
];

export const PRESET_AVATARS = [
  {
    id: 'striker',
    name: 'Атлет / Нападающий',
    url: PRESET_AVATAR_MAP.alex
  },
  {
    id: 'spartan',
    name: 'Силовик / Спартанец',
    url: PRESET_AVATAR_MAP.spartan
  },
  {
    id: 'runner',
    name: 'Бегун / Скорость',
    url: PRESET_AVATAR_MAP.elena
  },
  {
    id: 'crossfit',
    name: 'Кроссфит / Мощь',
    url: PRESET_AVATAR_MAP.gromov
  },
  {
    id: 'scholar',
    name: 'Стратег / Интеллект',
    url: PRESET_AVATAR_MAP.kazakov
  },
  {
    id: 'yogi',
    name: 'Йога / Баланс',
    url: PRESET_AVATAR_MAP.anna
  }
];
