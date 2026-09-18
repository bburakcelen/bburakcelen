import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Character} from '../characters/Character';
import {A, B} from '../characters/presets';
import type {Emotion, Pose} from '../characters/types';
import {easeIn, popIn, pulse, stagger} from '../lib/anim';
import {Confetti, SpeechBubble} from '../props/Ui';
import {C, FONT} from '../theme';
import {Caption, Stage, type Mood} from './Stage';

type Who = 'A' | 'B';
const specOf = (who: Who) => (who === 'A' ? A : B);

type CharState = {
  emotion?: Emotion;
  pose?: Pose;
  talking?: boolean;
  energy?: number;
};

const FLOOR = 1036;

/** Karakteri zemine oturtan sarmalayıcı. */
const Standing: React.FC<{
  readonly who: Who;
  readonly height: number;
  readonly state?: CharState;
  readonly delay?: number;
}> = ({who, height, state, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay});

  return (
    <div style={{display: 'flex', alignItems: 'flex-end', transform: `scale(${p})`, transformOrigin: 'bottom center'}}>
      <Character
        spec={specOf(who)}
        height={height}
        emotion={state?.emotion ?? 'neutral'}
        pose={state?.pose ?? 'idle'}
        talking={state?.talking}
        energy={state?.energy}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */

/** Büyük başlık kartı — açılış ve kapanış için. */
export const TitleCard: React.FC<{
  readonly title: string;
  readonly subtitle?: string;
  readonly mood?: Mood;
  readonly characters?: boolean;
  readonly confetti?: boolean;
  readonly aState?: CharState;
  readonly bState?: CharState;
}> = ({title, subtitle, mood = 'night', characters = true, confetti = false, aState, bState}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = popIn({frame, fps, delay: 2});
  const s = easeIn({frame, delay: 14, duration: 20});

  return (
    <Stage mood={mood}>
      {confetti ? <Confetti delay={6} /> : null}

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop: 96}}>
        <div
          style={{
            fontFamily: FONT.display,
            fontWeight: 700,
            fontSize: 138,
            letterSpacing: '-0.035em',
            color: C.paper,
            textAlign: 'center',
            lineHeight: 1.02,
            textShadow: `0 8px 0 ${C.ink}`,
            transform: `scale(${t})`,
            maxWidth: '86%',
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              marginTop: 26,
              fontFamily: FONT.body,
              fontWeight: 700,
              fontSize: 46,
              color: C.muted,
              textAlign: 'center',
              maxWidth: '68%',
              opacity: s,
              transform: `translateY(${(1 - s) * 22}px)`,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </AbsoluteFill>

      {characters ? (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 1080 - FLOOR}}>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 90}}>
            <Standing who="A" height={586} state={aState ?? {emotion: 'happy', pose: 'wave'}} delay={10} />
            <Standing who="B" height={586} state={bState ?? {emotion: 'confident', pose: 'thumbsUp'}} delay={16} />
          </div>
        </AbsoluteFill>
      ) : null}
    </Stage>
  );
};

