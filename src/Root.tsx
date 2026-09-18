import React from 'react';
import {Composition} from 'remotion';
import {HelloWorld, helloWorldDefaultProps} from './HelloWorld';

// Her <Composition /> Studio'da ve render sırasında ayrı bir video olarak görünür.
// Yeni bir animasyon eklemek için buraya yeni bir Composition eklemen yeterli.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Yatay / 16:9 — YouTube, web, sunum */}
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={helloWorldDefaultProps}
      />

      {/* Dikey / 9:16 — Reels, Shorts, TikTok.
          Aynı bileşen, farklı en-boy oranı: bileşenler useVideoConfig() ile
          kendilerini ölçülere göre ayarlıyor. */}
      <Composition
        id="HelloWorldVertical"
        component={HelloWorld}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={helloWorldDefaultProps}
      />
    </>
  );
};
