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
  if (!tg) return null;

  try {
    const user = tg.initDataUnsafe?.user;
    if (user && user.first_name) {
      return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        photo_url: user.photo_url,
        language_code: user.language_code,
        is_premium: user.is_premium
      };
    }
  } catch (err) {
    console.warn('Could not parse Telegram user info:', err);
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
