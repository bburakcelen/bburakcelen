import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, STROKE, glow} from '../theme';
import {pulse} from '../lib/anim';
import {Arm} from './parts/Arm';
import {Legs, Torso} from './parts/Body';
import {Face} from './parts/Face';
import {HairBack, HairFront} from './parts/Hair';
import {skeleton} from './presets';
import type {CharacterSpec, Emotion, Pose, PoseSpec} from './types';

/** Kol açıları: 0° aşağı, 90° yana, 180° yukarı. Önkol açısı üst kola göreli. */
const POSES: Record<Pose, PoseSpec> = {
  idle: {left: {upper: 10, fore: 8}, right: {upper: 10, fore: 8}},
  handsDown: {left: {upper: 5, fore: 3}, right: {upper: 5, fore: 3}},
  point: {left: {upper: 12, fore: 9}, right: {upper: 58, fore: 38}},
  pointUp: {left: {upper: 12, fore: 9}, right: {upper: 150, fore: 14}},
  wave: {left: {upper: 12, fore: 9}, right: {upper: 150, fore: -22}},
  armsUp: {left: {upper: 152, fore: 16}, right: {upper: 152, fore: 16}},
  shrug: {left: {upper: 52, fore: 70}, right: {upper: 52, fore: 70}},
  thumbsUp: {left: {upper: 12, fore: 9}, right: {upper: 10, fore: 200}},
  facepalm: {left: {upper: 14, fore: 11}, right: {upper: 132, fore: 104}},
  // Göğüste kavuşan kollar; iki kol hafif farklı ki tek çizgi gibi durmasın
  crossed: {left: {upper: 34, fore: 226}, right: {upper: 20, fore: 248}},
  presenting: {left: {upper: 14, fore: 11}, right: {upper: 60, fore: 36}},
};

export type CharacterProps = {
  readonly spec: CharacterSpec;
  readonly emotion?: Emotion;
  readonly pose?: Pose;
  /** Kareye basılacak yükseklik (px). Genişlik oranla hesaplanır. */
  readonly height: number;
  readonly talking?: boolean;
  readonly flip?: boolean;
  readonly arms?: Partial<PoseSpec>;
  /** Heyecan seviyesi: salınım ve zıplamayı artırır. 0–1. */
  readonly energy?: number;
  /** Kadraj. 'head' ve 'bust' duygusal anlarda yakın plan için. */
  readonly crop?: 'full' | 'bust' | 'head';
  /** Kenar ışığı şiddeti. 0 = kapalı. */
  readonly rim?: number;
  readonly style?: React.CSSProperties;
};

