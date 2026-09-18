import React from 'react';
import {CloseUp, Duo, ListReveal, Solo, Spotlight, Split, TitleCard} from '../scenes/layouts';
import {BlockChain, CandleChart, Coin, Parachute, Rocket} from '../props/Crypto';
import {CommentStack, Counter, Iceberg, NoSign, Shield} from '../props/Story';
import {Credits, LikeSubscribe, QuestionMarks, Scanner} from '../props/Ui';
import {HoloPanel, HudFrame, NodeGraph, Radar, Ticker, WireGlobe} from '../props/SciFi';
import {C, FONT, textGlow} from '../theme';

export type Beat = {
  /** Kompozisyon kimliği olarak da kullanılır — benzersiz olmalı. */
  readonly id: string;
  /** İlgili ses kaydı metni. Süre bundan hesaplanır; referans olarak da durur. */
  readonly script: string;
  /** Otomatik süreyi ezmek için (saniye). */
  readonly seconds?: number;
  readonly node: React.ReactNode;
};

/**
 * Ses kaydının toplam süresi (saniye). TEK AYAR NOKTASI:
 * kaydın 8:12 ise burayı 492 yap, tüm sahneler orantılı olarak yeniden dağılır.
 */
export const TARGET_SECONDS = 8 * 60;

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

