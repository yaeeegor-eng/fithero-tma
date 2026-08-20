import { UserProfile } from '../types';
import { calculateOvr } from '../data/initialData';
import { resolveTierForProfile } from './cardTierUtils';

export async function generateFifaCardPng(profile: UserProfile, cardElementId: string): Promise<string> {
  const canvas = document.createElement('canvas');
  const width = 640;
  const height = 920;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context');

  const tier = resolveTierForProfile(profile);
  const ovr = calculateOvr(profile);

  const c1 = tier.primaryHex || '#1e2530';
  const c3 = tier.secondaryHex || '#0a0d13';
  const accentCol = tier.accentHex || '#F59E0B';
  const textCol = '#FFFFFF';
  const labelCol = tier.accentHex || '#F59E0B';

  // Background Theme Gradient
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, c1);
  bgGradient.addColorStop(0.5, '#12161F');
  bgGradient.addColorStop(1, c3);

  // Outer Card Path (Rounded 56px)
  const r = 56;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, r);
  ctx.clip();

  // Fill Background
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Ambient Radial Glow from top
  const radialGlow = ctx.createRadialGradient(width / 2, 200, 50, width / 2, 200, 450);
  radialGlow.addColorStop(0, `${accentCol}33`);
  radialGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, width, height);

  // Subtle Geometric Micro-Grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Card Outer Glass Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.restore();

  // -------------------------------------------------------------
  // 60% HERO PHOTO CONTAINER (x: 24, y: 24, w: 592, h: 570, r: 44)
  // -------------------------------------------------------------
  const photoX = 24;
  const photoY = 24;
  const photoW = width - 48;
  const photoH = 570;
  const photoR = 44;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, photoR);
  ctx.clip();

  // Photo Background
  ctx.fillStyle = '#0a0d14';
  ctx.fillRect(photoX, photoY, photoW, photoH);

  let imageDrawn = false;
  if (profile.avatarUrl) {
    try {
      const img = new Image();
      if (!profile.avatarUrl.startsWith('data:')) {
        img.crossOrigin = 'anonymous';
      }
      img.src = profile.avatarUrl;
      await new Promise<void>((resolve) => {
        img.onload = () => {
          try {
            const aspectImg = img.width / img.height;
            const aspectBox = photoW / photoH;
            let drawW = photoW;
            let drawH = photoH;
            let drawX = photoX;
            let drawY = photoY;

            if (aspectImg > aspectBox) {
              drawW = photoH * aspectImg;
              drawX = photoX - (drawW - photoW) / 2;
            } else {
              drawH = photoW / aspectImg;
              drawY = photoY - (drawH - photoH) / 2;
            }

            ctx.drawImage(img, drawX, drawY, drawW, drawH);
            imageDrawn = true;
          } catch {
            imageDrawn = false;
          }
          resolve();
        };
        img.onerror = () => resolve();
        setTimeout(resolve, 1500);
      });
    } catch {
      imageDrawn = false;
    }
  }

  if (!imageDrawn) {
    const initials = (profile.name.split(' ').map((w) => w[0]).join('') || 'FH').slice(0, 2).toUpperCase();
    ctx.fillStyle = '#111827';
    ctx.fillRect(photoX, photoY, photoW, photoH);

    ctx.fillStyle = accentCol;
    ctx.font = '900 120px -apple-system, BlinkMacSystemFont, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(initials, photoX + photoW / 2, photoY + photoH / 2 + 40);
  }

  // Soft Bottom & Top Vignette Gradients for Glass Blending
  const photoVignette = ctx.createLinearGradient(0, photoY, 0, photoY + photoH);
  photoVignette.addColorStop(0, 'rgba(0,0,0,0.4)');
  photoVignette.addColorStop(0.4, 'rgba(0,0,0,0.1)');
  photoVignette.addColorStop(0.7, 'rgba(0,0,0,0.3)');
  photoVignette.addColorStop(1, 'rgba(0,0,0,0.85)');
  ctx.fillStyle = photoVignette;
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Photo Container Glass Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();

  // -------------------------------------------------------------
  // FLOATING GLASS BADGES OVER PHOTO
  // -------------------------------------------------------------

  // 1. Top-Left: OVR + Position Glass Badge
  const ovrBoxX = photoX + 18;
  const ovrBoxY = photoY + 18;
  const ovrBoxW = 105;
  const ovrBoxH = 95;

  ctx.fillStyle = 'rgba(10, 15, 25, 0.65)';
  ctx.beginPath();
  ctx.roundRect(ovrBoxX, ovrBoxY, ovrBoxW, ovrBoxH, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = textCol;
  ctx.font = '900 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
  ctx.fillText(ovr.toString(), ovrBoxX + ovrBoxW / 2, ovrBoxY + 54);

  const posText = profile.positionTitle.split(' ')[0] === 'ALL' ? 'УНИВЕРСАЛ' : profile.positionTitle.split(' ')[0];
  ctx.fillStyle = labelCol;
  ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, monospace';
  ctx.fillText(posText.slice(0, 10), ovrBoxX + ovrBoxW / 2, ovrBoxY + 80);

  // Country & Flag Pill below OVR box
  ctx.fillStyle = 'rgba(10, 15, 25, 0.55)';
  ctx.beginPath();
  ctx.roundRect(ovrBoxX, ovrBoxY + ovrBoxH + 8, ovrBoxW, 34, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.stroke();

  ctx.font = '18px sans-serif';
  ctx.fillText(`${profile.countryCode || '🇷🇺'} 🛡️`, ovrBoxX + ovrBoxW / 2, ovrBoxY + ovrBoxH + 24);

  // 2. Top-Right: Tier Rarity & Level Glass Badges
  const trX = photoX + photoW - 138;
  const trY = photoY + 18;

  // Tier Pill
  ctx.fillStyle = 'rgba(10, 15, 25, 0.65)';
  ctx.beginPath();
  ctx.roundRect(trX, trY, 120, 36, 18);
  ctx.fill();
  ctx.strokeStyle = accentCol;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = textCol;
  ctx.font = '900 13px -apple-system, BlinkMacSystemFont, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(tier.rarityTag, trX + 60, trY + 23);

  // Level Pill
  ctx.fillStyle = 'rgba(10, 15, 25, 0.55)';
  ctx.beginPath();
  ctx.roundRect(trX + 30, trY + 44, 90, 28, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, monospace';
  ctx.fillText(`УР. ${profile.level}`, trX + 75, trY + 63);

  // 3. Bottom of Photo: Player Name & Club Glass Bar
  const nameBarX = photoX + 16;
  const nameBarY = photoY + photoH - 90;
  const nameBarW = photoW - 32;
  const nameBarH = 74;

  ctx.fillStyle = 'rgba(10, 15, 25, 0.7)';
  ctx.beginPath();
  ctx.roundRect(nameBarX, nameBarY, nameBarW, nameBarH, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = textCol;
  ctx.font = '900 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(profile.name.toUpperCase(), nameBarX + nameBarW / 2, nameBarY + 38);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, monospace';
  ctx.fillText(`${profile.clubName || 'FitHero Club'} • ${tier.themeTitle}`, nameBarX + nameBarW / 2, nameBarY + 58);

  // -------------------------------------------------------------
  // LOWER SECTION: 6 MINIMALIST GLASS STAT CHIPS (x6)
  // -------------------------------------------------------------
  const xpStat = Math.min(99, Math.round((profile.currentXp / profile.maxXp) * 100));
  const streakStat = Math.min(99, profile.streakDays * 4 + 35);

  const stats = [
    { label: 'СИЛ', val: profile.stats.strength },
    { label: 'ВЫН', val: profile.stats.endurance },
    { label: 'ЛОВ', val: profile.stats.agility },
    { label: 'ИНТ', val: profile.stats.intellect },
    { label: 'ОПТ', val: xpStat },
    { label: 'СЕР', val: streakStat }
  ];

  const chipGap = 8;
  const chipW = (photoW - chipGap * 5) / 6;
  const chipH = 78;
  const chipY = photoY + photoH + 18;

  stats.forEach((st, idx) => {
    const chipX = photoX + idx * (chipW + chipGap);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, chipW, chipH, 20);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Label
    ctx.textAlign = 'center';
    ctx.fillStyle = labelCol;
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, monospace';
    ctx.fillText(st.label, chipX + chipW / 2, chipY + 28);

    // Value
    ctx.fillStyle = textCol;
    ctx.font = '900 24px -apple-system, BlinkMacSystemFont, monospace';
    ctx.fillText(st.val.toString(), chipX + chipW / 2, chipY + 60);
  });

  // Footer Tag
  ctx.textAlign = 'left';
  ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText('FITHERO • 2026', photoX + 8, height - 32);

  ctx.textAlign = 'right';
  ctx.fillText(tier.tierName.toUpperCase(), photoX + photoW - 8, height - 32);

  try {
    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('Canvas toDataURL fallback:', err);
    return canvas.toDataURL();
  }
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(';base64,');
  const contentType = parts[0].split(':')[1] || 'image/png';
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

export function dataUrlToFile(dataUrl: string, filename: string): File {
  const blob = dataUrlToBlob(dataUrl);
  return new File([blob], filename, { type: 'image/png' });
}
