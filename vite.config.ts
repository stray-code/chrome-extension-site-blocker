import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx, defineManifest } from '@crxjs/vite-plugin'

const manifest = defineManifest({
  manifest_version: 3,
  name: 'サイトブロック',
  description: 'サイトを閲覧できないようにします。',
  version: '1.0.0',
  icons: {
    16: 'img/icon16.png',
    48: 'img/icon48.png',
    128: 'img/icon128.png'
  },
  action: {
    default_icon: 'img/icon16.png',
    default_popup: 'src/popup/index.html',
  },
  content_scripts: [
    {
      js: ['src/content/main.ts'],
      matches: ['http://*/*', 'https://*/*'],
    }
  ],
  options_page: "src/option/index.html",
  background: {
    service_worker: "src/background.ts",
    type: "module"
  },
  permissions: ["webNavigation", "storage"],
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
})
