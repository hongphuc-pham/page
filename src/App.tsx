import { Box } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

export function App() {
	return (
		<Box sx={{ display: 'flex', minHeight: '100dvh', bgcolor: 'background.default' }}>
			<RouterProvider router={router} />
		</Box>
	)
}
