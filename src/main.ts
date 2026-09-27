import { loadChart } from './chart/loader';
import type { Chart } from './chart/types';
import { EASY_PROFILE, ORIGINAL_PROFILE, TRACKING, applyQueryOverrides, type JudgeProfile } from './config';
import { SongAudio } from './game/audio';
import type { ScoreSummary } from './game/scoring';
import { Session } from './game/session';
import { BotInput } from './input/bot';
import { CameraInput } from './input/cameraInput';
import { KeyboardInput } from './input/keyboard';
import type { InputSource } from './input/types';
import { SceneView } from './render/scene';
import { StageView } from './render/stage';
import { azimuthOf, loadLayout, type StageLayout } from './stage/layout';
import { closeCamera, describeCamera, openCamera } from './tracking/camera';
import { createLandmarkers } from './tracking/landmarkers';
import { DebugOverlay } from './ui/debug';
import { Hud } from './ui/hud';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

type InputMode = 'camera' | 'keys' | 'bot';

interface AppState {
  chartName: string;
  input: InputMode;
  debug: boolean;
  profile: JudgeProfile;
}

const overrides = applyQueryOverrides();
const state: AppState = {
  chartName: new URLSearchParams(location.search).get('chart') ?? 'Verdi_DiesIrae_Easy',
  input: (['camera', 'keys', 'bot'].includes(overrides.input) ? overrides.input : 'camera') as InputMode,
  debug: overrides.debug,
  profile: overrides.profile,
};
if (overrides.bot) state.input = 'bot';

// ---------------------------------------------------------------- shared objects

const glCanvas = $<HTMLCanvasElement>('gl');
const camVideo = $<HTMLVideoElement>('cam');
const hudRoot = $('hud');
const pip = $('pip');
const pipVideo = $<HTMLVideoElement>('pip-video');
const debugPanel = $('debug-panel');
const debugCanvas = $<HTMLCanvasElement>('debug-overlay');

let ctx: AudioContext | null = null;
let view: SceneView | null = null;
let stage: StageView | null = null;
let layout: StageLayout | null = null;
let hud: Hud | null = null;
let session: Session | null = null;
let cameraInput: CameraInput | null = null;
let cameraStream: MediaStream | null = null;
let chart: Chart | null = null;
let audio: SongAudio | null = null;
let loadedFor = '';

function showScreen(id: string | null): void {
  for (const s of document.querySelectorAll<HTMLElement>('.screen')) s.classList.toggle('show', s.id === id);
}

function setStatus(text: string): void {
  $('title-status').textContent = text;
}

// ---------------------------------------------------------------- title screen

function bindSegment(id: string, attr: string, onChange: (v: string) => void): void {
  const seg = $(id);
  seg.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (!b) return;
    for (const x of seg.querySelectorAll('button')) x.classList.toggle('active', x === b);
    onChange(b.dataset[attr]!);
  });
}

bindSegment('chart-select', 'chart', (v) => {
  state.chartName = v;
  state.profile = v.endsWith('Easy') ? EASY_PROFILE : ORIGINAL_PROFILE;
  if (new URLSearchParams(location.search).get('profile') === 'original') state.profile = ORIGINAL_PROFILE;
});
bindSegment('input-select', 'input', (v) => (state.input = v as InputMode));
bindSegment('track-select', 'track', (v) => {
  TRACKING.mode = v as typeof TRACKING.mode;
  localStorage.setItem('maestro.trackMode', v);
  // Landmarker set depends on the mode: rebuild on next calibration.
  cameraInput?.dispose();
  cameraInput = null;
});
for (const b of $('track-select').querySelectorAll('button')) b.classList.toggle('active', b.dataset.track === TRACKING.mode);
for (const b of $('input-select').querySelectorAll('button')) b.classList.toggle('active', b.dataset.input === state.input);
for (const b of $('chart-select').querySelectorAll('button')) b.classList.toggle('active', b.dataset.chart === state.chartName);
const latencyInput = $<HTMLInputElement>('latency');
latencyInput.value = String(TRACKING.inputLatencyMs);
latencyInput.addEventListener('change', () => {
  TRACKING.inputLatencyMs = Number(latencyInput.value) || 0;
  localStorage.setItem('maestro.inputLatencyMs', String(TRACKING.inputLatencyMs));
});
const syncInput = $<HTMLInputElement>('sync');
syncInput.value = String(TRACKING.syncOffsetMs);
syncInput.addEventListener('change', () => {
  TRACKING.syncOffsetMs = Number(syncInput.value) || 0;
  localStorage.setItem('maestro.syncOffsetMs', String(TRACKING.syncOffsetMs));
});
const debugToggle = $<HTMLInputElement>('debug-toggle');
debugToggle.checked = state.debug;
debugToggle.addEventListener('change', () => (state.debug = debugToggle.checked));

