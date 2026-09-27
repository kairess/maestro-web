import type { Hand } from '../chart/types';
import type { BodyFrame } from '../tracking/bodyFrame';
import type { Vec3 } from '../tracking/handState';

/** One raw input frame in body space, before filtering/velocity estimation. */
export interface RawFrame {
  /** Capture time in song seconds. */
  t: number;
  tracked: boolean;
  shoulders: Record<Hand, Vec3>;
  hands: Record<Hand, { pos: Vec3; landmarks?: Vec3[] } | null>;
  /** Optional data for the debug overlay (normalized image coordinates). */
  debug?: {
    pose?: { x: number; y: number }[];
    hands?: { x: number; y: number }[][];
    frame?: BodyFrame | null;
    inferenceMs?: number;
  };
}

export interface InputSource {
  /** Called every animation frame with the latency-compensated song time. Returns a frame when a new one exists. */
  poll(captureTime: number): RawFrame | null;
  dispose?(): void;
}

export const DEFAULT_SHOULDERS: Record<Hand, Vec3> = {
  left: { x: -0.2, y: 0, z: 0 },
  right: { x: 0.2, y: 0, z: 0 },
};

export const REST_POSITION: Record<Hand, Vec3> = {
  left: { x: -0.22, y: -0.25, z: -0.3 },
  right: { x: 0.22, y: -0.25, z: -0.3 },
};
