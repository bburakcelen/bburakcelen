import React from 'react';
import {C, STROKE} from '../../theme';
import type {CharacterSpec} from '../types';

type Props = {
  readonly spec: CharacterSpec;
  readonly cx: number;
  readonly hipY: number;
  readonly shoulderY: number;
  readonly groundY: number;
  readonly neckY: number;
};

/**
 * Aydınlatma modeli: ana ışık soldan arkadan geliyor.
 * Gövde büyük ölçüde gölgede kalır, sol kontur boyunca aksan renginde
 * keskin bir kenar ışığı çizilir. Bu, düz vektörü hacimli gösterir ve
 * çizim detayı sınırlı olsa bile pahalı bir görüntü verir.
 */

export const Legs: React.FC<Props> = ({spec, cx, hipY, groundY}) => {
  const gap = 11;
  const legW = 41;
  const shoeTop = groundY - 20;
  const kneeY = hipY + (shoeTop - hipY) * 0.5;

  return (
    <g>
      {[-1, 1].map((side) => {
        const x = cx + side * (gap + legW / 2);
        const outer = x - legW / 2;
        const inner = x + legW / 2;

        return (
          <g key={side}>
            {/* Bacak — dizde hafif kırılma, baldıra doğru incelme */}
            <path
              d={`M ${outer} ${hipY - 12}
                  L ${inner} ${hipY - 12}
                  L ${inner - 2} ${kneeY}
                  L ${inner - 5} ${shoeTop}
                  L ${outer + 4} ${shoeTop}
                  L ${outer + 1} ${kneeY} Z`}
              fill={spec.pants}
              stroke={C.line}
              strokeWidth={STROKE.thin}
              strokeLinejoin="round"
            />
            {/* Kenar ışığı: sol kontur */}
            <path
              d={`M ${outer} ${hipY - 8} L ${outer + 1} ${kneeY} L ${outer + 4} ${shoeTop - 2}`}
              fill="none"
              stroke={spec.accent}
              strokeWidth={2.2}
              strokeLinecap="round"
              opacity={0.78}
            />
            {/* Diz panel dikişi */}
            <line x1={outer + 2} y1={kneeY} x2={inner - 2} y2={kneeY} stroke={C.lineLit} strokeWidth={1.3} opacity={0.6} />

            {/* Bot */}
            <path
              d={`M ${outer - 1} ${shoeTop}
                  L ${inner + 1} ${shoeTop}
                  L ${x + side * (legW / 2 + 15)} ${groundY - 5}
                  Q ${x + side * (legW / 2 + 17)} ${groundY + 2} ${x + side * (legW / 2 + 10)} ${groundY + 3}
                  L ${x - side * (legW / 2 + 1)} ${groundY + 3} Z`}
              fill="#0A0E1A"
              stroke={C.line}
              strokeWidth={STROKE.thin}
              strokeLinejoin="round"
            />
            <line
              x1={x - side * (legW / 2 + 1)}
              y1={groundY + 1}
              x2={x + side * (legW / 2 + 11)}
              y2={groundY + 1}
              stroke={spec.accent}
              strokeWidth={2.4}
              opacity={0.9}
            />
          </g>
        );
      })}
    </g>
  );
};

