import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Character} from '../characters/Character';
import {A, B} from '../characters/presets';
import type {Emotion, Pose} from '../characters/types';
import {easeIn, popIn, pulse, stagger} from '../lib/anim';
import type {CameraMove} from '../lib/camera';
import {SparkBurst, SpeechBubble} from '../props/Ui';
import {HudFrame} from '../props/SciFi';
import {C, FONT, textGlow} from '../theme';
import {Caption, Stage, type Mood} from './Stage';

type Who = 'A' | 'B';
const specOf = (who: Who) => (who === 'A' ? A : B);
const accentOf = (who: Who) => (who === 'A' ? C.cyan : C.amber);

export type CharState = {
  emotion?: Emotion;
  pose?: Pose;
  talking?: boolean;
  energy?: number;
};

const FLOOR = 1044;

/** Karakteri zemine oturtur ve sahneye yükselerek sokar. */
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
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 34}px)`,
      }}
    >
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

/** Fragman başlığı — harf aralığı açılarak yerleşen büyük tipografi. */
export const TitleCard: React.FC<{
  readonly title: string;
  readonly subtitle?: string;
  readonly kicker?: string;
  readonly mood?: Mood;
  readonly characters?: boolean;
  readonly burst?: boolean;
  readonly accent?: string;
  readonly move?: CameraMove;
  readonly aState?: CharState;
  readonly bState?: CharState;
}> = ({
  title,
  subtitle,
  kicker,
  mood = 'void',
  characters = true,
  burst = false,
  accent = C.cyan,
  move = 'pushIn',
  aState,
  bState,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = popIn({frame, fps, delay: 2});
  const s = easeIn({frame, delay: 18, duration: 22});
  const k = easeIn({frame, delay: 0, duration: 16});
  // Harf aralığı geniş başlar, yerine oturur — fragman jeneriği hissi
  const tracking = (1 - t) * 0.34 + 0.05;

  return (
    <Stage mood={mood} move={move} moveAmount={0.8}>
      {burst ? <SparkBurst delay={4} color={accent} /> : null}

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop: 128}}>
        {kicker ? (
          <div
            style={{
              fontFamily: FONT.mono,
              fontSize: 22,
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color: accent,
              opacity: k,
              marginBottom: 26,
              textShadow: textGlow(accent, 0.8),
            }}
          >
            {kicker}
          </div>
        ) : null}

        <div
          style={{
            fontFamily: FONT.display,
            fontWeight: 700,
            fontSize: 124,
            letterSpacing: `${tracking}em`,
            textTransform: 'uppercase',
            color: C.text,
            textAlign: 'center',
            lineHeight: 1.04,
            maxWidth: '90%',
            opacity: Math.min(1, t * 1.4),
            textShadow: `0 0 50px ${accent}55, 0 4px 40px rgba(0,0,0,0.9)`,
          }}
        >
          {title}
        </div>

        <div style={{width: 300 * t, height: 2, background: accent, marginTop: 30, boxShadow: `0 0 20px ${accent}`}} />

        {subtitle ? (
          <div
            style={{
              marginTop: 28,
              fontFamily: FONT.body,
              fontWeight: 500,
              fontSize: 40,
              letterSpacing: '0.06em',
              color: C.textDim,
              textAlign: 'center',
              maxWidth: '64%',
              opacity: s,
              transform: `translateY(${(1 - s) * 18}px)`,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </AbsoluteFill>

      {characters ? (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 1080 - FLOOR}}>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 130}}>
            <Standing who="A" height={566} state={aState ?? {emotion: 'confident', pose: 'presenting'}} delay={12} />
            <Standing who="B" height={566} state={bState ?? {emotion: 'confident', pose: 'crossed'}} delay={18} />
          </div>
        </AbsoluteFill>
      ) : null}
    </Stage>
  );
};

/** İki karakter — isteğe bağlı diyalog kutusu ve orta nesne. */
export const Duo: React.FC<{
  readonly caption?: string;
  readonly kicker?: string;
  readonly bubble?: string;
  readonly speaker?: Who;
  readonly mood?: Mood;
  readonly move?: CameraMove;
  readonly a?: CharState;
  readonly b?: CharState;
  readonly center?: React.ReactNode;
  readonly captionSize?: number;
}> = ({caption, kicker, bubble, speaker = 'A', mood = 'void', move = 'pushIn', a, b, center, captionSize = 52}) => {
  const frame = useCurrentFrame();
  const cap = easeIn({frame, delay: 4, duration: 16});

  return (
    <Stage mood={mood} move={move}>
      {caption ? (
        <Caption size={captionSize} opacity={cap} kicker={kicker} accent={C.cyan}>
          {caption}
        </Caption>
      ) : null}

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 1080 - FLOOR}}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: center ? 180 : 140}}>
          <div style={{position: 'relative'}}>
            {bubble && speaker === 'A' ? (
              <div style={{position: 'absolute', bottom: '86%', left: -40, width: 560}}>
                <SpeechBubble width={560} delay={12} tail="left" color={C.cyan} speaker="A" fontSize={36}>
                  {bubble}
                </SpeechBubble>
              </div>
            ) : null}
            <Standing who="A" height={684} state={a ?? {emotion: 'neutral', talking: speaker === 'A'}} delay={2} />
          </div>

          {center ? <div style={{paddingBottom: 70}}>{center}</div> : null}

          <div style={{position: 'relative'}}>
            {bubble && speaker === 'B' ? (
              <div style={{position: 'absolute', bottom: '86%', right: -40, width: 560}}>
                <SpeechBubble width={560} delay={12} tail="right" color={C.amber} speaker="B" fontSize={36}>
                  {bubble}
                </SpeechBubble>
              </div>
            ) : null}
            <Standing who="B" height={684} state={b ?? {emotion: 'neutral', talking: speaker === 'B'}} delay={6} />
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
  readonly kicker?: string;
  readonly mood?: Mood;
  readonly move?: CameraMove;
  readonly state?: CharState;
  readonly prop?: React.ReactNode;
  readonly propSide?: 'left' | 'right';
  readonly captionSize?: number;
}> = ({who, caption, kicker, mood = 'void', move = 'pushIn', state, prop, propSide = 'right', captionSize = 54}) => {
  const frame = useCurrentFrame();
  const cap = easeIn({frame, delay: 4, duration: 16});
  const character = <Standing who={who} height={744} state={state ?? {talking: true}} delay={2} />;

  return (
    <Stage mood={mood} move={move}>
      {caption ? (
        <Caption size={captionSize} opacity={cap} kicker={kicker} accent={accentOf(who)}>
          {caption}
        </Caption>
      ) : null}

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 1080 - FLOOR}}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 150}}>
          {propSide === 'left' ? <div style={{paddingBottom: 46}}>{prop}</div> : null}
          {character}
          {propSide === 'right' ? <div style={{paddingBottom: 46}}>{prop}</div> : null}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/** Sıralı liste — HUD numaralandırmalı satırlar. */
export const ListReveal: React.FC<{
  readonly heading: string;
  readonly kicker?: string;
  readonly items: readonly string[];
  readonly mood?: Mood;
  readonly move?: CameraMove;
  readonly who?: Who;
  readonly state?: CharState;
  readonly columns?: 1 | 2;
  readonly perItem?: number;
}> = ({heading, kicker, items, mood = 'data', move = 'driftLeft', who = 'B', state, columns = 1, perItem = 9}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const h = popIn({frame, fps, delay: 2});
  const accent = accentOf(who);

  return (
    <Stage mood={mood} move={move}>
      <AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', padding: '0 196px'}}>
        <div style={{flex: 1}}>
          {kicker ? (
            <div
              style={{
                fontFamily: FONT.mono,
                fontSize: 19,
                letterSpacing: '0.42em',
                textTransform: 'uppercase',
                color: accent,
                marginBottom: 16,
                opacity: h,
                textShadow: textGlow(accent, 0.7),
              }}
            >
              {kicker}
            </div>
          ) : null}

          <div
            style={{
              fontFamily: FONT.display,
              fontWeight: 700,
              fontSize: 66,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              color: C.text,
              marginBottom: 14,
              opacity: h,
              transform: `translateX(${(1 - h) * -26}px)`,
            }}
          >
            {heading}
          </div>
          <div style={{width: 220 * h, height: 2, background: accent, marginBottom: 38, boxShadow: `0 0 16px ${accent}`}} />

          <div style={{display: 'grid', gridTemplateColumns: columns === 2 ? '1fr 1fr' : '1fr', gap: '18px 52px'}}>
            {items.map((item, i) => {
              const p = easeIn({frame, delay: 16 + stagger(i, perItem), duration: 14});
              return (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 18,
                    opacity: p,
                    transform: `translateX(${(1 - p) * -28}px)`,
                  }}
                >
                  <span style={{fontFamily: FONT.mono, fontSize: 20, color: accent, opacity: 0.75}}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 40, color: C.text, letterSpacing: '0.01em'}}>
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{display: 'flex', alignItems: 'flex-end', height: '100%', paddingBottom: 96}}>
          <Standing who={who} height={648} state={state ?? {emotion: 'confident', pose: 'presenting', talking: true}} delay={8} />
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/** Ortada tek büyük öğe; isteğe bağlı olarak karakterler kenarlarda. */
export const Spotlight: React.FC<{
  readonly caption?: string;
  readonly kicker?: string;
  readonly mood?: Mood;
  readonly move?: CameraMove;
  readonly children: React.ReactNode;
  readonly captionSize?: number;
  readonly footer?: string;
  readonly accent?: string;
  readonly grid?: boolean;
  readonly a?: CharState;
  readonly b?: CharState;
}> = ({
  caption,
  kicker,
  mood = 'data',
  move = 'pushIn',
  children,
  captionSize = 56,
  footer,
  accent = C.cyan,
  grid = true,
  a,
  b,
}) => {
  const frame = useCurrentFrame();
  const cap = easeIn({frame, delay: 3, duration: 16});
  const foot = easeIn({frame, delay: 26, duration: 16});
  const hasChars = Boolean(a || b);

  return (
    <Stage mood={mood} move={move} grid={grid}>
      {caption ? (
        <Caption size={captionSize} opacity={cap} kicker={kicker} accent={accent}>
          {caption}
        </Caption>
      ) : null}

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: hasChars ? 170 : 0,
          paddingTop: caption ? 96 : 0,
        }}
      >
        {children}
      </AbsoluteFill>

      {hasChars ? (
        <AbsoluteFill style={{justifyContent: 'flex-end', paddingBottom: 1080 - FLOOR}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 200px'}}>
            <div>{a ? <Standing who="A" height={468} state={a} delay={10} /> : null}</div>
            <div>{b ? <Standing who="B" height={468} state={b} delay={14} /> : null}</div>
          </div>
        </AbsoluteFill>
      ) : null}

      {footer ? (
        <Caption size={30} align="bottom" color={C.textDim} accent={accent} opacity={foot}>
          {footer}
        </Caption>
      ) : null}
    </Stage>
  );
};

/** İki alanı karşılaştıran bölünmüş kadraj. */
export const Split: React.FC<{
  readonly leftLabel: string;
  readonly rightLabel: string;
  readonly leftItems?: readonly string[];
  readonly rightItems?: readonly string[];
  readonly caption?: string;
  readonly kicker?: string;
  readonly a?: CharState;
  readonly b?: CharState;
  readonly move?: CameraMove;
}> = ({leftLabel, rightLabel, leftItems = [], rightItems = [], caption, kicker, a, b, move = 'pullOut'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cap = easeIn({frame, delay: 3, duration: 14});
  const divider = easeIn({frame, delay: 8, duration: 20});
  const shimmer = 0.5 + (pulse(frame, fps, 0.4) + 1) * 0.25;

  const Side: React.FC<{
    readonly who: Who;
    readonly label: string;
    readonly items: readonly string[];
    readonly delay: number;
    readonly state?: CharState;
  }> = ({who, label, items, delay, state}) => {
    const p = popIn({frame, fps, delay});
    const accent = accentOf(who);
    return (
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 40}}>
        <div
          style={{
            fontFamily: FONT.display,
            fontWeight: 700,
            fontSize: 46,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: accent,
            marginBottom: 10,
            opacity: p,
            textShadow: textGlow(accent, 0.9),
          }}
        >
          {label}
        </div>
        <div style={{width: 130 * p, height: 1.6, background: accent, marginBottom: 20, opacity: 0.8}} />
        <div style={{minHeight: 132, marginBottom: 12}}>
          {items.map((item, i) => {
            const ip = easeIn({frame, delay: delay + 14 + stagger(i, 7), duration: 14});
            return (
              <div
                key={item}
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 27,
                  letterSpacing: '0.08em',
                  color: C.textDim,
                  textAlign: 'center',
                  opacity: ip,
                  transform: `translateY(${(1 - ip) * 12}px)`,
                  marginBottom: 6,
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
        <Standing who={who} height={540} state={state} delay={delay + 4} />
      </div>
    );
  };

  return (
    <Stage mood="deep" move={move} moveAmount={0.7}>
      {caption ? (
        <Caption size={50} opacity={cap} kicker={kicker} accent={C.violet}>
          {caption}
        </Caption>
      ) : null}

      <AbsoluteFill style={{flexDirection: 'row', alignItems: 'stretch', paddingTop: 206}}>
        <Side who="A" label={leftLabel} items={leftItems} delay={4} state={a ?? {emotion: 'confident', pose: 'presenting'}} />

        {/* Ayırıcı ışık sütunu */}
        <div style={{width: 2, position: 'relative', alignSelf: 'stretch'}}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to bottom, transparent, ${C.violet}, transparent)`,
              opacity: divider * shimmer,
              boxShadow: `0 0 24px ${C.violet}`,
              transform: `scaleY(${divider})`,
            }}
          />
        </div>

        <Side who="B" label={rightLabel} items={rightItems} delay={10} state={b ?? {emotion: 'confident', pose: 'crossed'}} />
      </AbsoluteFill>
    </Stage>
  );
};

