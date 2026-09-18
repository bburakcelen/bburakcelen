import React from 'react';
import {C, STROKE} from '../../theme';
import type {CharacterSpec} from '../types';

type Props = {
  readonly spec: CharacterSpec;
  readonly cx: number;
  readonly cy: number;
};

/** Kafanın arkasındaki hacim — yüz çizilmeden önce basılır. */
export const HairBack: React.FC<Props> = ({spec, cx, cy}) => {
  const {headRx: rx, headRy: ry} = spec;
  const lift = spec.hairStyle === 'messyMedium' ? 0.2 : 0.12;

  return (
    <ellipse
      cx={cx}
      cy={cy - ry * lift}
      rx={rx + 8}
      ry={ry * 0.96}
      fill={spec.hairShade}
      stroke={C.ink}
      strokeWidth={STROKE.thin}
    />
  );
};

/** Alın ve tepe saçı — yüzden sonra basılır. */
export const HairFront: React.FC<Props> = ({spec, cx, cy}) => {
  const {headRx: rx, headRy: ry} = spec;
  const X = (k: number) => cx + rx * k;
  const Y = (k: number) => cy - ry * k;

  if (spec.hairStyle === 'shortDark') {
    // Kısa, temiz kesim: alçak hacim, şakaklarda hafif içeri çekilme
    const cap = `M ${X(-1.03)} ${Y(0.14)}
      C ${X(-1.09)} ${Y(0.8)} ${X(-0.6)} ${Y(1.16)} ${X(0)} ${Y(1.14)}
      C ${X(0.62)} ${Y(1.14)} ${X(1.09)} ${Y(0.78)} ${X(1.02)} ${Y(0.1)}
      C ${X(0.95)} ${Y(0.5)} ${X(0.56)} ${Y(0.66)} ${X(0.08)} ${Y(0.64)}
      C ${X(-0.42)} ${Y(0.62)} ${X(-0.84)} ${Y(0.44)} ${X(-1.03)} ${Y(0.14)}
      Z`;

    // Yandan ayrılan bir tutam — yüzü tekdüze olmaktan çıkarır
    const part = `M ${X(0.3)} ${Y(1.1)}
      C ${X(0.12)} ${Y(0.92)} ${X(-0.16)} ${Y(0.82)} ${X(-0.5)} ${Y(0.84)}
      C ${X(-0.2)} ${Y(0.72)} ${X(0.12)} ${Y(0.78)} ${X(0.34)} ${Y(0.98)} Z`;

    return (
      <g>
        <path d={cap} fill={spec.hair} stroke={C.ink} strokeWidth={STROKE.normal} strokeLinejoin="round" />
        <path d={part} fill={spec.hairShade} opacity={0.85} />
      </g>
    );
  }

  // Normal uzunlukta, dağınık: tepede diken diken, alında düzensiz kâkül
  const messy = `M ${X(-1.02)} ${Y(0.08)}
    C ${X(-1.12)} ${Y(0.68)} ${X(-0.92)} ${Y(1.04)} ${X(-0.64)} ${Y(1.12)}
    L ${X(-0.58)} ${Y(1.31)}
    L ${X(-0.38)} ${Y(1.14)}
    L ${X(-0.16)} ${Y(1.47)}
    L ${X(0.04)} ${Y(1.19)}
    L ${X(0.26)} ${Y(1.38)}
    L ${X(0.44)} ${Y(1.16)}
    L ${X(0.64)} ${Y(1.34)}
    L ${X(0.8)} ${Y(1.14)}
    C ${X(1.02)} ${Y(0.92)} ${X(1.1)} ${Y(0.52)} ${X(1.02)} ${Y(0.04)}
    L ${X(0.76)} ${Y(0.44)}
    L ${X(0.52)} ${Y(0.06)}
    L ${X(0.26)} ${Y(0.48)}
    L ${X(0.0)} ${Y(0.1)}
    L ${X(-0.28)} ${Y(0.52)}
    L ${X(-0.54)} ${Y(0.12)}
    L ${X(-0.78)} ${Y(0.5)}
    Z`;

  return (
    <path d={messy} fill={spec.hair} stroke={C.ink} strokeWidth={STROKE.normal} strokeLinejoin="round" />
  );
};
