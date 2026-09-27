import * as THREE from 'three';
import type { Hand } from '../chart/types';

/**
 * The two "beat lines" of the original game: a thin white bar per hand, floating just below eye
 * level, with a soft misty light column rising behind it. Notes fall onto the right bar; the left
 * bar carries left-hand notes and the dynamics/fermata objects.
 */
export const LANE: Record<Hand, THREE.Vector3> = {
  left: new THREE.Vector3(-0.4, 0.0, -1.1),
  right: new THREE.Vector3(0.4, 0.0, -1.1),
};
export const LANE_WIDTH = 0.44;

let glowTex: THREE.Texture | null = null;
let fogTex: THREE.Texture | null = null;

/** Radial white glow (shared). */
export function glowTexture(): THREE.Texture {
  if (glowTex) return glowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  glowTex = new THREE.CanvasTexture(c);
  glowTex.colorSpace = THREE.SRGBColorSpace;
  return glowTex;
}

/** Soft vertical mist column: bright at the bottom, fading upward and to the sides, with a little noise. */
function fogTexture(): THREE.Texture {
  if (fogTex) return fogTex;
  const w = 128;
  const h = 256;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  const img = g.createImageData(w, h);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const blobs = Array.from({ length: 40 }, () => ({ x: rnd() * w, y: rnd() * h, r: 12 + rnd() * 30, a: 0.15 + rnd() * 0.25 }));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = (x / (w - 1)) * 2 - 1;
      const vy = 1 - y / (h - 1); // 0 bottom .. 1 top
      const widen = 0.55 + 0.45 * vy; // column narrows toward the line
      const side = Math.max(0, 1 - Math.pow(Math.abs(nx) / widen, 2));
      let n = 0;
      for (const b of blobs) {
        const d = Math.hypot(x - b.x, y - b.y) / b.r;
        if (d < 1) n += b.a * (1 - d * d);
      }
      const a = side * Math.pow(1 - vy, 0.8) * (0.55 + Math.min(0.6, n));
      const i = (y * w + x) * 4;
      img.data[i] = 235;
      img.data[i + 1] = 240;
      img.data[i + 2] = 248;
      img.data[i + 3] = Math.round(Math.min(1, a) * 255);
    }
  }
  g.putImageData(img, 0, 0);
  fogTex = new THREE.CanvasTexture(c);
  fogTex.colorSpace = THREE.SRGBColorSpace;
  return fogTex;
}

interface LaneVisual {
  bar: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  glow: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  fog: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  spark: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
  flash: number;
  hold: number;
  holdColor: THREE.Color;
  flashColor: THREE.Color;
}

export class LanesView {
  readonly group = new THREE.Group();
  private lanes: Record<Hand, LaneVisual>;
  private white = new THREE.Color(0xffffff);

  constructor(scene: THREE.Scene) {
    const make = (hand: Hand): LaneVisual => {
      const p = LANE[hand];
      const bar = new THREE.Mesh(
        new THREE.PlaneGeometry(LANE_WIDTH, 0.006),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, depthWrite: false, toneMapped: false }),
      );
      bar.position.copy(p);
      const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(LANE_WIDTH * 1.25, 0.06),
        new THREE.MeshBasicMaterial({ map: glowTexture(), color: 0xffffff, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
      );
      glow.position.copy(p).add(new THREE.Vector3(0, 0, 0.001));
      const fog = new THREE.Mesh(
        new THREE.PlaneGeometry(0.3, 0.55),
        new THREE.MeshBasicMaterial({ map: fogTexture(), transparent: true, opacity: 0.22, depthWrite: false }),
      );
      fog.position.copy(p).add(new THREE.Vector3(0, 0.24, -0.05));
      fog.renderOrder = -1;
      // Four-pointed sparkle in the middle of the line.
      const star = new THREE.Shape();
      const R = 0.03;
      const r = 0.004;
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4 + Math.PI / 2;
        const rad = i % 2 === 0 ? (i % 4 === 0 ? R : R * 0.45) : r;
        const x = Math.cos(a) * rad;
        const y = Math.sin(a) * rad;
        if (i === 0) star.moveTo(x, y);
        else star.lineTo(x, y);
      }
      const spark = new THREE.Mesh(
        new THREE.ShapeGeometry(star),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, depthWrite: false, toneMapped: false }),
      );
      spark.position.copy(p).add(new THREE.Vector3(0, 0, 0.002));
      this.group.add(fog, bar, glow, spark);
      return { bar, glow, fog, spark, flash: 0, flashColor: new THREE.Color(0xffd35a), hold: 0, holdColor: new THREE.Color(0xffc21f) };
    };
    this.lanes = { left: make('left'), right: make('right') };
    scene.add(this.group);
  }

  /** Light the bar up (hit feedback). */
  flash(hand: Hand, color: number, strength = 1): void {
    const l = this.lanes[hand];
    l.flash = Math.max(l.flash, strength);
    l.flashColor.setHex(color);
  }

  /** Continuous glow while a hold (dynamics/fermata) sits on this line; call every frame (0 = off). */
  hold(hand: Hand, color: number, amount: number): void {
    const l = this.lanes[hand];
    l.hold = amount;
    l.holdColor.setHex(color);
  }

  update(dt: number): void {
    for (const l of Object.values(this.lanes)) {
      l.flash = Math.max(0, l.flash - dt / 0.35);
      const useHold = l.hold > l.flash;
      const f = Math.max(l.flash, l.hold);
      const color = useHold ? l.holdColor : l.flashColor;
      l.glow.material.opacity = 0.25 + 0.75 * f;
      l.glow.material.color.copy(this.white).lerp(color, Math.min(1, f * 1.5));
      l.bar.material.color.copy(this.white).lerp(color, f * 0.8);
      l.bar.scale.y = 1 + f * 1.5;
      l.spark.scale.setScalar(1 + f * 0.6);
    }
  }

  dispose(): void {
    this.group.removeFromParent();
    this.group.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
    });
  }
}
