import { useEffect, useState } from 'react'
import type { ThemeMode } from '../theme'

function readMode(): ThemeMode {
	if (typeof document === 'undefined') return 'dark'
	return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

/** Tracks the active data-theme attribute set by ThemeToggle. */
export function useThemeMode(): ThemeMode {
	const [mode, setMode] = useState<ThemeMode>(readMode)
	useEffect(() => {
		const obs = new MutationObserver(() => setMode(readMode()))
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
		return () => obs.disconnect()
	}, [])
	return mode
}
