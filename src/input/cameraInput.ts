import type { Landmark, NormalizedLandmark } from '@mediapipe/tasks-vision';
import type { Hand } from '../chart/types';
import { TRACKING } from '../config';
import {
  BodyFrameEstimator,
  POSE,
  PlanarFrameEstimator,
  frameFromPoints,
  planarFromNormalized,
  planarToBody,
  rotateToBody,
  sub,
  toBody,
  type BodyFrame,
  type PlanarFrame,
} from '../tracking/bodyFrame';
import type { Vec3 } from '../tracking/handState';
import type { Landmarkers } from '../tracking/landmarkers';
import { OneEuroFilter, OneEuroVec3 } from '../tracking/oneEuro';
import { DEFAULT_SHOULDERS, type InputSource, type RawFrame } from './types';

export type CameraMode = 'calibrating' | 'playing';

/**
 * Webcam input. Positions come from MediaPipe's 2D image landmarks (stable),
 * mapped into the conductor's plane with a calibrated planar frame (shoulder
 * midpoint, shoulder-line roll, shoulder-width scale, pitch compensation).
 * The 3D world landmarks only supply orientation for the hand mesh and a
 * heavily smoothed depth.
 */
export class CameraInput implements InputSource {
  readonly estimator = new BodyFrameEstimator();
  readonly planar = new PlanarFrameEstimator();
  mode: CameraMode = 'calibrating';
  calibrationProgress = 0;
  liveFrame: BodyFrame | null = null;
  lastInferenceMs = 0;
  poseFps = 0;

  private lastVideoTime = -1;
  private frameCount = 0;
  private lastHands: { landmarks: NormalizedLandmark[][]; world: Landmark[][] } | null = null;
  private lastPollT: number | null = null;
  private aspect = 4 / 3;
  private depthFilters: Record<Hand, OneEuroFilter> = {
    left: new OneEuroFilter(TRACKING.depthEuro.minCutoff, TRACKING.depthEuro.beta),
    right: new OneEuroFilter(TRACKING.depthEuro.minCutoff, TRACKING.depthEuro.beta),
  };
  private handFilters: Record<Hand, OneEuroVec3[]> = {
    left: Array.from({ length: 21 }, () => new OneEuroVec3(TRACKING.handEuro.minCutoff, TRACKING.handEuro.beta)),
    right: Array.from({ length: 21 }, () => new OneEuroVec3(TRACKING.handEuro.minCutoff, TRACKING.handEuro.beta)),
  };
  private fpsWindow: number[] = [];

  constructor(
    private video: HTMLVideoElement,
    private lm: Landmarkers,
  ) {}

  startCalibration(): void {
    this.estimator.reset();
    this.planar.reset();
    this.calibrationProgress = 0;
    this.mode = 'calibrating';
  }

  get isCalibrated(): boolean {
    return this.estimator.isCalibrated && this.planar.frame !== null;
  }

  dispose(): void {
    this.lm.close();
  }

