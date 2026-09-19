import React from 'react';
import {CloseUp, Duo, ListReveal, Solo, Spotlight, Split, TitleCard} from '../scenes/layouts';
import {BlockChain, CandleChart, Coin, Parachute, Rocket} from '../props/Crypto';
import {CommentStack, Counter, Iceberg, NoSign, Shield} from '../props/Story';
import {Credits, LikeSubscribe, QuestionMarks, Scanner} from '../props/Ui';
import {HoloPanel, HudFrame, NodeGraph, Radar, Ticker, WireGlobe} from '../props/SciFi';
import {C, FONT, textGlow} from '../theme';
import type {Locale} from './text';

export type Beat = {
  /** Kompozisyon kimliği olarak da kullanılır — benzersiz olmalı. */
  readonly id: string;
  /** İlgili ses kaydı metni. Süre bundan hesaplanır; referans olarak da durur. */
  readonly script: string;
  /** Otomatik süreyi ezmek için (saniye). */
  readonly seconds?: number;
  readonly node: React.ReactNode;
};

/** Hiçbir sahne bundan kısa olmasın — animasyonun oturmaya vakti olsun. */
export const MIN_SECONDS = 2.2;

/** Bir sahnenin ağırlığı: metnindeki kelime sayısı. */
export const weightOfBeat = (b: Beat): number =>
  b.script.trim().split(/\s+/).filter(Boolean).length;

const Row: React.FC<{readonly children: React.ReactNode; readonly gap?: number}> = ({children, gap = 48}) => (
  <div style={{display: 'flex', alignItems: 'center', gap}}>{children}</div>
);

const Stack: React.FC<{readonly children: React.ReactNode; readonly gap?: number}> = ({children, gap = 28}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap}}>{children}</div>
);

/** Kadrajı dolduran manifesto tipografisi. */
const Big: React.FC<{readonly children: React.ReactNode; readonly color?: string; readonly size?: number}> = ({
  children,
  color = C.text,
  size = 104,
}) => (
  <div
    style={{
      fontFamily: FONT.display,
      fontWeight: 700,
      fontSize: size,
      color,
      textAlign: 'center',
      lineHeight: 1.1,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
      textShadow: `0 0 48px ${color}44, 0 4px 40px rgba(0,0,0,0.9)`,
      maxWidth: '86%',
    }}
  >
    {children}
  </div>
);

const Tag: React.FC<{readonly children: React.ReactNode; readonly color?: string}> = ({children, color = C.cyan}) => (
  <div
    style={{
      fontFamily: FONT.mono,
      fontSize: 30,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color,
      textShadow: textGlow(color, 0.8),
    }}
  >
    {children}
  </div>
);

/**
 * Sahneleri verilen dil için kurar.
 *
 * Bu dosyada tek bir metin dizesi yok — hepsi `src/script/text/` altında.
 * Sahnenin yerleşimi, kamerası, karakterleri ve nesneleri dilden bağımsız;
 * değişen sadece okunan yazılar.
 */
