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

const ARM_W = 21;

/**
 * İki eklemli kol: omuz → dirsek → el.
 * Açılar derece cinsinden; 0° aşağı, 90° yana, 180° yukarı.
 * Önkol açısı üst kola görelidir, yani gerçek bir eklem gibi davranır.
 */
export const Arm: React.FC<Props> = ({spec, side, shoulderX, shoulderY, angles, upperLen, foreLen}) => {
  const dir = side === 'left' ? -1 : 1;

  const a1 = (angles.upper * Math.PI) / 180;
  const elbowX = shoulderX + dir * Math.sin(a1) * upperLen;
  const elbowY = shoulderY + Math.cos(a1) * upperLen;

  const a2 = ((angles.upper + angles.fore) * Math.PI) / 180;
  const handX = elbowX + dir * Math.sin(a2) * foreLen;
  const handY = elbowY + Math.cos(a2) * foreLen;

  // Omuzdan dirseğe doğru kısa bir tişört kolu
  const sleeveX = shoulderX + (elbowX - shoulderX) * 0.5;
  const sleeveY = shoulderY + (elbowY - shoulderY) * 0.5;

  const limb = `M ${shoulderX} ${shoulderY} L ${elbowX} ${elbowY} L ${handX} ${handY}`;

  return (
    <g>
      {/* Kontur */}
      <path d={limb} fill="none" stroke={C.ink} strokeWidth={ARM_W + 7} strokeLinecap="round" strokeLinejoin="round" />
      {/* Ten */}
      <path d={limb} fill="none" stroke={spec.skin} strokeWidth={ARM_W} strokeLinecap="round" strokeLinejoin="round" />
      {/* Tişört kolu */}
      <path
        d={`M ${shoulderX} ${shoulderY} L ${sleeveX} ${sleeveY}`}
        fill="none"
        stroke={C.ink}
        strokeWidth={ARM_W + 15}
        strokeLinecap="round"
      />
      <path
        d={`M ${shoulderX} ${shoulderY} L ${sleeveX} ${sleeveY}`}
        fill="none"
        stroke={spec.shirt}
        strokeWidth={ARM_W + 8}
        strokeLinecap="round"
      />
      {/* El */}
      <circle cx={handX} cy={handY} r={16} fill={spec.skin} stroke={C.ink} strokeWidth={STROKE.thin} />
    </g>
  );
};