/** İki karakter yan yana; isteğe bağlı konuşma balonu ve orta nesne. */
export const Duo: React.FC<{
  readonly caption?: string;
  readonly bubble?: string;
  readonly speaker?: Who;
  readonly mood?: Mood;
  readonly grid?: boolean;
  readonly a?: CharState;
  readonly b?: CharState;
  readonly center?: React.ReactNode;
  readonly captionSize?: number;
}> = ({caption, bubble, speaker = 'A', mood = 'night', grid, a, b, center, captionSize = 60}) => {
  const frame = useCurrentFrame();

  const cap = easeIn({frame, delay: 4, duration: 16});

  return (
    <Stage mood={mood} grid={grid}>
      {caption ? <Caption size={captionSize} opacity={cap}>{caption}</Caption> : null}

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 1080 - FLOOR}}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: center ? 150 : 110}}>
          <div style={{position: 'relative'}}>
            {bubble && speaker === 'A' ? (
              <div style={{position: 'absolute', bottom: '84%', left: 40, width: 520}}>
                <SpeechBubble width={520} delay={12} tail="left">
                  {bubble}
                </SpeechBubble>
              </div>
            ) : null}
            <Standing who="A" height={664} state={a ?? {emotion: 'neutral', talking: speaker === 'A'}} delay={2} />
          </div>

          {center ? <div style={{paddingBottom: 60}}>{center}</div> : null}

          <div style={{position: 'relative'}}>
            {bubble && speaker === 'B' ? (
              <div style={{position: 'absolute', bottom: '84%', right: 40, width: 520}}>
                <SpeechBubble width={520} delay={12} tail="right">
                  {bubble}
                </SpeechBubble>
              </div>
            ) : null}
            <Standing who="B" height={664} state={b ?? {emotion: 'neutral', talking: speaker === 'B'}} delay={6} />
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/** Tek karakter + yanında bir nesne. */
export const Solo: React.FC<{
  readonly who: Who;
  readonly caption?: string;
  readonly mood?: Mood;
  readonly grid?: boolean;
  readonly state?: CharState;
  readonly prop?: React.ReactNode;
  readonly propSide?: 'left' | 'right';
  readonly captionSize?: number;
}> = ({who, caption, mood = 'night', grid, state, prop, propSide = 'right', captionSize = 62}) => {
  const frame = useCurrentFrame();
  const cap = easeIn({frame, delay: 4, duration: 16});

  const character = <Standing who={who} height={700} state={state ?? {talking: true}} delay={2} />;

  return (
    <Stage mood={mood} grid={grid}>
      {caption ? <Caption size={captionSize} opacity={cap}>{caption}</Caption> : null}

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 1080 - FLOOR}}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 130}}>
          {propSide === 'left' ? <div style={{paddingBottom: 40}}>{prop}</div> : null}
          {character}
          {propSide === 'right' ? <div style={{paddingBottom: 40}}>{prop}</div> : null}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/** Sırayla beliren madde listesi — konu başlıkları için. */
