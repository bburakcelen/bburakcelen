import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {C} from '../theme';

/**
 * Kenarları karartan vinyet. Gözü kadrajın ortasına çeker ve
 * düz bir gradyanı "objektiften bakılmış" gibi gösterir.
 */
export const Vignette: React.FC<{readonly strength?: number}> = ({strength = 1}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 78% 68% at 50% 46%, transparent 42%, rgba(0,0,0,${0.5 *
        strength}) 88%, rgba(0,0,0,${0.78 * strength}) 100%)`,
    }}
  />
);

// feTurbulence tabanlı gren dokusu. Data URI olarak bir kez rasterize edilir;
// her karede sadece arka plan konumu kayar, yani filtre yeniden hesaplanmaz.
const GRAIN_TILE = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
     <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
     <feColorMatrix type="saturate" values="0"/></filter>
     <rect width="220" height="220" filter="url(#n)" opacity="0.5"/>
   </svg>`,
)}")`;

/** Film greni — dijital düzlüğü kırar, görüntüye doku verir. */
export const Grain: React.FC<{readonly opacity?: number}> = ({opacity = 0.075}) => {
  const frame = useCurrentFrame();
  // Her karede farklı bir kayma: gren "kaynar", donuk durmaz
  const x = Math.floor(random(`grain-x-${frame}`) * 220);
  const y = Math.floor(random(`grain-y-${frame}`) * 220);

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        backgroundImage: GRAIN_TILE,
        backgroundRepeat: 'repeat',
        backgroundPosition: `${x}px ${y}px`,
        opacity,
        mixBlendMode: 'overlay',
      }}
    />
  );
};

/** Çok hafif tarama çizgileri — ekran / HUD hissi. */
export const Scanlines: React.FC<{readonly opacity?: number}> = ({opacity = 0.16}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      backgroundImage:
        'repeating-linear-gradient(to bottom, rgba(255,255,255,0.055) 0px, rgba(255,255,255,0.055) 1px, transparent 1px, transparent 4px)',
      opacity,
    }}
  />
);

/** Üstten gelen soğuk ışık yıkaması — hacim hissi. */
export const Bloom: React.FC<{readonly color?: string; readonly strength?: number}> = ({
  color = C.cyan,
  strength = 1,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 120% 52% at 50% -12%, ${color}${Math.round(
        26 * strength,
      ).toString(16).padStart(2, '0')} 0%, transparent 62%)`,
    }}
  />
);

/** Objektif parlaması — güçlü anlarda kadrajı yakar. */
export const LensFlare: React.FC<{
  readonly x?: string;
  readonly y?: string;
  readonly color?: string;
  readonly strength?: number;
}> = ({x = '50%', y = '40%', color = C.cyan, strength = 1}) => (
  <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        width: 900 * strength,
        height: 900 * strength,
        background: `radial-gradient(circle, ${color}40 0%, ${color}14 26%, transparent 62%)`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        width: 1500 * strength,
        height: 3,
        background: `linear-gradient(to right, transparent, ${color}55, transparent)`,
      }}
    />
  </AbsoluteFill>
);

/**
 * Bütün işlemleri sırayla bindiren katman. Sahnenin en üstünde durur.
 * Bu katman olmadan sahneler "düz vektör" gibi görünür.
 */
export const Grade: React.FC<{
  readonly vignette?: number;
  readonly grain?: number;
  readonly scanlines?: number;
  readonly bloom?: string | null;
  readonly bloomStrength?: number;
}> = ({vignette = 1, grain = 0.075, scanlines = 0.16, bloom = C.cyan, bloomStrength = 1}) => (
  <>
    {bloom ? <Bloom color={bloom} strength={bloomStrength} /> : null}
    <Scanlines opacity={scanlines} />
    <Vignette strength={vignette} />
    <Grain opacity={grain} />
  </>
);
