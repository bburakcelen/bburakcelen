/**
 * Tüm sahneleri tek tek render eder.
 *   node scripts/render-all.mjs            → her sahneden bir PNG (hızlı kontrol)
 *   node scripts/render-all.mjs --video    → her sahneden bir MP4 klip
 *
 * Adobe'a alacağın klipleri üretmek için --video kullan.
 */
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';

const video = process.argv.includes('--video');
const browser = process.env.REMOTION_BROWSER;
const outDir = video ? 'out/clips' : 'out/frames';
mkdirSync(outDir, {recursive: true});

// Sahne kimliklerini Remotion'un kendi listesinden al.
// Not: tarayıcı yolu burada da geçilmeli — yoksa Remotion kendi Chrome'unu
// indirmeye çalışır ve kapalı ağlarda bu adım başarısız olur.
const listArgs = ['remotion', 'compositions', 'src/index.ts'];
if (browser) listArgs.push(`--browser-executable=${browser}`);
const raw = execFileSync('npx', listArgs, {encoding: 'utf8'});
const ids = raw
  .split('\n')
  .map((l) => l.trim().split(/\s+/)[0])
  .filter((id) => /^s\d{2}-/.test(id));

console.log(`${ids.length} sahne bulundu → ${outDir}`);

let ok = 0;
const failed = [];

for (const [i, id] of ids.entries()) {
  const target = video ? `${outDir}/${id}.mp4` : `${outDir}/${id}.png`;
  const args = video
    ? ['remotion', 'render', id, target]
    : ['remotion', 'still', id, target, '--frame=40'];
  if (browser) args.push(`--browser-executable=${browser}`);

  process.stdout.write(`[${String(i + 1).padStart(2)}/${ids.length}] ${id} … `);
  try {
    execFileSync('npx', args, {stdio: 'pipe'});
    console.log('✓');
    ok++;
  } catch (err) {
    console.log('✗');
    failed.push(id);
  }
}

console.log(`\nBitti: ${ok} başarılı, ${failed.length} hatalı`);
if (failed.length) {
  console.log('Hatalı sahneler:', failed.join(', '));
  process.exit(1);
}
