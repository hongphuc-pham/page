import { Box, Grid, Paper, Stack, Typography } from '@mui/material'
import site from '../config/site'
import { ContactForm } from '../components/ContactForm'

export function Contact() {
	return (
		<Grid container spacing={2}>
			<Grid item xs={12} md={5}>
				<Paper sx={{ p: 2 }}>
					<Stack spacing={1}>
						<Typography variant="h6">Contact</Typography>
						<Typography color="text.secondary">{site.email}</Typography>
						<Typography color="text.secondary">{site.phone}</Typography>
						<Box sx={{ mt: 2, borderRadius: 2, bgcolor: 'background.default', height: 200, border: '1px solid rgba(255,255,255,0.06)' }} />
					</Stack>
				</Paper>
			</Grid>
			<Grid item xs={12} md={7}>
				<Paper sx={{ p: 2 }}>
					<Typography variant="h6" gutterBottom>Send a message</Typography>
					<ContactForm />
				</Paper>
			</Grid>
		</Grid>
	)
}
