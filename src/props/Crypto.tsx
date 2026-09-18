import React from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, glow} from '../theme';
import {easeIn, loop, popIn, pulse, stagger} from '../lib/anim';

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

/**
 * Holografik mum grafiği: ızgara, neon mumlar, mumların tepesini takip
 * eden bir fiyat çizgisi ve mono fontla fiyat ekseni.
 */
export const CandleChart: React.FC<{
  readonly width: number;
  readonly height: number;
  readonly trend?: Trend;
  readonly count?: number;
  readonly delay?: number;
  readonly seed?: string;
  readonly showAxis?: boolean;
  readonly showLine?: boolean;
}> = ({width, height, trend = 'up', count = 16, delay = 0, seed = 'chart', showAxis = true, showLine = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const padR = showAxis ? 74 : 8;
  const plotW = width - padR;
  const pad = 16;
  const innerH = height - pad * 2;
  const slot = plotW / count;
  const bodyW = slot * 0.48;

  const candles = Array.from({length: count}, (_, i) => {
    const t0 = i / count;
    const t1 = (i + 1) / count;
    const n0 = (random(`${seed}-${i}-a`) - 0.5) * 0.13;
    const n1 = (random(`${seed}-${i}-b`) - 0.5) * 0.13;
    const open = Math.min(0.97, Math.max(0.03, priceAt(t0, trend) + n0));
    const close = Math.min(0.97, Math.max(0.03, priceAt(t1, trend) + n1));
    const spread = 0.035 + random(`${seed}-${i}-c`) * 0.06;
    return {
      open,
      close,
      high: Math.min(1, Math.max(open, close) + spread),
      low: Math.max(0, Math.min(open, close) - spread),
      bull: close >= open,
    };
  });

  const y = (v: number) => pad + (1 - v) * innerH;
  const revealed = candles.filter((_, i) => frame - delay - stagger(i, 2.2) > 0);

  return (
    <svg width={width} height={height} style={{overflow: 'visible'}}>
      {/* Izgara */}
      {[0, 0.25, 0.5, 0.75, 1].map((k) => (
        <g key={k}>
          <line x1={0} y1={y(k)} x2={plotW} y2={y(k)} stroke={C.cyan} strokeWidth={0.9} opacity={0.14} />
          {showAxis ? (
            <text
              x={plotW + 12}
              y={y(k) + 5}
              fontFamily={FONT.mono}
              fontSize={15}
              fill={C.textFaint}
              letterSpacing="0.06em"
            >
              {(10000 + k * 32000).toFixed(0)}
            </text>
          ) : null}
        </g>
      ))}

      {/* Fiyat çizgisi — mumların kapanışını takip eder */}
      {showLine && revealed.length > 1 ? (
        <polyline
          points={revealed.map((c, i) => `${slot * i + slot / 2},${y(c.close)}`).join(' ')}
          fill="none"
          stroke={C.cyan}
          strokeWidth={2}
          opacity={0.5}
          style={{filter: glow(C.cyan, 0.5)}}
        />
      ) : null}

      {candles.map((c, i) => {
        const p = popIn({frame, fps, delay: delay + stagger(i, 2.2)});
        if (p <= 0.001) return null;
        const x = slot * i + slot / 2;
        const color = c.bull ? C.green : C.red;
        const top = y(Math.max(c.open, c.close));
        const bot = y(Math.min(c.open, c.close));

        return (
          <g key={i} opacity={p} style={{filter: glow(color, 0.34)}}>
            <line x1={x} y1={y(c.high)} x2={x} y2={y(c.low)} stroke={color} strokeWidth={1.6} opacity={0.8} />
            <rect
              x={x - bodyW / 2}
              y={top}
              width={bodyW}
              height={Math.max(3, (bot - top) * p)}
              fill={`${color}33`}
              stroke={color}
              strokeWidth={1.6}
            />
          </g>
        );
      })}

      {/* Son fiyat etiketi */}
      {showAxis && revealed.length > 0 ? (
        <g opacity={easeIn({frame, delay: delay + 20, duration: 14})}>
          <rect
            x={plotW + 4}
            y={y(revealed[revealed.length - 1].close) - 13}
            width={66}
            height={26}
            fill={trend === 'crash' || trend === 'down' ? C.red : C.green}
            opacity={0.2}
          />
          <line
            x1={0}
            y1={y(revealed[revealed.length - 1].close)}
            x2={plotW + 70}
            y2={y(revealed[revealed.length - 1].close)}
            stroke={trend === 'crash' || trend === 'down' ? C.red : C.green}
            strokeWidth={1}
            strokeDasharray="5 5"
            opacity={0.65}
          />
        </g>
      ) : null}
    </svg>
  );
};

/** Kripto parası — holografik disk, ekseni etrafında döner. */
export const Coin: React.FC<{
  readonly size: number;
  readonly symbol?: string;
  readonly color?: string;
  readonly delay?: number;
  readonly float?: boolean;
  readonly spin?: boolean;
  readonly phase?: number;
}> = ({size, symbol = '₿', color = C.amber, delay = 0, float = true, spin = false, phase = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const bob = float ? pulse(frame, fps, 0.42, phase) * (size * 0.05) : 0;
  const squash = spin ? Math.abs(Math.cos(loop(frame, 86) * Math.PI * 2)) * 0.62 + 0.38 : 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{overflow: 'visible', transform: `translateY(${bob}px) scale(${p})`, filter: glow(color, 0.8)}}
    >
      <g transform={`translate(50,50) scale(${squash},1) translate(-50,-50)`}>
        <circle cx={50} cy={50} r={42} fill={`${color}14`} stroke={color} strokeWidth={2.2} />
        <circle cx={50} cy={50} r={33} fill="none" stroke={color} strokeWidth={1} opacity={0.4} />
        {/* Kenar çentikleri */}
        {Array.from({length: 24}, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={50 + Math.cos(a) * 42}
              y1={50 + Math.sin(a) * 42}
              x2={50 + Math.cos(a) * 37}
              y2={50 + Math.sin(a) * 37}
              stroke={color}
              strokeWidth={1.2}
              opacity={0.45}
            />
          );
        })}
        <text
          x={50}
          y={50}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={FONT.display}
          fontSize={40}
          fontWeight={600}
          fill={color}
        >
          {symbol}
        </text>
      </g>
    </svg>
  );
};

