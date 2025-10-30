import { createHashRouter, Outlet, ScrollRestoration } from 'react-router-dom'
import { Box, Container } from '@mui/material'
import { Sidebar } from './components/Sidebar'
import { Home } from './pages/Home'

function Layout() {
	return (
		<Box sx={{ display: 'flex', width: '100%' }}>
			<Sidebar />
			<Box sx={{ flex: 1, minWidth: 0 }}>
				<Container maxWidth="lg" sx={{ py: 3 }}>
					<Outlet />
				</Container>
			</Box>
			<ScrollRestoration />
		</Box>
	)
}

export const router = createHashRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{ index: true, element: <Home /> },
		],
	},
])
