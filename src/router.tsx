import { createHashRouter, Outlet, ScrollRestoration } from 'react-router-dom'
import { Box } from '@mui/material'
import { Sidebar } from './components/Sidebar'
import { Home } from './pages/Home'

function Layout() {
	return (
		<Box
			sx={{
				position: 'relative',
				zIndex: 1,
				display: 'flex',
				flexDirection: { xs: 'column', md: 'row' },
				width: '100%',
				minHeight: '100dvh',
			}}
		>
			<Sidebar />
			<Box
				component="main"
				sx={{
					flex: 1,
					minWidth: 0,
					px: { xs: 2.5, md: 6, lg: 8 },
					py: { xs: 3, md: 4 },
					maxWidth: 1200,
					width: '100%',
					mx: 'auto',
				}}
			>
				<Outlet />
			</Box>
			<ScrollRestoration />
		</Box>
	)
}

export const router = createHashRouter([
	{
		path: '/',
		element: <Layout />,
		children: [{ index: true, element: <Home /> }],
	},
])
