import React from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, glow, textGlow} from '../theme';
import {loop, popIn, pulse, stagger} from '../lib/anim';

/** Diyalog kutusu — çerçeve yerine köşe ayraçları, altta yazı imleci. */
export const SpeechBubble: React.FC<{
  readonly children: React.ReactNode;
  readonly width: number;
  readonly delay?: number;
  readonly tail?: 'left' | 'right' | 'none';
  readonly color?: string;
  readonly fontSize?: number;
  readonly speaker?: string;
}> = ({children, width, delay = 0, tail = 'left', color = C.cyan, fontSize = 40, speaker}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const caret = Math.floor(frame / 8) % 2 === 0;

  return (
    <div
      style={{
        position: 'relative',
        width,
        transform: `scale(${p})`,
        transformOrigin: tail === 'right' ? 'right bottom' : 'left bottom',
        opacity: Math.min(1, p * 1.7),
      }}
    >
      <div
        style={{
          position: 'relative',
          background: `linear-gradient(140deg, ${color}18 0%, ${color}06 60%, transparent 100%)`,
          border: `1.4px solid ${color}55`,
          boxShadow: `0 0 30px ${color}1F, inset 0 0 40px ${color}0A`,
          padding: '26px 32px',
          fontFamily: FONT.body,
          fontWeight: 500,
          fontSize,
          lineHeight: 1.3,
          color: C.text,
          textAlign: 'center',
          whiteSpace: 'pre-line',
        }}
      >
        {speaker ? (
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: 15,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color,
              marginBottom: 10,
              textShadow: textGlow(color, 0.6),
            }}
          >
            {speaker}
          </div>
        ) : null}
        {children}
        <span style={{color, opacity: caret ? 0.9 : 0.15, marginLeft: 6}}>▌</span>

        {/* Köşe ayraçları */}
        {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([gx, gy], n) => (
          <div
            key={n}
            style={{
              position: 'absolute',
              [gx ? 'right' : 'left']: -1,
              [gy ? 'bottom' : 'top']: -1,
              width: 20,
              height: 20,
              [`border${gy ? 'Bottom' : 'Top'}`]: `2.4px solid ${color}`,
              [`border${gx ? 'Right' : 'Left'}`]: `2.4px solid ${color}`,
            }}
          />
        ))}
      </div>

      {tail !== 'none' ? (
        <div
          style={{
            position: 'absolute',
            bottom: -22,
            [tail]: 46,
            width: 2,
            height: 22,
            background: `linear-gradient(to bottom, ${color}, transparent)`,
          }}
        />
      ) : null}
    </div>
  );
};

/** Kasa — "para" fikrinin sci-fi karşılığı. */
export const Credits: React.FC<{readonly size: number; readonly delay?: number; readonly label?: string; readonly color?: string}> = ({
  size,
  delay = 0,
  label = '$',
  color = C.amber,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const bob = pulse(frame, fps, 0.4) * size * 0.015;
  const ring = loop(frame, 200) * 360;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{overflow: 'visible', transform: `translateY(${bob}px) scale(${p})`, filter: glow(color, 0.8)}}
    >
      <g transform={`rotate(${ring} 50 50)`}>
        <circle cx={50} cy={50} r={44} fill="none" stroke={color} strokeWidth={1.2} strokeDasharray="10 16" opacity={0.55} />
      </g>
      <circle cx={50} cy={50} r={36} fill={`${color}12`} stroke={color} strokeWidth={2} />
      <path d="M 50 20 L 74 34 L 74 62 L 50 78 L 26 62 L 26 34 Z" fill="none" stroke={color} strokeWidth={1.4} opacity={0.5} />
      <text x={50} y={52} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.display} fontSize={36} fontWeight={700} fill={color}>
        {label}
      </text>
    </svg>
  );
};

/** Tarayıcı — araştırma anları. Radar'ın yakın plan hâli. */
export const Scanner: React.FC<{readonly size: number; readonly delay?: number; readonly color?: string}> = ({
  size,
  delay = 0,
  color = C.cyan,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const sweep = loop(frame, 78);
  const dx = pulse(frame, fps, 0.3) * size * 0.05;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{overflow: 'visible', transform: `translateX(${dx}px) scale(${p})`, filter: glow(color, 0.75)}}
    >
      <circle cx={44} cy={44} r={30} fill={`${color}0E`} stroke={color} strokeWidth={2.2} />
      <circle cx={44} cy={44} r={22} fill="none" stroke={color} strokeWidth={0.9} opacity={0.4} />
      {/* Mercek içinde tarama çizgisi */}
      <line x1={14} y1={44 - 30 + sweep * 60} x2={74} y2={44 - 30 + sweep * 60} stroke={color} strokeWidth={1.6} opacity={0.75} />
      <line x1={14} y1={44} x2={74} y2={44} stroke={color} strokeWidth={0.7} opacity={0.3} />
      <line x1={44} y1={14} x2={44} y2={74} stroke={color} strokeWidth={0.7} opacity={0.3} />
      {/* Sap */}
      <line x1={66} y1={66} x2={92} y2={92} stroke={color} strokeWidth={5} strokeLinecap="round" opacity={0.9} />
    </svg>
  );
};

