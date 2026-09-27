import type { Chart, Cue, Dynamics, Fermata, Gesture, Hand, HandRequirement, Token } from '../chart/types';
import { TOKEN_DIRECTION } from '../chart/types';
import type { GestureTolerance, JudgeProfile } from '../config';
import type { BodySnapshot, HandSample } from '../tracking/handState';

export type Grade = 'perfect' | 'good' | 'miss' | 'wrong';

export type JudgeEvent =
  | { kind: 'gesture'; gesture: Gesture; grade: Grade; dt: number; t: number }
  | { kind: 'cue'; cue: Cue; grade: Grade; t: number }
  | { kind: 'dynamics'; dynamics: Dynamics; grade: Grade; score: number; t: number }
  | { kind: 'fermata'; fermata: Fermata; grade: Grade; holdRatio: number; t: number };

export type GesturePhase = 'pending' | 'active' | 'done';

export interface GestureState {
  gesture: Gesture;
  phase: GesturePhase;
  requirements: HandRequirement[];
  /** Hit time per requirement index (undefined until satisfied). */
  hitTimes: (number | undefined)[];
  /** Peak-speed tracking per requirement, used to time the stroke at its fastest point. */
  peaks: ({ hand: Hand; speed: number; t: number; settled: boolean } | undefined)[];
  /** Whether a strong off-direction stroke was seen in the window. */
  sawWrong: boolean;
  grade?: Grade;
  dt?: number;
}

interface CueState {
  cue: Cue;
  phase: GesturePhase;
  /** Lowest left-hand point seen inside the window and where it was horizontally. */
  minY: number;
  xAtMin: number;
  sawRise: boolean;
  grade?: Grade;
}

interface DynamicsState {
  dynamics: Dynamics;
  phase: GesturePhase;
  /** Signed height (y for crescendo, -y for decrescendo): the "rise" is always positive. */
  lowest: number;
  peak: number;
  bestRise: number;
  /** Signed height of the last frame, to see whether the rise was held. */
  last: number;
  score: number;
  grade?: Grade;
}

interface FermataState {
  fermata: Fermata;
  phase: GesturePhase;
  frames: number;
  heldFrames: number;
  holdRatio: number;
  grade?: Grade;
}

/** Maps an instrument name to a horizontal stage position in [-1, 1] (conductor's left = -1). */
export type InstrumentAzimuth = (instrument: string) => number;

export function angleBetweenDeg(ax: number, ay: number, bx: number, by: number): number {
  const la = Math.hypot(ax, ay);
  const lb = Math.hypot(bx, by);
  if (la < 1e-9 || lb < 1e-9) return 180;
  const c = Math.min(1, Math.max(-1, (ax * bx + ay * by) / (la * lb)));
  return (Math.acos(c) * 180) / Math.PI;
}

export function requirementsFor(g: Gesture, profile: JudgeProfile): HandRequirement[] {
  if (g.tokens.length === 2) {
    return [
      { hand: 'left', token: g.tokens[0] },
      { hand: 'right', token: g.tokens[1] },
    ];
  }
  if (g.tokens.length >= 3 && !profile.tripleTokenAsSingle) {
    return [
      { hand: 'left', token: g.tokens[0] },
      { hand: 'right', token: g.tokens[0] },
    ];
  }
  return [{ hand: 'right', token: g.tokens[0] }];
}

export class Judge {
  readonly gestures: GestureState[];
  private cues: CueState[];
  private dynamics: DynamicsState[];
  private fermatas: FermataState[];
  private gi = 0; // first gesture index that is not done
  private ci = 0;
  private di = 0;
  private fi = 0;
  private lastT = -Infinity;
  private strokeLockUntil: Record<Hand, number> = { left: -Infinity, right: -Infinity };

  constructor(
    readonly chart: Chart,
    readonly profile: JudgeProfile,
    private azimuth: InstrumentAzimuth = () => 0,
  ) {
    const skipBeat = chart.numInitialBeatsToSkip;
    this.gestures = chart.gestures
      .filter((g) => g.beat >= skipBeat)
      .map((g) => {
        const requirements = requirementsFor(g, profile);
        return { gesture: g, phase: 'pending', requirements, hitTimes: requirements.map(() => undefined), peaks: requirements.map(() => undefined), sawWrong: false };
      });
    this.cues = chart.cues.map((cue) => ({ cue, phase: 'pending', minY: Infinity, xAtMin: 0, sawRise: false }));
    this.dynamics = chart.dynamics.map((dynamics) => ({ dynamics, phase: 'pending', lowest: Infinity, peak: -Infinity, bestRise: 0, last: NaN, score: 0 }));
    this.fermatas = chart.fermatas.map((fermata) => ({ fermata, phase: 'pending', frames: 0, heldFrames: 0, holdRatio: 0 }));
  }

