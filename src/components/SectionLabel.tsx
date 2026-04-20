import { Box, Typography } from '@mui/material'
import { fonts, tokens } from '../theme'

export function SectionLabel({ index, title }: { index: string; title: string }) {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
			<Box sx={{ width: 28, height: 1, bgcolor: tokens.line }} />
			<Typography
				component="span"
				sx={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: '0.18em', color: tokens.primary }}
			>
				// {index}
			</Typography>
			<Typography
				component="span"
				sx={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: '0.14em', color: tokens.text.secondary, textTransform: 'uppercase' }}
			>
				{title}
			</Typography>
			<Box sx={{ flex: 1, height: 1, bgcolor: tokens.line }} />
		</Box>
	)
}
