import { Box, LinearProgress, Stack, Typography } from '@mui/material'

export function SkillBars({ bars }: { bars: { name: string; value: number }[] }) {
	return (
		<Stack spacing={2}>
			{bars.map((b) => (
				<Box key={b.name}>
					<Stack direction="row" justifyContent="space-between" mb={0.5}>
						<Typography variant="body2">{b.name}</Typography>
						<Typography variant="body2" color="text.secondary">{b.value}%</Typography>
					</Stack>
					<LinearProgress variant="determinate" value={b.value} />
				</Box>
			))}
		</Stack>
	)
}
