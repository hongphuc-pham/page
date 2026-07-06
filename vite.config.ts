import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
	plugins: [react()],
	base: command === 'build' ? '/page/' : '/',
	assetsInclude: ['**/*.docx', '**/*.pptx', '**/*.mp4'],
	// Files live on the Windows FS (/mnt/c) but the dev server runs in WSL —
	// inotify doesn't fire for Windows-side edits, so poll to pick up changes.
	server: { watch: { usePolling: true, interval: 200 } },
}))
