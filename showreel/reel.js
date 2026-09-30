'use strict';
/* Maestro Web — 30s showreel. Every visual is a pure function of song time `s`
   (video time v = s + V0), so frames can be rendered in any order / in parallel. */

const D = window.DATA;
window.__ready = window.__ready || [];
const W = 1920, H = 1080, FPS = 60, V0 = 0.5;

// ------------------------------------------------------------------ utils
const $ = (q, r = document) => r.querySelector(q);
function el(tag, cls, parent, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  (parent || document.body).appendChild(e);
  return e;
}
const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const lerp = (a, b, t) => a + (b - a) * t;
const pr = (t, a, b) => clamp((t - a) / (b - a));
const E = {
  lin: (t) => t,
  inQuad: (t) => t * t,
  outQuad: (t) => 1 - (1 - t) * (1 - t),
  inCubic: (t) => t * t * t,
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  outQuart: (t) => 1 - Math.pow(1 - t, 4),
  inOutQuart: (t) => (t < 0.5 ? 8 * t ** 4 : 1 - Math.pow(-2 * t + 2, 4) / 2),
  outQuint: (t) => 1 - Math.pow(1 - t, 5),
  outExpo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inExpo: (t) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
  inOutExpo: (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2),
  outBack: (t, k = 1.70158) => 1 + (k + 1) * Math.pow(t - 1, 3) + k * Math.pow(t - 1, 2),
  outElastic: (t) => (t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1),
};
function rng(seed) {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}
const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
function noise1(x) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; }
function st(e, o) {
  const c = e.__c || (e.__c = {});
  for (const k in o) {
    const v = o[k];
    if (c[k] === v) continue;
    c[k] = v;
    if (k.startsWith('--')) e.style.setProperty(k, v); else e.style[k] = v;
  }
}
const show = (e, on) => st(e, { display: on ? '' : 'none' });
function lines(parent, cls, arr, css) {
  const h = el('div', cls, parent);
  if (css) h.style.cssText += css;
  const inners = arr.map((t) => el('span', '', el('span', 'line', h), t));
  return { el: h, inners };
}
/** Mask reveal line by line; optional exit upward. */
function reveal(ls, s, t0, { stagger = 0.06, dur = 0.55, exit = null, exitDur = 0.28 } = {}) {
  ls.inners.forEach((e, i) => {
    const p = E.outExpo(pr(s, t0 + i * stagger, t0 + i * stagger + dur));
    let y = (1 - p) * 115;
    if (exit != null) y -= E.inCubic(pr(s, exit + i * 0.035, exit + i * 0.035 + exitDur)) * 115;
    st(e, { transform: `translate3d(0,${y.toFixed(2)}%,0)` });
  });
}
function chars(parent, text, cls = 'char') {
  return [...text].map((ch) => el('span', cls, parent, ch === ' ' ? '&nbsp;' : ch));
}
function kicker(parent, num, kr, en, css) {
  const k = el('div', 'kicker abs', parent, `<span class="rule"></span><span class="t">${num} — ${kr} <b>${en}</b></span>`);
  k.style.cssText += css;
  return k;
}
function renderKicker(k, s, t0, exit = null) {
  const p = E.outExpo(pr(s, t0, t0 + 0.5));
  let o = pr(s, t0, t0 + 0.15);
  if (exit != null) o *= 1 - pr(s, exit, exit + 0.2);
  st(k, { opacity: o.toFixed(3) });
  st(k.firstChild, { transform: `scaleX(${p.toFixed(3)})` });
  st(k.lastChild, { transform: `translateX(${((1 - p) * -24).toFixed(1)}px)` });
}

// ------------------------------------------------------------------ music data
const BEATS = D.beats;
function beatIndexAt(s) {
  if (s < BEATS[0]) return -1;
  let i = 0;
  while (i + 1 < BEATS.length && BEATS[i + 1] <= s) i++;
  return i;
}
function bpmAt(s) { const i = Math.max(0, beatIndexAt(s)); return 60 / (BEATS[i + 1] - BEATS[i]); }
function envAt(s) { const k = Math.floor(s * 60); return k < 0 || k >= D.env.length ? 0 : D.env[k] / D.maxEnv; }
function envSmooth(s) { let a = 0; for (let i = -3; i <= 3; i++) a += envAt(s + i / 60); return a / 7; }

// Key song times (all from the Hard chart's beat grid).
const T = {
  h0: 0, h1: 0.7771, h2: 1.5333, h3: 2.2779, h4: 3.0104,
  d1: 6.1158, d2: 9.1761, e: 12.3912,
  f1: 15.3901, f2: 16.1506, f3: 16.9111, f4: 17.6716,
  g: 18.0519, rec: 20.3333, h: 21.4741, i: 24.6324, fin: 27.6973, end: 29.5,
};
/** Fail-track crossfade amount (shared with the audio mix script). */
function failMix(s) {
  if (s < T.g) return 0;
  if (s < T.rec) return E.inOutSine(pr(s, T.g, T.g + 0.35));
  return 1 - E.inOutSine(pr(s, T.rec, T.rec + 0.4));
}
window.failMix = failMix;

const HITS = [
  { s: T.h0, a: 1, f: 0.42 }, { s: T.h1, a: 1, f: 0.38 }, { s: T.h2, a: 1, f: 0.42 }, { s: T.h3, a: 1, f: 0.38 },
  { s: T.h4, a: 1.5, f: 0.95 },
  { s: T.d1, a: 0.55, f: 0.22 }, { s: T.d2, a: 0.3, f: 0 }, { s: T.e, a: 0.3, f: 0.12 },
  { s: T.f1, a: 0.85, f: 0.3 }, { s: T.f2, a: 0.85, f: 0.3 }, { s: T.f3, a: 0.85, f: 0.3 }, { s: T.f4, a: 1.3, f: 0.75 },
  { s: T.g, a: 1.1, f: 0.18 }, { s: T.rec, a: 0.8, f: 0.7 }, { s: T.h, a: 0.55, f: 0.35 },
  { s: T.i, a: 0.35, f: 0.2 }, { s: 25.3996, a: 0.6, f: 0.28 }, { s: T.fin, a: 0.9, f: 0.5 },
];
function shakeAt(s) {
  let x = 0, y = 0, r = 0, z = 0;
  for (const h of HITS) {
    const d = s - h.s;
    if (d < 0 || d > 0.7) continue;
    const k = h.a * Math.exp(-d / 0.085);
    x += k * 16 * noise1(d * 42 + h.s * 7);
    y += k * 16 * noise1(d * 42 + h.s * 7 + 50);
    r += k * 0.45 * noise1(d * 30 + h.s * 3 + 100);
    z += h.a * 0.035 * Math.exp(-d / 0.16);
  }
  return { x, y, r, z };
}
function flashAt(s) {
  let f = 0;
  for (const h of HITS) { const d = s - h.s; if (d >= 0 && d < 0.5) f = Math.max(f, h.f * Math.exp(-d / 0.038)); }
  return f;
}

// ------------------------------------------------------------------ conductor model (mirrors src/input/bot.ts)
const TOK = { Up: [0, 1], Down: [0, -1], Left: [-1, 0], Right: [1, 0], DownLeft: [-Math.SQRT1_2, -Math.SQRT1_2], DownRight: [Math.SQRT1_2, -Math.SQRT1_2] };
const REST = { l: { x: -0.22, y: -0.25 }, r: { x: 0.22, y: -0.25 } };
const STROKES = [];
for (const g of D.gestures) {
  const toks = g.k.split('/');
  const amp = g.ty === 'Accent' ? 0.4 : g.ty === 'Low' ? 0.18 : 0.25;
  if (toks.length === 2) {
    STROKES.push({ h: 'l', d: TOK[toks[0]], t: g.t - 0.1, amp });
    STROKES.push({ h: 'r', d: TOK[toks[1]], t: g.t - 0.1, amp });
  } else STROKES.push({ h: 'r', d: TOK[toks[0]], t: g.t - 0.1, amp });
}
function strokeProfile(dt, amp) {
  const OUT = 0.15;
  if (dt < -OUT) return 0;
  if (dt < OUT) { const u = (dt + OUT) / (2 * OUT); return amp * u * u * (3 - 2 * u); }
  return amp * Math.exp(-(dt - OUT) / 0.45);
}
function handsAt(s) {
  const L = { ...REST.l }, R = { ...REST.r };
  for (const k of STROKES) {
    const dt = s - k.t;
    if (dt < -0.15 || dt > 2.5) continue;
    const o = strokeProfile(dt, k.amp);
    const P = k.h === 'l' ? L : R;
    P.x += k.d[0] * o; P.y += k.d[1] * o;
  }
  for (const c of D.cues) {
    const dt = s - c.t;
    if (dt < -0.3 || dt > 0.5) continue;
    const az = (D.layout[c.i] || { x: 0 }).x;
    const u = E.inOutSine(dt < -0.1 ? 1 - (-dt - 0.1) / 0.2 : dt > 0.2 ? 1 - (dt - 0.2) / 0.3 : 1);
    L.x += (-0.2 + az * 0.45 - REST.l.x) * u;
    L.y += (0.2 - REST.l.y) * u;
  }
  for (const f of D.fermatas) {
    const [t0, t1] = f.time;
    const u = E.inOutSine(pr(s, t0 - 0.35, t0 - 0.05)) * (1 - E.inOutSine(pr(s, t1, t1 + 0.3)));
    if (u <= 0) continue;
    L.x = lerp(L.x, -0.34, u);
    L.y = lerp(L.y, 0.16, u);
  }
  // Breathing sway so nothing is ever perfectly still.
  L.x += 0.006 * Math.sin(s * 1.7); L.y += 0.008 * Math.sin(s * 2.1 + 1);
  R.x += 0.005 * Math.sin(s * 1.9 + 2); R.y += 0.006 * Math.sin(s * 1.6);
  return { L, R };
}
function ik(S, Wr, side) {
  const a = 0.29, b = 0.27;
  const wz = Wr.z ?? -0.3;
  let v = [Wr.x - S.x, Wr.y - S.y, wz];
  const d0 = Math.hypot(...v);
  const u = v.map((q) => q / d0);
  const d = clamp(d0, Math.abs(a - b) + 1e-3, a + b - 1e-3);
  const cosA = clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1), sinA = Math.sqrt(1 - cosA * cosA);
  let p = [side * 0.45, -1, 0.2];
  const pu = p[0] * u[0] + p[1] * u[1] + p[2] * u[2];
  p = p.map((q, i) => q - pu * u[i]);
  const pl = Math.hypot(...p);
  p = p.map((q) => q / pl);
  return { x: S.x + u[0] * a * cosA + p[0] * a * sinA, y: S.y + u[1] * a * cosA + p[1] * a * sinA };
}
// 21 hand landmarks in hand space (metres, fingers along +y), MediaPipe order.
const HAND21 = [
  [0, 0], [-0.028, 0.022], [-0.048, 0.046], [-0.062, 0.068], [-0.074, 0.088],
  [-0.022, 0.088], [-0.026, 0.127], [-0.028, 0.152], [-0.03, 0.174],
  [0, 0.092], [0.001, 0.136], [0.002, 0.163], [0.003, 0.186],
  [0.02, 0.087], [0.023, 0.126], [0.025, 0.15], [0.026, 0.17],
  [0.038, 0.077], [0.045, 0.104], [0.049, 0.122], [0.052, 0.14],
];
const HAND_BONES = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17]];
function bodyAt(s) {
  const { L, R } = handsAt(s);
  const Sl = { x: -0.19, y: 0 }, Sr = { x: 0.19, y: 0 };
  const El = ik(Sl, L, -1), Er = ik(Sr, R, 1);
  // Hands point mostly up (palm to camera, baton hand angled out), leaning with the forearm.
  const hAng = (Wp, Ep, side) => { const fx = Wp.x - Ep.x, fy = Wp.y - Ep.y, fl = Math.hypot(fx, fy) || 1; return Math.atan2(fy / fl * 0.45 + 1, fx / fl * 0.45 + side * 0.28); };
  const angL = hAng(L, El, -1), angR = hAng(R, Er, 1);
  return { Sl, Sr, El, Er, Wl: L, Wr: R, angL, angR, Hl: { x: -0.14, y: -0.56 }, Hr: { x: 0.14, y: -0.56 } };
}
function batonTip(b) {
  const a = b.angR - 0.25; // baton continues the index finger, tilted outward
  return { x: b.Wr.x + Math.cos(a) * 0.4, y: b.Wr.y + Math.sin(a) * 0.4, a };
}
function handPoints(b, side) {
  const W = side > 0 ? b.Wr : b.Wl;
  const ang = (side > 0 ? b.angR : b.angL) - Math.PI / 2;
  const c = Math.cos(ang), sn = Math.sin(ang);
  return HAND21.map(([x, y]) => { const xx = x * side; return { x: W.x + xx * c - y * sn, y: W.y + xx * sn + y * c }; });
}
/**
 * Stylised conductor seen by the webcam (mirrored like the game's PiP: the player's right
 * hand is on screen right). opts: skel, hand21, baton, trail, sil (0..1 alphas), accent colour.
 */
