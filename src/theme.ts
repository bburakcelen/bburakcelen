// TwoSide Boys — sinematik sci-fi tasarım dili.
//
// Yön: neredeyse siyah bir zemin, üzerinde neon kenar ışıkları.
// Karikatür dilinden farkı: kalın siyah kontur yok, doygun düz renk yok.
// Formlar gölge ve kenar ışığıyla ayrışır — çizgiyle değil.

export const C = {
  // Zemin katmanları — mavi kayan siyahlar
  void: '#03060E',
  deep: '#070C1A',
  panel: '#0B1426',
  panelLift: '#121D38',

  // Kontur: siyah değil, gölge laciverti. Uzaktan çizgi gibi durmaz.
  line: '#16233E',
  lineLit: '#2B4170',

  // Neon aksanlar
  cyan: '#22E6FF',
  cyanDim: '#0E6F84',
  violet: '#9A6BFF',
  violetDim: '#472A85',
  amber: '#FFB23A',
  amberDim: '#8A5C14',
  green: '#2BE58E',
  greenDim: '#126B45',
  red: '#FF4D5E',
  redDim: '#8C1F2C',

  // Metin
  text: '#EAF2FF',
  textDim: 'rgba(234, 242, 255, 0.56)',
  textFaint: 'rgba(234, 242, 255, 0.26)',

  // Ten — soğuk ışık altında, desatüre
  skin: '#D6A47F',
  skinShade: '#9C6B4E',
  skinLit: '#F0C9A6',
} as const;

export const FONT = {
  /** Başlıklar — teknik, köşeli. */
  display: "'Chakra Petch', system-ui, sans-serif",
  /** Gövde metni — nötr, hafif sıkışık. */
  body: "'Barlow', system-ui, sans-serif",
  /** Sayılar, HUD okumaları, ticker'lar. */
  mono: "'JetBrains Mono', ui-monospace, monospace",
  /** Kapak manşetleri — ağır, sıkışık, uzaktan bağıran. */
  punch: "'Anton', 'Arial Black', system-ui, sans-serif",
  /** Nötr grotesk — düz renk bloklarındaki kısa cümleler için. */
  ui: "'Inter', system-ui, -apple-system, sans-serif",
} as const;

export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

// Konturlar artık ince: form gölgeyle tanımlanıyor, çizgiyle değil.
export const STROKE = {
  thick: 5,
  normal: 3.2,
  thin: 2,
} as const;

/** Neon parlaması — SVG filter yerine ucuz ve tutarlı bir drop-shadow yığını. */
export const glow = (color: string, strength = 1) =>
  `drop-shadow(0 0 ${5 * strength}px ${color}) drop-shadow(0 0 ${16 * strength}px ${color}88)`;

/** Metin için neon parlaması. */
export const textGlow = (color: string, strength = 1) =>
  `0 0 ${10 * strength}px ${color}cc, 0 0 ${34 * strength}px ${color}66`;
