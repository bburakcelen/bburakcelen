/**
 * Sahne listesini ve zaman damgalarını yazdırır.
 *   npm run timeline              → İngilizce, terminale
 *   npm run timeline:de           → Almanca
 *   npm run timeline -- --md      → out/timeline-<dil>.md dosyasına
 */
import {mkdirSync, writeFileSync} from 'node:fs';
import {buildTimeline, timecode} from '../src/script/timeline';
import type {LocaleId} from '../src/script/text';
import {VIDEO} from '../src/theme';

const args = process.argv.slice(2);
const locale: LocaleId = args.includes('--de') ? 'de' : 'en';
const {entries, totalFrames, targetSeconds} = buildTimeline(locale);

const rows = entries.map((e) => ({
  no: String(e.index + 1).padStart(2, '0'),
  id: e.compositionId,
  start: timecode(e.from),
  end: timecode(e.from + e.durationInFrames),
  sec: e.seconds.toFixed(1),
  frames: e.durationInFrames,
  script: e.beat.script,
}));

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
const header = `TwoSide Boys — sahne listesi (${locale.toUpperCase()})
Hedef süre : ${mmss(targetSeconds)}
Gerçekleşen: ${timecode(totalFrames)}  (${totalFrames} kare @ ${VIDEO.fps}fps)
Sahne      : ${entries.length}
`;

if (args.includes('--md')) {
  const md = [
    `# TwoSide Boys — sahne listesi (${locale.toUpperCase()})`,
    '',
    `- **Hedef süre:** ${mmss(targetSeconds)}`,
    `- **Gerçekleşen:** ${timecode(totalFrames)} (${totalFrames} kare @ ${VIDEO.fps}fps)`,
    `- **Sahne sayısı:** ${entries.length}`,
    '',
    '| # | Sahne | Başlangıç | Bitiş | Süre | Kare | Anlatım |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map(
      (r) => `| ${r.no} | \`${r.id}\` | ${r.start} | ${r.end} | ${r.sec}s | ${r.frames} | ${r.script.replace(/\|/g, '\\|')} |`,
    ),
    '',
  ].join('\n');
  mkdirSync('out', {recursive: true});
  writeFileSync(`out/timeline-${locale}.md`, md);
  console.log(header);
  console.log(`→ out/timeline-${locale}.md yazıldı`);
} else {
  console.log(header);
  console.log(['#'.padStart(3), 'sahne'.padEnd(24), 'başlar'.padEnd(7), 'süre'.padStart(6), 'kare'.padStart(6)].join(' '));
  for (const r of rows) {
    console.log([r.no.padStart(3), r.id.padEnd(24), r.start.padEnd(7), `${r.sec}s`.padStart(6), String(r.frames).padStart(6)].join(' '));
  }
}
