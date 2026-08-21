/**
 * The project's icon set — Phosphor, aliased to the names the call sites
 * already used so the swap stays a one-line import change per file.
 *
 * Why Phosphor over Material: Material's icons are drawn for Material's
 * filled, rounded language. This site is a thin-stroke HUD — corner brackets,
 * mono labels, hairline rules — and Phosphor's `bold`/`regular` stroke weights
 * sit in that language instead of fighting it.
 *
 * Why per-icon subpaths instead of the package root: importing from
 * '@phosphor-icons/react' pulls in a 190 KB barrel that re-exports every icon
 * in the set. Rollup does shake it (the package sets `sideEffects: false`), but
 * Vite's dev server still has to pre-bundle the whole barrel on every cold
 * start, and the subpaths make the production result independent of that
 * assumption. Each `dist/csr/*` module is ~300 bytes plus its own path defs.
 *
 * Note the `*Icon` suffix on the source names: the unsuffixed exports (`Sun`,
 * `X`, …) are deprecated in Phosphor 2.1, and these modules have no default
 * export.
 *
 * Sizing: Phosphor renders explicit `width`/`height` SVG attributes, so MUI's
 * `fontSize` styling does NOT affect it. Pass `size={n}` instead of
 * `sx={{ fontSize: n }}`. Project defaults come from the `IconContext`
 * provider in App.tsx.
 */
export { SpeakerSimpleSlashIcon as VolumeOffIcon } from '@phosphor-icons/react/dist/csr/SpeakerSimpleSlash'
export { SpeakerSimpleHighIcon as VolumeUpIcon } from '@phosphor-icons/react/dist/csr/SpeakerSimpleHigh'
export { SunIcon as LightModeIcon } from '@phosphor-icons/react/dist/csr/Sun'
export { MoonIcon as DarkModeIcon } from '@phosphor-icons/react/dist/csr/Moon'
export { ArrowUpRightIcon as NorthEastIcon } from '@phosphor-icons/react/dist/csr/ArrowUpRight'
export { ArrowsOutLineVerticalIcon as UnfoldMoreIcon } from '@phosphor-icons/react/dist/csr/ArrowsOutLineVertical'
export { XIcon as CloseIcon } from '@phosphor-icons/react/dist/csr/X'
export { CaretLeftIcon as ChevronLeftIcon } from '@phosphor-icons/react/dist/csr/CaretLeft'
export { CaretRightIcon as ChevronRightIcon } from '@phosphor-icons/react/dist/csr/CaretRight'
export { DotsThreeVerticalIcon as MoreVertIcon } from '@phosphor-icons/react/dist/csr/DotsThreeVertical'
export { DownloadSimpleIcon as DownloadIcon } from '@phosphor-icons/react/dist/csr/DownloadSimple'
export { EnvelopeSimpleIcon as EmailIcon } from '@phosphor-icons/react/dist/csr/EnvelopeSimple'
export { GithubLogoIcon as GitHubIcon } from '@phosphor-icons/react/dist/csr/GithubLogo'
export { LinkedinLogoIcon as LinkedInIcon } from '@phosphor-icons/react/dist/csr/LinkedinLogo'

/** Same reason as above: the root barrel would drag in every icon. */
export { IconContext } from '@phosphor-icons/react/dist/lib/context'
