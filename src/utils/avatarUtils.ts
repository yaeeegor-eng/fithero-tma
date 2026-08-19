// Offline SVG Avatar Presets and Generator for FitHero Athletes
export interface AvatarPresetOption {
  id: string;
  name: string;
  category: 'strength' | 'endurance' | 'agility' | 'intellect' | 'striker';
  svgDataUri: string;
  bgGradient: string;
  accentColor: string;
}

export function createSvgAvatarDataUri(
  initials: string,
  bgColor: string = '#0F172A',
  accentColor: string = '#D21624',
  iconType: 'striker' | 'spartan' | 'runner' | 'crossfit' | 'scholar' | 'yogi' = 'striker'
): string {
  const iconShapes = {
    striker: `<circle cx="50" cy="50" r="32" fill="none" stroke="${accentColor}" stroke-width="4" stroke-dasharray="6,4"/>
              <path d="M50 22 L58 40 L78 42 L62 56 L68 76 L50 64 L32 76 L38 56 L22 42 L42 40 Z" fill="${accentColor}"/>`,
    spartan: `<path d="M50 20 C36 20 28 32 28 48 C28 66 38 78 50 82 C62 78 72 66 72 48 C72 32 64 20 50 20 Z" fill="none" stroke="${accentColor}" stroke-width="5"/>
              <path d="M48 24 L52 24 L52 65 L48 65 Z" fill="${accentColor}"/>
              <path d="M36 44 L64 44" stroke="${accentColor}" stroke-width="4"/>`,
    runner: `<circle cx="50" cy="28" r="10" fill="${accentColor}"/>
             <path d="M46 38 L36 54 L24 50 M46 44 L60 48 L68 62 M48 48 L48 66 L38 82 M48 66 L62 78" stroke="${accentColor}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    crossfit: `<rect x="22" y="44" width="10" height="12" rx="2" fill="${accentColor}"/>
               <rect x="68" y="44" width="10" height="12" rx="2" fill="${accentColor}"/>
               <rect x="30" y="48" width="40" height="4" rx="1" fill="#E2E8F0"/>
               <circle cx="50" cy="50" r="30" fill="none" stroke="${accentColor}" stroke-width="3" stroke-dasharray="4,4"/>`,
    scholar: `<path d="M50 26 L22 40 L50 54 L78 40 Z" fill="${accentColor}"/>
              <path d="M30 46 L30 64 C30 72 50 78 50 78 C50 78 70 72 70 64 L70 46" fill="none" stroke="${accentColor}" stroke-width="4"/>
              <path d="M78 40 L78 66" stroke="#E2E8F0" stroke-width="3"/>`,
    yogi: `<circle cx="50" cy="28" r="9" fill="${accentColor}"/>
           <path d="M50 37 C42 42 34 50 34 60 C34 72 44 76 50 76 C56 76 66 72 66 60 C66 50 58 42 50 37 Z" fill="none" stroke="${accentColor}" stroke-width="4"/>
           <path d="M26 68 C36 78 64 78 74 68" stroke="${accentColor}" stroke-width="4" stroke-linecap="round" fill="none"/>`
  };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgColor}" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="28" fill="url(#bgGrad)"/>
    <g opacity="0.9">
      ${iconShapes[iconType] || iconShapes.striker}
    </g>
    <text x="50" y="88" font-family="monospace, sans-serif" font-weight="900" font-size="13" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">${initials.toUpperCase()}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PRESET_AVATARS: Record<string, string> = {
  alex: createSvgAvatarDataUri('АС', '#0F172A', '#D21624', 'striker'),
  spartan: createSvgAvatarDataUri('ИВ', '#1E1B4B', '#EF4444', 'spartan'),
  elena: createSvgAvatarDataUri('ЕБ', '#0C4A6E', '#0284C7', 'runner'),
  gromov: createSvgAvatarDataUri('МГ', '#14532D', '#22C55E', 'crossfit'),
  kazakov: createSvgAvatarDataUri('АК', '#4C1D95', '#A855F7', 'scholar'),
  anna: createSvgAvatarDataUri('АС', '#701A75', '#EC4899', 'yogi')
};

export function getAthleteFallbackAvatar(name: string, id?: string): string {
  if (id === '1' || name.includes('Воронов') || name.includes('Spartan')) return PRESET_AVATARS.spartan;
  if (id === '2' || name.includes('Белова') || name.includes('Елена')) return PRESET_AVATARS.elena;
  if (id === '3' || name.includes('Громов') || name.includes('Максим')) return PRESET_AVATARS.gromov;
  if (id === '5' || name.includes('Казаков') || name.includes('Артем')) return PRESET_AVATARS.kazakov;
  if (id === '6' || name.includes('Соколова') || name.includes('Анна')) return PRESET_AVATARS.anna;
  
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('') || 'FH';

  return createSvgAvatarDataUri(initials, '#0F172A', '#D21624', 'striker');
}
