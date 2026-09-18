import React from 'react';
import {C, STROKE} from '../../theme';
import type {CharacterSpec} from '../types';

type Props = {
  readonly spec: CharacterSpec;
  readonly cx: number;
  readonly cy: number;
};

/**
 * Saç tek bir siluet değil, üst üste binen tutamlardan oluşur.
 * Her tutam kökten uca doğru incelen bir şerit; tonları hafif farklı
 * olduğu için kütle düz bir leke gibi durmaz.
 */
const strandPath = (
  rootX: number,
  rootY: number,
  tipX: number,
  tipY: number,
  width: number,
  bend: number,
) => {
  const mx = (rootX + tipX) / 2 + bend;
  const my = (rootY + tipY) / 2;
  return `M ${rootX - width} ${rootY}
          Q ${mx - width * 0.4} ${my} ${tipX} ${tipY}
          Q ${mx + width * 0.5} ${my} ${rootX + width} ${rootY} Z`;
};

/** Kafanın arkasındaki hacim — yüz çizilmeden önce basılır. */
export const HairBack: React.FC<Props> = ({spec, cx, cy}) => {
  const {headRx: rx, headRy: ry} = spec;
  const lift = spec.hairStyle === 'messyMedium' ? 0.16 : 0.1;

  return (
    <ellipse
      cx={cx}
      cy={cy - ry * lift}
      rx={rx + 6}
      ry={ry * 1.0}
      fill={spec.hairShade}
      stroke={C.line}
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
    // Kısa kesim: doğal saç çizgisi — şakaklar içeri, ortada hafif tepe
    const cap = `M ${X(-1.05)} ${Y(0.06)}
      C ${X(-1.12)} ${Y(0.74)} ${X(-0.6)} ${Y(1.1)} ${X(0)} ${Y(1.09)}
      C ${X(0.62)} ${Y(1.09)} ${X(1.12)} ${Y(0.72)} ${X(1.04)} ${Y(0.04)}
      C ${X(1.0)} ${Y(0.42)} ${X(0.84)} ${Y(0.5)} ${X(0.66)} ${Y(0.44)}
      C ${X(0.44)} ${Y(0.36)} ${X(0.3)} ${Y(0.56)} ${X(0.06)} ${Y(0.52)}
      C ${X(-0.2)} ${Y(0.48)} ${X(-0.44)} ${Y(0.34)} ${X(-0.68)} ${Y(0.42)}
      C ${X(-0.88)} ${Y(0.48)} ${X(-1.0)} ${Y(0.38)} ${X(-1.05)} ${Y(0.06)}
      Z`;

    return (
      <g>
        <path d={cap} fill={spec.hair} stroke={C.line} strokeWidth={STROKE.thin} strokeLinejoin="round" />

        {/* Yan ayrım tutamları */}
        <path d={strandPath(X(0.25), Y(1.02), X(-0.62), Y(0.56), rx * 0.14, -rx * 0.1)} fill={spec.hairShade} opacity={0.9} />
        <path d={strandPath(X(0.44), Y(0.96), X(-0.2), Y(0.52), rx * 0.11, -rx * 0.06)} fill={spec.hairShade} opacity={0.7} />
        <path d={strandPath(X(0.62), Y(0.9), X(0.9), Y(0.36), rx * 0.1, rx * 0.06)} fill={spec.hairShade} opacity={0.6} />

        {/* Kenar ışığı — üst sol kontur */}
        <path
          d={`M ${X(-0.95)} ${Y(0.52)} C ${X(-0.72)} ${Y(1.0)} ${X(-0.2)} ${Y(1.14)} ${X(0.34)} ${Y(1.03)}`}
          fill="none"
          stroke={spec.accent}
          strokeWidth={2.8}
          strokeLinecap="round"
          opacity={0.85}
        />
      </g>
    );
  }

  // Dağınık orta boy: dolgun siluet + tepeden dağılan tutamlar
  const base = `M ${X(-1.05)} ${Y(0.1)}
    C ${X(-1.14)} ${Y(0.74)} ${X(-0.94)} ${Y(1.04)} ${X(-0.64)} ${Y(1.12)}
    Q ${X(-0.3)} ${Y(1.26)} ${X(0.06)} ${Y(1.2)}
    Q ${X(0.46)} ${Y(1.22)} ${X(0.8)} ${Y(1.06)}
    C ${X(1.06)} ${Y(0.88)} ${X(1.14)} ${Y(0.56)} ${X(1.05)} ${Y(0.08)}
    Q ${X(0.8)} ${Y(0.44)} ${X(0.58)} ${Y(0.16)}
    Q ${X(0.34)} ${Y(0.5)} ${X(0.08)} ${Y(0.2)}
    Q ${X(-0.2)} ${Y(0.52)} ${X(-0.48)} ${Y(0.22)}
    Q ${X(-0.74)} ${Y(0.48)} ${X(-0.88)} ${Y(0.3)}
    Z`;

  return (
    <g>
      <path d={base} fill={spec.hair} stroke={C.line} strokeWidth={STROKE.thin} strokeLinejoin="round" />

      {/* Tutamlar tek yöne taranmış: sağ tepeden sol alna doğru.
          Merkezden ışınsal dağıtınca kütle kubbe/top gibi okunuyordu. */}
      <path d={strandPath(X(0.62), Y(1.02), X(-0.66), Y(0.5), rx * 0.16, -rx * 0.2)} fill={spec.hairShade} opacity={0.8} />
      <path d={strandPath(X(0.5), Y(1.1), X(-0.32), Y(0.24), rx * 0.14, -rx * 0.16)} fill={spec.hairShade} opacity={0.6} />
      <path d={strandPath(X(0.34), Y(1.14), X(0.04), Y(0.26), rx * 0.12, -rx * 0.08)} fill={spec.hairShade} opacity={0.46} />
      <path d={strandPath(X(0.72), Y(0.92), X(0.94), Y(0.42), rx * 0.12, rx * 0.1)} fill={spec.hairShade} opacity={0.7} />

      {/* Kenar ışığı */}
      <path
        d={`M ${X(-0.98)} ${Y(0.5)} C ${X(-0.78)} ${Y(1.02)} ${X(-0.26)} ${Y(1.26)} ${X(0.3)} ${Y(1.18)}`}
        fill="none"
        stroke={spec.accent}
        strokeWidth={2.8}
        strokeLinecap="round"
        opacity={0.82}
      />
    </g>
  );
};
