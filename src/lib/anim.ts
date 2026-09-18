import {Easing, interpolate, spring} from 'remotion';

type Base = {frame: number; fps: number; delay?: number};

/** Yaylanarak 0 → 1. Nesnelerin sahneye girişi için. */
export const popIn = ({frame, fps, delay = 0}: Base) =>
  spring({
    frame: frame - delay,
    fps,
    config: {damping: 13, stiffness: 140, mass: 0.7},
  });

/** Sert, yaylanmasız 0 → 1. Metin ve arayüz öğeleri için. */
export const easeIn = ({
  frame,
  delay = 0,
  duration = 18,
}: {
  frame: number;
  delay?: number;
  duration?: number;
}) =>
  interpolate(frame - delay, [0, duration], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Giriş + çıkış zarfı. Sahne sonunda nesneyi kendiliğinden kapatır. */
export const envelope = ({
  frame,
  fps,
  delay = 0,
  outAt,
  outDuration = 12,
}: Base & {outAt: number; outDuration?: number}) => {
  const enter = popIn({frame, fps, delay});
  const exit = interpolate(frame, [outAt, outAt + outDuration], [1, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return Math.min(enter, exit);
};

/** −1 → 1 arası sürekli salınım. Nefes alma, süzülme, nabız için. */
export const pulse = (frame: number, fps: number, cyclesPerSecond = 0.5, phase = 0) =>
  Math.sin((frame / fps) * cyclesPerSecond * Math.PI * 2 + phase);

/** 0 → 1 testere dişi. Sonsuz döngüler (dönme, kayma) için. */
export const loop = (frame: number, periodInFrames: number) =>
  (frame % periodInFrames) / periodInFrames;

/** Sıralı giriş gecikmesi. */
export const stagger = (index: number, perItem = 4) => index * perItem;