/** Havada süzülen soru glifleri. */
export const QuestionMarks: React.FC<{
  readonly size: number;
  readonly count?: number;
  readonly delay?: number;
  readonly color?: string;
}> = ({size, count = 3, delay = 0, color = C.cyan}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div style={{position: 'relative', width: size * 2.4, height: size * 1.8}}>
      {Array.from({length: count}, (_, i) => {
        const p = popIn({frame, fps, delay: delay + stagger(i, 8)});
        const drift = pulse(frame, fps, 0.32, i * 1.7) * 12;
        const scale = 0.6 + random(`qm-${i}`) * 0.5;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${8 + i * 34}%`,
              top: `${(i % 2) * 34}%`,
              fontFamily: FONT.display,
              fontWeight: 600,
              fontSize: size * scale,
              color,
              textShadow: textGlow(color, 1),
              transform: `translateY(${drift}px) scale(${p})`,
              opacity: p * 0.9,
            }}
          >
            ?
          </div>
        );
      })}
    </div>
  );
};

/** Beğen + Abone ol — neon arayüz düğmeleri. */
export const LikeSubscribe: React.FC<{readonly delay?: number; readonly scale?: number}> = ({delay = 0, scale = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const like = popIn({frame, fps, delay});
  const sub = popIn({frame, fps, delay: delay + 10});
  const beat = 1 + Math.max(0, pulse(frame, fps, 1.05)) * 0.05;

  const Btn: React.FC<{
    readonly children: React.ReactNode;
    readonly color: string;
    readonly filled?: boolean;
    readonly s: number;
  }> = ({children, color, filled, s}) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '18px 40px',
        border: `2px solid ${color}`,
        background: filled ? `${color}22` : 'transparent',
        boxShadow: `0 0 26px ${color}44, inset 0 0 26px ${color}14`,
        fontFamily: FONT.display,
        fontWeight: 600,
        fontSize: 34,
        letterSpacing: '0.16em',
        color: C.text,
        transform: `scale(${s})`,
        textShadow: textGlow(color, 0.5),
      }}
    >
      {children}
    </div>
  );

  return (
    <div style={{display: 'flex', gap: 34 * scale, alignItems: 'center', transform: `scale(${scale})`}}>
      <Btn color={C.green} s={like}>
        <svg width={34} height={34} viewBox="0 0 100 100">
          <path
            d="M 30 44 L 30 88 L 74 88 Q 82 88 84 78 L 90 56 Q 92 46 82 46 L 60 46 L 64 24 Q 66 12 56 10 Q 50 9 46 18 Z"
            fill={`${C.green}33`}
            stroke={C.green}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          <rect x={8} y={44} width={20} height={44} fill={`${C.green}33`} stroke={C.green} strokeWidth={5} />
        </svg>
        LIKE
      </Btn>
      <Btn color={C.red} filled s={sub * beat}>
        SUBSCRIBE
      </Btn>
    </div>
  );
};

/** Enerji kıvılcımları — kutlama anlarının sci-fi karşılığı. */
export const SparkBurst: React.FC<{readonly count?: number; readonly delay?: number; readonly color?: string}> = ({
  count = 60,
  delay = 0,
  color = C.cyan,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  return (
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'screen'}}>
      {Array.from({length: count}, (_, i) => {
        const t = frame - delay - random(`sp-d-${i}`) * 26;
        if (t < 0) return null;
        const a = random(`sp-a-${i}`) * Math.PI * 2;
        const speed = 5 + random(`sp-s-${i}`) * 16;
        const dist = t * speed;
        const x = width / 2 + Math.cos(a) * dist * 1.6;
        const y = height / 2 + Math.sin(a) * dist;
        const life = Math.max(0, 1 - t / 70);
        if (life <= 0) return null;
        const c = i % 3 === 0 ? C.amber : color;
        return <circle key={i} cx={x} cy={y} r={1.6 + life * 3} fill={c} opacity={life * 0.85} />;
      })}
    </svg>
  );
};