/** Blok zinciri — bloklar sırayla gelir, aralarında veri akışı belirir. */
export const BlockChain: React.FC<{
  readonly size: number;
  readonly count?: number;
  readonly delay?: number;
  readonly vertical?: boolean;
  readonly color?: string;
}> = ({size, count = 4, delay = 0, vertical = false, color = C.violet}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const gap = size * 0.46;
  const total = count * size + (count - 1) * gap;

  return (
    <svg
      width={vertical ? size + 16 : total}
      height={vertical ? total : size + 16}
      style={{overflow: 'visible', filter: glow(color, 0.6)}}
    >
      {Array.from({length: count}, (_, i) => {
        const p = popIn({frame, fps, delay: delay + stagger(i, 7)});
        const pos = i * (size + gap);
        const x = vertical ? 8 : pos;
        const yy = vertical ? pos : 8;
        const link = easeIn({frame, delay: delay + stagger(i, 7) + 3, duration: 10});
        const flow = loop(frame, 44);

        return (
          <g key={i}>
            {i > 0 ? (
              <g opacity={link}>
                <line
                  x1={vertical ? x + size / 2 : pos - gap}
                  y1={vertical ? pos - gap : yy + size / 2}
                  x2={vertical ? x + size / 2 : pos}
                  y2={vertical ? pos : yy + size / 2}
                  stroke={color}
                  strokeWidth={1.6}
                  opacity={0.5}
                />
                {/* Bağ üzerinde akan veri paketi */}
                <circle
                  cx={vertical ? x + size / 2 : pos - gap + gap * flow}
                  cy={vertical ? pos - gap + gap * flow : yy + size / 2}
                  r={3}
                  fill={color}
                />
              </g>
            ) : null}
            <g transform={`translate(${x + size / 2}, ${yy + size / 2}) scale(${p}) translate(${-x - size / 2}, ${-yy - size / 2})`} opacity={p}>
              <rect x={x} y={yy} width={size} height={size} fill={`${color}12`} stroke={color} strokeWidth={1.8} />
              {/* Köşe ayraçları */}
              {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([gx, gy], n) => (
                <path
                  key={n}
                  d={`M ${x + gx * size + (gx ? -size * 0.22 : size * 0.22)} ${yy + gy * size}
                      L ${x + gx * size} ${yy + gy * size}
                      L ${x + gx * size} ${yy + gy * size + (gy ? -size * 0.22 : size * 0.22)}`}
                  fill="none"
                  stroke={color}
                  strokeWidth={2.4}
                />
              ))}
              <rect x={x + size * 0.2} y={yy + size * 0.3} width={size * 0.6} height={size * 0.07} fill={color} opacity={0.65} />
              <rect x={x + size * 0.2} y={yy + size * 0.48} width={size * 0.4} height={size * 0.07} fill={color} opacity={0.42} />
              <rect x={x + size * 0.2} y={yy + size * 0.66} width={size * 0.5} height={size * 0.07} fill={color} opacity={0.28} />
            </g>
          </g>
        );
      })}
    </svg>
  );
};

