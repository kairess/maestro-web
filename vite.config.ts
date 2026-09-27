import basicSsl from '@vitejs/plugin-basic-ssl';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  // HTTPS is required for webcam access from other machines on the LAN (self-signed cert; accept the warning once).
  plugins: [basicSsl()],
  server: { port: 5173, host: true },
  build: { target: 'es2022', chunkSizeWarningLimit: 2000 },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
});
