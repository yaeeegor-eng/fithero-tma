// Offline SVG Graphics for Social Feed Posts
export function createWorkoutVisualSvg(
  category: 'strength' | 'cardio' | 'endurance' | 'agility' | 'flexibility' | 'mind' | 'intellect' | 'general' = 'strength',
  title: string = 'Тренировка FitHero',
  statGain: string = '+2 STR'
): string {
  const configs = {
    strength: {
      bg: '#18181B',
      accent: '#D21624',
      icon: `<rect x="60" y="100" width="30" height="40" rx="6" fill="#D21624"/>
             <rect x="230" y="100" width="30" height="40" rx="6" fill="#D21624"/>
             <rect x="90" y="115" width="140" height="10" rx="4" fill="#FFFFFF"/>
             <circle cx="160" cy="120" r="70" fill="none" stroke="#D21624" stroke-width="6" stroke-dasharray="10,8"/>`
    },
    cardio: {
      bg: '#0F172A',
      accent: '#0284C7',
      icon: `<path d="M60 140 Q 110 80, 160 130 T 260 90" fill="none" stroke="#0284C7" stroke-width="8" stroke-linecap="round"/>
             <circle cx="210" cy="80" r="16" fill="#FFFFFF"/>
             <path d="M205 100 L185 135 L160 125" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" fill="none"/>`
    },
    endurance: {
      bg: '#0F172A',
      accent: '#0284C7',
      icon: `<path d="M60 140 Q 110 80, 160 130 T 260 90" fill="none" stroke="#0284C7" stroke-width="8" stroke-linecap="round"/>
             <circle cx="210" cy="80" r="16" fill="#FFFFFF"/>
             <path d="M205 100 L185 135 L160 125" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" fill="none"/>`
    },
    agility: {
      bg: '#1E1B4B',
      accent: '#8B5CF6',
      icon: `<circle cx="160" cy="85" r="18" fill="#8B5CF6"/>
             <path d="M160 105 C130 115, 110 135, 110 160 C110 185, 140 195, 160 195 C180 195, 210 185, 210 160" fill="none" stroke="#8B5CF6" stroke-width="8" stroke-linecap="round"/>
             <path d="M100 170 C130 190, 190 190, 220 170" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" fill="none"/>`
    },
    flexibility: {
      bg: '#1E1B4B',
      accent: '#8B5CF6',
      icon: `<circle cx="160" cy="85" r="18" fill="#8B5CF6"/>
             <path d="M160 105 C130 115, 110 135, 110 160 C110 185, 140 195, 160 195 C180 195, 210 185, 210 160" fill="none" stroke="#8B5CF6" stroke-width="8" stroke-linecap="round"/>`
    },
    intellect: {
      bg: '#022C22',
      accent: '#10B981',
      icon: `<path d="M160 80 L80 120 L160 160 L240 120 Z" fill="#10B981"/>
             <path d="M100 135 L100 180 C100 200, 160 215, 160 215 C160 215, 220 200, 220 180 L220 135" fill="none" stroke="#10B981" stroke-width="7"/>`
    },
    mind: {
      bg: '#022C22',
      accent: '#10B981',
      icon: `<path d="M160 80 L80 120 L160 160 L240 120 Z" fill="#10B981"/>
             <path d="M100 135 L100 180 C100 200, 160 215, 160 215 C160 215, 220 200, 220 180 L220 135" fill="none" stroke="#10B981" stroke-width="7"/>`
    },
    general: {
      bg: '#18181B',
      accent: '#D21624',
      icon: `<circle cx="160" cy="120" r="60" fill="none" stroke="#D21624" stroke-width="6"/>`
    }
  };

  const c = configs[category] || configs.strength;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="640" height="400">
    <defs>
      <linearGradient id="pGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c.bg}" />
        <stop offset="100%" stop-color="#09090B" />
      </linearGradient>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="320" height="200" rx="20" fill="url(#pGrad)"/>
    <rect width="320" height="200" rx="20" fill="url(#grid)"/>
    <g opacity="0.85">
      ${c.icon}
    </g>
    <rect x="20" y="20" width="85" height="24" rx="8" fill="${c.accent}"/>
    <text x="62" y="36" font-family="monospace, sans-serif" font-weight="900" font-size="11" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">${category.toUpperCase()}</text>
    
    <text x="20" y="175" font-family="system-ui, sans-serif" font-weight="900" font-size="14" fill="#FFFFFF">${title}</text>
    <text x="300" y="175" font-family="monospace, sans-serif" font-weight="900" font-size="12" fill="${c.accent}" text-anchor="end">${statGain}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
