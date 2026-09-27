import { TRACKING } from '../config';
import type { Vec3 } from './handState';

/**
 * Conductor ("body") coordinate frame built from the torso:
 *   x̂ = conductor's right, ŷ = up, ẑ = x̂ × ŷ (points behind the conductor),
 *   origin = shoulder midpoint. Positions in this frame are independent of
 *   the webcam's position and orientation.
 */
export interface BodyFrame {
  origin: Vec3;
  x: Vec3;
  y: Vec3;
  z: Vec3;
  shoulderWidth: number;
}

// MediaPipe pose landmark indices.
export const POSE = {
  leftShoulder: 11,
  rightShoulder: 12,
  leftWrist: 15,
  rightWrist: 16,
  leftPinky: 17,
  rightPinky: 18,
  leftIndex: 19,
  rightIndex: 20,
  leftThumb: 21,
  rightThumb: 22,
  leftHip: 23,
  rightHip: 24,
} as const;

export const sub = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
export const add = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
export const scale = (a: Vec3, s: number): Vec3 => ({ x: a.x * s, y: a.y * s, z: a.z * s });
export const dot = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;
export const cross = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});
export const length = (a: Vec3): number => Math.hypot(a.x, a.y, a.z);
export const normalize = (a: Vec3): Vec3 => {
  const l = length(a);
  return l < 1e-9 ? { x: 0, y: 0, z: 0 } : scale(a, 1 / l);
};
export const mid = (a: Vec3, b: Vec3): Vec3 => scale(add(a, b), 0.5);

/** Build a body frame from pose landmarks (any metric-ish 3D coordinates). */
export function frameFromPoints(points: readonly Vec3[]): BodyFrame | null {
  const ls = points[POSE.leftShoulder];
  const rs = points[POSE.rightShoulder];
  const lh = points[POSE.leftHip];
  const rh = points[POSE.rightHip];
  if (!ls || !rs || !lh || !rh) return null;
  const origin = mid(ls, rs);
  const xAxis = normalize(sub(rs, ls));
  const shoulderWidth = length(sub(rs, ls));
  if (shoulderWidth < 1e-4) return null;
  let up = sub(origin, mid(lh, rh));
  // Gram-Schmidt: remove the x component so ŷ ⟂ x̂.
  up = sub(up, scale(xAxis, dot(up, xAxis)));
  const yAxis = normalize(up);
  if (length(yAxis) < 1e-6) return null;
  const zAxis = cross(xAxis, yAxis);
  return { origin, x: xAxis, y: yAxis, z: zAxis, shoulderWidth };
}

/** Express a point in the body frame: Rᵀ (p − origin). */
export function toBody(frame: BodyFrame, p: Vec3): Vec3 {
  const d = sub(p, frame.origin);
  return { x: dot(d, frame.x), y: dot(d, frame.y), z: dot(d, frame.z) };
}

/** Rotate a direction/offset into the body frame (no translation). */
export function rotateToBody(frame: BodyFrame, v: Vec3): Vec3 {
  return { x: dot(v, frame.x), y: dot(v, frame.y), z: dot(v, frame.z) };
}

function reorthonormalize(f: BodyFrame): BodyFrame {
  const x = normalize(f.x);
  const y = normalize(sub(f.y, scale(x, dot(f.y, x))));
  const z = cross(x, y);
  return { ...f, x, y, z };
}

/** Accumulates frames during calibration and slowly follows them afterwards. */
export class BodyFrameEstimator {
  private calibrated: BodyFrame | null = null;
  private acc: BodyFrame | null = null;
  private accCount = 0;
  private calibStart: number | null = null;

  get frame(): BodyFrame | null {
    return this.calibrated;
  }

  get isCalibrated(): boolean {
    return this.calibrated !== null;
  }

  reset(): void {
    this.calibrated = null;
    this.acc = null;
    this.accCount = 0;
    this.calibStart = null;
  }

  /**
   * Feed a frame while calibrating. Returns progress 0..1; when it reaches 1 the
   * averaged frame is locked in.
   */
  calibrate(f: BodyFrame, nowSeconds: number): number {
    if (this.calibStart === null) this.calibStart = nowSeconds;
    if (!this.acc) {
      this.acc = { ...f };
      this.accCount = 1;
    } else {
      this.acc = {
        origin: add(this.acc.origin, f.origin),
        x: add(this.acc.x, f.x),
        y: add(this.acc.y, f.y),
        z: add(this.acc.z, f.z),
        shoulderWidth: this.acc.shoulderWidth + f.shoulderWidth,
      };
      this.accCount++;
    }
    const progress = Math.min(1, (nowSeconds - this.calibStart) / TRACKING.calibrationSeconds);
    if (progress >= 1 && this.accCount > 5) {
      const n = this.accCount;
      this.calibrated = reorthonormalize({
        origin: scale(this.acc.origin, 1 / n),
        x: scale(this.acc.x, 1 / n),
        y: scale(this.acc.y, 1 / n),
        z: scale(this.acc.z, 1 / n),
        shoulderWidth: this.acc.shoulderWidth / n,
      });
    }
    return progress;
  }

