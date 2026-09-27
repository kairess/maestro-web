import { describe, expect, it } from 'vitest';
import type { Chart, Hand, Token } from '../src/chart/types';
import { EASY_PROFILE, ORIGINAL_PROFILE } from '../src/config';
import { Judge, type JudgeEvent } from '../src/game/judge';
import type { BodySnapshot, HandSample } from '../src/tracking/handState';

const SHOULDERS = { left: { x: -0.2, y: 0, z: 0 }, right: { x: 0.2, y: 0, z: 0 } };

function hand(t: number, vel: { x: number; y: number }, pos = { x: 0, y: -0.2, z: -0.3 }): HandSample {
  return { t, pos, vel, speed: Math.hypot(vel.x, vel.y) };
}

function snap(t: number, right: HandSample | null = null, left: HandSample | null = null): BodySnapshot {
  return { t, hands: { left, right }, shoulders: SHOULDERS, tracked: true };
}

function chartWith(gestures: { time: number; tokens: Token[]; type?: 'Normal' | 'Accent' }[]): Chart {
  return {
    name: 'test',
    audio: ['a.ogg'],
    applauseTime: null,
    numInitialBeatsToSkip: 0,
    beatTimes: [],
    gestures: gestures.map((g, i) => ({ id: i, beat: i, time: g.time, tokens: g.tokens, type: g.type ?? 'Normal' })),
    cues: [],
    dynamics: [],
    fermatas: [],
    focusSections: [],
    endTime: 10,
  };
}

/** Run the judge over a timeline at 30 fps; `motion(t)` supplies hand velocities. */
function run(judge: Judge, until: number, motion: (t: number) => Partial<Record<Hand, { x: number; y: number }>>): JudgeEvent[] {
  const events: JudgeEvent[] = [];
  for (let t = 0; t <= until; t += 1 / 30) {
    const m = motion(t);
    events.push(...judge.update(snap(t, m.right ? hand(t, m.right) : hand(t, { x: 0, y: 0 }), m.left ? hand(t, m.left) : hand(t, { x: 0, y: 0 }))));
  }
  return events;
}

/**
 * Triangular speed profile peaking where the judge expects it for a stroke landing at `center`:
 * shifted by the detection lag (no tracker lag here) and the stroke lead.
 */
const stroke = (center: number, t: number, dir: { x: number; y: number }, speed: number) => {
  const u = 1 - Math.abs(t - (center + EASY_PROFILE.detectionLag - EASY_PROFILE.strokeLead)) / 0.1;
  return u > 0 ? { x: dir.x * speed * u, y: dir.y * speed * u } : { x: 0, y: 0 };
};

