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

export const Legs: React.FC<Props> = ({spec, cx, hipY, groundY}) => {
  const gap = 13;
  const legW = 34;
  const shoeY = groundY - 20;

  return (
    <g>
      {[-1, 1].map((side) => {
        const x = cx + side * (gap + legW / 2);
        return (
          <g key={side}>
            <path
              d={`M ${x} ${hipY - 6} L ${x} ${shoeY}`}
              fill="none"
              stroke={C.ink}
              strokeWidth={legW + 7}
              strokeLinecap="round"
            />
            <path
              d={`M ${x} ${hipY - 6} L ${x} ${shoeY}`}
              fill="none"
              stroke={spec.pants}
              strokeWidth={legW}
              strokeLinecap="round"
            />
            {/* Ayakkabı */}
            <path
              d={`M ${x - side * (legW / 2 + 2)} ${shoeY}
                  L ${x + side * (legW / 2 + 26)} ${shoeY + 2}
                  Q ${x + side * (legW / 2 + 34)} ${groundY + 4} ${x + side * (legW / 2 + 16)} ${groundY + 10}
                  L ${x - side * (legW / 2 + 2)} ${groundY + 10}
                  Q ${x - side * (legW / 2 + 8)} ${shoeY + 10} ${x - side * (legW / 2 + 2)} ${shoeY} Z`}
              fill={C.paper}
              stroke={C.ink}
              strokeWidth={STROKE.normal}
              strokeLinejoin="round"
            />
          </g>
        );
      })}
    </g>
  );
};

export const Torso: React.FC<Props> = ({spec, cx, hipY, shoulderY, neckY}) => {
  const sw = spec.shoulderWidth;
  const hw = sw * 0.86;

  const shirt = `M ${cx - sw} ${shoulderY}
    C ${cx - sw - 4} ${shoulderY + 40} ${cx - hw - 5} ${hipY - 40} ${cx - hw} ${hipY}
    L ${cx + hw} ${hipY}
    C ${cx + hw + 5} ${hipY - 40} ${cx + sw + 4} ${shoulderY + 40} ${cx + sw} ${shoulderY}
    C ${cx + sw * 0.5} ${shoulderY - 12} ${cx - sw * 0.5} ${shoulderY - 12} ${cx - sw} ${shoulderY} Z`;

  return (
    <g>
      {/* Boyun */}
      <path
        d={`M ${cx} ${neckY - 22} L ${cx} ${shoulderY + 6}`}
        fill="none"
        stroke={C.ink}
        strokeWidth={38}
        strokeLinecap="round"
      />
      <path
        d={`M ${cx} ${neckY - 22} L ${cx} ${shoulderY + 6}`}
        fill="none"
        stroke={spec.skinShade}
        strokeWidth={31}
        strokeLinecap="round"
      />

      {/* Tişört */}
      <path d={shirt} fill={spec.shirt} stroke={C.ink} strokeWidth={STROKE.thick} strokeLinejoin="round" />

      {/* Yaka */}
      <path
        d={`M ${cx - 26} ${shoulderY - 4} Q ${cx} ${shoulderY + 24} ${cx + 26} ${shoulderY - 4}`}
        fill={spec.shirtShade}
        stroke={C.ink}
        strokeWidth={STROKE.thin}
        strokeLinejoin="round"
      />

      {/* Gövdenin sol tarafına hafif gölge — hacim hissi */}
      <path
        d={`M ${cx + hw * 0.52} ${shoulderY + 14}
            C ${cx + hw * 0.7} ${shoulderY + 70} ${cx + hw * 0.72} ${hipY - 50} ${cx + hw * 0.66} ${hipY - 2}
            L ${cx + hw} ${hipY}
            C ${cx + hw + 5} ${hipY - 40} ${cx + sw + 4} ${shoulderY + 40} ${cx + sw} ${shoulderY} Z`}
        fill={spec.shirtShade}
        opacity={0.55}
      />
    </g>
  );
};
