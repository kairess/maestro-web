import { FilesetResolver, HandLandmarker, PoseLandmarker } from '@mediapipe/tasks-vision';
import { TRACKING } from '../config';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export interface Landmarkers {
  pose: PoseLandmarker;
  hand: HandLandmarker | null;
  close(): void;
}

/** Creates the pose (required) and hand (optional) landmarkers with GPU delegate, CPU fallback. */
export async function createLandmarkers(opts: { hands: boolean }): Promise<Landmarkers> {
  const vision = await FilesetResolver.forVisionTasks(`${BASE}/mediapipe/wasm`);

  const make = async <T>(factory: (delegate: 'GPU' | 'CPU') => Promise<T>): Promise<T> => {
    try {
      return await factory('GPU');
    } catch (err) {
      console.warn('[landmarkers] GPU delegate failed, falling back to CPU', err);
      return factory('CPU');
    }
  };

  const pose = await make((delegate) =>
    PoseLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: `${BASE}/mediapipe/pose_landmarker_${TRACKING.poseModel}.task`, delegate },
      runningMode: 'VIDEO',
      numPoses: 1,
      minPoseDetectionConfidence: 0.5,
      minPosePresenceConfidence: 0.4,
      minTrackingConfidence: 0.3,
      outputSegmentationMasks: false,
    }),
  );

  let hand: HandLandmarker | null = null;
  if (opts.hands) {
    try {
      hand = await make((delegate) =>
        HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: `${BASE}/mediapipe/hand_landmarker.task`, delegate },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: TRACKING.handConfidence.detection,
          minHandPresenceConfidence: TRACKING.handConfidence.presence,
          minTrackingConfidence: TRACKING.handConfidence.tracking,
        }),
      );
    } catch (err) {
      console.warn('[landmarkers] hand landmarker unavailable; rendering simplified hands', err);
    }
  }

  return {
    pose,
    hand,
    close() {
      pose.close();
      hand?.close();
    },
  };
}
