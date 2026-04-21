import { Box, Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { SECTIONS } from '../config/sections'
import { fonts, tokens } from '../theme'
import { useElementCursor } from '../utils/useCursor'

export function SectionNav() {
	const [active, setActive] = useState<string>(SECTIONS[0].id)
	const clickLockRef = useRef<number | null>(null)
	const wrapRef = useRef<HTMLDivElement | null>(null)
	const cursor = useElementCursor(wrapRef)

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
			{ rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.2, 0.5, 0.8, 1] },
		)
		els.forEach((el) => obs.observe(el))
		return () => obs.disconnect()
	}, [])

	const go = (id: string) => {
		const el = document.getElementById(id)
		if (!el) return
		setActive(id)
		clickLockRef.current = Date.now() + 800
		el.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}

	return (
		<Box
			ref={wrapRef}
			sx={{
				position: 'relative',
				p: 1,
				borderRadius: 2,
				overflow: 'hidden',
			}}
		>
			<Box
				aria-hidden
				sx={{
					position: 'absolute',
					inset: 0,
					pointerEvents: 'none',
					opacity: cursor.inside ? 1 : 0,
					transition: 'opacity 220ms ease',
					background: cursor.inside
						? `radial-gradient(180px 180px at ${cursor.x}px ${cursor.y}px, rgba(124,231,255,0.18), transparent 60%)`
						: 'transparent',
				}}
			/>

			<Typography
				sx={{
					position: 'relative',
					fontFamily: fonts.mono,
					fontSize: 10,
					letterSpacing: '0.2em',
					color: tokens.text.muted,
					textTransform: 'uppercase',
					mb: 1.25,
					pl: 1.5,
				}}
			>
				<Box component="span" sx={{ color: tokens.primary }}>//</Box> navigate
			</Typography>

			<Stack spacing={0.25} sx={{ position: 'relative' }}>
				{SECTIONS.map((s) => (
					<NavRow key={s.id} id={s.id} label={s.label} num={s.num} active={s.id === active} onClick={() => go(s.id)} />
				))}
			</Stack>
		</Box>
	)
}

function NavRow({
	id,
	label,
	num,
	active,
	onClick,
}: {
	id: string
	label: string
	num: string
	active: boolean
	onClick: () => void
}) {
	const rowRef = useRef<HTMLButtonElement | null>(null)
	const [hover, setHover] = useState(false)

	return (
		<Box
			ref={rowRef}
			component="button"
			type="button"
			onClick={onClick}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			aria-current={active ? 'true' : undefined}
			aria-label={`Jump to ${label} section`}
			data-target={id}
			sx={{
				position: 'relative',
				display: 'flex',
				alignItems: 'center',
				gap: 1.25,
				px: 1.25,
				py: 1,
				borderRadius: 1.5,
				border: `1px solid ${active ? 'rgba(124,231,255,0.25)' : 'transparent'}`,
				background: active
					? 'linear-gradient(90deg, rgba(124,231,255,0.12), rgba(198,255,61,0.04) 60%, transparent)'
					: hover
					? 'rgba(124,231,255,0.05)'
					: 'transparent',
				cursor: 'pointer',
				color: 'inherit',
				textAlign: 'left',
				width: '100%',
				transition: 'background 220ms ease, border-color 220ms ease, transform 180ms ease',
				transform: hover && !active ? 'translateX(2px)' : 'translateX(0)',
				'&:focus-visible': {
					outline: `2px solid ${tokens.primary}`,
					outlineOffset: 2,
				},
			}}
		>
			<Box
				aria-hidden
				sx={{
					width: active ? 22 : hover ? 14 : 8,
					height: 2,
					borderRadius: 2,
					background: active ? tokens.gradient : hover ? tokens.primary : tokens.line,
					transition: 'width 260ms cubic-bezier(.4,.0,.2,1), background 220ms ease',
					flexShrink: 0,
				}}
			/>

			<Typography
				component="span"
				sx={{
					fontFamily: fonts.mono,
					fontSize: 10,
					letterSpacing: '0.14em',
					color: active ? 'transparent' : tokens.text.muted,
					background: active ? tokens.gradient : 'none',
					WebkitBackgroundClip: active ? 'text' : 'unset',
					WebkitTextFillColor: active ? 'transparent' : 'inherit',
					width: 20,
					fontWeight: active ? 700 : 500,
					transition: 'color 220ms ease',
				}}
			>
				{num}
			</Typography>

			<Typography
				component="span"
				sx={{
					fontSize: 13,
					color: active ? tokens.text.primary : hover ? tokens.text.primary : tokens.text.secondary,
					fontWeight: active ? 600 : 500,
					flex: 1,
					transition: 'color 180ms ease',
				}}
			>
				{label}
			</Typography>

			{active && (
				<Box
					aria-hidden
					sx={{
						width: 6,
						height: 6,
						borderRadius: '50%',
						bgcolor: tokens.primary,
						boxShadow: '0 0 0 4px rgba(124,231,255,0.18)',
					}}
				/>
			)}
		</Box>
	)
}
