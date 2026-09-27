import { TRACKING } from '../config';

/** Song clock driven by the AudioContext so judging and audio never drift apart. */
export class GameClock {
  private startAt = 0;
  private running = false;

  constructor(private ctx: AudioContext) {}

  /** Start counting from the given AudioContext time (the moment the sources start). */
  start(atCtxTime: number): void {
    this.startAt = atCtxTime;
    this.running = true;
  }

  stop(): void {
    this.running = false;
  }

  get isRunning(): boolean {
    return this.running;
  }

  /** Song time in seconds (negative during the pre-roll before the sources start). */
  songTime(): number {
    if (!this.running) return 0;
    return this.ctx.currentTime - this.startAt + TRACKING.syncOffsetMs / 1000;
  }

  /** Song time at which the frame currently being processed was captured. */
  captureTime(): number {
    return this.songTime() - TRACKING.inputLatencyMs / 1000;
  }
}
