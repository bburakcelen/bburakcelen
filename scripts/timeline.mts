/**
 * Sahne listesini ve zaman damgalarını yazdırır.
 *   npm run timeline           → terminale
 *   npm run timeline -- --md   → out/timeline.md dosyasına
 */
import {mkdirSync, writeFileSync} from 'node:fs';
import {TIMELINE, TOTAL_FRAMES, timecode} from '../src/script/timeline';
import {TARGET_SECONDS} from '../src/script/beats';
import {VIDEO} from '../src/theme';

const rows = TIMELINE.map((e) => ({
  no: String(e.index + 1).padStart(2, '0'),
  id: e.beat.id,
  start: timecode(e.from),
  end: timecode(e.from + e.durationInFrames),
  sec: e.seconds.toFixed(1),
  frames: e.durationInFrames,
  script: e.beat.script,
}));

const total = TOTAL_FRAMES / VIDEO.fps;
const header = `TwoSide Boys — sahne listesi
Hedef süre : ${Math.floor(TARGET_SECONDS / 60)}:${String(TARGET_SECONDS % 60).padStart(2, '0')}
Gerçekleşen: ${timecode(TOTAL_FRAMES)}  (${TOTAL_FRAMES} kare @ ${VIDEO.fps}fps)
Sahne      : ${TIMELINE.length}
`;

if (process.argv.includes('--md')) {
  const md = [
    '# TwoSide Boys — sahne listesi',
    '',
    `- **Hedef süre:** ${Math.floor(TARGET_SECONDS / 60)}:${String(TARGET_SECONDS % 60).padStart(2, '0')}`,
    `- **Gerçekleşen:** ${timecode(TOTAL_FRAMES)} (${TOTAL_FRAMES} kare @ ${VIDEO.fps}fps)`,
    `- **Sahne sayısı:** ${TIMELINE.length}`,
    '',
    '| # | Sahne | Başlangıç | Bitiş | Süre | Kare | Anlatım |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map(
      (r) =>
        `| ${r.no} | \`${r.id}\` | ${r.start} | ${r.end} | ${r.sec}s | ${r.frames} | ${r.script.replace(/\|/g, '\\|')} |`,
    ),
    '',
  ].join('\n');
  mkdirSync('out', {recursive: true});
  writeFileSync('out/timeline.md', md);
  console.log(header);
  console.log('→ out/timeline.md yazıldı');
} else {
  console.log(header);
  console.log(
    ['#'.padStart(3), 'sahne'.padEnd(22), 'başlar'.padEnd(7), 'süre'.padStart(6), 'kare'.padStart(6)].join(' '),
  );
  for (const r of rows) {
    console.log([r.no.padStart(3), r.id.padEnd(22), r.start.padEnd(7), `${r.sec}s`.padStart(6), String(r.frames).padStart(6)].join(' '));
  }
}