  private tolerance(g: Gesture): GestureTolerance {
    if (g.type === 'Accent') return this.profile.accent;
    if (g.type === 'Low') return this.profile.low;
    return this.profile.normal;
  }

  /** Live dynamics currently in progress (for HUD). */
  liveDynamics(): DynamicsState | null {
    const d = this.dynamics[this.di];
    return d && d.phase === 'active' ? d : null;
  }

  liveFermata(): FermataState | null {
    const f = this.fermatas[this.fi];
    return f && f.phase === 'active' ? f : null;
  }

  /** Feed one tracked frame. Returns the judgement events produced by this frame. */
  update(snap: BodySnapshot): JudgeEvent[] {
    const events: JudgeEvent[] = [];
    const t = snap.t;
    const dt = this.lastT === -Infinity ? 1 / 30 : Math.max(0, t - this.lastT);
    this.lastT = t;
    this.updateGestures(snap, events);
    this.updateCues(snap, events);
    this.updateDynamics(snap, dt, events);
    this.updateFermatas(snap, events);
    return events;
  }

  // ---------------------------------------------------------------- gestures

  private strokeMatches(sample: HandSample | null, token: Token, tol: GestureTolerance): 'hit' | 'wrong' | 'none' {
    if (!sample || sample.speed < tol.speed) return 'none';
    const dir = TOKEN_DIRECTION[token];
    const ang = angleBetweenDeg(sample.vel.x, sample.vel.y, dir.x, dir.y);
    if (ang <= tol.angleDeg) return 'hit';
    if (ang >= this.profile.wrongAngleDeg) return 'wrong';
    return 'none';
  }

  private updateGestures(snap: BodySnapshot, events: JudgeEvent[]): void {
    const t = snap.t;
    const w = this.profile.timeWindow;
    for (let i = this.gi; i < this.gestures.length; i++) {
      const s = this.gestures[i];
      const gt = s.gesture.time;
      if (gt - w > t) break; // future gestures are sorted; nothing else to do
      if (s.phase === 'done') continue;
      if (s.phase === 'pending') s.phase = 'active';

      const tol = this.tolerance(s.gesture);
      const single = s.requirements.length === 1;
      for (let r = 0; r < s.requirements.length; r++) {
        const req = s.requirements[r];
        const peak = s.peaks[r];
        if (peak) {
          // Already crossed the threshold: follow the stroke to its fastest point.
          if (peak.settled) continue;
          const h = snap.hands[peak.hand];
          if (h && h.speed > peak.speed && this.strokeMatches(h, req.token, tol) === 'hit') {
            peak.speed = h.speed;
            peak.t = t;
          } else peak.settled = true;
          continue;
        }
        const candidates: Hand[] = single && this.profile.anyHandForSingle ? ['right', 'left'] : [req.hand];
        for (const hand of candidates) {
          if (t < this.strokeLockUntil[hand]) continue;
          const h = snap.hands[hand];
          const res = this.strokeMatches(h, req.token, tol);
          if (res === 'hit') {
            s.hitTimes[r] = t;
            s.peaks[r] = { hand, speed: h!.speed, t, settled: false };
            this.strokeLockUntil[hand] = t + 0.15;
            break;
          }
          // Only the hand the chart actually asks for can mark a stroke as "wrong"; the other
          // hand is free to cue or shape dynamics at the same time.
          if (res === 'wrong' && hand === req.hand) s.sawWrong = true;
        }
      }

      const allHit = s.hitTimes.every((h) => h !== undefined);
      const settled = s.peaks.every((p) => p?.settled);
      if (allHit && (settled || t > gt + w)) {
        const peakT = Math.max(...s.peaks.map((p) => p!.t));
        // Positive dt = late. The speed peak is expected strokeLead before the beat.
        const dt = peakT - this.profile.detectionLag + this.profile.strokeLead - gt;
        s.grade = Math.abs(dt) <= this.profile.perfectWindow ? 'perfect' : 'good';
        s.dt = dt;
        this.finishGesture(s, events, t);
      } else if (!allHit && t > gt + w) {
        s.grade = s.sawWrong ? 'wrong' : 'miss';
        s.dt = NaN;
        this.finishGesture(s, events, t);
      }
    }
    while (this.gi < this.gestures.length && this.gestures[this.gi].phase === 'done') this.gi++;
  }

  private finishGesture(s: GestureState, events: JudgeEvent[], t: number): void {
    s.phase = 'done';
    events.push({ kind: 'gesture', gesture: s.gesture, grade: s.grade!, dt: s.dt!, t });
  }

