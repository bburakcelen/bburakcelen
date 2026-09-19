import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, textGlow} from '../theme';
import {loop, pulse} from '../lib/anim';
import {Grade} from '../effects/Grade';
import {Camera, type CameraMove} from '../lib/camera';

export type Mood = 'void' | 'data' | 'risk' | 'wealth' | 'deep' | 'dawn';

type MoodSpec = {
  readonly core: string;
  readonly edge: string;
  readonly accent: string;
  readonly bloom: string;
};

const MOODS: Record<Mood, MoodSpec> = {
  void: {core: '#0A1526', edge: '#03060E', accent: C.cyan, bloom: C.cyan},
  data: {core: '#07202E', edge: '#03080F', accent: C.cyan, bloom: C.cyan},
  risk: {core: '#2A0A14', edge: '#0A0306', accent: C.red, bloom: C.red},
  wealth: {core: '#241705', edge: '#070401', accent: C.amber, bloom: C.amber},
  deep: {core: '#160B33', edge: '#04030C', accent: C.violet, bloom: C.violet},
  dawn: {core: '#1E1430', edge: '#05050D', accent: C.violet, bloom: C.cyan},
};

/** Ufka doğru yakınsayan zemin ızgarası — mekânı ve derinliği kuran ana öğe. */
const FloorGrid: React.FC<{readonly accent: string; readonly speed?: number}> = ({accent, speed = 1}) => {
  const frame = useCurrentFrame();
  const {width: w, height: h} = useVideoConfig();
  const horizon = h * 0.56;
  const vpX = w / 2;

  // İleri doğru akan yatay çizgiler: perspektif sıkışması için üs alıyoruz
  const ROWS = 16;
  const scroll = loop(frame, 150 / speed);

  return (
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="grid-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0" />
          <stop offset="34%" stopColor={accent} stopOpacity="0.5" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="grid-fade-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.42" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.04" />
        </linearGradient>
      </defs>

      <g clipPath="inset(0)">
        {/* Yakınsayan dikey çizgiler */}
        {Array.from({length: 23}, (_, i) => {
          const t = (i - 11) / 11;
          const xBottom = vpX + t * w * 1.9;
          return (
            <line
              key={`v-${i}`}
              x1={xBottom}
              y1={h + 40}
              x2={vpX}
              y2={horizon}
              stroke="url(#grid-fade-v)"
              strokeWidth={1.6}
            />
          );
        })}

        {/* İleri akan yatay çizgiler */}
        {Array.from({length: ROWS}, (_, i) => {
          const t = ((i + scroll) % ROWS) / ROWS;
          const y = horizon + (h + 40 - horizon) * Math.pow(t, 2.6);
          const o = Math.pow(t, 0.7);
          return (
            <line
              key={`h-${i}`}
              x1={0}
              y1={y}
              x2={w}
              y2={y}
              stroke={accent}
              strokeWidth={1.5}
              opacity={o * 0.4}
            />
          );
        })}
      </g>

      {/* Ufuk çizgisi */}
      <line x1={0} y1={horizon} x2={w} y2={horizon} stroke={accent} strokeWidth={2} opacity={0.6} />
      <rect x={0} y={horizon - 90} width={w} height={90} fill={`url(#grid-fade)`} opacity={0.5} />
    </svg>
  );
};

/** Derinlik katmanlı parçacık alanı — uzaktakiler yavaş, yakındakiler hızlı. */
const Particles: React.FC<{readonly accent: string; readonly count?: number}> = ({accent, count = 54}) => {
  const frame = useCurrentFrame();
  const {width: w, height: h} = useVideoConfig();

  return (
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
      {Array.from({length: count}, (_, i) => {
        const depth = random(`pz-${i}`); // 0 = uzak, 1 = yakın
        const x = random(`px-${i}`) * w;
        const baseY = random(`py-${i}`) * h;
        const y = (baseY - loop(frame, 900 - depth * 620) * h * 1.4 + h * 2) % h;
        const r = 0.8 + depth * 3.2;
        const o = 0.12 + depth * 0.5;
        return <circle key={i} cx={x} cy={y} r={r} fill={depth > 0.72 ? accent : C.text} opacity={o} />;
      })}
    </svg>
  );
};

