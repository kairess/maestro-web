export type Token = 'Up' | 'Down' | 'Left' | 'Right' | 'DownLeft' | 'DownRight';
export type GestureType = 'Normal' | 'Low' | 'Accent';
export type DynamicsType = 'Crescendo' | 'Decrescendo' | 'Fermata' | 'Sustain' | 'Contain';
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
  instrument: string;
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
