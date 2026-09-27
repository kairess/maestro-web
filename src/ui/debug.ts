import type { JudgeEvent } from '../game/judge';
import type { RawFrame } from '../input/types';
import type { BodySnapshot } from '../tracking/handState';

const POSE_EDGES: [number, number][] = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], [11, 23], [12, 24], [23, 24],
  [15, 17], [15, 19], [15, 21], [16, 18], [16, 20], [16, 22],
];
const HAND_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
];

/** Draws landmarks over the camera preview and prints tracking/judge numbers. */
export class DebugOverlay {
  private log: string[] = [];
  private fpsCount = 0;
  private fps = 0;
  private lastFpsT = performance.now();

  constructor(
    private canvas: HTMLCanvasElement,
    private panel: HTMLElement,
  ) {}

  pushEvent(ev: JudgeEvent): void {
    const label =
      ev.kind === 'gesture'
        ? `G${ev.gesture.id} ${ev.gesture.tokens.join('/')} ${ev.gesture.type} → ${ev.grade}${Number.isFinite(ev.dt) ? ` (${(ev.dt * 1000).toFixed(0)}ms)` : ''}`
        : ev.kind === 'cue'
          ? `Cue ${ev.cue.instrument} → ${ev.grade}`
          : ev.kind === 'dynamics'
            ? `${ev.dynamics.type} → ${ev.grade} (${ev.score.toFixed(2)})`
            : `Fermata → ${ev.grade} (${(ev.holdRatio * 100).toFixed(0)}%)`;
    this.log.unshift(`${ev.t.toFixed(2)}s ${label}`);
    if (this.log.length > 10) this.log.pop();
  }

  drawLandmarks(raw: RawFrame | null, videoW: number, videoH: number): void {
    const c = this.canvas;
    if (c.width !== videoW || c.height !== videoH) {
      c.width = videoW;
      c.height = videoH;
    }
    const g = c.getContext('2d')!;
    g.clearRect(0, 0, c.width, c.height);
    const d = raw?.debug;
    if (!d) return;
    const W = c.width;
    const H = c.height;
    if (d.pose) {
      g.strokeStyle = 'rgba(120, 220, 255, 0.9)';
      g.lineWidth = 2;
      for (const [a, b] of POSE_EDGES) {
        const p = d.pose[a];
        const q = d.pose[b];
        if (!p || !q) continue;
        g.beginPath();
        g.moveTo(p.x * W, p.y * H);
        g.lineTo(q.x * W, q.y * H);
        g.stroke();
      }
      g.fillStyle = 'rgba(255, 210, 90, 0.95)';
      for (const i of [15, 16]) {
        const p = d.pose[i];
        if (!p) continue;
        g.beginPath();
        g.arc(p.x * W, p.y * H, 6, 0, Math.PI * 2);
        g.fill();
      }
    }
    if (d.hands) {
      g.strokeStyle = 'rgba(255, 140, 200, 0.9)';
      g.lineWidth = 1.5;
      for (const hand of d.hands) {
        for (const [a, b] of HAND_EDGES) {
          const p = hand[a];
          const q = hand[b];
          if (!p || !q) continue;
          g.beginPath();
          g.moveTo(p.x * W, p.y * H);
          g.lineTo(q.x * W, q.y * H);
          g.stroke();
        }
      }
    }
  }

  tick(): void {
    const now = performance.now();
    this.fpsCount++;
    if (now - this.lastFpsT > 500) {
      this.fps = (this.fpsCount * 1000) / (now - this.lastFpsT);
      this.fpsCount = 0;
      this.lastFpsT = now;
    }
  }

  render(snap: BodySnapshot | null, raw: RawFrame | null, extra: Record<string, string | number>): void {
    const f = raw?.debug?.frame;
    const fmt = (v: { x: number; y: number; z: number } | undefined) => (v ? `${v.x.toFixed(2)} ${v.y.toFixed(2)} ${v.z.toFixed(2)}` : '-');
    const hand = (h: BodySnapshot['hands']['left']) =>
      h ? `pos ${fmt(h.pos)}  vel ${h.vel.x.toFixed(2)} ${h.vel.y.toFixed(2)}  |v| ${h.speed.toFixed(2)}` : 'not tracked';
    const lines = [
      `render fps ${this.fps.toFixed(0)}  inference ${raw?.debug?.inferenceMs?.toFixed(1) ?? '-'} ms`,
      ...Object.entries(extra).map(([k, v]) => `${k}: ${typeof v === 'number' ? v.toFixed(3) : v}`),
      `frame x̂ ${fmt(f?.x)}  ŷ ${fmt(f?.y)}  ẑ ${fmt(f?.z)}  shoulder ${f?.shoulderWidth.toFixed(2) ?? '-'} m`,
      `L ${hand(snap?.hands.left ?? null)}`,
      `R ${hand(snap?.hands.right ?? null)}`,
      '',
      ...this.log,
    ];
    this.panel.textContent = lines.join('\n');
  }
}