  /** During play: drift slowly toward the live frame (camera is fixed, but the player may shuffle). */
  follow(f: BodyFrame, dt: number): void {
    if (!this.calibrated) return;
    const a = 1 - Math.exp(-dt / TRACKING.frameFollowTau);
    const c = this.calibrated;
    const lerp = (p: Vec3, q: Vec3) => add(p, scale(sub(q, p), a));
    this.calibrated = reorthonormalize({
      origin: lerp(c.origin, f.origin),
      x: lerp(c.x, f.x),
      y: lerp(c.y, f.y),
      z: lerp(c.z, f.z),
      shoulderWidth: c.shoulderWidth + (f.shoulderWidth - c.shoulderWidth) * a,
    });
  }
}

// ---------------------------------------------------------------------------
// Planar (image-space) frame. MediaPipe's 2D landmarks are far more stable than
// its lifted 3D world coordinates, so positions are taken from the image and
// only orientation/depth come from the world frame.
// ---------------------------------------------------------------------------

export interface PlanarFrame {
  /** Shoulder midpoint in aspect-corrected image units (x scaled by aspect, y down). */
  ox: number;
  oy: number;
  /** Angle of the shoulder line (person's left → right) in the image, radians. */
  roll: number;
  /** Meters per image unit, from the assumed shoulder width. */
  scale: number;
  /** Extra vertical scale compensating camera pitch (from the world frame's tilt). */
  yFactor: number;
}

export interface NormPoint {
  x: number;
  y: number;
}

/** Build the planar frame from normalized pose landmarks. */
export function planarFromNormalized(norm: readonly NormPoint[], aspect: number, assumedShoulderWidth: number, world: BodyFrame | null): PlanarFrame | null {
  const ls = norm[POSE.leftShoulder];
  const rs = norm[POSE.rightShoulder];
  if (!ls || !rs) return null;
  const lx = ls.x * aspect;
  const rx = rs.x * aspect;
  const dx = rx - lx;
  const dy = rs.y - ls.y;
  const width = Math.hypot(dx, dy);
  if (width < 1e-3) return null;
  // Camera pitch foreshortens vertical motion by |ŷ_image| relative to |x̂_image|.
  let yFactor = 1;
  if (world) {
    const xImg = Math.hypot(world.x.x, world.x.y);
    const yImg = Math.hypot(world.y.x, world.y.y);
    if (xImg > 1e-3 && yImg > 1e-3) yFactor = Math.min(1.5, Math.max(0.7, xImg / yImg));
  }
  return { ox: (lx + rx) / 2, oy: (ls.y + rs.y) / 2, roll: Math.atan2(dy, dx), scale: assumedShoulderWidth / width, yFactor };
}

/**
 * Image point → body-plane meters (x = person's right, y = up).
 * x̂ is the shoulder-line direction (person's left → right) in the image; with an
 * unmirrored webcam it points to the image's left, so this is a reflection, not a
 * rotation. "Up" is the perpendicular that points toward the top of the image.
 */
export function planarToBody(f: PlanarFrame, p: NormPoint, aspect: number): { x: number; y: number } {
  const dx = p.x * aspect - f.ox;
  const dy = p.y - f.oy;
  const cx = Math.cos(f.roll);
  const cy = Math.sin(f.roll);
  let ux = -cy;
  let uy = cx;
  if (uy > 0) {
    ux = -ux;
    uy = -uy;
  }
  return { x: (dx * cx + dy * cy) * f.scale, y: (dx * ux + dy * uy) * f.scale * f.yFactor };
}

export class PlanarFrameEstimator {
  private calibrated: PlanarFrame | null = null;
  private acc: PlanarFrame | null = null;
  private n = 0;

  get frame(): PlanarFrame | null {
    return this.calibrated;
  }

  reset(): void {
    this.calibrated = null;
    this.acc = null;
    this.n = 0;
  }

  accumulate(f: PlanarFrame): void {
    if (!this.acc) {
      this.acc = { ...f };
      this.n = 1;
      return;
    }
    // Average the roll via its unit vector to avoid wrap-around issues.
    this.acc.ox += f.ox;
    this.acc.oy += f.oy;
    this.acc.scale += f.scale;
    this.acc.yFactor += f.yFactor;
    this.acc.roll = Math.atan2(Math.sin(this.acc.roll) * this.n + Math.sin(f.roll), Math.cos(this.acc.roll) * this.n + Math.cos(f.roll));
    this.n++;
  }

  lock(): void {
    if (!this.acc || this.n === 0) return;
    this.calibrated = { ox: this.acc.ox / this.n, oy: this.acc.oy / this.n, roll: this.acc.roll, scale: this.acc.scale / this.n, yFactor: this.acc.yFactor / this.n };
  }

  follow(f: PlanarFrame, dt: number): void {
    if (!this.calibrated) return;
    const a = 1 - Math.exp(-dt / TRACKING.frameFollowTau);
    const c = this.calibrated;
    c.ox += (f.ox - c.ox) * a;
    c.oy += (f.oy - c.oy) * a;
    c.scale += (f.scale - c.scale) * a;
    c.yFactor += (f.yFactor - c.yFactor) * a;
    c.roll = Math.atan2(Math.sin(c.roll) * (1 - a) + Math.sin(f.roll) * a, Math.cos(c.roll) * (1 - a) + Math.cos(f.roll) * a);
  }
}
