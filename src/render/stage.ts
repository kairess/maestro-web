import * as THREE from 'three';
import { drawPlaceholderStage, layoutToPixel, positionOf, type StageLayout } from '../stage/layout';
import { glowTexture } from './lanes';

// The backdrop is sized to just fill the first-person camera's view at this depth (16:9), so the
// whole picture is visible; CROP leaves a small margin so focus panning never shows the edge.
const PLANE_Z = -6;
const PLANE_H = 7.9;
const PLANE_W = 14.04;
const PLANE_Y = -0.99;
const CROP = 0.03;
const PAN = 0.022;

/** Backdrop plane showing the orchestra (video when available, drawn placeholder otherwise) with gentle focus panning. */
export class StageView {
  readonly mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  private video: HTMLVideoElement | null = null;
  private targetPan = new THREE.Vector2(0, 0);
  private pan = new THREE.Vector2(0, 0);
  private texW = 1920;
  private texH = 1080;
  private spot: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  private spotTarget: { instrument: string | null; amount: number } = { instrument: null, amount: 0 };
  private spotAmount = 0;

  constructor(
    scene: THREE.Scene,
    private layout: StageLayout,
  ) {
    const canvas = drawPlaceholderStage(layout);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(PLANE_W, PLANE_H), mat);
    this.mesh.position.set(0, PLANE_Y, PLANE_Z);
    scene.add(this.mesh);
    // Slight zoom so panning never reveals the edge.
    tex.repeat.set(1 - 2 * CROP, 1 - 2 * CROP);
    tex.offset.set(CROP, CROP);
    // Warm spotlight laid over the section being cued / featured.
    this.spot = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: glowTexture(), color: 0xffd9a0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    this.spot.scale.set(2.6, 1.9, 1);
    scene.add(this.spot);
    if (layout.video) void this.attachVideo(layout.video);
    else if (layout.image) void this.attachImage(layout.image);
  }

  private async attachImage(url: string): Promise<void> {
    try {
      const tex = await new THREE.TextureLoader().loadAsync(url);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      this.useTexture(tex, tex.image.width, tex.image.height);
      // A photo backdrop is busy: dim it a little so notes, lines and the spotlight stand out.
      this.mesh.material.color.setScalar(0.8);
    } catch (err) {
      console.warn('[stage] image failed', url, err);
    }
  }

  private useTexture(tex: THREE.Texture, w: number, h: number): void {
    tex.repeat.set(1 - 2 * CROP, 1 - 2 * CROP);
    tex.offset.set(CROP, CROP);
    const old = this.mesh.material.map;
    this.mesh.material.map = tex;
    this.mesh.material.needsUpdate = true;
    old?.dispose();
    this.texW = w;
    this.texH = h;
  }

  /** Light up a section (cue coming, or the featured section); amount 0..1. */
  highlight(instrument: string | null, amount: number): void {
    this.spotTarget = { instrument, amount: instrument ? amount : 0 };
  }

  private async attachVideo(url: string): Promise<void> {
    const v = document.createElement('video');
    v.src = url;
    v.muted = true;
    v.loop = false;
    v.playsInline = true;
    v.preload = 'auto';
    await new Promise<void>((resolve, reject) => {
      v.onloadeddata = () => resolve();
      v.onerror = () => reject(new Error(`video failed: ${url}`));
    }).catch((err) => console.warn('[stage]', err));
    if (v.readyState < 2) return;
    const tex = new THREE.VideoTexture(v);
    tex.colorSpace = THREE.SRGBColorSpace;
    this.useTexture(tex, v.videoWidth, v.videoHeight);
    this.video = v;
  }

  /** Start/seek the backdrop video in sync with the song. */
  playFrom(songSeconds: number): void {
    if (!this.video) return;
    this.video.currentTime = Math.max(0, songSeconds);
    void this.video.play();
  }

  stop(): void {
    this.video?.pause();
  }

  /** Nudge the "camera" toward an instrument (focus_sections). */
  focus(instrument: string | null): void {
    if (!instrument) {
      this.targetPan.set(0, 0);
      return;
    }
    const p = positionOf(this.layout, instrument);
    this.targetPan.set(p.x * PAN, (p.y - 0.5) * PAN);
  }

  update(dt: number): void {
    const a = 1 - Math.exp(-dt / 0.8);
    this.pan.lerp(this.targetPan, a);
    const map = this.mesh.material.map;
    if (map) map.offset.set(CROP + this.pan.x, CROP + this.pan.y);
    // Spotlight: follow the target section, fade with its amount.
    const target = this.spotTarget.instrument ? this.spotTarget.amount : 0;
    this.spotAmount += (target - this.spotAmount) * (1 - Math.exp(-dt / 0.15));
    if (this.spotTarget.instrument) this.spot.position.copy(this.worldPositionOf(this.spotTarget.instrument)).add(new THREE.Vector3(0, 0, 0.01));
    this.spot.material.opacity = 0.7 * this.spotAmount;
  }

  /** World position on the backdrop for an instrument (for cue markers). */
  worldPositionOf(instrument: string): THREE.Vector3 {
    const p = positionOf(this.layout, instrument);
    const { px, py } = layoutToPixel(p, this.texW, this.texH);
    // Texture pixel -> uv -> apply repeat/offset inverse -> plane local.
    const u = px / this.texW;
    const v = 1 - py / this.texH;
    const map = this.mesh.material.map;
    const rx = map?.repeat.x ?? 1;
    const ry = map?.repeat.y ?? 1;
    const ox = map?.offset.x ?? 0;
    const oy = map?.offset.y ?? 0;
    const lu = (u - ox) / rx;
    const lv = (v - oy) / ry;
    return new THREE.Vector3((lu - 0.5) * PLANE_W, (lv - 0.5) * PLANE_H, 0).add(this.mesh.position);
  }
}
