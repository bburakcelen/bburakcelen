import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {buildTimeline} from './script/timeline';
import type {LocaleId} from './script/text';

/**
 * Tüm sahneleri baştan sona birleştiren kompozisyon.
 *
 * Sahne geçişleri bilinçli olarak sert kesim: kurgu Adobe tarafında
 * yapılacağı için her klibin süresi tam ve öngörülebilir olmalı.
 */
export const Master: React.FC<{readonly locale: LocaleId}> = ({locale}) => {
  const {entries} = buildTimeline(locale);

  return (
    <AbsoluteFill>
      {entries.map((e) => (
        <Sequence key={e.compositionId} from={e.from} durationInFrames={e.durationInFrames} name={e.compositionId}>
          {e.beat.node}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
