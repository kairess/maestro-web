// Deterministic, song-synced gameplay capture (bot input, Hard chart) on virtual time.
// Frame i is captured at song time exactly i / FPS, so the reel can show frame round(songTime * 60).
// Needs the patched game build from scripts/prepare-game.sh (build/game/dist).
// Usage (from showreel/): node scripts/capture-gameplay.mjs <outDir> <from> <to> [botfail=<s>] [only=i,j,k] [swiftshader=1]
import puppeteer from 'puppeteer-core';
import { createServer } from 'node:http';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const DIST = normalize(join(HERE, '../build/game/dist'));
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const FPS = 60;
const PREROLL_MS = 3000;

const [outDir, fromArg, toArg, ...rest] = process.argv.slice(2);
const opts = Object.fromEntries(rest.map((a) => a.split('=')));
const from = Number(fromArg ?? 0);
const to = Number(toArg ?? 1800);
const only = opts.only ? new Set(opts.only.split(',').map(Number)) : null;
mkdirSync(outDir, { recursive: true });

// ---------------------------------------------------------------- static server for game/dist
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.ogg': 'audio/ogg', '.jpg': 'image/jpeg', '.png': 'image/png', '.wasm': 'application/wasm', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = normalize(join(DIST, p));
  if (!file.startsWith(DIST)) return res.writeHead(403).end();
  try {
    if (statSync(file).isDirectory()) file = join(file, 'index.html');
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

// ---------------------------------------------------------------- virtual time, injected at document start
const VIRTUAL_TIME = () => {
  const perfBase = performance.now();
  let vNow = 0; // virtual ms since document start
  performance.now = () => perfBase + vNow;
  let rafQ = new Map();
  let rafId = 0;
  window.requestAnimationFrame = (cb) => {
    rafQ.set(++rafId, cb);
    return rafId;
  };
  window.cancelAnimationFrame = (id) => rafQ.delete(id);
  const timers = new Map();
  let timerId = 0;
  window.setTimeout = (cb, ms = 0, ...args) => {
    timers.set(++timerId, { at: vNow + Math.max(0, Number(ms) || 0), cb, args });
    return timerId;
  };
  window.clearTimeout = (id) => timers.delete(id);
  Object.defineProperty(BaseAudioContext.prototype, 'currentTime', { configurable: true, get: () => vNow / 1000 });
  // Keep the WebGL drawing buffer so screenshots always see the last rendered frame.
  const getContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, attrs) {
    if (type === 'webgl' || type === 'webgl2') attrs = { ...(attrs || {}), preserveDrawingBuffer: true };
    return getContext.call(this, type, attrs);
  };
  const animStart = new WeakMap();
  window.__vnow = () => vNow;
  window.__advanceTo = (target) => {
    for (;;) {
      let next = null;
      for (const [id, t] of timers) if (t.at <= target && (!next || t.at < next[1].at)) next = [id, t];
      if (!next) break;
      timers.delete(next[0]);
      vNow = Math.max(vNow, next[1].at);
      try {
        typeof next[1].cb === 'function' ? next[1].cb(...next[1].args) : 0;
      } catch (e) {
        console.error(e);
      }
    }
    vNow = target;
    const q = rafQ;
    rafQ = new Map();
    for (const cb of q.values()) {
      try {
        cb(perfBase + vNow);
      } catch (e) {
        console.error(e);
      }
    }
    // CSS transitions/animations follow virtual time too.
    for (const a of document.getAnimations()) {
      let s = animStart.get(a);
      if (s === undefined) {
        s = vNow;
        animStart.set(a, s);
        a.pause();
      }
      a.currentTime = vNow - s;
    }
    return vNow;
  };
};

// ---------------------------------------------------------------- browser
const gpuArgs = opts.swiftshader ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] : ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'];
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--mute-audio', '--autoplay-policy=no-user-gesture-required', '--hide-scrollbars', ...gpuArgs],
  defaultViewport: { width: 1280, height: 720, deviceScaleFactor: 1.5 },
});
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
page.on('console', (m) => (m.type() === 'error' || m.type() === 'warn') && errors.push(`[${m.type()}] ${m.text()}`));
await page.evaluateOnNewDocument(VIRTUAL_TIME);

const fail = opts.botfail ? `&botfail=${opts.botfail}` : '';
await page.goto(`http://127.0.0.1:${port}/?input=bot&chart=Verdi_DiesIrae_Hard&profile=original${fail}`, { waitUntil: 'networkidle0' });
const gl = await page.evaluate(() => {
  const c = document.createElement('canvas').getContext('webgl2');
  const ext = c && c.getExtension('WEBGL_debug_renderer_info');
  return ext ? c.getParameter(ext.UNMASKED_RENDERER_WEBGL) : String(c && c.getParameter(c.RENDERER));
});
console.log('WebGL renderer:', gl);

await page.click('#btn-start');
const t0 = Date.now();
while (!(await page.evaluate(() => document.getElementById('hud').classList.contains('show')))) {
  if (Date.now() - t0 > 60000) throw new Error('HUD never showed: ' + errors.join('\n'));
  await new Promise((r) => setTimeout(r, 50));
}
const V0 = await page.evaluate(() => window.__vnow());
console.log('session started at virtual ms', V0);

const cdp = await page.createCDPSession();
const songMs = (i) => V0 + PREROLL_MS + (i * 1000) / FPS;
// Step every frame from the start of the preroll so filters and velocities see real frame spacing.
const firstFrame = -Math.round((PREROLL_MS / 1000) * FPS) + 1;
const started = Date.now();
let shots = 0;
for (let i = firstFrame; i <= to; i++) {
  await page.evaluate((ms) => window.__advanceTo(ms), songMs(i));
  if (i < from || (only && !only.has(i))) continue;
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 90, optimizeForSpeed: true, clip: { x: 0, y: 0, width: 1280, height: 720, scale: 1.5 } });
  writeFileSync(join(outDir, `${String(i).padStart(5, '0')}.jpg`), Buffer.from(data, 'base64'));
  shots++;
  if (shots % 120 === 0) {
    const info = await page.evaluate(() => ({ p: document.getElementById('hud-progress-fill').style.width, s: document.getElementById('hud-score').textContent }));
    console.log(`frame ${i} (song ${(i / FPS).toFixed(3)}s) progress ${info.p} score ${info.s} · ${((Date.now() - started) / shots).toFixed(0)} ms/frame`);
  }
}
const info = await page.evaluate(() => ({ p: document.getElementById('hud-progress-fill').style.width, s: document.getElementById('hud-score').textContent }));
console.log('final', info, 'shots', shots);
console.log(errors.length ? `console issues (${errors.length}):\n${errors.slice(0, 20).join('\n')}` : 'no console errors');
await browser.close();
server.close();