export const Torso: React.FC<Props> = ({spec, cx, hipY, shoulderY, neckY}) => {
  const sw = spec.shoulderWidth;
  const waist = sw * 0.9;
  const hem = hipY + 26;

  // Sol dış kontur — hem ceketin kenarı hem de kenar ışığının yolu
  const leftEdge = `M ${cx - sw} ${shoulderY + 8}
    C ${cx - sw - 1} ${shoulderY + 60} ${cx - waist - 1} ${hipY - 60} ${cx - waist} ${hem}`;

  const jacket = `${leftEdge}
    L ${cx + waist} ${hem}
    C ${cx + waist + 1} ${hipY - 60} ${cx + sw + 1} ${shoulderY + 60} ${cx + sw} ${shoulderY + 8}
    C ${cx + sw * 0.52} ${shoulderY - 12} ${cx - sw * 0.52} ${shoulderY - 12} ${cx - sw} ${shoulderY + 8} Z`;

  return (
    <g>
      {/* Boyun — gölgede */}
      <path
        d={`M ${cx - 13} ${neckY - 14} L ${cx + 13} ${neckY - 14} L ${cx + 11} ${shoulderY + 8} L ${cx - 11} ${shoulderY + 8} Z`}
        fill="#4A3225"
        stroke={C.line}
        strokeWidth={STROKE.thin}
        strokeLinejoin="round"
      />

      {/* Ceket gövdesi — büyük ölçüde gölgede */}
      <path d={jacket} fill={`url(#jacket-${spec.id})`} stroke={C.line} strokeWidth={STROKE.thin} strokeLinejoin="round" />

      {/* Sağ yarı daha da karanlık */}
      <path
        d={`M ${cx + waist * 0.14} ${shoulderY - 4}
            L ${cx + waist * 0.2} ${hem}
            L ${cx + waist} ${hem}
            C ${cx + waist + 1} ${hipY - 60} ${cx + sw + 1} ${shoulderY + 60} ${cx + sw} ${shoulderY + 8}
            C ${cx + sw * 0.52} ${shoulderY - 12} ${cx + waist * 0.14} ${shoulderY - 8} ${cx + waist * 0.14} ${shoulderY - 4} Z`}
        fill="#05080F"
        opacity={0.5}
      />

      {/* Göğüs panel dikişleri — teknik giysi */}
      <path
        d={`M ${cx - waist * 0.62} ${shoulderY + 44} L ${cx - waist * 0.2} ${shoulderY + 38}`}
        stroke={C.lineLit}
        strokeWidth={1.4}
        fill="none"
        opacity={0.7}
      />
      <path
        d={`M ${cx - waist * 0.66} ${hipY - 44} L ${cx + waist * 0.66} ${hipY - 50}`}
        stroke={C.lineLit}
        strokeWidth={1.4}
        fill="none"
        opacity={0.5}
      />

      {/* Fermuar */}
      <line x1={cx} y1={shoulderY + 6} x2={cx} y2={hem - 4} stroke="#05080F" strokeWidth={2.2} opacity={0.85} />

      {/* Yaka */}
      <path
        d={`M ${cx - 18} ${shoulderY - 2} L ${cx} ${shoulderY + 26} L ${cx + 18} ${shoulderY - 2}`}
        fill="none"
        stroke={C.line}
        strokeWidth={STROKE.normal}
        strokeLinejoin="round"
      />
      <path
        d={`M ${cx - 18} ${shoulderY - 2} L ${cx} ${shoulderY + 26}`}
        fill="none"
        stroke={spec.accent}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.8}
      />

      {/* KENAR IŞIĞI — sol dış kontur boyunca keskin aksan */}
      <path d={leftEdge} fill="none" stroke={spec.accent} strokeWidth={3} strokeLinecap="round" opacity={0.95} />
      {/* Omuz hattında ışığın devamı */}
      <path
        d={`M ${cx - sw} ${shoulderY + 8} C ${cx - sw * 0.52} ${shoulderY - 12} ${cx - sw * 0.16} ${shoulderY - 13} ${cx} ${shoulderY - 10}`}
        fill="none"
        stroke={spec.accent}
        strokeWidth={2.6}
        strokeLinecap="round"
        opacity={0.62}
      />

      {/* Göğüs göstergesi */}
      <rect x={cx + 14} y={shoulderY + 46} width={22} height={6} rx={2} fill={spec.accent} opacity={0.82} />
      <rect x={cx + 14} y={shoulderY + 57} width={13} height={4} rx={2} fill={spec.accent} opacity={0.4} />

      {/* Etek ucu */}
      <line x1={cx - waist} y1={hem} x2={cx + waist} y2={hem} stroke={spec.accent} strokeWidth={1.8} opacity={0.42} />
    </g>
  );
};
