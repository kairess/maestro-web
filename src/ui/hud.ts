import type { Grade } from '../game/judge';
import type { ScoreSummary } from '../game/scoring';
import { labelOf } from '../stage/layout';

export interface CueMarker {
  /** Unique per cue, so two cues on the same instrument never share an element. */
  key: string;
  instrument: string;
  x: number;
  y: number;
  /** 0 = just appeared, 1 = due now, >1 = past. */
  progress: number;
  visible: boolean;
  /** Set once judged: the marker flashes white (hit) or turns red (miss) and fades. */
  result: 'hit' | 'miss' | null;
  /** 0..1 through the result animation. */
  resultAge: number;
}

const GRADE_TEXT: Record<Grade, string> = { perfect: 'PERFECT', good: 'GOOD', miss: 'MISS', wrong: 'WRONG' };

export class Hud {
  private score: HTMLElement;
  private combo: HTMLElement;
  private popup: HTMLElement;
  private progress: HTMLElement;
  private cueLayer: HTMLElement;
  private countdown: HTMLElement;
  private focus: HTMLElement;
  private health: HTMLElement;
  private cueEls = new Map<string, HTMLElement>();
  private popupTimer = 0;

  constructor(root: HTMLElement) {
    // Laid out like the original's music stand: a health gauge and a score counter in brass
    // frames at the bottom centre; everything else lives in the 3D scene.
    root.innerHTML = `
      <div class="hud-focus" id="hud-focus"></div>
      <div class="hud-stand">
        <div class="plaque plaque-health"><div class="gauge"><div class="gauge-cover" id="hud-health-cover"></div></div></div>
        <div class="plaque plaque-score">
          <div class="counter" id="hud-score">0</div>
          <div class="combo" id="hud-combo"></div>
        </div>
      </div>
      <div class="hud-progress"><div id="hud-progress-fill"></div></div>
      <div class="hud-popup" id="hud-popup"></div>
      <div class="hud-countdown" id="hud-countdown"></div>
      <div class="hud-cues" id="hud-cues"></div>`;
    const q = <T extends Element>(id: string) => root.querySelector<T>(`#${id}`)!;
    this.score = q('hud-score');
    this.combo = q('hud-combo');
    this.popup = q('hud-popup');
    this.progress = q('hud-progress-fill');
    this.cueLayer = q('hud-cues');
    this.countdown = q('hud-countdown');
    this.focus = q('hud-focus');
    this.health = q('hud-health-cover');
  }

  setScore(score: number, combo: number, multiplier: number): void {
    this.score.textContent = score.toLocaleString();
    this.combo.textContent = combo >= 2 ? `${combo} combo${multiplier > 1 ? ` · ×${multiplier.toFixed(1)}` : ''}` : '';
  }

  /** The gauge is a fixed red→yellow→green gradient; a dark cover hides the part above the current health. */
  setHealth(h: number): void {
    this.health.style.width = `${Math.round((1 - Math.min(1, Math.max(0, h))) * 100)}%`;
  }

  showGrade(grade: Grade, detail?: string): void {
    this.popup.textContent = detail ? `${GRADE_TEXT[grade]} · ${detail}` : GRADE_TEXT[grade];
    this.popup.className = `hud-popup show ${grade}`;
    clearTimeout(this.popupTimer);
    this.popupTimer = window.setTimeout(() => this.popup.classList.remove('show'), 420);
  }

  setProgress(t: number, end: number): void {
    this.progress.style.width = `${Math.min(100, Math.max(0, (t / end) * 100))}%`;
  }

  setCountdown(secondsLeft: number | null): void {
    if (secondsLeft === null || secondsLeft <= 0) {
      this.countdown.classList.remove('show');
      return;
    }
    this.countdown.textContent = String(Math.ceil(secondsLeft));
    this.countdown.classList.add('show');
  }

  setFocus(instrument: string | null): void {
    this.focus.textContent = instrument ? labelOf(instrument) : '';
  }

  /** Cue targets: an outer ring closes onto a small ring with a dot over the instrument. */
  setCues(markers: CueMarker[]): void {
    const seen = new Set<string>();
    for (const m of markers) {
      const key = m.key;
      seen.add(key);
      let el = this.cueEls.get(key);
      if (!el) {
        el = document.createElement('div');
        el.className = 'cue-marker';
        el.innerHTML = `<div class="cue-halo"></div><div class="cue-inner"></div><div class="cue-outer"></div>`;
        this.cueLayer.appendChild(el);
        this.cueEls.set(key, el);
      }
      el.style.transform = `translate(${m.x}px, ${m.y}px)`;
      el.style.display = m.visible ? '' : 'none';
      // Outer ring scale 1 = exactly the orb's size, reached at the cue time; it keeps shrinking
      // inside the orb if the cue is late.
      const p = Math.max(0, m.progress);
      const outer = el.lastElementChild as HTMLElement;
      el.classList.toggle('hit', m.result === 'hit');
      el.classList.toggle('miss', m.result === 'miss');
      if (m.result) {
        // Result: the matched rings bloom outward and fade.
        outer.style.transform = `translate(-50%, -50%) scale(${1 + 0.8 * m.resultAge})`;
        (el.children[1] as HTMLElement).style.transform = `translate(-50%, -50%) scale(${1 + 0.35 * m.resultAge})`;
        el.style.opacity = String(1 - m.resultAge);
        el.classList.remove('due');
      } else {
        outer.style.transform = `translate(-50%, -50%) scale(${Math.max(0.4, 1 + 2.4 * (1 - p))})`;
        (el.children[1] as HTMLElement).style.transform = 'translate(-50%, -50%)';
        el.style.opacity = String(Math.min(1, p / 0.2));
        el.classList.toggle('due', Math.abs(1 - p) < 0.08);
      }
    }
    for (const [key, el] of this.cueEls) {
      if (!seen.has(key)) {
        el.remove();
        this.cueEls.delete(key);
      }
    }
  }

  clear(): void {
    this.setCues([]);
    this.setCountdown(null);
    this.popup.classList.remove('show');
  }

  static renderResult(root: HTMLElement, s: ScoreSummary): void {
    root.innerHTML = `
      <div class="result-rank">${s.rank}</div>
      <div class="result-score">${s.score.toLocaleString()}</div>
      <div class="result-grid">
        <div><span>Perfect</span><b>${s.counts.perfect}</b></div>
        <div><span>Good</span><b>${s.counts.good}</b></div>
        <div><span>Miss</span><b>${s.counts.miss}</b></div>
        <div><span>Wrong</span><b>${s.counts.wrong}</b></div>
        <div><span>Max combo</span><b>${s.maxCombo}</b></div>
        <div><span>Events</span><b>${s.total}</b></div>
      </div>
      ${s.meanOffsetMs === null ? '' : `<p class="result-offset">평균 타이밍 ${Math.abs(s.meanOffsetMs)}ms ${s.meanOffsetMs > 0 ? '늦음' : s.meanOffsetMs < 0 ? '빠름' : ''}</p>`}`;
  }
}
