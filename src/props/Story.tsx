import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, glow, textGlow} from '../theme';
import {easeIn, loop, popIn, pulse, stagger} from '../lib/anim';

/**
 * Buzdağı — "internette sadece sonucu görürsünüz".
 * Sci-fi dilinde: su üstü parlak bir tepe, altta sonar taramasıyla
 * ortaya çıkan devasa gövde.
 */
export const Iceberg: React.FC<{
  readonly width: number;
  readonly topLabel: string;
  readonly bottomLabels: readonly string[];
  readonly delay?: number;
}> = ({width, topLabel, bottomLabels, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rise = popIn({frame, fps, delay});
  const h = width * 1.02;
  const waterY = h * 0.3;
  const bob = pulse(frame, fps, 0.18) * 5;
  const sonar = loop(frame, 140);

  return (
    <div style={{position: 'relative', width, height: h, transform: `scale(${rise})`}}>
      <svg width={width} height={h} style={{overflow: 'visible', filter: glow(C.cyan, 0.5)}}>
        <g transform={`translate(0, ${bob})`}>
          {/* Su altı gövdesi */}
          <path
            d={`M ${width * 0.5} ${waterY - 6}
                L ${width * 0.93} ${waterY + 14}
                L ${width * 0.74} ${h * 0.72}
                L ${width * 0.52} ${h}
                L ${width * 0.26} ${h * 0.78}
                L ${width * 0.06} ${waterY + 12} Z`}
            fill={`${C.cyan}0E`}
            stroke={`${C.cyan}66`}
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
          {/* Sonar tarama çizgisi */}
          <line
            x1={width * 0.04}
            y1={waterY + (h - waterY) * sonar}
            x2={width * 0.96}
            y2={waterY + (h - waterY) * sonar}
            stroke={C.cyan}
            strokeWidth={1.6}
            opacity={0.5}
          />
          {/* Su üstü tepe — tek parlak kısım */}
          <path
            d={`M ${width * 0.5} ${h * 0.02} L ${width * 0.64} ${waterY} L ${width * 0.36} ${waterY} Z`}
            fill={`${C.amber}44`}
            stroke={C.amber}
            strokeWidth={2.4}
            strokeLinejoin="round"
          />
        </g>

        {/* Su yüzeyi */}
        <line x1={-500} y1={waterY} x2={width + 500} y2={waterY} stroke={C.cyan} strokeWidth={2.4} opacity={0.9} />
        <rect x={-500} y={waterY} width={width + 1000} height={3} fill={C.cyan} opacity={0.2} />
      </svg>

      <div
        style={{
          position: 'absolute',
          top: -4,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: FONT.display,
          fontWeight: 700,
          fontSize: 38,
          letterSpacing: '0.16em',
          color: C.amber,
          whiteSpace: 'nowrap',
          textShadow: textGlow(C.amber, 1),
          opacity: easeIn({frame, delay: delay + 8, duration: 14}),
        }}
      >
        {topLabel}
      </div>

      <div
        style={{
          position: 'absolute',
          top: waterY + h * 0.1,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
        }}
      >
        {bottomLabels.map((l, i) => {
          const o = easeIn({frame, delay: delay + 20 + stagger(i, 10), duration: 16});
          return (
            <div
              key={l}
              style={{
                fontFamily: FONT.mono,
                fontSize: 27,
                letterSpacing: '0.1em',
                color: C.text,
                opacity: o * 0.8,
                transform: `translateY(${(1 - o) * 12}px)`,
              }}
            >
              {l}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Reddedildi damgası — içine istediğin nesneyi alır. */
export const NoSign: React.FC<{
  readonly size: number;
  readonly delay?: number;
  readonly children?: React.ReactNode;
  readonly label?: string;
}> = ({size, delay = 0, children, label = 'DENIED'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ring = popIn({frame, fps, delay});
  const slash = interpolate(frame - delay - 12, [0, 7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const flicker = frame > delay + 18 ? 0.72 + Math.abs(pulse(frame, fps, 3.2)) * 0.28 : 0;

  return (
    <div style={{position: 'relative', width: size, height: size, display: 'grid', placeItems: 'center'}}>
      <div style={{position: 'absolute', transform: 'scale(0.78)', filter: 'saturate(0.5) brightness(0.7)'}}>{children}</div>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', overflow: 'visible', filter: glow(C.red, 0.9)}}>
        <circle cx={50} cy={50} r={44} fill="none" stroke={C.red} strokeWidth={4} opacity={ring} />
        <line x1={19} y1={81} x2={19 + 62 * slash} y2={81 - 62 * slash} stroke={C.red} strokeWidth={4} strokeLinecap="round" />
      </svg>
      <div
        style={{
          position: 'absolute',
          bottom: -14,
          fontFamily: FONT.mono,
          fontSize: size * 0.085,
          letterSpacing: '0.34em',
          color: C.red,
          opacity: flicker,
          textShadow: textGlow(C.red, 1),
        }}
      >
        {label}
      </div>
    </div>
  );
};

/** Koruma kalkanı — enerji alanı. */
export const Shield: React.FC<{readonly size: number; readonly delay?: number; readonly symbol?: string}> = ({
  size,
  delay = 0,
  symbol = '$',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const ripple = loop(frame, 96);

  return (
    <svg
      width={size}
      height={size * 1.12}
      viewBox="0 0 100 112"
      style={{overflow: 'visible', transform: `scale(${p})`, filter: glow(C.green, 0.9)}}
    >
      <path d="M 50 4 L 92 20 L 92 58 Q 92 92 50 108 Q 8 92 8 58 L 8 20 Z" fill={`${C.green}12`} stroke={C.green} strokeWidth={2.4} strokeLinejoin="round" />
      <path d="M 50 14 L 83 27 L 83 58 Q 83 85 50 98 Q 17 85 17 58 L 17 27 Z" fill="none" stroke={C.green} strokeWidth={1} opacity={0.4} />
      {/* Enerji dalgası */}
      <path
        d="M 50 4 L 92 20 L 92 58 Q 92 92 50 108 Q 8 92 8 58 L 8 20 Z"
        fill="none"
        stroke={C.green}
        strokeWidth={3}
        opacity={(1 - ripple) * 0.6}
        transform={`translate(50 56) scale(${1 + ripple * 0.22}) translate(-50 -56)`}
      />
      <text x={50} y={58} textAnchor="middle" dominantBaseline="central" fontFamily={FONT.display} fontSize={40} fontWeight={700} fill={C.green}>
        {symbol}
      </text>
    </svg>
  );
};

/** Büyük sayaç — mono font, HUD okuması gibi. */
export const Counter: React.FC<{
  readonly to: number;
  readonly duration?: number;
  readonly delay?: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly size?: number;
  readonly color?: string;
}> = ({to, duration = 50, delay = 0, prefix = '', suffix = '', size = 140, color = C.amber}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const eased = easeIn({frame, delay, duration});
  const value = Math.floor(eased * to);

  return (
    <div
      style={{
        fontFamily: FONT.mono,
        fontWeight: 700,
        fontSize: size,
        color,
        textShadow: textGlow(color, 1.1),
        transform: `scale(${p})`,
        letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums',
        display: 'flex',
        alignItems: 'baseline',
      }}
    >
      {prefix}
      {value.toLocaleString('en-US')}
      <span style={{fontSize: size * 0.4, marginLeft: size * 0.06, opacity: 0.7}}>{suffix}</span>
    </div>
  );
};

/** İzleyici mesajları — terminal satırları gibi. */
export const CommentStack: React.FC<{
  readonly items: readonly string[];
  readonly width: number;
  readonly delay?: number;
  readonly color?: string;
}> = ({items, width, delay = 0, color = C.cyan}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 16, width}}>
      {items.map((item, i) => {
        const p = easeIn({frame, delay: delay + stagger(i, 9), duration: 14});
        return (
          <div
            key={item}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              background: `${color}0C`,
              borderLeft: `3px solid ${color}`,
              padding: '14px 22px',
              opacity: p,
              transform: `translateX(${(1 - p) * -26}px)`,
            }}
          >
            <span style={{fontFamily: FONT.mono, fontSize: 18, color, opacity: 0.7}}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 29, color: C.text}}>{item}</span>
          </div>
        );
      })}
    </div>
  );
};
