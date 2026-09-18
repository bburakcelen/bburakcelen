import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {C, STROKE} from '../../theme';
import type {CharacterSpec, Emotion} from '../types';

type MouthShape =
  | 'smile'
  | 'bigSmile'
  | 'flat'
  | 'frown'
  | 'smirk'
  | 'wavy'
  | 'o'
  | 'grit';

type FaceSpec = {
  browY: number;
  /** + değer: kaşın iç ucu yukarı (üzgün/endişeli). − değer: iç uç aşağı (kararlı/öfkeli). */
  browTilt: number;
  eyeOpen: number;
  eyeWide: number;
  mouth: MouthShape;
  pupilX: number;
  pupilY: number;
};

const FACES: Record<Emotion, FaceSpec> = {
  neutral: {browY: 0, browTilt: 0, eyeOpen: 1, eyeWide: 1, mouth: 'smile', pupilX: 0, pupilY: 0},
  happy: {browY: -3, browTilt: 4, eyeOpen: 0.86, eyeWide: 1, mouth: 'bigSmile', pupilX: 0, pupilY: 1},
  excited: {browY: -9, browTilt: 6, eyeOpen: 1.22, eyeWide: 1.08, mouth: 'bigSmile', pupilX: 0, pupilY: -1},
  laughing: {browY: -5, browTilt: 7, eyeOpen: 0.18, eyeWide: 1.05, mouth: 'bigSmile', pupilX: 0, pupilY: 0},
  confident: {browY: 1, browTilt: -7, eyeOpen: 0.82, eyeWide: 1, mouth: 'smirk', pupilX: 2, pupilY: 0},
  thinking: {browY: -2, browTilt: -4, eyeOpen: 0.9, eyeWide: 1, mouth: 'wavy', pupilX: 6, pupilY: -6},
  worried: {browY: -5, browTilt: 13, eyeOpen: 1.06, eyeWide: 1, mouth: 'wavy', pupilX: 0, pupilY: 2},
  sad: {browY: -1, browTilt: 16, eyeOpen: 0.78, eyeWide: 1, mouth: 'frown', pupilX: 0, pupilY: 4},
  shocked: {browY: -14, browTilt: 8, eyeOpen: 1.4, eyeWide: 1.14, mouth: 'o', pupilX: 0, pupilY: 0},
  defeated: {browY: 2, browTilt: 15, eyeOpen: 0.3, eyeWide: 1, mouth: 'flat', pupilX: 0, pupilY: 3},
};

/** Deterministik göz kırpma: her karakterin kendi ritmi var, render tekrarlanabilir. */
const useBlink = (seed: string) => {
  const frame = useCurrentFrame();
  const CYCLE = 84;
  const offset = Math.floor(random(`blink-${seed}`) * CYCLE);
  const t = (frame + offset) % CYCLE;
  if (t >= 6) return 1;
  return Math.min(1, Math.abs(t - 3) / 3);
};

/**
 * Konuşurken ağzın açılma miktarı — jenerik bir gevezelik ritmi.
 * Olumsuz duygularda ağız çok daha az açılır: yoksa üzgün bir yüzde
 * kocaman açık ağız "bağırıyor / seviniyor" gibi okunuyor.
 */
const SUBDUED: ReadonlySet<Emotion> = new Set(['sad', 'worried', 'defeated', 'thinking']);

const useTalk = (seed: string, talking: boolean, emotion: Emotion) => {
  const frame = useCurrentFrame();
  if (!talking) return 0;
  const tick = Math.floor(frame / 3);
  const raw = 0.28 + 0.72 * random(`talk-${seed}-${tick}`);
  return SUBDUED.has(emotion) ? raw * 0.4 : raw;
};

