import { describe, expect, it } from 'vitest';
import { POSE, frameFromPoints, toBody } from '../src/tracking/bodyFrame';
import type { Vec3 } from '../src/tracking/handState';

/** A person facing the camera in MediaPipe-style coordinates (x right in image, y down, z away). */
function person(): Vec3[] {
  const pts: Vec3[] = Array.from({ length: 33 }, () => ({ x: 0, y: 0, z: 0 }));
  // Unmirrored image: the person's right shoulder appears on the image's left.
  pts[POSE.leftShoulder] = { x: 0.2, y: -0.5, z: 0 };
  pts[POSE.rightShoulder] = { x: -0.2, y: -0.5, z: 0 };
  pts[POSE.leftHip] = { x: 0.15, y: 0, z: 0 };
  pts[POSE.rightHip] = { x: -0.15, y: 0, z: 0 };
  // Right hand raised above the shoulder, out to the person's right, in front of the body.
  pts[POSE.rightWrist] = { x: -0.45, y: -0.8, z: -0.3 };
  return pts;
}

function rotate(pts: Vec3[], yawDeg: number, pitchDeg: number, rollDeg: number, offset: Vec3): Vec3[] {
  const y = (yawDeg * Math.PI) / 180;
  const p = (pitchDeg * Math.PI) / 180;
  const r = (rollDeg * Math.PI) / 180;
  return pts.map((v) => {
    // roll about z
    let x = v.x * Math.cos(r) - v.y * Math.sin(r);
    let yy = v.x * Math.sin(r) + v.y * Math.cos(r);
    let z = v.z;
    // pitch about x
    const y2 = yy * Math.cos(p) - z * Math.sin(p);
    const z2 = yy * Math.sin(p) + z * Math.cos(p);
    yy = y2;
    z = z2;
    // yaw about y
    const x3 = x * Math.cos(y) + z * Math.sin(y);
    const z3 = -x * Math.sin(y) + z * Math.cos(y);
    x = x3;
    z = z3;
    return { x: x + offset.x, y: yy + offset.y, z: z + offset.z };
  });
}

describe('body frame', () => {
  it('maps a raised right hand to +x (right), +y (up), -z (in front)', () => {
    const pts = person();
    const f = frameFromPoints(pts)!;
    const h = toBody(f, pts[POSE.rightWrist]);
    expect(h.x).toBeGreaterThan(0.2);
    expect(h.y).toBeGreaterThan(0.2);
    expect(h.z).toBeLessThan(-0.2);
    expect(f.shoulderWidth).toBeCloseTo(0.4);
  });

  it('is invariant to camera rotation and translation', () => {
    const base = person();
    const ref = toBody(frameFromPoints(base)!, base[POSE.rightWrist]);
    for (const [yaw, pitch, roll] of [
      [30, 0, 0],
      [0, 25, 0],
      [0, 0, 15],
      [-20, 15, -10],
    ]) {
      const moved = rotate(base, yaw, pitch, roll, { x: 0.3, y: -0.2, z: 1.5 });
      const h = toBody(frameFromPoints(moved)!, moved[POSE.rightWrist]);
      expect(h.x).toBeCloseTo(ref.x, 5);
      expect(h.y).toBeCloseTo(ref.y, 5);
      expect(h.z).toBeCloseTo(ref.z, 5);
    }
  });
});

import { planarFromNormalized, planarToBody, type NormPoint } from '../src/tracking/bodyFrame';

function normPerson(mirrored: boolean): NormPoint[] {
  const pts: NormPoint[] = Array.from({ length: 33 }, () => ({ x: 0.5, y: 0.5 }));
  // Unmirrored webcam: the person's right shoulder is on the image's left.
  const rsx = mirrored ? 0.65 : 0.35;
  const lsx = mirrored ? 0.35 : 0.65;
  pts[POSE.rightShoulder] = { x: rsx, y: 0.5 };
  pts[POSE.leftShoulder] = { x: lsx, y: 0.5 };
  // Right hand raised above the shoulder and out to the person's right.
  pts[POSE.rightWrist] = { x: mirrored ? 0.85 : 0.15, y: 0.2 };
  return pts;
}

describe('planar frame', () => {
  it('maps a raised right hand to +x and +y (unmirrored webcam)', () => {
    const pts = normPerson(false);
    const f = planarFromNormalized(pts, 4 / 3, 0.4, null)!;
    const h = planarToBody(f, pts[POSE.rightWrist], 4 / 3);
    expect(h.x).toBeGreaterThan(0.2);
    expect(h.y).toBeGreaterThan(0.2);
  });

  it('also works for mirrored input', () => {
    const pts = normPerson(true);
    const f = planarFromNormalized(pts, 4 / 3, 0.4, null)!;
    const h = planarToBody(f, pts[POSE.rightWrist], 4 / 3);
    expect(h.x).toBeGreaterThan(0.2);
    expect(h.y).toBeGreaterThan(0.2);
  });

  it('is invariant to a small camera roll', () => {
    const pts = normPerson(false);
    const ref = planarToBody(planarFromNormalized(pts, 4 / 3, 0.4, null)!, pts[POSE.rightWrist], 4 / 3);
    const a = (12 * Math.PI) / 180;
    const rot = pts.map((p) => {
      const x = (p.x - 0.5) * (4 / 3);
      const y = p.y - 0.5;
      return { x: (x * Math.cos(a) - y * Math.sin(a)) / (4 / 3) + 0.5, y: x * Math.sin(a) + y * Math.cos(a) + 0.5 };
    });
    const h = planarToBody(planarFromNormalized(rot, 4 / 3, 0.4, null)!, rot[POSE.rightWrist], 4 / 3);
    expect(h.x).toBeCloseTo(ref.x, 5);
    expect(h.y).toBeCloseTo(ref.y, 5);
  });
});
