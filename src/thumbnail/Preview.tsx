import React from 'react';
import {AbsoluteFill} from 'remotion';
import {GoldCoin, Silhouette} from './figure';

/** Geliştirme önizlemesi — siluet ve madeni büyük ölçekte kontrol etmek için. */
export const FigurePreview: React.FC = () => (
  <AbsoluteFill
    style={{
      background: '#12161E',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: 40,
      padding: 40,
    }}
  >
    <div style={{flexShrink: 0}}>
      <Silhouette height={640} rim="#9FE8FF" broad={1} />
    </div>
    <div style={{flexShrink: 0}}>
      <Silhouette height={560} rim="#FFC46B" broad={1.12} />
    </div>
    <div style={{flexShrink: 0}}>
      <GoldCoin size={300} />
    </div>
  </AbsoluteFill>
);