function drawConductor(ctx, s, cx, cy, sc, o = {}) {
  const b = bodyAt(s);
  const P = (p) => [cx + p.x * sc, cy - p.y * sc];
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const sil = o.sil ?? 1;
  if (sil > 0) {
    ctx.globalAlpha = sil;
    const g = ctx.createLinearGradient(0, cy - 0.35 * sc, 0, cy + 0.6 * sc);
    g.addColorStop(0, o.silTop || '#2a3342'); g.addColorStop(1, o.silBot || '#0e131b');
    ctx.fillStyle = g; ctx.strokeStyle = g;
    // torso
    ctx.beginPath();
    const [a1, a2] = P({ x: -0.23, y: 0.02 }), [b1, b2] = P({ x: 0.23, y: 0.02 });
    const [c1, c2] = P({ x: 0.17, y: -0.62 }), [d1, d2] = P({ x: -0.17, y: -0.62 });
    ctx.moveTo(a1, a2);
    ctx.quadraticCurveTo(cx, cy - 0.07 * sc, b1, b2);
    ctx.quadraticCurveTo(cx + 0.24 * sc, cy + 0.3 * sc, c1, c2);
    ctx.lineTo(d1, d2);
    ctx.quadraticCurveTo(cx - 0.24 * sc, cy + 0.3 * sc, a1, a2);
    ctx.fill();
    // neck + head
    ctx.fillRect(cx - 0.045 * sc, cy - 0.14 * sc, 0.09 * sc, 0.16 * sc);
    ctx.beginPath(); ctx.ellipse(cx, cy - 0.235 * sc, 0.085 * sc, 0.105 * sc, 0, 0, Math.PI * 2); ctx.fill();
    // arms
    for (const [S, El, Wr] of [[b.Sl, b.El, b.Wl], [b.Sr, b.Er, b.Wr]]) {
      ctx.lineWidth = 0.085 * sc;
      ctx.beginPath(); ctx.moveTo(...P(S)); ctx.lineTo(...P(El)); ctx.stroke();
      ctx.lineWidth = 0.066 * sc;
      ctx.beginPath(); ctx.moveTo(...P(El)); ctx.lineTo(...P(Wr)); ctx.stroke();
      ctx.beginPath(); ctx.arc(...P(Wr), 0.045 * sc, 0, Math.PI * 2); ctx.fill();
    }
    // rim light on the shoulders/head
    ctx.globalAlpha = sil * 0.55;
    ctx.strokeStyle = o.rim || 'rgba(255,190,110,.55)';
    ctx.lineWidth = Math.max(1, 0.006 * sc);
    ctx.beginPath(); ctx.ellipse(cx, cy - 0.235 * sc, 0.085 * sc, 0.105 * sc, 0, -2.6, -0.9); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(a1, a2); ctx.quadraticCurveTo(cx, cy - 0.07 * sc, b1, b2); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // baton + trail
  if ((o.baton ?? 1) > 0) {
    const ba = o.baton ?? 1;
    if ((o.trail ?? 1) > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const N = 34;
      let prev = null;
      for (let k = N; k >= 0; k--) {
        const bb = bodyAt(s - k * 0.012);
        const tp = batonTip(bb);
        const p = P(tp);
        if (prev) {
          const a = (1 - k / N);
          ctx.strokeStyle = `rgba(255,194,31,${(0.85 * a * a * ba * (o.trail ?? 1)).toFixed(3)})`;
          ctx.lineWidth = Math.max(1, 0.012 * sc * a);
          ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
        }
        prev = p;
      }
      ctx.restore();
    }
    const tp = batonTip(b);
    const w0 = P({ x: b.Wr.x + Math.cos(tp.a) * 0.03, y: b.Wr.y + Math.sin(tp.a) * 0.03 });
    const w1 = P(tp);
    ctx.globalAlpha = ba;
    ctx.strokeStyle = '#efe4cf'; ctx.lineWidth = Math.max(1.2, 0.007 * sc);
    ctx.beginPath(); ctx.moveTo(...w0); ctx.lineTo(...w1); ctx.stroke();
    const gl = ctx.createRadialGradient(w1[0], w1[1], 0, w1[0], w1[1], 0.06 * sc);
    gl.addColorStop(0, 'rgba(255,220,140,.95)'); gl.addColorStop(1, 'rgba(255,194,31,0)');
    ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(w1[0], w1[1], 0.06 * sc, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }
  // pose skeleton
  const sk = o.skel ?? 0;
  if (sk > 0) {
    const col = o.skelCol || '92,200,255';
    const joints = [b.Sl, b.Sr, b.El, b.Er, b.Wl, b.Wr, b.Hl, b.Hr];
    const bones = [[0, 1], [0, 2], [2, 4], [1, 3], [3, 5], [0, 6], [1, 7], [6, 7]];
    const grow = o.skelGrow ?? 1;
    ctx.strokeStyle = `rgba(${col},${0.9 * sk})`;
    ctx.lineWidth = Math.max(1.5, 0.006 * sc);
    for (const [i, j] of bones) {
      const A = P(joints[i]), B = P(joints[j]);
      ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(lerp(A[0], B[0], grow), lerp(A[1], B[1], grow)); ctx.stroke();
    }
    const face = [{ x: 0, y: -0.23 }, { x: -0.03, y: -0.2 }, { x: 0.03, y: -0.2 }, { x: -0.075, y: -0.22 }, { x: 0.075, y: -0.22 }].map((p) => ({ x: p.x, y: -p.y }));
    for (const p of [...joints, ...face]) {
      const [x, y] = P(p);
      ctx.fillStyle = `rgba(255,255,255,${sk})`;
      ctx.beginPath(); ctx.arc(x, y, Math.max(2.5, 0.009 * sc) * grow, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(${col},${sk})`; ctx.lineWidth = Math.max(1, 0.003 * sc);
      ctx.beginPath(); ctx.arc(x, y, Math.max(5, 0.018 * sc) * grow, 0, Math.PI * 2); ctx.stroke();
    }
  }
  const h21 = o.hand21 ?? 0;
  if (h21 > 0) {
    for (const side of [1, -1]) {
      const pts = handPoints(b, side).map(P);
      ctx.strokeStyle = `rgba(255,255,255,${0.75 * h21})`; ctx.lineWidth = Math.max(1, 0.003 * sc);
      for (const [i, j] of HAND_BONES) { ctx.beginPath(); ctx.moveTo(...pts[i]); ctx.lineTo(...pts[j]); ctx.stroke(); }
      ctx.fillStyle = `rgba(255,194,31,${h21})`;
      for (const p of pts) { ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(1.5, 0.005 * sc), 0, Math.PI * 2); ctx.fill(); }
    }
  }
  ctx.restore();
  return b;
}

// ------------------------------------------------------------------ canvas fx
function poly(ctx, pts) { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); }
/** A baton "light slash" from (x0,y0) to (x1,y1) starting at song time t0. */
function slash(ctx, s, t0, x0, y0, x1, y1, o = {}) {
  const dur = o.dur ?? 0.1, life = o.life ?? 0.55, w = o.w ?? 9, col = o.col ?? '255,194,31';
  const d = s - t0;
  if (d < 0 || d > dur + life) return;
  const head = E.outCubic(clamp(d / dur));
  const tail = E.inOutCubic(pr(d, dur * 0.6, dur + life * 0.85));
  const alpha = 1 - E.inQuad(pr(d, dur, dur + life));
  if (head - tail < 1e-3 || alpha <= 0) return;
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  const N = 28, left = [], right = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N, t = lerp(tail, head, u);
    const wv = w * (0.15 + 0.85 * Math.pow(Math.sin(Math.PI * clamp(u * 0.94 + 0.03)), 0.7)) * (0.4 + 0.6 * u) * (0.6 + 0.4 * alpha);
    left.push([x0 + dx * t + nx * wv, y0 + dy * t + ny * wv]);
    right.push([x0 + dx * t - nx * wv, y0 + dy * t - ny * wv]);
  }
  const pts = left.concat(right.reverse());
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.filter = 'blur(18px)';
  ctx.fillStyle = `rgba(${col},${0.75 * alpha})`;
  ctx.save(); ctx.translate(0, 0); poly(ctx, pts.map(([x, y], i) => [x + (i < N + 1 ? nx : -nx) * w * 1.6, y + (i < N + 1 ? ny : -ny) * w * 1.6])); ctx.fill(); ctx.restore();
  ctx.filter = 'blur(3px)';
  ctx.fillStyle = `rgba(${col},${alpha})`;
  poly(ctx, pts); ctx.fill();
  ctx.filter = 'none';
  ctx.fillStyle = `rgba(255,248,230,${alpha})`;
  const core = [];
  for (let i = 0; i <= N; i++) { const [lx, ly] = left[i], [rx, ry] = right[right.length - 1 - i]; core.push([lerp(lx, rx, 0.3), lerp(ly, ry, 0.3)]); }
  for (let i = N; i >= 0; i--) { const [lx, ly] = left[i], [rx, ry] = right[right.length - 1 - i]; core.push([lerp(lx, rx, 0.7), lerp(ly, ry, 0.7)]); }
  poly(ctx, core); ctx.fill();
  // head flare
  if (d < dur + 0.12) {
    const hx = x0 + dx * head, hy = y0 + dy * head;
    const r = w * 7 * (1 - pr(d, dur, dur + 0.12));
    const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, r);
    g.addColorStop(0, `rgba(255,250,235,${0.9})`); g.addColorStop(0.3, `rgba(${col},.45)`); g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, hy, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
/** Deterministic spark burst at (x,y) starting at t0. */
function sparks(ctx, s, t0, x, y, o = {}) {
  const n = o.n ?? 26, speed = o.speed ?? 900, life = o.life ?? 0.7, g = o.g ?? 1400, col = o.col ?? '255,206,110';
  const dir = o.dir ?? -Math.PI / 2, spread = o.spread ?? Math.PI * 2, size = o.size ?? 2.4;
  const d = s - t0;
  if (d < 0 || d > life) return;
  const r = rng(o.seed ?? Math.round(t0 * 1000 + x));
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const a = dir + (r() - 0.5) * spread, sp = speed * (0.2 + 0.8 * r()), lf = life * (0.45 + 0.55 * r()), sz = size * (0.5 + r());
    if (d > lf) continue;
    const k = 4.2;
    const pos = (t) => { const f = (1 - Math.exp(-k * t)) / k; return [x + Math.cos(a) * sp * f, y + Math.sin(a) * sp * f + 0.5 * g * t * t]; };
    const [px, py] = pos(d), [qx, qy] = pos(Math.max(0, d - 0.03));
    const al = Math.pow(1 - d / lf, 1.4);
    ctx.strokeStyle = `rgba(${col},${al.toFixed(3)})`;
    ctx.lineWidth = sz;
    ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(px + 0.01, py); ctx.stroke();
  }
  ctx.restore();
}
/** Drifting bokeh dust. */
function dust(ctx, s, o = {}) {
  const n = o.n ?? 60, r = rng(o.seed ?? 7), a0 = o.alpha ?? 0.5, col = o.col ?? '255,196,120', sp = o.speed ?? 22;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const x0 = r() * W, y0 = r() * H, z = 0.25 + 0.75 * r(), ph = r() * 6.283, sz = 1.2 + r() * 3.2;
    const x = ((x0 + s * sp * 0.35 * z + Math.sin(s * 0.6 + ph) * 18) % W + W) % W;
    const y = ((y0 - s * sp * z) % H + H) % H;
    const al = a0 * z * (0.45 + 0.55 * Math.sin(s * 1.4 + ph * 3) ** 2) * (o.gain ?? 1);
    const rad = sz * (1 + z * 2.2);
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad * 2.2);
    g.addColorStop(0, `rgba(${col},${al.toFixed(3)})`); g.addColorStop(0.35, `rgba(${col},${(al * 0.35).toFixed(3)})`); g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad * 2.2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}
/** The game's note glyph (hollow triangle + bar), `ang` clockwise from up. */
function glyph(ctx, x, y, size, ang, color, fillA = 0, lw = 1) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate(ang); ctx.scale(size / 256, size / 256); ctx.translate(-128, -128);
  ctx.lineJoin = 'miter';
  ctx.beginPath(); ctx.moveTo(128, 30); ctx.lineTo(216, 170); ctx.lineTo(40, 170); ctx.closePath();
  ctx.lineWidth = 18 * lw; ctx.strokeStyle = color; ctx.stroke();
  if (fillA > 0) { ctx.globalAlpha = fillA; ctx.fillStyle = color; ctx.fill(); ctx.globalAlpha = 1; }
  ctx.fillStyle = color; ctx.fillRect(86, 188, 84, 30);
  ctx.restore();
}
const DIR_ANG = { Down: Math.PI, Left: -Math.PI / 2, Right: Math.PI / 2, Up: 0 };
function coverRect(iw, ih, w, h) { const k = Math.max(w / iw, h / ih); return [(w - iw * k) / 2, (h - ih * k) / 2, iw * k, ih * k]; }

// ------------------------------------------------------------------ assets
const STAGE = new Image();
STAGE.src = 'stage.jpg';
const pending = [];
function setSrc(img, src) {
  if (img.__src === src) return;
  img.__src = src;
  img.src = src;
  pending.push(img.decode().catch(() => {}));
}
function gpSrc(kind, s) {
  let i = Math.round(s * 60);
  i = kind === 'fail' ? clamp(i, 720, 1290) : clamp(i, 0, 1800);
  return `gameplay/${kind}/${String(i).padStart(5, '0')}.jpg`;
}
function makeWindow(parent) {
  const w = el('div', 'win', parent);
  el('div', 'bar', w, '<i></i><i></i><i></i><div class="url">🔒 <span><b>kairess.github.io</b>/maestro-web</span></div>');
  const v = el('div', 'view', w);
  const img = el('img', '', v);
  el('div', 'glare', v);
  return { w, img, v };
}
function makeCam(parent) {
  const c = el('div', 'cam', parent);
  const cv = el('canvas', '', c);
  cv.width = 384; cv.height = 216;
  el('div', 'tag', c, '<i></i>WEBCAM');
  return { c, ctx: cv.getContext('2d') };
}
function drawCam(ctx, s, alpha = 1) {
  const w = 384, h = 216;
  ctx.clearRect(0, 0, w, h);
  const g = ctx.createRadialGradient(w * 0.5, h * 0.35, 10, w * 0.5, h * 0.5, w * 0.7);
  g.addColorStop(0, '#2b2a33'); g.addColorStop(1, '#0c0c11');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  // soft room light
  ctx.fillStyle = 'rgba(255,200,140,.05)'; ctx.fillRect(w * 0.62, 0, w * 0.2, h);
  drawConductor(ctx, s, w / 2, h * 0.5, 250, { skel: 0.95, hand21: 0.9, trail: 1, silTop: '#3a4252', silBot: '#1a1f28', skelCol: '92,200,255' });
}

// ------------------------------------------------------------------ layers
const bgc = $('#bg').getContext('2d');
const fxc = $('#fx').getContext('2d');
const scenesRoot = $('#scenes');
const scenes = [];
function addScene(from, to, build) {
  const root = el('div', 'scene abs', scenesRoot);
  root.style.cssText += 'left:0;top:0;width:1920px;height:1080px;';
  const sc = build(root);
  sc.root = root; sc.from = from; sc.to = to;
  scenes.push(sc);
  return sc;
}

// =================================================================== SCENE A+B · cold open
addScene(-0.6, T.h4 + 0.02, (root) => {
  const words = [
    { s: T.h0, txt: '웹캠 앞에서', cap: 'BEAT 00 &nbsp;·&nbsp; <em>↓ ↓</em> &nbsp;양손 내리기 &nbsp;·&nbsp; ACCENT', k: 'DD' },
    { s: T.h1, txt: '두 손으로', cap: 'BEAT 02 &nbsp;·&nbsp; <em>↙ ↘</em> &nbsp;양손 벌리기 &nbsp;·&nbsp; ACCENT', k: 'VV' },
    { s: T.h2, txt: '오케스트라를', cap: 'BEAT 04 &nbsp;·&nbsp; <em>↓ ↓</em> &nbsp;양손 내리기 &nbsp;·&nbsp; ACCENT', k: 'DD' },
    { s: T.h3, txt: '지휘하라', cap: 'BEAT 06 &nbsp;·&nbsp; <em>↙ ↘</em> &nbsp;양손 벌리기 &nbsp;·&nbsp; ACCENT', k: 'VV', serif: true },
  ];
  for (const w of words) {
    w.el = el('div', 'bigword' + (w.serif ? ' serif' : ''), root, w.txt);
    w.el.style.textShadow = '0 10px 60px rgba(0,0,0,.85)';
    w.cap = el('div', 'caption', root, w.cap);
  }
  const pre = el('div', 'caption', root, 'G. VERDI &nbsp;—&nbsp; MESSA DA REQUIEM &nbsp;—&nbsp; <em>DIES IRÆ</em>');
  pre.style.top = '520px';
  const slashLines = (k) => (k === 'DD'
    ? [[960 - 560, 60, 960 - 560, 1020], [960 + 560, 60, 960 + 560, 1020]]
    : [[960 - 170, 70, 960 - 760, 1010], [960 + 170, 70, 960 + 760, 1010]]);
  return {
    render(s) {
      // preparatory upbeat: both hands rise, then the downbeat
      st(pre, { opacity: (pr(s, -0.5, -0.3) * (1 - pr(s, -0.12, -0.02)) * 0.8).toFixed(3), letterSpacing: `${(0.32 + 0.1 * pr(s, -0.5, 0)).toFixed(3)}em` });
      if (s < 0.02) {
        const p = E.outCubic(pr(s, -0.5, -0.06));
        for (const sx of [-1, 1]) {
          const x = 960 + sx * 560;
          fxc.save(); fxc.globalCompositeOperation = 'lighter';
          for (let k = 14; k >= 0; k--) {
            const pk = E.outCubic(pr(s - k * 0.012, -0.5, -0.06));
            const y = lerp(1010, 60, pk);
            const a = (1 - k / 14) * 0.9 * pr(s, -0.5, -0.42);
            fxc.fillStyle = `rgba(255,194,31,${a.toFixed(3)})`;
            fxc.beginPath(); fxc.arc(x, y, 5 * (1 - k / 18), 0, Math.PI * 2); fxc.fill();
          }
          const y = lerp(1010, 60, p);
          const g = fxc.createRadialGradient(x, y, 0, x, y, 46);
          g.addColorStop(0, 'rgba(255,245,220,.95)'); g.addColorStop(0.25, 'rgba(255,194,31,.5)'); g.addColorStop(1, 'rgba(255,194,31,0)');
          fxc.fillStyle = g; fxc.beginPath(); fxc.arc(x, y, 46, 0, Math.PI * 2); fxc.fill();
          fxc.restore();
        }
      }
      words.forEach((w, i) => {
        const t0 = w.s, t1 = i + 1 < words.length ? words[i + 1].s : T.h4;
        const on = s >= t0 && s < t1;
        show(w.el, on); show(w.cap, on);
        if (!on) return;
        const p = E.outExpo(pr(s, t0, t0 + 0.32));
        const sc = (1.24 - 0.24 * p) * (1 - 0.035 * pr(s, t0 + 0.3, t1));
        const blur = 16 * (1 - E.outExpo(pr(s, t0, t0 + 0.14)));
        const rv = E.outCubic(pr(s, t0, t0 + 0.09));
        const clip = w.k === 'DD' ? `inset(0 0 ${((1 - rv) * 100).toFixed(1)}% 0)` : `inset(0 ${((1 - rv) * 50).toFixed(1)}% 0 ${((1 - rv) * 50).toFixed(1)}%)`;
        st(w.el, { transform: `scale(${sc.toFixed(4)})`, filter: `blur(${blur.toFixed(2)}px)`, clipPath: clip, letterSpacing: `${(-0.04 + 0.12 * (1 - p)).toFixed(4)}em` });
        const cp = E.outCubic(pr(s, t0 + 0.08, t0 + 0.35));
        st(w.cap, { opacity: (cp * 0.95).toFixed(3), transform: `translateY(${((1 - cp) * 14).toFixed(1)}px)` });
      });
      // light slashes + revealed orchestra slices
      for (const w of [...words, { s: T.h4, k: 'DD' }]) {
        const d = s - w.s;
        if (d < 0 || d > 0.9) continue;
        slashLines(w.k).forEach(([x0, y0, x1, y1], j) => {
          slash(fxc, s, w.s, x0, y0, x1, y1, { w: 10, dur: 0.09, life: 0.6 });
          sparks(fxc, s, w.s + 0.08, x1, y1, { n: 30, seed: Math.round(w.s * 100) + j, speed: 1100, dir: -Math.PI / 2, spread: 2.6 });
          // slice of the orchestra photo along the slash
          const a = (1 - E.outQuad(pr(d, 0.05, 0.8))) * 0.95;
          const bw = lerp(40, 330, E.outExpo(pr(d, 0, 0.6)));
          const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L * bw / 2, ny = dx / L * bw / 2;
          bgc.save();
          poly(bgc, [[x0 + nx - dx * 0.1, y0 + ny - dy * 0.1], [x1 + nx + dx * 0.1, y1 + ny + dy * 0.1], [x1 - nx + dx * 0.1, y1 - ny + dy * 0.1], [x0 - nx - dx * 0.1, y0 - ny - dy * 0.1]]);
          bgc.clip();
          bgc.globalAlpha = a;
          bgc.filter = 'brightness(1.25) contrast(1.15) saturate(1.2)';
          const zoom = 1.12 - 0.06 * pr(d, 0, 0.9);
          bgc.drawImage(STAGE, 960 - 960 * zoom, 540 - 540 * zoom, W * zoom, H * zoom);
          bgc.restore();
        });
      }
    },
  };
});

// =================================================================== SCENE C · title over the orchestra
addScene(T.h4, T.d1 + 0.2, (root) => {
  const img = el('img', 'abs', root);
  img.src = 'stage.jpg';
  img.style.cssText += 'left:0;top:0;width:1920px;height:1080px;object-fit:cover;transform-origin:50% 42%;';
  const spot = el('div', 'abs', root);
  spot.style.cssText += 'left:0;top:0;width:1920px;height:1080px;mix-blend-mode:screen;';
  const grad = el('div', 'overlay', root);
  grad.style.background = 'linear-gradient(180deg, rgba(7,6,10,.35) 0%, rgba(7,6,10,0) 22%, rgba(7,6,10,.05) 42%, rgba(7,6,10,.78) 64%, rgba(7,6,10,.96) 100%)';
  const cueLayer = el('div', 'abs', root);
  cueLayer.style.cssText += 'left:0;top:0;width:1920px;height:1080px;';
  const logo = el('div', 'logo', root);
  logo.style.cssText += 'left:0;width:1920px;text-align:center;top:585px;font-size:196px;';
  const lchars = chars(el('span', '', logo), 'MAESTRO');
  const gleam = el('div', 'logo', root, 'MAESTRO');
  gleam.style.cssText += 'left:0;width:1920px;text-align:center;top:585px;font-size:196px;color:transparent;-webkit-background-clip:text;background-clip:text;background-image:linear-gradient(105deg, rgba(255,255,255,0) 44%, rgba(255,236,190,.95) 50%, rgba(255,255,255,0) 56%);background-size:300% 100%;background-repeat:no-repeat;';
  const web = el('span', 'abs mono', root, 'web');
  web.style.cssText += 'left:1566px;top:604px;font-size:36px;font-weight:500;color:var(--gold);letter-spacing:.45em;';
  const sub = lines(root, 'abs', ['웹캠으로 오케스트라를 지휘하는 <span style="color:var(--gold)">브라우저 리듬게임</span>'], 'left:0;width:1920px;text-align:center;top:818px;font-size:44px;font-weight:600;letter-spacing:-.02em;');
  const small = el('div', 'caption', root, 'VERDI &nbsp;·&nbsp; MESSA DA REQUIEM &nbsp;—&nbsp; <em>DIES IRÆ</em>');
  small.style.top = '905px';
  const KR = { Trombone: '트롬본', Trumpet: '트럼펫' };
  const cues = D.cues.filter((c) => c.t > 3.2 && c.t < 5.2).map((c) => {
    const m = el('div', 'abs', cueLayer);
    m.innerHTML = `<div class="abs" style="left:-80px;top:-80px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle, rgba(255,255,255,.3) 0%, rgba(200,210,225,.14) 40%, rgba(0,0,0,0) 70%)"></div>
      <div class="abs in" style="left:-24px;top:-24px;width:48px;height:48px;border-radius:50%;background:radial-gradient(circle,#fff 0 60%,rgba(255,255,255,.85) 72%,rgba(255,255,255,0) 100%);box-shadow:0 0 26px 8px rgba(255,255,255,.5)"></div>
      <div class="abs out" style="left:-24px;top:-24px;width:48px;height:48px;border-radius:50%;border:3px solid rgba(255,255,255,.95);box-shadow:0 0 12px rgba(255,255,255,.6)"></div>
      <div class="abs lab mono" style="left:44px;top:-14px;white-space:nowrap;font-size:17px;letter-spacing:.22em;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.9)">CUE ▸ <b style="color:var(--gold)">${KR[c.i] || c.i}</b></div>`;
    return { c, m, inn: m.querySelector('.in'), out: m.querySelector('.out'), lab: m.querySelector('.lab') };
  });
  return {
    render(s) {
      const t0 = T.h4;
      const zoom = 1.2 - 0.1 * E.outCubic(pr(s, t0, T.d1));
      const exit = pr(s, T.d1 - 0.06, T.d1 + 0.18);
      st(img, { transform: `scale(${zoom.toFixed(4)})`, filter: `brightness(${(0.72 + 0.35 * envSmooth(s)).toFixed(3)}) saturate(1.08) blur(${(10 * (1 - E.outExpo(pr(s, t0, t0 + 0.35)))).toFixed(2)}px)` });
      st(root, { opacity: (1 - E.inQuad(exit)).toFixed(3), transform: `scale(${(1 + 0.22 * E.inCubic(exit)).toFixed(4)})`, filter: exit > 0 ? `blur(${(14 * exit).toFixed(1)}px)` : 'none' });
      // logo slam
      lchars.forEach((c, i) => {
        const a = t0 + i * 0.02;
        const p = E.outExpo(pr(s, a, a + 0.42));
        st(c, { transform: `translateY(${((1 - p) * -40).toFixed(1)}px) scale(${(1.9 - 0.9 * p).toFixed(4)})`, opacity: pr(s, a, a + 0.04).toFixed(3), filter: `blur(${((1 - p) * 18).toFixed(2)}px)` });
      });
      const lp = E.outCubic(pr(s, t0, T.d1));
      const gp = E.inOutSine(pr(s, 4.1, 5.1));
      st(gleam, { backgroundPosition: `${lerp(72, 28, gp).toFixed(2)}% 0`, opacity: (Math.sin(Math.PI * gp) * 0.95).toFixed(3), transform: `scale(${(1 + 0.035 * lp).toFixed(4)})` });
      st(logo, { transform: `scale(${(1 + 0.035 * lp).toFixed(4)})`, textShadow: `0 0 ${(40 + 60 * flashAt(s)).toFixed(0)}px rgba(255,194,31,${(0.25 + 0.5 * flashAt(s)).toFixed(3)})` });
      const wp = E.outExpo(pr(s, t0 + 0.22, t0 + 0.7));
      st(web, { opacity: wp.toFixed(3), transform: `translateX(${((1 - wp) * -30).toFixed(1)}px)`, letterSpacing: `${(0.8 - 0.35 * wp).toFixed(3)}em` });
      reveal(sub, s, t0 + 0.3, { dur: 0.7 });
      const sp = E.outCubic(pr(s, t0 + 0.55, t0 + 1.1));
      st(small, { opacity: (sp * 0.85).toFixed(3), letterSpacing: `${(0.2 + 0.14 * sp).toFixed(3)}em` });
      // cue rings on the brass (same look as the game's cue marker)
      const tx = (u, v) => [960 + (u * W - 960) * zoom, H * 0.42 + (v * H - H * 0.42) * zoom];
      let spotA = 0, spotXY = [0, 0];
      for (const q of cues) {
        const lead = 0.8, d = s - q.c.t;
        const on = d > -lead && d < 0.55;
        show(q.m, on);
        if (!on) continue;
        const L = D.layout[q.c.i];
        const [x, y] = tx(L.u, L.v);
        st(q.m, { transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)` });
        if (d < 0) {
          const p = 1 + d / lead;
          st(q.out, { transform: `scale(${Math.max(0.4, 1 + 2.4 * (1 - E.inQuad(p))).toFixed(3)})` });
          st(q.inn, { transform: 'scale(1)' });
          st(q.m, { opacity: Math.min(1, p / 0.25).toFixed(3) });
          if (p > spotA) { spotA = p; spotXY = [x, y]; }
        } else {
          const r = d / 0.55;
          st(q.out, { transform: `scale(${(1 + 1.2 * E.outCubic(r)).toFixed(3)})` });
          st(q.inn, { transform: `scale(${(1 + 0.5 * E.outCubic(r)).toFixed(3)})` });
          st(q.m, { opacity: (1 - r).toFixed(3) });
          if (1 - r > spotA) { spotA = 1 - r; spotXY = [x, y]; }
        }
        st(q.lab, { opacity: clamp((d + lead) / 0.2).toFixed(3) });
      }
      st(spot, { background: `radial-gradient(420px 300px at ${spotXY[0].toFixed(0)}px ${spotXY[1].toFixed(0)}px, rgba(255,217,160,${(0.35 * spotA).toFixed(3)}), rgba(255,217,160,0) 70%)` });
      dust(fxc, s, { n: 50, alpha: 0.5, seed: 11 });
    },
  };
});

