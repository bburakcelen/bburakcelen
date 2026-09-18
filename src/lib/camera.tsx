import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {pulse} from './anim';

export type CameraMove =
  | 'pushIn'
  | 'pullOut'
  | 'driftLeft'
  | 'driftRight'
  | 'riseUp'
  | 'sinkDown'
  | 'still';

/**
 * Sahnenin tamamına yavaş bir kamera hareketi uygular.
 *
 * Sabit kadraj, bir videoyu anında "ucuz" gösterir; sürekli ama fark
 * edilmeyen bir hareket ise sinematik hissettirir. Hareket sahnenin
 * süresine yayılır, yani kısa sahnelerde de uzun sahnelerde de aynı hızda
 * görünür. Üstüne çok hafif bir el kamerası salınımı biner.
 */
export const Camera: React.FC<{
  readonly move?: CameraMove;
  /** Hareketin şiddeti. 1 = varsayılan. */
  readonly amount?: number;
  /** El kamerası salınımı. 0 = kapalı. */
  readonly handheld?: number;
  readonly children: React.ReactNode;
}> = ({move = 'pushIn', amount = 1, handheld = 1, children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();

  // 0 → 1, baştan sona; yavaşlayarak oturur
  const t = interpolate(frame, [0, Math.max(1, durationInFrames)], [0, 1], {
    easing: Easing.bezier(0.16, 0.6, 0.3, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const k = amount;
  let scale = 1;
  let x = 0;
  let y = 0;

  switch (move) {
    case 'pushIn':
      scale = 1.025 + t * 0.055 * k;
      break;
    case 'pullOut':
      scale = 1.085 - t * 0.055 * k;
      break;
    case 'driftLeft':
      scale = 1.055;
      x = (0.5 - t) * 44 * k;
      break;
    case 'driftRight':
      scale = 1.055;
      x = (t - 0.5) * 44 * k;
      break;
    case 'riseUp':
      scale = 1.055;
      y = (0.5 - t) * 38 * k;
      break;
    case 'sinkDown':
      scale = 1.055;
      y = (t - 0.5) * 38 * k;
      break;
    case 'still':
      scale = 1.02;
      break;
  }

  // Elde tutulmuş kamera hissi — birbirine denk düşmeyen iki periyot
  const hx = pulse(frame, fps, 0.13, 0.4) * 5 * handheld;
  const hy = pulse(frame, fps, 0.097, 1.9) * 4 * handheld;
  const hr = pulse(frame, fps, 0.071, 0.8) * 0.16 * handheld;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `scale(${scale}) translate(${x + hx}px, ${y + hy}px) rotate(${hr}deg)`,
        transformOrigin: 'center center',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};
