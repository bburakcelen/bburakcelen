// TwoSide Boys — ortak tasarım dili.
// Tüm sahneler ve karakterler bu dosyadan beslenir.

export const C = {
  // Arka plan katmanları
  bgDeep: '#0F1729',
  bgMid: '#1A2440',
  bgLift: '#243056',
  paper: '#FFF3DC',

  // Çizgi rengi — saf siyah yerine koyu lacivert, daha sıcak durur
  ink: '#151B2E',

  // Ten
  skin: '#F3C6A0',
  skinShade: '#DDA980',

  // A karakteri — uzun, sarı saç, mavi göz
  aHair: '#F2C14E',
  aHairShade: '#D9A431',
  aEye: '#3B82F6',
  aShirt: '#4F8EF7',
  aShirtShade: '#3C6FD1',

  // B karakteri — kısa, siyah saç, siyah göz
  bHair: '#232A3B',
  bHairShade: '#161C2B',
  bEye: '#20263A',
  bShirt: '#E8614A',
  bShirtShade: '#C74A36',

  // Anlam renkleri
  up: '#2ECC71',
  down: '#E74C3C',
  gold: '#F5B82E',
  goldShade: '#D69A16',
  purple: '#8B5CF6',
  cyan: '#22D3EE',
  white: '#FFFFFF',
  muted: 'rgba(255, 243, 220, 0.66)',
} as const;

export const FONT = {
  display: "'Fredoka', system-ui, sans-serif",
  body: "'Nunito', system-ui, sans-serif",
} as const;

// Videonun tamamı bu ölçüde tasarlanır; sahneler gerekirse ölçekler.
export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

// Çizgi kalınlığı — karikatür hissinin temeli kalın ve tutarlı konturlar.
export const STROKE = {
  thick: 9,
  normal: 6,
  thin: 4,
} as const;
