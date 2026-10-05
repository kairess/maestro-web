// Regenerates showreel/data.js from the game's Hard chart, stage layout and audio:
// beat grid, gestures, cues, fermatas, per-frame loudness (0–30 s) and waveform peaks (14–24 s)
// of the normal and fail renditions. Needs ffmpeg on PATH.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const PUB = resolve(ROOT, '../public');
const SR = 8000;

const decode = (file) => {
  const b = execFileSync('ffmpeg', ['-v', 'error', '-i', join(PUB, file), '-t', '40', '-ac', '1', '-ar', String(SR), '-f', 'f32le', '-'], { maxBuffer: 1 << 28 });
  return new Float32Array(b.buffer, b.byteOffset, b.length / 4);
};
const N = decode('audio/Verdi_DiesIrae/Verdi_DiesIrae.ogg');
const F = decode('audio/Verdi_DiesIrae/Verdi_DiesIrae_Fail.ogg');
const rms = (a, t0, t1) => { let s = 0, n = 0; for (let i = Math.floor(t0 * SR); i < Math.floor(t1 * SR); i++) { s += a[i] * a[i]; n++; } return Math.sqrt(s / Math.max(1, n)); };
const peak = (a, t0, t1) => { let m = 0; for (let i = Math.floor(t0 * SR); i < Math.floor(t1 * SR); i++) { const v = Math.abs(a[i]); if (v > m) m = v; } return m; };

const env = [], envF = [];
for (let k = 0; k < 30 * 60; k++) { env.push(+rms(N, k / 60, (k + 1) / 60).toFixed(4)); envF.push(+rms(F, k / 60, (k + 1) / 60).toFixed(4)); }
const wN = [], wF = [];
for (let k = 0; k < 10 * 200; k++) { const t = 14 + k / 200; wN.push(+peak(N, t, t + 1 / 200).toFixed(3)); wF.push(+peak(F, t, t + 1 / 200).toFixed(3)); }

const c = JSON.parse(readFileSync(join(PUB, 'charts/Verdi_DiesIrae/Verdi_DiesIrae_Flat_Hard.json'), 'utf8'));
const layout = JSON.parse(readFileSync(join(PUB, 'stage/layout.json'), 'utf8')).instruments;
const data = {
  beats: c.beat_times.filter((t) => t < 32).map((t) => +t.toFixed(4)),
  gestures: c.gestures.filter((g) => g.time < 32).map((g) => ({ t: +g.time.toFixed(4), k: g.tokens.join('/'), ty: g.type })),
  cues: c.cues.filter((g) => g.time < 32).map((g) => ({ t: +g.time.toFixed(4), i: g.instrument })),
  layout,
  env,
  envF,
  maxEnv: Math.max(...env),
  wave: { t0: 14, rate: 200, n: wN, f: wF },
  fermatas: c.fermatas.filter((f) => f.time[0] < 32),
};
writeFileSync(join(ROOT, 'data.js'), 'window.DATA=' + JSON.stringify(data) + ';');
console.log('data.js written');
