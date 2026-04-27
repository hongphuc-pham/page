import { Box, Stack, Typography } from '@mui/material'
import { fonts, tokens } from '../theme'

export interface TimelineItem {
	range?: string
	title: string
	org?: string
	location?: string
	achievements?: string[]
	responsibilities?: string[]
	projects?: string[]
	awards?: string[]
}

export function Timeline({ items }: { items: TimelineItem[] }) {
	return (
		<Stack spacing={0}>
			{items.map((it, idx) => (
				<Box
					key={idx}
					sx={{
						position: 'relative',
						pl: { xs: 3, md: 4 },
						pb: idx < items.length - 1 ? 4 : 0,
						borderLeft: `1px solid ${tokens.line}`,
					}}
				>
					<Box
						sx={{
							position: 'absolute',
							left: -5,
							top: 6,
							width: 10,
							height: 10,
							borderRadius: '50%',
							bgcolor: tokens.primary,
							boxShadow: '0 0 0 4px rgba(124,231,255,0.12)',
						}}
					/>

					{it.range && (
						<Typography
							sx={{
								fontFamily: fonts.mono,
								fontSize: 11,
								letterSpacing: '0.14em',
								color: tokens.text.muted,
								textTransform: 'uppercase',
								mb: 0.5,
							}}
						>
							{it.range}
						</Typography>
					)}
					<Typography sx={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 18, color: tokens.text.primary }}>
						{it.title}
					</Typography>
					{(it.org || it.location) && (
						<Typography variant="body2" sx={{ color: tokens.text.secondary, mb: 1.25 }}>
							{[it.org, it.location].filter(Boolean).join(' · ')}
						</Typography>
					)}

					{it.achievements && it.achievements.length > 0 && (
						<BulletList label="Highlights" items={it.achievements} accent />
					)}
					{it.responsibilities && it.responsibilities.length > 0 && (
						<BulletList label="What I did" items={it.responsibilities} />
					)}
					{it.projects && it.projects.length > 0 && (
						<BulletList label="Projects" items={it.projects} />
					)}
					{it.awards && it.awards.length > 0 && (
						<BulletList label="Awards" items={it.awards} />
					)}
				</Box>
			))}
		</Stack>
	)
}

function BulletList({ label, items, accent }: { label: string; items: string[]; accent?: boolean }) {
	return (
		<Box sx={{ mt: 1.5 }}>
			<Typography
				sx={{
					fontFamily: fonts.mono,
					fontSize: 10,
					letterSpacing: '0.14em',
					textTransform: 'uppercase',
					color: accent ? tokens.primary : tokens.text.muted,
					mb: 0.75,
				}}
			>
				{label}
			</Typography>
			<Stack spacing={0.75} component="ul" sx={{ m: 0, pl: 0, listStyle: 'none' }}>
				{items.map((line, i) => (
					<Stack
						key={i}
						direction="row"
						spacing={1.25}
						component="li"
						sx={{ alignItems: 'flex-start', m: 0 }}
					>
						<Box
							sx={{
								flexShrink: 0,
								fontSize: 14,
								height: '1.65em',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								width: 10,
							}}
						>
							<Box
								sx={{
									width: 5,
									height: 5,
									borderRadius: '50%',
									bgcolor: accent ? tokens.primary : tokens.text.muted,
								}}
							/>
						</Box>
						<Typography variant="body2" sx={{ color: tokens.text.secondary, lineHeight: 1.65, flex: 1 }}>
							{line}
						</Typography>
					</Stack>
				))}
			</Stack>
		</Box>
	)
}