export const buildBeats = (L: Locale): readonly Beat[] => [
  /* ---------------------------------------------------------- AÇILIŞ */
  {
    id: 's01-welcome',
    script: L.s01.script,
    node: (
      <TitleCard
        title={L.s01.title}
        kicker={L.s01.kicker}
        subtitle={L.s01.subtitle}
        mood="void"
        burst
        move="pushIn"
        aState={{emotion: 'confident', pose: 'presenting', energy: 0.2}}
        bState={{emotion: 'confident', pose: 'crossed'}}
      />
    ),
  },
  {
    id: 's02-two-friends',
    script: L.s02.script,
    node: (
      <Duo
        kicker={L.s02.kicker}
        caption={L.s02.caption}
        mood="void"
        move="driftRight"
        a={{emotion: 'confident', pose: 'presenting', talking: true}}
        b={{emotion: 'neutral', pose: 'crossed'}}
      />
    ),
  },
  {
    id: 's03-family',
    script: L.s03.script,
    node: (
      <Duo
        bubble={L.s03.bubble}
        speaker="A"
        mood="deep"
        move="pushIn"
        a={{emotion: 'happy', pose: 'presenting', talking: true}}
        b={{emotion: 'happy', pose: 'thumbsUp'}}
      />
    ),
  },
  {
    id: 's04-topics',
    script: L.s04.script,
    node: (
      <ListReveal
        kicker={L.s04.kicker}
        heading={L.s04.heading}
        items={L.s04.items}
        who="B"
        mood="data"
        move="driftLeft"
        state={{emotion: 'confident', pose: 'presenting', talking: true}}
      />
    ),
  },
  {
    id: 's05-not-that-channel',
    script: L.s05.script,
    node: (
      <Solo
        who="B"
        kicker={L.s05.kicker}
        caption={L.s05.caption}
        mood="risk"
        move="pullOut"
        state={{emotion: 'worried', pose: 'facepalm'}}
        propSide="left"
        prop={
          <NoSign size={560} delay={16} label={L.s05.label1}>
            <HoloPanel width={560} height={340} delay={4} color={C.red} label={L.s05.label2}>
              <CandleChart width={470} height={250} trend="chop" count={12} delay={8} seed="nope" showAxis={false} />
            </HoloPanel>
          </NoSign>
        }
      />
    ),
  },
  {
    id: 's06-bigger-than-charts',
    script: L.s06.script,
    node: (
      <Spotlight kicker={L.s06.kicker} caption={L.s06.caption} mood="deep" move="pullOut" accent={C.violet}>
        <Row gap={70}>
          <BlockChain size={140} count={3} delay={6} />
          <Coin size={180} symbol="₿" delay={14} />
          <Parachute size={170} delay={20} />
          <Rocket size={160} delay={26} />
        </Row>
      </Spotlight>
    ),
  },
  {
    id: 's07-breadth',
    script: L.s07.script,
    node: (
      <ListReveal
        kicker={L.s07.kicker}
        heading={L.s07.heading}
        items={L.s07.items}
        columns={2}
        who="A"
        mood="data"
        move="riseUp"
        perItem={7}
        state={{emotion: 'excited', pose: 'pointUp', talking: true, energy: 0.3}}
      />
    ),
  },
  {
    id: 's08-middle-of-it',
    script: L.s08.script,
    node: (
      <Duo
        kicker={L.s08.kicker}
        caption={L.s08.caption}
        mood="deep"
        move="pushIn"
        a={{emotion: 'excited', pose: 'armsUp', energy: 0.4}}
        b={{emotion: 'excited', pose: 'armsUp', energy: 0.4}}
        center={<Coin size={190} symbol="₿" delay={10} spin />}
      />
    ),
  },

  /* ------------------------------------------------------- SORUMLULUK */
  {
    id: 's09-one-thing-clear',
    script: L.s09.script,
    node: (
      <Duo
        kicker={L.s09.kicker}
        caption={L.s09.caption}
        mood="deep"
        move="pushIn"
        a={{emotion: 'confident', pose: 'point', talking: true}}
        b={{emotion: 'neutral', pose: 'crossed'}}
      />
    ),
  },
  {
    id: 's10-never-ask-money',
    script: L.s10.script,
    node: (
      <Spotlight kicker={L.s10.kicker} caption={L.s10.caption} mood="risk" move="pushIn" accent={C.red} grid={false}>
        <NoSign size={620} delay={10} label={L.s10.label1}>
          <Credits size={420} delay={2} />
        </NoSign>
      </Spotlight>
    ),
  },
  {
    id: 's11-not-advice',
    script: L.s11.script,
    node: (
      <Solo
        who="B"
        kicker={L.s11.kicker}
        caption={L.s11.caption}
        mood="risk"
        move="driftLeft"
        state={{emotion: 'worried', pose: 'shrug', talking: true}}
        prop={<QuestionMarks size={150} count={3} delay={10} color={C.red} />}
      />
    ),
  },
  {
    id: 's12-instead',
    script: L.s12.script,
    node: (
      <ListReveal
        kicker={L.s12.kicker}
        heading={L.s12.heading}
        items={L.s12.items}
        who="A"
        mood="void"
        move="driftRight"
        perItem={11}
        state={{emotion: 'confident', pose: 'presenting', talking: true}}
      />
    ),
  },
  {
    id: 's13-decisions-yours',
    script: L.s13.script,
    node: (
      <Spotlight
        mood="void"
        move="pushIn"
        grid={false}
        a={{emotion: 'confident', pose: 'point'}}
        b={{emotion: 'confident', pose: 'point'}}
      >
        <Big size={112}>{L.s13.big}</Big>
      </Spotlight>
    ),
  },
  {
    id: 's14-share-journey',
    script: L.s14.script,
    node: (
      <Solo
        who="A"
        kicker={L.s14.kicker}
        caption={L.s14.caption}
        mood="data"
        move="driftRight"
        state={{emotion: 'confident', pose: 'presenting', talking: true}}
        prop={<Radar size={320} delay={10} />}
      />
    ),
  },

  /* ------------------------------------------------------------ KİMLİK */
  {
    id: 's15-who-are-we',
    script: L.s15.script,
    node: (
      <Duo
        kicker={L.s15.kicker}
        caption={L.s15.caption}
        mood="void"
        move="pullOut"
        a={{emotion: 'thinking', pose: 'shrug'}}
        b={{emotion: 'thinking', pose: 'shrug'}}
        center={<QuestionMarks size={160} count={3} delay={12} />}
      />
    ),
  },
  {
    id: 's16-citizens',
    script: L.s16.script,
    node: (
      <Spotlight
        kicker={L.s16.kicker}
        caption={L.s16.caption}
        mood="data"
        move="pushIn"
        grid={false}
        a={{emotion: 'happy', pose: 'wave'}}
        b={{emotion: 'happy', pose: 'wave'}}
      >
        <WireGlobe size={480} delay={6} />
      </Spotlight>
    ),
  },
  {
    id: 's17-two-different',
    script: L.s17.script,
    node: (
      <Duo
        kicker={L.s17.kicker}
        caption={L.s17.caption}
        mood="deep"
        move="driftLeft"
        a={{emotion: 'confident', pose: 'crossed'}}
        b={{emotion: 'confident', pose: 'crossed'}}
      />
    ),
  },
  {
    id: 's18-idea-begins',
    script: L.s18.script,
    node: (
      <TitleCard
        title={L.s18.title}
        kicker={L.s18.kicker}
        mood="deep"
        accent={C.violet}
        move="pushIn"
        aState={{emotion: 'confident', pose: 'presenting'}}
        bState={{emotion: 'confident', pose: 'point'}}
      />
    ),
  },
  {
    id: 's19-role-b',
    script: L.s19.script,
    node: (
      <Solo
        who="B"
        kicker={L.s19.kicker}
        caption={L.s19.caption}
        mood="wealth"
        move="driftRight"
        state={{emotion: 'confident', pose: 'point', talking: true}}
        propSide="left"
        prop={
          <HoloPanel width={820} height={480} delay={6} color={C.amber} label={L.s19.label1}>
            <CandleChart width={740} height={400} trend="up" count={18} delay={12} seed="roleB" />
          </HoloPanel>
        }
      />
    ),
  },
  {
    id: 's20-role-a',
    script: L.s20.script,
    node: (
      <ListReveal
        kicker={L.s20.kicker}
        heading={L.s20.heading}
        items={L.s20.items}
        who="A"
        mood="data"
        move="riseUp"
        perItem={9}
        state={{emotion: 'excited', pose: 'presenting', talking: true, energy: 0.25}}
      />
    ),
  },
  {
    id: 's21-two-sides',
    script: L.s21.script,
    node: (
      <Split
        kicker={L.s21.kicker}
        caption={L.s21.caption}
        leftLabel={L.s21.leftLabel}
        rightLabel={L.s21.rightLabel}
        leftItems={L.s21.leftItems}
        rightItems={L.s21.rightItems}
        a={{emotion: 'confident', pose: 'presenting'}}
        b={{emotion: 'confident', pose: 'crossed'}}
      />
    ),
  },
  /* --------------------------------------------------------- HİKÂYE */
  {
    id: 's22-story-behind',
    script: L.s22.script,
    node: (
      <Duo
        kicker={L.s22.kicker}
        caption={L.s22.caption}
        mood="deep"
        move="pushIn"
        a={{emotion: 'thinking', pose: 'crossed'}}
        b={{emotion: 'neutral', pose: 'idle', talking: true}}
      />
    ),
  },
  {
    id: 's23-six-seven-figures',
    script: L.s23.script,
    node: (
      <Spotlight
        kicker={L.s23.kicker}
        caption={L.s23.caption}
        mood="wealth"
        move="pushIn"
        accent={C.amber}
        grid={false}
        a={{emotion: 'excited', pose: 'armsUp', energy: 0.35}}
        b={{emotion: 'confident', pose: 'thumbsUp'}}
      >
        <Stack gap={22}>
          <Counter to={1000000} prefix="$" delay={8} duration={62} size={172} />
          <Row gap={52}>
            <Credits size={170} delay={20} />
            <CandleChart width={620} height={280} trend="up" count={16} delay={14} seed="rich" showAxis={false} />
            <Rocket size={170} delay={28} />
          </Row>
        </Stack>
      </Spotlight>
    ),
  },
  {
    id: 's24-learned-too-late',
    script: L.s24.script,
    node: (
      <CloseUp who="A" emotion="worried" kicker={L.s24.kicker} caption={L.s24.caption} mood="deep" />
    ),
  },
  {
    id: 's25-making-vs-protecting',
    script: L.s25.script,
    node: (
      <Spotlight kicker={L.s25.kicker} caption={L.s25.caption} mood="void" move="pullOut">
        <Row gap={110}>
          <Stack gap={22}>
            <Credits size={260} delay={6} />
            <Tag color={C.amber}>{L.s25.tag}</Tag>
          </Stack>
          <div style={{fontFamily: FONT.display, fontSize: 96, color: C.textFaint}}>/</div>
          <Stack gap={22}>
            <Shield size={260} delay={18} />
            <Tag color={C.green}>{L.s25.tag2}</Tag>
          </Stack>
        </Row>
      </Spotlight>
    ),
  },
  {
    id: 's26-hard-way',
    script: L.s26.script,
    node: (
      <Duo
        kicker={L.s26.kicker}
        caption={L.s26.caption}
        mood="risk"
        move="pushIn"
        a={{emotion: 'sad', pose: 'handsDown'}}
        b={{emotion: 'worried', pose: 'shrug', talking: true}}
      />
    ),
  },
  {
    id: 's27-lost-everything',
    script: L.s27.script,
    node: (
      <Spotlight
        kicker={L.s27.kicker}
        caption={L.s27.caption}
        mood="risk"
        move="pushIn"
        accent={C.red}
        a={{emotion: 'defeated', pose: 'handsDown'}}
        b={{emotion: 'defeated', pose: 'handsDown'}}
      >
        <CandleChart width={1180} height={430} trend="crash" count={22} delay={4} seed="crash" />
      </Spotlight>
    ),
  },
  {
    id: 's28-not-easy',
    script: L.s28.script,
    node: (
      <CloseUp
        who="B"
        emotion="defeated"
        kicker={L.s28.kicker}
        caption={L.s28.caption}
        mood="risk"
        side="right"
        talking={false}
      />
    ),
  },
  {
    id: 's29-valuable',
    script: L.s29.script,
    node: (
      <CloseUp
        who="A"
        emotion="thinking"
        kicker={L.s29.kicker}
        caption={L.s29.caption}
        mood="deep"
      />
    ),
  },
  {
    id: 's30-when-going-well',
    script: L.s30.script,
    node: (
      <ListReveal
        kicker={L.s30.kicker}
        heading={L.s30.heading}
        items={L.s30.items}
        mood="void"
        move="driftLeft"
        who="B"
        perItem={16}
        state={{emotion: 'thinking', pose: 'presenting', talking: true}}
      />
    ),
  },
  {
    id: 's31-protecting-effort',
    script: L.s31.script,
    node: (
      <Spotlight
        kicker={L.s31.kicker}
        caption={L.s31.caption}
        mood="void"
        move="pushIn"
        accent={C.green}
        grid={false}
        b={{emotion: 'confident', pose: 'point'}}
      >
        <Shield size={400} delay={6} />
      </Spotlight>
    ),
  },
  {
    id: 's32-serious-questions',
    script: L.s32.script,
    node: (
      <Duo
        kicker={L.s32.kicker}
        caption={L.s32.caption}
        mood="deep"
        move="pullOut"
        a={{emotion: 'thinking', pose: 'crossed'}}
        b={{emotion: 'thinking', pose: 'crossed'}}
        center={<QuestionMarks size={170} count={3} delay={10} color={C.violet} />}
      />
    ),
  },
  {
    id: 's33-the-questions',
    script: L.s33.script,
    node: (
      <ListReveal
        kicker={L.s33.kicker}
        heading={L.s33.heading}
        items={L.s33.items}
        mood="deep"
        move="riseUp"
        who="A"
        perItem={16}
        state={{emotion: 'thinking', pose: 'point', talking: true}}
      />
    ),
  },
  {
    id: 's34-from-zero',
    script: L.s34.script,
    node: (
      <Spotlight kicker={L.s34.kicker} caption={L.s34.caption} mood="data" move="driftRight">
        <Row gap={76}>
          <Counter to={0} delay={4} duration={2} size={280} color={C.red} />
          <div style={{fontFamily: FONT.display, fontSize: 100, color: C.cyan, opacity: 0.7}}>→</div>
          <CandleChart width={720} height={380} trend="recover" count={18} delay={16} seed="restart" />
        </Row>
      </Spotlight>
    ),
  },
  {
    id: 's35-foundations',
    script: L.s35.script,
    node: (
      <Solo
        who="B"
        kicker={L.s35.kicker}
        caption={L.s35.caption}
        mood="data"
        move="riseUp"
        state={{emotion: 'confident', pose: 'presenting', talking: true}}
        propSide="left"
        prop={<BlockChain size={130} count={4} delay={8} vertical color={C.amber} />}
      />
    ),
  },

  /* ------------------------------------------------------------ MERAK */
  {
    id: 's36-not-about-money',
    script: L.s36.script,
    node: (
      <Solo
        who="A"
        kicker={L.s36.kicker}
        caption={L.s36.caption}
        captionSize={48}
        mood="void"
        move="driftLeft"
        state={{emotion: 'confident', pose: 'presenting', talking: true}}
        prop={<Scanner size={330} delay={10} />}
      />
    ),
  },
  {
    id: 's37-questions-1',
    script: L.s37.script,
    node: (
      <ListReveal
        kicker={L.s37.kicker}
        heading={L.s37.heading}
        items={L.s37.items}
        mood="data"
        move="driftRight"
        who="A"
        perItem={16}
        state={{emotion: 'thinking', pose: 'point', talking: true}}
      />
    ),
  },
  {
    id: 's38-questions-2',
    script: L.s38.script,
    node: (
      <ListReveal
        kicker={L.s38.kicker}
        heading={L.s38.heading}
        items={L.s38.items}
        mood="deep"
        move="driftLeft"
        who="B"
        perItem={15}
        state={{emotion: 'thinking', pose: 'presenting', talking: true}}
      />
    ),
  },
  {
    id: 's39-sometimes',
    script: L.s39.script,
    node: (
      <Duo
        kicker={L.s39.kicker}
        caption={L.s39.caption}
        captionSize={48}
        mood="data"
        move="pushIn"
        a={{emotion: 'thinking', pose: 'presenting', talking: true}}
        b={{emotion: 'neutral', pose: 'crossed'}}
        center={<Radar size={250} delay={10} />}
      />
    ),
  },
  {
    id: 's40-nothing-here',
    script: L.s40.script,
    seconds: 3.4,
    node: (
      <Duo
        bubble={L.s40.bubble}
        speaker="B"
        mood="void"
        move="pushIn"
        a={{emotion: 'laughing', pose: 'facepalm'}}
        b={{emotion: 'defeated', pose: 'shrug', talking: true}}
      />
    ),
  },

  /* --------------------------------------------------------- DÜRÜSTLÜK */
  {
    id: 's41-real-process',
    script: L.s41.script,
    node: (
      <Spotlight
        mood="deep"
        move="pullOut"
        grid={false}
        a={{emotion: 'confident', pose: 'crossed'}}
        b={{emotion: 'confident', pose: 'crossed'}}
      >
        <Big size={108}>{L.s41.big}</Big>
      </Spotlight>
    ),
  },
  {
    id: 's42-win-lose',
    script: L.s42.script,
    node: (
      <ListReveal
        kicker={L.s42.kicker}
        heading={L.s42.heading}
        items={L.s42.items}
        mood="void"
        move="driftRight"
        who="A"
        perItem={14}
        state={{emotion: 'confident', pose: 'presenting', talking: true}}
      />
    ),
  },
  {
    id: 's43-iceberg',
    script: L.s43.script,
    node: (
      <Spotlight
        kicker={L.s43.kicker}
        caption={L.s43.caption}
        mood="data"
        move="sinkDown"
        grid={false}
      >
        <Iceberg
          width={610}
          topLabel={L.s43.topLabel}
          bottomLabels={L.s43.bottomLabels}
          delay={4}
        />
      </Spotlight>
    ),
  },
  {
    id: 's44-show-that-too',
    script: L.s44.script,
    node: (
      <Duo
        kicker={L.s44.kicker}
        caption={L.s44.caption}
        mood="void"
        move="pushIn"
        a={{emotion: 'confident', pose: 'point', talking: true}}
        b={{emotion: 'confident', pose: 'thumbsUp'}}
      />
    ),
  },

  /* ---------------------------------------------------------- GELECEK */
  {
    id: 's45-looking-back',
    script: L.s45.script,
    node: (
      <Spotlight kicker={L.s45.kicker} caption={L.s45.caption} mood="deep" move="driftRight" grid={false}>
        <Row gap={58}>
          <Coin size={160} symbol="1" delay={6} color={C.violet} />
          <div style={{fontFamily: FONT.display, fontSize: 80, color: C.textFaint}}>→</div>
          <Coin size={215} symbol="5" delay={14} color={C.cyan} phase={1} />
          <div style={{fontFamily: FONT.display, fontSize: 80, color: C.textFaint}}>→</div>
          <Coin size={270} symbol="10" delay={22} color={C.amber} phase={2} />
        </Row>
      </Spotlight>
    ),
  },
  {
    id: 's46-evaluate',
    script: L.s46.script,
    node: (
      <Split
        kicker={L.s46.kicker}
        caption={L.s46.caption}
        leftLabel={L.s46.leftLabel}
        rightLabel={L.s46.rightLabel}
        leftItems={L.s46.leftItems}
        rightItems={L.s46.rightItems}
        a={{emotion: 'thinking', pose: 'point'}}
        b={{emotion: 'shocked', pose: 'shrug'}}
      />
    ),
  },
  {
    id: 's47-find-out',
    script: L.s47.script,
    node: (
      <Duo
        caption={L.s47.caption}
        mood="data"
        move="pushIn"
        a={{emotion: 'confident', pose: 'presenting'}}
        b={{emotion: 'confident', pose: 'presenting'}}
      />
    ),
  },
  {
    id: 's48-come-back',
    script: L.s48.script,
    node: (
      <Duo
        bubble={L.s48.bubble}
        speaker="A"
        mood="deep"
        move="pullOut"
        a={{emotion: 'shocked', pose: 'shrug', talking: true}}
        b={{emotion: 'laughing', pose: 'facepalm'}}
      />
    ),
  },
  {
    id: 's49-maybe',
    script: L.s49.script,
    node: (
      <ListReveal
        kicker={L.s49.kicker}
        heading={L.s49.heading}
        items={L.s49.items}
        mood="deep"
        move="riseUp"
        who="A"
        perItem={17}
        state={{emotion: 'excited', pose: 'pointUp', talking: true, energy: 0.2}}
      />
    ),
  },
  {
    id: 's50-dont-know',
    script: L.s50.script,
    node: (
      <Duo
        caption={L.s50.caption}
        captionSize={48}
        mood="void"
        move="driftLeft"
        a={{emotion: 'happy', pose: 'shrug'}}
        b={{emotion: 'happy', pose: 'shrug'}}
      />
    ),
  },
  {
    id: 's51-starting',
    script: L.s51.script,
    node: (
      <TitleCard
        title={L.s51.title}
        kicker={L.s51.kicker}
        mood="wealth"
        accent={C.amber}
        burst
        move="pushIn"
        aState={{emotion: 'excited', pose: 'armsUp', energy: 0.5}}
        bState={{emotion: 'excited', pose: 'armsUp', energy: 0.5}}
      />
    ),
  },
  {
    id: 's52-with-us',
    script: L.s52.script,
    node: (
      <Duo
        kicker={L.s52.kicker}
        caption={L.s52.caption}
        mood="deep"
        move="pushIn"
        a={{emotion: 'confident', pose: 'point', talking: true}}
        b={{emotion: 'confident', pose: 'point'}}
      />
    ),
  },

  /* ----------------------------------------------------------- KAPANIŞ */
  {
    id: 's53-first-videos',
    script: L.s53.script,
    node: (
      <ListReveal
        kicker={L.s53.kicker}
        heading={L.s53.heading}
        items={L.s53.items}
        columns={2}
        mood="data"
        move="riseUp"
        who="B"
        perItem={11}
        state={{emotion: 'confident', pose: 'presenting', talking: true}}
      />
    ),
  },
  {
    id: 's54-free-series',
    script: L.s54.script,
    node: (
      <Spotlight
        kicker={L.s54.kicker}
        mood="wealth"
        move="pushIn"
        accent={C.amber}
        grid={false}
        a={{emotion: 'confident', pose: 'presenting', talking: true}}
        b={{emotion: 'happy', pose: 'thumbsUp'}}
      >
        <Big size={110} color={C.amber}>{L.s54.big}</Big>
      </Spotlight>
    ),
  },
  {
    id: 's55-ask-us',
    script: L.s55.script,
    node: (
      <Solo
        who="A"
        kicker={L.s55.kicker}
        caption={L.s55.caption}
        mood="void"
        move="driftRight"
        state={{emotion: 'confident', pose: 'point', talking: true}}
        propSide="left"
        prop={
          <CommentStack
            width={760}
            delay={8}
            items={L.s55.items}
          />
        }
      />
    ),
  },
  {
    id: 's56-next-video',
    script: L.s56.script,
    node: (
      <Duo
        caption={L.s56.caption}
        captionSize={48}
        mood="data"
        move="pushIn"
        a={{emotion: 'excited', pose: 'pointUp', talking: true}}
        b={{emotion: 'happy', pose: 'thumbsUp'}}
      />
    ),
  },
  {
    id: 's57-together',
    script: L.s57.script,
    node: (
      <Spotlight
        kicker={L.s57.kicker}
        mood="deep"
        move="pullOut"
        grid={false}
        a={{emotion: 'confident', pose: 'presenting', talking: true}}
        b={{emotion: 'confident', pose: 'presenting'}}
      >
        <NodeGraph width={900} height={420} delay={4} nodes={13} />
      </Spotlight>
    ),
  },
  {
    id: 's58-millions',
    script: L.s58.script,
    node: (
      <Spotlight
        kicker={L.s58.kicker}
        caption={L.s58.caption}
        mood="wealth"
        move="pushIn"
        accent={C.amber}
        grid={false}
        a={{emotion: 'shocked', pose: 'armsUp'}}
        b={{emotion: 'laughing', pose: 'shrug'}}
      >
        <Counter to={1000000} suffix={L.s58.suffix} delay={6} duration={72} size={164} />
      </Spotlight>
    ),
  },
  {
    id: 's59-starting-point',
    script: L.s59.script,
    node: (
      <Spotlight
        kicker={L.s59.kicker}
        mood="void"
        move="pushIn"
        grid={false}
        a={{emotion: 'confident', pose: 'crossed'}}
        b={{emotion: 'confident', pose: 'crossed'}}
      >
        <Stack gap={34}>
          <HudFrame width={980} height={190} delay={4} label={L.s59.label1}>
            <Big size={72}>{L.s59.big}</Big>
          </HudFrame>
          <Ticker width={1080} delay={18} />
        </Stack>
      </Spotlight>
    ),
  },
  {
    id: 's60-like-subscribe',
    script: L.s60.script,
    node: (
      <Spotlight
        kicker={L.s60.kicker}
        caption={L.s60.caption}
        mood="risk"
        move="pushIn"
        accent={C.red}
        grid={false}
        a={{emotion: 'excited', pose: 'pointUp', energy: 0.3}}
        b={{emotion: 'happy', pose: 'pointUp', energy: 0.3}}
      >
        <Stack gap={42}>
          <LikeSubscribe delay={6} scale={1.35} />
          <Counter to={1000000} suffix={L.s60.suffix} delay={26} duration={62} size={104} color={C.text} />
        </Stack>
      </Spotlight>
    ),
  },
  {
    id: 's61-outro',
    script: L.s61.script,
    node: (
      <TitleCard
        title={L.s61.title}
        kicker={L.s61.kicker}
        subtitle={L.s61.subtitle}
        mood="void"
        burst
        move="pullOut"
        aState={{emotion: 'confident', pose: 'presenting'}}
        bState={{emotion: 'confident', pose: 'crossed'}}
      />
    ),
  },
];