/** Airdrop — atmosfere giren kargo kapsülü. */
export const Parachute: React.FC<{
  readonly size: number;
  readonly delay?: number;
  readonly phase?: number;
  readonly color?: string;
}> = ({size, delay = 0, phase = 0, color = C.cyan}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const sway = pulse(frame, fps, 0.28, phase) * 8;
  const tilt = pulse(frame, fps, 0.28, phase + 0.4) * 4;

  return (
    <svg
      width={size}
      height={size * 1.28}
      viewBox="0 0 100 128"
      style={{overflow: 'visible', transform: `translateX(${sway}px) rotate(${tilt}deg) scale(${p})`, filter: glow(color, 0.7)}}
    >
      {/* Frenleme alanı */}
      <path d="M 8 44 A 42 42 0 0 1 92 44 Z" fill={`${color}18`} stroke={color} strokeWidth={2} />
      <path d="M 22 44 A 28 28 0 0 1 78 44" fill="none" stroke={color} strokeWidth={1} opacity={0.5} />
      <path d="M 50 4 L 50 44 M 8 44 L 30 44 M 70 44 L 92 44" stroke={color} strokeWidth={1} opacity={0.45} />
      {/* Askılar */}
      <path d="M 10 44 L 38 82 M 50 46 L 50 82 M 90 44 L 62 82" stroke={color} strokeWidth={1.2} fill="none" opacity={0.6} />
      {/* Kapsül */}
      <rect x={32} y={80} width={36} height={32} fill={`${color}1A`} stroke={color} strokeWidth={2} />
      <rect x={38} y={88} width={24} height={4} fill={color} opacity={0.8} />
      <rect x={38} y={97} width={16} height={4} fill={color} opacity={0.5} />
      {/* İniş ışığı */}
      <path d="M 40 112 L 34 126 M 60 112 L 66 126" stroke={color} strokeWidth={1.4} opacity={0.4} />
    </svg>
  );
};

/** İtki — yükseliş anları için. */
export const Rocket: React.FC<{readonly size: number; readonly delay?: number; readonly color?: string}> = ({
  size,
  delay = 0,
  color = C.cyan,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const flame = 0.7 + random(`flame-${Math.floor(frame / 2)}`) * 0.6;
  const shake = pulse(frame, fps, 7) * 1.2;

  return (
    <svg
      width={size}
      height={size * 1.45}
      viewBox="0 0 100 145"
      style={{overflow: 'visible', transform: `translateX(${shake}px) scale(${p})`, filter: glow(color, 0.8)}}
    >
      <g transform={`translate(50, 106) scale(1, ${flame}) translate(-50, -106)`}>
        <path d="M 40 102 Q 50 156 60 102 Z" fill={`${C.amber}55`} stroke={C.amber} strokeWidth={1.6} />
        <path d="M 45 102 Q 50 134 55 102 Z" fill={C.amber} opacity={0.8} />
      </g>
      <path d="M 50 6 Q 76 46 76 86 L 24 86 Q 24 46 50 6 Z" fill={`${color}14`} stroke={color} strokeWidth={2.2} />
      <path d="M 24 86 L 8 110 L 32 100 Z" fill={`${color}22`} stroke={color} strokeWidth={2} />
      <path d="M 76 86 L 92 110 L 68 100 Z" fill={`${color}22`} stroke={color} strokeWidth={2} />
      <rect x={32} y={86} width={36} height={16} fill={`${color}22`} stroke={color} strokeWidth={1.8} />
      <circle cx={50} cy={48} r={13} fill={`${color}33`} stroke={color} strokeWidth={2} />
      <circle cx={50} cy={48} r={6} fill={color} opacity={0.6} />
    </svg>
  );
};
