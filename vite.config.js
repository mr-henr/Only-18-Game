import { defineConfig } from 'vite';

export default defineConfig({
  // O caminho muda conforme onde a interface é publicada:
  //   npm run build        -> raiz (servida pelo servidor do jogo)
  //   npm run build:pages  -> /Only-18-Game/ (GitHub Pages)
  base: process.env.VITE_BASE ?? '/',
  server: { host: true, port: 5173, open: true },
  build: { target: 'es2022', outDir: 'dist' }
});
