import type { Hand, Token } from '../chart/types';
import { TOKEN_DIRECTION } from '../chart/types';
import type { Vec3 } from '../tracking/handState';
import { DEFAULT_SHOULDERS, REST_POSITION, type InputSource, type RawFrame } from './types';

/**
 * Keyboard stand-in for the webcam (development only).
 *   Right hand: arrow keys, `,` = DownLeft, `.` = DownRight
 *   Left hand:  W/A/S/D, Z = DownLeft, C = DownRight
 *   Shift held: accent-strength stroke
 *   Space held: raise and extend the left hand (cue / fermata hold)
 *   `[` held: left hand drifts up (crescendo), `]` held: drifts down (decrescendo)
 */
export class KeyboardInput implements InputSource {
  private pos: Record<Hand, Vec3> = { left: { ...REST_POSITION.left }, right: { ...REST_POSITION.right } };
  private strokes: { hand: Hand; dir: { x: number; y: number }; start: number; amp: number }[] = [];
  private held = new Set<string>();
  private lastT: number | null = null;
  private onKeyDown = (e: KeyboardEvent) => this.keyDown(e);
  private onKeyUp = (e: KeyboardEvent) => this.held.delete(e.code);

  constructor() {
    addEventListener('keydown', this.onKeyDown);
    addEventListener('keyup', this.onKeyUp);
  }

  dispose(): void {
    removeEventListener('keydown', this.onKeyDown);
    removeEventListener('keyup', this.onKeyUp);
  }

  private static RIGHT: Record<string, Token> = {
    ArrowUp: 'Up',
    ArrowDown: 'Down',
    ArrowLeft: 'Left',
    ArrowRight: 'Right',
    Comma: 'DownLeft',
    Period: 'DownRight',
  };
  private static LEFT: Record<string, Token> = {
    KeyW: 'Up',
    KeyS: 'Down',
    KeyA: 'Left',
    KeyD: 'Right',
    KeyZ: 'DownLeft',
    KeyC: 'DownRight',
  };

  private keyDown(e: KeyboardEvent): void {
    if (e.repeat) {
      this.held.add(e.code);
      return;
    }
    this.held.add(e.code);
    const now = this.lastT ?? 0;
    const amp = e.shiftKey ? 0.35 : 0.2;
    const r = KeyboardInput.RIGHT[e.code];
    const l = KeyboardInput.LEFT[e.code];
    if (r) {
      this.strokes.push({ hand: 'right', dir: TOKEN_DIRECTION[r], start: now, amp });
      e.preventDefault();
    }
    if (l) {
      this.strokes.push({ hand: 'left', dir: TOKEN_DIRECTION[l], start: now, amp });
      e.preventDefault();
    }
    if (e.code === 'Space') e.preventDefault();
  }

  /** Stroke displacement profile: out over 0.25s, back over 0.35s. */
  private static strokeOffset(age: number, amp: number): number {
    if (age < 0) return 0;
    if (age < 0.25) {
      const u = age / 0.25;
      return amp * u * u * (3 - 2 * u);
    }
    if (age < 0.6) {
      const u = (age - 0.25) / 0.35;
      return amp * (1 - u * u * (3 - 2 * u));
    }
    return 0;
  }

  poll(t: number): RawFrame | null {
    const dt = this.lastT === null ? 0 : Math.max(0, t - this.lastT);
    this.lastT = t;
    // Left-hand "expression" targets driven by held keys.
    const target: Vec3 = { ...REST_POSITION.left };
    if (this.held.has('Space')) {
      target.x = -0.35;
      target.y = 0.15;
    }
    const drift = this.held.has('BracketLeft') ? 0.12 : this.held.has('BracketRight') ? -0.12 : 0;
    const base = this.pos.left;
    const a = 1 - Math.exp(-dt / 0.15);
    base.x += (target.x - base.x) * a;
    base.y += drift * dt + (drift === 0 ? (target.y - base.y) * a : 0);
    base.y = Math.min(0.4, Math.max(-0.5, base.y));

    const out: Record<Hand, Vec3> = { left: { ...this.pos.left }, right: { ...this.pos.right } };
    this.strokes = this.strokes.filter((s) => t - s.start < 0.6);
    for (const s of this.strokes) {
      const off = KeyboardInput.strokeOffset(t - s.start, s.amp);
      out[s.hand].x += s.dir.x * off;
      out[s.hand].y += s.dir.y * off;
    }
    return {
      t,
      tracked: true,
      shoulders: DEFAULT_SHOULDERS,
      hands: { left: { pos: out.left }, right: { pos: out.right } },
    };
  }
}
