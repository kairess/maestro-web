import { describe, expect, it } from 'vitest';
import { TRACKING } from '../src/config';
import { DEFAULT_SHOULDERS, type RawFrame } from '../src/input/types';
import { TrackerSet } from '../src/tracking/trackerSet';

function frame(t: number, right: { x: number; y: number } | null): RawFrame {
  return {
    t,
    tracked: right !== null,
    shoulders: DEFAULT_SHOULDERS,
    hands: { left: null, right: right ? { pos: { x: right.x, y: right.y, z: -0.3 } } : null },
  };
}

describe('momentum coasting when tracking drops out', () => {
  it('keeps the hand moving in its last direction, slowing down, then hides it', () => {
    const tr = new TrackerSet();
    let snap = tr.process(frame(0, { x: 0, y: 0 }));
    // Move right at 1 m/s for 0.3 s.
    for (let t = 1 / 30; t <= 0.3 + 1e-9; t += 1 / 30) snap = tr.process(frame(t, { x: t, y: 0 }));
    const lastPos = snap.hands.right!.pos.x;
    expect(snap.hands.right!.vel.x).toBeGreaterThan(0.7);

    // Tracking lost: coasting samples continue rightward with decaying speed.
    const c1 = tr.process(frame(0.35, null)).hands.right!;
    expect(c1.coasting).toBe(true);
    expect(c1.pos.x).toBeGreaterThan(lastPos);
    expect(c1.vel.x).toBeGreaterThan(0);
    const c2 = tr.process(frame(0.5, null)).hands.right!;
    expect(c2.pos.x).toBeGreaterThan(c1.pos.x);
    expect(c2.speed).toBeLessThan(c1.speed);

    // Gone longer than coastSeconds: hidden.
    const gone = tr.process(frame(0.3 + TRACKING.coastSeconds + 0.05, null)).hands.right;
    expect(gone).toBeNull();
  });

  it('resumes real tracking cleanly after a short gap', () => {
    const tr = new TrackerSet();
    for (let t = 0; t <= 0.3; t += 1 / 30) tr.process(frame(t, { x: t, y: 0 }));
    tr.process(frame(0.35, null));
    const back = tr.process(frame(0.4, { x: 0.4, y: 0 })).hands.right!;
    expect(back.coasting).toBeUndefined();
    expect(back.pos.x).toBeGreaterThan(0.3);
  });
});
