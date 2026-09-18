import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {TIMELINE} from './script/timeline';

/**
 * Tüm sahneleri baştan sona birleştiren kompozisyon.
 *
 * Sahne geçişleri bilinçli olarak sert kesim: kurgu Adobe tarafında
 * yapılacağı için her klibin süresi tam ve öngörülebilir olmalı.
 * Yumuşak geçiş istersen Premiere'de eklemek daha esnek.
 */
export const Master: React.FC = () => (
  <AbsoluteFill>
    {TIMELINE.map((e) => (
      <Sequence key={e.beat.id} from={e.from} durationInFrames={e.durationInFrames} name={e.beat.id}>
        {e.beat.node}
      </Sequence>
    ))}
  </AbsoluteFill>
);
