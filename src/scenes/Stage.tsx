import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {loop, pulse} from '../lib/anim';

export type Mood = 'night' | 'warm' | 'chart' | 'danger' | 'gold' | 'calm';

const MOODS: Record<Mood, {from: string; via: string; to: string; dots: string}> = {
  night: {from: '#0F1729', via: '#18213E', to: '#221A46', dots: C.cyan},
  warm: {from: '#2A1E3D', via: '#3B2547', to: '#4A2A42', dots: C.gold},
  chart: {from: '#0D1A2B', via: '#12263F', to: '#0F2E42', dots: C.up},
  danger: {from: '#2B1220', via: '#3E1726', to: '#45161C', dots: C.down},
  gold: {from: '#241A3C', via: '#37244B', to: '#4A2C3E', dots: C.gold},
  calm: {from: '#12203A', via: '#1B2C4E', to: '#1E3358', dots: C.purple},
};

/** Arka planda yavaşça süzülen noktalar — sahneyi ölü göstermemek için. */
const Dots: React.FC<{readonly color: string}> = ({color}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  return (
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
      {Array.from({length: 26}, (_, i) => {
        const x = random(`dx-${i}`) * width;
        const baseY = random(`dy-${i}`) * height;
        const y = (baseY + loop(frame, 520 + i * 9) * height) % height;
        const r = 3 + random(`dr-${i}`) * 7;
        const o = 0.1 + random(`do-${i}`) * 0.24;
        return <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={o} />;
      })}
    </svg>
  );
};

/** İnce ızgara — grafik/teknoloji sahnelerinde zemin hissi verir. */
const Grid: React.FC = () => (
  <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.12}}>
    <defs>
      <pattern id="grid" width="90" height="90" patternUnits="userSpaceOnUse">
        <path d="M 90 0 L 0 0 0 90" fill="none" stroke={C.white} strokeWidth="2" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

export const Stage: React.FC<{
  readonly mood?: Mood;
  readonly grid?: boolean;
  readonly ground?: boolean;
  readonly children: React.ReactNode;
}> = ({mood = 'night', grid = false, ground = true, children}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const m = MOODS[mood];
  const angle = 150 + pulse(frame, fps, 0.05) * 14;

  return (
    <AbsoluteFill style={{background: `linear-gradient(${angle}deg, ${m.from} 0%, ${m.via} 52%, ${m.to} 100%)`}}>
      <Dots color={m.dots} />
      {grid ? <Grid /> : null}

      {ground ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: height * 0.2,
            background: `linear-gradient(to top, rgba(0,0,0,0.34), transparent)`,
          }}
        />
      ) : null}

      <AbsoluteFill>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Sahnenin üstünde duran kısa başlık. */
export const Caption: React.FC<{
  readonly children: React.ReactNode;
  readonly size?: number;
  readonly color?: string;
  readonly align?: 'top' | 'bottom';
  readonly opacity?: number;
  readonly maxWidth?: number | string;
}> = ({children, size = 62, color = C.paper, align = 'top', opacity = 1, maxWidth = '76%'}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      [align]: align === 'top' ? 70 : 64,
      display: 'flex',
      justifyContent: 'center',
      opacity,
    }}
  >
    <div
      style={{
        maxWidth,
        fontFamily: FONT.display,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.14,
        letterSpacing: '-0.02em',
        color,
        textAlign: 'center',
        textShadow: '0 5px 0 rgba(0,0,0,0.3)',
      }}
    >
      {children}
    </div>
  </div>
);
