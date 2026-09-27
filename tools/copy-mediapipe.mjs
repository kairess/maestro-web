// Copies the MediaPipe tasks-vision WASM runtime into public/ so the built site is fully static.
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, 'node_modules/@mediapipe/tasks-vision/wasm');
const dst = join(root, 'public/mediapipe/wasm');
if (!existsSync(src)) {
  console.warn('[copy-mediapipe] wasm dir not found; run npm install first');
  process.exit(0);
}
mkdirSync(dst, { recursive: true });
cpSync(src, dst, { recursive: true });
console.log('[copy-mediapipe] copied wasm to public/mediapipe/wasm');
