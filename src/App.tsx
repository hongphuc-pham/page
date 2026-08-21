import { IconContext } from './components/icons'
import { RouterProvider } from 'react-router-dom'
import { GrainOverlay } from './components/GrainOverlay'
import { ThemeToggle } from './components/ThemeToggle'
import { router } from './router'

/**
 * Project-wide icon defaults. Everything on this site renders at 12–18px,
 * where Phosphor's `regular` stroke all but disappears against the background
 * film — `bold` is what keeps them legible at that scale. Call sites override
 * `size` per usage; see components/icons.tsx for the name mapping.
 */
const ICON_DEFAULTS = { size: 18, weight: 'bold' } as const

export function App() {
	return (
		<IconContext.Provider value={ICON_DEFAULTS}>
			<GrainOverlay />
			<ThemeToggle />
			<RouterProvider router={router} />
		</IconContext.Provider>
	)
}
