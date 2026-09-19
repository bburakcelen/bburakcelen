import React from 'react';
import {AbsoluteFill} from 'remotion';
import {GoldCoin, Silhouette} from './figure';
import {BackLight, Block, Bokeh, Candles, ChartGlow, CoinCluster, Mark, Orb} from './studio';

/**
 * YouTube kapakları — 1280×720.
 *
 * Referans kapakların üç kuralı:
 *   1. Arka plan bir stüdyo fotoğrafı gibi: birkaç yumuşak ışık, odak
 *      dışı lekeler, arkada bulanık bir grafik. Düz zemin yok.
 *   2. Ön planda tek bir düz renk bloğu ve içinde kısa, küçük harfli bir
 *      cümle. Kontur yok, eğim yok, parlama yok.
 *   3. Ön plandaki nesne gerçek bir nesne gibi ışık almalı.
 *
 * Karakterler karikatür olarak kapakta çocukça duruyordu; bir kapakta
 * yüzü büyütmek o sorunu büyütüyor. Onun yerine yüz hiç gösterilmiyor:
 * iki figür arkadan ışık alan siluetler olarak duruyor. Kanal zaten
 * yüzünü 1 milyonda açacak, yani kadraj hikâyeyi de anlatıyor.
 *
 * Mesaj dördünde de aynı: 1.000.000 abonede görüşürüz.
 */

const CYAN = '#7FE3FF';
const AMBER = '#FFC066';

/** İki figür — soldaki uzun (A), sağdaki kısa ve daha geniş (B). */
const Pair: React.FC<{
  readonly tall: number;
  readonly short: number;
  readonly gap?: number;
  readonly bloom?: number;
}> = ({tall, short, gap = 26, bloom = 1}) => (
  <div style={{display: 'flex', alignItems: 'flex-end', gap}}>
    <Silhouette height={tall} rim={CYAN} bloom={bloom} lean={-0.8} />
    <Silhouette height={short} rim={AMBER} bloom={bloom} broad={1.1} lean={0.9} flip />
  </div>
);

/* ---------------------------------------------------------------- A */
/** Turkuaz stüdyo, kırmızı blok, önde altın. Referansa en yakın olan. */
export const ThumbA: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(196deg, #0C4360 0%, #071E2C 56%, #020B12 100%)'}}>
    <Orb x="30%" y="30%" size={960} color="rgba(0,206,255,0.5)" opacity={0.9} />
    <Orb x="86%" y="30%" size={820} color="rgba(255,150,26,0.4)" opacity={0.86} />
    <Orb x="60%" y="98%" size={860} color="rgba(24,132,220,0.42)" />
    <Bokeh seed="a" count={34} colors={['#7FE6FF', '#FFC072']} maxSize={150} opacity={0.6} />

    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <ChartGlow color="#37E2FF" height={430} blur={4} opacity={0.46} />
    </AbsoluteFill>
    <AbsoluteFill style={{justifyContent: 'flex-end', opacity: 0.22, filter: 'blur(1.5px)'}}>
      <Candles height={250} opacity={0.8} />
    </AbsoluteFill>

    {/* Arkadan ışık — siluetler ancak arkalarında ışık varsa okunur */}
    <BackLight x="72%" y="58%" size={860} color="rgba(150,235,255,0.34)" />
    <AbsoluteFill style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
      <div style={{paddingRight: 118, paddingBottom: 26}}>
        <Pair tall={584} short={506} />
      </div>
    </AbsoluteFill>

    {/* Önde altın — kareye derinlik veren katman */}
    <div style={{position: 'absolute', left: 36, bottom: -108}}>
      <GoldCoin size={330} rotate={-10} seed="a1" />
    </div>
    <div style={{position: 'absolute', left: 318, bottom: -52, filter: 'blur(3px)', opacity: 0.7}}>
      <GoldCoin size={168} rotate={14} seed="a2" shadow={false} />
    </div>

    <AbsoluteFill style={{paddingTop: 70, paddingLeft: 52}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24}}>
        <Block size={94} bg="#E4002B">
          see you at
          <br />
          1M subs.
        </Block>
        <Mark>TwoSide Boys</Mark>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