$('btn-start').addEventListener('click', () => void startFlow());

async function ensureLoaded(): Promise<void> {
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') await ctx.resume();
  view ??= new SceneView(glCanvas);
  (window as unknown as { __scene?: unknown }).__scene = view.scene; // for debugging/smoke tests
  hud ??= new Hud(hudRoot);
  if (!layout) {
    layout = await loadLayout(`${BASE}/stage/layout.json`);
    stage = new StageView(view.scene, layout);
  }
  if (loadedFor !== state.chartName) {
    setStatus('채보와 음원을 불러오는 중…');
    chart = await loadChart(`${BASE}/charts/${state.chartName}.json`);
    audio = await SongAudio.load(ctx, `${BASE}/${chart.audio[0]}`, chart.audio[1] ? `${BASE}/${chart.audio[1]}` : undefined);
    loadedFor = state.chartName;
  }
}

async function startFlow(): Promise<void> {
  const btn = $<HTMLButtonElement>('btn-start');
  btn.disabled = true;
  try {
    await ensureLoaded();
    if (state.input === 'camera') {
      await startCalibration();
    } else {
      startPlay(state.input === 'bot' ? new BotInput(chart!, state.profile, (i) => azimuthOf(layout!, i)) : new KeyboardInput());
    }
    setStatus('');
  } catch (err) {
    console.error(err);
    setStatus(`오류: ${(err as Error).message}`);
  } finally {
    btn.disabled = false;
  }
}

// ---------------------------------------------------------------- calibration

let calibRaf = 0;

