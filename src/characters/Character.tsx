import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, STROKE} from '../theme';
import {pulse} from '../lib/anim';
import {useWobble} from '../lib/wobble';
import {Arm} from './parts/Arm';
import {Legs, Torso} from './parts/Body';
import {Face} from './parts/Face';
import {HairBack, HairFront} from './parts/Hair';
import {skeleton} from './presets';
import type {CharacterSpec, Emotion, Pose, PoseSpec} from './types';

/** Kol açıları: 0° aşağı, 90° yana, 180° yukarı. Önkol açısı üst kola göreli. */
const POSES: Record<Pose, PoseSpec> = {
  idle: {left: {upper: 13, fore: 9}, right: {upper: 13, fore: 9}},
  handsDown: {left: {upper: 6, fore: 3}, right: {upper: 6, fore: 3}},
  point: {left: {upper: 14, fore: 10}, right: {upper: 74, fore: 16}},
  pointUp: {left: {upper: 14, fore: 10}, right: {upper: 152, fore: 14}},
  wave: {left: {upper: 14, fore: 10}, right: {upper: 152, fore: -22}},
  armsUp: {left: {upper: 156, fore: 16}, right: {upper: 156, fore: 16}},
  shrug: {left: {upper: 56, fore: 72}, right: {upper: 56, fore: 72}},
  thumbsUp: {left: {upper: 14, fore: 10}, right: {upper: 10, fore: 200}},
  facepalm: {left: {upper: 16, fore: 12}, right: {upper: 132, fore: 104}},
  // Göğüste kavuşan kollar: önkol açısı 180°'yi aşınca el gövdeye doğru döner.
  // İki kol hafif farklı ki üst üste binip tek çizgi gibi görünmesinler.
  crossed: {left: {upper: 22, fore: 232}, right: {upper: 18, fore: 244}},
  presenting: {left: {upper: 16, fore: 12}, right: {upper: 80, fore: 20}},
};

export type CharacterProps = {
  readonly spec: CharacterSpec;
  readonly emotion?: Emotion;
  readonly pose?: Pose;
  /** Kareye basılacak yükseklik (px). Genişlik oranla hesaplanır. */
  readonly height: number;
  readonly talking?: boolean;
  /** true ise karakter sola bakar. */
  readonly flip?: boolean;
  /** Poz açılarını elle ezmek için. */
  readonly arms?: Partial<PoseSpec>;
  /** Heyecan seviyesi: zıplama ve sallanma miktarını artırır. 0–1. */
  readonly energy?: number;
  /** Kadraj. 'head' ve 'bust' duygusal anlarda yakın plan için. */
  readonly crop?: 'full' | 'bust' | 'head';
  readonly style?: React.CSSProperties;
};

const VB_W = 400;
const VB_H = 760;

