import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseChart } from '../src/chart/loader';
import { EASY_PROFILE, ORIGINAL_PROFILE } from '../src/config';
import { Judge, type JudgeEvent } from '../src/game/judge';
import { BotInput } from '../src/input/bot';
import { TrackerSet } from '../src/tracking/trackerSet';

const layout = JSON.parse(readFileSync(new URL('../public/stage/layout.json', import.meta.url), 'utf8')) as {
  instruments: Record<string, { x: number; y: number }>;
};
const azimuth = (i: string) => layout.instruments[i]?.x ?? 0;

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
    const { events, judge } = playThrough('Verdi_DiesIrae_Easy.json');
    const g = tally(events, 'gesture');
    expect(g.perfect + g.good + g.miss + g.wrong).toBe(judge.gestures.length);
    expect(g.miss + g.wrong).toBe(0);
    expect(g.perfect).toBeGreaterThan(judge.gestures.length * 0.8);
  });

  it('Easy: cues, dynamics and fermatas are all judged and mostly hit', () => {
    const { events, judge } = playThrough('Verdi_DiesIrae_Easy.json');
    const c = tally(events, 'cue');
    const d = tally(events, 'dynamics');
    const f = tally(events, 'fermata');
    expect(c.perfect + c.good + c.miss + c.wrong).toBe(judge.chart.cues.length);
    expect(d.perfect + d.good + d.miss + d.wrong).toBe(judge.chart.dynamics.length);
    expect(f.perfect + f.good + f.miss + f.wrong).toBe(judge.chart.fermatas.length);
    expect(c.miss).toBe(0);
    expect(d.miss).toBe(0);
    expect(f.miss).toBe(0);
  });

  it('Easy: no gesture is judged before its window opens or after it closes', () => {
    const { events } = playThrough('Verdi_DiesIrae_Easy.json');
    for (const e of events) {
      if (e.kind !== 'gesture') continue;
      expect(e.t).toBeGreaterThanOrEqual(e.gesture.time - EASY_PROFILE.timeWindow - 0.05);
      expect(e.t).toBeLessThanOrEqual(e.gesture.time + EASY_PROFILE.timeWindow + 0.05);
    }
  });

  it('Hard with the original profile still judges every gesture', () => {
    const { events, judge } = playThrough('Verdi_DiesIrae_Hard.json', ORIGINAL_PROFILE);
    const g = tally(events, 'gesture');
    expect(g.perfect + g.good + g.miss + g.wrong).toBe(judge.gestures.length);
    expect((g.perfect + g.good) / judge.gestures.length).toBeGreaterThan(0.9);
  });

  it('a sloppy bot (±120ms jitter) still mostly hits on Easy', () => {
    const { events, judge } = playThrough('Verdi_DiesIrae_Easy.json', EASY_PROFILE, 30, 0.12);
    const g = tally(events, 'gesture');
    expect((g.perfect + g.good) / judge.gestures.length).toBeGreaterThan(0.9);
  });
});
