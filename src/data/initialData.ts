import { UserProfile, LeaderboardUser, Achievement, WorkoutLogEntry } from '../types';
import { PRESET_AVATARS as PRESET_AVATAR_MAP, createSvgAvatarDataUri } from '../utils/avatarUtils';
import { TelegramUser } from '../utils/telegram';

export function calculateOvr(profile: UserProfile): number {
  const { strength, endurance, agility, intellect } = profile.stats;
  // Base weighted average
  const base = (strength * 0.32) + (endurance * 0.28) + (agility * 0.22) + (intellect * 0.18);
  // Level bonus
  const levelMultiplier = 1 + (profile.level - 1) * 0.035;
  const rawOvr = Math.round(base * levelMultiplier);
  return Math.min(99, Math.max(50, rawOvr));
}

export function getXpRequiredForLevel(level: number): number {
  return Math.round(150 * Math.pow(1.28, level - 1));
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
      maxXp: 150,
      totalWorkouts: 0,
      streakDays: 0,
      longestStreak: 0,
      lastWorkoutDate: '',
      stats: {
        strength: 50,
        endurance: 50,
        agility: 50,
        intellect: 50
      },
      fifaCardTheme: 'gold',
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
  currentXp: 340,
  maxXp: 520,
  totalWorkouts: 42,
  streakDays: 14,
  longestStreak: 21,
  lastWorkoutDate: new Date().toISOString().split('T')[0],
  stats: {
    strength: 78,    // Сила
    endurance: 84,   // Выносливость
    agility: 72,     // Ловкость
    intellect: 68    // Интеллект
  },
  fifaCardTheme: 'gold',
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
    level: 15,
    ovr: 93,
    weeklyXp: 1840,
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
    level: 13,
    ovr: 90,
    weeklyXp: 1620,
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
    level: 11,
    ovr: 88,
    weeklyXp: 1450,
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
    ovr: 82,
    weeklyXp: 980,
    streak: 14,
    badge: '🔥 На подъеме',
    league: 'Золото',
    isCurrentUser: true
  },
  {
    id: '5',
    rank: 5,
    name: 'Артем Казаков',
    username: '@kazakov_mma',
    avatar: PRESET_AVATAR_MAP.kazakov,
    level: 7,
    ovr: 79,
    weeklyXp: 820,
    streak: 9,
    badge: '🥋 Боец',
    league: 'Золото'
  },
  {
    id: '6',
    rank: 6,
    name: 'Анна Соколова',
    username: '@anna_sokol',
    avatar: PRESET_AVATAR_MAP.anna,
    level: 8,
    ovr: 79,
    weeklyXp: 780,
    streak: 12,
    badge: '🧘 Йогиня',
    league: 'Золото'
  }
];

export const INITIAL_RECENT_LOGS: WorkoutLogEntry[] = [
  {
    id: 'log_1',
    exerciseId: 'pushups_classic',
    exerciseTitle: 'Отжимания классические',
    category: 'Сила',
    timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    dateStr: new Date().toISOString().split('T')[0],
    durationMinutes: 15,
    setsCompleted: 4,
    repsOrDistance: '80 повторений',
    caloriesBurned: 110,
    xpEarned: 50,
    statsEarned: { strength: 3, endurance: 1 }
  },
  {
    id: 'log_2',
    exerciseId: 'running_5k',
    exerciseTitle: 'Темповый кросс 5 км',
    category: 'Выносливость',
    timestamp: Date.now() - 1000 * 60 * 60 * 26, // yesterday
    dateStr: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    durationMinutes: 28,
    setsCompleted: 1,
    repsOrDistance: '5.2 км (4:55 мин/км)',
    caloriesBurned: 380,
    xpEarned: 120,
    statsEarned: { endurance: 6, strength: 1 }
  },
  {
    id: 'log_3',
    exerciseId: 'shadow_boxing',
    exerciseTitle: 'Боксерский бой с тенью',
    category: 'Ловкость',
    timestamp: Date.now() - 1000 * 60 * 60 * 50, // 2 days ago
    dateStr: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    durationMinutes: 18,
    setsCompleted: 3,
    repsOrDistance: '3 раунда',
    caloriesBurned: 160,
    xpEarned: 60,
    statsEarned: { agility: 5, endurance: 2 }
  },
  {
    id: 'log_4',
    exerciseId: 'mindful_breathwork',
    exerciseTitle: 'Практика фокусировки & Box 4x4',
    category: 'Интеллект',
    timestamp: Date.now() - 1000 * 60 * 60 * 74, // 3 days ago
    dateStr: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    durationMinutes: 12,
    setsCompleted: 1,
    repsOrDistance: '12 минут',
    caloriesBurned: 30,
    xpEarned: 50,
    statsEarned: { intellect: 5, endurance: 1 }
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
