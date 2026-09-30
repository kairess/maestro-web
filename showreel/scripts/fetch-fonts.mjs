// Downloads the reel's fonts into showreel/fonts/ (not committed):
//  - Pretendard (static woff2, jsDelivr)
//  - Noto Serif KR, Playfair Display, JetBrains Mono (Google Fonts), rewritten to local files in fonts/local.css
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const OUT = resolve(import.meta.dirname, '../fonts');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';
const GOOGLE = 'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@700;900&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700;1,900&family=JetBrains+Mono:wght@400;500;700&display=block';
const PRETENDARD = ['Thin', 'Light', 'Regular', 'Medium', 'SemiBold', 'Bold', 'ExtraBold', 'Black'];

mkdirSync(join(OUT, 'g'), { recursive: true });
async function download(url, file) {
  if (existsSync(file)) return;
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  writeFileSync(file, Buffer.from(await r.arrayBuffer()));
}
async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await fn(items[i++]); }));
}

await pool(PRETENDARD, 4, (w) => download(`https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/woff2/Pretendard-${w}.woff2`, join(OUT, `Pretendard-${w}.woff2`)));

const css = await (await fetch(GOOGLE, { headers: { 'User-Agent': UA } })).text();
const urls = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)]+/g))];
const local = (u) => u.replace('https://fonts.gstatic.com/', '').replace(/\//g, '_');
await pool(urls, 16, (u) => download(u, join(OUT, 'g', local(u))));
writeFileSync(join(OUT, 'local.css'), css.replace(/https:\/\/fonts\.gstatic\.com\/[^)]+/g, (u) => `g/${local(u)}`));
console.log(`fonts ready → ${OUT} (${PRETENDARD.length} Pretendard + ${urls.length} Google font files)`);
