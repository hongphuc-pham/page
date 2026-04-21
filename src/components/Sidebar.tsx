import { Avatar, Box, Button, Divider, IconButton, Link, Stack, Tooltip, Typography } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import LocationOnIcon from '@mui/icons-material/FmdGoodOutlined'
import EmailIcon from '@mui/icons-material/EmailOutlined'
import PhoneIcon from '@mui/icons-material/PhoneOutlined'
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import site from '../config/site'
import avatar from '../assets/ava.jpg'
import resume from '../assets/Phuc_Pham-CV-0401766596.docx'
import { fonts, tokens } from '../theme'
import { SectionNav } from './SectionNav'
import { MascotToon } from './MascotToon'

export function Sidebar() {
	const copyEmail = async () => {
		try {
			await navigator.clipboard.writeText(site.email)
		} catch {
			// ignored
		}
	}

	return (
		<Box
			sx={{
				width: { xs: '100%', md: 300 },
				flexShrink: 0,
				position: { md: 'sticky' },
				top: 0,
				height: { md: '100dvh' },
				p: { xs: 2, md: 2.5 },
				borderRight: { md: `1px solid ${tokens.line}` },
				backgroundColor: 'rgba(7,10,18,0.62)',
				backdropFilter: 'blur(18px) saturate(140%)',
				WebkitBackdropFilter: 'blur(18px) saturate(140%)',
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				overflowY: { md: 'auto' },
			}}
		>
			<Box
				sx={{
					p: 2.5,
					border: `1px solid ${tokens.line}`,
					borderRadius: 2.5,
					bgcolor: tokens.surface,
					display: 'flex',
					flexDirection: 'column',
					gap: 1.75,
					flexShrink: 0,
				}}
			>
				<Stack direction="row" alignItems="center" spacing={2}>
					<Box sx={{ position: 'relative' }}>
						<Avatar
							src={avatar}
							alt={site.name}
							sx={{
								width: 64,
								height: 64,
								border: `2px solid ${tokens.primary}`,
								boxShadow: '0 0 0 4px rgba(124,231,255,0.12)',
							}}
						>
							PP
						</Avatar>
						<Box
							sx={{
								position: 'absolute',
								bottom: 2,
								right: 2,
								width: 12,
								height: 12,
								borderRadius: '50%',
								bgcolor: tokens.lime,
								border: `2px solid ${tokens.surface}`,
							}}
						/>
					</Box>
					<Box sx={{ minWidth: 0 }}>
						<Typography sx={{ fontFamily: fonts.display, fontSize: 17, fontWeight: 600, lineHeight: 1.15 }}>
							{site.name}
						</Typography>
						<Typography sx={{ color: tokens.text.secondary, fontSize: 13 }}>{site.role}</Typography>
						<Typography
							sx={{
								color: tokens.text.muted,
								fontFamily: fonts.mono,
								fontSize: 10,
								mt: 0.25,
								letterSpacing: '0.06em',
							}}
						>
							{site.subRole}
						</Typography>
					</Box>
				</Stack>

				<Stack
					direction="row"
					alignItems="center"
					spacing={0.75}
					sx={{
						px: 1.25,
						py: 0.6,
						borderRadius: 999,
						border: `1px solid rgba(198,255,61,0.3)`,
						bgcolor: 'rgba(198,255,61,0.06)',
						alignSelf: 'flex-start',
					}}
				>
					<FiberManualRecordIcon sx={{ fontSize: 8, color: tokens.lime }} />
					<Typography sx={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: '0.08em', color: tokens.text.primary }}>
						AVAILABLE FOR WORK
					</Typography>
				</Stack>

				<Stack spacing={0.75}>
					<MetaRow icon={<LocationOnIcon sx={{ fontSize: 15 }} />} text={site.location} />
					<MetaRow
						icon={<EmailIcon sx={{ fontSize: 15 }} />}
						text={site.email}
						action={
							<Tooltip title="Copy email">
								<IconButton size="small" onClick={copyEmail} sx={{ color: tokens.text.muted }}>
									<ContentCopyIcon sx={{ fontSize: 14 }} />
								</IconButton>
							</Tooltip>
						}
					/>
					<MetaRow icon={<PhoneIcon sx={{ fontSize: 15 }} />} text={site.phone} />
				</Stack>

				<Stack direction="row" spacing={0.5} alignItems="center">
					<IconButton
						component={Link}
						href={site.socials.github}
						target="_blank"
						rel="noreferrer"
						aria-label="GitHub"
						sx={{ color: tokens.text.secondary, '&:hover': { color: tokens.primary } }}
					>
						<GitHubIcon fontSize="small" />
					</IconButton>
					<IconButton
						component={Link}
						href={site.socials.linkedin}
						target="_blank"
						rel="noreferrer"
						aria-label="LinkedIn"
						sx={{ color: tokens.text.secondary, '&:hover': { color: tokens.primary } }}
					>
						<LinkedInIcon fontSize="small" />
					</IconButton>
					<Box sx={{ flex: 1 }} />
					<Button
						variant="contained"
						color="primary"
						startIcon={<DescriptionIcon />}
						component={Link}
						href={resume}
						target="_blank"
						rel="noreferrer"
						download
						size="small"
					>
						CV
					</Button>
				</Stack>
			</Box>

			<Divider sx={{ borderColor: tokens.line, display: { xs: 'none', md: 'block' } }} />

			<Box sx={{ display: { xs: 'none', md: 'block' } }}>
				<SectionNav />
			</Box>

			<Box
				sx={{
					mt: 'auto',
					display: { xs: 'none', md: 'flex' },
					alignItems: 'flex-end',
					justifyContent: 'space-between',
					pt: 1,
					gap: 1,
				}}
			>
				<MascotToon />
				<Box
					sx={{
						fontFamily: fonts.mono,
						fontSize: 9,
						color: tokens.text.muted,
						letterSpacing: '0.14em',
						textTransform: 'uppercase',
						textAlign: 'right',
						pb: 0.5,
					}}
				>
					<Box component="span" sx={{ color: tokens.primary }}>v0.2</Box>
					<Box component="div">react · mui</Box>
				</Box>
			</Box>
		</Box>
	)
}

function MetaRow({ icon, text, action }: { icon: React.ReactNode; text: string; action?: React.ReactNode }) {
	return (
		<Stack direction="row" alignItems="center" spacing={1}>
			<Box sx={{ color: tokens.text.muted, display: 'flex' }}>{icon}</Box>
			<Typography sx={{ fontSize: 13, color: tokens.text.secondary, flex: 1, wordBreak: 'break-word' }}>
				{text}
			</Typography>
			{action}
		</Stack>
	)
}
