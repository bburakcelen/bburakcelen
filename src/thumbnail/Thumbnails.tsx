import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character} from '../characters/Character';
import {A, B} from '../characters/presets';
import {Arrow, Candles, Coin, HazardStrip, MarkerCircle, P, Punch, Sticker, Sunburst, Tag, Vignette} from './pop';

/**
 * YouTube kapakları — 1280×720, ABD kripto/finans kanallarının diliyle.
 *
 * O dilin üç kuralı var ve üçü de videonun kendi sinematik dilinin tersi:
 *   1. Zemin parlak ve doygun. Karanlık kapak akışta geri çekilir.
 *   2. Manşet iki-üç kelime, çok iri, kalın siyah konturlu. Bir kelime
 *      sarı — göz önce oraya düşsün diye.
 *   3. Yüzler büyük ve abartılı. Kripto kapaklarında yüz, grafikten de
 *      rakamdan da daha çok tıklanır.
 *
 * Konu sinyali (mum grafiği, Bitcoin madeni, yeşil ok) zemine bırakıldı:
 * kanalın ne anlattığı manşeti okumadan anlaşılsın.
 *
 * Karakterler siluet değil, tam renkli ve beyaz konturlu çıkartma olarak
 * basılıyor — aydınlık zeminde siluet leke gibi duruyordu.
 */

const FACE = {
  rim: 0,
  ground: false,
  pose: 'idle',
  // Kollar gövdeye yapışınca omuzlar tek bir kutu gibi okunuyor; hafif
  // açılınca siluet insan formuna dönüyor.
  arms: {left: {upper: 19, fore: 12}, right: {upper: 19, fore: 12}},
} as const;

/* ---------------------------------------------------------------- A */
/** Manşet solda, iki yüz sağda. Klasik ve en güvenli düzen. */
export const ThumbA: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(175deg, #0B4693 0%, #0C86BC 52%, #05294A 100%)'}}>
    <Sunburst at="72% 44%" opacity={0.13} step={6} />
    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <Candles height={330} opacity={0.42} />
    </AbsoluteFill>
    <Vignette strength={0.58} />

    {/* Yüzlerin arkasında ışık — çıkartma zeminden kopsun */}
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle 330px at 68% 46%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
      }}
    />

    <AbsoluteFill style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
      <div style={{display: 'flex', alignItems: 'flex-end', paddingRight: 12}}>
        <Sticker width={9}>
          <Character spec={A} crop="face" height={524} emotion="excited" {...FACE} />
        </Sticker>
        <Sticker width={9} style={{marginLeft: -58}}>
          <Character spec={B} crop="face" height={476} emotion="confident" {...FACE} />
        </Sticker>
      </div>
    </AbsoluteFill>

    <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 46}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24}}>
        <Punch size={142}>
          Who
          <br />
          are
          <br />
          <span style={{color: P.yellow}}>we?</span>
        </Punch>
        <Tag size={36}>Face reveal at 1M</Tag>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

/* ---------------------------------------------------------------- B */
/** Rakam baskın. Kanalı hiç tanımayan biri için en net kanca. */
export const ThumbB: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, #06381F 0%, #0B9B57 58%, #032414 100%)'}}>
    <Sunburst at="50% 40%" opacity={0.12} step={6} />
    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <Candles height={380} opacity={0.62} />
    </AbsoluteFill>
    <Vignette strength={0.6} />

    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 26px'}}>
        <Sticker width={8}>
          <Character spec={A} crop="face" height={332} emotion="shocked" {...FACE} />
        </Sticker>
        <Sticker width={8}>
          <Character spec={B} crop="face" height={306} emotion="excited" {...FACE} />
        </Sticker>
      </div>
    </AbsoluteFill>

    <AbsoluteFill style={{alignItems: 'center', paddingTop: 84}}>
      <div style={{position: 'relative', display: 'inline-block'}}>
        <Punch size={206} color={P.yellow} align="center">
          1,000,000
        </Punch>
        {/* Rakamın üstüne sonradan çizilmiş gibi duran işaret. Elips yazıdan
            belirgin biçimde büyük olmalı, yoksa üstünü çizmiş gibi duruyor. */}
        <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
          <MarkerCircle width={1100} height={306} rotate={-1.5} thickness={11} />
        </div>
      </div>
      <div style={{marginTop: 42}}>
        <Punch size={78} align="center">
          Then we <span style={{color: P.yellow}}>reveal</span>
        </Punch>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

