import * as THREE from 'three';
import type { Gesture, Hand } from '../chart/types';
import { TOKEN_DIRECTION } from '../chart/types';
import { DISPLAY } from '../config';
import type { GestureState, Grade, Judge } from '../game/judge';
import { LANE, glowTexture, type LanesView } from './lanes';

/** Notes hang above their beat line in a queue and fall onto it at the beat (like the original). */
export const RISE_PER_SECOND = 0.3; // metres above the line per second before the beat
export const BACK_PER_SECOND = 0.15; // metres further away per second before the beat
const FADE_IN = 0.3; // seconds
const VIEW_Z = 0.25; // camera z (see SceneView)
const BURST_TIME = 0.3;
const HIT_FADE = 0.25;
const MISS_FADE = 0.35;

type Kind = 'normal' | 'accent' | 'low';

const SIZE: Record<Kind, number> = { normal: 0.104, accent: 0.128, low: 0.084 };
const GOLD = 0xffc21f;

const HIT_COLOR: Record<Grade, number> = {
  perfect: 0xffd35a,
  good: 0xfff1c8,
  miss: 0xff3b30,
  wrong: 0xff3b30,
};

const textures = new Map<string, THREE.Texture>();

/**
 * The original's note glyph: a triangle pointing along the stroke with a short bar behind it
 * (like ⏏). Drawn pointing up; the mesh is rotated to the gesture direction.
 */
function glyphTexture(kind: Kind): THREE.Texture {
  const cached = textures.get(kind);
  if (cached) return cached;
  const s = 256;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d')!;
  const col = kind === 'accent' ? '#ffc21f' : '#ffffff';
  g.lineJoin = 'miter';
  g.shadowColor = kind === 'accent' ? 'rgba(255,194,31,0.9)' : 'rgba(255,255,255,0.9)';
  g.shadowBlur = 14;
  // Hollow triangle pointing up, thick outline.
  g.beginPath();
  g.moveTo(128, 30);
  g.lineTo(216, 170);
  g.lineTo(40, 170);
  g.closePath();
  g.lineWidth = kind === 'accent' ? 22 : 16;
  g.strokeStyle = col;
  g.stroke();
  if (kind === 'accent') {
    g.fillStyle = 'rgba(255,194,31,0.35)';
    g.fill();
  }
  // Solid bar behind the triangle (the tail of the ⏏ glyph).
  g.fillStyle = col;
  g.fillRect(86, 186, 84, 30);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  textures.set(kind, t);
  return t;
}

/** All notes use the right beat line, split into three columns by stroke direction. */
const COLUMN_OFFSET = 0.14; // metres from the lane centre to the left/right columns
const PAIR_OFFSET = 0.085; // two-hand notes in the same column sit side by side

function columnOffset(dir: { x: number; y: number }, hand: Hand, twoHands: boolean): number {
  const col = dir.x < -0.3 ? -COLUMN_OFFSET : dir.x > 0.3 ? COLUMN_OFFSET : 0;
  return col + (twoHands ? (hand === 'left' ? -PAIR_OFFSET : PAIR_OFFSET) : 0);
}

interface NoteVisual {
  hand: Hand;
  dx: number;
  state: GestureState;
  kind: Kind;
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  time: number;
  judgedAt: number | null;
  grade: Grade | null;
}

interface Burst {
  born: number;
  glow: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  sparks: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>;
  vel: Float32Array;
}

/** Where a note sits `r` seconds before its beat (negative r = already past the line). */
export function lanePoint(hand: Hand, r: number, out = new THREE.Vector3(), dx = 0): THREE.Vector3 {
  const lane = LANE[hand];
  const z = lane.z - r * BACK_PER_SECOND;
  // Spread x with depth so the lane runs straight up on screen instead of leaning to the centre.
  const x = (lane.x + dx) * ((VIEW_Z - z) / (VIEW_Z - lane.z));
  return out.set(x, lane.y + r * RISE_PER_SECOND, z);
}

/**
 * Notes scroll along the lane at constant speed and keep going through the beat line. A stroke
 * fades the note out wherever it is; a note that drifts too far past the line (the judge's window
 * closes) turns red and fades.
 */
export class NotesView {
  private visuals = new Map<string, NoteVisual>();
  private bursts: Burst[] = [];
  private nextIndex = 0;
  private plane = new THREE.PlaneGeometry(1, 1);

  constructor(
    private scene: THREE.Scene,
    private judge: Judge,
    private lanes: LanesView,
  ) {}

  private key(g: Gesture, hand: Hand): string {
    return `${g.id}:${hand}`;
  }

