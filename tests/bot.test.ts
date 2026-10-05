import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseChart } from '../src/chart/loader';
import { EASY_PROFILE, ORIGINAL_PROFILE } from '../src/config';
import { Judge, type JudgeEvent } from '../src/game/judge';
import { BotInput } from '../src/input/bot';
import { TrackerSet } from '../src/tracking/trackerSet';

import { azimuthOf, type StageLayout } from '../src/stage/layout';

const layout = JSON.parse(readFileSync(new URL('../public/stage/layout.json', import.meta.url), 'utf8')) as StageLayout;
const azimuth = (i: string) => azimuthOf(layout, i);
const EASY = 'Verdi_DiesIrae/Verdi_DiesIrae_Flat_Easy.json';
const HARD = 'Verdi_DiesIrae/Verdi_DiesIrae_Flat_Hard.json';
const EXPERT = 'Verdi_DiesIrae/Verdi_DiesIrae_Expert.json';

function playThrough(chartFile: string, profile = EASY_PROFILE, fps = 30, jitter = 0): { events: JudgeEvent[]; judge: Judge } {
  const chart = parseChart(JSON.parse(readFileSync(new URL(`../public/charts/${chartFile}`, import.meta.url), 'utf8')));
  const judge = new Judge(chart, profile, azimuth);
  const bot = new BotInput(chart, profile, azimuth, { jitter });
  const trackers = new TrackerSet();
  const events: JudgeEvent[] = [];
  for (let t = -1; t <= chart.endTime; t += 1 / fps) {
    const raw = bot.poll(t);
    if (!raw) continue;
    events.push(...judge.update(trackers.process(raw)));
  }
  return { events, judge };
}

function tally(events: JudgeEvent[], kind: JudgeEvent['kind']) {
  const c = { perfect: 0, good: 0, miss: 0, wrong: 0 };
  for (const e of events) if (e.kind === kind) c[e.grade]++;
  return c;
}

describe('bot plays the real charts through the full pipeline', () => {
  it('Easy: every gesture is judged and none are missed', () => {
    const { events, judge } = playThrough(EASY);
    const g = tally(events, 'gesture');
    expect(g.perfect + g.good + g.miss + g.wrong).toBe(judge.gestures.length);
    expect(g.miss + g.wrong).toBe(0);
    expect(g.perfect).toBeGreaterThan(judge.gestures.length * 0.8);
  });

  it('Easy: cues and dynamics are all judged and none are missed', () => {
    const { events, judge } = playThrough(EASY);
    const c = tally(events, 'cue');
    const d = tally(events, 'dynamics');
    expect(judge.chart.fermatas.length).toBe(0); // release charts use Sustain + Cut instead
    expect(c.perfect + c.good + c.miss + c.wrong).toBe(judge.chart.cues.length);
    expect(d.perfect + d.good + d.miss + d.wrong).toBe(judge.chart.dynamics.length);
    expect(c.miss).toBe(0);
    expect(d.miss).toBe(0);
  });

  it('Expert: every dynamics type (Sustain, Contain, Cut, Crescendo, Decrescendo) is judged and hit', () => {
    const { events, judge } = playThrough(EXPERT, ORIGINAL_PROFILE);
    const byType = new Map<string, { hit: number; total: number }>();
    for (const e of events) {
      if (e.kind !== 'dynamics') continue;
      const b = byType.get(e.dynamics.type) ?? { hit: 0, total: 0 };
      b.total++;
      if (e.grade === 'perfect' || e.grade === 'good') b.hit++;
      byType.set(e.dynamics.type, b);
    }
    expect([...byType.keys()].sort()).toEqual(['Contain', 'Crescendo', 'Cut', 'Decrescendo', 'Sustain']);
    const total = [...byType.values()].reduce((n, b) => n + b.total, 0);
    expect(total).toBe(judge.chart.dynamics.length);
    for (const [type, b] of byType) expect(b.hit / b.total, type).toBeGreaterThan(0.85);
  });

  it('Easy: no gesture is judged before its window opens or after it closes', () => {
    const { events } = playThrough(EASY);
    for (const e of events) {
      if (e.kind !== 'gesture') continue;
      expect(e.t).toBeGreaterThanOrEqual(e.gesture.time - EASY_PROFILE.timeWindow - 0.05);
      expect(e.t).toBeLessThanOrEqual(e.gesture.time + EASY_PROFILE.timeWindow + 0.05);
    }
  });

  it('Hard with the original profile still judges every gesture', () => {
    const { events, judge } = playThrough(HARD, ORIGINAL_PROFILE);
    const g = tally(events, 'gesture');
    expect(g.perfect + g.good + g.miss + g.wrong).toBe(judge.gestures.length);
    expect((g.perfect + g.good) / judge.gestures.length).toBeGreaterThan(0.9);
  });

  it('a sloppy bot (±120ms jitter) still mostly hits on Easy', () => {
    const { events, judge } = playThrough(EASY, EASY_PROFILE, 30, 0.12);
    const g = tally(events, 'gesture');
    expect((g.perfect + g.good) / judge.gestures.length).toBeGreaterThan(0.9);
  });
});