describe('gesture judging', () => {
  it('hits a correct down stroke on time as perfect', () => {
    const judge = new Judge(chartWith([{ time: 1.0, tokens: ['Down'] }]), EASY_PROFILE);
    const ev = run(judge, 2, (t) => ({ right: stroke(1.0, t, { x: 0, y: -1 }, 0.8) }));
    expect(ev).toHaveLength(1);
    expect(ev[0].kind).toBe('gesture');
    expect(ev[0].grade).toBe('perfect');
  });

  it('grades a late-but-in-window stroke as good', () => {
    const judge = new Judge(chartWith([{ time: 1.0, tokens: ['Down'] }]), EASY_PROFILE);
    const ev = run(judge, 2, (t) => ({ right: stroke(1.18, t, { x: 0, y: -1 }, 0.8) }));
    expect(ev[0].grade).toBe('good');
  });

  it('misses when the hand does not move', () => {
    const judge = new Judge(chartWith([{ time: 1.0, tokens: ['Down'] }]), EASY_PROFILE);
    const ev = run(judge, 2, () => ({}));
    expect(ev[0].grade).toBe('miss');
  });

  it('flags a clearly opposite stroke as wrong', () => {
    const judge = new Judge(chartWith([{ time: 1.0, tokens: ['Down'] }]), EASY_PROFILE);
    const ev = run(judge, 2, (t) => ({ right: stroke(1.0, t, { x: 0, y: 1 }, 0.8) }));
    expect(ev[0].grade).toBe('wrong');
  });

  it('misses a stroke that is outside the timing window', () => {
    const judge = new Judge(chartWith([{ time: 1.0, tokens: ['Down'] }]), EASY_PROFILE);
    const ev = run(judge, 2, (t) => ({ right: stroke(1.5, t, { x: 0, y: -1 }, 0.8) }));
    expect(ev[0].grade).toBe('miss');
  });

  it('misses a stroke that is too slow', () => {
    const judge = new Judge(chartWith([{ time: 1.0, tokens: ['Down'] }]), EASY_PROFILE);
    const ev = run(judge, 2, (t) => ({ right: stroke(1.0, t, { x: 0, y: -1 }, 0.1) }));
    expect(ev[0].grade).toBe('miss');
  });

  it('requires accent speed for accent gestures', () => {
    const slow = new Judge(chartWith([{ time: 1.0, tokens: ['Down'], type: 'Accent' }]), EASY_PROFILE);
    expect(run(slow, 2, (t) => ({ right: stroke(1.0, t, { x: 0, y: -1 }, 0.5) }))[0].grade).toBe('miss');
    const fast = new Judge(chartWith([{ time: 1.0, tokens: ['Down'], type: 'Accent' }]), EASY_PROFILE);
    expect(run(fast, 2, (t) => ({ right: stroke(1.0, t, { x: 0, y: -1 }, 1.0) }))[0].grade).toBe('perfect');
  });

  it('single-token gestures are for the right (baton) hand only', () => {
    const easy = new Judge(chartWith([{ time: 1.0, tokens: ['Down'] }]), EASY_PROFILE);
    expect(run(easy, 2, (t) => ({ left: stroke(1.0, t, { x: 0, y: -1 }, 0.8) }))[0].grade).toBe('miss');
    const orig = new Judge(chartWith([{ time: 1.0, tokens: ['Down'] }]), ORIGINAL_PROFILE);
    expect(run(orig, 2, (t) => ({ left: stroke(1.0, t, { x: 0, y: -1 }, 1.0) }))[0].grade).toBe('miss');
  });

  it('needs both hands for two-token gestures', () => {
    const one = new Judge(chartWith([{ time: 1.0, tokens: ['Down', 'Down'], type: 'Accent' }]), EASY_PROFILE);
    expect(run(one, 2, (t) => ({ right: stroke(1.0, t, { x: 0, y: -1 }, 1.0) }))[0].grade).toBe('miss');
    const both = new Judge(chartWith([{ time: 1.0, tokens: ['Down', 'Down'], type: 'Accent' }]), EASY_PROFILE);
    const ev = run(both, 2, (t) => ({ right: stroke(1.0, t, { x: 0, y: -1 }, 1.0), left: stroke(1.05, t, { x: 0, y: -1 }, 1.0) }));
    expect(ev[0].grade).toBe('perfect');
  });

  it('maps DownLeft/DownRight to left and right hands respectively', () => {
    const judge = new Judge(chartWith([{ time: 1.0, tokens: ['DownLeft', 'DownRight'], type: 'Accent' }]), EASY_PROFILE);
    const s = Math.SQRT1_2;
    const ev = run(judge, 2, (t) => ({ left: stroke(1.0, t, { x: -s, y: -s }, 1.0), right: stroke(1.0, t, { x: s, y: -s }, 1.0) }));
    expect(ev[0].grade).toBe('perfect');
  });

  it('judges consecutive Down/Up beats independently', () => {
    const judge = new Judge(
      chartWith([
        { time: 1.0, tokens: ['Down'] },
        { time: 1.4, tokens: ['Up'] },
        { time: 1.8, tokens: ['Down'] },
      ]),
      EASY_PROFILE,
    );
    const ev = run(judge, 3, (t) => ({
      right: (() => {
        const a = stroke(1.0, t, { x: 0, y: -1 }, 0.8);
        const b = stroke(1.4, t, { x: 0, y: 1 }, 0.8);
        const c = stroke(1.8, t, { x: 0, y: -1 }, 0.8);
        return { x: a.x + b.x + c.x, y: a.y + b.y + c.y };
      })(),
    }));
    expect(ev.map((e) => e.grade)).toEqual(['perfect', 'perfect', 'perfect']);
  });

  it('does not let one stroke satisfy two gestures', () => {
    const judge = new Judge(
      chartWith([
        { time: 1.0, tokens: ['Down'] },
        { time: 1.2, tokens: ['Down'] },
      ]),
      EASY_PROFILE,
    );
    const ev = run(judge, 3, (t) => ({ right: stroke(1.0, t, { x: 0, y: -1 }, 0.8) }));
    expect(ev.map((e) => e.grade)).toEqual(['perfect', 'miss']);
  });
});

