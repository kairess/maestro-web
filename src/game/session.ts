import * as THREE from 'three';
import type { Chart } from '../chart/types';
import { DISPLAY, type JudgeProfile } from '../config';
import { CameraInput } from '../input/cameraInput';
import type { InputSource, RawFrame } from '../input/types';
import { HandsView } from '../render/hands';
import { ExpressionsView } from '../render/expressions';
import { LanesView } from '../render/lanes';
import { NotesView } from '../render/notes';
import type { SceneView } from '../render/scene';
import type { StageView } from '../render/stage';
import { azimuthOf, type StageLayout } from '../stage/layout';
import type { BodySnapshot } from '../tracking/handState';
import { TrackerSet } from '../tracking/trackerSet';
import type { DebugOverlay } from '../ui/debug';
import type { CueMarker, Hud } from '../ui/hud';
import type { SongAudio } from './audio';
import { GameClock } from './clock';
import { Judge, type JudgeEvent } from './judge';
import { Scoring, type ScoreSummary } from './scoring';

const PREROLL = 3.0;
const CUE_RESULT_SECONDS = 0.45;

export interface SessionDeps {
  chart: Chart;
  profile: JudgeProfile;
  input: InputSource;
  ctx: AudioContext;
  audio: SongAudio;
  layout: StageLayout;
  view: SceneView;
  stage: StageView;
  hud: Hud;
  debug: DebugOverlay | null;
  cameraVideo: HTMLVideoElement | null;
  onEnd: (summary: ScoreSummary) => void;
}

/** One play-through: drives input → judge → scoring → audio/visuals every animation frame. */
export class Session {
  readonly clock: GameClock;
  readonly judge: Judge;
  readonly scoring: Scoring;
  private trackers = new TrackerSet();
  private hands: HandsView;
  private notes: NotesView;
  private lanes: LanesView;
  private expressions: ExpressionsView;
  private raf = 0;
  private lastFrameMs = 0;
  private lastSnap: BodySnapshot | null = null;
  private lastRaw: RawFrame | null = null;
  private videoStarted = false;
  private ended = false;
  private focusIndex = 0;
  private cueDone = new Map<number, { hit: boolean; at: number }>();
  private tmpV = new THREE.Vector3();
  private focusInstrument: string | null = null;

  constructor(private d: SessionDeps) {
    this.clock = new GameClock(d.ctx);
    this.judge = new Judge(d.chart, d.profile, (i) => azimuthOf(d.layout, i));
    const total = this.judge.gestures.length + d.chart.cues.length + d.chart.dynamics.length + d.chart.fermatas.length;
    this.scoring = new Scoring(total);
    this.hands = new HandsView(d.view.scene);
    this.lanes = new LanesView(d.view.scene);
    this.notes = new NotesView(d.view.scene, this.judge, this.lanes);
    this.expressions = new ExpressionsView(d.view.scene, d.chart, this.judge, this.lanes);
  }