  // -------------------------------------------------------------------- cues
  // A cue is a quick raise of the left hand toward a section. Only the relative
  // rise inside the window counts, so it works whether the player conducts from the
  // shoulder or with small wrist motions, and regardless of where the webcam sits.

  private updateCues(snap: BodySnapshot, events: JudgeEvent[]): void {
    const t = snap.t;
    const c = this.profile.cue;
    const w = c.timeWindow;
    for (let i = this.ci; i < this.cues.length; i++) {
      const s = this.cues[i];
      const ct = s.cue.time;
      if (ct - w > t) break;
      if (s.phase === 'done') continue;
      s.phase = 'active';
      const h = snap.hands.left;
      if (h) {
        if (h.pos.y < s.minY) {
          s.minY = h.pos.y;
          s.xAtMin = h.pos.x;
        }
        const rise = h.pos.y - s.minY;
        if (rise >= c.rise) {
          s.sawRise = true;
          const az = this.azimuth(s.cue.instrument);
          const dx = h.pos.x - s.xAtMin;
          const sideOk = Math.abs(az) < 0.2 || (az > 0 ? dx >= c.sideShift : dx <= -c.sideShift);
          if (sideOk) {
            s.grade = 'perfect';
            s.phase = 'done';
            events.push({ kind: 'cue', cue: s.cue, grade: 'perfect', t });
            continue;
          }
        }
      }
      if (t > ct + w) {
        s.grade = s.sawRise ? 'good' : 'miss';
        s.phase = 'done';
        events.push({ kind: 'cue', cue: s.cue, grade: s.grade, t });
      }
    }
    while (this.ci < this.cues.length && this.cues[this.ci].phase === 'done') this.ci++;
  }

  // ---------------------------------------------------------------- dynamics
  // Crescendo: at any point in the span the hand rises by `rise` from its lowest
  // point so far and stays up until the span ends. Decrescendo is the mirror image.

  private expressiveHand(snap: BodySnapshot): HandSample | null {
    return snap.hands.left ?? snap.hands.right;
  }

  private updateDynamics(snap: BodySnapshot, _dt: number, events: JudgeEvent[]): void {
    const t = snap.t;
    const d = this.profile.dynamics;
    for (let i = this.di; i < this.dynamics.length; i++) {
      const s = this.dynamics[i];
      const [t0, t1] = s.dynamics.time;
      if (t0 > t) break;
      if (s.phase === 'done') continue;
      s.phase = 'active';
      if (t <= t1) {
        const h = this.expressiveHand(snap);
        if (h) {
          const y = s.dynamics.type === 'Decrescendo' ? -h.pos.y : h.pos.y;
          s.lowest = Math.min(s.lowest, y);
          const rise = y - s.lowest;
          if (rise > s.bestRise) {
            s.bestRise = rise;
            s.peak = y;
          }
          s.last = y;
          s.score = Math.min(1, s.bestRise / d.rise);
        }
      } else {
        const held = Number.isFinite(s.last) && s.peak - s.last <= d.dropTolerance;
        s.grade = s.bestRise >= d.rise && held ? 'perfect' : s.bestRise >= d.goodRise ? 'good' : 'miss';
        s.phase = 'done';
        events.push({ kind: 'dynamics', dynamics: s.dynamics, grade: s.grade, score: s.score, t });
      }
    }
    while (this.di < this.dynamics.length && this.dynamics[this.di].phase === 'done') this.di++;
  }

  // ---------------------------------------------------------------- fermatas
  // Hold still (either hand) for most of the span; height does not matter.

  private isHolding(h: HandSample | null): boolean {
    return !!h && h.speed <= this.profile.fermata.stillSpeed;
  }

  private updateFermatas(snap: BodySnapshot, events: JudgeEvent[]): void {
    const t = snap.t;
    for (let i = this.fi; i < this.fermatas.length; i++) {
      const s = this.fermatas[i];
      const [t0, t1] = s.fermata.time;
      if (t0 > t) break;
      if (s.phase === 'done') continue;
      s.phase = 'active';
      if (t <= t1) {
        s.frames++;
        if (this.isHolding(snap.hands.left) || this.isHolding(snap.hands.right)) s.heldFrames++;
        s.holdRatio = s.heldFrames / s.frames;
      } else {
        const f = this.profile.fermata;
        s.grade = s.holdRatio >= 0.9 ? 'perfect' : s.holdRatio >= f.holdFraction ? 'good' : 'miss';
        s.phase = 'done';
        events.push({ kind: 'fermata', fermata: s.fermata, grade: s.grade, holdRatio: s.holdRatio, t });
      }
    }
    while (this.fi < this.fermatas.length && this.fermatas[this.fi].phase === 'done') this.fi++;
  }
}