  poll(captureTime: number): RawFrame | null {
    const v = this.video;
    if (v.readyState < 2 || v.currentTime === this.lastVideoTime) return null;
    this.lastVideoTime = v.currentTime;
    if (v.videoWidth && v.videoHeight) this.aspect = v.videoWidth / v.videoHeight;
    const dt = this.lastPollT === null ? 1 / 30 : Math.max(0, captureTime - this.lastPollT);
    this.lastPollT = captureTime;

    const nowMs = performance.now();
    this.fpsWindow.push(nowMs);
    while (this.fpsWindow.length && this.fpsWindow[0] < nowMs - 1000) this.fpsWindow.shift();
    this.poseFps = this.fpsWindow.length;

    this.frameCount++;
    if (this.mode === 'playing' && TRACKING.mode === 'hands') {
      // Hands-only play: one model per frame, wrists come from the hand landmarker.
      if (!this.lm.hand || !this.isCalibrated) return null;
      const h = this.lm.hand.detectForVideo(v, nowMs);
      this.lastHands = { landmarks: h.landmarks, world: h.worldLandmarks };
      // Run the pose model too when (a) it is time to refresh the body frame (moved webcam,
      // player shuffled sideways) or (b) the hand model lost a hand — pose uses body context
      // and survives motion blur, so its wrist stands in for the missing hand.
      const refreshDue = nowMs - this.lastPoseRefreshMs >= TRACKING.poseRefreshSeconds * 1000;
      const missingHand = h.landmarks.length < 2;
      this.fallbackPose = null;
      if (refreshDue || missingHand) {
        const pose = this.lm.pose.detectForVideo(v, nowMs + 0.001);
        if (pose.landmarks.length) {
          this.fallbackPose = pose.landmarks[0];
          if (refreshDue) {
            const refreshDt = this.lastPoseRefreshMs < 0 ? TRACKING.poseRefreshSeconds : (nowMs - this.lastPoseRefreshMs) / 1000;
            this.lastPoseRefreshMs = nowMs;
            const worldPts: Vec3[] = pose.worldLandmarks[0].map((p) => ({ x: p.x, y: p.y, z: p.z }));
            const liveWorld = frameFromPoints(worldPts);
            const livePlanar = liveWorld && planarFromNormalized(pose.landmarks[0], this.aspect, TRACKING.assumedShoulderWidth, liveWorld);
            if (liveWorld && livePlanar) {
              this.estimator.follow(liveWorld, refreshDt);
              this.planar.follow(livePlanar, refreshDt);
            }
          }
        }
      }
      this.lastInferenceMs = performance.now() - nowMs;
      return this.handsOnlyFrame(captureTime);
    }

    const pose = this.lm.pose.detectForVideo(v, nowMs);
    const runHands = this.lm.hand && TRACKING.handEveryNFrames > 0 && (this.mode === 'calibrating' || TRACKING.mode === 'pose+hands');
    if (runHands && this.frameCount % TRACKING.handEveryNFrames === 0) {
      const h = this.lm.hand!.detectForVideo(v, nowMs + 0.001);
      this.lastHands = { landmarks: h.landmarks, world: h.worldLandmarks };
    }
    this.lastInferenceMs = performance.now() - nowMs;

    const empty: RawFrame = {
      t: captureTime,
      tracked: false,
      shoulders: DEFAULT_SHOULDERS,
      hands: { left: null, right: null },
      debug: { inferenceMs: this.lastInferenceMs, frame: this.estimator.frame },
    };
    if (!pose.landmarks.length) return empty;

    const norm = pose.landmarks[0];
    const worldPts: Vec3[] = pose.worldLandmarks[0].map((p) => ({ x: p.x, y: p.y, z: p.z }));
    const liveWorld = frameFromPoints(worldPts);
    this.liveFrame = liveWorld;
    if (!liveWorld) return empty;
    const livePlanar = planarFromNormalized(norm, this.aspect, TRACKING.assumedShoulderWidth, liveWorld);
    if (!livePlanar) return empty;

    let world: BodyFrame;
    let planar: PlanarFrame;
    if (this.mode === 'calibrating') {
      this.calibrationProgress = this.estimator.calibrate(liveWorld, nowMs / 1000);
      this.planar.accumulate(livePlanar);
      if (this.estimator.isCalibrated && !this.planar.frame) this.planar.lock();
      world = liveWorld;
      planar = livePlanar;
    } else {
      if (!this.isCalibrated) return empty;
      this.estimator.follow(liveWorld, dt);
      this.planar.follow(livePlanar, dt);
      world = this.estimator.frame!;
      planar = this.planar.frame!;
    }

    const bodyPoint = (i: number, depth: number): Vec3 => {
      const p = planarToBody(planar, norm[i], this.aspect);
      return { x: p.x, y: p.y, z: depth };
    };
    const shoulders: Record<Hand, Vec3> = {
      left: bodyPoint(POSE.leftShoulder, 0),
      right: bodyPoint(POSE.rightShoulder, 0),
    };
    const wristIdx: Record<Hand, number> = { left: POSE.leftWrist, right: POSE.rightWrist };
    const hands: RawFrame['hands'] = { left: null, right: null };
    for (const hand of ['left', 'right'] as Hand[]) {
      const w = norm[wristIdx[hand]];
      if (w.visibility !== undefined && w.visibility < TRACKING.minWristVisibility) continue;
      // Depth from the world frame, smoothed hard: it only shapes the 3D hand and cue reach.
      const rawDepth = toBody(world, worldPts[wristIdx[hand]]).z;
      const depth = this.depthFilters[hand].filter(Math.min(0, rawDepth), captureTime);
      const wristBody = bodyPoint(wristIdx[hand], depth);
      const hl = this.handLandmarksFor(hand, norm, world, planar, wristBody, captureTime);
      const judged = hand === 'right' ? (hl.tip ?? bodyPoint(POSE.rightIndex, depth)) : wristBody;
      hands[hand] = { pos: judged, landmarks: hl.landmarks };
    }

    return {
      t: captureTime,
      tracked: true,
      shoulders,
      hands,
      debug: {
        pose: norm.map((p) => ({ x: p.x, y: p.y })),
        hands: this.lastHands?.landmarks.map((h) => h.map((p) => ({ x: p.x, y: p.y }))),
        frame: world,
        inferenceMs: this.lastInferenceMs,
      },
    };
  }

