import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {FONT} from '../theme';
import {Coin} from './pop';

/**
 * Referans kapakların dili: düz zemin yok, derinlik var.
 *
 * Bakılan örneklerde arka plan bir stüdyo fotoğrafı gibi kuruluyor —
 * birkaç yumuşak ışık kaynağı, odak dışında kalmış lekeler, arkada
 * hafif bulanık bir grafik. Ön planda ise tek bir düz renk bloğu ve
 * içinde kısa, küçük harfli bir cümle. Blok kontursuz ve gölgesiz düz
 * duruyor; gücü tam da bu sadelikten geliyor.
 *
 * Buradaki parçalar o kurgunun malzemeleri.
 */

/** Yumuşak ışık kaynağı. Zemini düz olmaktan çıkaran ana araç. */
export const Orb: React.FC<{
  readonly x: string;
  readonly y: string;
  readonly size: number;
  readonly color: string;
  readonly opacity?: number;
}> = ({x, y, size, color, opacity = 0.55}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: size,
      height: size,
      marginLeft: -size / 2,
      marginTop: -size / 2,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 68%)`,
      opacity,
    }}
  />
);

/** Odak dışında kalmış parçacıklar. Derinliği taşıyan katman. */
export const Bokeh: React.FC<{
  readonly seed?: string;
  readonly count?: number;
  readonly colors?: readonly string[];
  readonly maxSize?: number;
  readonly opacity?: number;
}> = ({seed = 'k', count = 30, colors = ['#8AEBFF', '#FFCB7A'], maxSize = 130, opacity = 0.55}) => (
  <AbsoluteFill style={{opacity}}>
    {new Array(count).fill(0).map((_, i) => {
      const r = (k: string) => random(`${seed}-${i}-${k}`);
      const t = r('s') ** 2;
      const size = 16 + t * maxSize;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${r('x') * 106 - 3}%`,
            top: `${r('y') * 106 - 3}%`,
            width: size,
            height: size,
            borderRadius: '50%',
            background: colors[Math.floor(r('c') * colors.length)],
            opacity: 0.1 + r('o') * 0.38,
            filter: `blur(${3 + t * 15}px)`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// Yükselen bir seri. Kesin sayılar önemli değil, yönü önemli.
const LINE: readonly (readonly [number, number])[] = [
  [0, 0.74], [0.09, 0.67], [0.18, 0.76], [0.27, 0.59], [0.36, 0.64],
  [0.45, 0.48], [0.54, 0.54], [0.63, 0.37], [0.72, 0.43], [0.81, 0.24],
  [0.9, 0.3], [1, 0.08],
];

/** Arkada parlayan yükselen grafik — hafif bulanık, çünkü odakta değil. */
export const ChartGlow: React.FC<{
  readonly color?: string;
  readonly width?: number;
  readonly height?: number;
  readonly blur?: number;
  readonly opacity?: number;
}> = ({color = '#3BE0FF', width = 1280, height = 400, blur = 2.5, opacity = 0.8}) => {
  const pts = LINE.map(([x, y]) => `${x * width},${y * height}`).join(' ');
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{display: 'block', filter: `blur(${blur}px)`, opacity}}
    >
      <defs>
        <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.38" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${pts} ${width},${height}`} fill="url(#chartArea)" />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{filter: `drop-shadow(0 0 16px ${color}) drop-shadow(0 0 40px ${color}99)`}}
      />
    </svg>
  );
};

/** Farklı boyda ve netlikte birkaç madeni para — alan derinliği hissi. */
export const CoinCluster: React.FC<{
  readonly x: string;
  readonly y: string;
  readonly scale?: number;
}> = ({x, y, scale = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${scale})`}}>
    <div style={{position: 'absolute', left: -186, top: -108, filter: 'blur(3.5px)', opacity: 0.78}}>
      <Coin size={128} rotate={-24} />
    </div>
    <div style={{position: 'absolute', left: 74, top: 66, filter: 'blur(2px)', opacity: 0.86}}>
      <Coin size={104} rotate={17} />
    </div>
    <Coin size={214} rotate={-11} />
  </div>
);

/**
 * Düz renk metin bloğu — referans kapakların imzası.
 * Kontur yok, eğim yok, parlama yok: tek bir dolu dikdörtgen ve içinde
 * küçük harfli, sıkı harf aralıklı bir cümle.
 */
export const Block: React.FC<{
  readonly children: React.ReactNode;
  readonly size?: number;
  readonly bg?: string;
  readonly fg?: string;
  readonly weight?: number;
}> = ({children, size = 92, bg = '#E4002B', fg = '#FFFFFF', weight = 700}) => (
  <div
    style={{
      display: 'inline-block',
      background: bg,
      color: fg,
      fontFamily: FONT.ui,
      fontWeight: weight,
      fontSize: size,
      lineHeight: 1.04,
      letterSpacing: '-0.035em',
      padding: `${size * 0.2}px ${size * 0.3}px ${size * 0.27}px`,
      boxShadow: '0 28px 70px rgba(0,0,0,0.55)',
    }}
  >
    {children}
  </div>
);

/** Kanal imzası — küçük, sakin, köşede. Profesyonel duruşu o veriyor. */
export const Mark: React.FC<{
  readonly children: React.ReactNode;
  readonly color?: string;
  readonly size?: number;
}> = ({children, color = 'rgba(255,255,255,0.78)', size = 30}) => (
  <div
    style={{
      fontFamily: FONT.ui,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color,
      textShadow: '0 2px 14px rgba(0,0,0,0.7)',
    }}
  >
    {children}
  </div>
);

/**
 * Karakteri sahneden ayırır: altında derin bir gölge, arkasında ise
 * ters ışık. Beyaz çıkartma konturu bu zeminde ucuz duruyordu.
 */
export const Cutout: React.FC<{
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({children, style}) => (
  <div
    style={{
      lineHeight: 0,
      filter:
        'saturate(1.12) brightness(1.06) ' +
        'drop-shadow(0 30px 46px rgba(0,0,0,0.6)) drop-shadow(0 6px 14px rgba(0,0,0,0.45))',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Kesilmiş figürün arkasındaki ters ışık. */
export const BackLight: React.FC<{
  readonly x: string;
  readonly y: string;
  readonly size?: number;
  readonly color?: string;
  readonly opacity?: number;
}> = ({x, y, size = 620, color = 'rgba(255,255,255,0.34)', opacity = 1}) => (
  <Orb x={x} y={y} size={size} color={color} opacity={opacity} />
);