// =================================================================== SCENE D · right hand / left hand (shared window)
addScene(T.d1, T.e + 0.4, (root) => {
  const bg = el('img', 'abs', root);
  bg.src = 'stage.jpg';
  bg.style.cssText += 'left:-40px;top:-40px;width:2000px;height:1160px;object-fit:cover;filter:blur(22px) brightness(.22) saturate(1.2);';
  const bgGrad = el('div', 'overlay', root);
  bgGrad.style.background = 'radial-gradient(1200px 800px at 50% 40%, rgba(255,170,80,.06), rgba(0,0,0,0) 70%), linear-gradient(180deg, rgba(7,6,10,.2), rgba(7,6,10,.6))';
  const win = makeWindow(root);
  const cam = makeCam(root);
  // D1 text
  const k1 = kicker(root, '01', '오른손', 'RIGHT HAND', 'left:110px;top:200px;');
  const h1 = lines(root, 'headline abs', ['박자에 맞춰', '<span class="g">지휘봉</span>을 젓는다'], 'left:110px;top:244px;font-size:100px;');
  const s1 = lines(root, 'sub abs', ['화살표 방향으로, 음표가 선에 닿는 순간'], 'left:112px;top:486px;font-size:31px;');
  const patC = el('canvas', 'abs', root);
  patC.width = 600; patC.height = 420; patC.style.cssText += 'left:96px;top:570px;';
  const pat = patC.getContext('2d');
  // D2 text
  const k2 = kicker(root, '02', '왼손', 'LEFT HAND', 'left:1330px;top:176px;');
  const h2 = lines(root, 'headline abs', ['왼손으로', '<span class="g">표현</span>을 더한다'], 'left:1330px;top:220px;font-size:92px;');
  const rowsDef = [
    { t: 9.5724, h: '큐 <small>CUE</small>', p: '악기를 가리켜 입장 신호', k: 'cue' },
    { t: 10.3635, h: '셈여림 <small>DYNAMICS</small>', p: '올리면 크레셴도, 내리면 디크레셴도', k: 'dyn' },
    { t: 11.1645, h: '페르마타 <small>FERMATA</small>', p: '손을 든 채 소리를 붙잡는다', k: 'fer' },
  ];
  const rows = rowsDef.map((r, i) => {
    const row = el('div', 'row', root);
    row.style.left = '1330px'; row.style.top = `${486 + i * 158}px`;
    const ico = el('div', 'ico', row);
    const cv = el('canvas', '', ico); cv.width = 124; cv.height = 124;
    const txt = el('div', '', row);
    const hh = lines(txt, '', [`<h4>${r.h}</h4>`]);
    const pp = lines(txt, '', [`<p>${r.p}</p>`]);
    return { ...r, row, ico, ctx: cv.getContext('2d'), hh, pp };
  });

  // Conducting pattern (4/4): ictus points in unit space (y up).
  const P = { Down: [0, -0.92], Left: [-0.86, -0.42], Right: [0.92, -0.4], Up: [0.06, 0.95] };
  const CTRL = {
    'Up>Down': [[0.1, 0.35], [0.0, -0.45]],
    'Down>Left': [[0.08, -0.35], [-0.72, -0.05]],
    'Left>Right': [[-0.78, -0.02], [0.62, -0.02]],
    'Right>Up': [[0.98, -0.02], [0.4, 0.95]],
  };
  const patBeats = D.gestures.filter((g) => g.t >= 5.7 && g.t <= 9.6 && P[g.k]).map((g) => ({ t: g.t, k: g.k }));
  patBeats.unshift({ t: 5.73, k: 'Up' });
  const bez = (a, b, c, d, u) => {
    const m = 1 - u;
    return [m * m * m * a[0] + 3 * m * m * u * b[0] + 3 * m * u * u * c[0] + u * u * u * d[0], m * m * m * a[1] + 3 * m * m * u * b[1] + 3 * m * u * u * c[1] + u * u * u * d[1]];
  };
  function tipAt(s) {
    let i = 0;
    while (i + 1 < patBeats.length && patBeats[i + 1].t <= s) i++;
    if (i + 1 >= patBeats.length) return P[patBeats[patBeats.length - 1].k];
    const A = patBeats[i], B = patBeats[i + 1];
    const u = clamp((s - A.t) / (B.t - A.t));
    const w = u + 0.15 * Math.sin(2 * Math.PI * u) * 0.95;
    const c = CTRL[`${A.k}>${B.k}`] || [P[A.k], P[B.k]];
    return bez(P[A.k], c[0], c[1], P[B.k], clamp(w));
  }
  function drawPattern(s, alpha) {
    const c = pat;
    c.clearRect(0, 0, 600, 420);
    if (alpha <= 0) return;
    c.save();
    c.globalAlpha = alpha;
    const cx = 196, cy = 206, k = 150;
    const X = (p) => [cx + p[0] * k, cy - p[1] * k];
    // guide path
    c.setLineDash([3, 9]); c.lineWidth = 2; c.strokeStyle = 'rgba(244,237,228,.28)'; c.lineCap = 'round';
    c.beginPath();
    const order = ['Up', 'Down', 'Left', 'Right', 'Up'];
    for (let j = 0; j < 4; j++) {
      const a = P[order[j]], b = P[order[j + 1]], cc = CTRL[`${order[j]}>${order[j + 1]}`];
      for (let q = 0; q <= 30; q++) { const pt = X(bez(a, cc[0], cc[1], b, q / 30)); q === 0 && j === 0 ? c.moveTo(...pt) : c.lineTo(...pt); }
    }
    c.stroke(); c.setLineDash([]);
    // ictus markers
    const bi = patBeats.filter((b) => b.t <= s + 1e-4).pop();
    ['Down', 'Left', 'Right', 'Up'].forEach((kk, j) => {
      const [x, y] = X(P[kk]);
      const last = patBeats.filter((b) => b.k === kk && b.t <= s && b.t > 5.9).pop();
      const hot = last ? Math.exp(-(s - last.t) / 0.25) : 0;
      glyph(c, x + (kk === 'Left' ? -46 : kk === 'Right' ? 46 : 0), y + (kk === 'Down' ? 44 : kk === 'Up' ? -40 : 0), 40 + 10 * hot, DIR_ANG[kk], hot > 0.05 ? `rgba(255,${Math.round(194 + 50 * (1 - hot))},${Math.round(31 + 200 * (1 - hot))},1)` : 'rgba(244,237,228,.55)', hot * 0.4, 1);
      if (last) {
        const d = s - last.t;
        if (d < 0.45) {
          c.strokeStyle = `rgba(255,194,31,${(1 - d / 0.45).toFixed(3)})`; c.lineWidth = 3;
          c.beginPath(); c.arc(x, y, 10 + 60 * E.outCubic(d / 0.45), 0, Math.PI * 2); c.stroke();
        }
      }
      c.fillStyle = hot > 0.05 ? '#ffc21f' : 'rgba(244,237,228,.5)';
      c.beginPath(); c.arc(x, y, 6 + 4 * hot, 0, Math.PI * 2); c.fill();
    });
    // trail + tip
    c.globalCompositeOperation = 'lighter';
    let prev = null;
    for (let q = 40; q >= 0; q--) {
      const pt = X(tipAt(s - q * 0.009));
      if (prev) {
        const a = 1 - q / 40;
        c.strokeStyle = `rgba(255,194,31,${(a * a).toFixed(3)})`; c.lineWidth = 1 + 7 * a;
        c.beginPath(); c.moveTo(...prev); c.lineTo(...pt); c.stroke();
      }
      prev = pt;
    }
    const tp = X(tipAt(s));
    const g = c.createRadialGradient(tp[0], tp[1], 0, tp[0], tp[1], 34);
    g.addColorStop(0, 'rgba(255,250,230,1)'); g.addColorStop(0.3, 'rgba(255,194,31,.6)'); g.addColorStop(1, 'rgba(255,194,31,0)');
    c.fillStyle = g; c.beginPath(); c.arc(tp[0], tp[1], 34, 0, Math.PI * 2); c.fill();
    c.globalCompositeOperation = 'source-over';
    // beat counter
    const n = bi ? { Down: 1, Left: 2, Right: 3, Up: 4 }[bi.k] : 4;
    const dn = bi ? s - bi.t : 1;
    c.font = '900 150px "Playfair Display"'; c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    const pop = 1 + 0.25 * Math.exp(-dn / 0.08);
    c.save(); c.translate(515, 262); c.scale(pop, pop);
    c.fillStyle = '#ffc21f'; c.shadowColor = 'rgba(255,194,31,.6)'; c.shadowBlur = 30 * Math.exp(-dn / 0.2);
    c.fillText(String(n), 0, 0); c.restore();
    c.font = '500 16px "JetBrains Mono"'; c.fillStyle = 'rgba(244,237,228,.6)'; c.letterSpacing = '4px';
    c.fillText('BEAT / 4', 515, 306);
    c.restore();
  }
  function drawIcon(r, s, a) {
    const c = r.ctx;
    c.clearRect(0, 0, 124, 124);
    c.save(); c.globalAlpha = a;
    const lt = s - r.t;
    if (r.k === 'cue') {
      const ph = ((lt % 1.1) + 1.1) % 1.1 / 1.1;
      const g = c.createRadialGradient(62, 62, 0, 62, 62, 50);
      g.addColorStop(0, 'rgba(255,255,255,.3)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g; c.fillRect(0, 0, 124, 124);
      c.fillStyle = '#fff'; c.shadowColor = 'rgba(255,255,255,.8)'; c.shadowBlur = 16 + 20 * Math.max(0, 1 - Math.abs(ph - 0.72) * 6);
      c.beginPath(); c.arc(62, 62, 13, 0, Math.PI * 2); c.fill();
      c.shadowBlur = 0; c.strokeStyle = `rgba(255,255,255,${ph < 0.72 ? 0.95 : 0.95 * (1 - (ph - 0.72) / 0.28)})`; c.lineWidth = 3;
      const rr = ph < 0.72 ? 13 + 38 * (1 - E.inQuad(ph / 0.72)) : 13 + 20 * E.outCubic((ph - 0.72) / 0.28);
      c.beginPath(); c.arc(62, 62, rr, 0, Math.PI * 2); c.stroke();
    } else if (r.k === 'dyn') {
      const drawM = (x0, inv, col, t) => {
        c.beginPath();
        for (let q = 0; q <= 20; q++) {
          const x = -1 + q / 10;
          let y = Math.pow(1 - Math.abs(x), 1.6);
          if (inv) y = 1 - y;
          const px = x0 + x * 24, py = 88 - y * 44 * (0.6 + 0.4 * t);
          q ? c.lineTo(px, py) : c.moveTo(px, py);
        }
        c.lineTo(x0 + 24, 88); c.lineTo(x0 - 24, 88); c.closePath();
        c.fillStyle = col.replace('A', '0.35'); c.fill();
        c.strokeStyle = col.replace('A', '1'); c.lineWidth = 2.5; c.stroke();
      };
      const t1 = 0.5 + 0.5 * Math.sin(lt * 5), t2 = 0.5 + 0.5 * Math.sin(lt * 5 + Math.PI);
      drawM(36, false, 'rgba(255,194,31,A)', t1);
      drawM(88, true, 'rgba(42,184,255,A)', t2);
      c.fillStyle = '#ffc21f'; c.font = '700 20px "JetBrains Mono"'; c.textAlign = 'center'; c.fillText('↑', 36, 30);
      c.fillStyle = '#2ab8ff'; c.fillText('↓', 88, 30);
    } else {
      const glow = 0.6 + 0.4 * Math.sin(lt * 4);
      c.shadowColor = 'rgba(255,194,31,.9)'; c.shadowBlur = 14 + 16 * glow;
      c.beginPath();
      for (let q = 0; q <= 32; q++) {
        const x = -1 + q / 16;
        const y = Math.pow(0.5 + 0.5 * Math.cos(Math.PI * x), 0.55);
        const px = 62 + x * 44, py = 90 - y * 46;
        q ? c.lineTo(px, py) : c.moveTo(px, py);
      }
      c.closePath();
      c.fillStyle = `rgba(255,194,31,${(0.3 + 0.25 * glow).toFixed(3)})`; c.fill();
      c.strokeStyle = '#ffd35a'; c.lineWidth = 3; c.stroke();
      c.shadowBlur = 0;
      c.fillStyle = '#fff'; c.beginPath(); c.arc(62, 30, 4, 0, Math.PI * 2); c.fill();
      c.strokeStyle = '#fff'; c.lineWidth = 3; c.beginPath(); c.arc(62, 36, 16, Math.PI * 1.05, Math.PI * 1.95); c.stroke();
    }
    c.restore();
  }
  // Window poses: [left, top, scale, rotY, rotX]
  const POSE1 = [640, 176, 0.9, -15, 3], POSE2 = [0, 176, 0.9, 15, 3];
  const CAM1 = [1488, 108], CAM2 = [48, 108];
  return {
    render(s) {
      setSrc(win.img, gpSrc('perfect', s));
      // window pose
      const ein = E.outExpo(pr(s, T.d1, T.d1 + 0.6));
      const sw = E.inOutQuart(pr(s, T.d2 - 0.08, T.d2 + 0.55));
      const pose = POSE1.map((v, i) => lerp(v, POSE2[i], sw));
      const dip = Math.sin(Math.PI * sw) * 0.08;
      const x = pose[0] + (1 - ein) * 560, ry = pose[3] + (1 - ein) * -40;
      st(win.w, {
        transform: `translate(${x.toFixed(1)}px,${pose[1]}px) perspective(2600px) rotateY(${ry.toFixed(2)}deg) rotateX(${pose[4]}deg) scale(${(pose[2] - dip).toFixed(4)})`,
        opacity: pr(s, T.d1, T.d1 + 0.12).toFixed(3),
        boxShadow: `0 40px 120px rgba(0,0,0,.75), 0 0 ${(30 + 80 * envSmooth(s)).toFixed(0)}px rgba(255,180,84,${(0.08 + 0.18 * envSmooth(s)).toFixed(3)})`,
      });
      const cin = E.outBack(pr(s, T.d1 + 0.25, T.d1 + 0.75), 1.3);
      const cp = [lerp(CAM1[0], CAM2[0], sw), lerp(CAM1[1], CAM2[1], sw) - Math.sin(Math.PI * sw) * 40];
      st(cam.c, { transform: `translate(${cp[0].toFixed(1)}px,${cp[1].toFixed(1)}px) scale(${cin.toFixed(4)})`, opacity: pr(s, T.d1 + 0.25, T.d1 + 0.4).toFixed(3) });
      drawCam(cam.ctx, s);
      // D1 text
      const on1 = s < T.d2 + 0.4;
      show(k1, on1); show(h1.el, on1); show(s1.el, on1); show(patC, on1);
      if (on1) {
        renderKicker(k1, s, T.d1 + 0.05, T.d2 - 0.12);
        reveal(h1, s, T.d1 + 0.08, { exit: T.d2 - 0.12 });
        reveal(s1, s, T.d1 + 0.3, { exit: T.d2 - 0.12 });
        const pa = pr(s, T.d1 + 0.2, T.d1 + 0.45) * (1 - pr(s, T.d2 - 0.1, T.d2 + 0.15));
        drawPattern(s, pa);
        st(patC, { transform: `translateY(${((1 - E.outExpo(pr(s, T.d1 + 0.2, T.d1 + 0.7))) * 40).toFixed(1)}px)` });
      }
      // D2 text
      const on2 = s > T.d2 - 0.1;
      show(k2, on2); show(h2.el, on2);
      if (on2) {
        renderKicker(k2, s, T.d2 + 0.12, T.e - 0.1);
        reveal(h2, s, T.d2 + 0.14, { exit: T.e - 0.1 });
      }
      for (const r of rows) {
        const on = s > r.t - 0.05;
        show(r.row, on);
        if (!on) continue;
        const p = E.outBack(pr(s, r.t, r.t + 0.45), 1.6);
        const ex = pr(s, T.e - 0.08, T.e + 0.12);
        st(r.ico, { transform: `scale(${(p * (1 - ex)).toFixed(4)}) rotate(${((1 - p) * -20).toFixed(1)}deg)` });
        reveal(r.hh, s, r.t + 0.05, { dur: 0.5, exit: T.e - 0.1 });
        reveal(r.pp, s, r.t + 0.12, { dur: 0.5, exit: T.e - 0.1 });
        drawIcon(r, s, pr(s, r.t, r.t + 0.15));
        st(r.ico, { borderColor: `rgba(255,194,31,${(0.1 + 0.6 * Math.exp(-(s - r.t) / 0.3)).toFixed(3)})` });
      }
      // exit: zoom into the webcam inset
      const zx = pr(s, T.e - 0.02, T.e + 0.34);
      if (zx > 0) {
        const ox = cp[0] + 192, oy = cp[1] + 108;
        st(root, { transformOrigin: `${ox}px ${oy}px`, transform: `scale(${(1 + 4 * E.inCubic(zx)).toFixed(4)})`, opacity: (1 - E.inQuad(zx)).toFixed(3) });
      } else st(root, { transform: 'none', opacity: '1' });
      dust(bgc, s, { n: 40, alpha: 0.35, seed: 21 });
    },
  };
});

// =================================================================== SCENE E · tracking
addScene(T.e, T.f1 + 0.02, (root) => {
  root.style.background = 'radial-gradient(1400px 900px at 45% 45%, #121824 0%, #07060a 70%)';
  const grid = el('canvas', 'abs', root);
  grid.width = W; grid.height = H;
  const gctx = grid.getContext('2d');
  gctx.strokeStyle = 'rgba(92,200,255,.07)'; gctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 60) { gctx.beginPath(); gctx.moveTo(x + 0.5, 0); gctx.lineTo(x + 0.5, H); gctx.stroke(); }
  for (let y = 0; y <= H; y += 60) { gctx.beginPath(); gctx.moveTo(0, y + 0.5); gctx.lineTo(W, y + 0.5); gctx.stroke(); }
  const fig = el('canvas', 'abs', root);
  fig.width = W; fig.height = H;
  const f = fig.getContext('2d');
  const k = kicker(root, '03', '트래킹', 'TRACKING', 'left:110px;top:120px;');
  const hd = lines(root, 'headline abs', ['카메라가', '<span class="g">손</span>을 읽는다'], 'left:110px;top:164px;font-size:92px;');
  const labA = lines(root, 'abs', ['<b style="font-size:34px;font-weight:800">손 관절 21개</b>', '<span class="mono" style="font-size:16px;letter-spacing:.2em;color:var(--gold)">MEDIAPIPE HAND LANDMARKER</span>'], 'left:1330px;top:620px;text-align:center;width:300px;');
  const labB = lines(root, 'abs', ['<b style="font-size:34px;font-weight:800">어깨 기준 좌표계</b>', '<span style="font-size:23px;font-weight:500;color:var(--muted)">웹캠 각도가 달라도 같은 동작</span>'], 'left:110px;top:560px;');
  const panel = el('div', 'wavebox', root);
  panel.style.cssText += 'left:1150px;top:760px;width:660px;height:230px;';
  const pc = el('canvas', '', panel); pc.width = 660; pc.height = 230;
  const p2 = pc.getContext('2d');
  // One Euro filter demo signal (same filter as src/tracking/oneEuro.ts)
  const N = 150, raw = [], filt = [];
  {
    const r = rng(42);
    let xPrev = null, dxPrev = 0;
    const alpha = (cut, dt) => 1 / (1 + 1 / (2 * Math.PI * cut) / dt);
    for (let i = 0; i < N; i++) {
      const t = i / 60;
      const clean = 0.5 * Math.sin(t * 5.2) + 0.25 * Math.sin(t * 11.3 + 1);
      const v = clean + (r() - 0.5) * 0.34 + (r() < 0.05 ? (r() - 0.5) * 0.9 : 0);
      raw.push(v);
      if (xPrev === null) { xPrev = v; filt.push(v); continue; }
      const dt = 1 / 60, dx = (v - xPrev) / dt;
      const aD = alpha(1.0, dt); const dxh = aD * dx + (1 - aD) * dxPrev; dxPrev = dxh;
      const a = alpha(1.0 + 0.4 * Math.abs(dxh), dt);
      xPrev = a * v + (1 - a) * xPrev; filt.push(xPrev);
    }
  }
  function drawPanel(s, a) {
    const c = p2;
    c.clearRect(0, 0, 660, 230);
    c.save(); c.globalAlpha = a;
    c.font = '800 26px Pretendard'; c.fillStyle = '#f4ede4'; c.fillText('One Euro 필터', 28, 46);
    c.font = '500 19px Pretendard'; c.fillStyle = '#a99d92'; c.fillText('떨림은 잡고, 지연은 최소로', 212, 45);
    c.font = '500 13px "JetBrains Mono"'; c.letterSpacing = '2px';
    c.textAlign = 'right';
    c.fillStyle = 'rgba(244,237,228,.5)'; c.fillText('— RAW', 632, 40);
    c.fillStyle = '#ffc21f'; c.fillText('— FILTERED', 632, 62);
    c.textAlign = 'left';
    c.letterSpacing = '0px';
    const rv = E.inOutSine(pr(s, 14.3, 15.2));
    const n = Math.max(2, Math.floor(rv * N));
    const X = (i) => 28 + (i / (N - 1)) * 604, Y = (v) => 150 - v * 62;
    c.strokeStyle = 'rgba(244,237,228,.1)'; c.beginPath(); c.moveTo(28, 150); c.lineTo(632, 150); c.stroke();
    c.lineWidth = 1.5; c.strokeStyle = 'rgba(244,237,228,.42)'; c.beginPath();
    for (let i = 0; i < n; i++) i ? c.lineTo(X(i), Y(raw[i])) : c.moveTo(X(i), Y(raw[i]));
    c.stroke();
    c.lineWidth = 4; c.strokeStyle = '#ffc21f'; c.shadowColor = 'rgba(255,194,31,.7)'; c.shadowBlur = 12; c.beginPath();
    for (let i = 0; i < n; i++) i ? c.lineTo(X(i), Y(filt[i])) : c.moveTo(X(i), Y(filt[i]));
    c.stroke(); c.shadowBlur = 0;
    c.fillStyle = '#fff'; c.beginPath(); c.arc(X(n - 1), Y(filt[n - 1]), 5, 0, Math.PI * 2); c.fill();
    c.restore();
  }
  const FX = 830, FY = 470, SC = 820;
  return {
    render(s) {
      // entry: grow out of the webcam inset
      const zi = E.outExpo(pr(s, T.e, T.e + 0.45));
      const ix = 48, iy = 108, iw = 384, ih = 216;
      const l = lerp(ix, 0, zi), t = lerp(iy, 0, zi), r = lerp(W - ix - iw, 0, zi), bt = lerp(H - iy - ih, 0, zi);
      const exit = pr(s, T.f1 - 0.04, T.f1);
      st(root, { clipPath: `inset(${t.toFixed(1)}px ${r.toFixed(1)}px ${bt.toFixed(1)}px ${l.toFixed(1)}px round ${lerp(12, 0, zi).toFixed(1)}px)`, opacity: (1 - exit).toFixed(3) });
      // figure (camera "tilts" to show frame invariance)
      const tilt = Math.sin(Math.PI * E.inOutSine(pr(s, 13.62, 14.5))) * -0.13;
      const scale = lerp(0.42, 1, zi) * (1 - 0.06 * Math.sin(Math.PI * pr(s, 13.62, 14.5)));
      f.clearRect(0, 0, W, H);
      f.save();
      const ox = lerp(ix + iw / 2, FX, zi), oy = lerp(iy + ih / 2 + 30, FY, zi);
      f.translate(ox, oy); f.rotate(tilt); f.scale(scale, scale);
      const skA = E.outCubic(pr(s, 12.76, 13.1));
      const b = drawConductor(f, s, 0, 0, SC, { skel: 0.25 + 0.75 * skA, skelGrow: 0.3 + 0.7 * skA, hand21: 0, silTop: '#253043', silBot: '#0c1119', trail: 1 });
      // body-frame axes
      const ax = E.outExpo(pr(s, 13.51, 13.95));
      if (ax > 0) {
        const L = 0.34 * SC * ax;
        const arrow = (dx, dy, col, lab) => {
          f.strokeStyle = col; f.fillStyle = col; f.lineWidth = 5; f.shadowColor = col; f.shadowBlur = 18;
          f.beginPath(); f.moveTo(0, 0); f.lineTo(dx * L, dy * L); f.stroke();
          const a = Math.atan2(dy, dx);
          f.beginPath(); f.moveTo(dx * L + Math.cos(a) * 18, dy * L + Math.sin(a) * 18);
          f.lineTo(dx * L + Math.cos(a + 2.5) * 16, dy * L + Math.sin(a + 2.5) * 16);
          f.lineTo(dx * L + Math.cos(a - 2.5) * 16, dy * L + Math.sin(a - 2.5) * 16); f.closePath(); f.fill();
          f.shadowBlur = 0;
          f.font = 'italic 700 40px "Playfair Display"'; f.fillText(lab, dx * L + (dx ? 16 : 20), dy * L + (dy ? -6 : 14));
        };
        arrow(1, 0, '#ffc21f', 'x');
        arrow(0, -1, '#5cc8ff', 'y');
        f.fillStyle = '#fff'; f.beginPath(); f.arc(0, 0, 8, 0, Math.PI * 2); f.fill();
      }
      f.restore();
      // hand lens (screen space)
      const lp = E.outBack(pr(s, 13.14, 13.5), 1.4);
      const cosT = Math.cos(tilt), sinT = Math.sin(tilt);
      const toScreen = (p) => { const x = p.x * SC * scale, y = -p.y * SC * scale; return [ox + x * cosT - y * sinT, oy + x * sinT + y * cosT]; };
      const LX = 1480, LY = 400, LR = 196;
      if (lp > 0.001) {
        const hp = handPoints(b, 1);
        const wr = toScreen(b.Wr);
        f.save();
        f.strokeStyle = `rgba(255,194,31,${(0.7 * pr(s, 13.2, 13.4)).toFixed(3)})`; f.lineWidth = 2; f.setLineDash([6, 6]);
        f.beginPath(); f.moveTo(wr[0], wr[1]); f.lineTo(LX - LR * 0.9 * lp, LY + LR * 0.35 * lp); f.stroke(); f.setLineDash([]);
        f.beginPath(); f.arc(wr[0], wr[1], 36, 0, Math.PI * 2); f.stroke();
        f.translate(LX, LY); f.scale(lp, lp);
        f.beginPath(); f.arc(0, 0, LR, 0, Math.PI * 2);
        f.fillStyle = 'rgba(10,12,18,.92)'; f.fill();
        f.lineWidth = 3; f.strokeStyle = 'rgba(255,194,31,.85)'; f.stroke();
        f.clip();
        f.strokeStyle = 'rgba(92,200,255,.08)'; f.lineWidth = 1;
        for (let g = -LR; g <= LR; g += 28) { f.beginPath(); f.moveTo(g, -LR); f.lineTo(g, LR); f.stroke(); f.beginPath(); f.moveTo(-LR, g); f.lineTo(LR, g); f.stroke(); }
        const cxh = hp[9], zs = 1750;
        const HP = hp.map((p) => [(p.x - cxh.x) * zs, -(p.y - cxh.y) * zs]);
        const nShown = 21 * E.outCubic(pr(s, 13.2, 13.6));
        f.lineWidth = 3; f.strokeStyle = 'rgba(255,255,255,.85)'; f.lineCap = 'round';
        for (const [i, j] of HAND_BONES) if (j < nShown) { f.beginPath(); f.moveTo(...HP[i]); f.lineTo(...HP[j]); f.stroke(); }
        HP.forEach((p, i) => {
          if (i >= nShown) return;
          const pop = E.outBack(clamp(nShown - i), 2);
          f.fillStyle = '#ffc21f'; f.shadowColor = 'rgba(255,194,31,.9)'; f.shadowBlur = 12;
          f.beginPath(); f.arc(p[0], p[1], 7 * pop, 0, Math.PI * 2); f.fill(); f.shadowBlur = 0;
          f.font = '500 12px "JetBrains Mono"'; f.fillStyle = 'rgba(244,237,228,.75)';
          f.fillText(String(i), p[0] + 9, p[1] - 7);
        });
        f.restore();
      }
      // text
      renderKicker(k, s, T.e + 0.12);
      reveal(hd, s, T.e + 0.16);
      reveal(labA, s, 13.3);
      reveal(labB, s, 13.62);
      const pa = E.outExpo(pr(s, 14.26, 14.6));
      st(panel, { opacity: pa.toFixed(3), transform: `translateY(${((1 - pa) * 40).toFixed(1)}px)` });
      drawPanel(s, pa);
    },
  };
});

