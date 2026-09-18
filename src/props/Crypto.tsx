import React from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, STROKE} from '../theme';
import {loop, popIn, pulse, stagger} from '../lib/anim';

export type Trend = 'up' | 'down' | 'crash' | 'recover' | 'chop';

const priceAt = (t: number, trend: Trend): number => {
  switch (trend) {
    case 'up':
      return 0.08 + t * 0.84;
    case 'down':
      return 0.92 - t * 0.84;
    case 'crash':
      return t < 0.55 ? 0.15 + (t / 0.55) * 0.78 : 0.93 - ((t - 0.55) / 0.45) * 0.86;
    case 'recover':
      return t < 0.45 ? 0.8 - (t / 0.45) * 0.72 : 0.08 + ((t - 0.45) / 0.55) * 0.84;
    case 'chop':
      return 0.5 + Math.sin(t * Math.PI * 4) * 0.28;
  }
};

/** Mum grafiği — mumlar sırayla düşer, trend parametreyle seçilir. */
export const CandleChart: React.FC<{
  readonly width: number;
  readonly height: number;
  readonly trend?: Trend;
  readonly count?: number;
  readonly delay?: number;
  readonly seed?: string;
  readonly showAxis?: boolean;
}> = ({width, height, trend = 'up', count = 14, delay = 0, seed = 'chart', showAxis = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pad = 14;
  const innerH = height - pad * 2;
  const slot = width / count;
  const bodyW = slot * 0.56;

  const candles = Array.from({length: count}, (_, i) => {
    const t0 = i / count;
    const t1 = (i + 1) / count;
    const n0 = (random(`${seed}-${i}-a`) - 0.5) * 0.14;
    const n1 = (random(`${seed}-${i}-b`) - 0.5) * 0.14;
    const open = Math.min(0.97, Math.max(0.03, priceAt(t0, trend) + n0));
    const close = Math.min(0.97, Math.max(0.03, priceAt(t1, trend) + n1));
    const spread = 0.04 + random(`${seed}-${i}-c`) * 0.07;
    return {
      open,
      close,
      high: Math.min(1, Math.max(open, close) + spread),
      low: Math.max(0, Math.min(open, close) - spread),
      bull: close >= open,
    };
  });

  const y = (v: number) => pad + (1 - v) * innerH;

  return (
    <svg width={width} height={height} style={{overflow: 'visible'}}>
      {showAxis && (
        <>
          <line x1={0} y1={height - 2} x2={width} y2={height - 2} stroke={C.muted} strokeWidth={3} opacity={0.4} />
          <line x1={2} y1={0} x2={2} y2={height} stroke={C.muted} strokeWidth={3} opacity={0.4} />
        </>
      )}
      {candles.map((c, i) => {
        const p = popIn({frame, fps, delay: delay + stagger(i, 2.5)});
        if (p <= 0.001) return null;
        const x = slot * i + slot / 2;
        const color = c.bull ? C.up : C.down;
        const top = y(Math.max(c.open, c.close));
        const bot = y(Math.min(c.open, c.close));

        return (
          <g key={i} transform={`translate(${x}, ${height}) scale(1, ${p}) translate(${-x}, ${-height})`} opacity={p}>
            <line x1={x} y1={y(c.high)} x2={x} y2={y(c.low)} stroke={C.ink} strokeWidth={STROKE.thin + 2} strokeLinecap="round" />
            <line x1={x} y1={y(c.high)} x2={x} y2={y(c.low)} stroke={color} strokeWidth={STROKE.thin - 1} strokeLinecap="round" />
            <rect
              x={x - bodyW / 2}
              y={top}
              width={bodyW}
              height={Math.max(6, bot - top)}
              rx={4}
              fill={color}
              stroke={C.ink}
              strokeWidth={STROKE.thin}
            />
          </g>
        );
      })}
    </svg>
  );
};

/** Kripto parası — havada süzülür, hafifçe döner. */
export const Coin: React.FC<{
  readonly size: number;
  readonly symbol?: string;
  readonly color?: string;
  readonly shade?: string;
  readonly delay?: number;
  readonly float?: boolean;
  readonly spin?: boolean;
  readonly phase?: number;
}> = ({size, symbol = '₿', color = C.gold, shade = C.goldShade, delay = 0, float = true, spin = false, phase = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const bob = float ? pulse(frame, fps, 0.55, phase) * (size * 0.06) : 0;
  // 0.34 taban: madeni para tam profilden bakıldığında kaybolmasın
  const squash = spin ? Math.abs(Math.cos(loop(frame, 78) * Math.PI * 2)) * 0.66 + 0.34 : 1;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', transform: `translateY(${bob}px) scale(${p})`}}>
      <g transform={`translate(50,50) scale(${squash},1) translate(-50,-50)`}>
        <circle cx={50} cy={53} r={42} fill={shade} stroke={C.ink} strokeWidth={6} />
        <circle cx={50} cy={48} r={42} fill={color} stroke={C.ink} strokeWidth={6} />
        <circle cx={50} cy={48} r={32} fill="none" stroke={shade} strokeWidth={4} opacity={0.8} />
        <text
          x={50}
          y={48}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={FONT.display}
          fontSize={44}
          fontWeight={700}
          fill={C.ink}
        >
          {symbol}
        </text>
      </g>
    </svg>
  );
};

/** Blok zinciri — bloklar sırayla gelir, aralarına bağ çizilir. */
export const BlockChain: React.FC<{
  readonly size: number;
  readonly count?: number;
  readonly delay?: number;
  readonly vertical?: boolean;
}> = ({size, count = 4, delay = 0, vertical = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const gap = size * 0.42;
  const total = count * size + (count - 1) * gap;

  return (
    <svg
      width={vertical ? size + 20 : total}
      height={vertical ? total : size + 20}
      style={{overflow: 'visible'}}
    >
      {Array.from({length: count}, (_, i) => {
        const p = popIn({frame, fps, delay: delay + stagger(i, 7)});
        const pos = i * (size + gap);
        const x = vertical ? 10 : pos;
        const yy = vertical ? pos : 10;
        const link = popIn({frame, fps, delay: delay + stagger(i, 7) + 4});

        return (
          <g key={i}>
            {i > 0 && (
              <line
                x1={vertical ? x + size / 2 : pos - gap}
                y1={vertical ? pos - gap : yy + size / 2}
                x2={vertical ? x + size / 2 : pos}
                y2={vertical ? pos : yy + size / 2}
                stroke={C.cyan}
                strokeWidth={8}
                strokeLinecap="round"
                opacity={link}
              />
            )}
            <g transform={`translate(${x + size / 2}, ${yy + size / 2}) scale(${p}) translate(${-x - size / 2}, ${-yy - size / 2})`} opacity={p}>
              <rect x={x} y={yy} width={size} height={size} rx={size * 0.2} fill={C.purple} stroke={C.ink} strokeWidth={STROKE.normal} />
              <rect x={x + size * 0.18} y={yy + size * 0.22} width={size * 0.64} height={size * 0.1} rx={4} fill={C.white} opacity={0.75} />
              <rect x={x + size * 0.18} y={yy + size * 0.44} width={size * 0.44} height={size * 0.1} rx={4} fill={C.white} opacity={0.55} />
              <rect x={x + size * 0.18} y={yy + size * 0.66} width={size * 0.54} height={size * 0.1} rx={4} fill={C.white} opacity={0.4} />
            </g>
          </g>
        );
      })}
    </svg>
  );
};

/** Airdrop — paraşütle inen kutu. */
export const Parachute: React.FC<{
  readonly size: number;
  readonly delay?: number;
  readonly phase?: number;
}> = ({size, delay = 0, phase = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const sway = pulse(frame, fps, 0.35, phase) * 9;
  const tilt = pulse(frame, fps, 0.35, phase + 0.4) * 5;

  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 100 125" style={{overflow: 'visible', transform: `translateX(${sway}px) rotate(${tilt}deg)`, opacity: p}}>
      <path d="M 8 42 A 42 42 0 0 1 92 42 Z" fill={C.cyan} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      <path d="M 36 42 A 42 42 0 0 1 50 42 A 20 30 0 0 1 50 42 Z" fill={C.white} opacity={0.35} />
      <path d="M 8 42 Q 30 56 50 42" fill="none" stroke={C.ink} strokeWidth={4} />
      <path d="M 50 42 Q 70 56 92 42" fill="none" stroke={C.ink} strokeWidth={4} />
      <path d="M 8 42 L 38 78 M 50 44 L 50 78 M 92 42 L 62 78" stroke={C.ink} strokeWidth={3.5} fill="none" />
      <rect x={32} y={76} width={36} height={32} rx={6} fill={C.gold} stroke={C.ink} strokeWidth={5} />
      <path d="M 50 76 L 50 108 M 32 90 L 68 90" stroke={C.goldShade} strokeWidth={5} />
    </svg>
  );
};

/** Roket — alev sürekli titrer. */
export const Rocket: React.FC<{readonly size: number; readonly delay?: number}> = ({size, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const flame = 0.72 + random(`flame-${Math.floor(frame / 2)}`) * 0.55;
  const shake = pulse(frame, fps, 6) * 1.6;

  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 100 140" style={{overflow: 'visible', transform: `translateX(${shake}px) scale(${p})`}}>
      <g transform={`translate(50, 104) scale(1, ${flame}) translate(-50, -104)`}>
        <path d="M 38 100 Q 50 152 62 100 Z" fill="#FF8A3D" stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
        <path d="M 44 100 Q 50 134 56 100 Z" fill={C.gold} />
      </g>
      <path d="M 50 6 Q 78 44 78 84 L 22 84 Q 22 44 50 6 Z" fill={C.white} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      <path d="M 22 84 L 6 108 L 30 98 Z" fill={C.down} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      <path d="M 78 84 L 94 108 L 70 98 Z" fill={C.down} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      <rect x={30} y={84} width={40} height={18} rx={5} fill={C.down} stroke={C.ink} strokeWidth={5} />
      <circle cx={50} cy={48} r={14} fill={C.cyan} stroke={C.ink} strokeWidth={5} />
    </svg>
  );
};
