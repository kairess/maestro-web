const MASTER_GAIN = 2.0; // about +6 dB

/** Loads the normal and "fail" renditions and plays them sample-locked with a crossfade. */
export class SongAudio {
  private normalSrc: AudioBufferSourceNode | null = null;
  private failSrc: AudioBufferSourceNode | null = null;
  private normalGain: GainNode;
  private failGain: GainNode;
  private master: GainNode;

  private constructor(
    readonly ctx: AudioContext,
    private normal: AudioBuffer,
    private fail: AudioBuffer | null,
  ) {
    // The recording is quiet on average (about -23 dB mean, -1 dB peak): boost it and let a
    // limiter catch the loud hits so they don't clip.
    this.master = ctx.createGain();
    this.master.gain.value = MASTER_GAIN;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -3;
    limiter.knee.value = 0;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.002;
    limiter.release.value = 0.2;
    this.master.connect(limiter);
    limiter.connect(ctx.destination);
    this.normalGain = ctx.createGain();
    this.failGain = ctx.createGain();
    this.normalGain.connect(this.master);
    this.failGain.connect(this.master);
    this.failGain.gain.value = 0;
  }

  static async load(ctx: AudioContext, normalUrl: string, failUrl?: string): Promise<SongAudio> {
    const decode = async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`failed to load audio ${url}: ${res.status}`);
      return ctx.decodeAudioData(await res.arrayBuffer());
    };
    const [normal, fail] = await Promise.all([decode(normalUrl), failUrl ? decode(failUrl) : Promise.resolve(null)]);
    return new SongAudio(ctx, normal, fail);
  }

  get duration(): number {
    return this.normal.duration;
  }

  /** Schedule both tracks to start at the given context time. */
  start(atCtxTime: number, offsetSeconds = 0): void {
    this.stop();
    this.normalSrc = this.ctx.createBufferSource();
    this.normalSrc.buffer = this.normal;
    this.normalSrc.connect(this.normalGain);
    this.normalSrc.start(atCtxTime, offsetSeconds);
    if (this.fail) {
      this.failSrc = this.ctx.createBufferSource();
      this.failSrc.buffer = this.fail;
      this.failSrc.connect(this.failGain);
      this.failSrc.start(atCtxTime, offsetSeconds);
    }
  }

  /** 0 = normal rendition, 1 = fully the fail rendition. */
  setFail(mix: number): void {
    const m = this.fail ? Math.min(1, Math.max(0, mix)) : 0;
    const t = this.ctx.currentTime;
    // Equal-power crossfade.
    this.normalGain.gain.setTargetAtTime(Math.cos((m * Math.PI) / 2), t, 0.05);
    this.failGain.gain.setTargetAtTime(Math.sin((m * Math.PI) / 2), t, 0.05);
  }

  stop(): void {
    for (const s of [this.normalSrc, this.failSrc]) {
      if (!s) continue;
      try {
        s.stop();
      } catch {
        /* already stopped */
      }
      s.disconnect();
    }
    this.normalSrc = this.failSrc = null;
  }
}
