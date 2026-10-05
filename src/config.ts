/**
 * Tunable game parameters. Original Maestro values (from ScoringSettings) are kept
 * as a reference profile; the Easy profile is deliberately lenient so that only
 * clearly wrong input (no movement, opposite direction, wrong hand count) fails.
 */

export interface GestureTolerance {
  /** Minimum hand speed in m/s. */
  speed: number;
  /** Half-angle of the accepted direction cone, degrees. */
  angleDeg: number;
}

export interface JudgeProfile {
  name: string;
  /** Half width of the timing window, seconds. */
  timeWindow: number;
  /** |dt| below this is a Perfect. */
  perfectWindow: number;
  /**
   * Filtering and velocity estimation detect a stroke slightly after it happens.
   * This lag (s) is subtracted from the measured dt before grading.
   */
  detectionLag: number;
  /**
   * Players aim to finish a stroke on the beat (the baton "lands" on the line), so the fastest
   * point of the stroke comes this many seconds before the beat. The judge expects the speed
   * peak this early; tune with ?lead=ms.
   */
  strokeLead: number;
  normal: GestureTolerance;
  low: GestureTolerance;
  accent: GestureTolerance;
  /** Strong movement more than this many degrees off target counts as "Wrong". */
  wrongAngleDeg: number;
  /** Single-token gestures accept either hand. */
  anyHandForSingle: boolean;
  /** Three-token gestures (meaning unknown) are treated as a single-hand gesture of tokens[0]. */
  tripleTokenAsSingle: boolean;
  cue: {
    timeWindow: number;
    /** The left hand must rise this much (m) from its lowest point inside the window. Relative, not absolute height. */
    rise: number;
    /** Horizontal shift (m) during the rise that counts as pointing toward a side. */
    sideShift: number;
  };
  dynamics: {
    /** Net rise (crescendo) / fall (decrescendo) in m, from the lowest/highest point so far, for a Perfect. */
    rise: number;
    /** Smaller movement that still earns a Good. */
    goodRise: number;
    /** After the peak, sinking back more than this (m) before the span ends means it was not held. */
    dropTolerance: number;
  };
  /** Demo-chart fermatas and release-chart Sustain: hold still. */
  fermata: {
    /** Max speed (m/s) to count as holding still. */
    stillSpeed: number;
    /** Fraction of frames in the span that must satisfy the hold. */
    holdFraction: number;
  };
  /** Release-chart Contain: keep the orchestra held back — calm hand that does not rise. */
  contain: {
    /** Max speed (m/s) to count as calm. */
    speed: number;
    /** Rising more than this (m) above where the span started is not "containing". */
    maxRise: number;
    /** Calm-frame fraction for a Perfect (holdFraction above gives a Good). */
    perfectFraction: number;
  };
  /** Release-chart Cut: the release after a Sustain — one quick, decisive flick of the hand. */
  cut: {
    /** Peak speed (m/s) for a Perfect; 60% of it gives a Good. */
    speed: number;
    /** Seconds the window opens before / stays open after the one-beat Cut span. */
    early: number;
    late: number;
  };
}

export const ORIGINAL_PROFILE: JudgeProfile = {
  name: 'original',
  timeWindow: 0.2,
  perfectWindow: 0.08,
  detectionLag: 0.11,
  strokeLead: 0.1,
  normal: { speed: 0.75, angleDeg: 35 },
  low: { speed: 0.5, angleDeg: 35 },
  accent: { speed: 1.5, angleDeg: 35 },
  wrongAngleDeg: 90,
  anyHandForSingle: false,
  tripleTokenAsSingle: true,
  cue: { timeWindow: 0.3, rise: 0.1, sideShift: 0.05 },
  dynamics: { rise: 0.1, goodRise: 0.05, dropTolerance: 0.04 },
  fermata: { stillSpeed: 0.3, holdFraction: 0.7 },
  contain: { speed: 0.4, maxRise: 0.08, perfectFraction: 0.85 },
  cut: { speed: 0.8, early: 0.1, late: 0.25 },
};

export const EASY_PROFILE: JudgeProfile = {
  ...ORIGINAL_PROFILE,
  name: 'easy',
  timeWindow: 0.25,
  perfectWindow: 0.1,
  normal: { speed: 0.35, angleDeg: 50 },
  low: { speed: 0.25, angleDeg: 50 },
  accent: { speed: 0.6, angleDeg: 50 },
  anyHandForSingle: false,
  cue: { timeWindow: 0.45, rise: 0.06, sideShift: 0.03 },
  dynamics: { rise: 0.06, goodRise: 0.03, dropTolerance: 0.05 },
  fermata: { stillSpeed: 0.35, holdFraction: 0.6 },
  contain: { speed: 0.5, maxRise: 0.1, perfectFraction: 0.8 },
  cut: { speed: 0.45, early: 0.15, late: 0.35 },
};

export interface DisplayConfig {
  gestureAnticipation: number;
  cueAnticipation: number;
  dynamicsAnticipation: number;
  fermataAnticipation: number;
}

export const DISPLAY: DisplayConfig = {
  gestureAnticipation: 1.5,
  cueAnticipation: 1.5,
  dynamicsAnticipation: 2.5,
  fermataAnticipation: 1.5,
};

export interface ScoringConfig {
  perfect: number;
  good: number;
  comboStep: number;
  comboBonus: number;
  maxMultiplier: number;
  healthMiss: number;
  healthGood: number;
  healthPerfect: number;
  /** failGain = smoothstep(failLo, failHi, 1 - health). */
  failLo: number;
  failHi: number;
  /** Time constant (s) for smoothing the crossfade. */
  failTau: number;
}

