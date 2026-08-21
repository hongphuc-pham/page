import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))

/**
 * GitHub Pages is static hosting with no Node server, so this is a static
 * export. `next build` writes ./out — there is no `next start`.
 *
 * BASE PATH. A GitHub *project* page is served from a sub-path
 * (https://<user>.github.io/<repo>/), not the domain root, so every asset URL
 * needs that prefix or the deployed site loads a blank page with 404s for all
 * of /_next/*. Set NEXT_PUBLIC_BASE_PATH at build time; leave it empty for
 * local dev and for a user/organisation page served from the root.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,

	output: 'export',
	basePath,
	// Without this every route is /about -> /about.html and GitHub Pages'
	// implicit-index behaviour gets inconsistent between the root and nested
	// routes. Trailing slashes make it emit real index.html files.
	trailingSlash: true,

	images: {
		// The export target has no image optimisation server. The page uses
		// plain <img> for the third-party screenshots anyway, but this keeps
		// next/image from failing the build if it is ever introduced.
		unoptimized: true,
	},

	/**
	 * This app lives inside a repo that has its own lockfile at the root (the
	 * Vite site). Next walks up looking for a workspace root, finds that one,
	 * and traces the entire parent repo into the build output. Pinning the
	 * root here keeps the trace to this directory.
	 */
	outputFileTracingRoot: here,

	/**
	 * The dev server runs inside WSL while the files live on the Windows side
	 * (/mnt/c). inotify does not fire for Windows-side writes, so the default
	 * watcher never sees an edit: the page keeps serving stale modules and
	 * Fast Refresh appears to work while changing nothing. Poll instead.
	 *
	 * Costs a little idle CPU, which is why node_modules is excluded — polling
	 * that over the 9p mount is what makes the whole VM crawl.
	 *
	 * The Vite app at the repo root needs the same thing (server.watch.usePolling).
	 */
	webpack: (config, { dev }) => {
		if (dev) {
			config.watchOptions = {
				poll: 800,
				aggregateTimeout: 300,
				ignored: ['**/node_modules/**', '**/.next/**', '**/.git/**'],
			}
		}
		return config
	},
}

export default nextConfig
