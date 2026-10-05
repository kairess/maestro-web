import * as THREE from 'three';
import type { Chart, Dynamics, Fermata } from '../chart/types';
import type { Grade, Judge } from '../game/judge';
import { LANE_WIDTH, type LanesView } from './lanes';
import { lanePoint } from './notes';

/**
 * Left-hand expressions as in the original: a flat "speed bump" profile swept along the left lane,
 * so a long ridge slides down toward the beat line at note speed. The front face is the profile,
 * the body trails up the lane, and repeated outlines of the profile mark the length.
 *  - Crescendo: gold, a low, flat, pointed mountain.
 *  - Decrescendo: cyan, the same mountain upside down (point at the bottom, flat top).
 *  - Sustain (release) / fermata (demo): gold, a low, flat, rounded hill.
 *  - Contain (release): violet, a low flat plateau — hold the orchestra back.
 *  - Cut (release): white, a short sharp wedge — the one-beat release after a sustain.
 * The line eats the ridge while the expression lasts; the shape itself stays and glows with the
 * live score. Hit = bright flash of the profile on the line, miss = red.
 */
const GOLD = 0xffc21f;
const CYAN = 0x2ab8ff;
const VIOLET = 0xb48cff;
const WHITE = 0xf4f7ff;
const RED = 0xff3b30;
const VIEW_R = 1.6; // seconds of lane shown ahead of the line (about the note preview)
const RIB_EVERY = 0.5; // seconds between profile outlines along the ridge
const HALF_W = LANE_WIDTH * 0.36; // metres, half width of the profile at the line
const HEIGHT = 0.05; // metres, height of the profile at the line
const TAPER = 0.18; // shrink of the far end, for a slight trapezoid
const OUTRO = 0.45;
const MAX_RIBS = 6;

type Kind = 'crescendo' | 'decrescendo' | 'fermata' | 'contain' | 'cut';
type Source = 'dynamics' | 'fermata';

const KIND_OF: Record<Dynamics['type'], Kind> = {
  Crescendo: 'crescendo',
  Decrescendo: 'decrescendo',
  Sustain: 'fermata',
  Contain: 'contain',
  Cut: 'cut',
};
const COLOR: Record<Kind, number> = { crescendo: GOLD, decrescendo: CYAN, fermata: GOLD, contain: VIOLET, cut: WHITE };

/** Closed outline of each profile: x in [-1, 1] across the lane, y in [0, 1] of HEIGHT. */
function profile(kind: Kind): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  const N = 16;
  if (kind === 'contain') {
    // Low plateau: flat top, short sloped sides.
    for (let i = 0; i <= N; i++) {
      const x = -1 + (2 * i) / N;
      pts.push(new THREE.Vector2(x, 0.6 * Math.min(1, (1 - Math.abs(x)) / 0.3)));
    }
  } else if (kind === 'cut') {
    // Sharp, narrow wedge.
    for (let i = 0; i <= N; i++) {
      const x = -1 + (2 * i) / N;
      pts.push(new THREE.Vector2(x, 1.3 * Math.pow(1 - Math.abs(x), 3)));
    }
  } else if (kind === 'fermata') {
    // Rounded hill: flat shoulders, soft round top.
    for (let i = 0; i <= N; i++) {
      const x = -1 + (2 * i) / N;
      pts.push(new THREE.Vector2(x, Math.pow(0.5 + 0.5 * Math.cos(Math.PI * x), 0.55)));
    }
  } else {
    // Low pointed mountain with slightly concave flanks.
    for (let i = 0; i <= N; i++) {
      const x = -1 + (2 * i) / N;
      const y = Math.pow(1 - Math.abs(x), 1.6);
      pts.push(new THREE.Vector2(x, kind === 'decrescendo' ? 1 - y : y));
    }
  }
  // Close along the flat side (the base, or the top for the inverted one) — already implied by
  // the first and last points sharing the same y; the outline is closed by the loop.
  return pts;
}

interface Slab {
  kind: Kind;
  source: Source;
  id: number;
  t0: number;
  t1: number;
  color: THREE.Color;
  outline: THREE.Vector2[];
  capTris: number[][];
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
  front: THREE.LineLoop<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  ribs: THREE.LineLoop<THREE.BufferGeometry, THREE.LineBasicMaterial>[];
  judgedAt: number | null;
  hit: boolean;
}

