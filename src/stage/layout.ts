export interface StagePosition {
  x: number;
  y: number;
  /** Where this section appears in the backdrop image, 0..1 from the top-left (optional). */
  u?: number;
  v?: number;
}

export interface StageLayout {
  video: string | null;
  /** Still backdrop image (used when there is no video). */
  image: string | null;
  instruments: Record<string, StagePosition>;
}

const FALLBACK: StagePosition = { x: 0, y: 0.5 };

export async function loadLayout(url: string): Promise<StageLayout> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`failed to load layout ${url}: ${res.status}`);
  const raw = (await res.json()) as StageLayout;
  return { video: raw.video ?? null, image: raw.image ?? null, instruments: raw.instruments ?? {} };
}

export function positionOf(layout: StageLayout, instrument: string): StagePosition {
  return layout.instruments[instrument] ?? FALLBACK;
}

export function azimuthOf(layout: StageLayout, instrument: string): number {
  return positionOf(layout, instrument).x;
}

/** Human-friendly label (Choir_Tutti → Choir Tutti). */
export function labelOf(instrument: string): string {
  return instrument.replace(/_/g, ' ');
}

/**
 * Draws a placeholder stage (tiered arcs, warm light, labelled sections) into a
 * canvas so the game is playable before real orchestra footage exists.
 */
export function drawPlaceholderStage(layout: StageLayout, width = 1920, height = 1080): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  const g = c.getContext('2d')!;

  // Stormy dusk sky (blue-grey clouds over a warm, smoky horizon), like the original's Verdi stage.
  const bg = g.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#1d2633');
  bg.addColorStop(0.3, '#46566a');
  bg.addColorStop(0.5, '#6f7068');
  bg.addColorStop(0.62, '#5b4636');
  bg.addColorStop(1, '#24170f');
  g.fillStyle = bg;
  g.fillRect(0, 0, width, height);

  // Clouds and smoke.
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 45; i++) {
    const x = rnd() * width;
    const y = rnd() * height * 0.55;
    const r = 80 + rnd() * 220;
    const cloud = g.createRadialGradient(x, y, 0, x, y, r);
    const tone = rnd() < 0.3 ? '170, 184, 198' : '40, 52, 68';
    cloud.addColorStop(0, `rgba(${tone}, ${0.05 + rnd() * 0.08})`);
    cloud.addColorStop(1, `rgba(${tone}, 0)`);
    g.fillStyle = cloud;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // Warm fire glow along the horizon.
  const spot = g.createRadialGradient(width / 2, height * 0.62, 40, width / 2, height * 0.62, width * 0.6);
  spot.addColorStop(0, 'rgba(255, 160, 80, 0.22)');
  spot.addColorStop(1, 'rgba(255, 170, 90, 0)');
  g.fillStyle = spot;
  g.fillRect(0, 0, width, height);
  for (let i = 0; i < 10; i++) {
    const x = rnd() * width;
    const y = height * (0.35 + rnd() * 0.2);
    const r = 6 + rnd() * 10;
    const fire = g.createRadialGradient(x, y, 0, x, y, r * 4);
    fire.addColorStop(0, 'rgba(255, 190, 90, 0.9)');
    fire.addColorStop(0.3, 'rgba(255, 120, 40, 0.35)');
    fire.addColorStop(1, 'rgba(255, 120, 40, 0)');
    g.fillStyle = fire;
    g.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
  }

  // Risers as concentric arcs (back row = highest on screen), dark and crowded.
  const cx = width / 2;
  const cy = height * 1.15;
  for (let i = 6; i >= 1; i--) {
    const r = (height * 0.32 * i) / 6 + height * 0.2;
    g.beginPath();
    g.arc(cx, cy, r, Math.PI, 2 * Math.PI);
    g.fillStyle = `rgba(${40 + i * 9}, ${26 + i * 6}, ${22 + i * 4}, 0.95)`;
    g.fill();
    g.strokeStyle = 'rgba(255, 190, 130, 0.12)';
    g.lineWidth = 3;
    g.stroke();
  }

  // Sections.
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  for (const [name, p] of Object.entries(layout.instruments)) {
    if (name === 'Choir_Tutti' || name === 'Brass' || name === 'Woodwind') continue; // aggregate labels
    const { px, py } = layoutToPixel(p, width, height);
    const size = 44 + (1 - p.y) * 40;
    g.fillStyle = 'rgba(240, 220, 200, 0.12)';
    g.beginPath();
    g.ellipse(px, py, size * 1.6, size * 0.7, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = 'rgba(255, 245, 230, 0.85)';
    g.font = `${Math.round(size * 0.42)}px system-ui, sans-serif`;
    g.fillText(labelOf(name), px, py);
  }
  return c;
}

/** Map a layout position onto backdrop pixels (front row near the bottom). */
export function layoutToPixel(p: StagePosition, width: number, height: number): { px: number; py: number } {
  if (p.u !== undefined && p.v !== undefined) return { px: p.u * width, py: p.v * height };
  const depth = p.y; // 0 front .. 1 back
  const spread = 0.95 - depth * 0.35; // rows narrow toward the back
  const px = width / 2 + p.x * spread * (width / 2);
  const py = height * (0.88 - depth * 0.62);
  return { px, py };
}
