// Telegram Mini App (TMA) helper and lifecycle management

export interface TelegramUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
  is_premium?: boolean;
}

export function getTelegramWebApp(): any {
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
    return (window as any).Telegram.WebApp;
  }
  return null;
}

export function isTelegramEnvironment(): boolean {
  const tg = getTelegramWebApp();
  return Boolean(tg && tg.initData && tg.initData.length > 0);
}

export function initTelegramApp() {
  const tg = getTelegramWebApp();
  if (!tg) return;

  try {
    // Notify Telegram that the Mini App is ready to be rendered
    tg.ready();

    // Expand the Web App to maximum height in Telegram client
    tg.expand();

    // Prevent accidental closing of the Mini App during active workouts
    if (typeof tg.enableClosingConfirmation === 'function') {
      tg.enableClosingConfirmation();
    }

    // Set custom header and background colors matching FitHero warm aesthetic
    if (typeof tg.setHeaderColor === 'function') {
      tg.setHeaderColor('#FCFAF7');
    }
    if (typeof tg.setBackgroundColor === 'function') {
      tg.setBackgroundColor('#EFE8DE');
    }
  } catch (err) {
    console.warn('Failed to initialize Telegram WebApp parameters:', err);
  }
}

export function getTelegramUser(): TelegramUser | null {
  const tg = getTelegramWebApp();
  if (tg && tg.initDataUnsafe?.user) {
    const user = tg.initDataUnsafe.user;
    if (user && (user.first_name || user.id)) {
      return {
        id: user.id,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        photo_url: user.photo_url || '',
        language_code: user.language_code || 'ru',
        is_premium: user.is_premium || false
      };
    }
  }

  // Fallback: parse tgWebAppData from URL hash/search if direct object is deferred
  if (typeof window !== 'undefined') {
    try {
      const hash = window.location.hash.slice(1);
      const search = window.location.search.slice(1);
      const params = new URLSearchParams(hash || search);
      const tgData = params.get('tgWebAppData');
      if (tgData) {
        const subParams = new URLSearchParams(tgData);
        const userJson = subParams.get('user');
        if (userJson) {
          const user = JSON.parse(decodeURIComponent(userJson));
          if (user) {
            return {
              id: user.id,
              first_name: user.first_name || '',
              last_name: user.last_name || '',
              username: user.username || '',
              photo_url: user.photo_url || '',
              language_code: user.language_code || 'ru',
              is_premium: user.is_premium || false
            };
          }
        }
      }
    } catch (err) {
      console.warn('URL parsing fallback error:', err);
    }
  }

  return null;
}

export function closeTelegramApp() {
  const tg = getTelegramWebApp();
  if (tg && typeof tg.close === 'function') {
    tg.close();
  }
}

export function openTelegramLink(url: string) {
  const tg = getTelegramWebApp();
  if (tg && typeof tg.openTelegramLink === 'function') {
    tg.openTelegramLink(url);
  } else {
    window.open(url, '_blank');
  }
}
