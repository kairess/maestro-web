/**
 * Which charts the game offers. Release charts live in `charts/<song>/` in four difficulties and
 * two variants: the VR map and a "Flat" map made for the original game's flat-screen mode. A
 * webcam game is a flat-screen game, so the Flat variant is the default (`?variant=vr` switches).
 * Both variants have the same notes; they differ in stage anchors for dynamics and camera focus.
 */
export const SONGS = ['Verdi_DiesIrae'] as const;
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Expert'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export function useFlatVariant(): boolean {
  return new URLSearchParams(location.search).get('variant') !== 'vr';
}

/** Chart path under charts/ (without .json). */
export function chartPath(song: string, difficulty: Difficulty, flat = useFlatVariant()): string {
  return `${song}/${song}_${flat ? 'Flat_' : ''}${difficulty}`;
}

/**
 * Accepts a release path ("Verdi_DiesIrae/Verdi_DiesIrae_Flat_Hard") or a demo-era name
 * ("Verdi_DiesIrae_Hard", "Verdi_DiesIrae_Transcription", "MC_Verdi_DiesIrae") and returns a
 * release path, so old links keep working.
 */
export function normalizeChartName(name: string): string {
  if (name.includes('/')) return name;
  const song = SONGS.find((s) => name.includes(s)) ?? SONGS[0];
  return chartPath(song, difficultyOf(name));
}

export function difficultyOf(name: string): Difficulty {
  if (/Transcription/.test(name)) return 'Expert';
  return DIFFICULTIES.find((d) => name.endsWith(d)) ?? 'Easy';
}