// =================================================================== SCENE F · judge
addScene(T.f1, T.g + 0.02, (root) => {
  root.style.background = '#07060a';
  const bgImg = el('img', 'abs', root);
  bgImg.style.cssText += 'left:-60px;top:-60px;width:2040px;height:1200px;object-fit:cover;filter:blur(26px) brightness(.28) saturate(1.3);';
  const bgV = el('div', 'overlay', root);
  bgV.style.background = 'radial-gradient(1300px 800px at 50% 55%, rgba(26,20,16,.2) 0%, rgba(7,6,10,.85) 75%)';
  const k = kicker(root, '04', '판정', 'JUDGE', 'left:110px;top:96px;');
  const hd = lines(root, 'headline abs', ['한 번의 스트로크, <span class="g">세 가지</span> 기준'], 'left:110px;top:140px;font-size:76px;');
  const defs = [
    { t: T.f1, lbl: '방향', val: '±35°', n: '01 · DIRECTION' },
    { t: T.f2, lbl: '속도', val: '≥ 0.75 m/s', n: '02 · SPEED' },
    { t: T.f3, lbl: '타이밍', val: '±0.2 s', n: '03 · TIMING' },
  ];
  const panels = defs.map((d, i) => {
    const p = el('div', 'panel', root);
    p.style.left = `${145 + i * 580}px`; p.style.top = '300px';
    const cv = el('canvas', '', p); cv.width = 470; cv.height = 500;
    el('div', 'num', p, d.n);
    el('div', 'lbl', p, d.lbl);
    el('div', 'val', p, d.val);
    return { ...d, p, ctx: cv.getContext('2d'), x: 145 + i * 580 };
  });
  const scrim = el('div', 'overlay', root);
  scrim.style.background = 'radial-gradient(900px 380px at 50% 50%, rgba(7,6,10,.85), rgba(7,6,10,0) 75%)';
  const perf = el('div', 'perfect', root, 'PERFECT');
  perf.style.top = '400px';
  const checks = el('div', 'caption', root, '방향 <em>✓</em> &nbsp;&nbsp; 속도 <em>✓</em> &nbsp;&nbsp; 타이밍 <em>✓</em>');
  checks.style.cssText += 'top:712px;font-size:24px;letter-spacing:.2em;color:rgba(244,237,228,.85);font-family:var(--kr);font-weight:700;';
  function drawDir(c, lt) {
    const cx = 235, cy = 215, R = 150;
    c.strokeStyle = 'rgba(244,237,228,.14)'; c.lineWidth = 2;
    c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.stroke();
    c.beginPath(); c.arc(cx, cy, R * 0.5, 0, Math.PI * 2); c.stroke();
    const wp = E.outExpo(clamp(lt / 0.35));
    const base = Math.PI / 2, half = (35 * Math.PI / 180) * wp;
    const g = c.createRadialGradient(cx, cy, 0, cx, cy, R);
    g.addColorStop(0, 'rgba(255,194,31,.05)'); g.addColorStop(1, 'rgba(255,194,31,.35)');
    c.fillStyle = g; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, R, base - half, base + half); c.closePath(); c.fill();
    c.strokeStyle = '#ffc21f'; c.lineWidth = 2.5;
    for (const sgn of [-1, 1]) { c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(base + sgn * half) * R, cy + Math.sin(base + sgn * half) * R); c.stroke(); }
    c.setLineDash([6, 8]); c.strokeStyle = 'rgba(255,194,31,.7)';
    c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx, cy + R + 10); c.stroke(); c.setLineDash([]);
    // player's stroke vector swinging into the cone
    const vp = E.outElastic(pr(lt, 0.1, 0.9));
    const ang = lerp(base - 1.15, base + 0.12, vp);
    const len = R * 0.92 * E.outCubic(pr(lt, 0.05, 0.3));
    const inside = Math.abs(ang - base) <= 35 * Math.PI / 180;
    c.strokeStyle = inside ? '#fff' : 'rgba(255,255,255,.6)'; c.lineWidth = 7; c.lineCap = 'round';
    c.shadowColor = inside ? 'rgba(255,230,160,.9)' : 'transparent'; c.shadowBlur = inside ? 22 : 0;
    const ex = cx + Math.cos(ang) * len, ey = cy + Math.sin(ang) * len;
    c.beginPath(); c.moveTo(cx, cy); c.lineTo(ex, ey); c.stroke();
    c.fillStyle = c.strokeStyle;
    c.beginPath(); c.moveTo(ex + Math.cos(ang) * 16, ey + Math.sin(ang) * 16); c.lineTo(ex + Math.cos(ang + 2.4) * 18, ey + Math.sin(ang + 2.4) * 18); c.lineTo(ex + Math.cos(ang - 2.4) * 18, ey + Math.sin(ang - 2.4) * 18); c.closePath(); c.fill();
    c.shadowBlur = 0;
    c.fillStyle = '#fff'; c.beginPath(); c.arc(cx, cy, 7, 0, Math.PI * 2); c.fill();
  }
  function drawSpeed(c, lt) {
    const cx = 235, cy = 250, R = 160, a0 = Math.PI * 0.85, a1 = Math.PI * 2.15, vmax = 2.0;
    const A = (v) => a0 + (a1 - a0) * (v / vmax);
    c.lineCap = 'butt';
    c.lineWidth = 18; c.strokeStyle = 'rgba(244,237,228,.1)'; c.beginPath(); c.arc(cx, cy, R, a0, a1); c.stroke();
    c.strokeStyle = 'rgba(255,194,31,.28)'; c.beginPath(); c.arc(cx, cy, R, A(0.75), a1); c.stroke();
    const v = 1.62 * E.outBack(pr(lt, 0.05, 0.5), 1.8);
    c.strokeStyle = '#ffc21f'; c.shadowColor = 'rgba(255,194,31,.8)'; c.shadowBlur = 16;
    c.beginPath(); c.arc(cx, cy, R, a0, A(clamp(v, 0, vmax))); c.stroke(); c.shadowBlur = 0;
    for (const [tv, lab] of [[0.75, 'NORMAL'], [1.5, 'ACCENT ×2']]) {
      const a = A(tv);
      c.strokeStyle = '#fff'; c.lineWidth = 3;
      c.beginPath(); c.moveTo(cx + Math.cos(a) * (R - 22), cy + Math.sin(a) * (R - 22)); c.lineTo(cx + Math.cos(a) * (R + 22), cy + Math.sin(a) * (R + 22)); c.stroke();
      c.font = '500 13px "JetBrains Mono"'; c.fillStyle = 'rgba(244,237,228,.7)'; c.textAlign = 'center';
      c.fillText(lab, cx + Math.cos(a) * (R + 44), cy + Math.sin(a) * (R + 44) + 4);
    }
    const na = A(clamp(v, 0, vmax));
    c.strokeStyle = '#fff'; c.lineWidth = 5; c.lineCap = 'round';
    c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(na) * (R - 30), cy + Math.sin(na) * (R - 30)); c.stroke();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(cx, cy, 10, 0, Math.PI * 2); c.fill();
    c.font = '800 44px "JetBrains Mono"'; c.textAlign = 'center'; c.fillStyle = '#f4ede4';
    c.fillText(clamp(v, 0, 2).toFixed(2), cx, cy + 70);
    c.font = '500 15px "JetBrains Mono"'; c.fillStyle = 'rgba(244,237,228,.5)'; c.fillText('m/s', cx, cy + 96);
    c.textAlign = 'left';
  }
  function drawTiming(c, lt) {
    const cy = 220, x0 = 40, x1 = 430, cx = 235, span = 0.3;
    const X = (dt) => cx + (dt / span) * (x1 - cx);
    c.strokeStyle = 'rgba(244,237,228,.25)'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(x0, cy); c.lineTo(x1, cy); c.stroke();
    const wp = E.outExpo(clamp(lt / 0.4));
    c.fillStyle = 'rgba(255,194,31,.12)'; c.fillRect(X(-0.2 * wp), cy - 60, X(0.2 * wp) - X(-0.2 * wp), 120);
    c.strokeStyle = 'rgba(255,194,31,.8)'; c.lineWidth = 2; c.strokeRect(X(-0.2 * wp), cy - 60, X(0.2 * wp) - X(-0.2 * wp), 120);
    c.fillStyle = 'rgba(255,194,31,.4)'; c.fillRect(X(-0.08 * wp), cy - 60, X(0.08 * wp) - X(-0.08 * wp), 120);
    c.strokeStyle = '#fff'; c.lineWidth = 3; c.beginPath(); c.moveTo(cx, cy - 84); c.lineTo(cx, cy + 84); c.stroke();
    c.font = '500 14px "JetBrains Mono"'; c.fillStyle = 'rgba(244,237,228,.65)'; c.textAlign = 'center';
    c.fillText('−0.2s', X(-0.2), cy + 92); c.fillText('+0.2s', X(0.2), cy + 92); c.fillText('BEAT', cx, cy - 96);
    c.fillStyle = '#ffc21f'; c.fillText('PERFECT ±0.08', cx, cy + 118);
    const mp = pr(lt, 0.12, 0.42);
    const my = lerp(cy - 190, cy, E.outBack(mp, 2.2));
    const mx = X(0.03);
    if (mp > 0) {
      c.fillStyle = '#fff'; c.shadowColor = 'rgba(255,255,255,.9)'; c.shadowBlur = 16;
      c.beginPath(); c.moveTo(mx, my + 14); c.lineTo(mx - 12, my - 8); c.lineTo(mx + 12, my - 8); c.closePath(); c.fill(); c.shadowBlur = 0;
      const rp = pr(lt, 0.42, 0.9);
      if (rp > 0 && rp < 1) { c.strokeStyle = `rgba(255,255,255,${1 - rp})`; c.lineWidth = 2; c.beginPath(); c.ellipse(mx, cy, 10 + 50 * rp, 4 + 16 * rp, 0, 0, Math.PI * 2); c.stroke(); }
    }
    c.textAlign = 'left';
  }
  const draws = [drawDir, drawSpeed, drawTiming];
  return {
    render(s) {
      setSrc(bgImg, gpSrc('perfect', s));
      renderKicker(k, s, T.f1 + 0.04);
      reveal(hd, s, T.f1 + 0.06);
      const pf = s - T.f4;
      panels.forEach((P, i) => {
        const on = s >= P.t;
        show(P.p, on);
        if (!on) return;
        const p = E.outExpo(pr(s, P.t, P.t + 0.34));
        const dim = pf > 0 ? 0.22 + 0.78 * Math.exp(-pf / 0.12) : 1;
        const flash = pf > 0 ? Math.exp(-pf / 0.25) : Math.exp(-(s - P.t) / 0.2);
        st(P.p, {
          transform: `translateY(${((1 - p) * 60).toFixed(1)}px) scale(${(1.22 - 0.22 * p - (pf > 0 ? 0.04 * E.outCubic(pr(pf, 0, 0.3)) : 0)).toFixed(4)}) rotate(${((1 - p) * (i - 1) * 6).toFixed(2)}deg)`,
          opacity: (Math.min(1, p * 3) * dim).toFixed(3),
          filter: `blur(${((1 - p) * 10).toFixed(2)}px)`,
          borderColor: `rgba(255,194,31,${(0.12 + 0.8 * flash).toFixed(3)})`,
          boxShadow: `0 30px 80px rgba(0,0,0,.55), 0 0 ${(80 * flash).toFixed(0)}px rgba(255,194,31,${(0.45 * flash).toFixed(3)})`,
        });
        const c = P.ctx;
        c.clearRect(0, 0, 470, 500);
        c.save(); draws[i](c, s - P.t); c.restore();
        slash(fxc, s, P.t, P.x + 235, 250, P.x + 235, 860, { w: 7, dur: 0.08, life: 0.3 });
        sparks(fxc, s, P.t + 0.06, P.x + 235, 820, { n: 22, seed: i + 5, speed: 900 });
      });
      const po = pf >= 0;
      show(perf, po); show(checks, po); show(scrim, po);
      if (po) {
        const p = E.outExpo(pr(pf, 0, 0.3));
        const exit = pr(s, T.g - 0.06, T.g);
        st(perf, { transform: `scale(${(1.8 - 0.8 * p + 0.04 * pr(pf, 0.3, 0.38)).toFixed(4)})`, opacity: (pr(pf, 0, 0.05) * (1 - exit)).toFixed(3), letterSpacing: `${(0.2 - 0.18 * p).toFixed(3)}em` });
        st(scrim, { opacity: E.outCubic(pr(pf, 0, 0.2)).toFixed(3) });
        const cp = E.outCubic(pr(pf, 0.12, 0.35));
        st(checks, { opacity: cp.toFixed(3), transform: `translateY(${((1 - cp) * 16).toFixed(1)}px)` });
        sparks(fxc, s, T.f4, 960, 520, { n: 70, speed: 1500, life: 0.9, g: 900, seed: 77, size: 3 });
        sparks(fxc, s, T.f4 + 0.02, 960, 520, { n: 40, speed: 700, life: 0.8, g: 500, seed: 78, col: '255,255,255', size: 2 });
      }
      dust(bgc, s, { n: 40, alpha: 0.3, seed: 31 });
    },
  };
});

