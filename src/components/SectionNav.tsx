import { Box, Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { SECTIONS } from '../config/sections'
import { fonts, tokens } from '../theme'

export function SectionNav() {
	const [active, setActive] = useState<string>(SECTIONS[0].id)
	const clickLockRef = useRef<number | null>(null)

	useEffect(() => {
		const els = SECTIONS
			.map((s) => document.getElementById(s.id))
			.filter((el): el is HTMLElement => Boolean(el))
		if (els.length === 0) return

		const visibility = new Map<string, number>()
		const obs = new IntersectionObserver(
			(entries) => {
				if (clickLockRef.current && Date.now() < clickLockRef.current) return
				entries.forEach((e) => visibility.set(e.target.id, e.intersectionRatio))
				let bestId = SECTIONS[0].id
				let bestRatio = -1
				visibility.forEach((ratio, id) => {
					if (ratio > bestRatio) {
						bestRatio = ratio
						bestId = id
					}
				})
				if (bestRatio > 0) setActive(bestId)
			},
			{ rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.15, 0.35, 0.65, 1] },
		)
		els.forEach((el) => obs.observe(el))
		return () => obs.disconnect()
	}, [])

	const go = (id: string) => {
		const el = document.getElementById(id)
		if (!el) return
		setActive(id)
		clickLockRef.current = Date.now() + 700
		el.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}

	return (
		<Stack spacing={0.25} sx={{ py: 0.5 }}>
			<Typography
				sx={{
					fontFamily: fonts.mono,
					fontSize: 10,
					letterSpacing: '0.18em',
					color: tokens.text.muted,
					textTransform: 'uppercase',
					mb: 1,
					pl: 1.5,
				}}
			>
				// navigate
			</Typography>
			{SECTIONS.map((s) => {
				const isActive = s.id === active
				return (
					<Box
						key={s.id}
						component="button"
						type="button"
						onClick={() => go(s.id)}
						aria-current={isActive ? 'true' : undefined}
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1.25,
							px: 1.25,
							py: 0.9,
							borderRadius: 1.25,
							bgcolor: isActive ? 'rgba(124,231,255,0.06)' : 'transparent',
							border: 'none',
							cursor: 'pointer',
							color: 'inherit',
							textAlign: 'left',
							width: '100%',
							transition: 'background 160ms ease',
							'&:hover': { bgcolor: 'rgba(124,231,255,0.08)' },
							'&:focus-visible': {
								outline: `2px solid ${tokens.primary}`,
								outlineOffset: 2,
							},
						}}
					>
						<Box
							sx={{
								width: isActive ? 22 : 10,
								height: 2,
								borderRadius: 2,
								bgcolor: isActive ? tokens.primary : tokens.line,
								transition: 'width 220ms ease, background 220ms ease',
								flexShrink: 0,
							}}
						/>
						<Typography
							sx={{
								fontFamily: fonts.mono,
								fontSize: 10,
								color: isActive ? tokens.primary : tokens.text.muted,
								letterSpacing: '0.14em',
								width: 20,
							}}
						>
							{s.num}
						</Typography>
						<Typography
							sx={{
								fontSize: 13,
								color: isActive ? tokens.text.primary : tokens.text.secondary,
								fontWeight: isActive ? 600 : 500,
								transition: 'color 160ms ease',
							}}
						>
							{s.label}
						</Typography>
					</Box>
				)
			})}
		</Stack>
	)
}
