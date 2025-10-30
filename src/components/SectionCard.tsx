import { Paper, PaperProps } from '@mui/material'

export function SectionCard(props: PaperProps) {
	return (
		<Paper elevation={0} {...props} sx={{ p: 2.5, ...props.sx }} />
	)
}