// =================================================================== SCENE G · fail crossfade
addScene(T.g, T.h + 0.35, (root) => {
  const base = el('div', 'abs', root);
  base.style.cssText += 'left:0;top:0;width:1920px;height:1080px;';
  const img = el('img', 'abs', base);
  img.style.cssText += 'left:0;top:0;width:1920px;height:1080px;object-fit:cover;';
  const slices = Array.from({ length: 5 }, () => {
    const d = el('div', 'abs', base);
    d.style.cssText += 'left:0;top:0;width:1920px;height:1080px;';
    const im = el('img', 'abs', d);
    im.style.cssText += 'left:0;top:0;width:1920px;height:1080px;object-fit:cover;';
    return { d, im };
  });
  const scan = el('div', 'overlay', root);
  scan.style.background = 'repeating-linear-gradient(180deg, rgba(0,0,0,.28) 0 2px, rgba(0,0,0,0) 2px 5px)';
  const shade = el('div', 'overlay', root);
  shade.style.background = 'linear-gradient(90deg, rgba(7,6,10,.92) 0%, rgba(7,6,10,.7) 38%, rgba(7,6,10,.15) 70%, rgba(7,6,10,.35) 100%)';
  const k = kicker(root, '05', '오디오', 'AUDIO', 'left:120px;top:150px;');
  const l1 = lines(root, 'headline abs', ['놓치면,'], 'left:116px;top:196px;font-size:140px;');
  const l2wrap = el('div', 'headline abs', root);
  l2wrap.style.cssText += 'left:116px;top:350px;font-size:140px;color:var(--red);';
  const l2 = chars(l2wrap, '연주가 무너진다.');
  const r1 = lines(root, 'headline abs', ['다시 맞추면,', '<span class="g">되살아난다.</span>'], 'left:116px;top:196px;font-size:140px;');
  const gaugeLab = el('div', 'abs mono', root, 'HEALTH');
  gaugeLab.style.cssText += 'left:120px;top:626px;font-size:17px;letter-spacing:.3em;color:rgba(244,237,228,.7);';
  const gaugeVal = el('div', 'abs mono', root, '');
  gaugeVal.style.cssText += 'left:620px;top:622px;width:140px;text-align:right;font-size:22px;font-weight:700;color:var(--cream);';
  const plaque = el('div', 'plaque', root);
  plaque.style.cssText += 'left:116px;top:660px;';
  const gauge = el('div', 'gauge', plaque);
  const cover = el('div', 'cover', gauge);
  const MP = [[1180, 170, -8], [1500, 300, 7], [1100, 420, 4], [1560, 110, -5], [1330, 470, -10], [1620, 420, 9]];
  const misses = [18.2, 18.52, 18.81, 19.17, 19.57, 19.93].map((t, i) => {
    const m = el('div', 'miss' + (i % 2 ? ' r' : ''), root, 'MISS');
    return { t, m, x: MP[i][0], y: MP[i][1], rot: MP[i][2] };
  });
  const box = el('div', 'wavebox', root);
  box.style.cssText += 'left:1080px;top:600px;width:720px;height:370px;';
  const wc = el('canvas', '', box); wc.width = 720; wc.height = 370;
  const w2 = wc.getContext('2d');
  const perfPop = el('div', 'perfect', root, 'PERFECT');
  perfPop.style.cssText += 'font-size:120px;top:760px;left:-760px;';
  const healthAt = (s) => {
    if (s < T.rec) {
      let h = 0.74;
      for (const m of misses) h -= 0.105 * E.outCubic(pr(s, m.t, m.t + 0.12));
      return Math.max(0.1, h);
    }
    return lerp(0.11, 0.96, E.outCubic(pr(s, T.rec, T.rec + 0.7)));
  };
  function drawWave(s, a) {
    const c = w2;
    c.clearRect(0, 0, 720, 370);
    c.save(); c.globalAlpha = a;
    const m = failMix(s);
    c.font = '800 25px Pretendard'; c.fillStyle = '#f4ede4'; c.fillText('두 개의 연주를 실시간 크로스페이드', 30, 48);
    c.font = '500 14px "JetBrains Mono"'; c.fillStyle = 'rgba(244,237,228,.5)'; c.letterSpacing = '3px';
    c.fillText('WEB AUDIO · SAMPLE-LOCKED · HEALTH → MIX', 30, 76); c.letterSpacing = '0px';
    const lanes = [
      { y: 140, arr: D.wave.n, col: '255,194,31', lab: 'NORMAL', g: Math.cos(m * Math.PI / 2) },
      { y: 240, arr: D.wave.f, col: '255,59,48', lab: 'FAIL', g: Math.sin(m * Math.PI / 2) },
    ];
    const win = 2.2, px0 = 120, px1 = 690, play = px0 + (px1 - px0) * 0.72;
    for (const ln of lanes) {
      c.font = '700 14px "JetBrains Mono"'; c.fillStyle = `rgba(${ln.col},${0.35 + 0.65 * ln.g})`; c.letterSpacing = '2px';
      c.fillText(ln.lab, 30, ln.y + 5); c.letterSpacing = '0px';
      for (let x = px0; x < px1; x += 4) {
        const t = s + ((x - play) / (px1 - px0)) * win;
        const idx = Math.floor((t - D.wave.t0) * D.wave.rate);
        const v = idx >= 0 && idx < ln.arr.length ? ln.arr[idx] : 0;
        const hh = Math.min(42, v * 90);
        const past = x <= play;
        c.fillStyle = `rgba(${ln.col},${((past ? 0.95 : 0.35) * (0.18 + 0.82 * ln.g)).toFixed(3)})`;
        c.fillRect(x, ln.y - hh, 2.4, hh * 2 + 1);
      }
    }
    c.fillStyle = '#fff'; c.fillRect(play, 100, 2, 180);
    // mix slider
    const sy = 318, sx0 = 120, sx1 = 690;
    c.strokeStyle = 'rgba(244,237,228,.25)'; c.lineWidth = 4; c.lineCap = 'round';
    c.beginPath(); c.moveTo(sx0, sy); c.lineTo(sx1, sy); c.stroke();
    const kx = lerp(sx0, sx1, m);
    const gr = c.createLinearGradient(sx0, 0, sx1, 0); gr.addColorStop(0, '#ffc21f'); gr.addColorStop(1, '#ff3b30');
    c.strokeStyle = gr; c.beginPath(); c.moveTo(sx0, sy); c.lineTo(kx, sy); c.stroke();
    c.fillStyle = '#fff'; c.shadowColor = m > 0.5 ? 'rgba(255,59,48,.9)' : 'rgba(255,194,31,.9)'; c.shadowBlur = 18;
    c.beginPath(); c.arc(kx, sy, 11, 0, Math.PI * 2); c.fill(); c.shadowBlur = 0;
    c.font = '700 13px "JetBrains Mono"'; c.fillStyle = 'rgba(244,237,228,.6)'; c.fillText('MIX', 30, sy + 5);
    c.textAlign = 'right'; c.fillStyle = m > 0.5 ? '#ff3b30' : '#ffc21f';
    c.fillText(`${Math.round(m * 100)}% FAIL`, 690, sy - 18); c.textAlign = 'left';
    c.restore();
  }
  return {
    render(s) {
      const failing = s < T.rec;
      const src = gpSrc(failing ? 'fail' : 'perfect', s);
      setSrc(img, src);
      const m = failMix(s);
      const glitch = failing ? E.outCubic(pr(s, T.g, T.g + 0.3)) : 1 - E.outCubic(pr(s, T.rec, T.rec + 0.35));
      const fr = Math.round((s + V0) * 60);
      const gr = rng(fr * 7 + 3);
      const burst = gr() < 0.35 * glitch ? 1 : 0.25;
      document.getElementById('rgb-r').setAttribute('dx', (-(4 + 18 * burst * gr()) * glitch).toFixed(1));
      document.getElementById('rgb-b').setAttribute('dx', ((4 + 18 * burst * gr()) * glitch).toFixed(1));
      st(base, { filter: glitch > 0.01 ? `url(#rgbsplit) grayscale(${(0.55 * glitch).toFixed(3)}) brightness(${(1 - 0.4 * glitch).toFixed(3)}) contrast(${(1 + 0.25 * glitch).toFixed(3)})` : 'brightness(.95)', transform: `translateX(${(glitch * burst * (gr() - 0.5) * 30).toFixed(1)}px)` });
      slices.forEach((q, i) => {
        const on = glitch > 0.05 && gr() < 0.55 * glitch;
        show(q.d, on);
        if (!on) return;
        setSrc(q.im, src);
        const y = gr() * 1000, hh = 12 + gr() * 90;
        st(q.d, { clipPath: `inset(${y.toFixed(0)}px 0 ${(1080 - y - hh).toFixed(0)}px 0)`, transform: `translateX(${((gr() - 0.5) * 160 * glitch).toFixed(0)}px)`, filter: i % 2 ? 'hue-rotate(-40deg) saturate(3)' : 'none' });
      });
      st(scan, { opacity: (0.8 * glitch).toFixed(3) });
      st(document.getElementById('tint'), { opacity: (0.55 * glitch * (0.8 + 0.2 * Math.sin(s * 30))).toFixed(3), background: 'radial-gradient(ellipse at 50% 50%, rgba(255,40,30,.0) 30%, rgba(255,20,10,.45) 100%)', mixBlendMode: 'screen' });
      // text
      renderKicker(k, s, T.g + 0.02, T.h - 0.1);
      const beforeRec = s < T.rec + 0.02;
      show(l1.el, beforeRec); show(l2wrap, beforeRec); show(r1.el, !beforeRec);
      if (beforeRec) {
        reveal(l1, s, T.g + 0.02, { dur: 0.4 });
        l2.forEach((c, i) => {
          const a = 18.43 + i * 0.025;
          const p = E.outExpo(pr(s, a, a + 0.3));
          const fall = pr(s, 19.2 + ((i * 7) % 9) * 0.07, 20.2);
          const fy = 900 * fall * fall, rot = (hash(i) - 0.5) * 120 * fall;
          const jx = (gr() - 0.5) * 10 * glitch * burst, jy = (gr() - 0.5) * 6 * glitch;
          st(c, { transform: `translate(${jx.toFixed(1)}px, ${((1 - p) * 60 + fy + jy).toFixed(1)}px) rotate(${rot.toFixed(1)}deg)`, opacity: (pr(s, a, a + 0.05) * (1 - pr(fall, 0.6, 1))).toFixed(3) });
        });
      } else {
        reveal(r1, s, T.rec + 0.02, { dur: 0.5, exit: T.h - 0.12 });
      }
      // gauge
      const h = healthAt(s);
      st(cover, { width: `${((1 - h) * 100).toFixed(2)}%` });
      gaugeVal.textContent = `${Math.round(h * 100)}%`;
      st(gaugeVal, { color: h < 0.35 ? '#ff3b30' : h < 0.6 ? '#ffc21f' : '#7dffb0' });
      const gi = E.outExpo(pr(s, T.g + 0.1, T.g + 0.5)) * (1 - pr(s, T.h - 0.1, T.h + 0.15));
      for (const e of [plaque, gaugeLab, gaugeVal]) st(e, { opacity: gi.toFixed(3), transform: `translateY(${((1 - gi) * 20).toFixed(1)}px)` });
      for (const q of misses) {
        const d = s - q.t;
        const on = d >= 0 && d < 0.75 && failing;
        show(q.m, on);
        if (!on) continue;
        const p = E.outExpo(pr(d, 0, 0.18));
        st(q.m, { transform: `translate(${q.x.toFixed(0)}px,${(q.y + d * 40).toFixed(0)}px) rotate(${q.rot.toFixed(1)}deg) scale(${(1.6 - 0.6 * p).toFixed(3)})`, opacity: (Math.min(1, d / 0.04) * (1 - pr(d, 0.45, 0.75))).toFixed(3) });
      }
      const bi = E.outExpo(pr(s, T.g + 0.25, T.g + 0.7)) * (1 - pr(s, T.h - 0.1, T.h + 0.15));
      st(box, { opacity: bi.toFixed(3), transform: `translateY(${((1 - bi) * 30).toFixed(1)}px)` });
      drawWave(s, 1);
      const pp = s - T.rec;
      show(perfPop, pp >= 0 && pp < 0.9);
      if (pp >= 0 && pp < 0.9) {
        const p = E.outExpo(pr(pp, 0, 0.25));
        st(perfPop, { transform: `scale(${(1.5 - 0.5 * p).toFixed(3)})`, opacity: (pr(pp, 0, 0.04) * (1 - pr(pp, 0.6, 0.9))).toFixed(3) });
        sparks(fxc, s, T.rec, 440, 820, { n: 50, speed: 1200, seed: 55 });
      }
      const exit = pr(s, T.h - 0.02, T.h + 0.3);
      st(root, { opacity: (1 - exit).toFixed(3) });
    },
    after() { st(document.getElementById('tint'), { opacity: '0' }); },
  };
});

