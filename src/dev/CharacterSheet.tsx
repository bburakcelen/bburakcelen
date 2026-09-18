import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character} from '../characters/Character';
import {A, B} from '../characters/presets';
import {C, FONT} from '../theme';
import {Grade} from '../effects/Grade';
import type {Emotion, Pose} from '../characters/types';

// Geliştirme amaçlı kontrol sayfası. Final videoda kullanılmaz.

const EMOTIONS: Emotion[] = [
  'neutral', 'happy', 'excited', 'laughing', 'confident',
  'thinking', 'worried', 'sad', 'shocked', 'defeated',
];

const POSES: Pose[] = [
  'idle', 'point', 'pointUp', 'wave', 'armsUp',
  'shrug', 'thumbsUp', 'facepalm', 'crossed', 'presenting',
];

const Label: React.FC<{readonly children: React.ReactNode}> = ({children}) => (
  <div style={{fontFamily: FONT.mono, fontSize: 16, fontWeight: 500, color: C.textDim, marginTop: 8, letterSpacing: '0.04em'}}>
    {children}
  </div>
);

export const CharacterSheet: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: C.deep, padding: 40}}>
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 46, height: 540}}>
      <div style={{textAlign: 'center'}}>
        <Character spec={A} height={520} emotion="confident" pose="presenting" talking />
        <Label>A · airdrop / fırsat</Label>
      </div>
      <div style={{textAlign: 'center'}}>
        <Character spec={B} height={520} emotion="confident" pose="crossed" />
        <Label>B · futures / spot</Label>
      </div>
      <div style={{flex: 1, display: 'flex', gap: 10, alignItems: 'flex-end'}}>
        {POSES.map((p) => (
          <div key={p} style={{textAlign: 'center'}}>
            <Character spec={A} height={310} pose={p} emotion="neutral" />
            <Label>{p}</Label>
          </div>
        ))}
      </div>
    </div>

    <div style={{display: 'flex', gap: 10, marginTop: 26}}>
      {EMOTIONS.map((e) => (
        <div key={e} style={{textAlign: 'center'}}>
          <Character spec={A} height={195} emotion={e} crop="head" />
          <Label>{e}</Label>
        </div>
      ))}
    </div>
    <div style={{display: 'flex', gap: 10, marginTop: 12}}>
      {EMOTIONS.map((e) => (
        <div key={e} style={{textAlign: 'center'}}>
          <Character spec={B} height={195} emotion={e} crop="head" />
        </div>
      ))}
    </div>

    <Grade grain={0.05} scanlines={0.1} vignette={0.7} bloom={C.cyan} bloomStrength={0.6} />
  </AbsoluteFill>
);