export const BEATS: readonly Beat[] = [
  /* ---------------------------------------------------------- AÇILIŞ */
  {
    id: 's01-welcome',
    script: 'Hey everyone, welcome to TwoSide Boys.',
    node: (
      <TitleCard
        title="TwoSide Boys"
        kicker="Transmission 001"
        subtitle="Hey everyone — welcome."
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
    script: 'This is a channel built by two friends from two different sides.',
    node: (
      <Duo
        kicker="Origin"
        caption="Two friends. Two different sides."
        mood="void"
        move="driftRight"
        a={{emotion: 'confident', pose: 'presenting', talking: true}}
        b={{emotion: 'neutral', pose: 'crossed'}}
      />
    ),
  },
  {
    id: 's03-family',
    script: 'And here, we want to build a family.',
    node: (
      <Duo
        bubble="We want to build a family."
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
    script:
      'We’re going to talk about leverage trading, spot trading, blockchain, and all kinds of opportunities across the crypto space.',
    node: (
      <ListReveal
        kicker="Coverage"
        heading="What we'll talk about"
        items={['Leverage trading', 'Spot trading', 'Blockchain', 'Opportunities across crypto']}
        who="B"
        mood="data"
        move="driftLeft"
        state={{emotion: 'confident', pose: 'presenting', talking: true}}
      />
    ),
  },
  {
    id: 's05-not-that-channel',
    script:
      'But we don’t want to be one of those channels that just pulls up a chart and says, buy here, sell here.',
    node: (
      <Solo
        who="B"
        kicker="Not this"
        caption={'"Buy here. Sell here."'}
        mood="risk"
        move="pullOut"
        state={{emotion: 'worried', pose: 'facepalm'}}
        propSide="left"
        prop={
          <NoSign size={560} delay={16} label="Rejected">
            <HoloPanel width={560} height={340} delay={4} color={C.red} label="Signal">
              <CandleChart width={470} height={250} trend="chop" count={12} delay={8} seed="nope" showAxis={false} />
            </HoloPanel>
          </NoSign>
        }
      />
    ),
  },
  {
    id: 's06-bigger-than-charts',
    script: 'Because to us, crypto is so much bigger than charts.',
    node: (
      <Spotlight kicker="Scope" caption="Crypto is bigger than charts" mood="deep" move="pullOut" accent={C.violet}>
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
    script:
      'New projects, blockchain technology, on-chain data, different ecosystems, airdrops, new opportunities, and of course, sometimes, some completely ridiculous stuff.',
    node: (
      <ListReveal
        kicker="Full spectrum"
        heading="All of it"
        items={[
          'New projects',
          'Blockchain technology',
          'On-chain data',
          'Different ecosystems',
          'Airdrops',
          'New opportunities',
          '…and some ridiculous stuff',
        ]}
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
    script: 'We’re going to be right in the middle of all of it.',
    node: (
      <Duo
        kicker="Position"
        caption="Right in the middle of all of it"
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
    script: 'But before we go any further, there’s one thing we want to make very clear from the beginning.',
    node: (
      <Duo
        kicker="Disclosure"
        caption="One thing, very clear"
        mood="deep"
        move="pushIn"
        a={{emotion: 'confident', pose: 'point', talking: true}}
        b={{emotion: 'neutral', pose: 'crossed'}}
      />
    ),
  },
  {
    id: 's10-never-ask-money',
    script: 'We’re never going to ask you for money or anything else.',
    node: (
      <Spotlight kicker="Policy" caption="We will never ask you for money" mood="risk" move="pushIn" accent={C.red} grid={false}>
        <NoSign size={620} delay={10} label="Never">
          <Credits size={420} delay={2} />
        </NoSign>
      </Spotlight>
    ),
  },
  {
    id: 's11-not-advice',
    script: 'We’re not here to give you financial advice.',
    node: (
      <Solo
        who="B"
        kicker="Disclaimer"
        caption="This is not financial advice"
        mood="risk"
        move="driftLeft"
        state={{emotion: 'worried', pose: 'shrug', talking: true}}
        prop={<QuestionMarks size={150} count={3} delay={10} color={C.red} />}
      />
    ),
  },
  {
    id: 's12-instead',
    script:
      'Instead, we’re going to show you what we’re doing, why we’re doing it, and what we learn along the way.',
    node: (
      <ListReveal
        kicker="Instead"
        heading="We show you"
        items={['What we are doing', 'Why we are doing it', 'What we learn along the way']}
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
    script: 'The decisions will always be yours.',
    node: (
      <Spotlight
        mood="void"
        move="pushIn"
        grid={false}
        a={{emotion: 'confident', pose: 'point'}}
        b={{emotion: 'confident', pose: 'point'}}
      >
        <Big size={112}>The decisions will always be yours</Big>
      </Spotlight>
    ),
  },
  {
    id: 's14-share-journey',
    script: 'We’re simply going to share our journey, our experiences, and our own research with you.',
    node: (
      <Solo
        who="A"
        kicker="Method"
        caption="Our journey. Our research."
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
    script:
      'So, who are we? Honestly, where we were born or where we live doesn’t really matter that much.',
    node: (
      <Duo
        kicker="Identity"
        caption="So… who are we?"
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
    script: 'We’re citizens of the world. And we live all over the world.',
    node: (
      <Spotlight
        kicker="Location"
        caption="Citizens of the world"
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
    script:
      'We’re two different people. Two different personalities. Two different perspectives. And we’re interested in different parts of the crypto space.',
    node: (
      <Duo
        kicker="Contrast"
        caption="Two people. Two perspectives."
        mood="deep"
        move="driftLeft"
        a={{emotion: 'confident', pose: 'crossed'}}
        b={{emotion: 'confident', pose: 'crossed'}}
      />
    ),
  },
  {
    id: 's18-idea-begins',
    script: 'That’s really where the whole idea behind TwoSide Boys begins.',
    node: (
      <TitleCard
        title="That's where it begins"
        kicker="Origin point"
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
    script:
      'One of us is going to be more active on the futures and spot trading side. We’ll share our trades, the strategies we use, how we look at the market, and everything we learn as we go.',
    node: (
      <Solo
        who="B"
        kicker="Side B"
        caption="Futures & spot trading"
        mood="wealth"
        move="driftRight"
        state={{emotion: 'confident', pose: 'point', talking: true}}
        propSide="left"
        prop={
          <HoloPanel width={820} height={480} delay={6} color={C.amber} label="BTC / PERP">
            <CandleChart width={740} height={400} trend="up" count={18} delay={12} seed="roleB" />
          </HoloPanel>
        }
      />
    ),
  },
  {
    id: 's20-role-a',
    script:
      'The other one is going to be more focused on chasing opportunities across the crypto space. Airdrops, new projects, blockchain ecosystems, on-chain research, and opportunities that most people haven’t noticed yet.',
    node: (
      <ListReveal
        kicker="Side A"
        heading="Chasing opportunities"
        items={['Airdrops', 'New projects', 'Blockchain ecosystems', 'On-chain research', 'What most people miss']}
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
    script:
      'So on one side, you have active trading. And on the other, you have exploring the different opportunities that crypto has to offer. Two different sides. But one journey.',
    node: (
      <Split
        kicker="The split"
        caption="Two different sides. One journey."
        leftLabel="Exploring"
        rightLabel="Active trading"
        leftItems={['Airdrops', 'On-chain', 'New projects']}
        rightItems={['Futures', 'Spot', 'Strategy']}
        a={{emotion: 'confident', pose: 'presenting'}}
        b={{emotion: 'confident', pose: 'crossed'}}
      />
    ),
  },
  /* --------------------------------------------------------- HİKÂYE */
  {
    id: 's22-story-behind',
    script: 'And this journey actually has a pretty interesting story behind it.',
    node: (
      <Duo
        kicker="Archive"
        caption="There's a story behind this"
        mood="deep"
        move="pushIn"
        a={{emotion: 'thinking', pose: 'crossed'}}
        b={{emotion: 'neutral', pose: 'idle', talking: true}}
      />
    ),
  },
  {
    id: 's23-six-seven-figures',
    script:
      'There were times when we saw six and even seven-figure numbers in the financial markets, in dollar terms.',
    node: (
      <Spotlight
        kicker="Peak"
        caption="Six figures. Then seven."
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
    script:
      'But we learned way too late that making money at a young age is very different from simply making money.',
    node: (
      <CloseUp who="A" emotion="worried" kicker="Lesson 01" caption="We learned it way too late." mood="deep" />
    ),
  },
  {
    id: 's25-making-vs-protecting',
    script: 'Because making money is one thing. Protecting and managing that money is a completely different thing.',
    node: (
      <Spotlight kicker="Two problems" caption="Making it is not keeping it" mood="void" move="pullOut">
        <Row gap={110}>
          <Stack gap={22}>
            <Credits size={260} delay={6} />
            <Tag color={C.amber}>Making it</Tag>
          </Stack>
          <div style={{fontFamily: FONT.display, fontSize: 96, color: C.textFaint}}>/</div>
          <Stack gap={22}>
            <Shield size={260} delay={18} />
            <Tag color={C.green}>Keeping it</Tag>
          </Stack>
        </Row>
      </Spotlight>
    ),
  },
  {
    id: 's26-hard-way',
    script:
      'We learned that the hard way. We were young. We didn’t have enough experience. And at certain points, we simply didn’t know how to properly manage the amount of money we had made.',
    node: (
      <Duo
        kicker="Failure"
        caption="We learned it the hard way"
        mood="risk"
        move="pushIn"
        a={{emotion: 'sad', pose: 'handsDown'}}
        b={{emotion: 'worried', pose: 'shrug', talking: true}}
      />
    ),
  },
  {
    id: 's27-lost-everything',
    script: 'And eventually, we lost everything.',
    node: (
      <Spotlight
        kicker="Liquidation"
        caption="And then — we lost everything"
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
    script: 'That period wasn’t easy for us.',
    node: (
      <CloseUp
        who="B"
        emotion="defeated"
        kicker="Aftermath"
        caption="That period was not easy."
        mood="risk"
        side="right"
        talking={false}
      />
    ),
  },
  {
    id: 's29-valuable',
    script:
      'But looking back today, we think it became one of the most valuable experiences we’ve ever had.',
    node: (
      <CloseUp
        who="A"
        emotion="thinking"
        kicker="In hindsight"
        caption="Looking back — it was the most valuable thing that happened to us."
        mood="deep"
      />
    ),
  },
  {
    id: 's30-when-going-well',
    script:
      'Because when everything is going well, you don’t really understand the value of certain things. When you have money, you don’t always realize how big the risks really are. When you’re making money, you don’t realize how important it is to stay disciplined.',
    node: (
      <ListReveal
        kicker="Blind spots"
        heading="When it's going well"
        items={['You miss the value of things', 'You underestimate the risk', 'You forget about discipline']}
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
    script:
      'And most importantly, we learned much later that protecting your money takes just as much effort as making it in the first place.',
    node: (
      <Spotlight
        kicker="Lesson 02"
        caption="Protecting it takes the same effort"
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
    script: 'At some point, we had to stop and ask ourselves some serious questions.',
    node: (
      <Duo
        kicker="Debrief"
        caption="So we stopped and asked ourselves…"
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
    script:
      'What did we do wrong? Where did we take too much risk? Why couldn’t we maintain the same level of discipline when things were going well? And most importantly, what do we need to do to make sure we never end up in the same place again?',
    node: (
      <ListReveal
        kicker="Post-mortem"
        heading="The questions"
        items={[
          'What did we do wrong?',
          'Where did we take too much risk?',
          'Why did discipline slip when things were good?',
          'How do we never end up here again?',
        ]}
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
    script:
      'That’s exactly what we’re working on right now. We started from zero. We built ourselves a new budget.',
    node: (
      <Spotlight kicker="Reset" caption="We started from zero" mood="data" move="driftRight">
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
    script:
      'And this time, we want to move forward with stronger foundations, more control, and a much more structured approach.',
    node: (
      <Solo
        who="B"
        kicker="Rebuild"
        caption="Stronger foundations this time"
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
    script:
      'But we also don’t want this channel to be just a story about us making or losing money. Because for us, the really interesting part isn’t the money itself. It’s understanding how this whole world actually works.',
    node: (
      <Solo
        who="A"
        kicker="Why"
        caption="It's not about the money — it's about how this works"
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
    script:
      'What technology is actually behind a blockchain project? Why does a token gain or lose value? Does a project actually have a real product behind it, or is it just a good story?',
    node: (
      <ListReveal
        kicker="Queries"
        heading="For example"
        items={[
          'What tech is actually behind a project?',
          'Why does a token gain or lose value?',
          'Real product — or just a good story?',
        ]}
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
    script:
      'What risks are we actually taking when we make a trade? What can we learn from the on-chain activity of a wallet? How can you spot a project before everyone starts talking about it? Is an airdrop actually an opportunity, or is it just a waste of time?',
    node: (
      <ListReveal
        kicker="Queries"
        heading="And these"
        items={[
          'What risk are we really taking?',
          'What does a wallet tell us on-chain?',
          'How do you spot a project early?',
          'Is that airdrop worth the time?',
        ]}
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
    script:
      'Sometimes, we’ll find the answers. Sometimes, we won’t. Sometimes, we’ll discover something really valuable. And sometimes, we’ll spend hours researching something only to end up saying…',
    node: (
      <Duo
        kicker="Research"
        caption="Sometimes we find it. Sometimes we don't."
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
    script: 'Bro, there’s literally nothing here.',
    seconds: 3.4,
    node: (
      <Duo
        bubble={'"Bro… there is literally\nnothing here."'}
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
    script:
      'But the whole process is going to be real. This isn’t some perfectly prepared story where everything is made to look perfect. This is a real journey.',
    node: (
      <Spotlight
        mood="deep"
        move="pullOut"
        grid={false}
        a={{emotion: 'confident', pose: 'crossed'}}
        b={{emotion: 'confident', pose: 'crossed'}}
      >
        <Big size={108}>No filters. This is a real journey</Big>
      </Spotlight>
    ),
  },
  {
    id: 's42-win-lose',
    script:
      'When we win, we’ll say we won. When we lose, we’ll say we lost. And when we make a mistake, we’re not going to hide it.',
    node: (
      <ListReveal
        kicker="Protocol"
        heading="No filters"
        items={['We win → we say we won', 'We lose → we say we lost', 'We mess up → we show it']}
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
    script:
      'Because on the internet, we usually only see the outcome. When someone makes millions, everyone sees the millions. But almost nobody sees the hundreds of mistakes they made along the way. The money they lost. The bad decisions. The sleepless nights. Most of that stays behind the scenes.',
    node: (
      <Spotlight
        kicker="Below the surface"
        caption="The internet only shows you the tip"
        mood="data"
        move="sinkDown"
        grid={false}
      >
        <Iceberg
          width={610}
          topLabel="THE MILLIONS"
          bottomLabels={['Hundreds of mistakes', 'The money they lost', 'The bad decisions', 'The sleepless nights']}
          delay={4}
        />
      </Spotlight>
    ),
  },
  {
    id: 's44-show-that-too',
    script: 'And that’s something we want to show too.',
    node: (
      <Duo
        kicker="Commitment"
        caption="We want to show that part too"
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
    script:
      'Because maybe one of the most valuable things about this channel will be looking back years from now and seeing how much we’ve changed.',
    node: (
      <Spotlight kicker="Timeline" caption="Years from now, we'll look back at this" mood="deep" move="driftRight" grid={false}>
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
    script:
      'How do we evaluate a trade today? How will we look at that same trade one year from now? How do we think about risk management today? What are we going to learn a year from now?',
    node: (
      <Split
        kicker="Compare"
        caption="Today vs. one year from now"
        leftLabel="Today"
        rightLabel="In a year"
        leftItems={['How we read a trade', 'How we size risk']}
        rightItems={['— unknown —', 'We will find out']}
        a={{emotion: 'thinking', pose: 'point'}}
        b={{emotion: 'shocked', pose: 'shrug'}}
      />
    ),
  },
  {
    id: 's47-find-out',
    script: 'We’re going to find out together.',
    node: (
      <Duo
        caption="We'll find out together"
        mood="data"
        move="pushIn"
        a={{emotion: 'confident', pose: 'presenting'}}
        b={{emotion: 'confident', pose: 'presenting'}}
      />
    ),
  },
  {
    id: 's48-come-back',
    script:
      'And maybe, years from now, we’ll come back to this video and say… Wait, this is really where we started?',
    node: (
      <Duo
        bubble={'"Wait… this is really\nwhere we started?"'}
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
    script:
      'Maybe we’ll be in a completely different place. Maybe we’ll be creating content from different parts of the world. Maybe we’ll be working with completely different people. Maybe this community will grow into something huge, bringing people together from all around the world.',
    node: (
      <ListReveal
        kicker="Projection"
        heading="Maybe"
        items={[
          'A completely different place',
          'Filming from other parts of the world',
          'Working with different people',
          'A community from everywhere',
        ]}
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
    script: 'We don’t know right now. But we don’t need to know.',
    node: (
      <Duo
        caption="We don't know. And we don't need to."
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
    script: 'Because for now, there’s only one thing we know for sure: we’re starting.',
    node: (
      <TitleCard
        title="We're starting"
        kicker="Status"
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
    script: 'And we want you to be there with us on this journey.',
    node: (
      <Duo
        kicker="Invitation"
        caption="And we want you with us"
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
    script:
      'We’ll be releasing our first videos very soon. Futures, spot trading, blockchain research, new projects, airdrops, on-chain analysis, and all kinds of different opportunities we come across in the market. We’re going to talk about all of it here.',
    node: (
      <ListReveal
        kicker="Incoming"
        heading="Coming very soon"
        items={['Futures', 'Spot trading', 'Blockchain research', 'New projects', 'Airdrops', 'On-chain analysis']}
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
    script:
      'But it’s not going to be just about the topics we choose. Based on what you guys ask for, we’ll also create free educational series.',
    node: (
      <Spotlight
        kicker="Open access"
        mood="wealth"
        move="pushIn"
        accent={C.amber}
        grid={false}
        a={{emotion: 'confident', pose: 'presenting', talking: true}}
        b={{emotion: 'happy', pose: 'thumbsUp'}}
      >
        <Big size={110} color={C.amber}>Free — because you asked</Big>
      </Spotlight>
    ),
  },
  {
    id: 's55-ask-us',
    script:
      'If there’s something you don’t understand, drop it in the comments. If there’s something you’re curious about, ask us. If you want us to look into a project, let us know. If there’s a strategy you don’t understand, tell us.',
    node: (
      <Solo
        who="A"
        kicker="Input"
        caption="Drop it in the comments"
        mood="void"
        move="driftRight"
        state={{emotion: 'confident', pose: 'point', talking: true}}
        propSide="left"
        prop={
          <CommentStack
            width={760}
            delay={8}
            items={[
              "I don't get this part…",
              'Can you look into this project?',
              'What does this strategy mean?',
              'Explain on-chain data?',
            ]}
          />
        }
      />
    ),
  },
  {
    id: 's56-next-video',
    script: 'Maybe the topic of our next video will come directly from one of your comments.',
    node: (
      <Duo
        caption="Your comment could be our next video"
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
    script:
      'Because we don’t want this to be a channel where it’s just us talking. We want to build the TwoSide Boys story together.',
    node: (
      <Spotlight
        kicker="Together"
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
    script:
      'And who knows… Maybe years from now, millions of people will watch this very first video and say: wait, they actually said all this when they first started?',
    node: (
      <Spotlight
        kicker="Projection"
        caption="Maybe millions will watch this one day"
        mood="wealth"
        move="pushIn"
        accent={C.amber}
        grid={false}
        a={{emotion: 'shocked', pose: 'armsUp'}}
        b={{emotion: 'laughing', pose: 'shrug'}}
      >
        <Counter to={1000000} suffix="views" delay={6} duration={72} size={164} />
      </Spotlight>
    ),
  },
  {
    id: 's59-starting-point',
    script:
      'So don’t think of this video as just a channel introduction. For us, this is a starting point. The first record of where we began.',
    node: (
      <Spotlight
        kicker="Record 001"
        mood="void"
        move="pushIn"
        grid={false}
        a={{emotion: 'confident', pose: 'crossed'}}
        b={{emotion: 'confident', pose: 'crossed'}}
      >
        <Stack gap={34}>
          <HudFrame width={980} height={190} delay={4} label="Archive entry">
            <Big size={72}>The first record of where we began</Big>
          </HudFrame>
          <Ticker width={1080} delay={18} />
        </Stack>
      </Spotlight>
    ),
  },
  {
    id: 's60-like-subscribe',
    script:
      'And by the way, don’t forget to like the video and subscribe to the channel. Because maybe by the time we hit one million subscribers, you’ll finally know who we are.',
    node: (
      <Spotlight
        kicker="Signal boost"
        caption="Like & subscribe"
        mood="risk"
        move="pushIn"
        accent={C.red}
        grid={false}
        a={{emotion: 'excited', pose: 'pointUp', energy: 0.3}}
        b={{emotion: 'happy', pose: 'pointUp', energy: 0.3}}
      >
        <Stack gap={42}>
          <LikeSubscribe delay={6} scale={1.35} />
          <Counter to={1000000} suffix="subs" delay={26} duration={62} size={104} color={C.text} />
        </Stack>
      </Spotlight>
    ),
  },
  {
    id: 's61-outro',
    script:
      'But for now, just remember this: we’re two friends. We’re two different sides. And we’re just getting started. TwoSide Boys.',
    node: (
      <TitleCard
        title="TwoSide Boys"
        kicker="Two friends · two sides"
        subtitle="And we're just getting started."
        mood="void"
        burst
        move="pullOut"
        aState={{emotion: 'confident', pose: 'presenting'}}
        bState={{emotion: 'confident', pose: 'crossed'}}
      />
    ),
  },
] as const;