async function startCalibration(): Promise<void> {
  showScreen('screen-calib');
  const text = $('calib-text');
  text.textContent = '카메라를 여는 중…';
  if (!cameraStream) cameraStream = await openCamera(camVideo);
  $<HTMLVideoElement>('calib-video').srcObject = cameraStream;
  void $<HTMLVideoElement>('calib-video').play();
  if (!cameraInput) {
    text.textContent = '추적 모델을 불러오는 중… (처음 한 번만 걸립니다)';
    const lm = await createLandmarkers({ hands: TRACKING.mode !== 'pose' && TRACKING.handEveryNFrames > 0 });
    cameraInput = new CameraInput(camVideo, lm);
  }
  cameraInput.startCalibration();
  text.textContent = '카메라 정면을 보고 팔을 편하게 내린 채 잠시 멈춰 주세요.';
  $<HTMLButtonElement>('btn-play').disabled = true;

  const overlay = $<HTMLCanvasElement>('calib-overlay');
  const dbg = new DebugOverlay(overlay, $('calib-axes'));
  const ring = document.getElementById('calib-ring') as unknown as SVGCircleElement;
  const axes = $('calib-axes');
  cancelAnimationFrame(calibRaf);
  const loop = () => {
    calibRaf = requestAnimationFrame(loop);
    const raw = cameraInput!.poll(performance.now() / 1000);
    if (raw) {
      dbg.drawLandmarks(raw, camVideo.videoWidth || 640, camVideo.videoHeight || 480);
      const p = cameraInput!.calibrationProgress;
      ring.style.strokeDashoffset = String(283 * (1 - p));
      const pose = raw.debug?.pose;
      const shoulderFrac = pose ? Math.abs(pose[11].x - pose[12].x) : 0; // shoulder width as a fraction of frame width
      if (!raw.tracked) text.textContent = '사람이 보이지 않습니다. 상체(어깨와 골반)가 화면에 들어오게 서 주세요.';
      else if (shoulderFrac > 0.42) text.textContent = '카메라와 너무 가깝습니다. 손을 크게 움직여도 화면 안에 들어오도록 한두 걸음 물러나세요.';
      else if (shoulderFrac < 0.1) text.textContent = '카메라와 너무 멉니다. 조금 가까이 오세요.';
      else if (cameraInput!.isCalibrated) {
        text.textContent = '캘리브레이션 완료. 손을 움직여 아래 좌표가 오른쪽(+x)·위(+y)로 커지는지 확인한 뒤 시작하세요.';
        $<HTMLButtonElement>('btn-play').disabled = false;
        cameraInput!.mode = 'playing';
      } else text.textContent = `가만히 서 있어 주세요… ${(p * 100).toFixed(0)}%`;
      const f = (h: typeof raw.hands.left) => (h ? `x ${h.pos.x.toFixed(2)}  y ${h.pos.y.toFixed(2)}  z ${h.pos.z.toFixed(2)}` : '—');
      axes.textContent = `왼손  ${f(raw.hands.left)}\n오른손 ${f(raw.hands.right)}\n추적 ${cameraInput!.poseFps} fps · 추론 ${cameraInput!.lastInferenceMs.toFixed(0)} ms · ${TRACKING.mode} (${TRACKING.poseModel})\n카메라 ${cameraStream ? describeCamera(cameraStream) : '-'} · 어깨/화면폭 ${(shoulderFrac * 100).toFixed(0)}%`;
    }
  };
  loop();
}

$('btn-recalib').addEventListener('click', () => cameraInput?.startCalibration());
$('btn-calib-back').addEventListener('click', () => {
  cancelAnimationFrame(calibRaf);
  showScreen('screen-title');
});
$('btn-play').addEventListener('click', () => {
  cancelAnimationFrame(calibRaf);
  cameraInput!.mode = 'playing';
  startPlay(cameraInput!);
});

// ---------------------------------------------------------------- play

let currentInput: InputSource | null = null;

function startPlay(input: InputSource): void {
  currentInput = input;
  showScreen(null);
  hudRoot.classList.add('show');
  const useCam = input instanceof CameraInput;
  pip.classList.toggle('show', useCam);
  pip.classList.toggle('big', state.debug);
  debugPanel.classList.toggle('show', state.debug);
  if (useCam) {
    pipVideo.srcObject = cameraStream;
    void pipVideo.play();
  }
  const debug = state.debug ? new DebugOverlay(debugCanvas, debugPanel) : null;
  session?.stop();
  session = new Session({
    chart: chart!,
    profile: state.profile,
    input,
    ctx: ctx!,
    audio: audio!,
    layout: layout!,
    view: view!,
    stage: stage!,
    hud: hud!,
    debug,
    cameraVideo: useCam ? camVideo : null,
    onEnd: showResult,
  });
  session.start();
}

function endPlay(): void {
  session?.stop();
  session = null;
  hudRoot.classList.remove('show');
  pip.classList.remove('show');
  debugPanel.classList.remove('show');
  if (currentInput && !(currentInput instanceof CameraInput)) currentInput.dispose?.();
  currentInput = null;
}

function showResult(summary: ScoreSummary): void {
  endPlay();
  Hud.renderResult($('result'), summary);
  showScreen('screen-result');
}

$('btn-retry').addEventListener('click', () => {
  showScreen(null);
  void startFlow();
});
$('btn-title').addEventListener('click', () => showScreen('screen-title'));

addEventListener('keydown', (e) => {
  if (e.code === 'Escape' && session) {
    endPlay();
    showScreen('screen-title');
  }
});

addEventListener('beforeunload', () => {
  cameraInput?.dispose();
  closeCamera(camVideo);
});
