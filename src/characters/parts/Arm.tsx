import React from 'react';
import {C, STROKE} from '../../theme';
import type {ArmAngles, CharacterSpec} from '../types';

type Props = {
  readonly spec: CharacterSpec;
  readonly side: 'left' | 'right';
  readonly shoulderX: number;
  readonly shoulderY: number;
  readonly angles: ArmAngles;
  readonly upperLen: number;
  readonly foreLen: number;
};

const ARM_W = 17;

/**
 * İki eklemli kol: omuz → dirsek → el.
 * Açılar derece; 0° aşağı, 90° yana, 180° yukarı. Önkol açısı üst kola göreli.
 * Kolun üst yarısı ceket kolu (koyu), alt yarısı ten.
 */
export const Arm: React.FC<Props> = ({spec, side, shoulderX, shoulderY, angles, upperLen, foreLen}) => {
  const dir = side === 'left' ? -1 : 1;

  const a1 = (angles.upper * Math.PI) / 180;
  const elbowX = shoulderX + dir * Math.sin(a1) * upperLen;
  const elbowY = shoulderY + Math.cos(a1) * upperLen;

  const a2 = ((angles.upper + angles.fore) * Math.PI) / 180;
  const handX = elbowX + dir * Math.sin(a2) * foreLen;
  const handY = elbowY + Math.cos(a2) * foreLen;

  // Ceket kolu dirseğin biraz ötesine kadar iner
  const cuffX = elbowX + (handX - elbowX) * 0.34;
  const cuffY = elbowY + (handY - elbowY) * 0.34;

  return (
    <g>
      {/* Önkol — ten */}
      <path
        d={`M ${elbowX} ${elbowY} L ${handX} ${handY}`}
        fill="none"
        stroke={C.line}
        strokeWidth={ARM_W + 3}
        strokeLinecap="round"
      />
      <path
        d={`M ${elbowX} ${elbowY} L ${handX} ${handY}`}
        fill="none"
        stroke={spec.skin}
        strokeWidth={ARM_W - 1}
        strokeLinecap="round"
      />

      {/* Üst kol — ceket */}
      <path
        d={`M ${shoulderX} ${shoulderY} L ${elbowX} ${elbowY} L ${cuffX} ${cuffY}`}
        fill="none"
        stroke={C.line}
        strokeWidth={ARM_W + 8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M ${shoulderX} ${shoulderY} L ${elbowX} ${elbowY} L ${cuffX} ${cuffY}`}
        fill="none"
        stroke={spec.jacket}
        strokeWidth={ARM_W + 4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Kol üzerinde ince aksan şeridi */}
      <path
        d={`M ${shoulderX} ${shoulderY} L ${elbowX} ${elbowY}`}
        fill="none"
        stroke={spec.accent}
        strokeWidth={1.8}
        strokeLinecap="round"
        opacity={0.55}
      />
      {/* Bilek bandı */}
      <circle cx={cuffX} cy={cuffY} r={ARM_W * 0.62} fill={spec.jacketShade} stroke={spec.accent} strokeWidth={1.6} />

      {/* El */}
      <circle cx={handX} cy={handY} r={10.5} fill={spec.skin} stroke={C.line} strokeWidth={STROKE.thin} />
    </g>
  );
};
