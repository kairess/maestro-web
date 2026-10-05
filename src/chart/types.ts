export type Token = 'Up' | 'Down' | 'Left' | 'Right' | 'DownLeft' | 'DownRight';
export type GestureType = 'Normal' | 'Low' | 'Accent';
/**
 * Left-hand expressions. The demo charts had only Crescendo/Decrescendo (plus a separate fermata
 * list); the release replaces fermatas with Sustain (hold) followed by a one-beat Cut (release),
 * and adds Contain (keep the orchestra held back: calm hand, no rise).
 */
export type DynamicsType = 'Crescendo' | 'Decrescendo' | 'Sustain' | 'Contain' | 'Cut';
export type Hand = 'left' | 'right';

export interface Vec2 {
  x: number;
  y: number;
}

/** Unit direction for each token in conductor space (x = conductor's right, y = up). */
export const TOKEN_DIRECTION: Record<Token, Vec2> = {
  Up: { x: 0, y: 1 },
  Down: { x: 0, y: -1 },
  Left: { x: -1, y: 0 },
  Right: { x: 1, y: 0 },
  DownLeft: { x: -Math.SQRT1_2, y: -Math.SQRT1_2 },
  DownRight: { x: Math.SQRT1_2, y: -Math.SQRT1_2 },
};

export interface Gesture {
  id: number;
  beat: number;
  time: number;
  tokens: Token[];
  type: GestureType;
}

export interface Cue {
  id: number;
  beat: number;
  time: number;
  instrument: string;
}

export interface Dynamics {
  id: number;
  type: DynamicsType;
  /** Section (demo: an instrument name; release: a stage anchor such as "Score_400_65"). */
  instrument: string;
  /** Release charts: the musicians the expression is aimed at (may be empty). */
  musicians: string[];
  begin: number;
  end: number;
  time: [number, number];
}

export interface Fermata {
  id: number;
  instrument: string;
  begin: number;
  end: number;
  time: [number, number];
}

export interface FocusSection {
  beat: number;
  time: number;
  instrument: string;
}

export interface Chart {
  name: string;
  /** Song folder ("Verdi_DiesIrae"); audio lives under audio/<songDir>/. */
  songDir: string;
  /** Release "Flat" variant (made for the flat-screen mode). */
  flatScreen: boolean;
  audio: [normal: string, fail?: string];
  applauseTime: number | null;
  numInitialBeatsToSkip: number;
  beatTimes: number[];
  gestures: Gesture[];
  cues: Cue[];
  dynamics: Dynamics[];
  fermatas: Fermata[];
  focusSections: FocusSection[];
  /** Song end for the session: applause time or last beat + 3s. */
  endTime: number;
}

/** Which hand(s) a gesture requires, and the token for each. */
export interface HandRequirement {
  hand: Hand;
  token: Token;
}
