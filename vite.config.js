import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'node:path'

export default defineConfig({
  base: '/',
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app.html'),
      },
    },
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'icons/icon-192.png',
        'icons/icon-512.png',
      ],
      manifest: {
        name: 'Inräknad PWA',
        short_name: 'Inräknad',
        start_url: '/',
        scope: '/',

        display: 'standalone',
        background_color: '#111111',
        theme_color: '#111111',
        description: 'KLIRR hackathon app for counting participants',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },

      devOptions: { enabled: false },
    }),
  ],
})