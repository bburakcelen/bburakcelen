import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character} from '../characters/Character';
import {A as RAW_A, B as RAW_B, vividOf} from '../characters/presets';
import {Candles, P} from './pop';
import {BackLight, Block, Bokeh, ChartGlow, CoinCluster, Cutout, Mark, Orb} from './studio';

/**
 * YouTube kapakları — 1280×720.
 *
 * Referans alınan kapakların (büyük ABD kripto kanalları) işleyişi:
 *   1. Arka plan bir stüdyo fotoğrafı gibi: birkaç yumuşak ışık, odak
 *      dışı lekeler, arkada bulanık bir grafik. Düz zemin yok.
 *   2. Ön planda tek bir düz renk bloğu, içinde kısa ve küçük harfli
 *      bir cümle. Kontur yok, eğim yok, parlama yok.
 *   3. Yüzler büyük ve net; arkalarında ters ışık, altlarında derin
 *      gölge — sahneye yapıştırılmış gibi değil, sahnenin içinde.
 *
 * Mesaj dördünde de aynı: 1.000.000 abonede görüşürüz.
 */

const A = vividOf(RAW_A);
const B = vividOf(RAW_B);

const CUT = {
  rim: 1.15,
  ground: false,
  crop: 'face',
  pose: 'idle',
  // Kollar gövdeye yapışınca omuz tek bir kutu gibi okunuyor
  arms: {left: {upper: 19, fore: 12}, right: {upper: 19, fore: 12}},
} as const;