export const SCORING: ScoringConfig = {
  perfect: 100,
  good: 60,
  comboStep: 10,
  comboBonus: 0.1,
  maxMultiplier: 2.0,
  healthMiss: -0.08,
  healthGood: 0.02,
  healthPerfect: 0.03,
  failLo: 0.35,
  failHi: 0.85,
  failTau: 0.5,
};

export interface TrackingConfig {
  /** Estimated capture+inference latency in ms, subtracted from song time for judging. */
  inputLatencyMs: number;
  /**
   * Audio/visual sync (ms). Positive = notes and judging run ahead of the music (use it when the
   * notes feel late against what you hear); negative = behind.
   */
  syncOffsetMs: number;
  videoWidth: number;
  videoHeight: number;
  /** One Euro filter parameters for wrist positions. */
  oneEuro: { minCutoff: number; beta: number; dCutoff: number };
  /** Seconds of history kept per hand. */
  historySeconds: number;
  /** Time span (s) over which velocity is estimated. */
  velocitySpan: number;
  /** Assumed shoulder width (m) for the 2D fallback scale. */
  assumedShoulderWidth: number;
  /** World-landmark shoulder width outside this range triggers the 2D fallback. */
  shoulderWidthRange: [number, number];
  /** EMA time constant (s) for slowly following the body frame during play. */
  frameFollowTau: number;
  /** Calibration duration, seconds. */
  calibrationSeconds: number;
  /** Run hand landmarker every N pose frames (1 = every frame). */
  handEveryNFrames: number;
  /** Pose model variant: 'lite' is fastest, 'full' tracks fast wrists more reliably. */
  poseModel: 'lite' | 'full';
  /**
   * What runs during play. Calibration always uses the pose model for 2 s.
   *  'pose+hands': pose every frame (judging) + hand landmarker (3D fingers) — most robust, heaviest.
   *  'hands':      hand landmarker only; wrists come from it. One model, fastest with fingers.
   *  'pose':       pose only; simplified hands. Fast, no fingers.
   */
  mode: 'pose+hands' | 'hands' | 'pose';
  /** Minimum wrist visibility (pose model) to trust a hand. */
  minWristVisibility: number;
  /** In 'hands' mode, re-run the pose model this often (s) to keep the body frame fresh if the webcam or player moves. */
  poseRefreshSeconds: number;
  /** When a hand drops out, keep it moving with its last velocity (decaying with `coastTau` s) for up to this long. */
  coastSeconds: number;
  coastTau: number;
  /** Hand landmarker confidences: lower keeps tracking through motion blur. */
  handConfidence: { detection: number; presence: number; tracking: number };
  /** One Euro parameters for depth (z) and for the 21 hand landmarks. */
  depthEuro: { minCutoff: number; beta: number };
  handEuro: { minCutoff: number; beta: number };
}

export const TRACKING: TrackingConfig = {
  inputLatencyMs: 100,
  syncOffsetMs: 0,
  videoWidth: 1280,
  videoHeight: 720,
  oneEuro: { minCutoff: 1.0, beta: 0.4, dCutoff: 1.0 },
  historySeconds: 0.6,
  velocitySpan: 0.08,
  assumedShoulderWidth: 0.4,
  shoulderWidthRange: [0.28, 0.55],
  frameFollowTau: 2.0,
  calibrationSeconds: 2.0,
  handEveryNFrames: 2,
  poseModel: 'full',
  mode: 'hands',
  minWristVisibility: 0.2,
  poseRefreshSeconds: 1.0,
  coastSeconds: 0.6,
  coastTau: 0.2,
  handConfidence: { detection: 0.3, presence: 0.3, tracking: 0.2 },
  depthEuro: { minCutoff: 0.3, beta: 0.0 },
  handEuro: { minCutoff: 2.0, beta: 0.5 },
};

/** Read settings from URL query for quick experiments (?latency=120&profile=original). */
export function applyQueryOverrides(): { profile: JudgeProfile; debug: boolean; input: string; bot: boolean } {
  const q = new URLSearchParams(location.search);
  const latency = q.get('latency');
  if (latency) TRACKING.inputLatencyMs = Number(latency);
  const stored = localStorage.getItem('maestro.inputLatencyMs');
  if (!latency && stored) TRACKING.inputLatencyMs = Number(stored);
  const sync = q.get('sync');
  const storedSync = localStorage.getItem('maestro.syncOffsetMs');
  if (sync !== null && Number.isFinite(Number(sync))) TRACKING.syncOffsetMs = Number(sync);
  else if (storedSync !== null && Number.isFinite(Number(storedSync))) TRACKING.syncOffsetMs = Number(storedSync);
  const pose = q.get('pose');
  if (pose === 'lite' || pose === 'full') TRACKING.poseModel = pose;
  const hands = q.get('hands');
  if (hands === '0') TRACKING.handEveryNFrames = 0;
  const track = q.get('track');
  if (track === 'pose+hands' || track === 'hands' || track === 'pose') TRACKING.mode = track;
  const storedMode = localStorage.getItem('maestro.trackMode');
  if (!track && (storedMode === 'pose+hands' || storedMode === 'hands' || storedMode === 'pose')) TRACKING.mode = storedMode;
  const profile = q.get('profile') === 'original' ? ORIGINAL_PROFILE : EASY_PROFILE;
  const lead = q.get('lead');
  if (lead !== null && Number.isFinite(Number(lead))) {
    ORIGINAL_PROFILE.strokeLead = Number(lead) / 1000;
    EASY_PROFILE.strokeLead = Number(lead) / 1000;
  }
  return {
    profile,
    debug: q.get('debug') === '1',
    input: q.get('input') ?? 'camera',
    bot: q.get('bot') === '1',
  };
}
