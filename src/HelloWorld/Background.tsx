import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from './theme';

// Yavaşça dönen gradyan + iki adet süzülen ışık lekesi.
// Sabit bir arka plan yerine hafif hareket, videoyu "canlı" hissettirir.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, width, height} = useVideoConfig();

  const progress = frame / durationInFrames;
  const angle = interpolate(progress, [0, 1], [135, 205]);

  // Sinüs ile ileri-geri süzülme (döngüsel olduğu için sıçrama olmaz).
  const drift = (offset: number, amplitude: number) =>
    Math.sin(progress * Math.PI * 2 + offset) * amplitude;

  const blobSize = Math.max(width, height) * 0.75;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, ${COLORS.backgroundFrom} 0%, ${COLORS.backgroundVia} 48%, ${COLORS.backgroundTo} 100%)`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: width * 0.05 + drift(0, width * 0.06),
          top: height * 0.02 + drift(1.2, height * 0.05),
          width: blobSize,
          height: blobSize,
          background: `radial-gradient(circle, ${COLORS.accent}55 0%, transparent 62%)`,
          filter: 'blur(40px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: width * 0.3 + drift(3.1, width * 0.07),
          top: height * 0.32 + drift(2.4, height * 0.06),
          width: blobSize,
          height: blobSize,
          background: `radial-gradient(circle, ${COLORS.accentSoft}4d 0%, transparent 62%)`,
          filter: 'blur(48px)',
        }}
      />
    </AbsoluteFill>
  );
};