// =================================================================== SCENE H · gameplay + tech stack
addScene(T.h, T.i + 0.7, (root) => {
  const img = el('img', 'abs', root);
  img.style.cssText += 'left:0;top:0;width:1920px;height:1080px;object-fit:cover;transform-origin:62% 55%;';
  const shade = el('div', 'overlay', root);
  shade.style.background = 'linear-gradient(90deg, rgba(7,6,10,.93) 0%, rgba(7,6,10,.82) 32%, rgba(7,6,10,.3) 50%, rgba(7,6,10,0) 64%), linear-gradient(0deg, rgba(7,6,10,.92) 0%, rgba(7,6,10,.6) 18%, rgba(7,6,10,0) 36%)';
  const k = kicker(root, '06', '기술', 'BUILT WITH', 'left:110px;top:150px;');
  const hd = lines(root, 'headline abs', ['설치 없이,', '<span class="g">브라우저</span>에서.'], 'left:110px;top:196px;font-size:112px;');
  const sub = lines(root, 'sub abs', ['프레임워크 없이 순수 TypeScript · 정적 사이트'], 'left:114px;top:454px;font-size:30px;');
  const row = el('div', 'abs', root);
  row.style.cssText += 'left:0;width:1920px;top:846px;display:flex;justify-content:center;gap:14px;';
  const defs = [
    ['TypeScript', 'Vite · 정적 사이트'],
    ['Three.js', '1인칭 3D 무대'],
    ['MediaPipe', '손·몸 추적 · WASM+GPU'],
    ['Web Audio', '마스터 클럭 · 크로스페이드'],
    ['One Euro 필터', '저지연 스무딩 + 관성'],
    ['Vitest · Puppeteer', '채보를 끝까지 치는 봇'],
  ];
  const times = D.beats.filter((b) => b > T.h + 0.1).slice(0, 6);
  const chips = defs.map(([a, b], i) => {
    const c = el('div', 'chip', row, `<b><i></i>${a}</b><span>${b}</span>`);
    c.style.position = 'relative';
    return { c, t: times[i] };
  });
  return {
    render(s) {
      setSrc(img, gpSrc('perfect', s));
      const ein = E.outExpo(pr(s, T.h, T.h + 0.5));
      const ex = pr(s, T.i - 0.05, T.i + 0.6);
      const sc = 1.14 - 0.06 * ein + 0.03 * pr(s, T.h, T.i) - 0.35 * E.inOutCubic(ex);
      st(img, { transform: `scale(${sc.toFixed(4)})`, filter: `brightness(${(1 - 0.6 * ex).toFixed(3)}) blur(${(8 * ex).toFixed(1)}px)`, opacity: (1 - E.inQuad(ex)).toFixed(3) });
      st(shade, { opacity: (1 - ex).toFixed(3) });
      renderKicker(k, s, T.h + 0.06, T.i - 0.15);
      reveal(hd, s, T.h + 0.08, { exit: T.i - 0.15 });
      reveal(sub, s, T.h + 0.3, { exit: T.i - 0.15 });
      for (const q of chips) {
        const p = E.outBack(pr(s, q.t, q.t + 0.4), 1.7);
        const o = pr(s, q.t, q.t + 0.08) * (1 - pr(s, T.i - 0.1, T.i + 0.15));
        const hot = Math.exp(-(s - q.t) / 0.3) * (s >= q.t ? 1 : 0);
        st(q.c, { transform: `translateY(${((1 - p) * 70).toFixed(1)}px) scale(${(0.7 + 0.3 * p).toFixed(4)})`, opacity: o.toFixed(3), borderColor: `rgba(255,194,31,${(0.14 + 0.7 * hot).toFixed(3)})`, boxShadow: `0 18px 50px rgba(0,0,0,.5), 0 0 ${(50 * hot).toFixed(0)}px rgba(255,194,31,${(0.4 * hot).toFixed(3)})` });
      }
    },
  };
});