export const ListReveal: React.FC<{
  readonly heading: string;
  readonly items: readonly string[];
  readonly mood?: Mood;
  readonly who?: Who;
  readonly state?: CharState;
  readonly columns?: 1 | 2;
  readonly perItem?: number;
}> = ({heading, items, mood = 'chart', who = 'B', state, columns = 1, perItem = 9}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const h = popIn({frame, fps, delay: 2});

  return (
    <Stage mood={mood} grid>
      <AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', padding: '0 110px'}}>
        <div style={{flex: 1}}>
          <div
            style={{
              fontFamily: FONT.display,
              fontWeight: 700,
              fontSize: 74,
              color: C.paper,
              marginBottom: 40,
              transform: `scale(${h})`,
              transformOrigin: 'left center',
              textShadow: `0 6px 0 ${C.ink}`,
            }}
          >
            {heading}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: columns === 2 ? '1fr 1fr' : '1fr',
              gap: '20px 40px',
            }}
          >
            {items.map((item, i) => {
              const p = popIn({frame, fps, delay: 14 + stagger(i, perItem)});
              return (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    opacity: Math.min(1, p * 1.5),
                    transform: `translateX(${(1 - p) * -40}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      background: [C.up, C.gold, C.cyan, C.purple, C.down][i % 5],
                      border: `4px solid ${C.ink}`,
                      flexShrink: 0,
                      transform: 'rotate(45deg)',
                    }}
                  />
                  <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 44, color: C.paper}}>{item}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{display: 'flex', alignItems: 'flex-end', height: '100%', paddingBottom: 60}}>
          <Standing who={who} height={620} state={state ?? {emotion: 'happy', pose: 'presenting', talking: true}} delay={8} />
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/** Ortada büyük bir nesne, üstünde başlık. */
export const Spotlight: React.FC<{
  readonly caption?: string;
  readonly mood?: Mood;
  readonly grid?: boolean;
  readonly children: React.ReactNode;
  readonly captionSize?: number;
  readonly footer?: string;
  /** Verilirse karakterler alt köşelere yerleşir ve içerik yukarı kayar. */
  readonly a?: CharState;
  readonly b?: CharState;
}> = ({caption, mood = 'chart', grid = true, children, captionSize = 66, footer, a, b}) => {
  const frame = useCurrentFrame();
  const cap = easeIn({frame, delay: 3, duration: 16});
  const foot = easeIn({frame, delay: 24, duration: 16});
  const hasChars = Boolean(a || b);

  return (
    <Stage mood={mood} grid={grid} ground={hasChars}>
      {caption ? <Caption size={captionSize} opacity={cap}>{caption}</Caption> : null}

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: hasChars ? 210 : 0,
          paddingTop: caption ? 90 : 0,
        }}
      >
        {children}
      </AbsoluteFill>

      {hasChars ? (
        <AbsoluteFill style={{justifyContent: 'flex-end', paddingBottom: 1080 - FLOOR}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 130px'}}>
            <div>{a ? <Standing who="A" height={488} state={a} delay={10} /> : null}</div>
            <div>{b ? <Standing who="B" height={488} state={b} delay={14} /> : null}</div>
          </div>
        </AbsoluteFill>
      ) : null}

      {footer ? (
        <Caption size={42} align="bottom" color={C.muted} opacity={foot}>
          {footer}
        </Caption>
      ) : null}
    </Stage>
  );
};

/** Ekranı ikiye bölüp iki karakterin alanını karşılaştırır. */
export const Split: React.FC<{
  readonly leftLabel: string;
  readonly rightLabel: string;
  readonly leftItems?: readonly string[];
  readonly rightItems?: readonly string[];
  readonly caption?: string;
  readonly a?: CharState;
  readonly b?: CharState;
}> = ({leftLabel, rightLabel, leftItems = [], rightItems = [], caption, a, b}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cap = easeIn({frame, delay: 3, duration: 14});
  const divider = popIn({frame, fps, delay: 8});

  const Side: React.FC<{
    readonly who: Who;
    readonly label: string;
    readonly items: readonly string[];
    readonly delay: number;
    readonly accent: string;
    readonly state?: CharState;
  }> = ({who, label, items, delay, accent, state}) => {
    const p = popIn({frame, fps, delay});
    return (
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 30}}>
        <div
          style={{
            fontFamily: FONT.display,
            fontWeight: 700,
            fontSize: 56,
            color: accent,
            marginBottom: 14,
            transform: `scale(${p})`,
            textShadow: `0 5px 0 ${C.ink}`,
          }}
        >
          {label}
        </div>
        <div style={{minHeight: 120, marginBottom: 10}}>
          {items.map((item, i) => {
            const ip = easeIn({frame, delay: delay + 12 + stagger(i, 7), duration: 14});
            return (
              <div
                key={item}
                style={{
                  fontFamily: FONT.body,
                  fontWeight: 700,
                  fontSize: 34,
                  color: C.paper,
                  textAlign: 'center',
                  opacity: ip,
                  transform: `translateY(${(1 - ip) * 14}px)`,
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
        <Standing who={who} height={560} state={state} delay={delay + 4} />
      </div>
    );
  };

  return (
    <Stage mood="calm" grid>
      {caption ? <Caption size={58} opacity={cap}>{caption}</Caption> : null}

      <AbsoluteFill style={{flexDirection: 'row', alignItems: 'stretch', paddingTop: 168}}>
        <Side who="A" label={leftLabel} items={leftItems} delay={4} accent={C.aShirt} state={a ?? {emotion: 'confident', pose: 'point'}} />
        <div style={{width: 6, background: C.ink, opacity: 0.6, transform: `scaleY(${divider})`, borderRadius: 4}} />
        <Side who="B" label={rightLabel} items={rightItems} delay={10} accent={C.bShirt} state={b ?? {emotion: 'happy', pose: 'presenting'}} />
      </AbsoluteFill>
    </Stage>
  );
};

/** Duygusal anlar için yakın plan. */
export const CloseUp: React.FC<{
  readonly who: Who;
  readonly caption: string;
  readonly emotion?: Emotion;
  readonly mood?: Mood;
  readonly talking?: boolean;
  readonly side?: 'left' | 'right';
}> = ({who, caption, emotion = 'sad', mood = 'warm', talking = true, side = 'left'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay: 0});
  const cap = easeIn({frame, delay: 10, duration: 18});
  const drift = pulse(frame, fps, 0.14) * 10;

  return (
    <Stage mood={mood} ground={false}>
      <AbsoluteFill
        style={{
          flexDirection: side === 'left' ? 'row' : 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 90,
          padding: '0 120px',
        }}
      >
        <div style={{transform: `scale(${p}) translateY(${drift}px)`, flexShrink: 0}}>
          <Character spec={specOf(who)} height={620} emotion={emotion} crop="head" talking={talking} />
        </div>
        <div
          style={{
            fontFamily: FONT.display,
            fontWeight: 700,
            fontSize: 70,
            lineHeight: 1.16,
            color: C.paper,
            maxWidth: 780,
            opacity: cap,
            transform: `translateY(${(1 - cap) * 24}px)`,
            textShadow: `0 6px 0 ${C.ink}`,
          }}
        >
          {caption}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