  start(): void {
    const at = this.d.ctx.currentTime + PREROLL;
    this.d.audio.start(at);
    this.clock.start(at);
    this.d.hud.setScore(0, 0, 1);
    this.d.hud.setHealth(1);
    this.lastFrameMs = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  stop(): void {
    cancelAnimationFrame(this.raf);
    this.clock.stop();
    this.d.audio.stop();
    this.d.stage.stop();
    this.notes.clear();
    this.expressions.clear();
    this.lanes.dispose();
    this.hands.dispose();
    this.d.hud.clear();
    this.d.stage.focus(null);
    this.d.stage.highlight(null, 0);
  }

  private frame = (): void => {
    this.raf = requestAnimationFrame(this.frame);
    const nowMs = performance.now();
    const dt = Math.min(0.1, (nowMs - this.lastFrameMs) / 1000);
    this.lastFrameMs = nowMs;
    const t = this.clock.songTime();

    if (!this.videoStarted && t >= 0) {
      this.d.stage.playFrom(t);
      this.videoStarted = true;
    }

    // Input → judge → scoring.
    const raw = this.d.input.poll(this.clock.captureTime());
    if (raw) {
      this.lastRaw = raw;
      this.lastSnap = this.trackers.process(raw);
      const events = this.judge.update(this.lastSnap);
      for (const ev of events) this.handleEvent(ev);
    }

    // Audio crossfade.
    this.d.audio.setFail(this.scoring.tick(dt));

    // Visuals.
    // Hand tracking above can take tens of ms: draw with a fresh song time so notes aren't behind the music.
    const tv = this.clock.songTime();
    this.notes.update(tv, dt);
    this.expressions.update(tv);
    this.lanes.update(dt);
    const glow = this.expressions.glow;
    this.hands.setGlow('left', glow ? glow.color : null, glow?.amount ?? 0);
    this.hands.update(this.lastSnap, this.trackers, dt);
    this.updateFocus(tv);
    this.d.stage.update(dt);
    this.updateHud(tv);
    this.d.view.render();

    if (this.d.debug) {
      this.d.debug.tick();
      const v = this.d.cameraVideo;
      if (v) this.d.debug.drawLandmarks(this.lastRaw, v.videoWidth || 640, v.videoHeight || 480);
      this.d.debug.render(this.lastSnap, this.lastRaw, { songTime: t, failGain: this.scoring.failGain, health: this.scoring.health, ...(this.d.input instanceof CameraInput ? { poseFps: this.d.input.poseFps } : {}) });
    }

    if (!this.ended && t >= this.d.chart.endTime) {
      this.ended = true;
      this.stop();
      this.d.onEnd(this.scoring.summary());
    }
  };

  private handleEvent(ev: JudgeEvent): void {
    this.scoring.apply(ev);
    this.d.hud.setScore(this.scoring.score, this.scoring.combo, this.scoring.multiplier);
    this.d.hud.setHealth(this.scoring.health);
    this.d.debug?.pushEvent(ev);
    switch (ev.kind) {
      case 'gesture':
        this.notes.onJudged(ev.gesture, ev.grade, this.clock.songTime());
        if (ev.grade === 'perfect' || ev.grade === 'good') this.hands.flashBaton();
        this.d.hud.showGrade(ev.grade, Number.isFinite(ev.dt) && ev.grade !== 'perfect' ? (ev.dt > 0 ? 'late' : 'early') : undefined);
        break;
      case 'cue':
        this.cueDone.set(ev.cue.id, { hit: ev.grade === 'perfect' || ev.grade === 'good', at: this.clock.songTime() });
        this.d.hud.showGrade(ev.grade, 'cue');
        break;
      case 'dynamics':
        this.expressions.onJudged('dynamics', ev.dynamics.id, ev.grade);
        this.d.hud.showGrade(ev.grade, ev.dynamics.type.toLowerCase());
        break;
      case 'fermata':
        this.expressions.onJudged('fermata', ev.fermata.id, ev.grade);
        this.d.hud.showGrade(ev.grade, 'fermata');
        break;
    }
  }

  private updateFocus(t: number): void {
    const secs = this.d.chart.focusSections;
    while (this.focusIndex + 1 < secs.length && secs[this.focusIndex + 1].time <= t) this.focusIndex++;
    const cur = secs.length && secs[this.focusIndex].time <= t ? secs[this.focusIndex].instrument : null;
    this.d.stage.focus(cur);
    this.focusInstrument = cur;
    this.d.hud.setFocus(cur);
  }

  private updateHud(t: number): void {
    const hud = this.d.hud;
    hud.setProgress(t, this.d.chart.endTime);
    hud.setCountdown(t < 0 ? -t : null);

    // Cues: markers on the backdrop from anticipation until judged.
    const markers: CueMarker[] = [];
    for (const c of this.d.chart.cues) {
      if (c.time - DISPLAY.cueAnticipation > t) break;
      // Judged cues stay a moment to show the result: white flash on a hit, red on a miss.
      const done = this.cueDone.get(c.id);
      if (done && t - done.at > CUE_RESULT_SECONDS) continue;
      if (!done && t > c.time + 0.5) continue;
      const world = this.d.stage.worldPositionOf(c.instrument);
      const p = this.d.view.project(this.tmpV.copy(world));
      markers.push({
        key: String(c.id),
        instrument: c.instrument,
        x: p.x,
        y: p.y,
        visible: p.visible,
        progress: done ? 1 : 1 - (c.time - t) / DISPLAY.cueAnticipation,
        result: done ? (done.hit ? 'hit' : 'miss') : null,
        resultAge: done ? (t - done.at) / CUE_RESULT_SECONDS : 0,
      });
    }
    hud.setCues(markers);

    // Spotlight on the backdrop: the next cue's section brightens as it approaches, otherwise the
    // featured (focus) section gets a gentle glow.
    const pending = markers.filter((m) => !m.result).sort((a, b) => b.progress - a.progress)[0];
    if (pending) this.d.stage.highlight(pending.instrument, 0.4 + 0.6 * Math.min(1, pending.progress));
    else this.d.stage.highlight(this.focusInstrument, 0.3);
  }
}
