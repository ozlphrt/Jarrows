import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { VitePWA } from 'vite-plugin-pwa';
import { execSync } from 'node:child_process';

export default ({ command }) => {
  // Determine base path and icon paths based on build mode
  const base = command === 'build' ? '/Jarrows/' : '/';
  const iconBase = command === 'build' ? '/Jarrows' : '';
  const isDev = command === 'serve';

  // Build identifier for "VER" button (short git SHA when available).
  // This is embedded at build time, so deployed builds have a stable code reference.
  let gitSha = '';
  try {
    gitSha = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    // Not a git checkout (or git unavailable) — keep empty and fall back to VERSION only.
    gitSha = '';
  }
  
  // Build plugins array conditionally
  const plugins = [
    wasm(),
    topLevelAwait(),
  ];
  
  // Only include VitePWA plugin in production builds to avoid service worker interference with HMR
  if (!isDev) {
    plugins.push(
      VitePWA({
        registerType: 'promptUpdate',
        includeAssets: ['192.png', '512.png'],
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          globPatterns: ['**/*.{js,css,html,png,svg,woff2,wasm}'],
          // Increase file size limit to accommodate large Rapier bundle (2.27 MB)
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        manifest: {
          name: 'Jarrows - Sliding Block Puzzle',
          short_name: 'Jarrows',
          description: 'A 3D sliding block puzzle game with physics',
          theme_color: '#87ceeb',
          background_color: '#87ceeb',
          display: 'standalone',
          orientation: 'any',
          scope: base,
          start_url: base,
          icons: [
            {
              src: `${iconBase}/192.png`,
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: `${iconBase}/512.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    );
  }
  
  return {
    // Only use base path in production build (for GitHub Pages subdirectory deployment)
    // In dev mode, use root path to avoid module resolution issues
    base,
    plugins,
    define: {
      __JARROWS_GIT_SHA__: JSON.stringify(gitSha),
    },
    server: {
      port: 3000,
      open: true,
      fs: {
        allow: ['..']
      },
      // Enable HMR with proper configuration
      hmr: {
        overlay: true,
        protocol: 'ws',
        host: 'localhost'
      },
      // Watch configuration for better file change detection
      watch: {
        usePolling: false, // Set to true if on WSL/Docker
        interval: 100
      },
      // Disable caching headers in dev mode
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets'
    },
    optimizeDeps: {
      exclude: ['@dimforge/rapier3d-compat']
    },
    assetsInclude: ['**/*.wasm']
  };
}