  private spawn(state: GestureState, hand: Hand, token: keyof typeof TOKEN_DIRECTION, twoHands: boolean): void {
    const g = state.gesture;
    const kind: Kind = g.type === 'Accent' ? 'accent' : g.type === 'Low' ? 'low' : 'normal';
    const mat = new THREE.MeshBasicMaterial({ map: glyphTexture(kind), transparent: true, opacity: 0, depthWrite: false, toneMapped: false, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(this.plane, mat);
    const d = TOKEN_DIRECTION[token];
    mesh.rotation.z = Math.atan2(d.y, d.x) - Math.PI / 2;
    mesh.scale.setScalar(SIZE[kind]);
    mesh.renderOrder = 2;
    this.scene.add(mesh);
    this.visuals.set(this.key(g, hand), { hand, dx: columnOffset(d, hand, twoHands), state, kind, mesh, time: g.time, judgedAt: null, grade: null });
  }

  /** Called when the judge emits a gesture result. */
  onJudged(g: Gesture, grade: Grade, now: number): void {
    for (const hand of ['left', 'right'] as Hand[]) {
      const v = this.visuals.get(this.key(g, hand));
      if (!v) continue;
      if (v.judgedAt !== null) {
        // Already fading from the moment the stroke was detected: just colour the line flash.
        if (grade === 'perfect') this.lanes.flash('right', HIT_COLOR.perfect, 1);
        continue;
      }
      v.judgedAt = now;
      v.grade = grade;
      const hit = grade === 'perfect' || grade === 'good';
      v.mesh.material.color.setHex(HIT_COLOR[grade]);
      if (hit) {
        this.lanes.flash('right', HIT_COLOR[grade], grade === 'perfect' ? 1 : 0.6);
        this.addBurst(v, grade);
      }
    }
  }

  private addBurst(v: NoteVisual, grade: Grade): void {
    const color = v.kind === 'accent' || grade === 'perfect' ? GOLD : 0xffffff;
    const glow = new THREE.Mesh(
      this.plane,
      new THREE.MeshBasicMaterial({ map: glowTexture(), color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    );
    glow.position.copy(v.mesh.position);
    glow.renderOrder = 3;
    const n = 14;
    const pos = new Float32Array(n * 3);
    const vel = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = v.mesh.position.x;
      pos[i * 3 + 1] = v.mesh.position.y;
      pos[i * 3 + 2] = v.mesh.position.z;
      const a = Math.random() * Math.PI * 2;
      const sp = 0.15 + Math.random() * 0.35;
      vel[i * 3] = Math.cos(a) * sp;
      vel[i * 3 + 1] = Math.sin(a) * sp * 0.6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const sparks = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color, size: 0.014, map: glowTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    );
    sparks.frustumCulled = false;
    this.scene.add(glow, sparks);
    this.bursts.push({ born: v.judgedAt ?? 0, glow, sparks, vel });
  }

  update(songTime: number, dt: number): void {
    // Spawn upcoming notes.
    const states = this.judge.gestures;
    while (this.nextIndex < states.length && states[this.nextIndex].gesture.time - DISPLAY.gestureAnticipation <= songTime) {
      const s = states[this.nextIndex];
      for (const r of s.requirements) this.spawn(s, r.hand, r.token, s.requirements.length > 1);
      this.nextIndex++;
    }
    const lead = DISPLAY.gestureAnticipation;
    for (const [k, v] of this.visuals) {
      const m = v.mesh;
      const remain = v.time - songTime;
      // Always keep moving: through the line and on toward the player.
      lanePoint('right', remain, m.position, v.dx);
      if (v.judgedAt === null && v.state.hitTimes.every((h) => h !== undefined)) {
        // Every required hand has made a correct stroke: react now instead of waiting for the
        // grade (which is settled only after the stroke's speed peak has passed).
        v.judgedAt = songTime;
        v.grade = 'good';
        m.material.color.setHex(0xffffff);
        this.lanes.flash('right', HIT_COLOR.good, 0.6);
        this.addBurst(v, v.kind === 'accent' ? 'perfect' : 'good');
      }
      if (v.judgedAt !== null) {
        const hit = v.grade === 'perfect' || v.grade === 'good';
        const u = Math.min(1, (songTime - v.judgedAt) / (hit ? HIT_FADE : MISS_FADE));
        m.material.opacity = 1 - u;
        m.scale.setScalar(SIZE[v.kind] * (hit ? 1 + u * 0.3 : 1));
        if (u >= 1) this.remove(k, v);
        continue;
      }
      const age = lead - remain;
      const fade = Math.min(1, age / FADE_IN);
      const depthFade = 1 - 0.45 * Math.min(1, Math.max(0, remain / lead));
      m.material.opacity = (v.kind === 'low' ? 0.75 : 1) * fade * depthFade;
      if (remain < -1.0) this.remove(k, v); // safety: should have been judged by now
    }
    this.updateBursts(songTime, dt);
  }

  private updateBursts(songTime: number, dt: number): void {
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      const g = Math.min(1, (songTime - b.born) / BURST_TIME);
      b.glow.scale.setScalar(0.12 + g * 0.2);
      b.glow.material.opacity = 1 - g;
      const pos = b.sparks.geometry.attributes.position as THREE.BufferAttribute;
      for (let j = 0; j < pos.count; j++) {
        pos.setXYZ(j, pos.getX(j) + b.vel[j * 3] * dt, pos.getY(j) + b.vel[j * 3 + 1] * dt, pos.getZ(j));
        b.vel[j * 3 + 1] -= 0.6 * dt;
      }
      pos.needsUpdate = true;
      b.sparks.material.opacity = 1 - g;
      if (g >= 1) {
        this.disposeBurst(b);
        this.bursts.splice(i, 1);
      }
    }
  }

  private disposeBurst(b: Burst): void {
    b.glow.removeFromParent();
    b.sparks.removeFromParent();
    b.glow.material.dispose();
    b.sparks.material.dispose();
    b.sparks.geometry.dispose();
  }

  private remove(key: string, v: NoteVisual): void {
    this.scene.remove(v.mesh);
    v.mesh.material.dispose();
    this.visuals.delete(key);
  }

  clear(): void {
    for (const [k, v] of this.visuals) this.remove(k, v);
    for (const b of this.bursts) this.disposeBurst(b);
    this.bursts = [];
  }
}
