import React, { useState } from 'react';
import { getAthleteFallbackAvatar } from '../utils/avatarUtils';

interface AthleteAvatarProps {
  src?: string;
  name: string;
  id?: string;
  className?: string;
  alt?: string;
}

export const AthleteAvatar: React.FC<AthleteAvatarProps> = ({
  src,
  name,
  id,
  className = 'w-10 h-10 rounded-2xl object-cover shadow-2xs',
  alt = 'Athlete avatar'
}) => {
  const [hasError, setHasError] = useState(false);
  const fallbackSrc = getAthleteFallbackAvatar(name, id);
  const effectiveSrc = !src || hasError ? fallbackSrc : src;

  return (
    <img
      src={effectiveSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`${className} bg-slate-900 transition-opacity`}
      loading="lazy"
    />
  );
};
