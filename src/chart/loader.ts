import type { Chart, Cue, Dynamics, Fermata, FocusSection, Gesture, GestureType, Token } from './types';

const TOKENS: Token[] = ['Up', 'Down', 'Left', 'Right', 'DownLeft', 'DownRight'];
const TYPES: GestureType[] = ['Normal', 'Low', 'Accent'];

interface RawChart {
  name: string;
  audio: string[];
  applause_time: number | null;
  num_initial_beats_to_skip: number;
  beat_times: number[];
  gestures: { beat: number; time: number; tokens: string[]; type: string }[];
  cues: { beat: number; time: number; instrument: string }[];
  dynamics: { type: string; instrument: string; begin: number; end: number; time: [number, number] }[];
  fermatas: { instrument: string; begin: number; end: number; time: [number, number] }[];
  focus_sections: { beat: number; time: number; instrument: string }[];
}

export function parseChart(raw: RawChart): Chart {
  const beatTimes = raw.beat_times;
  const gestures: Gesture[] = raw.gestures
    .map((g, i) => {
      const tokens = g.tokens.map((t) => {
        if (!TOKENS.includes(t as Token)) throw new Error(`unknown token ${t} at gesture ${i}`);
        return t as Token;
      });
      if (!TYPES.includes(g.type as GestureType)) throw new Error(`unknown gesture type ${g.type}`);
      return { id: i, beat: g.beat, time: beatTimes[g.beat] ?? g.time, tokens, type: g.type as GestureType };
    })
    .sort((a, b) => a.time - b.time);

  const cues: Cue[] = raw.cues
    .map((c, i) => ({ id: i, beat: c.beat, time: beatTimes[c.beat] ?? c.time, instrument: c.instrument }))
    .sort((a, b) => a.time - b.time);

  const dynamics: Dynamics[] = raw.dynamics
    .map((d, i) => ({
      id: i,
      type: d.type as Dynamics['type'],
      instrument: d.instrument,
      begin: d.begin,
      end: d.end,
      time: [beatTimes[d.begin] ?? d.time[0], beatTimes[d.end] ?? d.time[1]] as [number, number],
    }))
    .sort((a, b) => a.time[0] - b.time[0]);

  const fermatas: Fermata[] = raw.fermatas
    .map((f, i) => ({
      id: i,
      instrument: f.instrument,
      begin: f.begin,
      end: f.end,
      time: [beatTimes[f.begin] ?? f.time[0], beatTimes[f.end] ?? f.time[1]] as [number, number],
    }))
    .sort((a, b) => a.time[0] - b.time[0]);

  const focusSections: FocusSection[] = raw.focus_sections
    .map((s) => ({ beat: s.beat, time: beatTimes[s.beat] ?? s.time, instrument: s.instrument }))
    .sort((a, b) => a.time - b.time);

  const lastBeat = beatTimes[beatTimes.length - 1] ?? 0;
  const endTime = raw.applause_time ?? lastBeat + 3;

  return {
    name: raw.name,
    audio: [raw.audio[0], raw.audio[1]],
    applauseTime: raw.applause_time,
    numInitialBeatsToSkip: raw.num_initial_beats_to_skip ?? 0,
    beatTimes,
    gestures,
    cues,
    dynamics,
    fermatas,
    focusSections,
    endTime,
  };
}

export async function loadChart(url: string): Promise<Chart> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`failed to load chart ${url}: ${res.status}`);
  return parseChart((await res.json()) as RawChart);
}
