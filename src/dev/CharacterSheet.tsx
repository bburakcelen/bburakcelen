import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character} from '../characters/Character';
import {A, B} from '../characters/presets';
import {C, FONT} from '../theme';
import type {Emotion, Pose} from '../characters/types';

// Geliştirme amaçlı kontrol sayfası — karakterleri tüm duygu ve pozlarda
// yan yana görmek için. Final videoda kullanılmaz.

const EMOTIONS: Emotion[] = [
  'neutral', 'happy', 'excited', 'laughing', 'confident',
  'thinking', 'worried', 'sad', 'shocked', 'defeated',
];

const POSES: Pose[] = [
  'idle', 'point', 'pointUp', 'wave', 'armsUp',
  'shrug', 'thumbsUp', 'facepalm', 'crossed', 'presenting',
];

const Label: React.FC<{readonly children: React.ReactNode}> = ({children}) => (
  <div style={{fontFamily: FONT.body, fontSize: 19, fontWeight: 700, color: C.muted, marginTop: 6}}>
    {children}
  </div>
);

export const CharacterSheet: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.bgDeep, padding: 40}}>
    {/* Boy karşılaştırması */}
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 40, height: 520}}>
      <div style={{textAlign: 'center'}}>
        <Character spec={A} height={500} emotion="happy" pose="wave" talking />
        <Label>A — uzun, sarı, mavi göz</Label>
      </div>
      <div style={{textAlign: 'center'}}>
        <Character spec={B} height={500} emotion="confident" pose="crossed" />
        <Label>B — kısa, siyah, siyah göz</Label>
      </div>
      <div style={{flex: 1, display: 'flex', gap: 14, alignItems: 'flex-end'}}>
        {POSES.map((p) => (
          <div key={p} style={{textAlign: 'center'}}>
            <Character spec={A} height={300} pose={p} emotion="neutral" />
            <Label>{p}</Label>
          </div>
        ))}
      </div>
    </div>

    {/* Duygu şeridi */}
    <div style={{display: 'flex', gap: 10, marginTop: 30}}>
      {EMOTIONS.map((e) => (
        <div key={e} style={{textAlign: 'center'}}>
          <Character spec={A} height={190} emotion={e} crop="head" />
          <Label>{e}</Label>
        </div>
      ))}
    </div>
    <div style={{display: 'flex', gap: 10, marginTop: 14}}>
      {EMOTIONS.map((e) => (
        <div key={e} style={{textAlign: 'center'}}>
          <Character spec={B} height={190} emotion={e} crop="head" />
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