  private lastHandPos: Record<Hand, { x: number; y: number } | null> = { left: null, right: null };
  private lastPoseRefreshMs = -1;
  private fallbackPose: NormalizedLandmark[] | null = null;

  /**
   * Build a frame from the hand landmarker alone, using the calibrated planar frame
   * (the camera is fixed, so the frame stays valid without the pose model). Hands are
   * assigned left/right by continuity with their previous position, else by which side
   * of the body midline they are on.
   */
  private handsOnlyFrame(captureTime: number): RawFrame {
    const planar = this.planar.frame!;
    const world = this.estimator.frame!;
    const half = TRACKING.assumedShoulderWidth / 2;
    const shoulders: Record<Hand, Vec3> = { left: { x: -half, y: 0, z: 0 }, right: { x: half, y: 0, z: 0 } };
    const lh = this.lastHands;
    const detected = (lh?.landmarks ?? []).map((lm, i) => ({ i, p: planarToBody(planar, lm[0], this.aspect) }));
    const assign: Record<Hand, number | null> = { left: null, right: null };
    if (detected.length >= 2) {
      const sorted = [...detected].sort((a, b) => a.p.x - b.p.x);
      assign.left = sorted[0].i;
      assign.right = sorted[sorted.length - 1].i;
    } else if (detected.length === 1) {
      const d = detected[0];
      const dist = (hand: Hand) => (this.lastHandPos[hand] ? Math.hypot(d.p.x - this.lastHandPos[hand]!.x, d.p.y - this.lastHandPos[hand]!.y) : Infinity);
      const dl = dist('left');
      const dr = dist('right');
      if (Math.min(dl, dr) < 0.3) assign[dl < dr ? 'left' : 'right'] = d.i;
      else assign[d.p.x < 0 ? 'left' : 'right'] = d.i;
    }
    const hands: RawFrame['hands'] = { left: null, right: null };
    for (const hand of ['left', 'right'] as Hand[]) {
      const idx = assign[hand];
      if (idx === null || !lh) {
        // Hand model lost this hand: fall back to the pose model's wrist / index for this frame.
        const pose = this.fallbackPose;
        const wristIdx = hand === 'left' ? POSE.leftWrist : POSE.rightWrist;
        const w = pose?.[wristIdx];
        if (pose && w && (w.visibility === undefined || w.visibility >= TRACKING.minWristVisibility)) {
          const wp = planarToBody(planar, w, this.aspect);
          const wristBody: Vec3 = { x: wp.x, y: wp.y, z: -0.35 };
          const ip = planarToBody(planar, pose[hand === 'left' ? POSE.leftIndex : POSE.rightIndex], this.aspect);
          const judged: Vec3 = hand === 'right' ? { x: ip.x, y: ip.y, z: -0.35 } : wristBody;
          this.lastHandPos[hand] = { x: wristBody.x, y: wristBody.y };
          hands[hand] = { pos: judged, landmarks: this.handLandmarksFor(hand, pose, world, planar, wristBody, captureTime).landmarks };
        }
        continue;
      }
      const p = detected.find((d) => d.i === idx)!.p;
      this.lastHandPos[hand] = p;
      const wristBody: Vec3 = { x: p.x, y: p.y, z: -0.35 };
      // The right hand is judged at the index fingertip (closest thing to a baton tip), so
      // wrist-only conducting still produces clear strokes. The left hand keeps the wrist.
      const tip2d = planarToBody(planar, lh.landmarks[idx][8], this.aspect);
      const judged: Vec3 = hand === 'right' ? { x: tip2d.x, y: tip2d.y, z: wristBody.z } : wristBody;
      const shape = lh.world[idx];
      const w0 = shape[0];
      const filters = this.handFilters[hand];
      const landmarks = shape.map((q, k) => {
        const rel = rotateToBody(world, sub({ x: q.x, y: q.y, z: q.z }, { x: w0.x, y: w0.y, z: w0.z }));
        return filters[k].filter({ x: wristBody.x + rel.x, y: wristBody.y + rel.y, z: wristBody.z + rel.z }, captureTime);
      });
      hands[hand] = { pos: judged, landmarks };
    }
    return {
      t: captureTime,
      tracked: detected.length > 0 || hands.left !== null || hands.right !== null,
      shoulders,
      hands,
      debug: { hands: lh?.landmarks.map((h) => h.map((q) => ({ x: q.x, y: q.y }))), frame: world, inferenceMs: this.lastInferenceMs },
    };
  }