const mouthPath = (shape: MouthShape): {d: string; filled: boolean} => {
  switch (shape) {
    case 'smile':
      return {d: 'M -26 -2 Q 0 22 26 -2', filled: false};
    case 'bigSmile':
      return {d: 'M -32 -4 Q 0 -12 32 -4 Q 28 34 0 36 Q -28 34 -32 -4 Z', filled: true};
    case 'flat':
      return {d: 'M -22 4 L 22 4', filled: false};
    case 'frown':
      return {d: 'M -24 12 Q 0 -12 24 12', filled: false};
    case 'smirk':
      return {d: 'M -24 6 Q 6 20 28 -6', filled: false};
    case 'wavy':
      return {d: 'M -26 4 Q -13 -8 0 3 Q 13 14 26 0', filled: false};
    case 'o':
      return {d: 'M 0 -14 Q 18 -14 18 6 Q 18 26 0 26 Q -18 26 -18 6 Q -18 -14 0 -14 Z', filled: true};
    case 'grit':
      return {d: 'M -26 -8 L 26 -8 L 26 14 L -26 14 Z', filled: true};
  }
};

export const Face: React.FC<{
  readonly spec: CharacterSpec;
  readonly emotion: Emotion;
  readonly talking: boolean;
  readonly cx: number;
  readonly cy: number;
}> = ({spec, emotion, talking, cx, cy}) => {
  const f = FACES[emotion];
  const blink = useBlink(spec.id);
  const talk = useTalk(spec.id, talking, emotion);
  const subdued = SUBDUED.has(emotion);

  const eyeDx = spec.headRx * 0.38;
  const eyeY = cy - 6;
  const browBaseY = eyeY - 34 + f.browY;
  const mouthY = cy + spec.headRy * 0.46;

  const openness = f.eyeOpen * blink;
  const mouth = mouthPath(f.mouth);

  return (
    <g>
      {/* Gözler */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${cx + side * eyeDx}, ${eyeY})`}>
          {openness < 0.14 ? (
            // Neredeyse kapalı: tek bir kavisli çizgi çok daha okunaklı
            <path
              d="M -17 0 Q 0 8 17 0"
              fill="none"
              stroke={C.ink}
              strokeWidth={STROKE.normal}
              strokeLinecap="round"
            />
          ) : (
            <g transform={`scale(${f.eyeWide}, ${openness})`}>
              <ellipse rx={18} ry={20} fill={C.white} stroke={C.ink} strokeWidth={STROKE.thin} />
              <circle cx={f.pupilX} cy={f.pupilY} r={10.5} fill={spec.eye} />
              <circle cx={f.pupilX} cy={f.pupilY} r={5.5} fill={C.ink} />
              <circle cx={f.pupilX - 4.5} cy={f.pupilY - 5.5} r={3.6} fill={C.white} />
            </g>
          )}
        </g>
      ))}

      {/* Kaşlar */}
      {[-1, 1].map((side) => (
        <g
          key={side}
          transform={`translate(${cx + side * eyeDx}, ${browBaseY}) rotate(${side * f.browTilt})`}
        >
          <path
            d="M -19 0 Q 0 -7 19 -1"
            fill="none"
            stroke={C.ink}
            strokeWidth={STROKE.thick}
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* Burun */}
      <path
        d={`M ${cx - 1} ${cy + 16} q -9 12 4 13`}
        fill="none"
        stroke={C.ink}
        strokeWidth={STROKE.thin}
        strokeLinecap="round"
        opacity={0.75}
      />

      {/* Ağız — konuşurken açık ağız şekline geçer */}
      <g transform={`translate(${cx}, ${mouthY})`}>
        {talk > 0.05 ? (
          <g transform={`scale(${subdued ? 0.8 : 1}, ${0.35 + talk * 0.9})`}>
            <path
              d={
                subdued
                  ? 'M -24 2 Q 0 14 24 2 Q 22 24 0 26 Q -22 24 -24 2 Z'
                  : 'M -26 -6 Q 0 -14 26 -6 Q 24 26 0 28 Q -24 26 -26 -6 Z'
              }
              fill={C.ink}
              stroke={C.ink}
              strokeWidth={STROKE.thin}
              strokeLinejoin="round"
            />
            {subdued ? null : <path d="M -16 16 Q 0 26 16 16 Q 0 24 -16 16 Z" fill="#E8657A" />}
          </g>
        ) : (
          <path
            d={mouth.d}
            fill={mouth.filled ? C.ink : 'none'}
            stroke={C.ink}
            strokeWidth={mouth.filled ? STROKE.thin : STROKE.normal}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </g>
    </g>
  );
};
