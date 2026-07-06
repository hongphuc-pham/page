import { Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
import { chapters } from '../data/cv'
import { scrollToSection } from '../lib/lenis'
import { scrollProgress, SCENE_COUNT } from '../scene/useScrollProgress'
import { tokens } from '../theme'

/**
 * Right-edge chapter navigation — one dot per beat, labels on hover.
 * Plain div/button chrome (not MUI Box) to keep the sx-union type light.
 */
export function ChapterDots() {
	const [active, setActive] = useState(0)

	useEffect(() => {
		let raf = 0
		const loop = () => {
			const idx = Math.min(SCENE_COUNT - 1, Math.floor(scrollProgress.value * SCENE_COUNT))
			setActive((a) => (a === idx ? a : idx))
			raf = requestAnimationFrame(loop)
		}
		raf = requestAnimationFrame(loop)
		return () => cancelAnimationFrame(raf)
	}, [])

	return (
		<nav
			aria-label="Chapters"
			style={{
				position: 'fixed',
				right: 16,
				top: '50%',
				transform: 'translateY(-50%)',
				zIndex: 20,
				display: 'flex',
				flexDirection: 'column',
				gap: 14,
			}}
		>
			{chapters.map((c, i) => {
				const on = active === i
				return (
					<Tooltip key={c.id} title={c.label} placement="left" arrow>
						<button
							type="button"
							className="chrome-btn"
							aria-label={`Go to ${c.label}`}
							aria-current={on ? 'true' : undefined}
							onClick={() => scrollToSection(c.id)}
							style={{ width: 22, height: 22, display: 'grid', placeItems: 'center' }}
						>
							<span
								style={{
									width: on ? 10 : 7,
									height: on ? 10 : 7,
									borderRadius: '50%',
									background: on ? tokens.primary : tokens.text.muted,
									opacity: on ? 1 : 0.5,
									boxShadow: on ? `0 0 0 4px ${tokens.primaryGlow}` : 'none',
									transition: 'all 220ms ease',
								}}
							/>
						</button>
					</Tooltip>
				)
			})}
		</nav>
	)
}
