import React from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, glow, textGlow} from '../theme';
import {easeIn, loop, popIn, pulse, stagger} from '../lib/anim';

/** HUD köşe ayraçları — herhangi bir içeriği "arayüz" gibi çerçeveler. */
export const HudFrame: React.FC<{
  readonly width: number;
  readonly height: number;
  readonly color?: string;
  readonly delay?: number;
  readonly label?: string;
  readonly children?: React.ReactNode;
}> = ({width, height, color = C.cyan, delay = 0, label, children}) => {
  const frame = useCurrentFrame();
  const p = easeIn({frame, delay, duration: 14});
  const corner = Math.min(width, height) * 0.16;

  const Bracket: React.FC<{readonly sx: number; readonly sy: number}> = ({sx, sy}) => (
    <path
      d={`M ${sx > 0 ? width - corner : corner} ${sy > 0 ? height - 1 : 1}
          L ${sx > 0 ? width - 1 : 1} ${sy > 0 ? height - 1 : 1}
          L ${sx > 0 ? width - 1 : 1} ${sy > 0 ? height - corner : corner}`}
      fill="none"
      stroke={color}
      strokeWidth={2.6}
      strokeLinecap="square"
      opacity={p}
    />
  );

  return (
    <div style={{position: 'relative', width, height}}>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0, filter: glow(color, 0.5)}}>
        <rect x={1} y={1} width={width - 2} height={height - 2} fill={`${color}08`} stroke={`${color}33`} strokeWidth={1.2} opacity={p} />
        <Bracket sx={-1} sy={-1} />
        <Bracket sx={1} sy={-1} />
        <Bracket sx={-1} sy={1} />
        <Bracket sx={1} sy={1} />
      </svg>
      {label ? (
        <div
          style={{
            position: 'absolute',
            top: -12,
            left: 22,
            padding: '0 10px',
            background: C.void,
            fontFamily: FONT.mono,
            fontSize: 15,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color,
            opacity: p,
            textShadow: textGlow(color, 0.6),
          }}
        >
          {label}
        </div>
      ) : null}
      <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center'}}>{children}</div>
    </div>
  );
};

