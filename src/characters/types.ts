export type Emotion =
  | 'neutral'
  | 'happy'
  | 'excited'
  | 'laughing'
  | 'confident'
  | 'thinking'
  | 'worried'
  | 'sad'
  | 'shocked'
  | 'defeated';

export type Pose =
  | 'idle'
  | 'point'
  | 'pointUp'
  | 'wave'
  | 'armsUp'
  | 'shrug'
  | 'thumbsUp'
  | 'facepalm'
  | 'crossed'
  | 'presenting'
  | 'handsDown';

export type HairStyle = 'messyMedium' | 'shortDark';

export type CharacterSpec = {
  readonly id: 'A' | 'B';
  readonly name: string;
  readonly hair: string;
  readonly hairShade: string;
  readonly eye: string;
  readonly shirt: string;
  readonly shirtShade: string;
  readonly pants: string;
  readonly skin: string;
  readonly skinShade: string;
  readonly hairStyle: HairStyle;
  /** Ayak tabanından kalçaya — boy farkının ana kaynağı. */
  readonly legLength: number;
  /** Kalçadan omuza. */
  readonly torsoLength: number;
  readonly headRx: number;
  readonly headRy: number;
  readonly shoulderWidth: number;
};

/** Kol açıları: 0° = aşağı, 90° = yana, 180° = yukarı. Önkol açısı üst kola görelidir. */
export type ArmAngles = {upper: number; fore: number};
export type PoseSpec = {left: ArmAngles; right: ArmAngles};
