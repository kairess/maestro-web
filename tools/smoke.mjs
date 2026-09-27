// Headless smoke test: drives the app in Chrome, captures console errors and screenshots.
// Usage: node tools/smoke.mjs [mode=bot|keys|camera] [outDir]
import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const mode = process.argv[2] ?? 'bot';
const outDir = process.argv[3] ?? 'smoke-out';
const url = process.env.SMOKE_URL ?? 'http://localhost:5173/';
mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  acceptInsecureCerts: true,
  args: [
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    '--autoplay-policy=no-user-gesture-required',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    '--window-size=1280,800',
  ],
  defaultViewport: { width: 1280, height: 800 },
});
const page = await browser.newPage();
const errors = [];
page.on('console', (m) => {
  const t = m.type();
  if (t === 'error' || t === 'warn') errors.push(`[${t}] ${m.text()}`);
  else console.log(`[console.${t}] ${m.text()}`);
});
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
page.on('requestfailed', (r) => errors.push(`[requestfailed] ${r.url()} ${r.failure()?.errorText}`));

const shot = async (name) => {
  await page.screenshot({ path: join(outDir, `${name}.png`) });
  console.log('screenshot', name);
};

await page.goto(`${url}?input=${mode}&debug=1`, { waitUntil: 'networkidle0' });
await shot('01-title');
await page.click('#btn-start');

if (mode === 'camera') {
  await page.waitForSelector('#screen-calib.show', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 15000));
  await shot('02-calib');
  const text = await page.$eval('#calib-text', (e) => e.textContent);
  console.log('calib text:', text);
} else {
  await page.waitForFunction(() => document.querySelector('#hud')?.classList.contains('show'), { timeout: 30000 });
  await new Promise((r) => setTimeout(r, 3500));
  await shot('02-preroll-end');
  await new Promise((r) => setTimeout(r, 6000));
  await shot('03-play');
  const panel = await page.$eval('#debug-panel', (e) => e.textContent);
  console.log('debug panel:\n' + panel);
  const score = await page.$eval('#hud-score', (e) => e.textContent);
  console.log('score:', score);
  if (mode === 'keys') {
    await page.keyboard.press('ArrowDown');
    await new Promise((r) => setTimeout(r, 300));
    await page.keyboard.press('ArrowUp');
    await new Promise((r) => setTimeout(r, 500));
    await shot('04-keys');
  }
}

console.log(errors.length ? `ERRORS (${errors.length}):\n${errors.join('\n')}` : 'no console errors');
await browser.close();
process.exit(errors.some((e) => e.startsWith('[pageerror]')) ? 1 : 0);
