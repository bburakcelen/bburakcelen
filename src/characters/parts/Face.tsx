import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {C} from '../../theme';
import type {CharacterSpec, Emotion} from '../types';

type MouthShape = 'line' | 'smile' | 'grin' | 'frown' | 'smirk' | 'wavy' | 'open' | 'tight';

type FaceSpec = {
  browY: number;
  /** + : kaşın iç ucu yukarı (üzgün). − : iç uç aşağı (kararlı/öfkeli). */
  browTilt: number;
  eyeOpen: number;
  eyeWide: number;
  mouth: MouthShape;
  pupilX: number;
  pupilY: number;
};

const FACES: Record<Emotion, FaceSpec> = {
  neutral: {browY: 0, browTilt: 0, eyeOpen: 1, eyeWide: 1, mouth: 'line', pupilX: 0, pupilY: 0},
  happy: {browY: -2, browTilt: 3, eyeOpen: 0.88, eyeWide: 1, mouth: 'smile', pupilX: 0, pupilY: 0.4},
  excited: {browY: -6, browTilt: 5, eyeOpen: 1.18, eyeWide: 1.05, mouth: 'grin', pupilX: 0, pupilY: -0.4},
  laughing: {browY: -3, browTilt: 6, eyeOpen: 0.16, eyeWide: 1.04, mouth: 'grin', pupilX: 0, pupilY: 0},
  confident: {browY: 1, browTilt: -8, eyeOpen: 0.82, eyeWide: 1, mouth: 'smirk', pupilX: 1, pupilY: 0},
  thinking: {browY: -1, browTilt: -5, eyeOpen: 0.9, eyeWide: 1, mouth: 'wavy', pupilX: 2.6, pupilY: -2.4},
  worried: {browY: -4, browTilt: 14, eyeOpen: 1.04, eyeWide: 1, mouth: 'wavy', pupilX: 0, pupilY: 1},
  sad: {browY: -1, browTilt: 17, eyeOpen: 0.76, eyeWide: 1, mouth: 'frown', pupilX: 0, pupilY: 1.6},
  shocked: {browY: -10, browTilt: 7, eyeOpen: 1.35, eyeWide: 1.1, mouth: 'open', pupilX: 0, pupilY: 0},
  defeated: {browY: 2, browTilt: 16, eyeOpen: 0.3, eyeWide: 1, mouth: 'tight', pupilX: 0, pupilY: 1.4},
};

const SUBDUED: ReadonlySet<Emotion> = new Set(['sad', 'worried', 'defeated', 'thinking']);

/** Deterministik göz kırpma — her karakterin kendi ritmi, render tekrarlanabilir. */
const useBlink = (seed: string) => {
  const frame = useCurrentFrame();
  const CYCLE = 84;
  const offset = Math.floor(random(`blink-${seed}`) * CYCLE);
  const t = (frame + offset) % CYCLE;
  if (t >= 6) return 1;
  return Math.min(1, Math.abs(t - 3) / 3);
};

