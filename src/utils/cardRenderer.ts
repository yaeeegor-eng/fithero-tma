import { UserProfile } from '../types';
import { calculateOvr } from '../data/initialData';
import { resolveTierForProfile } from './cardTierUtils';

export async function generateFifaCardPng(profile: UserProfile, cardElementId: string): Promise<string> {
  const canvas = document.createElement('canvas');
  const width = 640;
  const height = 880;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D context');

  const tier = resolveTierForProfile(profile);
  const ovr = calculateOvr(profile);

  // Background Theme Gradient Palette
  let c1 = '#2e1d03';
  let c2 = '#4d3306';
  let c3 = '#170e01';
  let borderCol = 'rgba(251, 191, 36, 0.6)';
  let textCol = '#FFFFFF';
  let labelCol = '#FCD34D';
  let accentCol = '#F59E0B';

  if (tier.tierId === 'bronze') {
    c1 = '#1c120c';
    c2 = '#2d1b12';
    c3 = '#120a06';
    borderCol = 'rgba(180, 83, 9, 0.6)';
    labelCol = '#FDE68A';
    accentCol = '#B45309';
  } else if (tier.tierId === 'silver') {
    c1 = '#0f172a';
    c2 = '#1e293b';
    c3 = '#090d16';
    borderCol = 'rgba(148, 163, 184, 0.6)';
    labelCol = '#CBD5E1';
    accentCol = '#94A3B8';
  } else if (tier.tierId === 'diamond') {
    c1 = '#03152d';
    c2 = '#092957';
    c3 = '#020b17';
    borderCol = 'rgba(56, 189, 248, 0.6)';
    labelCol = '#7DD3FC';
    accentCol = '#0284C7';
  } else if (tier.tierId === 'red_icon') {
    c1 = '#220205';
    c2 = '#45050d';
    c3 = '#120103';
    borderCol = 'rgba(210, 22, 36, 0.7)';
    labelCol = '#FECDD3';
    accentCol = '#D21624';
  } else if (tier.tierId === 'mythic') {
    c1 = '#050507';
    c2 = '#121217';
    c3 = '#020203';
    borderCol = 'rgba(245, 158, 11, 0.8)';
    labelCol = '#FBBF24';
    accentCol = '#E11D48';
  }

  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, c1);
  bgGradient.addColorStop(0.5, c2);
  bgGradient.addColorStop(1, c3);

  // Rounded 64px Card Path
  const r = 64;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(width - r, 0);
  ctx.arcTo(width, 0, width, r, r);
  ctx.lineTo(width, height - r);
  ctx.arcTo(width, height, width - r, height, r);
  ctx.lineTo(r, height);
  ctx.arcTo(0, height, 0, height - r, r);
  ctx.lineTo(0, r);
  ctx.arcTo(0, 0, r, 0, r);
  ctx.closePath();
  ctx.clip();

  // Fill Background
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Geometric Pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1.5;
  for (let i = -width; i < width * 2; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.stroke();
  }

  // Border
  ctx.strokeStyle = borderCol;
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.restore();

  // Header Title & Tier
  ctx.fillStyle = accentCol;
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
  ctx.textAlign = 'left';
  ctx.fillText(tier.rarityTag, 50, 65);

  ctx.textAlign = 'right';
  ctx.fillText(tier.themeTitle, width - 50, 65);

  // Big OVR
  ctx.fillStyle = textCol;
  ctx.font = '900 110px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
  ctx.textAlign = 'left';
  ctx.fillText(ovr.toString(), 50, 200);

  // Position
  ctx.fillStyle = labelCol;
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
  const posText = profile.positionTitle.split(' ')[0] === 'ALL' ? 'УНИВЕРСАЛ' : profile.positionTitle.split(' ')[0];
  ctx.fillText(posText || 'УНИВЕРСАЛ', 50, 245);

  // Flag & Shield
  ctx.font = '36px sans-serif';
  ctx.fillText(profile.countryCode || '🇷🇺', 50, 310);

  ctx.font = '28px sans-serif';
  ctx.fillText('🛡️', 110, 308);

  // Framed Athlete Avatar Portrait
  const avatarX = 330;
  const avatarY = 100;
  const avatarSize = 250;
  const avatarR = 32;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(avatarX + avatarR, avatarY);
  ctx.lineTo(avatarX + avatarSize - avatarR, avatarY);
  ctx.arcTo(avatarX + avatarSize, avatarY, avatarX + avatarSize, avatarY + avatarR, avatarR);
  ctx.lineTo(avatarX + avatarSize, avatarY + avatarSize - avatarR);
  ctx.arcTo(avatarX + avatarSize, avatarY + avatarSize, avatarX + avatarSize - avatarR, avatarY + avatarSize, avatarR);
  ctx.lineTo(avatarX + avatarR, avatarY + avatarSize);
  ctx.arcTo(avatarX, avatarY + avatarSize, avatarX, avatarY + avatarSize - avatarR, avatarR);
  ctx.lineTo(avatarX, avatarY + avatarR);
  ctx.arcTo(avatarX, avatarY, avatarX + avatarR, avatarY, avatarR);
  ctx.closePath();
  ctx.clip();

  // Background for avatar
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);

  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = profile.avatarUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
    ctx.drawImage(img, avatarX, avatarY, avatarSize, avatarSize);
  } catch {
    // Fallback if image fails to load
    ctx.fillStyle = accentCol;
    ctx.font = '900 80px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FH', avatarX + avatarSize / 2, avatarY + avatarSize / 2 + 30);
  }
  ctx.restore();

  // Name Strip Box
  const nameBoxY = 385;
  const nameBoxH = 80;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.roundRect(50, nameBoxY, width - 100, nameBoxH, 24);
  ctx.fill();

  ctx.fillStyle = textCol;
  ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(profile.name.toUpperCase(), width / 2, nameBoxY + 45);

  ctx.fillStyle = labelCol;
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
  ctx.fillText(`${profile.clubName || 'Фитнес-клуб'} • УР. ${profile.level}`, width / 2, nameBoxY + 68);

  // 6 Stats Grid
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

  const gridY = 490;
  const colW = (width - 120) / 2;

  // Left column
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.roundRect(50, gridY, colW, 280, 24);
  ctx.fill();

  // Right column
  ctx.beginPath();
  ctx.roundRect(width - 50 - colW, gridY, colW, 280, 24);
  ctx.fill();

  // Draw Stat Items
  stats.forEach((s, idx) => {
    const isLeft = idx < 3;
    const itemIndex = isLeft ? idx : idx - 3;
    const xBase = isLeft ? 75 : width - 50 - colW + 25;
    const yBase = gridY + 60 + itemIndex * 80;

    ctx.textAlign = 'left';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
    ctx.fillStyle = labelCol;
    ctx.fillText(s.label, xBase, yBase);

    ctx.textAlign = 'right';
    ctx.font = '900 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
    ctx.fillStyle = textCol;
    ctx.fillText(s.val.toString(), xBase + colW - 50, yBase);
  });

  // Footer
  ctx.textAlign = 'center';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText('FITHERO TMA • СЕЗОН 2026', width / 2, height - 35);

  return canvas.toDataURL('image/png');
}
