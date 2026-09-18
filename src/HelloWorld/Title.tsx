import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY} from './theme';

/**
 * Başlığı kelime kelime, her kelime bir öncekinden biraz gecikmeli olarak
 * aşağıdan yukarı getirir. Bu "stagger" deseni Remotion'da en çok kullanılan
 * giriş animasyonudur: tek yaptığın, spring'e verilen frame'i kaydırmak.
 */
export const Title: React.FC<{readonly text: string; readonly fontSize: number}> = ({
  text,
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');

  return (
    <h1
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: `0 ${fontSize * 0.26}px`,
        margin: 0,
        maxWidth: '86%',
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight: 800,
        letterSpacing: '-0.03em',
        lineHeight: 1.08,
        textAlign: 'center',
        color: COLORS.text,
      }}
    >
      {words.map((word, index) => {
        const enter = spring({
          frame: frame - index * 4,
          fps,
          config: {damping: 16, stiffness: 110, mass: 0.7},
        });

        return (
          <span
            key={`${word}-${index}`}
            style={{
              display: 'inline-block',
              opacity: enter,
              transform: `translateY(${(1 - enter) * fontSize * 0.5}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </h1>
  );
};
