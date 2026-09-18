import React from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, STROKE} from '../theme';
import {easeIn, loop, popIn, pulse, stagger} from '../lib/anim';

/** Konuşma balonu — kuyruğu istenen yöne bakar. */
export const SpeechBubble: React.FC<{
  readonly children: React.ReactNode;
  readonly width: number;
  readonly delay?: number;
  readonly tail?: 'left' | 'right' | 'none';
  readonly color?: string;
  readonly textColor?: string;
  readonly fontSize?: number;
}> = ({children, width, delay = 0, tail = 'left', color = C.paper, textColor = C.ink, fontSize = 34}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});

  return (
    <div
      style={{
        position: 'relative',
        width,
        transform: `scale(${p})`,
        transformOrigin: tail === 'left' ? 'left bottom' : tail === 'right' ? 'right bottom' : 'center bottom',
        opacity: Math.min(1, p * 1.6),
      }}
    >
      <div
        style={{
          background: color,
          border: `${STROKE.normal}px solid ${C.ink}`,
          borderRadius: 28,
          padding: '22px 28px',
          fontFamily: FONT.body,
          fontWeight: 800,
          fontSize,
          lineHeight: 1.28,
          color: textColor,
          textAlign: 'center',
          // beats.tsx'te \n ile satır kırabilmek için
          whiteSpace: 'pre-line',
        }}
      >
        {children}
      </div>
      {tail !== 'none' && (
        <svg
          width={46}
          height={34}
          style={{
            position: 'absolute',
            bottom: -28,
            [tail]: 42,
            transform: tail === 'right' ? 'scaleX(-1)' : undefined,
          }}
        >
          <path d="M 4 0 L 44 2 L 14 32 Z" fill={color} stroke={C.ink} strokeWidth={STROKE.normal} strokeLinejoin="round" />
          <path d="M 6 0 L 40 0" stroke={color} strokeWidth={STROKE.normal + 4} />
        </svg>
      )}
    </div>
  );
};

/** Para çuvalı. */
export const MoneyBag: React.FC<{readonly size: number; readonly delay?: number; readonly label?: string}> = ({
  size,
  delay = 0,
  label = '$',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const bob = pulse(frame, fps, 0.5) * size * 0.02;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', transform: `translateY(${bob}px) scale(${p})`}}>
      <path d="M 38 18 L 62 18 L 56 30 L 44 30 Z" fill={C.paper} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      <path d="M 44 30 Q 12 48 16 72 Q 20 94 50 94 Q 80 94 84 72 Q 88 48 56 30 Z" fill={C.gold} stroke={C.ink} strokeWidth={5.5} strokeLinejoin="round" />
      <text x={50} y={66} textAnchor="middle" fontFamily={FONT.display} fontSize={36} fontWeight={700} fill={C.ink}>
        {label}
      </text>
    </svg>
  );
};

/** Büyüteç — araştırma sahneleri için, hafifçe tarar. */
export const Magnifier: React.FC<{readonly size: number; readonly delay?: number; readonly scan?: boolean}> = ({
  size,
  delay = 0,
  scan = true,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const dx = scan ? pulse(frame, fps, 0.4) * size * 0.1 : 0;
  const dy = scan ? pulse(frame, fps, 0.31, 1.2) * size * 0.06 : 0;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', transform: `translate(${dx}px, ${dy}px) scale(${p})`}}>
      <line x1={62} y1={62} x2={92} y2={92} stroke={C.ink} strokeWidth={16} strokeLinecap="round" />
      <line x1={62} y1={62} x2={92} y2={92} stroke={C.goldShade} strokeWidth={9} strokeLinecap="round" />
      <circle cx={42} cy={42} r={30} fill={C.cyan} opacity={0.32} />
      <circle cx={42} cy={42} r={30} fill="none" stroke={C.ink} strokeWidth={8} />
      <path d="M 26 34 Q 34 22 48 24" stroke={C.white} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.85} />
    </svg>
  );
};

/** Dünya — "citizens of the world" sahnesi için, yavaşça döner. */
export const Globe: React.FC<{readonly size: number; readonly delay?: number}> = ({size, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const spin = loop(frame, 240);

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', transform: `scale(${p})`}}>
      <defs>
        <clipPath id="globe-clip">
          <circle cx={50} cy={50} r={42} />
        </clipPath>
      </defs>
      <circle cx={50} cy={50} r={42} fill="#2E6FB7" stroke={C.ink} strokeWidth={6} />
      <g clipPath="url(#globe-clip)">
        {[0, 1, 2].map((i) => {
          const x = ((spin + i / 3) % 1) * 160 - 40;
          return (
            <g key={i} transform={`translate(${x}, 0)`}>
              <path d="M 6 26 q 14 -8 26 2 q 10 10 -2 18 q -16 6 -22 -6 Z" fill={C.up} opacity={0.9} />
              <path d="M 18 58 q 16 -4 20 8 q 2 12 -12 14 q -14 0 -14 -12 Z" fill={C.up} opacity={0.75} />
            </g>
          );
        })}
        {[26, 50, 74].map((y) => (
          <line key={y} x1={4} y1={y} x2={96} y2={y} stroke={C.white} strokeWidth={2} opacity={0.3} />
        ))}
      </g>
      <circle cx={50} cy={50} r={42} fill="none" stroke={C.ink} strokeWidth={6} />
      <ellipse cx={50} cy={50} rx={17} ry={42} fill="none" stroke={C.white} strokeWidth={2} opacity={0.32} />
    </svg>
  );
};

