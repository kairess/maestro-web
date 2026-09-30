// Renders the reel (index.html + reel.js) frame by frame with headless Chrome.
// Usage (from showreel/):
//   node scripts/render.mjs preview <songTimes, comma separated> [outDir]   -> JPEG stills at song times
//   node scripts/render.mjs mb <fromFrame> <toFrame> [outDir] [workers]      -> motion-blurred lossless chunks
// Video frame f is at song time f/60 - 0.5 (the reel opens with a 0.5 s upbeat).
import puppeteer from 'puppeteer-core';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const REPO = resolve(ROOT, '..');
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
// Files served from the game repo instead of being copied into showreel/.
const ALIASES = { '/stage.jpg': join(REPO, 'public/stage/stage.jpg') };
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json' };

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const p = ALIASES[url] ?? join(ROOT, url);
  if (!(p.startsWith(ROOT) || Object.values(ALIASES).includes(p)) || !existsSync(p) || statSync(p).isDirectory()) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(p)] || 'application/octet-stream', 'Cache-Control': 'max-age=3600' });
  createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const PORT = server.address().port;

// One browser per worker: background tabs get throttled and stall.
const browsers = [];
async function openPage() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    protocolTimeout: 120000,
    args: ['--hide-scrollbars', '--force-color-profile=srgb', '--disable-lcd-text', '--font-render-hinting=none', '--ignore-gpu-blocklist', '--enable-gpu-rasterization',
      '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'],
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
  });
  browsers.push(browser);
  const [page] = await browser.pages();
  page.on('pageerror', (e) => console.error('[pageerror]', e.message));
  page.on('console', (m) => {
    if ((m.type() === 'error' || m.type() === 'warn') && !m.text().includes('404')) console.error('[console]', m.text());
  });
  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'load' });
  await page.evaluate(() => window.reelReady);
  const cdp = await page.createCDPSession();
  return { page, cdp };
}
async function shot(cdp, format, quality) {
  const r = await cdp.send('Page.captureScreenshot', { format, quality, captureBeyondViewport: false, optimizeForSpeed: true });
  return Buffer.from(r.data, 'base64');
}

const [mode, a1, a2, a3, a4] = process.argv.slice(2);
const t0 = Date.now();
if (mode === 'preview') {
  const out = resolve(a2 ?? join(ROOT, 'preview'));
  mkdirSync(out, { recursive: true });
  const { page, cdp } = await openPage();
  for (const tok of a1.split(',')) {
    const s = Number(tok);
    await page.evaluate((f) => window.renderFrame(f), Math.round((s + 0.5) * 60));
    writeFileSync(join(out, `s${s.toFixed(2).padStart(5, '0')}.jpg`), await shot(cdp, 'jpeg', 88));
  }
  console.log('preview done →', out, ((Date.now() - t0) / 1000).toFixed(1), 's');
} else if (mode === 'mb') {
  // Motion blur: 4 sub-frames per output frame spread over a 180° shutter, averaged by ffmpeg (tmix)
  // into one lossless chunk per worker.
  const from = Number(a1), to = Number(a2), out = resolve(a3 ?? join(ROOT, 'out/chunks')), workers = Number(a4 ?? 6);
  const SUB = [-0.1875, -0.0625, 0.0625, 0.1875];
  mkdirSync(out, { recursive: true });
  const total = to - from + 1;
  const per = Math.ceil(total / workers);
  let done = 0;
  await Promise.all(Array.from({ length: workers }, async (_, w) => {
    const lo = from + w * per, hi = Math.min(to, lo + per - 1);
    if (lo > hi) return;
    const file = join(out, `chunk_${String(lo).padStart(5, '0')}.mkv`);
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-c:v', 'png', '-framerate', '240', '-i', '-',
      '-vf', "tmix=frames=4:weights='1 1 1 1',select='eq(mod(n\\,4)\\,3)',setpts=N/(60*TB)",
      '-fps_mode', 'passthrough', '-c:v', 'libx264', '-preset', 'ultrafast', '-qp', '0', '-pix_fmt', 'yuv444p', file], { stdio: ['pipe', 'inherit', 'inherit'] });
    const closed = new Promise((r) => ff.on('close', r));
    const write = (buf) => new Promise((r) => (ff.stdin.write(buf) ? r() : ff.stdin.once('drain', r)));
    const { page, cdp } = await openPage();
    for (let f = lo; f <= hi; f++) {
      for (const o of SUB) {
        await page.evaluate((fr) => window.renderFrame(fr), f + o);
        await write(await shot(cdp, 'png'));
      }
      if (++done % 60 === 0) console.log(`${done}/${total}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end();
    await closed;
  }));
  console.log('mb done', total, 'frames →', out, ((Date.now() - t0) / 1000).toFixed(1), 's');
} else {
  console.error('usage: node scripts/render.mjs preview <t1,t2,...> [outDir] | mb <from> <to> [outDir] [workers]');
  process.exitCode = 1;
}
await Promise.all(browsers.map((b) => b.close()));
server.close();
