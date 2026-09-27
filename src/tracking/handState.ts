import type { Hand } from '../chart/types';
import { TRACKING } from '../config';
import { OneEuroVec3 } from './oneEuro';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

/** A hand's state at one capture instant, expressed in conductor (body) space in meters. */
export interface HandSample {
  /** Capture time in song seconds (already latency-compensated). */
  t: number;
  pos: Vec3;
  /** Velocity in the frontal plane (m/s). */
  vel: { x: number; y: number };
  speed: number;
  /** Full 21-landmark hand in body space, if the hand landmarker saw it. */
  landmarks?: Vec3[];
  /** True when this sample is extrapolated from momentum because tracking dropped out. */
  coasting?: boolean;
}

/** Everything the judge and renderer need from one tracked frame. */
export interface BodySnapshot {
  t: number;
  hands: Record<Hand, HandSample | null>;
  /** Shoulder positions in body space (origin is the shoulder midpoint, so y ≈ 0). */
  shoulders: Record<Hand, Vec3>;
  /** True when the tracker actually saw a person this frame. */
  tracked: boolean;
}

interface Entry {
  t: number;
  pos: Vec3;
}

/** Per-hand history: filtered positions and velocity estimate. */
export class HandTracker {
  private filter = new OneEuroVec3(TRACKING.oneEuro.minCutoff, TRACKING.oneEuro.beta, TRACKING.oneEuro.dCutoff);
  private history: Entry[] = [];
  private lastSeen = -Infinity;
  private last: HandSample | null = null;
  private coastVel = { x: 0, y: 0 };

  constructor(public readonly hand: Hand) {}

  reset(): void {
    this.filter.reset();
    this.history = [];
    this.lastSeen = -Infinity;
    this.last = null;
  }

  /**
   * No detection this frame: extrapolate from the last sample with decaying velocity.
   * Returns null once the hand has been gone longer than `coastSeconds`.
   */
  coast(t: number): HandSample | null {
    const last = this.last;
    if (!last || t - this.lastSeen > TRACKING.coastSeconds || t < last.t) return null;
    const dt = Math.max(0, t - last.t);
    const decay = Math.exp(-dt / TRACKING.coastTau);
    const vel = { x: this.coastVel.x * decay, y: this.coastVel.y * decay };
    // Integrate the decaying velocity analytically: Δ = v0 · τ · (1 − e^(−dt/τ)).
    const step = TRACKING.coastTau * (1 - decay);
    const d = { x: this.coastVel.x * step, y: this.coastVel.y * step };
    const pos = { x: last.pos.x + d.x, y: last.pos.y + d.y, z: last.pos.z };
    const landmarks = last.landmarks?.map((p) => ({ x: p.x + d.x, y: p.y + d.y, z: p.z }));
    const sample: HandSample = { t, pos, vel, speed: Math.hypot(vel.x, vel.y), landmarks, coasting: true };
    this.history.push({ t, pos });
    return sample;
  }

  /** Push a raw (body-space) position; returns the filtered sample with velocity. */
  push(rawPos: Vec3, t: number, landmarks?: Vec3[]): HandSample {
    if (t - this.lastSeen > 0.5 || t < this.lastSeen) {
      // Tracking was lost for a while (or the clock restarted): restart so we don't smear across the gap.
      this.filter.reset();
      this.history = [];
    }
    this.lastSeen = t;
    const pos = this.filter.filter(rawPos, t);
    this.history.push({ t, pos });
    const minT = t - TRACKING.historySeconds;
    while (this.history.length > 2 && this.history[0].t < minT) this.history.shift();
    const vel = this.velocityAt(t);
    const sample: HandSample = { t, pos, vel, speed: Math.hypot(vel.x, vel.y), landmarks };
    this.last = sample;
    this.coastVel = vel;
    return sample;
  }

  /** Velocity from the sample ~velocitySpan seconds ago to the newest one. */
  private velocityAt(t: number): { x: number; y: number } {
    const n = this.history.length;
    if (n < 2) return { x: 0, y: 0 };
    const newest = this.history[n - 1];
    let older = this.history[n - 2];
    for (let i = n - 2; i >= 0; i--) {
      older = this.history[i];
      if (t - older.t >= TRACKING.velocitySpan) break;
    }
    const dt = newest.t - older.t;
    if (dt <= 1e-4) return { x: 0, y: 0 };
    return { x: (newest.pos.x - older.pos.x) / dt, y: (newest.pos.y - older.pos.y) / dt };
  }

  /** Recent positions (oldest first) for trail rendering. */
  trail(): readonly Entry[] {
    return this.history;
  }
}
