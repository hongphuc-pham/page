import { Box, Chip } from '@mui/material'
import { useRef } from 'react'
import { approach } from '../data/cv'
import { Body, Headline, Kicker, SceneShell } from './SceneShell'
import { useSceneTimeline } from './useSceneTimeline'

/**
 * Beat 4 — APPROACH · scroll 0.60–0.80
 * The stack chips FLY IN from scattered positions around the viewport,
 * settle into their row, and the whole scene scrubs out (disappears) as you
 * roll to the CTA — per the "fly around to the row, then disappear" note.
 * Scatter offsets are deterministic (index-hashed), no Math.random.
 */
export function Scene4Approach({ reduced, isMobile }: { reduced: boolean; isMobile: boolean }) {
	const root = useRef<HTMLElement>(null)

	useSceneTimeline(
		root,
		(tl, q) => {
			tl.fromTo(q('.line'), { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, stagger: 1.5, duration: 4 })
			const spreadX = isMobile ? 150 : 460
			const spreadY = isMobile ? 240 : 300
			q('.stack-chip').forEach((chip, i) => {
				tl.fromTo(
					chip,
					{
						x: Math.sin(i * 12.9898) * spreadX,
						y: Math.cos(i * 78.233) * spreadY,
						rotation: Math.sin(i * 3.7) * 40,
						autoAlpha: 0,
					},
					{ x: 0, y: 0, rotation: 0, autoAlpha: 1, duration: 3 },
					i === 0 ? '>-0.5' : '<0.6',
				)
			})
			tl.to(q('.scene-inner'), { autoAlpha: 0, y: -80, duration: 4 }, '+=3')
		},
		{ reduced, isMobile, length: 220 },
	)

	return (
		<SceneShell id="approach" rootRef={root}>
			<Kicker className="line">{approach.kicker}</Kicker>
			<Headline className="line">{approach.headline}</Headline>
			<Body className="line">{approach.body}</Body>

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, mt: 3, maxWidth: 640 }}>
				{approach.stack.map((item) => (
					<Chip key={item} label={item} className="stack-chip" sx={{ willChange: 'transform' }} />
				))}
			</Box>
		</SceneShell>
	)
}
