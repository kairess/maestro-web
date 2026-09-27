import { SCORING } from '../config';
import type { Grade, JudgeEvent } from './judge';

export interface ScoreSummary {
  score: number;
  combo: number;
  maxCombo: number;
  counts: Record<Grade, number>;
  health: number;
  total: number;
  rank: string;
  /** Mean timing of hit strokes in ms (positive = late), null if there were none. */
  meanOffsetMs: number | null;
}

function smoothstep(lo: number, hi: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - lo) / (hi - lo)));
  return t * t * (3 - 2 * t);
}

export class Scoring {
  score = 0;
  combo = 0;
  maxCombo = 0;
  health = 1;
  counts: Record<Grade, number> = { perfect: 0, good: 0, miss: 0, wrong: 0 };
  private offsetSum = 0;
  private offsetCount = 0;
  /** Smoothed crossfade into the "fail" track, 0..1. */
  failGain = 0;

  constructor(readonly total: number) {}

  get multiplier(): number {
    return Math.min(SCORING.maxMultiplier, 1 + Math.floor(this.combo / SCORING.comboStep) * SCORING.comboBonus);
  }

  apply(ev: JudgeEvent): void {
    const grade = ev.grade;
    this.counts[grade]++;
    if (ev.kind === 'gesture' && Number.isFinite(ev.dt)) {
      this.offsetSum += ev.dt;
      this.offsetCount++;
    }
    if (grade === 'perfect' || grade === 'good') {
      this.combo++;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      const base = grade === 'perfect' ? SCORING.perfect : SCORING.good;
      this.score += Math.round(base * this.multiplier);
      this.health = Math.min(1, this.health + (grade === 'perfect' ? SCORING.healthPerfect : SCORING.healthGood));
    } else {
      this.combo = 0;
      this.health = Math.max(0, this.health + SCORING.healthMiss);
    }
  }

  /** Advance the crossfade smoothing by dt seconds; returns the current fail gain. */
  tick(dt: number): number {
    const target = smoothstep(SCORING.failLo, SCORING.failHi, 1 - this.health);
    const a = 1 - Math.exp(-dt / SCORING.failTau);
    this.failGain += (target - this.failGain) * a;
    return this.failGain;
  }

  summary(): ScoreSummary {
    const judged = this.counts.perfect + this.counts.good + this.counts.miss + this.counts.wrong;
    const acc = judged > 0 ? (this.counts.perfect + 0.6 * this.counts.good) / judged : 0;
    const rank = acc >= 0.95 ? 'S' : acc >= 0.85 ? 'A' : acc >= 0.7 ? 'B' : acc >= 0.5 ? 'C' : 'D';
    return {
      score: this.score,
      combo: this.combo,
      maxCombo: this.maxCombo,
      counts: { ...this.counts },
      health: this.health,
      total: this.total,
      rank,
      meanOffsetMs: this.offsetCount > 0 ? Math.round((this.offsetSum / this.offsetCount) * 1000) : null,
    };
  }
}