/* ---------------------------------------------------------------- B */
/** Mor–macenta ışık, camgöbeği blok. En renkli duran. */
export const ThumbB: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(196deg, #2D1058 0%, #15062C 56%, #070313 100%)'}}>
    <Orb x="32%" y="28%" size={940} color="rgba(172,62,255,0.58)" opacity={0.92} />
    <Orb x="84%" y="64%" size={840} color="rgba(255,46,148,0.44)" opacity={0.88} />
    <Orb x="58%" y="6%" size={660} color="rgba(60,200,255,0.36)" />
    <Bokeh seed="b" count={36} colors={['#D79BFF', '#61E6FF', '#FF7ABF']} maxSize={160} opacity={0.62} />

    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <ChartGlow color="#FF4FC3" height={410} blur={4} opacity={0.42} />
    </AbsoluteFill>

    <BackLight x="70%" y="56%" size={840} color="rgba(255,196,255,0.32)" />
    <AbsoluteFill style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
      <div style={{paddingRight: 112, paddingBottom: 26}}>
        <Pair tall={572} short={496} />
      </div>
    </AbsoluteFill>

    <CoinCluster x="17%" y="88%" scale={0.82} />

    <AbsoluteFill style={{paddingTop: 74, paddingLeft: 52}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24}}>
        <Block size={88} bg="#18E6D0" fg="#05141A">
          see you at
          <br />
          1,000,000.
        </Block>
        <Mark>TwoSide Boys</Mark>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

/* ---------------------------------------------------------------- C */
/** Yeşil piyasa, siyah blok sağda. Diğerlerinden ayna görüntüsü. */
export const ThumbC: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(196deg, #06422A 0%, #041F14 56%, #010A07 100%)'}}>
    <Orb x="72%" y="30%" size={940} color="rgba(0,222,124,0.46)" opacity={0.9} />
    <Orb x="16%" y="64%" size={800} color="rgba(255,176,32,0.4)" opacity={0.88} />
    <Orb x="46%" y="4%" size={640} color="rgba(0,184,255,0.26)" />
    <Bokeh seed="c" count={32} colors={['#7BFFC4', '#FFD98A']} maxSize={150} opacity={0.58} />

    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <ChartGlow color="#25F08F" height={450} blur={3} opacity={0.6} />
    </AbsoluteFill>
    <AbsoluteFill style={{justifyContent: 'flex-end', opacity: 0.3, filter: 'blur(1.5px)'}}>
      <Candles height={280} opacity={0.85} />
    </AbsoluteFill>

    <BackLight x="27%" y="56%" size={860} color="rgba(190,255,220,0.32)" />
    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <div style={{paddingLeft: 96, paddingBottom: 26}}>
        <Pair tall={584} short={506} />
      </div>
    </AbsoluteFill>

    <div style={{position: 'absolute', right: 104, bottom: -74}}>
      <GoldCoin size={296} rotate={12} seed="c1" />
    </div>

    <AbsoluteFill style={{paddingTop: 72, alignItems: 'flex-end', paddingRight: 52}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 24}}>
        <Block size={92} bg="#0B0D12">
          see you at
          <br />
          1M subs.
        </Block>
        <Mark>TwoSide Boys</Mark>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

/* ---------------------------------------------------------------- D */
/** Turuncu–kırmızı ısı, lacivert blok. En sıcak olanı. */
export const ThumbD: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(196deg, #4E1704 0%, #250B05 56%, #0C0402 100%)'}}>
    <Orb x="34%" y="26%" size={980} color="rgba(255,130,0,0.58)" opacity={0.94} />
    <Orb x="82%" y="68%" size={800} color="rgba(255,40,62,0.42)" opacity={0.88} />
    <Orb x="62%" y="2%" size={640} color="rgba(255,206,80,0.38)" />
    <Bokeh seed="d" count={34} colors={['#FFC46B', '#FF8A5C', '#8AD9FF']} maxSize={155} opacity={0.6} />

    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <ChartGlow color="#FFC247" height={430} blur={4} opacity={0.46} />
    </AbsoluteFill>

    <BackLight x="71%" y="56%" size={860} color="rgba(255,226,180,0.36)" />
    <AbsoluteFill style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
      <div style={{paddingRight: 96, paddingBottom: 26}}>
        <Pair tall={578} short={502} />
      </div>
    </AbsoluteFill>

    <CoinCluster x="20%" y="30%" scale={0.72} />

    <AbsoluteFill style={{justifyContent: 'flex-end', paddingLeft: 52, paddingBottom: 52}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 22}}>
        <Mark>TwoSide Boys</Mark>
        <Block size={86} bg="#0B2ED6">
          1,000,000 subs.
          <br />
          see you there.
        </Block>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
