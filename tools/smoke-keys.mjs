// Timed keyboard smoke test: presses arrow keys on the first few Easy gestures and checks they register.
import puppeteer from 'puppeteer';
import { readFileSync } from 'node:fs';

const url = process.env.SMOKE_URL ?? 'http://localhost:5173/';
const chart = JSON.parse(readFileSync(new URL('../public/charts/Verdi_DiesIrae_Easy.json', import.meta.url), 'utf8'));
// First single-hand gestures: beats 18..23 alternate Down/Up.
const targets = chart.gestures.filter((g) => g.tokens.length === 1).slice(0, 6);

const browser = await puppeteer.launch({
  headless: true,
  acceptInsecureCerts: true,
  args: ['--autoplay-policy=no-user-gesture-required', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  defaultViewport: { width: 1280, height: 800 },
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(`${url}?input=keys&debug=1`, { waitUntil: 'networkidle0' });
await page.click('#btn-start');
await page.waitForFunction(() => document.querySelector('#hud')?.classList.contains('show'), { timeout: 30000 });

const songTime = async () => {
  const txt = await page.$eval('#debug-panel', (e) => e.textContent);
  const m = /songTime: ([-\d.]+)/.exec(txt);
  return m ? Number(m[1]) : NaN;
};

for (const g of targets) {
  const key = g.tokens[0] === 'Down' ? 'ArrowDown' : g.tokens[0] === 'Up' ? 'ArrowUp' : g.tokens[0] === 'Left' ? 'ArrowLeft' : 'ArrowRight';
  // Press ~120 ms before the beat: the synthetic stroke peaks ~125 ms after keydown.
  while ((await songTime()) < g.time - 0.12) await new Promise((r) => setTimeout(r, 10));
  await page.keyboard.press(key);
  console.log(`pressed ${key} for ${g.tokens[0]} @ ${g.time.toFixed(2)}`);
}
await new Promise((r) => setTimeout(r, 800));
const panel = await page.$eval('#debug-panel', (e) => e.textContent);
console.log(panel.split('\n').filter((l) => /G\d+ /.test(l)).join('\n'));
console.log(errors.length ? `page errors: ${errors.join('; ')}` : 'no page errors');
await browser.close();
