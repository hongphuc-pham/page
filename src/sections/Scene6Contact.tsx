import DownloadIcon from '@mui/icons-material/DownloadOutlined'
import EmailIcon from '@mui/icons-material/EmailOutlined'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import { Box, Button, Link, Stack, Typography } from '@mui/material'
import { useRef } from 'react'
import resumeDocx from '../assets/Phuc_Pham-CV-0401766596.docx'
import { Magnetic } from '../components/motion/Magnetic'
import { contact, cta } from '../data/cv'
import { fonts, tokens } from '../theme'
import { Body, Headline, Kicker, SceneShell } from './SceneShell'
import { useSceneTimeline } from './useSceneTimeline'

const LINK_ICONS = {
	email: EmailIcon,
	linkedin: LinkedInIcon,
	github: GitHubIcon,
} as const

/**
 * Beat 6 — CTA · scroll 0.833–1.00
 * Warm light returns, the shard settles. Real links, large tap targets —
 * no exit animation (it's the end of the film).
 */
export function Scene6Contact({ reduced, isMobile }: { reduced: boolean; isMobile: boolean }) {
	const root = useRef<HTMLElement>(null)

	useSceneTimeline(
		root,
		(tl, q) => {
			tl.fromTo(q('.line'), { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, stagger: 1.5, duration: 4 })
		},
		{ reduced, isMobile, length: 90, beat: 5 },
	)

	return (
		<SceneShell id="contact" rootRef={root}>
			<Box>
				<Kicker className="line">{cta.kicker}</Kicker>
				<Headline className="line">{cta.headline}</Headline>
				<Body className="line" maxWidth={460}>
					{cta.body}
				</Body>

				<Stack
					className="line"
					direction={{ xs: 'column', sm: 'row' }}
					spacing={1.5}
					justifyContent="flex-start"
					alignItems={{ xs: 'stretch', sm: 'center' }}
					flexWrap="wrap"
					useFlexGap
					sx={{ mt: 4 }}
				>
					{cta.links.map((l, i) => {
						const Icon = LINK_ICONS[l.kind]
						return (
							<Magnetic key={l.kind}>
								<Button
									variant={i === 0 ? 'contained' : 'outlined'}
									color="primary"
									size="large"
									component={Link}
									href={l.href}
									target={l.kind === 'email' ? undefined : '_blank'}
									rel={l.kind === 'email' ? undefined : 'noreferrer'}
									startIcon={<Icon />}
									// generous tap target for phones
									sx={{ width: { xs: '100%', sm: 'auto' }, py: 1.5, px: 3, fontSize: 15 }}
								>
									{l.label}
								</Button>
							</Magnetic>
						)
					})}
					<Magnetic>
						<Button
							variant="outlined"
							color="primary"
							size="large"
							component={Link}
							href={resumeDocx}
							download
							startIcon={<DownloadIcon />}
							sx={{ width: { xs: '100%', sm: 'auto' }, py: 1.5, px: 3, fontSize: 15 }}
						>
							CV
						</Button>
					</Magnetic>
				</Stack>

				<Typography
					className="line"
					sx={{
						mt: 5,
						fontFamily: fonts.mono,
						fontSize: 11,
						letterSpacing: '0.16em',
						textTransform: 'uppercase',
						color: tokens.text.muted,
					}}
				>
					{contact.location} · {contact.phone}
				</Typography>
				<Typography
					className="line"
					sx={{ mt: 1.5, fontFamily: fonts.mono, fontSize: 10, letterSpacing: '0.14em', color: tokens.text.muted }}
				>
					<Box component="span" sx={{ color: tokens.primary }}>
						v0.3
					</Box>{' '}
					· react · r3f · gsap
				</Typography>
			</Box>
		</SceneShell>
	)
}
