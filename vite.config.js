import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default {
  plugins: [
    wasm(),
    topLevelAwait()
  ],
  server: {
    port: 3000,
    open: true,
    fs: {
      allow: ['..']
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  optimizeDeps: {
    exclude: ['@dimforge/rapier3d']
  },
  assetsInclude: ['**/*.wasm']
}

