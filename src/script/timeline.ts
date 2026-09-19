import {VIDEO} from '../theme';
import {MIN_SECONDS, buildBeats, weightOfBeat, type Beat} from './beats';
import {LOCALES, localePrefix, type LocaleId} from './text';

export type TimelineEntry = {
  readonly beat: Beat;
  readonly index: number;
  /** Master kompozisyonda başlangıç karesi. */
  readonly from: number;
  readonly durationInFrames: number;
  readonly seconds: number;
  /** Bu dildeki benzersiz kompozisyon kimliği (ör. de-s01-welcome). */
  readonly compositionId: string;
};

export type Timeline = {
  readonly locale: LocaleId;
  readonly entries: readonly TimelineEntry[];
  readonly totalFrames: number;
  readonly targetSeconds: number;
};

/**
 * Sahne sürelerini hesaplar.
 *
 * Her sahnenin payı, metnindeki kelime sayısıyla orantılı; toplam her zaman
 * o dilin targetSeconds değerine eşitlenir. Yani ses kaydının süresini
 * yazdığın anda tüm sahneler kendini ona göre ayarlar.
 *
 * `seconds` verilmiş sahneler sabit kalır. MIN_SECONDS'ın altına düşenler
 * tabana sabitlenir ve kalan süre diğerleri arasında yeniden paylaştırılır.
 */
const solveDurations = (beats: readonly Beat[], targetSeconds: number): readonly number[] => {
  const n = beats.length;
  const seconds = new Array<number>(n).fill(0);
  const locked = new Array<boolean>(n).fill(false);

  beats.forEach((b, i) => {
    if (b.seconds !== undefined) {
      seconds[i] = b.seconds;
      locked[i] = true;
    }
  });

  for (let pass = 0; pass < 6; pass++) {
    const lockedTotal = seconds.reduce((sum, s, i) => (locked[i] ? sum + s : sum), 0);
    const budget = Math.max(0, targetSeconds - lockedTotal);
    const openWeight = beats.reduce((sum, b, i) => (locked[i] ? sum : sum + weightOfBeat(b)), 0);
    if (openWeight === 0) break;

    let changed = false;
    beats.forEach((b, i) => {
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

export const buildTimeline = (locale: LocaleId): Timeline => {
  const L = LOCALES[locale];
  const beats = buildBeats(L);
  const durations = solveDurations(beats, L.targetSeconds);
  const prefix = localePrefix(locale);

  let cursor = 0;
  const entries = beats.map((beat, index) => {
    const seconds = durations[index];
    const durationInFrames = Math.max(1, Math.round(seconds * VIDEO.fps));
    const entry: TimelineEntry = {
      beat,
      index,
      from: cursor,
      durationInFrames,
      seconds,
      compositionId: `${prefix}${beat.id}`,
    };
    cursor += durationInFrames;
    return entry;
  });

  return {
    locale,
    entries,
    totalFrames: entries.reduce((n, e) => n + e.durationInFrames, 0),
    targetSeconds: L.targetSeconds,
  };
};

/** mm:ss biçiminde okunabilir zaman damgası. */
export const timecode = (frames: number): string => {
  const total = Math.round(frames / VIDEO.fps);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};