// =================================================================== SCENE I · end card
addScene(T.i - 0.05, T.end + 0.1, (root) => {
  const img = el('img', 'abs', root);
  img.src = 'stage.jpg';
  img.style.cssText += 'left:0;top:0;width:1920px;height:1080px;object-fit:cover;';
  const shade = el('div', 'overlay', root);
  shade.style.background = 'radial-gradient(1100px 600px at 50% 46%, rgba(7,6,10,.55), rgba(7,6,10,.94) 80%)';
  const logoC = el('canvas', 'abs', root);
  logoC.width = W; logoC.height = H;
  const lc = logoC.getContext('2d');
  const tag = lines(root, 'abs', ['지금, 브라우저에서 <span style="color:var(--gold)">지휘</span>하세요.'], 'left:0;width:1920px;text-align:center;top:598px;font-size:52px;font-weight:800;letter-spacing:-.03em;');
  const pill = el('div', 'pill', root, '<b>kairess.github.io</b>/maestro-web');
  pill.style.top = '700px';
  const note = el('div', 'caption', root, '데스크톱 CHROME · EDGE &nbsp;&nbsp;/&nbsp;&nbsp; 웹캠 하나면 충분');
  note.style.cssText += 'top:800px;font-family:var(--kr);font-weight:600;letter-spacing:.24em;font-size:18px;';
  // particle targets from the logo glyphs
  const LOGO_FONT = '900 196px "Playfair Display"', LY = 470, LOCK = 25.3996;
  let targets = [];
  function sample() {
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d');
    x.font = LOGO_FONT; x.letterSpacing = '23px'; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.fillStyle = '#fff';
    x.fillText('MAESTRO', 960 + 11, LY);
    const d = x.getImageData(0, 0, W, H).data;
    const pts = [];
    for (let y = 250; y < 520; y += 4) for (let xx = 200; xx < 1720; xx += 4) if (d[(y * W + xx) * 4 + 3] > 140) pts.push([xx, y]);
    const r = rng(5);
    for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pts[i], pts[j]] = [pts[j], pts[i]]; }
    targets = pts.slice(0, 2600).map(([tx, ty]) => {
      const th = r() * Math.PI * 2, rad = 380 + r() * 560;
      return { tx, ty, th, rad, d: r() * 0.2 + ((tx - 200) / 1520) * 0.1, arr: LOCK - r() * 0.07, sz: 1.1 + r() * 1.7, hue: r() };
    });
  }
  const rs = document.fonts.load(LOGO_FONT, 'MAESTRO').then(sample);
  window.__ready.push(rs);
  const t0 = T.i;
  return {
    render(s) {
      const bi = E.outCubic(pr(s, t0, t0 + 1.2));
      st(img, { transform: `scale(${(1.25 - 0.1 * pr(s, t0, T.end)).toFixed(4)})`, filter: 'brightness(.6) saturate(1.1) blur(3px)', opacity: bi.toFixed(3) });
      st(shade, { opacity: E.outCubic(pr(s, t0, t0 + 0.5)).toFixed(3) });
      lc.clearRect(0, 0, W, H);
      // a spinning disc of gold particles spirals into the wordmark and locks on the downbeat
      const crisp = E.outCubic(pr(s, LOCK - 0.03, LOCK + 0.1));
      const posAt = (q, t) => {
        const p = E.inOutCubic(pr(t, t0 + q.d, q.arr));
        const th = q.th + (t - t0) * 1.7;
        const dx = 960 + Math.cos(th) * q.rad * 1.45 - q.tx, dy = 520 + Math.sin(th) * q.rad * 0.42 - q.ty;
        const k = 1 - p, ph = 1.6 * k * k;
        return [q.tx + (dx * Math.cos(ph) - dy * Math.sin(ph)) * k, q.ty + (dx * Math.sin(ph) + dy * Math.cos(ph)) * k, p];
      };
      if (crisp < 1 && s > t0 - 0.05) {
        lc.save(); lc.globalCompositeOperation = 'lighter'; lc.lineCap = 'round';
        const fade = pr(s, t0 - 0.05, t0 + 0.25) * (1 - crisp);
        for (const q of targets) {
          const [x, y, p] = posAt(q, s);
          const [x0, y0] = posAt(q, s - 1 / 45);
          const a = fade * (0.55 + 0.45 * p);
          lc.strokeStyle = `rgba(255,${Math.round(lerp(160 + 50 * q.hue, 236, p))},${Math.round(lerp(50, 170, p))},${a.toFixed(3)})`;
          lc.lineWidth = q.sz;
          lc.beginPath(); lc.moveTo(x0, y0); lc.lineTo(x + 0.01, y); lc.stroke();
        }
        lc.restore();
      }
      // shockwave when the logo locks
      const sw = s - LOCK;
      if (sw > 0 && sw < 0.8) {
        const u = E.outCubic(sw / 0.8);
        lc.save(); lc.globalCompositeOperation = 'lighter';
        lc.strokeStyle = `rgba(255,214,140,${(0.8 * (1 - u)).toFixed(3)})`; lc.lineWidth = 4 * (1 - u) + 0.5;
        lc.beginPath(); lc.ellipse(960, 400, 120 + 1100 * u, 40 + 380 * u, 0, 0, Math.PI * 2); lc.stroke();
        lc.restore();
        sparks(fxc, s, LOCK, 960, 400, { n: 80, speed: 1600, life: 0.9, g: 500, seed: 123, size: 2.4 });
      }
      const fin = s - T.fin;
      const pulse = fin > 0 ? Math.exp(-fin / 0.35) : 0;
      if (crisp > 0) {
        lc.save();
        lc.font = LOGO_FONT; lc.letterSpacing = '23px'; lc.textAlign = 'center'; lc.textBaseline = 'alphabetic';
        lc.globalAlpha = crisp;
        const scl = 1 + 0.03 * pulse + 0.015 * pr(s, t0 + 1, T.end);
        lc.translate(960, LY - 70); lc.scale(scl, scl); lc.translate(-960, -(LY - 70));
        lc.shadowColor = `rgba(255,194,31,${(0.35 + 0.5 * pulse).toFixed(3)})`; lc.shadowBlur = 40 + 60 * pulse;
        const g = lc.createLinearGradient(0, 300, 0, 480);
        g.addColorStop(0, '#fffaf0'); g.addColorStop(1, '#f1e2c6');
        lc.fillStyle = g;
        lc.fillText('MAESTRO', 960 + 11, LY);
        lc.shadowBlur = 0;
        lc.font = '500 38px "JetBrains Mono"'; lc.letterSpacing = '17px'; lc.textAlign = 'left'; lc.fillStyle = '#ffc21f';
        lc.globalAlpha = crisp * E.outCubic(pr(s, LOCK + 0.1, LOCK + 0.5));
        lc.fillText('web', 1560, 330);
        lc.restore();
      }
      reveal(tag, s, 25.7831 - 0.04, { dur: 0.7 });
      const pp = E.outExpo(pr(s, 26.1667 - 0.03, 26.1667 + 0.5));
      st(pill, { opacity: pp.toFixed(3), transform: `translateX(-50%) translateY(${((1 - pp) * 26).toFixed(1)}px) scale(${(0.94 + 0.06 * pp).toFixed(4)})`, boxShadow: `0 0 ${(40 + 60 * pulse).toFixed(0)}px rgba(255,194,31,${(0.18 + 0.4 * pulse).toFixed(3)})` });
      const np = E.outCubic(pr(s, 26.5493, 26.5493 + 0.5));
      st(note, { opacity: (np * 0.8).toFixed(3) });
      // final downbeat: underline slash
      slash(fxc, s, T.fin, 470, 525, 1450, 525, { w: 6, dur: 0.16, life: 1.4 });
      sparks(fxc, s, T.fin + 0.14, 1450, 525, { n: 44, speed: 1100, seed: 99, dir: 0, spread: 2.2, g: 700 });
      dust(fxc, s, { n: 70, alpha: 0.55, seed: 41, gain: 0.4 + 0.6 * bi });
    },
  };
});

