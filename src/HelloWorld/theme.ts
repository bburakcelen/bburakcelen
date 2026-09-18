// Animasyon boyunca kullanılan ortak tasarım değerleri.
// Tek yerden değiştirince tüm sahneler güncellenir.

export const COLORS = {
  backgroundFrom: '#0b1020',
  backgroundVia: '#131a35',
  backgroundTo: '#1d1140',
  accent: '#5b8cff',
  accentSoft: '#8b5cf6',
  text: '#f5f7ff',
  textMuted: 'rgba(245, 247, 255, 0.62)',
} as const;

// Sistem font yığını: ek bağımlılık ya da internet gerektirmez.
// Marka fontu kullanmak istersen public/ altına .woff2 koyup
// staticFile() ile @font-face tanımlaman yeterli.
export const FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