export const Character: React.FC<CharacterProps> = ({
  spec,
  emotion = 'neutral',
  pose = 'idle',
  height,
  talking = false,
  flip = false,
  arms,
  energy = 0,
  crop = 'full',
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const wob = useWobble(`char-${spec.id}`, 1.5, 3);

  const sk = skeleton(spec);
  const base = POSES[pose];
  const angles: PoseSpec = {
    left: {...base.left, ...arms?.left},
    right: {...base.right, ...arms?.right},
  };

  // Nefes alma — gövde çok hafif uzayıp kısalır
  const breath = pulse(frame, fps, 0.42) * 0.012;
  // Heyecanlandıkça artan zıplama
  const hop = energy > 0 ? Math.abs(pulse(frame, fps, 1.6)) * -14 * energy : 0;
  // Baş, gövdeden hafif gecikmeli sallanır
  const headSway = pulse(frame, fps, 0.42, -0.6) * (2.4 + energy * 5);
  const headTilt = pulse(frame, fps, 0.3, 1.1) * (1.2 + energy * 2.5);

  const upperLen = spec.torsoLength * 0.46;
  const foreLen = spec.torsoLength * 0.42;
  // Omuz noktası gövdenin İÇİNDE: kol dışarı çıkarken tişörtten uzuyormuş gibi görünür
  const shoulderL = sk.centerX - spec.shoulderWidth * 0.64;
  const shoulderR = sk.centerX + spec.shoulderWidth * 0.64;
  const shoulderY = sk.shoulderY + 34;

  // Kadraja göre viewBox — aynı rig, farklı çekim ölçeği
  const view = (() => {
    if (crop === 'head') {
      const top = sk.headCy - spec.headRy - 58;
      const h = spec.headRy * 2 + 108;
      return {x: sk.centerX - h / 2, y: top, w: h, h};
    }
    if (crop === 'bust') {
      const top = sk.headCy - spec.headRy - 58;
      const h = sk.hipY - top - 30;
      return {x: sk.centerX - (h * 0.82) / 2, y: top, w: h * 0.82, h};
    }
    return {x: 0, y: 0, w: VB_W, h: VB_H};
  })();

  const bodyProps = {
    spec,
    cx: sk.centerX,
    hipY: sk.hipY,
    shoulderY: sk.shoulderY,
    groundY: sk.groundY,
    neckY: sk.neckY,
  };

  return (
    <div
      style={{
        ...style,
        transform: `${style?.transform ?? ''} translate(${wob.x}px, ${wob.y + hop}px) rotate(${wob.rotate}deg)`,
      }}
    >
      <svg
        width={(height * view.w) / view.h}
        height={height}
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        style={{
          overflow: crop === 'full' ? 'visible' : 'hidden',
          transform: flip ? 'scaleX(-1)' : undefined,
        }}
      >
        {/* Zemin gölgesi */}
        <ellipse
          cx={sk.centerX}
          cy={sk.groundY + 14}
          rx={spec.shoulderWidth * 1.5}
          ry={13}
          fill={C.ink}
          opacity={0.22}
        />

        <Legs {...bodyProps} />

        <g transform={`translate(0, ${sk.hipY * breath * -1}) scale(1, ${1 + breath})`}>
          <Torso {...bodyProps} />
        </g>

        {/* Kollar gövdeden sonra çizilir: omuz noktası tişörtün içinde kaldığı
            için kol, gövdeden uzuyormuş gibi görünür — kopuk durmaz. */}
        <Arm
          spec={spec}
          side="left"
          shoulderX={shoulderL}
          shoulderY={shoulderY}
          angles={angles.left}
          upperLen={upperLen}
          foreLen={foreLen}
        />
        <Arm
          spec={spec}
          side="right"
          shoulderX={shoulderR}
          shoulderY={shoulderY}
          angles={angles.right}
          upperLen={upperLen}
          foreLen={foreLen}
        />

        {/* Kafa — gövdeden bağımsız sallanır */}
        <g
          transform={`translate(${headSway}, ${-breath * 40}) rotate(${headTilt}, ${sk.centerX}, ${sk.headCy + spec.headRy})`}
        >
          <HairBack spec={spec} cx={sk.centerX} cy={sk.headCy} />

          {/* Kulaklar */}
          {[-1, 1].map((side) => (
            <ellipse
              key={side}
              cx={sk.centerX + side * (spec.headRx + 2)}
              cy={sk.headCy + 6}
              rx={11}
              ry={15}
              fill={spec.skin}
              stroke={C.ink}
              strokeWidth={STROKE.thin}
            />
          ))}

          {/* Yüz ovali */}
          <ellipse
            cx={sk.centerX}
            cy={sk.headCy}
            rx={spec.headRx}
            ry={spec.headRy}
            fill={spec.skin}
            stroke={C.ink}
            strokeWidth={STROKE.thick}
          />

          <Face spec={spec} emotion={emotion} talking={talking} cx={sk.centerX} cy={sk.headCy} />
          <HairFront spec={spec} cx={sk.centerX} cy={sk.headCy} />
        </g>
      </svg>
    </div>
  );
};
