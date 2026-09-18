import {C} from '../theme';
import type {CharacterSpec} from './types';

/**
 * A — uzun boylu, sarı dağınık saçlı, mavi gözlü.
 * Kanalın futures / spot trading tarafı.
 */
export const A: CharacterSpec = {
  id: 'A',
  name: 'A',
  hair: C.aHair,
  hairShade: C.aHairShade,
  eye: C.aEye,
  shirt: C.aShirt,
  shirtShade: C.aShirtShade,
  pants: '#3B4A72',
  skin: C.skin,
  skinShade: C.skinShade,
  hairStyle: 'messyMedium',
  legLength: 195,
  torsoLength: 180,
  headRx: 72,
  headRy: 80,
  shoulderWidth: 74,
};

/**
 * B — A'dan kısa, siyah kısa saçlı, siyah gözlü.
 * Kanalın airdrop / on-chain / yeni proje tarafı.
 */
export const B: CharacterSpec = {
  id: 'B',
  name: 'B',
  hair: C.bHair,
  hairShade: C.bHairShade,
  eye: C.bEye,
  shirt: C.bShirt,
  shirtShade: C.bShirtShade,
  pants: '#4A4E63',
  skin: C.skin,
  skinShade: C.skinShade,
  hairStyle: 'shortDark',
  legLength: 132,
  torsoLength: 168,
  headRx: 78,
  headRy: 84,
  shoulderWidth: 78,
};

/** Karakterin iskelet noktaları — parçalar bu ölçülerden türer. */
export const skeleton = (spec: CharacterSpec) => {
  const groundY = 690;
  const centerX = 200;
  const hipY = groundY - spec.legLength;
  const shoulderY = hipY - spec.torsoLength;
  const neckY = shoulderY - 18;
  const headCy = neckY - spec.headRy + 12;

  return {groundY, centerX, hipY, shoulderY, neckY, headCy};
};