// ------------------------------------------------------------------ HUD
const hud = $('#hud');
hud.innerHTML = `<div class="tl"><b>MAESTRO</b> <em>web</em> &nbsp;·&nbsp; 웹캠 지휘 리듬게임</div>
  <div class="tr"><span class="bpm"></span> &nbsp; <span class="tc"></span></div>
  <div class="ticks">${'<i></i>'.repeat(8)}</div>`;
const hudBpm = $('.bpm', hud), hudTc = $('.tc', hud), hudTicks = [...hud.querySelectorAll('.ticks i')];

// ------------------------------------------------------------------ grain
const grainEl = $('#grain');
const GRAIN = Array.from({ length: 6 }, (_, k) => {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d'); const d = x.createImageData(256, 256); const r = rng(k + 1);
  for (let i = 0; i < d.data.length; i += 4) { const v = Math.floor(r() * 255); d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  x.putImageData(d, 0, 0);
  return `url(${c.toDataURL()})`;
});

// ------------------------------------------------------------------ main render
window.__ready = window.__ready || [];
async function renderFrame(frame) {
  const s = frame / FPS - V0;
  bgc.clearRect(0, 0, W, H);
  fxc.clearRect(0, 0, W, H);
  for (const sc of scenes) {
    const on = s >= sc.from && s < sc.to;
    show(sc.root, on);
    if (on) sc.render(s);
    else if (sc.after && sc.__wasOn) sc.after();
    sc.__wasOn = on;
  }
  if (!(s >= T.g && s < T.h + 0.35)) st(document.getElementById('tint'), { opacity: '0' });
  // section downbeats: a full-frame baton sweep
  for (const [t0, x0, y0, x1, y1] of [[T.d1, 1640, -60, 260, 1140], [T.h, 280, -60, 1660, 1140]]) {
    slash(fxc, s, t0 - 0.03, x0, y0, x1, y1, { w: 12, dur: 0.12, life: 0.5 });
    sparks(fxc, s, t0 + 0.08, x1, Math.min(y1, 1060), { n: 36, speed: 1300, seed: Math.round(t0 * 10), dir: -Math.PI / 2, spread: 2.4 });
  }
  // camera shake / punch
  const sh = shakeAt(s);
  st($('#world'), { transform: `translate(${sh.x.toFixed(2)}px,${sh.y.toFixed(2)}px) rotate(${sh.r.toFixed(3)}deg) scale(${(1 + sh.z).toFixed(4)})` });
  st($('#flash'), { opacity: flashAt(s).toFixed(3) });
  const fi = Math.round(frame);
  st(grainEl, { backgroundImage: GRAIN[fi % GRAIN.length], backgroundPosition: `${Math.floor(hash(fi) * 256)}px ${Math.floor(hash(fi + 9) * 256)}px` });
  st($('#fade'), { opacity: E.inQuad(pr(s, 29.0, 29.48)).toFixed(3) });
  // HUD
  const ho = pr(s, 6.0, 6.4) * (1 - pr(s, 24.3, 24.6));
  st(hud, { opacity: (ho * 0.9).toFixed(3) });
  if (ho > 0) {
    hudBpm.innerHTML = `♩ = <em>${Math.round(bpmAt(s))}</em>`;
    const v = frame / FPS;
    hudTc.textContent = `00:${String(Math.floor(Math.round(frame) / FPS)).padStart(2, '0')}:${String(Math.round(frame) % FPS).padStart(2, '0')}`;
    const bi = beatIndexAt(s);
    hudTicks.forEach((t, i) => {
      const hot = bi >= 0 && bi % 8 === i ? Math.exp(-(s - BEATS[bi]) / 0.25) : 0;
      st(t, { background: hot > 0.02 ? `rgba(255,194,31,${(0.35 + 0.65 * hot).toFixed(3)})` : 'rgba(244,237,228,.22)', transform: `scaleY(${(1 + 1.5 * hot).toFixed(3)})` });
    });
  }
  const p = pending.splice(0);
  await Promise.all(p);
}

async function ready() {
  await new Promise((r) => (STAGE.complete ? r() : (STAGE.onload = r)));
  await STAGE.decode().catch(() => {});
  const all = document.body.innerText + '0123456789 ♩=:·—→↑↓←↘↙▸✓×±≥%.,MAESTROwebPERFECTMISSBEATx y';
  const specs = ['300', '500', '600', '700', '800', '900'].map((w) => `${w} 40px Pretendard`)
    .concat(['700 40px "Noto Serif KR"', '900 40px "Noto Serif KR"', '900 40px "Playfair Display"', 'italic 900 40px "Playfair Display"', 'italic 700 40px "Playfair Display"', '400 40px "JetBrains Mono"', '500 40px "JetBrains Mono"', '700 40px "JetBrains Mono"', '800 40px "JetBrains Mono"']);
  await Promise.all(specs.map((f) => document.fonts.load(f, all).catch(() => {})));
  await document.fonts.ready;
  await Promise.all(window.__ready);
  return true;
}
window.renderFrame = renderFrame;
window.reelReady = ready();
window.REEL = { FPS, V0, T, DURATION: 30 };