/* ---------------------------------------------------------------- C */
/** İki dev yüz. Akışta yüz büyüklüğü, her şeyden çok tıklanır. */
export const ThumbC: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 86% at 50% 40%, #FF5A1F 0%, #C11C00 54%, #6B0A00 100%)'}}>
    <Sunburst at="50% 44%" opacity={0.16} step={5} />
    <Vignette strength={0.5} />

    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 100}}>
      <div style={{display: 'flex', alignItems: 'flex-end'}}>
        <Sticker width={10}>
          <Character spec={A} crop="face" height={452} emotion="shocked" {...FACE} />
        </Sticker>
        <Sticker width={10} style={{marginLeft: -46}}>
          <Character spec={B} crop="face" height={418} emotion="excited" {...FACE} />
        </Sticker>
      </div>
    </AbsoluteFill>

    <AbsoluteFill style={{alignItems: 'center', paddingTop: 22}}>
      <Punch size={162} color={P.yellow} align="center">
        Face reveal
      </Punch>
    </AbsoluteFill>

    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <div style={{display: 'flex', justifyContent: 'center', paddingBottom: 26}}>
        <Tag size={46}>At 1,000,000 subs</Tag>
      </div>
      <HazardStrip height={24} />
    </AbsoluteFill>
  </AbsoluteFill>
);

/* ---------------------------------------------------------------- D */
/**
 * Çapraz bölünmüş zemin — kanalın adı da işi de bu: iki taraf.
 * Solda airdrop tarafı, sağda futures/spot tarafı.
 */
export const ThumbD: React.FC = () => (
  <AbsoluteFill style={{background: '#08111F'}}>
    <AbsoluteFill
      style={{
        background: 'linear-gradient(160deg, #0B57B0 0%, #12B4D8 100%)',
        clipPath: 'polygon(0 0, 57% 0, 45% 100%, 0 100%)',
      }}
    />
    <AbsoluteFill
      style={{
        background: 'linear-gradient(160deg, #C56200 0%, #FFA61F 100%)',
        clipPath: 'polygon(57% 0, 100% 0, 100% 100%, 45% 100%)',
      }}
    />
    {/* Bölme çizgisi — sarı kenarlı siyah bant */}
    <AbsoluteFill
      style={{background: P.yellow, clipPath: 'polygon(54.4% 0, 59.6% 0, 47.6% 100%, 42.4% 100%)'}}
    />
    <AbsoluteFill
      style={{background: P.black, clipPath: 'polygon(55.4% 0, 58.6% 0, 46.6% 100%, 43.4% 100%)'}}
    />

    <Sunburst at="50% 40%" opacity={0.1} step={7} />
    <Vignette strength={0.5} />

    {/* Bitcoin madeni — kanalın konusu manşet okunmadan anlaşılsın */}
    <div style={{position: 'absolute', left: 34, top: 42}}>
      <Coin size={150} rotate={-14} />
    </div>
    <div style={{position: 'absolute', right: 40, top: 48}}>
      <Arrow size={124} color={P.green} rotate={-45} />
    </div>

    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end'}}>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 88, paddingBottom: 152}}>
        <Sticker width={9}>
          <Character spec={A} crop="face" height={398} emotion="excited" {...FACE} />
        </Sticker>
        <Sticker width={9}>
          <Character spec={B} crop="face" height={362} emotion="confident" {...FACE} />
        </Sticker>
      </div>
    </AbsoluteFill>

    {/* Alt bant — manşet her zeminin üstünde aynı okunurluğu korusun */}
    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <div
        style={{
          background: 'rgba(6,8,14,0.93)',
          borderTop: `7px solid ${P.yellow}`,
          padding: '18px 0 26px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Punch size={104} align="center" stroke={8}>
          Who are <span style={{color: P.yellow}}>we?</span>
        </Punch>
      </div>
    </AbsoluteFill>

    <div style={{position: 'absolute', left: '50%', top: 26, transform: 'translateX(-50%)'}}>
      <Tag size={38} skew={0}>
        1,000,000 subs
      </Tag>
    </div>
  </AbsoluteFill>
);