describe('expression judging', () => {
  /** Left hand at a given height each frame (speed 0). */
  function runLeft(chart: Chart, y: (t: number) => number, x: (t: number) => number = () => -0.22): JudgeEvent[] {
    const judge = new Judge(chart, EASY_PROFILE, () => 1);
    const ev: JudgeEvent[] = [];
    for (let t = 0; t <= 3; t += 1 / 30) ev.push(...judge.update(snap(t, null, hand(t, { x: 0, y: 0 }, { x: x(t), y: y(t), z: -0.3 }))));
    return ev;
  }

  it('crescendo: a small rise held to the end is perfect, even if it starts mid-span', () => {
    const chart = chartWith([]);
    chart.dynamics = [{ id: 0, type: 'Crescendo', instrument: 'Flute', begin: 0, end: 1, time: [1, 2] }];
    // Flat until 1.5s, then rises 8cm and stays.
    const ev = runLeft(chart, (t) => (t < 1.5 ? -0.3 : -0.3 + Math.min(0.08, (t - 1.5) * 0.4)));
    expect(ev[0].kind).toBe('dynamics');
    expect(ev[0].grade).toBe('perfect');
  });

  it('crescendo: rising then sinking back is only good; lowering is a miss', () => {
    const chart = chartWith([]);
    chart.dynamics = [{ id: 0, type: 'Crescendo', instrument: 'Flute', begin: 0, end: 1, time: [1, 2] }];
    const bounce = runLeft(chart, (t) => (t < 1.3 ? -0.3 : t < 1.6 ? -0.2 : -0.3));
    expect(bounce[0].grade).toBe('good');
    const down = runLeft(chart, (t) => -0.3 - Math.max(0, t - 1) * 0.1);
    expect(down[0].grade).toBe('miss');
  });

  it('decrescendo mirrors crescendo', () => {
    const chart = chartWith([]);
    chart.dynamics = [{ id: 0, type: 'Decrescendo', instrument: 'Choir', begin: 0, end: 1, time: [1, 2] }];
    expect(runLeft(chart, (t) => -0.1 - Math.max(0, t - 1.2) * 0.2)[0].grade).toBe('perfect');
    expect(runLeft(chart, (t) => -0.3 + Math.max(0, t - 1) * 0.2)[0].grade).toBe('miss');
  });

  it('fermata: holding still anywhere is a hit, moving is a miss', () => {
    const chart = chartWith([]);
    chart.fermatas = [{ id: 0, instrument: 'Choir', begin: 0, end: 1, time: [1, 2] }];
    const held = new Judge(chart, EASY_PROFILE);
    const events: JudgeEvent[] = [];
    for (let t = 0; t <= 3; t += 1 / 30) events.push(...held.update(snap(t, null, hand(t, { x: 0, y: 0 }, { x: -0.3, y: -0.4, z: -0.3 }))));
    expect(events[0].grade).toBe('perfect');
    const moving = new Judge(chart, EASY_PROFILE);
    const ev2: JudgeEvent[] = [];
    for (let t = 0; t <= 3; t += 1 / 30) ev2.push(...moving.update(snap(t, null, hand(t, { x: 0.6, y: 0 }, { x: -0.3, y: 0.1, z: -0.3 }))));
    expect(ev2[0].grade).toBe('miss');
  });

  it('cue: a quick raise is good, raised toward the section is perfect, no raise is a miss', () => {
    const chart = chartWith([]);
    chart.cues = [{ id: 0, beat: 0, time: 1, instrument: 'Trumpet' }]; // azimuth() → 1: on the right
    const raise = (t: number) => (t < 0.9 ? -0.3 : Math.min(-0.1, -0.3 + (t - 0.9) * 1.0));
    expect(runLeft(chart, raise, (t) => (t < 0.9 ? -0.22 : -0.22 + Math.min(0.1, (t - 0.9) * 0.5)))[0].grade).toBe('perfect');
    expect(runLeft(chart, raise, (t) => (t < 0.9 ? -0.22 : -0.22 - Math.min(0.1, (t - 0.9) * 0.5)))[0].grade).toBe('good');
    expect(runLeft(chart, () => -0.3)[0].grade).toBe('miss');
  });
});
