// Haptic feedback simulator for Telegram WebApp environment
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') {
  if (typeof window !== 'undefined') {
    // Check if running inside actual Telegram WebApp
    const tg = (window as unknown as { Telegram?: { WebApp?: { HapticFeedback?: { impactOccurred: (style: string) => void; notificationOccurred: (type: string) => void } } } }).Telegram;
    if (tg?.WebApp?.HapticFeedback) {
      if (type === 'success' || type === 'warning' || type === 'error') {
        tg.WebApp.HapticFeedback.notificationOccurred(type);
      } else {
        tg.WebApp.HapticFeedback.impactOccurred(type);
      }
      return;
    }

    // Fallback to standard Navigator Vibration API if supported
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(15);
          break;
        case 'medium':
          navigator.vibrate(30);
          break;
        case 'heavy':
          navigator.vibrate([40, 20, 40]);
          break;
        case 'success':
          navigator.vibrate([20, 30, 40]);
          break;
        case 'error':
          navigator.vibrate([50, 40, 50]);
          break;
        default:
          navigator.vibrate(20);
      }
    }
  }
}