/** Yukarıdan inen ışık huzmeleri. */
const Beams: React.FC<{readonly accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const {fps, width: w, height: h} = useVideoConfig();

  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
      {[0.22, 0.5, 0.78].map((px, i) => {
        const breathe = 0.5 + (pulse(frame, fps, 0.09, i * 2.1) + 1) * 0.25;
        return (
          <div
            key={px}
            style={{
              position: 'absolute',
              left: w * px,
              top: -h * 0.1,
              width: w * 0.46,
              height: h * 1.25,
              transform: `translateX(-50%) skewX(${-9 + i * 8}deg)`,
              // Radyal gradyan her yöne yumuşak biter; blur filtresine gerek
              // kalmaz — aynı görüntü, kare başına çok daha ucuz.
              background: `radial-gradient(ellipse 42% 58% at 50% 12%, ${accent}26 0%, ${accent}0E 34%, ${accent}05 58%, transparent 80%)`,
              opacity: breathe * 0.9,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Stage: React.FC<{
  readonly mood?: Mood;
  /** Zemin ızgarası — mekân hissi verir. */
  readonly grid?: boolean;
  readonly beams?: boolean;
  readonly particles?: boolean;
  /** Renk/doku katmanını kapatmak için (ör. kontak sayfası). */
  readonly grade?: boolean;
  /** Kamera hareketi. Arka plan da birlikte hareket eder — paralaks oluşur. */
  readonly move?: CameraMove;
  readonly moveAmount?: number;
  /** El kamerası salınımı. Kapak görselinde 0 — kadraj kareye göre kaymasın. */
  readonly handheld?: number;
  readonly children?: React.ReactNode;
}> = ({
  mood = 'void',
  grid = true,
  beams = true,
  particles = true,
  grade = true,
  move = 'pushIn',
  moveAmount = 1,
  handheld = 1,
  children,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const m = MOODS[mood];
  const breathe = 1 + pulse(frame, fps, 0.06) * 0.06;

  return (
    <AbsoluteFill style={{backgroundColor: m.edge}}>
      {/* Kamera arka planı da taşır: katmanlar birlikte kayınca paralaks olur.
          Renk/doku katmanı dışarıda kalır — o objektifin kendisi. */}
      <Camera move={move} amount={moveAmount} handheld={handheld}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse ${74 * breathe}% ${70 * breathe}% at 50% 46%, ${m.core} 0%, ${m.edge} 78%)`,
          }}
        />

        {particles ? <Particles accent={m.accent} /> : null}
        {grid ? <FloorGrid accent={m.accent} /> : null}
        {beams ? <Beams accent={m.accent} /> : null}

        <AbsoluteFill>{children}</AbsoluteFill>
      </Camera>

      {grade ? <Grade bloom={m.bloom} bloomStrength={0.72} /> : null}
    </AbsoluteFill>
  );
};

/** Sahne başlığı — geniş harf aralığı ve neon, fragman tipografisi. */
export const Caption: React.FC<{
  readonly children: React.ReactNode;
  readonly size?: number;
  readonly color?: string;
  readonly accent?: string;
  readonly align?: 'top' | 'bottom';
  readonly opacity?: number;
  readonly maxWidth?: number | string;
  readonly kicker?: string;
}> = ({children, size = 54, color = C.text, accent = C.cyan, align = 'top', opacity = 1, maxWidth = '74%', kicker}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      [align]: align === 'top' ? 106 : 84,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14,
      opacity,
    }}
  >
    {kicker ? (
      <div
        style={{
          fontFamily: FONT.mono,
          fontSize: 20,
          fontWeight: 500,
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          color: accent,
          textShadow: textGlow(accent, 0.7),
        }}
      >
        {kicker}
      </div>
    ) : null}
    <div
      style={{
        maxWidth,
        fontFamily: FONT.display,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.16,
        letterSpacing: '0.012em',
        color,
        textAlign: 'center',
        textShadow: '0 2px 30px rgba(0,0,0,0.8)',
      }}
    >
      {children}
    </div>
    <div style={{width: 78, height: 2, background: accent, opacity: 0.75, boxShadow: `0 0 14px ${accent}`}} />
  </div>
);
