import { TRACKING } from '../config';

/** Opens the webcam into a hidden <video> element. */
export async function openCamera(video: HTMLVideoElement): Promise<MediaStream> {
  // 16:9 usually uses the sensor's full width (4:3 modes often crop the sides), and asking
  // for `zoom` lets Chrome prompt for camera-control permission so we can zoom out fully.
  const constraints: MediaStreamConstraints = {
    audio: false,
    video: {
      width: { ideal: TRACKING.videoWidth },
      height: { ideal: TRACKING.videoHeight },
      frameRate: { ideal: 60 },
      facingMode: 'user',
      ...({ zoom: true, resizeMode: 'none' } as MediaTrackConstraints),
    },
  };
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
  } catch {
    // Some browsers reject unknown/unsupported constraints outright: retry with the basics.
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { width: { ideal: TRACKING.videoWidth }, height: { ideal: TRACKING.videoHeight }, frameRate: { ideal: 60 }, facingMode: 'user' },
    });
  }
  await widenFieldOfView(stream);
  video.srcObject = stream;
  video.muted = true;
  video.playsInline = true;
  await new Promise<void>((resolve) => {
    if (video.readyState >= 2) resolve();
    else video.onloadedmetadata = () => resolve();
  });
  await video.play();
  return stream;
}

export function closeCamera(video: HTMLVideoElement): void {
  const s = video.srcObject as MediaStream | null;
  s?.getTracks().forEach((t) => t.stop());
  video.srcObject = null;
}

interface WideCapabilities extends MediaTrackCapabilities {
  zoom?: { min: number; max: number; step?: number };
  resizeMode?: string[];
}

/** Zoom all the way out and disable any crop/resize the camera pipeline applies, when the camera allows it. */
export async function widenFieldOfView(stream: MediaStream): Promise<{ zoomedOut: boolean; cropDisabled: boolean }> {
  const track = stream.getVideoTracks()[0];
  const result = { zoomedOut: false, cropDisabled: false };
  if (!track?.getCapabilities) return result;
  const caps = track.getCapabilities() as WideCapabilities;
  const advanced: MediaTrackConstraintSet[] = [];
  if (caps.zoom && Number.isFinite(caps.zoom.min)) advanced.push({ zoom: caps.zoom.min } as MediaTrackConstraintSet);
  if (caps.resizeMode?.includes('none')) advanced.push({ resizeMode: 'none' } as MediaTrackConstraintSet);
  for (const c of advanced) {
    try {
      await track.applyConstraints({ advanced: [c] });
      if ('zoom' in c) result.zoomedOut = true;
      if ('resizeMode' in c) result.cropDisabled = true;
    } catch (err) {
      console.warn('[camera] constraint not applied', c, err);
    }
  }
  return result;
}

/** Human-readable description of the active camera mode for the calibration screen. */
export function describeCamera(stream: MediaStream): string {
  const track = stream.getVideoTracks()[0];
  const st = track?.getSettings?.() as (MediaTrackSettings & { zoom?: number; resizeMode?: string }) | undefined;
  if (!st) return '';
  const parts = [`${st.width}×${st.height}`, st.frameRate ? `${Math.round(st.frameRate)}fps` : ''];
  if (st.zoom !== undefined) parts.push(`zoom ${st.zoom}`);
  if (st.resizeMode) parts.push(st.resizeMode);
  return parts.filter(Boolean).join(' · ');
}
