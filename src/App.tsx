import { RouterProvider } from 'react-router-dom'
import { GrainOverlay } from './components/GrainOverlay'
import { ThemeToggle } from './components/ThemeToggle'
import { router } from './router'

export function App() {
	return (
		<>
			<GrainOverlay />
			<ThemeToggle />
			<RouterProvider router={router} />
		</>
	)
}
