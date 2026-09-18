import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from './Background';
import {Logo} from './Logo';
import {Subtitle} from './Subtitle';
import {Title} from './Title';

export type HelloWorldProps = {
  readonly title: string;
  readonly subtitle: string;
};

// Studio'daki "Props" panelinden bu değerleri canlı olarak değiştirebilirsin.
export const helloWorldDefaultProps: HelloWorldProps = {
  title: 'Remotion ile animasyon',
  subtitle: 'Video artık bir React bileşeni. Kodu değiştir, sonucu anında gör.',
};

export const HelloWorld: React.FC<HelloWorldProps> = ({title, subtitle}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, width, height} = useVideoConfig();

  // Ölçülere göre ölçeklenen tipografi: aynı bileşen hem 16:9 hem 9:16 çalışır.
  const scale = Math.min(width, height) / 1080;
  const isVertical = height > width;

  // Videonun son 20 karesinde siyaha kararma.
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames - 1],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill>
      <Background />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          gap: 48 * scale,
          padding: (isVertical ? 80 : 120) * scale,
        }}
      >
        {/* Sequence, içindeki bileşenin "0. karesini" kaydırır: logo 0.,
            başlık 20., alt başlık 38. kareden itibaren animasyona başlar.
            layout="none" önemli — varsayılan olarak Sequence içeriğini bir
            AbsoluteFill ile sarar ve buradaki flex yerleşimini bozardı. */}
        <Sequence layout="none">
          <Logo size={(isVertical ? 300 : 220) * scale} />
        </Sequence>

        <Sequence from={20} layout="none">
          <Title text={title} fontSize={(isVertical ? 104 : 96) * scale} />
        </Sequence>

        <Sequence from={38} layout="none">
          <Subtitle text={subtitle} fontSize={(isVertical ? 44 : 36) * scale} />
        </Sequence>
      </AbsoluteFill>

      <AbsoluteFill style={{backgroundColor: 'black', opacity: fadeOut}} />
    </AbsoluteFill>
  );
};
