import * as THREE from 'three';
import type { Hand } from '../chart/types';
import type { BodySnapshot, HandTracker, Vec3 } from '../tracking/handState';

// MediaPipe hand connections (21 landmarks).
const HAND_BONES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
];
// Pseudo hand from the pose model: wrist, index, pinky, thumb.
const PSEUDO_BONES: [number, number][] = [[0, 1], [0, 2], [0, 3], [1, 2]];

const TRAIL_POINTS = 24;

class HandMesh {
  readonly group = new THREE.Group();
  private joints: THREE.Mesh[] = [];
  private bones: THREE.Mesh[] = [];
  private baton: THREE.Group | null = null;
  private batonMats: THREE.MeshStandardMaterial[] = [];
  private batonFlash = 0;
  private glowColor = new THREE.Color(0x000000);
  private glowAmount = 0;
  private trail: THREE.Line;
  private trailPositions: Float32Array;
  private jointMat: THREE.MeshStandardMaterial;
  private boneMat: THREE.MeshStandardMaterial;

  constructor(
    scene: THREE.Scene,
    readonly hand: Hand,
    withBaton: boolean,
  ) {
    this.jointMat = new THREE.MeshStandardMaterial({ color: 0xfff1e0, roughness: 0.5, metalness: 0.05, transparent: true, opacity: 0.95 });
    this.boneMat = new THREE.MeshStandardMaterial({ color: 0xf2d9c4, roughness: 0.6, metalness: 0.0, transparent: true, opacity: 0.9 });
    const jointGeo = new THREE.SphereGeometry(0.011, 12, 10);
    const boneGeo = new THREE.CylinderGeometry(0.007, 0.007, 1, 8, 1);
    for (let i = 0; i < 21; i++) {
      const m = new THREE.Mesh(jointGeo, this.jointMat);
      m.visible = false;
      this.joints.push(m);
      this.group.add(m);
    }
    for (let i = 0; i < HAND_BONES.length; i++) {
      const m = new THREE.Mesh(boneGeo, this.boneMat);
      m.visible = false;
      this.bones.push(m);
      this.group.add(m);
    }
    if (withBaton) {
      this.baton = HandMesh.makeQuill(this.batonMats);
      this.baton.visible = false;
      this.group.add(this.baton);
    }
    this.trailPositions = new Float32Array(TRAIL_POINTS * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(this.trailPositions, 3));
    this.trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: hand === 'right' ? 0xffd27a : 0x8fd3ff, transparent: true, opacity: 0.6 }));
    this.trail.frustumCulled = false;
    scene.add(this.trail);
    scene.add(this.group);
  }

  /** The original's baton is a quill: a thin shaft with a long, slightly curved feather vane. Built along +y. */
  private static makeQuill(mats: THREE.MeshStandardMaterial[]): THREE.Group {
    const g = new THREE.Group();
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0xe9dcc6, roughness: 0.4, metalness: 0.05, emissive: 0x000000 });
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.0015, 0.003, 0.3, 8, 1), shaftMat);
    shaft.position.y = 0.15;
    const vane = new THREE.Shape();
    // One side of the feather, from the base (y=0.06) to the tip (y=0.31).
    vane.moveTo(0, 0.06);
    vane.bezierCurveTo(0.03, 0.1, 0.034, 0.2, 0.004, 0.31);
    vane.lineTo(0, 0.31);
    vane.bezierCurveTo(-0.022, 0.22, -0.02, 0.12, 0, 0.06);
    const vaneGeo = new THREE.ShapeGeometry(vane, 16);
    const vaneMat = new THREE.MeshStandardMaterial({ color: 0xb08a66, roughness: 0.85, metalness: 0, side: THREE.DoubleSide, emissive: 0x000000 });
    const vaneMesh = new THREE.Mesh(vaneGeo, vaneMat);
    // Barbs: darker stripes across the vane.
    const barbPts: number[] = [];
    for (let i = 0; i < 14; i++) {
      const y = 0.08 + i * 0.016;
      barbPts.push(0, y, 0.0005, 0.024, y + 0.012, 0.0005, 0, y, 0.0005, -0.016, y + 0.01, 0.0005);
    }
    const barbGeo = new THREE.BufferGeometry();
    barbGeo.setAttribute('position', new THREE.Float32BufferAttribute(barbPts, 3));
    const barbs = new THREE.LineSegments(barbGeo, new THREE.LineBasicMaterial({ color: 0x6b4a33, transparent: true, opacity: 0.6 }));
    g.add(shaft, vaneMesh, barbs);
    mats.push(shaftMat, vaneMat);
    return g;
  }

  /** Flash the quill gold (a successful stroke). */
  flash(): void {
    this.batonFlash = 1;
  }

  /** Tint the whole hand (left hand while a dynamics/fermata is live). */
  setGlow(color: number | null, amount: number): void {
    if (color === null) this.glowAmount = 0;
    else {
      this.glowColor.setHex(color);
      this.glowAmount = amount;
    }
  }

  tick(dt: number): void {
    this.batonFlash = Math.max(0, this.batonFlash - dt / 0.3);
    for (const m of this.batonMats) {
      m.emissive.setHex(0xffc21f);
      m.emissiveIntensity = this.batonFlash * 1.2;
    }
    for (const m of [this.jointMat, this.boneMat]) {
      m.emissive.copy(this.glowColor);
      m.emissiveIntensity = this.glowAmount * 0.9;
    }
  }

  private static setBone(mesh: THREE.Mesh, a: Vec3, b: Vec3): void {
    const va = new THREE.Vector3(a.x, a.y, a.z);
    const vb = new THREE.Vector3(b.x, b.y, b.z);
    const len = va.distanceTo(vb);
    mesh.position.copy(va).lerp(vb, 0.5);
    mesh.scale.set(1, Math.max(1e-4, len), 1);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());
    mesh.visible = len > 1e-4;
  }

  dispose(): void {
    this.group.removeFromParent();
    this.trail.removeFromParent();
    this.trail.geometry.dispose();
    (this.trail.material as THREE.Material).dispose();
    this.jointMat.dispose();
    this.boneMat.dispose();
    for (const m of this.batonMats) m.dispose();
    this.baton?.traverse((o) => {
      if (o instanceof THREE.Mesh || o instanceof THREE.LineSegments) o.geometry.dispose();
      if (o instanceof THREE.LineSegments) (o.material as THREE.Material).dispose();
    });
  }

  update(sample: BodySnapshot['hands'][Hand], tracker: HandTracker): void {
    if (!sample) {
      this.group.visible = false;
      this.trail.visible = false;
      return;
    }
    this.group.visible = true;
    this.trail.visible = true;
    const lm = sample.landmarks;
    const full = lm && lm.length === 21;
    const pts: Vec3[] = full ? lm : lm && lm.length === 4 ? lm : [sample.pos];
    const bones = full ? HAND_BONES : pts.length === 4 ? PSEUDO_BONES : [];
    for (let i = 0; i < 21; i++) {
      const j = this.joints[i];
      if (i < pts.length) {
        j.position.set(pts[i].x, pts[i].y, pts[i].z);
        j.visible = true;
        j.scale.setScalar(full ? 1 : 1.8);
      } else j.visible = false;
    }
    for (let i = 0; i < this.bones.length; i++) {
      if (i < bones.length) HandMesh.setBone(this.bones[i], pts[bones[i][0]], pts[bones[i][1]]);
      else this.bones[i].visible = false;
    }
    if (this.baton) {
      // Baton extends the index finger: base at the fingertip (8), aligned with the last
      // segment DIP (7) → tip. Pseudo hand: base at the index point, aligned wrist → index.
      const base = full ? pts[8] : pts.length === 4 ? pts[1] : null;
      const from = full ? pts[7] : pts.length === 4 ? pts[0] : null;
      if (base && from) {
        const b = new THREE.Vector3(base.x, base.y, base.z);
        const dir = b.clone().sub(new THREE.Vector3(from.x, from.y, from.z));
        if (dir.length() > 1e-4) {
          this.baton.position.copy(b);
          this.baton.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
          this.baton.visible = true;
        }
      } else this.baton.visible = false;
    }
    // Trail.
    const hist = tracker.trail();
    const n = Math.min(TRAIL_POINTS, hist.length);
    const start = hist.length - n;
    for (let i = 0; i < TRAIL_POINTS; i++) {
      const e = hist[Math.min(hist.length - 1, start + Math.max(0, i - (TRAIL_POINTS - n)))];
      const p = e ? e.pos : sample.pos;
      this.trailPositions[i * 3] = p.x;
      this.trailPositions[i * 3 + 1] = p.y;
      this.trailPositions[i * 3 + 2] = p.z;
    }
    (this.trail.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  }
}

export class HandsView {
  private left: HandMesh;
  private right: HandMesh;

  constructor(scene: THREE.Scene) {
    this.left = new HandMesh(scene, 'left', false);
    this.right = new HandMesh(scene, 'right', true);
  }

  /** Gold flash on the quill after a hit. */
  flashBaton(): void {
    this.right.flash();
  }

  setGlow(hand: 'left' | 'right', color: number | null, amount = 0): void {
    (hand === 'left' ? this.left : this.right).setGlow(color, amount);
  }

  update(snap: BodySnapshot | null, trackers: { left: HandTracker; right: HandTracker }, dt = 0): void {
    this.left.tick(dt);
    this.right.tick(dt);
    if (!snap) return;
    this.left.update(snap.hands.left, trackers.left);
    this.right.update(snap.hands.right, trackers.right);
  }

  dispose(): void {
    this.left.dispose();
    this.right.dispose();
  }
}
