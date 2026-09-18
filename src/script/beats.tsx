import React from 'react';
import {CloseUp, Duo, ListReveal, Solo, Spotlight, Split, TitleCard} from '../scenes/layouts';
import {BlockChain, CandleChart, Coin, Parachute, Rocket} from '../props/Crypto';
import {Counter, Iceberg, NoSign, Shield} from '../props/Story';
import {CommentStack} from '../props/Story';
import {Globe, LikeSubscribe, Magnifier, MoneyBag, QuestionMarks, Screen} from '../props/Ui';
import {C, FONT} from '../theme';

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

const Row: React.FC<{readonly children: React.ReactNode; readonly gap?: number}> = ({children, gap = 40}) => (
  <div style={{display: 'flex', alignItems: 'center', gap}}>{children}</div>
);

const Big: React.FC<{readonly children: React.ReactNode; readonly color?: string; readonly size?: number}> = ({
  children,
  color = C.paper,
  size = 120,
}) => (
  <div
    style={{
      fontFamily: FONT.display,
      fontWeight: 700,
      fontSize: size,
      color,
      textAlign: 'center',
      lineHeight: 1.05,
      letterSpacing: '-0.03em',
      textShadow: `0 8px 0 ${C.ink}`,
      maxWidth: '82%',
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
        subtitle="Hey everyone — welcome."
        mood="night"
        confetti
        aState={{emotion: 'excited', pose: 'wave', energy: 0.5}}
        bState={{emotion: 'happy', pose: 'thumbsUp'}}
      />
    ),
  },
  {
    id: 's02-two-friends',
    script: 'This is a channel built by two friends from two different sides.',
    node: (
      <Duo
        caption="Two friends. Two different sides."
        a={{emotion: 'happy', pose: 'presenting', talking: true}}
        b={{emotion: 'confident', pose: 'crossed'}}
        mood="night"
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
        a={{emotion: 'happy', pose: 'presenting', talking: true}}
        b={{emotion: 'happy', pose: 'thumbsUp'}}
        mood="warm"
      />
    ),
  },
  {
    id: 's04-topics',
    script:
      'We’re going to talk about leverage trading, spot trading, blockchain, and all kinds of opportunities across the crypto space.',
    node: (
      <ListReveal
        heading="What we'll talk about"
        items={['Leverage trading', 'Spot trading', 'Blockchain', 'Opportunities across crypto']}
        who="A"
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
        caption={'"Buy here. Sell here."'}
        mood="chart"
        grid
        state={{emotion: 'worried', pose: 'facepalm'}}
        propSide="left"
        prop={
          <NoSign size={560} delay={16}>
            <Screen width={520} height={330} delay={4}>
              <CandleChart width={440} height={250} trend="chop" count={12} delay={8} seed="nope" />
            </Screen>
          </NoSign>
        }
      />
    ),
  },
  {
    id: 's06-bigger-than-charts',
    script: 'Because to us, crypto is so much bigger than charts.',
    node: (
      <Spotlight caption="Crypto is bigger than charts" mood="calm">
        <Row gap={64}>
          <BlockChain size={155} count={3} delay={6} />
          <Coin size={185} symbol="₿" delay={14} phase={0} />
          <Parachute size={175} delay={20} />
          <Rocket size={165} delay={26} />
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
        who="B"
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
        caption="Right in the middle of all of it"
        a={{emotion: 'excited', pose: 'armsUp', energy: 0.45}}
        b={{emotion: 'happy', pose: 'armsUp', energy: 0.45}}
        mood="calm"
        center={<Coin size={180} symbol="₿" delay={10} spin />}
      />
    ),
  },

  /* ------------------------------------------------------- SORUMLULUK */
  {
    id: 's09-one-thing-clear',
    script: 'But before we go any further, there’s one thing we want to make very clear from the beginning.',
    node: (
      <Duo
        caption="One thing, very clear"
        a={{emotion: 'confident', pose: 'point', talking: true}}
        b={{emotion: 'neutral', pose: 'crossed'}}
        mood="warm"
      />
    ),
  },
  {
    id: 's10-never-ask-money',
    script: 'We’re never going to ask you for money or anything else.',
    node: (
      <Spotlight caption="We will never ask you for money" mood="danger" grid={false}>
        <NoSign size={600} delay={10}>
          <MoneyBag size={480} delay={2} />
        </NoSign>
      </Spotlight>
    ),
  },
  {
    id: 's11-not-advice',
    script: 'We’re not here to give you financial advice.',
    node: (
      <Solo
        who="A"
        caption="This is not financial advice"
        mood="danger"
        state={{emotion: 'worried', pose: 'shrug', talking: true}}
        prop={<QuestionMarks size={130} count={3} delay={10} color={C.down} />}
      />
    ),
  },
  {
    id: 's12-instead',
    script:
      'Instead, we’re going to show you what we’re doing, why we’re doing it, and what we learn along the way.',
    node: (
      <ListReveal
        heading="Instead, we show you"
        items={['What we are doing', 'Why we are doing it', 'What we learn along the way']}
        who="A"
        perItem={11}
        state={{emotion: 'happy', pose: 'presenting', talking: true}}
      />
    ),
  },
  {
    id: 's13-decisions-yours',
    script: 'The decisions will always be yours.',
    node: (
      <Spotlight
        mood="calm"
        grid={false}
        a={{emotion: 'confident', pose: 'point'}}
        b={{emotion: 'confident', pose: 'point'}}
      >
        <Big size={128}>The decisions will always be yours.</Big>
      </Spotlight>
    ),
  },
  {
    id: 's14-share-journey',
    script: 'We’re simply going to share our journey, our experiences, and our own research with you.',
    node: (
      <Solo
        who="B"
        caption="Our journey. Our research."
        mood="calm"
        state={{emotion: 'happy', pose: 'presenting', talking: true}}
        prop={<Magnifier size={330} delay={10} />}
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
        caption="So… who are we?"
        a={{emotion: 'thinking', pose: 'shrug'}}
        b={{emotion: 'thinking', pose: 'shrug'}}
        mood="night"
        center={<QuestionMarks size={150} count={3} delay={12} />}
      />
    ),
  },
  {
    id: 's16-citizens',
    script: 'We’re citizens of the world. And we live all over the world.',
    node: (
      <Spotlight
        caption="Citizens of the world"
        mood="calm"
        grid={false}
        a={{emotion: 'happy', pose: 'wave'}}
        b={{emotion: 'happy', pose: 'wave'}}
      >
        <Globe size={460} delay={6} />
      </Spotlight>
    ),
  },
  {
    id: 's17-two-different',
    script:
      'We’re two different people. Two different personalities. Two different perspectives. And we’re interested in different parts of the crypto space.',
    node: (
      <Duo
        caption="Two people. Two perspectives."
        a={{emotion: 'confident', pose: 'crossed'}}
        b={{emotion: 'happy', pose: 'thumbsUp'}}
        mood="night"
        grid
      />
    ),
  },
  {
    id: 's18-idea-begins',
    script: 'That’s really where the whole idea behind TwoSide Boys begins.',
    node: (
      <TitleCard
        title="That's where it begins"
        mood="warm"
        characters
        aState={{emotion: 'happy', pose: 'presenting'}}
        bState={{emotion: 'confident', pose: 'point'}}
      />
    ),
  },
  {
    id: 's19-role-a',
    script:
      'One of us is going to be more active on the futures and spot trading side. We’ll share our trades, the strategies we use, how we look at the market, and everything we learn as we go.',
    node: (
      <Solo
        who="A"
        caption="Futures & spot trading"
        mood="chart"
        grid
        state={{emotion: 'confident', pose: 'point', talking: true}}
        propSide="left"
        prop={
          <Screen width={830} height={510} delay={6}>
            <CandleChart width={740} height={410} trend="up" count={16} delay={12} seed="roleA" />
          </Screen>
        }
      />
    ),
  },
  {
    id: 's20-role-b',
    script:
      'The other one is going to be more focused on chasing opportunities across the crypto space. Airdrops, new projects, blockchain ecosystems, on-chain research, and opportunities that most people haven’t noticed yet.',
    node: (
      <ListReveal
        heading="Chasing opportunities"
        items={['Airdrops', 'New projects', 'Blockchain ecosystems', 'On-chain research', 'What most people miss']}
        who="B"
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
        caption="Two different sides. One journey."
        leftLabel="ACTIVE TRADING"
        rightLabel="EXPLORING"
        leftItems={['Futures', 'Spot', 'Strategy']}
        rightItems={['Airdrops', 'On-chain', 'New projects']}
        a={{emotion: 'confident', pose: 'point'}}
        b={{emotion: 'happy', pose: 'presenting'}}
      />
    ),
  },
  /* --------------------------------------------------------- HİKÂYE */
  {
    id: 's22-story-behind',
    script: 'And this journey actually has a pretty interesting story behind it.',
    node: (
      <Duo
        caption="There's a story behind this"
        a={{emotion: 'thinking', pose: 'crossed'}}
        b={{emotion: 'neutral', pose: 'idle', talking: true}}
        mood="warm"
      />
    ),
  },
  {
    id: 's23-six-seven-figures',
    script:
      'There were times when we saw six and even seven-figure numbers in the financial markets, in dollar terms.',
    node: (
      <Spotlight
        caption="Six figures. Then seven."
        mood="gold"
        grid={false}
        a={{emotion: 'excited', pose: 'armsUp', energy: 0.4}}
        b={{emotion: 'excited', pose: 'thumbsUp', energy: 0.3}}
      >
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24}}>
          <Counter to={1000000} prefix="$" delay={8} duration={60} size={190} />
          <Row gap={44}>
            <MoneyBag size={190} delay={20} />
            <CandleChart width={620} height={290} trend="up" count={14} delay={14} seed="rich" showAxis={false} />
            <Rocket size={185} delay={28} />
          </Row>
        </div>
      </Spotlight>
    ),
  },
  {
    id: 's24-learned-too-late',
    script:
      'But we learned way too late that making money at a young age is very different from simply making money.',
    node: (
      <CloseUp
        who="A"
        emotion="worried"
        caption="We learned it way too late."
        mood="warm"
      />
    ),
  },
  {
    id: 's25-making-vs-protecting',
    script: 'Because making money is one thing. Protecting and managing that money is a completely different thing.',
    node: (
      <Spotlight caption="Making it ≠ keeping it" mood="calm">
        <Row gap={110}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
            <MoneyBag size={340} delay={6} />
            <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 48, color: C.gold}}>MAKING IT</div>
          </div>
          <div style={{fontFamily: FONT.display, fontSize: 112, color: C.paper, opacity: 0.6}}>≠</div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
            <Shield size={340} delay={18} />
            <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 48, color: C.up}}>KEEPING IT</div>
          </div>
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
        caption="We learned it the hard way"
        a={{emotion: 'sad', pose: 'handsDown'}}
        b={{emotion: 'worried', pose: 'shrug', talking: true}}
        mood="danger"
      />
    ),
  },
  {
    id: 's27-lost-everything',
    script: 'And eventually, we lost everything.',
    node: (
      <Spotlight
        caption="And then — we lost everything."
        mood="danger"
        a={{emotion: 'defeated', pose: 'handsDown'}}
        b={{emotion: 'defeated', pose: 'handsDown'}}
      >
        <CandleChart width={1240} height={470} trend="crash" count={20} delay={4} seed="crash" />
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
        caption="That period was not easy."
        mood="danger"
        side="right"
        talking={false}
      />
    ),
  },
  {
    id: 's29-valuable',
    script:
      'But looking back today, we think it became one of the most valuable experiences we have ever had.',
    node: (
      <CloseUp
        who="A"
        emotion="thinking"
        caption="Looking back — it was the most valuable thing that happened to us."
        mood="warm"
      />
    ),
  },
  {
    id: 's30-when-going-well',
    script:
      'Because when everything is going well, you don’t really understand the value of certain things. When you have money, you don’t always realize how big the risks really are. When you’re making money, you don’t realize how important it’s to stay disciplined.',
    node: (
      <ListReveal
        heading="When it's going well…"
        items={[
          'You miss the value of things',
          'You underestimate the risk',
          'You forget about discipline',
        ]}
        mood="calm"
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
        caption="Protecting it takes the same effort"
        mood="calm"
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
        caption="So we stopped and asked ourselves…"
        a={{emotion: 'thinking', pose: 'crossed'}}
        b={{emotion: 'thinking', pose: 'crossed'}}
        mood="night"
        center={<QuestionMarks size={160} count={3} delay={10} color={C.cyan} />}
      />
    ),
  },
  {
    id: 's33-the-questions',
    script:
      'What did we do wrong? Where did we take too much risk? Why couldn’t we maintain the same level of discipline when things were going well? And most importantly, what do we need to do to make sure we never end up in the same place again?',
    node: (
      <ListReveal
        heading="The questions"
        items={[
          'What did we do wrong?',
          'Where did we take too much risk?',
          'Why did discipline slip when things were good?',
          'How do we never end up here again?',
        ]}
        mood="night"
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
      <Spotlight caption="We started from zero." mood="chart">
        <Row gap={76}>
          <Counter to={0} delay={4} duration={2} size={290} color={C.paper} />
          <div style={{fontFamily: FONT.display, fontSize: 110, color: C.paper, opacity: 0.55}}>→</div>
          <CandleChart width={760} height={420} trend="recover" count={16} delay={16} seed="restart" />
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
        caption="Stronger foundations this time"
        mood="chart"
        grid
        state={{emotion: 'confident', pose: 'presenting', talking: true}}
        propSide="left"
        prop={<BlockChain size={150} count={4} delay={8} vertical />}
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
        caption="It's not about the money — it's about how this works"
        captionSize={54}
        mood="calm"
        state={{emotion: 'happy', pose: 'presenting', talking: true}}
        prop={<Magnifier size={390} delay={10} />}
      />
    ),
  },
  {
    id: 's37-questions-1',
    script:
      'What technology is actually behind a blockchain project? Why does a token gain or lose value? Does a project actually have a real product behind it, or is it just a good story?',
    node: (
      <ListReveal
        heading="For example…"
        items={[
          'What tech is actually behind a project?',
          'Why does a token gain or lose value?',
          'Real product — or just a good story?',
        ]}
        mood="calm"
        who="B"
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
        heading="…and these"
        items={[
          'What risk are we really taking?',
          'What does a wallet tell us on-chain?',
          'How do you spot a project early?',
          'Is that airdrop worth the time?',
        ]}
        mood="chart"
        who="A"
        perItem={15}
        state={{emotion: 'thinking', pose: 'presenting', talking: true}}
      />
    ),
  },
  {
    id: 's39-sometimes',
    script:
      'Sometimes, we’ll find the answers. Sometimes, we’ll not. Sometimes, we’ll discover something really valuable. And sometimes, we’ll spend hours researching something only to end up saying…',
    node: (
      <Duo
        caption="Sometimes we find it. Sometimes we don't."
        captionSize={54}
        a={{emotion: 'thinking', pose: 'presenting', talking: true}}
        b={{emotion: 'neutral', pose: 'crossed'}}
        mood="night"
        center={<Magnifier size={310} delay={10} />}
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
        a={{emotion: 'laughing', pose: 'facepalm'}}
        b={{emotion: 'defeated', pose: 'shrug', talking: true}}
        mood="warm"
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
        mood="warm"
        grid={false}
        a={{emotion: 'confident', pose: 'crossed'}}
        b={{emotion: 'happy', pose: 'thumbsUp'}}
      >
        <Big size={126}>No filters. This is a real journey.</Big>
      </Spotlight>
    ),
  },
  {
    id: 's42-win-lose',
    script:
      'When we win, we’ll say we won. When we lose, we’ll say we lost. And when we make a mistake, we’re not going to hide it.',
    node: (
      <ListReveal
        heading="No filters"
        items={['We win → we say we won', 'We lose → we say we lost', 'We mess up → we show it']}
        mood="night"
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
      <Spotlight caption="The internet only shows you the tip" mood="calm" grid={false}>
        <Iceberg
          width={810}
          topLabel="THE MILLIONS"
          bottomLabels={[
            'Hundreds of mistakes',
            'The money they lost',
            'The bad decisions',
            'The sleepless nights',
          ]}
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
        caption="We want to show that part too."
        a={{emotion: 'happy', pose: 'point', talking: true}}
        b={{emotion: 'confident', pose: 'thumbsUp'}}
        mood="calm"
      />
    ),
  },

  /* ---------------------------------------------------------- GELECEK */
  {
    id: 's45-looking-back',
    script:
      'Because maybe one of the most valuable things about this channel will be looking back years from now and seeing how much we have changed.',
    node: (
      <Spotlight caption="Years from now, we'll look back at this" mood="warm" grid={false}>
        <Row gap={58}>
          <Coin size={185} symbol="1" delay={6} phase={0} />
          <div style={{fontFamily: FONT.display, fontSize: 92, color: C.paper, opacity: 0.6}}>→</div>
          <Coin size={235} symbol="5" delay={14} phase={1} />
          <div style={{fontFamily: FONT.display, fontSize: 92, color: C.paper, opacity: 0.6}}>→</div>
          <Coin size={285} symbol="10" delay={22} phase={2} />
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
        caption="Today vs. one year from now"
        leftLabel="TODAY"
        rightLabel="IN A YEAR"
        leftItems={['How we read a trade', 'How we size risk']}
        rightItems={['???', 'We will find out']}
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
        caption="We'll find out together."
        a={{emotion: 'happy', pose: 'presenting'}}
        b={{emotion: 'happy', pose: 'presenting'}}
        mood="calm"
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
        a={{emotion: 'shocked', pose: 'shrug', talking: true}}
        b={{emotion: 'laughing', pose: 'facepalm'}}
        mood="warm"
      />
    ),
  },
  {
    id: 's49-maybe',
    script:
      'Maybe we’ll be in a completely different place. Maybe we’ll be creating content from different parts of the world. Maybe we’ll be working with completely different people. Maybe this community will grow into something huge, bringing people together from all around the world.',
    node: (
      <ListReveal
        heading="Maybe…"
        items={[
          'A completely different place',
          'Filming from other parts of the world',
          'Working with different people',
          'A community from everywhere',
        ]}
        mood="calm"
        who="B"
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
        captionSize={54}
        a={{emotion: 'happy', pose: 'shrug'}}
        b={{emotion: 'happy', pose: 'shrug'}}
        mood="night"
      />
    ),
  },
  {
    id: 's51-starting',
    script: 'Because for now, there’s only one thing we know for sure: we’re starting.',
    node: (
      <TitleCard
        title="WE'RE STARTING"
        mood="gold"
        confetti
        aState={{emotion: 'excited', pose: 'armsUp', energy: 0.6}}
        bState={{emotion: 'excited', pose: 'armsUp', energy: 0.6}}
      />
    ),
  },
  {
    id: 's52-with-us',
    script: 'And we want you to be there with us on this journey.',
    node: (
      <Duo
        caption="And we want you with us."
        a={{emotion: 'happy', pose: 'point', talking: true}}
        b={{emotion: 'happy', pose: 'point'}}
        mood="warm"
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
        heading="Coming very soon"
        items={[
          'Futures',
          'Spot trading',
          'Blockchain research',
          'New projects',
          'Airdrops',
          'On-chain analysis',
        ]}
        columns={2}
        mood="chart"
        who="A"
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
        caption="Free educational series"
        mood="gold"
        grid={false}
        a={{emotion: 'happy', pose: 'presenting', talking: true}}
        b={{emotion: 'excited', pose: 'thumbsUp'}}
      >
        <Big size={132} color={C.gold}>FREE — because you asked</Big>
      </Spotlight>
    ),
  },
  {
    id: 's55-ask-us',
    script:
      'If there’s something you don’t understand, drop it in the comments. If there’s something you’re curious about, ask us. If you want us to look into a project, let us know. If there’s a strategy you don’t understand, tell us.',
    node: (
      <Solo
        who="B"
        caption="Drop it in the comments"
        mood="night"
        state={{emotion: 'happy', pose: 'point', talking: true}}
        propSide="left"
        prop={
          <CommentStack
            width={780}
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
        caption="Your comment could be our next video."
        captionSize={54}
        a={{emotion: 'excited', pose: 'pointUp', talking: true}}
        b={{emotion: 'happy', pose: 'thumbsUp'}}
        mood="calm"
      />
    ),
  },
  {
    id: 's57-together',
    script:
      'Because we don’t want this to be a channel where it’s just us talking. We want to build the TwoSide Boys story together.',
    node: (
      <Duo
        caption="Let's build this together."
        a={{emotion: 'happy', pose: 'presenting', talking: true}}
        b={{emotion: 'happy', pose: 'presenting'}}
        mood="warm"
      />
    ),
  },
  {
    id: 's58-millions',
    script:
      'And who knows… Maybe years from now, millions of people will watch this very first video and say: wait, they actually said all this when they first started?',
    node: (
      <Spotlight
        caption="Maybe millions will watch this one day"
        mood="gold"
        grid={false}
        a={{emotion: 'shocked', pose: 'armsUp'}}
        b={{emotion: 'laughing', pose: 'shrug'}}
      >
        <Counter to={1000000} suffix=" views" delay={6} duration={70} size={170} />
      </Spotlight>
    ),
  },
  {
    id: 's59-starting-point',
    script:
      'So don’t think of this video as just a channel introduction. For us, this is a starting point. The first record of where we began.',
    node: (
      <Duo
        caption="This is the first record of where we began."
        captionSize={52}
        a={{emotion: 'confident', pose: 'crossed', talking: true}}
        b={{emotion: 'confident', pose: 'crossed'}}
        mood="night"
      />
    ),
  },
  {
    id: 's60-like-subscribe',
    script:
      'And by the way, don’t forget to like the video and subscribe to the channel. Because maybe by the time we hit one million subscribers, you’ll finally know who we’re.',
    node: (
      <Spotlight
        caption="Like & subscribe"
        mood="danger"
        grid={false}
        a={{emotion: 'excited', pose: 'pointUp', energy: 0.35}}
        b={{emotion: 'happy', pose: 'pointUp', energy: 0.35}}
      >
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
          <LikeSubscribe delay={6} scale={1.45} />
          <Counter to={1000000} suffix=" subs" delay={26} duration={60} size={112} color={C.paper} />
        </div>
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
        subtitle="Two friends. Two sides. Just getting started."
        mood="night"
        confetti
        aState={{emotion: 'happy', pose: 'wave', energy: 0.35}}
        bState={{emotion: 'confident', pose: 'thumbsUp'}}
      />
    ),
  },
] as const;