/** Konuşurken ağzın açılma miktarı. Olumsuz duygularda çok daha kısık. */
const useTalk = (seed: string, talking: boolean, emotion: Emotion) => {
  const frame = useCurrentFrame();
  if (!talking) return 0;
  const tick = Math.floor(frame / 3);
  const raw = 0.3 + 0.7 * random(`talk-${seed}-${tick}`);
  return SUBDUED.has(emotion) ? raw * 0.42 : raw;
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

  const rx = spec.headRx;
  const ry = spec.headRy;

  // Yüz hatları kafa ölçüsüne oranlı — kadraj değişse de bozulmaz
  const eyeDx = rx * 0.42;
  const eyeY = cy - ry * 0.04;
  const eyeRx = rx * 0.2;
  const eyeRy = ry * 0.145;
  const browY = eyeY - ry * 0.3 + f.browY * 0.5;
  const mouthY = cy + ry * 0.5;
  const mw = rx * 0.34;

  const openness = f.eyeOpen * blink;

  const mouthPath = (): {d: string; fill: boolean} => {
    switch (f.mouth) {
      case 'line':
        return {d: `M ${-mw * 0.7} 0 L ${mw * 0.7} 0`, fill: false};
      case 'smile':
        return {d: `M ${-mw} -1 Q 0 ${mw * 0.62} ${mw} -1`, fill: false};
      case 'grin':
        return {d: `M ${-mw} -2 Q 0 -${mw * 0.2} ${mw} -2 Q ${mw * 0.8} ${mw} 0 ${mw * 1.06} Q ${-mw * 0.8} ${mw} ${-mw} -2 Z`, fill: true};
      case 'frown':
        return {d: `M ${-mw * 0.9} ${mw * 0.4} Q 0 -${mw * 0.45} ${mw * 0.9} ${mw * 0.4}`, fill: false};
      case 'smirk':
        return {d: `M ${-mw * 0.85} ${mw * 0.2} Q ${mw * 0.2} ${mw * 0.6} ${mw} -${mw * 0.3}`, fill: false};
      case 'wavy':
        return {d: `M ${-mw * 0.9} ${mw * 0.1} Q ${-mw * 0.45} -${mw * 0.3} 0 ${mw * 0.1} Q ${mw * 0.45} ${mw * 0.5} ${mw * 0.9} 0`, fill: false};
      case 'open':
        return {d: `M 0 -${mw * 0.5} Q ${mw * 0.62} -${mw * 0.5} ${mw * 0.62} ${mw * 0.25} Q ${mw * 0.62} ${mw} 0 ${mw} Q -${mw * 0.62} ${mw} -${mw * 0.62} ${mw * 0.25} Q -${mw * 0.62} -${mw * 0.5} 0 -${mw * 0.5} Z`, fill: true};
      case 'tight':
        return {d: `M ${-mw * 0.62} 0 Q 0 ${mw * 0.16} ${mw * 0.62} 0`, fill: false};
    }
  };

  const mouth = mouthPath();

  return (
    <g>
      {/* Göz çukuru gölgesi — yüze derinlik verir */}
      {[-1, 1].map((side) => (
        <ellipse
          key={`socket-${side}`}
          cx={cx + side * eyeDx}
          cy={eyeY}
          rx={eyeRx * 1.5}
          ry={eyeRy * 1.7}
          fill={spec.skinShade}
          opacity={0.32}
        />
      ))}

      {/* Gözler */}
      {[-1, 1].map((side) => (
        <g key={side} transform={`translate(${cx + side * eyeDx}, ${eyeY})`}>
          {openness < 0.16 ? (
            <path
              d={`M ${-eyeRx} 0 Q 0 ${eyeRy * 0.7} ${eyeRx} 0`}
              fill="none"
              stroke={C.line}
              strokeWidth={2.2}
              strokeLinecap="round"
            />
          ) : (
            <g transform={`scale(${f.eyeWide}, ${openness})`}>
              <ellipse rx={eyeRx} ry={eyeRy} fill="#F2F6FF" />
              <circle cx={f.pupilX} cy={f.pupilY} r={eyeRx * 0.62} fill={spec.eye} />
              <circle cx={f.pupilX} cy={f.pupilY} r={eyeRx * 0.3} fill="#0A0E18" />
              {/* Işık yansıması — aksan renginde, teknoloji hissi */}
              <circle cx={f.pupilX - eyeRx * 0.28} cy={f.pupilY - eyeRy * 0.36} r={eyeRx * 0.22} fill={spec.eyeGlow} opacity={0.8} />
              {/* Üst göz kapağı gölgesi */}
              <path d={`M ${-eyeRx} 0 A ${eyeRx} ${eyeRy} 0 0 1 ${eyeRx} 0 L ${eyeRx} ${-eyeRy * 0.5} L ${-eyeRx} ${-eyeRy * 0.5} Z`} fill={spec.skinShade} opacity={0.3} />
              <ellipse rx={eyeRx} ry={eyeRy} fill="none" stroke={C.line} strokeWidth={1.6} />
            </g>
          )}
        </g>
      ))}

      {/* Kaşlar */}
      {[-1, 1].map((side) => (
        <g key={`brow-${side}`} transform={`translate(${cx + side * eyeDx}, ${browY}) rotate(${side * f.browTilt})`}>
          <path
            d={`M ${-eyeRx * 1.15} 1 Q 0 -${eyeRy * 0.7} ${eyeRx * 1.15} 0`}
            fill="none"
            stroke={spec.hairShade}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* Burun — sadece gölge tarafı */}
      <path
        d={`M ${cx + 1} ${cy + ry * 0.1} q -${rx * 0.12} ${ry * 0.22} ${rx * 0.09} ${ry * 0.24}`}
        fill="none"
        stroke={spec.skinShade}
        strokeWidth={2.4}
        strokeLinecap="round"
        opacity={0.85}
      />

      {/* Çene gölgesi */}
      <path
        d={`M ${cx - rx * 0.5} ${cy + ry * 0.66} Q ${cx} ${cy + ry * 0.9} ${cx + rx * 0.5} ${cy + ry * 0.66}`}
        fill="none"
        stroke={spec.skinShade}
        strokeWidth={2}
        opacity={0.3}
      />

      {/* Ağız */}
      <g transform={`translate(${cx}, ${mouthY})`}>
        {talk > 0.05 ? (
          <g transform={`scale(${subdued ? 0.78 : 1}, ${0.3 + talk * 0.95})`}>
            <path
              d={`M ${-mw * 0.85} ${subdued ? 1 : -2} Q 0 ${subdued ? mw * 0.3 : -mw * 0.25} ${mw * 0.85} ${subdued ? 1 : -2} Q ${mw * 0.7} ${mw * 0.85} 0 ${mw * 0.95} Q ${-mw * 0.7} ${mw * 0.85} ${-mw * 0.85} ${subdued ? 1 : -2} Z`}
              fill="#140A12"
              stroke={spec.skinShade}
              strokeWidth={1.4}
              strokeLinejoin="round"
            />
          </g>
        ) : (
          <path
            d={mouth.d}
            fill={mouth.fill ? '#140A12' : 'none'}
            stroke={mouth.fill ? spec.skinShade : C.line}
            strokeWidth={mouth.fill ? 1.4 : 2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </g>
    </g>
  );
};