const VB_W = 400;
const VB_H = 800;

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
  rim = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const sk = skeleton(spec);
  const base = POSES[pose];
  const angles: PoseSpec = {
    left: {...base.left, ...arms?.left},
    right: {...base.right, ...arms?.right},
  };

  // Nefes — gövde çok hafif uzayıp kısalır
  const breath = pulse(frame, fps, 0.36) * 0.008;
  // Heyecanlandıkça artan ağırlık aktarımı (zıplama değil — daha ağırbaşlı)
  const sway = pulse(frame, fps, 0.9) * energy * 5;
  const headSway = pulse(frame, fps, 0.36, -0.6) * (1.4 + energy * 2.6);
  const headTilt = pulse(frame, fps, 0.26, 1.1) * (0.7 + energy * 1.4);

  const upperLen = spec.torsoLength * 0.47;
  const foreLen = spec.torsoLength * 0.45;
  const shoulderL = sk.centerX - spec.shoulderWidth * 0.62;
  const shoulderR = sk.centerX + spec.shoulderWidth * 0.62;
  const shoulderY = sk.shoulderY + 26;

  // Kadraja göre viewBox — aynı rig, farklı çekim ölçeği
  const view = (() => {
    if (crop === 'head') {
      const top = sk.headCy - spec.headRy - 42;
      const h = spec.headRy * 2 + 86;
      return {x: sk.centerX - h / 2, y: top, w: h, h};
    }
    if (crop === 'bust') {
      const top = sk.headCy - spec.headRy - 42;
      const h = sk.hipY - top + 10;
      return {x: sk.centerX - (h * 0.8) / 2, y: top, w: h * 0.8, h};
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
        transform: `${style?.transform ?? ''} translateX(${sway}px)`,
      }}
    >
      <svg
        width={(height * view.w) / view.h}
        height={height}
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        style={{
          overflow: crop === 'full' ? 'visible' : 'hidden',
          transform: flip ? 'scaleX(-1)' : undefined,
          filter: rim > 0 ? glow(spec.accent, 0.42 * rim) : undefined,
        }}
      >
        <defs>
          {/* Işık üstten ve hafif sağdan: gradyanlar bu yöne göre kurulu */}
          <linearGradient id={`jacket-${spec.id}`} x1="10%" y1="0%" x2="86%" y2="100%">
            <stop offset="0%" stopColor={spec.jacketLit} />
            <stop offset="30%" stopColor={spec.jacket} />
            <stop offset="72%" stopColor={spec.jacketShade} />
            <stop offset="100%" stopColor="#05080F" />
          </linearGradient>
          <linearGradient id={`pants-${spec.id}`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor={spec.jacket} />
            <stop offset="100%" stopColor={spec.pants} />
          </linearGradient>
          <linearGradient id={`skin-${spec.id}`} x1="14%" y1="2%" x2="78%" y2="98%">
            <stop offset="0%" stopColor={spec.skinLit} />
            <stop offset="34%" stopColor={spec.skin} />
            <stop offset="78%" stopColor={spec.skinShade} />
            <stop offset="100%" stopColor="#5C3B28" />
          </linearGradient>
        </defs>

        {/* Zemin teması — gölge değil, aksan renginde bir ışık havuzu */}
        <ellipse
          cx={sk.centerX}
          cy={sk.groundY + 8}
          rx={spec.shoulderWidth * 1.7}
          ry={9}
          fill={spec.accent}
          opacity={0.2}
        />
        <ellipse cx={sk.centerX} cy={sk.groundY + 8} rx={spec.shoulderWidth * 0.9} ry={5} fill={spec.accent} opacity={0.32} />

        <Legs {...bodyProps} />

        <g transform={`translate(0, ${sk.hipY * breath * -1}) scale(1, ${1 + breath})`}>
          <Torso {...bodyProps} />
        </g>

        {/* Kollar gövdeden sonra: omuz noktası ceketin içinde kaldığı için
            kol gövdeden uzuyormuş gibi görünür, kopuk durmaz. */}
        <Arm spec={spec} side="left" shoulderX={shoulderL} shoulderY={shoulderY} angles={angles.left} upperLen={upperLen} foreLen={foreLen} />
        <Arm spec={spec} side="right" shoulderX={shoulderR} shoulderY={shoulderY} angles={angles.right} upperLen={upperLen} foreLen={foreLen} />

        {/* Kafa — gövdeden bağımsız, gecikmeli salınır */}
        <g transform={`translate(${headSway}, ${-breath * 30}) rotate(${headTilt}, ${sk.centerX}, ${sk.headCy + spec.headRy})`}>
          <HairBack spec={spec} cx={sk.centerX} cy={sk.headCy} />

          {/* Kulaklar */}
          {[-1, 1].map((side) => (
            <ellipse
              key={side}
              cx={sk.centerX + side * (spec.headRx + 1)}
              cy={sk.headCy + spec.headRy * 0.1}
              rx={6}
              ry={9}
              fill={spec.skinShade}
              stroke={C.line}
              strokeWidth={STROKE.thin}
            />
          ))}

          {/* Yüz — daire değil, çeneye doğru daralan bir oval */}
          <path
            d={`M ${sk.centerX} ${sk.headCy - spec.headRy}
                C ${sk.centerX + spec.headRx * 1.06} ${sk.headCy - spec.headRy * 0.88} ${sk.centerX + spec.headRx * 1.04} ${sk.headCy + spec.headRy * 0.26} ${sk.centerX + spec.headRx * 0.78} ${sk.headCy + spec.headRy * 0.66}
                C ${sk.centerX + spec.headRx * 0.46} ${sk.headCy + spec.headRy * 1.02} ${sk.centerX - spec.headRx * 0.46} ${sk.headCy + spec.headRy * 1.02} ${sk.centerX - spec.headRx * 0.78} ${sk.headCy + spec.headRy * 0.66}
                C ${sk.centerX - spec.headRx * 1.04} ${sk.headCy + spec.headRy * 0.26} ${sk.centerX - spec.headRx * 1.06} ${sk.headCy - spec.headRy * 0.88} ${sk.centerX} ${sk.headCy - spec.headRy} Z`}
            fill={`url(#skin-${spec.id})`}
            stroke={C.line}
            strokeWidth={STROKE.normal}
            strokeLinejoin="round"
          />

          {/* Kafanın sol konturunda kenar ışığı */}
          <path
            d={`M ${sk.centerX - spec.headRx * 0.2} ${sk.headCy - spec.headRy * 0.99}
                C ${sk.centerX - spec.headRx * 0.9} ${sk.headCy - spec.headRy * 0.86} ${sk.centerX - spec.headRx * 1.04} ${sk.headCy + spec.headRy * 0.26} ${sk.centerX - spec.headRx * 0.78} ${sk.headCy + spec.headRy * 0.66}`}
            fill="none"
            stroke={spec.accent}
            strokeWidth={2.6}
            strokeLinecap="round"
            opacity={0.62}
          />

          <Face spec={spec} emotion={emotion} talking={talking} cx={sk.centerX} cy={sk.headCy} />
          <HairFront spec={spec} cx={sk.centerX} cy={sk.headCy} />
        </g>
      </svg>
    </div>
  );
};