/** Duygusal anlar için yakın plan — yanında HUD çerçeveli metin. */
export const CloseUp: React.FC<{
  readonly who: Who;
  readonly caption: string;
  readonly kicker?: string;
  readonly emotion?: Emotion;
  readonly mood?: Mood;
  readonly talking?: boolean;
  readonly side?: 'left' | 'right';
  readonly move?: CameraMove;
}> = ({who, caption, kicker, emotion = 'sad', mood = 'deep', talking = true, side = 'left', move = 'pushIn'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = popIn({frame, fps, delay: 0});
  const cap = easeIn({frame, delay: 12, duration: 20});
  const drift = pulse(frame, fps, 0.12) * 8;
  const accent = accentOf(who);

  return (
    <Stage mood={mood} move={move} moveAmount={0.6} grid={false}>
      <AbsoluteFill
        style={{
          flexDirection: side === 'left' ? 'row' : 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 96,
          padding: '0 190px',
        }}
      >
        <div style={{transform: `scale(${p}) translateY(${drift}px)`, flexShrink: 0, position: 'relative'}}>
          <Character spec={specOf(who)} height={600} emotion={emotion} crop="head" talking={talking} rim={1.3} />
          <div style={{position: 'absolute', inset: -26, pointerEvents: 'none'}}>
            <HudFrame width={600 + 52} height={600 + 52} color={accent} delay={6} label={who === 'A' ? 'SUBJECT A' : 'SUBJECT B'} />
          </div>
        </div>

        <div style={{maxWidth: 760, opacity: cap, transform: `translateY(${(1 - cap) * 20}px)`}}>
          {kicker ? (
            <div
              style={{
                fontFamily: FONT.mono,
                fontSize: 19,
                letterSpacing: '0.42em',
                textTransform: 'uppercase',
                color: accent,
                marginBottom: 20,
                textShadow: textGlow(accent, 0.7),
              }}
            >
              {kicker}
            </div>
          ) : null}
          <div
            style={{
              fontFamily: FONT.display,
              fontWeight: 600,
              fontSize: 60,
              lineHeight: 1.22,
              letterSpacing: '0.01em',
              color: C.text,
              textShadow: '0 4px 40px rgba(0,0,0,0.9)',
            }}
          >
            {caption}
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
