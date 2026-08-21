/**
 * Prefix for anything served out of /public.
 *
 * Next rewrites its own asset URLs for `basePath`, and `<Link>` hrefs, but it
 * does NOT touch a plain `<a href="/file.pdf">`. On a GitHub project page that
 * resolves to https://user.github.io/file.pdf — the domain root — instead of
 * https://user.github.io/repo/file.pdf, and 404s. Wrap public-asset hrefs.
 *
 * Reads the same env var as next.config.mjs, so the two can never disagree.
 * Empty locally and on a root-served site, which makes withBase() a no-op there.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function withBase(assetPath: string): string {
	if (!assetPath.startsWith('/')) return assetPath
	return `${BASE}${assetPath}`
}

/** Where the CV lives. One constant, so header and footer cannot drift. */
export const CV_HREF = withBase('/Pham_HongPhuc_CV.pdf')
