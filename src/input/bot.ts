import type { Chart, Hand } from '../chart/types';
import { TOKEN_DIRECTION } from '../chart/types';
import type { JudgeProfile } from '../config';
import { requirementsFor, type InstrumentAzimuth } from '../game/judge';
import type { Vec3 } from '../tracking/handState';
import { DEFAULT_SHOULDERS, REST_POSITION, type InputSource, type RawFrame } from './types';

interface Stroke {
  hand: Hand;
  dir: { x: number; y: number };
  time: number;
  amp: number;
}

const OUT = 0.15; // half duration of the out-stroke (velocity peaks at the beat)
const RELAX_TAU = 0.45; // after the stroke the hand relaxes back toward rest

/**
 * Synthesizes an ideal performance from the chart. Used to regression-test the
 * judge, timing and visuals without a camera (`?bot=1`).
 */
export class BotInput implements InputSource {
  private strokes: Stroke[];
  private timingJitter: number;

  constructor(
    private chart: Chart,
    profile: JudgeProfile,
    private azimuth: InstrumentAzimuth,
    opts: { jitter?: number } = {},
  ) {
    this.timingJitter = opts.jitter ?? 0;
    this.strokes = [];
    for (const g of chart.gestures) {
      const amp = g.type === 'Accent' ? 0.4 : g.type === 'Low' ? 0.18 : 0.25;
      const jitter = (Math.random() * 2 - 1) * this.timingJitter;
      for (const r of requirementsFor(g, profile)) {
        // Like a real player, the stroke finishes on the beat: its speed peak comes strokeLead earlier.
        this.strokes.push({ hand: r.hand, dir: TOKEN_DIRECTION[r.token], time: g.time - profile.strokeLead + jitter, amp });
      }
    }
    this.strokes.sort((a, b) => a.time - b.time);
  }

  /** Displacement along the stroke direction: smoothstep out-stroke, then exponential relaxation. */
  private static profile(dt: number, amp: number): number {
    if (dt < -OUT) return 0;
    if (dt < OUT) {
      const u = (dt + OUT) / (2 * OUT);
      return amp * u * u * (3 - 2 * u);
    }
    return amp * Math.exp(-(dt - OUT) / RELAX_TAU);
  }

  poll(t: number): RawFrame | null {
    const pos: Record<Hand, Vec3> = { left: { ...REST_POSITION.left }, right: { ...REST_POSITION.right } };
    for (const s of this.strokes) {
      const dt = t - s.time;
      if (dt < -OUT) break;
      if (dt > 2.5) continue;
      const off = BotInput.profile(dt, s.amp);
      pos[s.hand].x += s.dir.x * off;
      pos[s.hand].y += s.dir.y * off;
    }
    // Left-hand expression: cues (raise toward the instrument), dynamics (vertical drift), fermatas (hold up).
    for (const c of this.chart.cues) {
      const dt = t - c.time;
      if (dt < -0.3 || dt > 0.5) continue;
      const az = this.azimuth(c.instrument);
      // Raise over 0.2s, hold through the beat, lower over 0.3s.
      const u = dt < -0.1 ? 1 - (-dt - 0.1) / 0.2 : dt > 0.2 ? 1 - (dt - 0.2) / 0.3 : 1;
      const target = { x: -0.2 + az * 0.45, y: 0.2, z: -0.5 };
      pos.left.x += (target.x - REST_POSITION.left.x) * u;
      pos.left.y += (target.y - REST_POSITION.left.y) * u;
      pos.left.z += (target.z - REST_POSITION.left.z) * u;
    }
    for (const d of this.chart.dynamics) {
      const [t0, t1] = d.time;
      if (t < t0 - 0.2 || t > t1 + 0.2) continue;
      const u = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
      const dir = d.type === 'Decrescendo' ? -1 : 1;
      pos.left.y += dir * (0.15 * (t1 - t0)) * u; // 0.15 m/s
    }
    for (const f of this.chart.fermatas) {
      const [t0, t1] = f.time;
      if (t < t0 - 0.3 || t > t1 + 0.1) continue;
      pos.left.y = 0.15;
      pos.left.x = -0.3;
    }
    return { t, tracked: true, shoulders: DEFAULT_SHOULDERS, hands: { left: { pos: pos.left }, right: { pos: pos.right } } };
  }
}
