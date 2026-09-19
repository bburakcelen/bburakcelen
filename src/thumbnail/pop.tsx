import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../theme';

/**
 * ABD kripto/finans kanallarının kapak diline ait parçalar.
 *
 * O dilin kuralları videonun içindeki sinematik dilin tam tersi:
 * zemin karanlık değil parlak, yazı ince değil kalın konturlu, renk
 * desatüre değil tam doygun. Uzaktan bağırması gerekiyor, zarif durması
 * değil. Bu yüzden ayrı bir dosyada tutuluyor — theme.ts'in sci-fi
 * paleti buraya karışmasın.
 */

export const P = {
  black: '#0A0A0C',
  white: '#FFFFFF',
  yellow: '#FFD400',
  red: '#FF2036',
  green: '#00E070',
  gold: '#F7931A',
  goldDark: '#8A4A00',
} as const;

/* ------------------------------------------------------------ tipografi */

/**
 * Manşet. Kalın siyah kontur + sert gölge; hangi zeminin üstüne düşerse
 * düşsün okunur kalsın diye. paintOrder konturu harfin ARKASINA basar,
 * yoksa kontur gövdeyi içeriden yer ve harf inceltilmiş görünür.
 */
export const Punch: React.FC<{
  readonly children: React.ReactNode;
  readonly size: number;
  readonly color?: string;
  readonly stroke?: number;
  readonly strokeColor?: string;
  readonly lineHeight?: number;
  readonly align?: 'left' | 'center' | 'right';
  readonly style?: React.CSSProperties;
}> = ({
  children,
  size,
  color = P.white,
  stroke,
  strokeColor = P.black,
  lineHeight = 0.88,
  align = 'left',
  style,
}) => {
  const sw = stroke ?? Math.max(7, size * 0.085);
  return (
    <div
      style={{
        fontFamily: FONT.punch,
        fontSize: size,
        lineHeight,
        textTransform: 'uppercase',
        textAlign: align,
        color,
        WebkitTextStrokeWidth: sw,
        WebkitTextStrokeColor: strokeColor,
        paintOrder: 'stroke fill',
        filter: `drop-shadow(0 ${size * 0.055}px 0 ${strokeColor}) drop-shadow(0 ${size * 0.1}px ${size * 0.1}px rgba(0,0,0,0.55))`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Dolu renk etiketi — sarı zemin, siyah yazı, hafif eğik. */
export const Tag: React.FC<{
  readonly children: React.ReactNode;
  readonly size?: number;
  readonly bg?: string;
  readonly fg?: string;
  readonly skew?: number;
}> = ({children, size = 42, bg = P.yellow, fg = P.black, skew = -5}) => (
  <div
    style={{
      display: 'inline-block',
      background: bg,
      color: fg,
      fontFamily: FONT.punch,
      fontSize: size,
      lineHeight: 1,
      letterSpacing: '0.01em',
      textTransform: 'uppercase',
      padding: `${size * 0.3}px ${size * 0.5}px ${size * 0.22}px`,
      border: `${Math.max(4, size * 0.1)}px solid ${P.black}`,
      transform: `skewX(${skew}deg)`,
      boxShadow: `0 ${size * 0.2}px 0 rgba(0,0,0,0.9)`,
    }}
  >
    <span style={{display: 'inline-block', transform: `skewX(${-skew}deg)`}}>{children}</span>
  </div>
);

/* ------------------------------------------------------------- zeminler */

/** Merkezden dağılan ışınlar. Kapakta gözü ortadaki nesneye çeker. */
export const Sunburst: React.FC<{
  readonly color?: string;
  readonly opacity?: number;
  readonly at?: string;
  readonly step?: number;
}> = ({color = 'rgba(255,255,255,0.9)', opacity = 0.14, at = '50% 58%', step = 7}) => (
  <AbsoluteFill
    style={{
      background: `repeating-conic-gradient(from 0deg at ${at}, ${color} 0deg ${step}deg, transparent ${step}deg ${step * 2}deg)`,
      opacity,
    }}
  />
);

/** Kenarlardan içeri karartma — düz zemine derinlik verir. */
export const Vignette: React.FC<{readonly strength?: number}> = ({strength = 0.55}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 78% 74% at 50% 46%, rgba(0,0,0,0) 40%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

// Yükselen bir seri — kapakta "yukarı giden grafik" mesajı tek bakışta okunsun
const SERIES = [0.3, 0.24, 0.33, 0.29, 0.4, 0.35, 0.47, 0.43, 0.55, 0.5, 0.62, 0.58, 0.7, 0.66, 0.78, 0.74, 0.85, 0.81, 0.92, 0.99];

/** Mum grafiği — kripto kapaklarının değişmez arka plan öğesi. */
export const Candles: React.FC<{
  readonly width?: number;
  readonly height?: number;
  readonly opacity?: number;
}> = ({width = 1280, height = 340, opacity = 1}) => {
  const cw = width / SERIES.length;
  const bw = cw * 0.5;
  const Y = (v: number) => height - (v * height * 0.9 + height * 0.05);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{display: 'block', opacity}}>
      {SERIES.map((v, i) => {
        const prev = i === 0 ? v - 0.05 : SERIES[i - 1];
        const up = v >= prev;
        const cx = cw * (i + 0.5);
        const top = Y(Math.max(v, prev));
        const bot = Y(Math.min(v, prev));
        const col = up ? P.green : P.red;

        return (
          <g key={i}>
            <line x1={cx} y1={top - 14 - (i % 3) * 7} x2={cx} y2={bot + 13 + (i % 2) * 6} stroke={col} strokeWidth={5} />
            <rect x={cx - bw / 2} y={top} width={bw} height={Math.max(10, bot - top)} rx={2} fill={col} />
          </g>
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------- nesneler */

/**
 * Karakteri çıkartmaya çevirir: beyaz kontur + altında gölge.
 * Zincirlenen drop-shadow'lar birbirinin üstüne bindiği için dört yön
 * köşeleri de kapatmaya yetiyor.
 */
export const Sticker: React.FC<{
  readonly children: React.ReactNode;
  readonly width?: number;
  readonly color?: string;
  readonly shadow?: boolean;
  readonly style?: React.CSSProperties;
}> = ({children, width = 7, color = P.white, shadow = true, style}) => (
  <div
    style={{
      lineHeight: 0,
      filter:
        `drop-shadow(${width}px 0 0 ${color}) drop-shadow(-${width}px 0 0 ${color}) ` +
        `drop-shadow(0 ${width}px 0 ${color}) drop-shadow(0 -${width}px 0 ${color})` +
        (shadow ? ' drop-shadow(0 20px 26px rgba(0,0,0,0.5))' : ''),
      ...style,
    }}
  >
    {children}
  </div>
);

/** Elle çizilmiş gibi duran kırmızı daire — "şuraya bak" işareti. */
export const MarkerCircle: React.FC<{
  readonly width: number;
  readonly height: number;
  readonly color?: string;
  readonly rotate?: number;
  readonly thickness?: number;
}> = ({width, height, color = P.red, rotate = -7, thickness = 10}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 240 150"
    preserveAspectRatio="none"
    style={{display: 'block', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5))'}}
  >
    <ellipse
      cx="120"
      cy="75"
      rx="112"
      ry="68"
      fill="none"
      stroke={color}
      strokeWidth={thickness}
      strokeLinecap="round"
      strokeDasharray="505 70"
      strokeDashoffset="46"
      transform={`rotate(${rotate} 120 75)`}
    />
  </svg>
);

/** Kalın ok. 0° sağa bakar. */
export const Arrow: React.FC<{
  readonly size: number;
  readonly color?: string;
  readonly rotate?: number;
}> = ({size, color = P.red, rotate = 0}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{display: 'block', transform: `rotate(${rotate}deg)`, filter: 'drop-shadow(0 8px 0 rgba(0,0,0,0.9))'}}
  >
    <path
      d="M 10 62 L 56 62 L 56 88 L 94 50 L 56 12 L 56 38 L 10 38 Z"
      fill={color}
      stroke={P.black}
      strokeWidth="7"
      strokeLinejoin="round"
    />
  </svg>
);

/** Bitcoin madeni — kanalın konusu tek bakışta okunsun diye. */
export const Coin: React.FC<{readonly size: number; readonly rotate?: number}> = ({size, rotate = -12}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{display: 'block', transform: `rotate(${rotate}deg)`, filter: 'drop-shadow(0 18px 28px rgba(0,0,0,0.55))'}}
  >
    <defs>
      <linearGradient id="coinFace" x1="0.1" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stopColor="#FFD066" />
        <stop offset="46%" stopColor={P.gold} />
        <stop offset="100%" stopColor="#C46F05" />
      </linearGradient>
    </defs>
    {/* Kalınlık — madeni düz bir daire değil, bir nesne gibi gösterir */}
    <circle cx="50" cy="55" r="45" fill="#A65400" stroke={P.black} strokeWidth="5" />
    <circle cx="50" cy="49" r="45" fill="url(#coinFace)" stroke={P.black} strokeWidth="5" />
    <circle cx="50" cy="49" r="36" fill="none" stroke="#C46F05" strokeWidth="3" opacity="0.7" />
    {/* ₿ — font glifine güvenmeden çiziliyor: gövde iki kavisli kalem darbesi,
        üstte ve altta dört tırnak. Anton'un B harfi burada tutmuyordu. */}
    <g stroke={P.goldDark} strokeWidth="9" fill="none" strokeLinecap="square" strokeLinejoin="round">
      <path d="M 36 25 L 36 73" />
      <path d="M 36 29 H 55 A 9.5 9.5 0 0 1 55 48 H 36" />
      <path d="M 36 48 H 59 A 11 11 0 0 1 59 70 H 36" />
    </g>
    <g fill={P.goldDark}>
      <rect x="38" y="13" width="9" height="14" rx="2" />
      <rect x="52" y="13" width="9" height="14" rx="2" />
      <rect x="38" y="71" width="9" height="14" rx="2" />
      <rect x="52" y="71" width="9" height="14" rx="2" />
    </g>
  </svg>
);

/** Sarı-siyah uyarı şeridi. */
export const HazardStrip: React.FC<{readonly height?: number}> = ({height = 26}) => (
  <div
    style={{
      height,
      background: `repeating-linear-gradient(-45deg, ${P.yellow} 0 22px, ${P.black} 22px 44px)`,
      borderTop: `4px solid ${P.black}`,
      borderBottom: `4px solid ${P.black}`,
    }}
  />
);
