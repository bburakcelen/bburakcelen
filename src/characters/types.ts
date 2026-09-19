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
  /** Kanaldaki rolü — sahne yazarken hangisinin nerede olduğunu hatırlatır. */
  readonly role: string;

  // Saç
  readonly hair: string;
  readonly hairShade: string;
  readonly hairStyle: HairStyle;

  // Göz
  readonly eye: string;
  readonly eyeGlow: string;

  // Ceket — düz renk değil, gradyanla hacim kazanır
  readonly jacket: string;
  readonly jacketLit: string;
  readonly jacketShade: string;
  /** Ceket üzerindeki neon şerit ve kenar ışığının rengi. */
  readonly accent: string;
  readonly accentDim: string;

  readonly pants: string;
  readonly skin: string;
  readonly skinShade: string;
  readonly skinLit: string;
  /** Ten gradyanının en dip tonu. Verilmezse sıcak bir gölge kullanılır. */
  readonly skinDeep?: string;
  /** Boyun rengi — yakanın altında kalan dar şerit. */
  readonly neck?: string;

  // İskelet ölçüleri
  readonly legLength: number;
  readonly torsoLength: number;
  readonly headRx: number;
  readonly headRy: number;
  readonly shoulderWidth: number;
};

/** Kol açıları: 0° = aşağı, 90° = yana, 180° = yukarı. Önkol açısı üst kola görelidir. */
export type ArmAngles = {upper: number; fore: number};
export type PoseSpec = {left: ArmAngles; right: ArmAngles};
