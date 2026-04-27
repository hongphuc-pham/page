import { useEffect, useState, useCallback } from 'react'
import { Box, Tooltip } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightModeOutlined'
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined'
import { fonts, tokens, type ThemeMode } from '../theme'

const STORAGE_KEY = 'phuc.theme'

function getInitialMode(): ThemeMode {
	if (typeof window === 'undefined') return 'dark'
	const saved = window.localStorage.getItem(STORAGE_KEY)
	if (saved === 'light' || saved === 'dark') return saved
	return 'dark'
}

function applyMode(mode: ThemeMode) {
	if (typeof document === 'undefined') return
	document.documentElement.dataset.theme = mode
	document.documentElement.style.colorScheme = mode
	const meta = document.querySelector('meta[name="theme-color"]')
	if (meta) {
		meta.setAttribute('content', mode === 'dark' ? '#0A0D14' : '#F6F7FA')
	}
}

export function ThemeToggle() {
	const [mode, setMode] = useState<ThemeMode>(() => getInitialMode())

	useEffect(() => {
		applyMode(mode)
		try {
			window.localStorage.setItem(STORAGE_KEY, mode)
		} catch {
			// quota or privacy mode — ignore
		}
	}, [mode])

	const toggle = useCallback(() => {
		setMode((m) => (m === 'dark' ? 'light' : 'dark'))
	}, [])

	const isDark = mode === 'dark'
	const Icon = isDark ? LightModeIcon : DarkModeIcon
	const label = isDark ? 'Switch to light theme' : 'Switch to dark theme'

	return (
		<Box
			sx={{
				position: 'fixed',
				top: { xs: 12, md: 18 },
				right: { xs: 12, md: 18 },
				zIndex: 20,
				display: 'flex',
				alignItems: 'center',
				gap: 0.75,
				px: 1.25,
				py: 0.6,
				borderRadius: 999,
				bgcolor: 'var(--toggle-pill-bg)',
				border: `1px solid ${tokens.line}`,
				backdropFilter: 'blur(16px) saturate(140%)',
				WebkitBackdropFilter: 'blur(16px) saturate(140%)',
				transition: 'background-color 200ms ease, border-color 200ms ease',
			}}
		>
			<Tooltip title={label} arrow>
				<Box
					component="button"
					type="button"
					onClick={toggle}
					aria-label={label}
					aria-pressed={isDark}
					sx={{
						all: 'unset',
						cursor: 'pointer',
						display: 'inline-flex',
						alignItems: 'center',
						gap: 0.75,
						px: 0.5,
						py: 0.5,
						borderRadius: 999,
						color: tokens.text.primary,
						transition: 'color 160ms ease',
						'&:hover': { color: tokens.primary },
						'&:focus-visible': {
							outline: `2px solid ${tokens.primary}`,
							outlineOffset: 2,
						},
					}}
				>
					<Icon sx={{ fontSize: 18 }} />
					<Box
						component="span"
						sx={{
							fontFamily: fonts.mono,
							fontSize: 11,
							letterSpacing: '0.16em',
							textTransform: 'uppercase',
							display: { xs: 'none', sm: 'inline' },
						}}
					>
						{isDark ? 'Light' : 'Dark'}
					</Box>
				</Box>
			</Tooltip>
		</Box>
	)
}
