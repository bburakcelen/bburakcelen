import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY} from './theme';

/**
 * Basit bir "fade + yukarı kayma".
 * Burada spring yerine interpolate kullanıyoruz: animasyonun tam olarak kaç
 * kare süreceği önemliyse interpolate daha öngörülebilir bir sonuç verir.
 */
export const Subtitle: React.FC<{readonly text: string; readonly fontSize: number}> = ({
  text,
  fontSize,
}) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <p
      style={{
        margin: 0,
        maxWidth: '74%',
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight: 500,
        lineHeight: 1.45,
        textAlign: 'center',
        color: COLORS.textMuted,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 28}px)`,
      }}
    >
      {text}
    </p>
  );
};
