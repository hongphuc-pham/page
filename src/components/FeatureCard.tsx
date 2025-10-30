import { Box, Typography } from '@mui/material'
import * as Icons from '@mui/icons-material'

export function FeatureCard({ icon, title, text }: { icon: keyof typeof Icons; title: string; text: string }) {
	const Icon = Icons[icon] ?? Icons.Api
	return (
		<Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid rgba(255,255,255,0.06)' }}>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
				<Icon sx={{ color: 'primary.main' }} />
				<Typography fontWeight={600}>{title}</Typography>
			</Box>
			<Typography variant="body2" color="text.secondary">{text}</Typography>
		</Box>
	)
}
