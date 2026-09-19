import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character} from '../characters/Character';
import {A, B, silhouetteOf} from '../characters/presets';
import {Stage} from '../scenes/Stage';
import {C, FONT, textGlow} from '../theme';

/**
 * YouTube kapak görselleri — 1280×720.
 *
 * Tasarım kısıtı: mobil akışta yaklaşık 320 piksel genişlikte görünür. O
 * ölçekte okunması gereken tek şey manşet; onun için 2–4 kelime ve çok
 * büyük punto. Karakterler siluete çekildi ve yüz hatları silindi: geriye
 * yalnız parlayan gözler kalıyor, yani "henüz kim olduğumuzu bilmiyorsun"
 * fikrini yazı değil görselin kendisi taşıyor.
 *
 * Kadraj payı: Stage'in 'still' kamerası %2 yaklaşır, yani her kenardan
 * ~7–13 piksel kırpılır. Aşağıdaki boşluklar bunu hesaba katıyor.
 * handheld={0} ile salınım kapalı — kapak hangi kareden alınırsa alınsın aynı.
 */

const AS = silhouetteOf(A);
const BS = silhouetteOf(B);

/** Siluetlerin ortak ayarı — üçünde de aynı görünsünler. */
const FIGURE = {pose: 'handsDown', faceless: true, emotion: 'confident'} as const;

const Kicker: React.FC<{readonly children: React.ReactNode; readonly color?: string}> = ({
  children,
  color = C.cyan,
}) => (
  <div
    style={{
      fontFamily: FONT.mono,
      fontSize: 26,
      fontWeight: 700,
      letterSpacing: '0.46em',
      textTransform: 'uppercase',
      color,
      textShadow: textGlow(color, 1),
    }}
  >
    {children}
  </div>
);

const Headline: React.FC<{
  readonly children: React.ReactNode;
  readonly size?: number;
  readonly color?: string;
}> = ({children, size = 128, color = C.text}) => (
  <div
    style={{
      fontFamily: FONT.display,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 0.94,
      letterSpacing: '-0.01em',
      textTransform: 'uppercase',
      color,
      textShadow: `0 0 60px ${C.cyan}55, 0 6px 0 rgba(0,0,0,0.85), 0 10px 40px rgba(0,0,0,0.9)`,
    }}
  >
    {children}
  </div>
);

/** Neon çerçeveli vurgu şeridi. */
const Bar: React.FC<{readonly children: React.ReactNode; readonly color?: string}> = ({
  children,
  color = C.amber,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      padding: '12px 26px',
      border: `3px solid ${color}`,
      background: `${color}1A`,
      boxShadow: `0 0 34px ${color}66, inset 0 0 26px ${color}18`,
      fontFamily: FONT.mono,
      fontSize: 32,
      fontWeight: 700,
      letterSpacing: '0.08em',
      color: C.text,
      textShadow: textGlow(color, 0.6),
    }}
  >
    {children}
  </div>
);

/** Yazının altındaki karartma — ızgaranın üstünde manşet okunaklı kalsın. */
const Scrim: React.FC<{readonly direction: string}> = ({direction}) => (
  <AbsoluteFill style={{background: `linear-gradient(${direction})`}} />
);

/* ---------------------------------------------------------------- A */
/** Manşet solda, siluetler sağda. Üçü içinde en okunaklı düzen. */
export const ThumbA: React.FC = () => (
  <Stage mood="void" move="still" handheld={0} beams particles grid>
    {/* Sıra önemli: karartma siluetlerin ALTINDA kalmalı, yoksa onları da soldurur */}
    <Scrim direction="90deg, rgba(3,6,14,0.95) 0%, rgba(3,6,14,0.88) 34%, rgba(3,6,14,0) 58%" />

    <AbsoluteFill style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 2, paddingRight: 52, paddingBottom: 14}}>
        <Character spec={AS} height={548} rim={2.2} {...FIGURE} />
        <Character spec={BS} height={494} rim={2.2} {...FIGURE} />
      </div>
    </AbsoluteFill>

    <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 62}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 22}}>
        <Kicker>TwoSide Boys</Kicker>
        <Headline size={142}>
          Who are
          <br />
          we?
        </Headline>
        <div style={{marginTop: 8}}>
          <Bar>1,000,000 SUBS → REVEAL</Bar>
        </div>
      </div>
    </AbsoluteFill>
  </Stage>
);

