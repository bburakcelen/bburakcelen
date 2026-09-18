import {VIDEO} from '../theme';
import {BEATS, MIN_SECONDS, TARGET_SECONDS, weightOfBeat, type Beat} from './beats';

export type TimelineEntry = {
  readonly beat: Beat;
  readonly index: number;
  /** Master kompozisyonda başlangıç karesi. */
  readonly from: number;
  readonly durationInFrames: number;
  readonly seconds: number;
};

/**
 * Sahne sürelerini hesaplar.
 *
 * Mantık: her sahnenin payı, metnindeki kelime sayısıyla orantılı.
 * Toplam her zaman TARGET_SECONDS'a eşitlenir — yani ses kaydının süresini
 * yazdığın anda tüm sahneler kendini ona göre ayarlar.
 *
 * `seconds` verilmiş sahneler sabit kalır (komik zamanlama gibi yerlerde
 * orantı değil, elle ayar isteriz). MIN_SECONDS'ın altına düşen sahneler
 * tabana sabitlenir ve kalan süre diğerleri arasında yeniden paylaştırılır.
 */
const solveDurations = (): readonly number[] => {
  const n = BEATS.length;
  const seconds = new Array<number>(n).fill(0);
  const locked = new Array<boolean>(n).fill(false);

  BEATS.forEach((b, i) => {
    if (b.seconds !== undefined) {
      seconds[i] = b.seconds;
      locked[i] = true;
    }
  });

  // Kilitlenen sahneler arttıkça kalan bütçe daralır; birkaç turda dengelenir.
  for (let pass = 0; pass < 6; pass++) {
    const lockedTotal = seconds.reduce((sum, s, i) => (locked[i] ? sum + s : sum), 0);
    const budget = Math.max(0, TARGET_SECONDS - lockedTotal);
    const openWeight = BEATS.reduce((sum, b, i) => (locked[i] ? sum : sum + weightOfBeat(b)), 0);
    if (openWeight === 0) break;

    let changed = false;
    BEATS.forEach((b, i) => {
      if (locked[i]) return;
      const share = (budget * weightOfBeat(b)) / openWeight;
      if (share < MIN_SECONDS) {
        seconds[i] = MIN_SECONDS;
        locked[i] = true;
        changed = true;
      } else {
        seconds[i] = share;
      }
    });
    if (!changed) break;
  }

  return seconds;
};

const build = (): readonly TimelineEntry[] => {
  const durations = solveDurations();
  let cursor = 0;

  return BEATS.map((beat, index) => {
    const seconds = durations[index];
    const durationInFrames = Math.max(1, Math.round(seconds * VIDEO.fps));
    const entry: TimelineEntry = {beat, index, from: cursor, durationInFrames, seconds};
    cursor += durationInFrames;
    return entry;
  });
};

export const TIMELINE = build();

export const TOTAL_FRAMES = TIMELINE.reduce((n, e) => n + e.durationInFrames, 0);

/** mm:ss biçiminde okunabilir zaman damgası. */
export const timecode = (frames: number): string => {
  const total = Math.round(frames / VIDEO.fps);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};
