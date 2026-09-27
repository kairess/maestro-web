import type { RawFrame } from '../input/types';
import { HandTracker, type BodySnapshot } from './handState';

/** Turns raw body-space frames into filtered snapshots with velocities. */
export class TrackerSet {
  readonly left = new HandTracker('left');
  readonly right = new HandTracker('right');

  reset(): void {
    this.left.reset();
    this.right.reset();
  }

  process(raw: RawFrame): BodySnapshot {
    const l = raw.hands.left ? this.left.push(raw.hands.left.pos, raw.t, raw.hands.left.landmarks) : this.left.coast(raw.t);
    const r = raw.hands.right ? this.right.push(raw.hands.right.pos, raw.t, raw.hands.right.landmarks) : this.right.coast(raw.t);
    return { t: raw.t, hands: { left: l, right: r }, shoulders: raw.shoulders, tracked: raw.tracked };
  }
}
