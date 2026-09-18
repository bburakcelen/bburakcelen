import React from 'react';
import {Composition} from 'remotion';
import {CharacterSheet} from './dev/CharacterSheet';
import {ContactSheet} from './dev/ContactSheet';
import {loadFonts} from './fonts';
import {Master} from './Master';
import {TIMELINE, TOTAL_FRAMES} from './script/timeline';
import {VIDEO} from './theme';

loadFonts();

/**
 * Her sahne HEM master videonun içinde HEM de kendi başına bir kompozisyon.
 * Böylece istersen 8 dakikalık tek dosyayı, istersen tek tek klipleri
 * render alıp Adobe'da dizebilirsin.
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Master"
      component={Master}
      durationInFrames={TOTAL_FRAMES}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />

    {TIMELINE.map((e) => (
      <Composition
        key={e.beat.id}
        id={e.beat.id}
        component={() => <>{e.beat.node}</>}
        durationInFrames={e.durationInFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    ))}

    {[0, 1, 2, 3].map((page) => (
      <Composition
        key={page}
        id={`DevContactSheet${page + 1}`}
        component={ContactSheet}
        durationInFrames={60}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{page}}
      />
    ))}

    <Composition
      id="DevCharacterSheet"
      component={CharacterSheet}
      durationInFrames={120}
      fps={VIDEO.fps}
      width={1920}
      height={1200}
    />
  </>
);