/** Holografik panel — cam yüzey, üstünden geçen tarama ışığı. */
export const HoloPanel: React.FC<{
  readonly width: number;
  readonly height: number;
  readonly color?: string;
  readonly delay?: number;
  readonly label?: string;
  readonly children?: React.ReactNode;
}> = ({width, height, color = C.cyan, delay = 0, label, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const sweep = loop(frame, 110);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        transform: `scale(${p})`,
        opacity: Math.min(1, p * 1.6),
        overflow: 'hidden',
        background: `linear-gradient(150deg, ${color}14 0%, ${color}05 46%, transparent 100%)`,
        border: `1.4px solid ${color}44`,
        boxShadow: `0 0 34px ${color}22, inset 0 0 44px ${color}0D`,
      }}
    >
      {/* Tarama ışığı */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${sweep * 130 - 15}%`,
          height: '18%',
          background: `linear-gradient(to bottom, transparent, ${color}1F, transparent)`,
        }}
      />
      {label ? (
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 20,
            fontFamily: FONT.mono,
            fontSize: 16,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color,
            opacity: 0.85,
          }}
        >
          {label}
        </div>
      ) : null}
      <div style={{position: 'absolute', inset: 0, display: 'grid', placeItems: 'center'}}>{children}</div>
    </div>
  );
};

/** Akan veri sütunları — arka planda "sistem çalışıyor" hissi. */
export const DataStream: React.FC<{
  readonly width: number;
  readonly height: number;
  readonly color?: string;
  readonly columns?: number;
  readonly delay?: number;
}> = ({width, height, color = C.cyan, columns = 9, delay = 0}) => {
  const frame = useCurrentFrame();
  const o = easeIn({frame, delay, duration: 20});
  const colW = width / columns;

  return (
    <div style={{width, height, position: 'relative', overflow: 'hidden', opacity: o}}>
      {Array.from({length: columns}, (_, i) => {
        const speed = 0.5 + random(`ds-s-${i}`) * 1.5;
        const offset = random(`ds-o-${i}`) * height;
        const y = ((frame * speed + offset) % (height * 2)) - height * 0.5;
        const chars = Array.from({length: 12}, (_, j) =>
          random(`ds-c-${i}-${j}-${Math.floor(frame / 9)}`) > 0.5 ? '1' : '0',
        ).join('');

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: i * colW,
              top: y,
              width: colW,
              fontFamily: FONT.mono,
              fontSize: colW * 0.52,
              lineHeight: 1.5,
              color,
              opacity: 0.12 + random(`ds-a-${i}`) * 0.3,
              writingMode: 'vertical-rl',
              letterSpacing: '0.2em',
            }}
          >
            {chars}
          </div>
        );
      })}
    </div>
  );
};

/** Tel kafes dünya — "dünya vatandaşı" ve küresel topluluk anları için. */
export const WireGlobe: React.FC<{
  readonly size: number;
  readonly color?: string;
  readonly delay?: number;
}> = ({size, color = C.cyan, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const spin = loop(frame, 380);
  const r = 48;

  return (
    <svg width={size} height={size} viewBox="0 0 110 110" style={{overflow: 'visible', transform: `scale(${p})`, filter: glow(color, 0.8)}}>
      <circle cx={55} cy={55} r={r} fill={`${color}0A`} stroke={color} strokeWidth={1.4} opacity={0.9} />

      {/* Enlemler */}
      {[-0.66, -0.34, 0, 0.34, 0.66].map((k) => (
        <ellipse key={k} cx={55} cy={55 + k * r} rx={r * Math.sqrt(Math.max(0.02, 1 - k * k))} ry={r * 0.13} fill="none" stroke={color} strokeWidth={1} opacity={0.45} />
      ))}

      {/* Boylamlar — dönen */}
      {Array.from({length: 7}, (_, i) => {
        const phase = ((i / 7 + spin) % 1) * Math.PI * 2;
        const rx = Math.abs(Math.cos(phase)) * r;
        return <ellipse key={i} cx={55} cy={55} rx={Math.max(0.6, rx)} ry={r} fill="none" stroke={color} strokeWidth={1} opacity={0.3 + Math.abs(Math.cos(phase)) * 0.3} />;
      })}

      {/* Yüzeyde parlayan düğümler */}
      {Array.from({length: 9}, (_, i) => {
        const a = ((i / 9 + spin) % 1) * Math.PI * 2;
        const lat = (random(`g-lat-${i}`) - 0.5) * 1.5;
        const x = 55 + Math.cos(a) * r * Math.cos(lat) * 0.92;
        const y = 55 + Math.sin(lat) * r * 0.92;
        const front = Math.cos(a) > -0.1;
        return <circle key={i} cx={x} cy={y} r={2.2} fill={color} opacity={front ? 0.95 : 0.22} />;
      })}
    </svg>
  );
};

/** Tarama yapan radar — araştırma / keşif sahneleri. */
export const Radar: React.FC<{readonly size: number; readonly color?: string; readonly delay?: number}> = ({
  size,
  color = C.cyan,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const angle = loop(frame, 95) * 360;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: 'visible', transform: `scale(${p})`, filter: glow(color, 0.7)}}>
      <defs>
        <linearGradient id="radar-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[46, 34, 22, 10].map((r) => (
        <circle key={r} cx={50} cy={50} r={r} fill="none" stroke={color} strokeWidth={1} opacity={0.35} />
      ))}
      <line x1={4} y1={50} x2={96} y2={50} stroke={color} strokeWidth={0.8} opacity={0.25} />
      <line x1={50} y1={4} x2={50} y2={96} stroke={color} strokeWidth={0.8} opacity={0.25} />

      <g transform={`rotate(${angle} 50 50)`}>
        <path d="M 50 50 L 96 50 A 46 46 0 0 0 82 18 Z" fill="url(#radar-sweep)" />
        <line x1={50} y1={50} x2={96} y2={50} stroke={color} strokeWidth={1.6} />
      </g>

      {/* Yakalanan hedefler */}
      {Array.from({length: 4}, (_, i) => {
        const a = random(`rt-a-${i}`) * Math.PI * 2;
        const d = 12 + random(`rt-d-${i}`) * 32;
        const x = 50 + Math.cos(a) * d;
        const y = 50 + Math.sin(a) * d;
        const blip = Math.max(0, Math.sin((frame / 95 - i * 0.2) * Math.PI * 2));
        return <circle key={i} cx={x} cy={y} r={2.4} fill={color} opacity={0.25 + blip * 0.75} />;
      })}
    </svg>
  );
};

/** Kayan fiyat şeridi — finans kanalı imzası. */
export const Ticker: React.FC<{
  readonly width: number;
  readonly delay?: number;
  readonly speed?: number;
}> = ({width, delay = 0, speed = 1}) => {
  const frame = useCurrentFrame();
  const o = easeIn({frame, delay, duration: 16});
  const SYMBOLS = ['BTC', 'ETH', 'SOL', 'ARB', 'OP', 'SUI', 'TIA', 'INJ'];

  const items = SYMBOLS.map((sym, i) => {
    const up = random(`tk-${sym}`) > 0.42;
    const pct = (0.2 + random(`tk-p-${sym}`) * 9.4).toFixed(2);
    return {sym, up, pct, i};
  });

  const shift = (loop(frame, 420 / speed) * 100) % 100;

  return (
    <div style={{width, overflow: 'hidden', opacity: o, borderTop: `1px solid ${C.cyan}22`, borderBottom: `1px solid ${C.cyan}22`, padding: '10px 0'}}>
      <div style={{display: 'flex', gap: 46, transform: `translateX(-${shift}%)`, whiteSpace: 'nowrap'}}>
        {[...items, ...items, ...items].map((it, n) => (
          <div key={n} style={{display: 'flex', gap: 10, alignItems: 'baseline', fontFamily: FONT.mono, fontSize: 22}}>
            <span style={{color: C.textDim, letterSpacing: '0.1em'}}>{it.sym}</span>
            <span style={{color: it.up ? C.green : C.red, fontWeight: 700}}>
              {it.up ? '▲' : '▼'} {it.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Bağlı düğüm ağı — blok zinciri / ekosistem görseli. */
export const NodeGraph: React.FC<{
  readonly width: number;
  readonly height: number;
  readonly color?: string;
  readonly nodes?: number;
  readonly delay?: number;
}> = ({width, height, color = C.violet, nodes = 11, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pts = Array.from({length: nodes}, (_, i) => ({
    x: 40 + random(`ng-x-${i}`) * (width - 80),
    y: 36 + random(`ng-y-${i}`) * (height - 72),
    r: 5 + random(`ng-r-${i}`) * 7,
  }));

  // Her düğümü kendine en yakın ikisine bağla
  const edges: Array<[number, number]> = [];
  pts.forEach((a, i) => {
    const near = pts
      .map((b, j) => ({j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2}))
      .filter((e) => e.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    near.forEach((n) => {
      if (!edges.some(([x, y]) => (x === n.j && y === i) || (x === i && y === n.j))) edges.push([i, n.j]);
    });
  });

  return (
    <svg width={width} height={height} style={{overflow: 'visible', filter: glow(color, 0.5)}}>
      {edges.map(([i, j], n) => {
        const p = easeIn({frame, delay: delay + stagger(n, 2), duration: 12});
        return (
          <line key={n} x1={pts[i].x} y1={pts[i].y} x2={pts[j].x} y2={pts[j].y} stroke={color} strokeWidth={1.2} opacity={p * 0.42} />
        );
      })}
      {pts.map((pt, i) => {
        const p = popIn({frame, fps, delay: delay + stagger(i, 4)});
        const beat = 0.55 + (pulse(frame, fps, 0.5, i) + 1) * 0.22;
        return (
          <g key={i} opacity={p}>
            <circle cx={pt.x} cy={pt.y} r={pt.r * 2.2} fill={color} opacity={0.1 * beat} />
            <circle cx={pt.x} cy={pt.y} r={pt.r} fill={C.void} stroke={color} strokeWidth={1.8} />
            <circle cx={pt.x} cy={pt.y} r={pt.r * 0.42} fill={color} opacity={beat} />
          </g>
        );
      })}
    </svg>
  );
};
