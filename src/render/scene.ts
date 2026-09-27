import * as THREE from 'three';

/** First-person conductor view: camera sits at eye height above the shoulder midpoint looking toward the orchestra (-z). */
export class SceneView {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  private onResize = () => this.resize();

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(2, devicePixelRatio));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.05, 50);
    this.camera.position.set(0, 0.3, 0.25);
    this.camera.lookAt(0, -0.05, -2);
    this.scene.background = new THREE.Color(0x151b24);

    const hemi = new THREE.HemisphereLight(0xffe6c8, 0x1a1020, 1.2);
    this.scene.add(hemi);
    const key = new THREE.DirectionalLight(0xfff2dc, 2.0);
    key.position.set(-1, 2, 1.5);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x9ab4ff, 0.8);
    rim.position.set(1.5, 0.5, -2);
    this.scene.add(rim);

    addEventListener('resize', this.onResize);
    this.resize();
  }

  resize(): void {
    const w = innerWidth;
    const h = innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  /** Project a world point to CSS pixel coordinates (for DOM markers). */
  project(p: THREE.Vector3): { x: number; y: number; visible: boolean } {
    const v = p.clone().project(this.camera);
    return { x: ((v.x + 1) / 2) * innerWidth, y: ((1 - v.y) / 2) * innerHeight, visible: v.z < 1 };
  }

  dispose(): void {
    removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }
}