/* ---------------------------------------------------------------- B */
/** Sayı baskın. Rakam tek başına merak uyandırır, siluetler onu çerçeveler. */
export const ThumbB: React.FC = () => (
  <Stage mood="void" move="still" handheld={0} beams particles grid>
    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: '0 40px 10px',
        }}
      >
        <Character spec={AS} height={418} rim={2} {...FIGURE} />
        <Character spec={BS} height={378} rim={2} {...FIGURE} />
      </div>
    </AbsoluteFill>

    <Scrim direction="180deg, rgba(3,6,14,0.9) 0%, rgba(3,6,14,0.55) 46%, rgba(3,6,14,0) 72%" />

    <AbsoluteFill style={{alignItems: 'center', paddingTop: 46}}>
      <Kicker>TwoSide Boys</Kicker>
      <div
        style={{
          fontFamily: FONT.mono,
          fontWeight: 700,
          fontSize: 198,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: C.amber,
          textShadow: `${textGlow(C.amber, 1.5)}, 0 8px 0 rgba(0,0,0,0.8)`,
          marginTop: 22,
        }}
      >
        1,000,000
      </div>
      <div
        style={{
          fontFamily: FONT.display,
          fontWeight: 700,
          fontSize: 64,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: C.text,
          textShadow: '0 4px 0 rgba(0,0,0,0.85), 0 0 50px rgba(34,230,255,0.45)',
          marginTop: 26,
        }}
      >
        Then you&apos;ll know us
      </div>
    </AbsoluteFill>
  </Stage>
);

/* ---------------------------------------------------------------- C */
/** Siluetler büyük ve ortada, aralarında dev soru işareti. En "fragman" olanı. */
export const ThumbC: React.FC = () => (
  <Stage mood="deep" move="still" handheld={0} beams particles grid={false}>
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 104}}>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 222}}>
        <Character spec={AS} height={548} rim={2.4} {...FIGURE} />
        <Character spec={BS} height={496} rim={2.4} {...FIGURE} />
      </div>
    </AbsoluteFill>

    {/* Aradaki dev soru işareti — arkasında ışık havuzu, siluetlerden ayrışsın */}
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 58}}>
      <div
        style={{
          position: 'absolute',
          width: 460,
          height: 460,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(34,230,255,0.24) 0%, rgba(34,230,255,0.07) 44%, rgba(34,230,255,0) 70%)',
        }}
      />
      <div
        style={{
          fontFamily: FONT.display,
          fontWeight: 700,
          fontSize: 316,
          lineHeight: 1,
          color: C.cyan,
          textShadow: `${textGlow(C.cyan, 2)}, 0 10px 0 rgba(0,0,0,0.7)`,
        }}
      >
        ?
      </div>
    </AbsoluteFill>

    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop: 40}}>
      <Kicker>TwoSide Boys</Kicker>
    </AbsoluteFill>

    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 28}}>
      <Bar color={C.amber}>WE REVEAL AT 1,000,000</Bar>
    </AbsoluteFill>
  </Stage>
);

/* ---------------------------------------------------------------- D */
/**
 * Yakın plan. YouTube akışında en çok tıklanan kadraj yüz büyüklüğünde
 * olandır; yüz yerine iki parlayan bakış koyunca aynı etki gizemle
 * birleşiyor. Manşet üç satıra bölündü, böylece 320 pikselde bile her
 * kelime iri kalıyor.
 */
export const ThumbD: React.FC = () => (
  <Stage mood="void" move="still" handheld={0} beams particles grid={false}>
    <Scrim direction="90deg, rgba(3,6,14,0.96) 0%, rgba(3,6,14,0.9) 30%, rgba(3,6,14,0) 54%" />

    <AbsoluteFill style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
      <div style={{display: 'flex', alignItems: 'flex-end', paddingRight: 44}}>
        <Character spec={AS} crop="bust" height={476} rim={2.4} {...FIGURE} />
        {/* Negatif kenar boşluğu: kadrajlar hafif üst üste binsin, ikisi tek grup okunsun */}
        <Character spec={BS} crop="bust" height={432} rim={2.4} style={{marginLeft: -38}} {...FIGURE} />
      </div>
    </AbsoluteFill>

    <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 60}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20}}>
        <Kicker>TwoSide Boys</Kicker>
        <Headline size={158}>
          Who
          <br />
          are
          <br />
          we?
        </Headline>
      </div>
    </AbsoluteFill>

    <AbsoluteFill style={{alignItems: 'flex-start', justifyContent: 'flex-end', paddingLeft: 60, paddingBottom: 34}}>
      <Bar>REVEAL AT 1,000,000</Bar>
    </AbsoluteFill>
  </Stage>
);
