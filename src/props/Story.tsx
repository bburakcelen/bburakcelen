import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, STROKE} from '../theme';
import {easeIn, popIn, pulse, stagger} from '../lib/anim';

/**
 * Buzdağı — "internette sadece sonucu görürsünüz" fikri için.
 * Su üstü küçük ve parlak, su altı kocaman ve karanlık.
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
  const h = width * 0.98;
  const waterY = h * 0.3;
  const bob = pulse(frame, fps, 0.22) * 6;

  return (
    <div style={{position: 'relative', width, height: h, transform: `scale(${rise})`}}>
      <svg width={width} height={h} style={{overflow: 'visible'}}>
        {/* Su altı kütlesi */}
        <g transform={`translate(0, ${bob})`}>
          <path
            d={`M ${width * 0.5} ${waterY - 6}
                L ${width * 0.93} ${waterY + 14}
                L ${width * 0.74} ${h * 0.72}
                L ${width * 0.52} ${h}
                L ${width * 0.26} ${h * 0.78}
                L ${width * 0.06} ${waterY + 12} Z`}
            fill="#2C6E9B"
            stroke={C.ink}
            strokeWidth={STROKE.normal}
            strokeLinejoin="round"
            opacity={0.95}
          />
          {/* Su üstü tepe */}
          <path
            d={`M ${width * 0.5} ${h * 0.03}
                L ${width * 0.63} ${waterY}
                L ${width * 0.37} ${waterY} Z`}
            fill={C.paper}
            stroke={C.ink}
            strokeWidth={STROKE.normal}
            strokeLinejoin="round"
          />
        </g>

        {/* Su çizgisi */}
        <line
          x1={-460}
          y1={waterY}
          x2={width + 460}
          y2={waterY}
          stroke={C.cyan}
          strokeWidth={6}
          strokeLinecap="round"
          opacity={0.85}
        />
      </svg>

      {/* Su üstü etiketi */}
      <div
        style={{
          position: 'absolute',
          top: -18,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: FONT.display,
          fontWeight: 700,
          fontSize: 44,
          color: C.gold,
          whiteSpace: 'nowrap',
          textShadow: `0 5px 0 ${C.ink}`,
          opacity: easeIn({frame, delay: delay + 8, duration: 14}),
        }}
      >
        {topLabel}
      </div>

      {/* Su altı etiketleri */}
      <div
        style={{
          position: 'absolute',
          top: waterY + h * 0.1,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {bottomLabels.map((l, i) => {
          const o = easeIn({frame, delay: delay + 20 + stagger(i, 10), duration: 16});
          return (
            <div
              key={l}
              style={{
                fontFamily: FONT.body,
                fontWeight: 800,
                fontSize: 34,
                color: C.paper,
                opacity: o * 0.92,
                transform: `translateY(${(1 - o) * 12}px)`,
                textShadow: `0 3px 0 rgba(0,0,0,0.5)`,
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

/** Üstü çizili yasak işareti — içine istediğin nesneyi koyabilirsin. */
export const NoSign: React.FC<{
  readonly size: number;
  readonly delay?: number;
  readonly children?: React.ReactNode;
}> = ({size, delay = 0, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ring = popIn({frame, fps, delay});
  // Çapraz çizgi sonradan ve sert biçimde çizilir
  const slash = interpolate(frame - delay - 12, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{position: 'relative', width: size, height: size, display: 'grid', placeItems: 'center'}}>
      <div style={{position: 'absolute', transform: 'scale(0.62)'}}>{children}</div>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', overflow: 'visible'}}>
        <circle
          cx={50}
          cy={50}
          r={44}
          fill="none"
          stroke={C.down}
          strokeWidth={11}
          opacity={ring}
          transform={`rotate(${(1 - ring) * -40} 50 50) scale(${ring}) translate(${(1 - ring) * 50} ${(1 - ring) * 50})`}
        />
        <line
          x1={19}
          y1={81}
          x2={19 + 62 * slash}
          y2={81 - 62 * slash}
          stroke={C.down}
          strokeWidth={11}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

/** Kalkan — parayı koruma fikri. */
export const Shield: React.FC<{readonly size: number; readonly delay?: number; readonly symbol?: string}> = ({
  size,
  delay = 0,
  symbol = '$',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const shine = pulse(frame, fps, 0.45);

  return (
    <svg width={size} height={size * 1.12} viewBox="0 0 100 112" style={{overflow: 'visible', transform: `scale(${p})`}}>
      <path
        d="M 50 4 L 92 20 L 92 58 Q 92 92 50 108 Q 8 92 8 58 L 8 20 Z"
        fill={C.up}
        stroke={C.ink}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <path d="M 50 4 L 92 20 L 92 58 Q 92 92 50 108 Z" fill="#26A65B" opacity={0.6} />
      <text
        x={50}
        y={58}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={FONT.display}
        fontSize={46}
        fontWeight={700}
        fill={C.white}
      >
        {symbol}
      </text>
      <path
        d="M 24 26 L 40 22 L 30 50 Z"
        fill={C.white}
        opacity={0.28 + shine * 0.2}
      />
    </svg>
  );
};

/** Büyük sayı sayacı — "1.000.000 abone" gibi anlar için. */
export const Counter: React.FC<{
  readonly to: number;
  readonly duration?: number;
  readonly delay?: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly size?: number;
  readonly color?: string;
}> = ({to, duration = 50, delay = 0, prefix = '', suffix = '', size = 150, color = C.gold}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});
  const eased = easeIn({frame, delay, duration});
  const value = Math.floor(eased * to);

  return (
    <div
      style={{
        fontFamily: FONT.display,
        fontWeight: 700,
        fontSize: size,
        color,
        textShadow: `0 8px 0 ${C.ink}`,
        transform: `scale(${p})`,
        letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {prefix}
      {value.toLocaleString('en-US')}
      {suffix}
    </div>
  );
};

/** Yorum kutucukları — izleyici etkileşimi sahneleri için. */
export const CommentStack: React.FC<{
  readonly items: readonly string[];
  readonly width: number;
  readonly delay?: number;
}> = ({items, width, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 18, width}}>
      {items.map((item, i) => {
        const p = popIn({frame, fps, delay: delay + stagger(i, 9)});
        return (
          <div
            key={item}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              background: C.paper,
              border: `${STROKE.normal}px solid ${C.ink}`,
              borderRadius: 20,
              padding: '14px 22px',
              transform: `scale(${p}) translateX(${(1 - p) * -30}px)`,
              transformOrigin: 'left center',
              opacity: Math.min(1, p * 1.4),
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: [C.cyan, C.purple, C.up, C.gold][i % 4],
                border: `4px solid ${C.ink}`,
                flexShrink: 0,
              }}
            />
            <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 30, color: C.ink}}>{item}</div>
          </div>
        );
      })}
    </div>
  );
};
