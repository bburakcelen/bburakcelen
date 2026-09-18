import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from './theme';

const RADIUS = 92;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Kendini çizen çember + içinde yay (spring) ile büyüyen üçgen.
 * strokeDasharray / strokeDashoffset ikilisi, SVG'de "çizgi çizilme"
 * efektinin standart yoludur.
 */
export const Logo: React.FC<{readonly size: number}> = ({size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Çemberin çizilme ilerlemesi: 0 → 1
  const draw = spring({
    frame,
    fps,
    config: {damping: 200, mass: 1.4},
    durationInFrames: 45,
  });

  // Üçgen, çember tamamlanmaya yakın devreye girer.
  const pop = spring({
    frame: frame - 24,
    fps,
    config: {damping: 12, stiffness: 140, mass: 0.6},
  });

  // Çok hafif "nefes alma" efekti.
  const breathe = interpolate(Math.sin((frame / fps) * 1.4), [-1, 1], [0.98, 1.02]);
  const rotation = interpolate(frame, [0, 300], [-12, 8]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      style={{transform: `scale(${breathe}) rotate(${rotation}deg)`}}
    >
      <defs>
        <linearGradient id="logo-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={COLORS.accent} />
          <stop offset="100%" stopColor={COLORS.accentSoft} />
        </linearGradient>
      </defs>

      <circle
        cx={110}
        cy={110}
        r={RADIUS}
        fill="none"
        stroke="url(#logo-stroke)"
        strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={CIRCUMFERENCE * (1 - draw)}
        // -90 derece: çizim saat 12 yönünden başlasın.
        transform="rotate(-90 110 110)"
      />

      <path
        d="M92 78 L150 110 L92 142 Z"
        fill={COLORS.text}
        style={{
          transformOrigin: '110px 110px',
          transform: `scale(${pop})`,
          opacity: pop,
        }}
      />
    </svg>
  );
};
