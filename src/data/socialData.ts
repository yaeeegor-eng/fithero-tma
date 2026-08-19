import { SocialPost, PublicUserProfile, UserProfile, Achievement } from '../types';
import { INITIAL_ACHIEVEMENTS } from './achievementsData';
import { PRESET_AVATARS } from '../utils/avatarUtils';
import { createWorkoutVisualSvg } from '../utils/postImageUtils';

export const COMMUNITY_PROFILES: Record<string, PublicUserProfile> = {
  '1': {
    id: '1',
    name: 'Илья «Spartan» Воронов',
    username: '@spartan_ilya',
    avatarUrl: PRESET_AVATARS.spartan,
    level: 15,
    ovr: 93,
    clubName: 'Spartan Gym Moscow',
    countryCode: '🇷🇺',
    streakDays: 38,
    longestStreak: 45,
    totalWorkouts: 164,
    bio: 'Мастер спорта по тяжелой атлетике. Каждое утро 100 отжиманий и холодный душ. Дисциплина рождает силу.',
    stats: {
      strength: 95,
      endurance: 91,
      agility: 88,
      intellect: 84
    },
    fifaCardTheme: 'red_icon',
    positionTitle: 'STR (Силовой Атлет)',
    unlockedTrophiesCount: 11,
    followersCount: 1420,
    isFollowing: false,
    achievements: INITIAL_ACHIEVEMENTS.map((a, i) => ({
      ...a,
      unlocked: i < 10,
      claimed: true
    }))
  },
  '2': {
    id: '2',
    name: 'Елена Белова',
    username: '@elena_fit_pro',
    avatarUrl: PRESET_AVATARS.elena,
    level: 13,
    ovr: 90,
    clubName: 'Nike Running Community',
    countryCode: '🇷🇺',
    streakDays: 29,
    longestStreak: 32,
    totalWorkouts: 128,
    bio: 'Марафонец и тренер по мобильности. Бег — это медитация в движении.',
    stats: {
      strength: 82,
      endurance: 96,
      agility: 94,
      intellect: 86
    },
    fifaCardTheme: 'blue_totw',
    positionTitle: 'END (Стайер-Спринтер)',
    unlockedTrophiesCount: 9,
    followersCount: 980,
    isFollowing: true,
    achievements: INITIAL_ACHIEVEMENTS.map((a, i) => ({
      ...a,
      unlocked: i < 8,
      claimed: true
    }))
  },
  '3': {
    id: '3',
    name: 'Максим Громов',
    username: '@gromov_power',
    avatarUrl: PRESET_AVATARS.gromov,
    level: 11,
    ovr: 88,
    clubName: 'CrossFit Sever',
    countryCode: '🇷🇺',
    streakDays: 24,
    longestStreak: 28,
    totalWorkouts: 96,
    bio: 'Воркаут, функциональный тренинг и книги по биохакингу. Постоянный прогресс.',
    stats: {
      strength: 90,
      endurance: 86,
      agility: 85,
      intellect: 87
    },
    fifaCardTheme: 'gold',
    positionTitle: 'ALL (Универсал)',
    unlockedTrophiesCount: 8,
    followersCount: 650,
    isFollowing: false,
    achievements: INITIAL_ACHIEVEMENTS.map((a, i) => ({
      ...a,
      unlocked: i < 7,
      claimed: true
    }))
  },
  '5': {
    id: '5',
    name: 'Артем Казаков',
    username: '@artem_kazak',
    avatarUrl: PRESET_AVATARS.kazakov,
    level: 9,
    ovr: 81,
    clubName: 'Power & Mind SPb',
    countryCode: '🇷🇺',
    streakDays: 16,
    longestStreak: 20,
    totalWorkouts: 64,
    bio: 'Шахматы + брусья. Развиваю интеллект и силовую выносливость каждый день.',
    stats: {
      strength: 79,
      endurance: 80,
      agility: 76,
      intellect: 92
    },
    fifaCardTheme: 'gold',
    positionTitle: 'INT (Стратег)',
    unlockedTrophiesCount: 6,
    followersCount: 380,
    isFollowing: false,
    achievements: INITIAL_ACHIEVEMENTS.map((a, i) => ({
      ...a,
      unlocked: i < 5,
      claimed: true
    }))
  },
  '6': {
    id: '6',
    name: 'Анна Соколова',
    username: '@anna_sokol',
    avatarUrl: PRESET_AVATARS.anna,
    level: 8,
    ovr: 79,
    clubName: 'Zen Flow Center',
    countryCode: '🇷🇺',
    streakDays: 12,
    longestStreak: 15,
    totalWorkouts: 52,
    bio: 'Йога, глубокая растяжка и осознанность. Здоровые суставы — основа долголетия.',
    stats: {
      strength: 70,
      endurance: 78,
      agility: 92,
      intellect: 84
    },
    fifaCardTheme: 'gold',
    positionTitle: 'AGI (Мастер Баланса)',
    unlockedTrophiesCount: 5,
    followersCount: 420,
    isFollowing: false,
    achievements: INITIAL_ACHIEVEMENTS.map((a, i) => ({
      ...a,
      unlocked: i < 4,
      claimed: true
    }))
  }
};

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post_1',
    userId: '1',
    userName: 'Илья «Spartan» Воронов',
    userUsername: '@spartan_ilya',
    userAvatar: PRESET_AVATARS.spartan,
    userLevel: 15,
    userOvr: 93,
    userClub: 'Spartan Gym Moscow',
    timestamp: Date.now() - 1000 * 60 * 35, // 35 min ago
    text: 'Закрыл утреннюю сессию отжиманий с AI-камерой! Темп держится отлично, форма чистая. Никаких читерских повторов, только полная амплитуда 🔥💪',
    imageUrl: createWorkoutVisualSvg('strength', 'Отжимания: 45 повторений', '+2 STR'),
    workoutSummary: {
      title: 'Отжимания (AI-Камера)',
      category: 'Сила',
      statGain: '+2 STR',
      durationMinutes: 18,
      calories: 145,
      xpEarned: 85,
      details: '45 отжиманий (3 подхода по 15)'
    },
    likesCount: 24,
    isLiked: false,
    fireCount: 38,
    isFired: true,
    muscleCount: 19,
    isMuscled: false,
    comments: [
      {
        id: 'c1',
        userId: '2',
        userName: 'Елена Белова',
        userAvatar: PRESET_AVATARS.elena,
        text: 'Мощный темп! Ждем в субботу на пробежке 10 км 🏃‍♀️',
        timestamp: Date.now() - 1000 * 60 * 20
      },
      {
        id: 'c2',
        userId: '3',
        userName: 'Максим Громов',
        userAvatar: PRESET_AVATARS.gromov,
        text: 'Красавец, железная форма!',
        timestamp: Date.now() - 1000 * 60 * 12
      }
    ]
  },
  {
    id: 'post_2',
    userId: '2',
    userName: 'Елена Белова',
    userUsername: '@elena_fit_pro',
    userAvatar: PRESET_AVATARS.elena,
    userLevel: 13,
    userOvr: 90,
    userClub: 'Nike Running Community',
    timestamp: Date.now() - 1000 * 60 * 115, // ~2 hours ago
    text: 'Утренние 7.5 км по набережной на рассвете. Прохладный воздух и идеальный пульсовой коридор. Загрузила скриншот трека из Strava ☀️👟',
    imageUrl: createWorkoutVisualSvg('cardio', 'Темповый кросс 7.5 км', '+2 END'),
    workoutSummary: {
      title: 'Уличный Бег (GPS-Скриншот)',
      category: 'Выносливость',
      statGain: '+2 END',
      durationMinutes: 38,
      calories: 420,
      xpEarned: 110,
      details: '7.5 км • Средний темп 5:04 /км'
    },
    likesCount: 31,
    isLiked: true,
    fireCount: 42,
    isFired: true,
    muscleCount: 12,
    isMuscled: false,
    comments: [
      {
        id: 'c3',
        userId: '5',
        userName: 'Артем Казаков',
        userAvatar: PRESET_AVATARS.kazakov,
        text: 'Темп 5:04 — огонь! Пора на полумарафон ⚡',
        timestamp: Date.now() - 1000 * 60 * 45
      }
    ]
  },
  {
    id: 'post_3',
    userId: '5',
    userName: 'Артем Казаков',
    userUsername: '@artem_kazak',
    userAvatar: PRESET_AVATARS.kazakov,
    userLevel: 9,
    userOvr: 81,
    userClub: 'Power & Mind SPb',
    timestamp: Date.now() - 1000 * 60 * 240, // 4 hours ago
    text: 'Прочитал главу книги «Атомные привычки» Джеймса Клира. Главный инсайт: результат — это запаздывающий индикатор ваших ежедневных систем, а не разовых усилий 🧠📖',
    imageUrl: createWorkoutVisualSvg('mind', 'Чтение & Анализ книги', '+2 INT'),
    workoutSummary: {
      title: 'Интеллект и Книги (AI-Конспект)',
      category: 'Интеллект',
      statGain: '+2 INT',
      durationMinutes: 25,
      calories: 40,
      xpEarned: 80,
      details: 'Конспект книги «Атомные привычки»'
    },
    likesCount: 19,
    isLiked: false,
    fireCount: 15,
    isFired: false,
    muscleCount: 8,
    isMuscled: false,
    comments: []
  },
  {
    id: 'post_4',
    userId: '6',
    userName: 'Анна Соколова',
    userUsername: '@anna_sokol',
    userAvatar: PRESET_AVATARS.anna,
    userLevel: 8,
    userOvr: 79,
    userClub: 'Zen Flow Center',
    timestamp: Date.now() - 1000 * 60 * 360, // 6 hours ago
    text: 'Вечерняя растяжка и мобильность плечевого пояса. Снимаем все блоки после рабочего дня за ноутбуком 🧘‍♀️✨',
    imageUrl: createWorkoutVisualSvg('flexibility', 'Комплекс Мобильности', '+2 AGI'),
    workoutSummary: {
      title: 'Растяжка и Мобильность',
      category: 'Ловкость',
      statGain: '+2 AGI',
      durationMinutes: 20,
      calories: 85,
      xpEarned: 70,
      details: 'Комплекс «Здоровая спина и гибкость»'
    },
    likesCount: 27,
    isLiked: false,
    fireCount: 22,
    isFired: false,
    muscleCount: 14,
    isMuscled: true,
    comments: []
  }
];

export function buildPublicProfileFromLocal(
  profile: UserProfile,
  achievements: Achievement[],
  totalFollowers = 124
): PublicUserProfile {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  return {
    id: 'current_user',
    name: profile.name,
    username: profile.username,
    avatarUrl: profile.avatarUrl || PRESET_AVATARS.alex,
    level: profile.level,
    ovr: 82, // calculated dynamically in caller or component
    clubName: profile.clubName || 'Telegram Fit Club',
    countryCode: profile.countryCode || '🇷🇺',
    streakDays: profile.streakDays,
    longestStreak: profile.longestStreak,
    totalWorkouts: profile.totalWorkouts,
    bio: 'Стремлюсь к 99 OVR во всех четырех дисциплинах. Тренируюсь каждый день с FitHero.',
    stats: profile.stats,
    fifaCardTheme: profile.fifaCardTheme,
    positionTitle: profile.positionTitle,
    unlockedTrophiesCount: unlockedCount,
    followersCount: totalFollowers,
    isFollowing: false,
    achievements
  };
}
