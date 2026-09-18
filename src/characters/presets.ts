import {C} from '../theme';
import type {CharacterSpec} from './types';

/**
 * A — uzun boylu, sarı dağınık saçlı, mavi gözlü.
 * Rolü: airdrop, yeni proje, on-chain araştırma — fırsat avcısı.
 * Aksan rengi camgöbeği: keşif / veri tarafı.
 */
export const A: CharacterSpec = {
  id: 'A',
  name: 'A',
  role: 'Airdrops · yeni projeler · on-chain araştırma',

  hair: '#BCA063',
  hairShade: '#756031',
  hairStyle: 'messyMedium',

  eye: '#4FA8FF',
  eyeGlow: C.cyan,

  jacket: '#25355C',
  jacketLit: '#3E578F',
  jacketShade: '#121B33',
  accent: C.cyan,
  accentDim: C.cyanDim,

  pants: '#1C2745',
  skin: C.skin,
  skinShade: C.skinShade,
  skinLit: C.skinLit,

  legLength: 330,
  torsoLength: 225,
  headRx: 44,
  headRy: 50,
  shoulderWidth: 86,
};

/**
 * B — A'dan kısa, siyah kısa saçlı, siyah gözlü.
 * Rolü: futures ve spot trading — aktif işlem tarafı.
 * Aksan rengi kehribar: grafik / para tarafı.
 */
export const B: CharacterSpec = {
  id: 'B',
  name: 'B',
  role: 'Futures · spot trading · strateji',

  hair: '#191D2A',
  hairShade: '#0C0F18',
  hairStyle: 'shortDark',

  eye: '#20222E',
  eyeGlow: C.amber,

  jacket: '#3B2F45',
  jacketLit: '#5C4867',
  jacketShade: '#1E1726',
  accent: C.amber,
  accentDim: C.amberDim,

  pants: '#2A2235',
  skin: C.skin,
  skinShade: C.skinShade,
  skinLit: C.skinLit,

  legLength: 265,
  torsoLength: 210,
  headRx: 45,
  headRy: 51,
  shoulderWidth: 92,
};

/** Karakterin iskelet noktaları — tüm parçalar bu ölçülerden türer. */
export const skeleton = (spec: CharacterSpec) => {
  const groundY = 760;
  const centerX = 200;
  const hipY = groundY - spec.legLength;
  const shoulderY = hipY - spec.torsoLength;
  const neckY = shoulderY - 16;
  const headCy = neckY - spec.headRy + 10;

  return {groundY, centerX, hipY, shoulderY, neckY, headCy};
};