export class ExpressionsView {
  private slabs: Slab[] = [];
  private queue: { kind: Kind; source: Source; ev: Dynamics | Fermata }[];
  private next = 0;
  private now = 0;
  private near = new THREE.Vector3();
  private far = new THREE.Vector3();
  /** Left-hand glow for the hand renderer: colour and strength of the live expression. */
  glow: { color: number; amount: number } | null = null;

  constructor(
    private scene: THREE.Scene,
    chart: Chart,
    private judge: Judge,
    private lanes: LanesView,
  ) {
    this.queue = [
      ...chart.dynamics.map((d) => ({ kind: KIND_OF[d.type], source: 'dynamics' as Source, ev: d as Dynamics | Fermata })),
      ...chart.fermatas.map((f) => ({ kind: 'fermata' as Kind, source: 'fermata' as Source, ev: f as Dynamics | Fermata })),
    ].sort((a, b) => a.ev.time[0] - b.ev.time[0]);
  }

  private spawn(kind: Kind, source: Source, ev: Dynamics | Fermata): void {
    const color = new THREE.Color(COLOR[kind]);
    const outline = profile(kind);
    const n = outline.length;
    const capTris = THREE.ShapeUtils.triangulateShape(outline, []);
    // Non-indexed: sides (n quads incl. the closing edge) + two caps.
    const verts = n * 6 + capTris.length * 3 * 2;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts * 3), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(verts * 4), 4));
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({ color, vertexColors: true, transparent: true, depthWrite: false, toneMapped: false, side: THREE.DoubleSide }),
    );
    mesh.frustumCulled = false;
    mesh.renderOrder = 1;
    const loop = (opacity: number) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      const l = new THREE.LineLoop(g, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity, depthWrite: false, toneMapped: false }));
      l.frustumCulled = false;
      l.renderOrder = 2;
      return l;
    };
    const front = loop(1);
    const ribs = Array.from({ length: MAX_RIBS }, () => loop(0.6));
    this.scene.add(mesh, front, ...ribs);
    this.slabs.push({ kind, source, id: ev.id, t0: ev.time[0], t1: ev.time[1], color, outline, capTris, mesh, front, ribs, judgedAt: null, hit: false });
  }

  onJudged(kind: 'dynamics' | 'fermata', id: number, grade: Grade): void {
    const s = this.slabs.find((x) => x.id === id && x.source === kind);
    const hit = grade === 'perfect' || grade === 'good';
    this.lanes.flash('left', hit ? (s ? s.color.getHex() : GOLD) : RED, 1);
    if (s) {
      s.judgedAt = this.now;
      s.hit = hit;
    }
  }

  /** World position of profile point p on the cross-section r seconds up the lane. */
  private at(p: THREE.Vector2, r: number, base: THREE.Vector3, out: THREE.Vector3): THREE.Vector3 {
    const k = 1 - TAPER * Math.min(1, r / VIEW_R);
    return out.set(base.x + p.x * HALF_W * k, base.y + p.y * HEIGHT * k, base.z);
  }

  update(t: number): void {
    this.now = t;
    while (this.next < this.queue.length && this.queue[this.next].ev.time[0] - VIEW_R <= t) {
      this.spawn(this.queue[this.next].kind, this.queue[this.next].source, this.queue[this.next].ev);
      this.next++;
    }
    const liveD = this.judge.liveDynamics();
    const liveF = this.judge.liveFermata();
    this.glow = null;
    let hold = 0;
    let holdColor = GOLD;
    for (let i = this.slabs.length - 1; i >= 0; i--) {
      const s = this.slabs[i];
      let live = 0;
      let active = false;
      if (s.source === 'fermata' && liveF && liveF.fermata.id === s.id) {
        active = true;
        live = liveF.holdRatio;
      } else if (s.source === 'dynamics' && liveD && liveD.dynamics.id === s.id) {
        active = true;
        live = liveD.score;
      }

      const r0 = Math.max(0, s.t0 - t);
      const r1 = Math.min(VIEW_R, s.t1 - t);
      let fade = 1;
      let flash = 0;
      if (s.judgedAt !== null || r1 <= r0) {
        // Outro: the profile stays on the line, flashing white (hit) or turning red (miss).
        const since = s.judgedAt !== null ? t - s.judgedAt : 0;
        const u = Math.min(1, since / OUTRO);
        fade = 1 - u;
        flash = s.hit ? 1 - u : 0;
        if (u >= 1 || (s.judgedAt === null && t > s.t1 + 1)) {
          this.dispose(s);
          this.slabs.splice(i, 1);
          continue;
        }
      }
      const tint = s.judgedAt !== null && !s.hit ? new THREE.Color(RED) : s.color.clone();
      // Held: the shape stays and brightens toward white with the live score.
      tint.lerp(new THREE.Color(0xffffff), Math.max(active ? 0.08 + 0.12 * live : 0, flash * 0.45));
      s.mesh.material.color.copy(tint);

      const len = Math.max(0, r1 - r0);
      this.writeBody(s, r0, r0 + len, fade * (active ? 0.8 + 0.2 * live : 0.72));
      // Front outline at the near face, ribs every RIB_EVERY seconds of the song along the body.
      this.writeLoop(s.front, s, r0);
      s.front.material.color.copy(s.judgedAt !== null && !s.hit ? new THREE.Color(RED) : new THREE.Color(0xffffff));
      s.front.material.opacity = fade * (active || flash > 0 ? 1 : 0.85);
      const firstRib = Math.ceil((t + r0 - s.t0) / RIB_EVERY + 1e-6);
      s.ribs.forEach((rib, k) => {
        const rr = s.t0 + (firstRib + k) * RIB_EVERY - t;
        const show = rr > r0 && rr < r0 + len;
        rib.visible = show;
        if (!show) return;
        this.writeLoop(rib, s, rr);
        rib.material.color.copy(tint).lerp(new THREE.Color(0xffffff), 0.5);
        rib.material.opacity = fade * 0.7 * (1 - 0.7 * (rr / VIEW_R));
      });

      if (active) {
        const amount = Math.max(0.3, live);
        this.glow = { color: s.color.getHex(), amount };
        if (amount > hold) {
          hold = amount;
          holdColor = s.color.getHex();
        }
      }
    }
    this.lanes.hold('left', holdColor, hold);
  }

  private writeLoop(l: Slab['front'], s: Slab, r: number): void {
    const pos = l.geometry.attributes.position as THREE.BufferAttribute;
    lanePoint('left', r, this.near);
    const v = new THREE.Vector3();
    s.outline.forEach((p, i) => {
      this.at(p, r, this.near, v);
      pos.setXYZ(i, v.x, v.y, v.z + 0.001);
    });
    pos.needsUpdate = true;
  }

  private writeBody(s: Slab, r0: number, r1: number, alpha: number): void {
    const geo = s.mesh.geometry;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const col = geo.attributes.color as THREE.BufferAttribute;
    lanePoint('left', r0, this.near);
    lanePoint('left', r1, this.far);
    const n = s.outline.length;
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const d = new THREE.Vector3();
    const aNear = alpha * (1 - 0.5 * (r0 / VIEW_R));
    const aFar = alpha * (1 - 0.9 * (r1 / VIEW_R));
    let k = 0;
    const put = (p: THREE.Vector3, shade: number, al: number) => {
      pos.setXYZ(k, p.x, p.y, p.z);
      col.setXYZW(k, shade, shade, shade, al);
      k++;
    };
    // Sides: flat 2D-style shading, brighter on up-facing edges.
    for (let i = 0; i < n; i++) {
      const p = s.outline[i];
      const q = s.outline[(i + 1) % n];
      const dx = q.x - p.x;
      const dy = q.y - p.y;
      const up = Math.abs(dx) / Math.max(1e-6, Math.hypot(dx, dy)); // 1 = horizontal edge
      const shade = 0.55 + 0.35 * up;
      this.at(p, r0, this.near, a);
      this.at(q, r0, this.near, b);
      this.at(p, r1, this.far, c);
      this.at(q, r1, this.far, d);
      put(a, shade, aNear);
      put(b, shade, aNear);
      put(c, shade, aFar);
      put(c, shade, aFar);
      put(b, shade, aNear);
      put(d, shade, aFar);
    }
    // Caps: near face bright (the profile you see arriving), far face dimmer.
    for (const [cap, r, base, shade, al] of [
      ['near', r0, this.near, 1, aNear],
      ['far', r1, this.far, 0.8, aFar],
    ] as const) {
      void cap;
      for (const tri of s.capTris) for (const idx of tri) put(this.at(s.outline[idx], r, base, a), shade, al);
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
  }

  private dispose(s: Slab): void {
    for (const o of [s.mesh, s.front, ...s.ribs]) {
      o.removeFromParent();
      o.geometry.dispose();
      o.material.dispose();
    }
  }

  clear(): void {
    for (const s of this.slabs) this.dispose(s);
    this.slabs = [];
    this.glow = null;
    this.lanes.hold('left', GOLD, 0);
  }
}
