import { Box, Stack, Typography } from '@mui/material'

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
		<Stack spacing={3}>
			{items.map((it, idx) => (
				<Box key={idx} sx={{ position: 'relative', pl: 3 }}>
					<Box sx={{ position: 'absolute', left: 0, top: 6, width: 10, height: 10, bgcolor: 'primary.main', borderRadius: '50%' }} />
					<Typography fontWeight={600}>{it.title}</Typography>
					<Typography variant="body2" color="text.secondary">{[it.org, it.location].filter(Boolean).join(' — ')}</Typography>
					{it.range && (
						<Typography variant="caption" color="text.secondary">{it.range}</Typography>
					)}
					{it.projects && it.projects.length > 0 && (
						<Box sx={{ mt: 1 }}>
							<Typography variant="subtitle2">Projects</Typography>
							<ul>
								{it.projects.map((p, i) => (
									<li key={i}><Typography variant="body2">{p}</Typography></li>
								))}
							</ul>
						</Box>
					)}
					{it.achievements && it.achievements.length > 0 && (
						<Box sx={{ mt: 1 }}>
							<Typography variant="subtitle2">Achievements</Typography>
							<ul>
								{it.achievements.map((p, i) => (
									<li key={i}><Typography variant="body2">{p}</Typography></li>
								))}
							</ul>
						</Box>
					)}
					{it.responsibilities && it.responsibilities.length > 0 && (
						<Box sx={{ mt: 1 }}>
							<Typography variant="subtitle2">Responsibilities</Typography>
							<ul>
								{it.responsibilities.map((p, i) => (
									<li key={i}><Typography variant="body2">{p}</Typography></li>
								))}
							</ul>
						</Box>
					)}
					{it.awards && it.awards.length > 0 && (
						<Box sx={{ mt: 1 }}>
							<Typography variant="subtitle2">Awards</Typography>
							<ul>
								{it.awards.map((p, i) => (
									<li key={i}><Typography variant="body2">{p}</Typography></li>
								))}
							</ul>
						</Box>
					)}
				</Box>
			))}
		</Stack>
	)
}