/* ---------------------------------------------------------------- A */
/** Derin turkuaz stüdyo, kırmızı blok. Referansa en yakın olan. */
export const ThumbA: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(200deg, #0C4059 0%, #071C2A 58%, #020D15 100%)'}}>
    <Orb x="24%" y="32%" size={960} color="rgba(0,214,255,0.58)" opacity={0.95} />
    <Orb x="88%" y="20%" size={780} color="rgba(255,146,20,0.52)" opacity={0.9} />
    <Orb x="58%" y="98%" size={820} color="rgba(30,140,230,0.44)" />
    <Bokeh seed="a" count={32} colors={['#7FE6FF', '#FFC072']} maxSize={140} opacity={0.6} />

    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <ChartGlow color="#37E2FF" height={420} blur={3} opacity={0.5} />
    </AbsoluteFill>
    <AbsoluteFill style={{justifyContent: 'flex-end', opacity: 0.3}}>
      <Candles height={250} opacity={0.75} />
    </AbsoluteFill>

    <CoinCluster x="19%" y="86%" scale={0.8} />

    <BackLight x="74%" y="46%" size={700} color="rgba(120,230,255,0.3)" />
    <AbsoluteFill style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
      <div style={{display: 'flex', alignItems: 'flex-end', paddingRight: 16}}>
        <Cutout style={{marginRight: -178}}>
          <Character spec={B} height={436} emotion="confident" {...CUT} />
        </Cutout>
        <Cutout>
          <Character spec={A} height={548} emotion="happy" {...CUT} />
        </Cutout>
      </div>
    </AbsoluteFill>

    <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 52}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 26}}>
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
/** Mor–macenta ışık, camgöbeği blok. Akışta en renkli duran. */
export const ThumbB: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(200deg, #2A0F52 0%, #14062A 56%, #070312 100%)'}}>
    <Orb x="30%" y="30%" size={880} color="rgba(168,60,255,0.55)" opacity={0.9} />
    <Orb x="82%" y="62%" size={820} color="rgba(255,46,148,0.4)" opacity={0.85} />
    <Orb x="58%" y="8%" size={640} color="rgba(60,200,255,0.34)" />
    <Bokeh seed="b" count={34} colors={['#D79BFF', '#61E6FF', '#FF7ABF']} maxSize={150} opacity={0.62} />

    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <ChartGlow color="#FF4FC3" height={400} blur={3.5} opacity={0.42} />
    </AbsoluteFill>

    <BackLight x="72%" y="48%" size={680} color="rgba(255,190,255,0.28)" />
    <AbsoluteFill style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
      <div style={{display: 'flex', alignItems: 'flex-end', paddingRight: 18}}>
        <Cutout style={{marginRight: -170}}>
          <Character spec={B} height={424} emotion="happy" {...CUT} />
        </Cutout>
        <Cutout>
          <Character spec={A} height={534} emotion="confident" {...CUT} />
        </Cutout>
      </div>
    </AbsoluteFill>

    <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 52}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 26}}>
        <Block size={90} bg="#18E6D0" fg="#05141A">
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
/** Yeşil piyasa, altın. Blok sağda: iki kapak yan yana durduğunda ayrışsın. */
export const ThumbC: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(200deg, #063A26 0%, #041B12 58%, #010906 100%)'}}>
    <Orb x="74%" y="32%" size={900} color="rgba(0,214,120,0.46)" opacity={0.9} />
    <Orb x="18%" y="66%" size={760} color="rgba(255,170,30,0.38)" opacity={0.85} />
    <Orb x="46%" y="6%" size={600} color="rgba(0,180,255,0.24)" />
    <Bokeh seed="c" count={30} colors={['#7BFFC4', '#FFD98A']} maxSize={140} opacity={0.58} />

    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <ChartGlow color="#25F08F" height={440} blur={2.5} opacity={0.62} />
    </AbsoluteFill>
    <AbsoluteFill style={{justifyContent: 'flex-end', opacity: 0.4}}>
      <Candles height={280} opacity={0.8} />
    </AbsoluteFill>

    <CoinCluster x="86%" y="92%" scale={0.6} />

    <BackLight x="27%" y="46%" size={700} color="rgba(190,255,220,0.28)" />
    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <div style={{display: 'flex', alignItems: 'flex-end', paddingLeft: 16}}>
        <Cutout>
          <Character spec={A} height={548} emotion="confident" {...CUT} />
        </Cutout>
        <Cutout style={{marginLeft: -172}}>
          <Character spec={B} height={436} emotion="happy" {...CUT} />
        </Cutout>
      </div>
    </AbsoluteFill>

    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-end', paddingRight: 52}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 26}}>
        <Mark>TwoSide Boys</Mark>
        <Block size={92} bg="#0B0D12">
          see you at
          <br />
          1M subs.
        </Block>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

/* ---------------------------------------------------------------- D */
/** Turuncu–kırmızı ısı, lacivert blok. En sıcak ve en dikkat çekeni. */
export const ThumbD: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(200deg, #4A1403 0%, #230A04 56%, #0B0402 100%)'}}>
    <Orb x="32%" y="28%" size={920} color="rgba(255,122,0,0.55)" opacity={0.92} />
    <Orb x="80%" y="70%" size={780} color="rgba(255,38,60,0.4)" opacity={0.86} />
    <Orb x="62%" y="4%" size={620} color="rgba(255,206,80,0.36)" />
    <Bokeh seed="d" count={32} colors={['#FFC46B', '#FF8A5C', '#8AD9FF']} maxSize={145} opacity={0.6} />

    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <ChartGlow color="#FFC247" height={420} blur={3} opacity={0.48} />
    </AbsoluteFill>

    <CoinCluster x="22%" y="34%" scale={0.9} />

    <BackLight x="73%" y="46%" size={700} color="rgba(255,226,180,0.32)" />
    <AbsoluteFill style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
      <div style={{display: 'flex', alignItems: 'flex-end', paddingRight: 14, paddingBottom: 150}}>
        <Cutout style={{marginRight: -158}}>
          <Character spec={B} height={404} emotion="confident" {...CUT} />
        </Cutout>
        <Cutout>
          <Character spec={A} height={500} emotion="happy" {...CUT} />
        </Cutout>
      </div>
    </AbsoluteFill>

    <AbsoluteFill style={{justifyContent: 'flex-end', paddingLeft: 52, paddingBottom: 54}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24}}>
        <Mark color={P.white}>TwoSide Boys</Mark>
        <Block size={86} bg="#0B2ED6">
          1,000,000 subs.
          <br />
          see you there.
        </Block>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