  /**
   * Full 21-point hand in body space: the hand landmarker's world shape (hand-relative,
   * metric) rotated into the body frame and pinned to the wrist, then per-landmark
   * filtered. Hands are matched to pose wrists by image distance because handedness
   * labels are unreliable with unmirrored input. Falls back to a 4-point pseudo hand.
   */
  private handLandmarksFor(hand: Hand, norm: NormalizedLandmark[], world: BodyFrame, planar: PlanarFrame, wristBody: Vec3, t: number): { landmarks: Vec3[] | undefined; tip?: Vec3 } {
    const wristNorm = norm[hand === 'left' ? POSE.leftWrist : POSE.rightWrist];
    const lh = this.lastHands;
    if (lh) {
      let best = -1;
      let bestD = 0.12;
      for (let i = 0; i < lh.landmarks.length; i++) {
        const w = lh.landmarks[i][0];
        const d = Math.hypot((w.x - wristNorm.x) * this.aspect, w.y - wristNorm.y);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      if (best >= 0) {
        const shape = lh.world[best];
        const w0 = shape[0];
        const filters = this.handFilters[hand];
        const landmarks = shape.map((p, i) => {
          const rel = rotateToBody(world, sub({ x: p.x, y: p.y, z: p.z }, { x: w0.x, y: w0.y, z: w0.z }));
          return filters[i].filter({ x: wristBody.x + rel.x, y: wristBody.y + rel.y, z: wristBody.z + rel.z }, t);
        });
        // Unfiltered fingertip from the 2D landmarks (the hand tracker filters it once more).
        const tip2d = planarToBody(planar, lh.landmarks[best][8], this.aspect);
        return { landmarks, tip: { x: tip2d.x, y: tip2d.y, z: wristBody.z } };
      }
    }
    // Pseudo hand from the pose model (image positions at the wrist's depth): wrist, index, pinky, thumb.
    const idx = hand === 'left' ? [POSE.leftWrist, POSE.leftIndex, POSE.leftPinky, POSE.leftThumb] : [POSE.rightWrist, POSE.rightIndex, POSE.rightPinky, POSE.rightThumb];
    const filters = this.handFilters[hand];
    const landmarks = idx.map((i, k) => {
      const p = planarToBody(planar, norm[i], this.aspect);
      return filters[k].filter({ x: p.x, y: p.y, z: wristBody.z }, t);
    });
    return { landmarks };
  }
}
