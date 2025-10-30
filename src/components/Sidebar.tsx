import { Avatar, Box, Button, Divider, IconButton, Link, Paper, Stack, Tooltip, Typography } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import site from '../config/site'
import avatar from '../assets/ava.jpg'
import DescriptionIcon from '@mui/icons-material/Description'
import resume from '../assets/Phuc_Pham-CV-0401766596.docx'

export function Sidebar() {
	const copyEmail = async () => {
		try {
			await navigator.clipboard.writeText(site.email)
			// eslint-disable-next-line no-alert
			alert('Email copied to clipboard')
		} catch {
			// eslint-disable-next-line no-alert
			alert('Copy failed')
		}
	}

	return (
		<Box sx={{
			width: { xs: '100%', md: 280 },
			flexShrink: 0,
			position: { md: 'sticky' },
			top: 0,
			height: { md: '100dvh' },
			p: { xs: 1.5, md: 2 },
			borderRight: { md: '1px solid rgba(255,255,255,0.06)' },
			backgroundColor: 'background.default',
		}}>
			<Paper elevation={0} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
				<Stack alignItems="center" spacing={1}>
					<Avatar src={avatar} alt={site.name} sx={{ width: 96, height: 96, bgcolor: 'primary.main', fontSize: 36 }}>PP</Avatar>
					<Typography variant="h6">{site.name}</Typography>
					<Typography variant="body2" color="text.secondary">{site.role}</Typography>
					<Typography variant="body2" color="text.secondary">{site.location}</Typography>
				</Stack>
				<Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
				<Stack spacing={0.5}>
					<Stack direction="row" alignItems="center" spacing={1}>
						<Typography variant="body2">{site.email}</Typography>
						<Tooltip title="Copy email">
							<IconButton size="small" onClick={copyEmail}>
								<ContentCopyIcon fontSize="inherit" />
							</IconButton>
						</Tooltip>
					</Stack>
					<Typography variant="body2">{site.phone}</Typography>
					<Stack direction="row" spacing={1} justifyContent="center">
						<IconButton component={Link} href={site.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
							<GitHubIcon />
						</IconButton>
						<IconButton component={Link} href={site.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
							<LinkedInIcon />
						</IconButton>
					</Stack>
				</Stack>
				<Button
					variant="outlined"
					startIcon={<DescriptionIcon />}
					component={Link}
					href={resume}
					target="_blank"
					rel="noreferrer"
					download
				>
					Resume
				</Button>
			</Paper>
		</Box>
	)
}
