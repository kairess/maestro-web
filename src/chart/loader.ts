import type { Chart, Cue, Dynamics, DynamicsType, Fermata, FocusSection, Gesture, GestureType, Token } from './types';

const TOKENS: Token[] = ['Up', 'Down', 'Left', 'Right', 'DownLeft', 'DownRight'];
const TYPES: GestureType[] = ['Normal', 'Low', 'Accent'];
const DYNAMICS: DynamicsType[] = ['Crescendo', 'Decrescendo', 'Sustain', 'Contain', 'Cut'];

/**
 * Raw chart JSON. Two generations exist:
 *  - demo: flat `charts/<name>.json`, separate `fermatas`, dynamics only Crescendo/Decrescendo;
 *  - release: `charts/<song>/<name>.json` with `song_dir`, `flat_screen`, no `fermatas`
 *    (Sustain + Cut dynamics instead), dynamics `musicians`, and audio paths under `full_audio/`.
 */
interface RawChart {
  name: string;
  song_dir?: string;
  flat_screen?: boolean;
  audio: string[];
  applause_time: number | null;
  num_initial_beats_to_skip: number;
  beat_times: number[];
  gestures: { beat: number; time: number; tokens: string[]; type: string }[];
  cues: { beat: number; time: number; instrument: string }[];
  dynamics: { type: string; instrument: string; musicians?: string[]; begin: number; end: number; time: [number, number] }[];
  fermatas?: { instrument: string; begin: number; end: number; time: [number, number] }[];
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
    .map((d) => {
      if (!DYNAMICS.includes(d.type as DynamicsType)) throw new Error(`unknown dynamics type ${d.type}`);
      return d;
    })
    .map((d, i) => ({
      id: i,
      type: d.type as DynamicsType,
      instrument: d.instrument,
      musicians: d.musicians ?? [],
      begin: d.begin,
      end: d.end,
      time: [beatTimes[d.begin] ?? d.time[0], beatTimes[d.end] ?? d.time[1]] as [number, number],
    }))
    .sort((a, b) => a.time[0] - b.time[0]);

  const fermatas: Fermata[] = (raw.fermatas ?? [])
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

  const songDir = raw.song_dir ?? songDirFromName(raw.name);
  return {
    name: raw.name,
    songDir,
    flatScreen: raw.flat_screen ?? false,
    audio: resolveAudio(raw.audio, songDir),
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

/** "Verdi_DiesIrae_Flat_Hard" / "MC_Verdi_DiesIrae" → "Verdi_DiesIrae". */
function songDirFromName(name: string): string {
  return name.replace(/^MC_/, '').replace(/_(Flat_)?(Easy|Medium|Hard|Expert|Transcription|Flat)$/, '');
}

/**
 * Audio paths. Demo charts already point at `audio/<song>/…`. Release charts point at the game's
 * `full_audio/<song>/ScoreSoundAsset/…` (normal and FailMode files, in either order); locally the
 * files live at `audio/<song>/<song>.ogg` and `audio/<song>/<song>_Fail.ogg`.
 */
export function resolveAudio(paths: string[], songDir: string): [normal: string, fail?: string] {
  if (paths.length && paths.every((p) => p.startsWith('audio/'))) return [paths[0], paths[1]];
  const hasFail = paths.some((p) => /failmode/i.test(p));
  return [`audio/${songDir}/${songDir}.ogg`, hasFail ? `audio/${songDir}/${songDir}_Fail.ogg` : undefined];
}

export async function loadChart(url: string): Promise<Chart> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`failed to load chart ${url}: ${res.status}`);
  return parseChart((await res.json()) as RawChart);
}
