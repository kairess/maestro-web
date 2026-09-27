// Captures gameplay screenshots at chosen song times with the bot playing (visual design check).
// Usage: SMOKE_URL=https://localhost:5173/ node tools/smoke-design.mjs [outDir] [t1,t2,...]
import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.argv[2] ?? 'smoke-out/design';
const times = (process.argv[3] ?? '3.2,10.5,48.3,49.6,66.9').split(',').map(Number);
const url = process.env.SMOKE_URL ?? 'https://localhost:5173/';
mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  acceptInsecureCerts: true,
  args: ['--autoplay-policy=no-user-gesture-required', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--window-size=1280,720'],
  defaultViewport: { width: 1280, height: 720 },
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`[error] ${m.text()}`));

await page.goto(`${url}?input=${process.env.INPUT ?? "bot"}`, { waitUntil: 'networkidle0' });
await page.click('#btn-start');
await page.waitForFunction(() => document.querySelector('#hud')?.classList.contains('show'), { timeout: 30000 });
const songZero = Date.now() + 3000; // preroll
for (const t of times) {
  const wait = songZero + t * 1000 - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  const name = `t${t.toFixed(1).padStart(5, '0')}`;
  await page.screenshot({ path: join(outDir, `${name}.png`) });
  console.log('shot', name, 'score', await page.$eval('#hud-score', (e) => e.textContent));
}
console.log(errors.length ? errors.join('\n') : 'no errors');
await browser.close();