/** Havada süzülen soru işaretleri. */
export const QuestionMarks: React.FC<{
  readonly size: number;
  readonly count?: number;
  readonly delay?: number;
  readonly color?: string;
}> = ({size, count = 3, delay = 0, color = C.gold}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div style={{position: 'relative', width: size * 2.4, height: size * 1.8}}>
      {Array.from({length: count}, (_, i) => {
        const p = popIn({frame, fps, delay: delay + stagger(i, 8)});
        const drift = pulse(frame, fps, 0.4, i * 1.7) * 10;
        const scale = 0.62 + random(`qm-${i}`) * 0.5;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${10 + i * 34}%`,
              top: `${(i % 2) * 34}%`,
              fontFamily: FONT.display,
              fontWeight: 700,
              fontSize: size * scale,
              color,
              WebkitTextStroke: `${STROKE.thin}px ${C.ink}`,
              transform: `translateY(${drift}px) scale(${p}) rotate(${(i - 1) * 9}deg)`,
              opacity: p,
            }}
          >
            ?
          </div>
        );
      })}
    </div>
  );
};

/** Ekran / monitör — içine istediğin şeyi koyabilirsin. */
export const Screen: React.FC<{
  readonly width: number;
  readonly height: number;
  readonly delay?: number;
  readonly children?: React.ReactNode;
}> = ({width, height, delay = 0, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});

  return (
    <div style={{transform: `scale(${p})`, opacity: Math.min(1, p * 1.5)}}>
      <div
        style={{
          width,
          height,
          background: C.bgMid,
          border: `${STROKE.thick}px solid ${C.ink}`,
          borderRadius: 22,
          padding: 20,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
      {/* Ayak */}
      <div style={{width: width * 0.22, height: 24, background: C.ink, margin: '0 auto', borderRadius: '0 0 6px 6px'}} />
      <div style={{width: width * 0.44, height: 16, background: C.ink, margin: '0 auto', borderRadius: 10}} />
    </div>
  );
};

/** Beğen + Abone ol — kapanış sahnesi için. */
export const LikeSubscribe: React.FC<{readonly delay?: number; readonly scale?: number}> = ({delay = 0, scale = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const like = popIn({frame, fps, delay});
  const sub = popIn({frame, fps, delay: delay + 10});
  // Abone butonu ritmik olarak nabız atar
  const beat = 1 + Math.max(0, pulse(frame, fps, 1.1)) * 0.07;

  return (
    <div style={{display: 'flex', gap: 30 * scale, alignItems: 'center', transform: `scale(${scale})`}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: C.paper,
          border: `${STROKE.normal}px solid ${C.ink}`,
          borderRadius: 22,
          padding: '16px 30px',
          transform: `scale(${like})`,
        }}
      >
        <svg width={44} height={44} viewBox="0 0 100 100">
          <path
            d="M 30 44 L 30 88 L 74 88 Q 82 88 84 78 L 90 56 Q 92 46 82 46 L 60 46 L 64 24 Q 66 12 56 10 Q 50 9 46 18 L 30 44 Z"
            fill={C.up}
            stroke={C.ink}
            strokeWidth={6}
            strokeLinejoin="round"
          />
          <rect x={8} y={44} width={22} height={44} rx={5} fill={C.up} stroke={C.ink} strokeWidth={6} />
        </svg>
        <span style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 34, color: C.ink}}>LIKE</span>
      </div>

      <div
        style={{
          background: C.down,
          border: `${STROKE.normal}px solid ${C.ink}`,
          borderRadius: 22,
          padding: '18px 38px',
          fontFamily: FONT.display,
          fontWeight: 700,
          fontSize: 36,
          color: C.white,
          transform: `scale(${sub * beat})`,
        }}
      >
        SUBSCRIBE
      </div>
    </div>
  );
};

/** Konfeti yağmuru — kutlama anları için. */
export const Confetti: React.FC<{readonly count?: number; readonly delay?: number}> = ({count = 52, delay = 0}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const colors = [C.gold, C.up, C.cyan, C.purple, C.down, C.paper];

  return (
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {Array.from({length: count}, (_, i) => {
        const t = frame - delay - random(`cf-start-${i}`) * 34;
        if (t < 0) return null;
        const x = random(`cf-x-${i}`) * width;
        const speed = 4.2 + random(`cf-s-${i}`) * 5.6;
        const y = t * speed - 80;
        if (y > height + 60) return null;
        const sway = Math.sin((t / 16) + i) * 26;
        const rot = t * (3.2 + random(`cf-r-${i}`) * 5);
        const w = 12 + random(`cf-w-${i}`) * 12;
        const fade = easeIn({frame: t, duration: 6});

        return (
          <rect
            key={i}
            x={0}
            y={0}
            width={w}
            height={w * 0.52}
            rx={3}
            fill={colors[i % colors.length]}
            opacity={fade}
            transform={`translate(${x + sway}, ${y}) rotate(${rot})`}
          />
        );
      })}
    </svg>
  );
};
