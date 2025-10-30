import { Tab, Tabs, Paper } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

const tabs = [
	{ label: 'About', value: '/about' },
	{ label: 'Resume', value: '/resume' },
	{ label: 'Portfolio', value: '/portfolio' },
	{ label: 'Blog', value: '/blog' },
	{ label: 'Contact', value: '/contact' },
]

export function TopTabs() {
	const location = useLocation()
	const navigate = useNavigate()
	const current = tabs.find((t) => location.pathname.startsWith(t.value))?.value || '/about'

	return (
		<Paper elevation={0} sx={{ px: 2, bgcolor: 'background.paper', borderRadius: 0 }}>
			<Tabs value={current} onChange={(_, v) => navigate(v)} aria-label="Top navigation tabs" variant="scrollable" scrollButtons allowScrollButtonsMobile>
				{tabs.map((t) => (
					<Tab key={t.value} value={t.value} label={t.label} sx={{ minHeight: 48 }} />
				))}
			</Tabs>
		</Paper>
	)
}
