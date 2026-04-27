import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { PainterlyBackground } from './components/PainterlyBackground'
import { ThemeToggle } from './components/ThemeToggle'

export function App() {
	return (
		<>
			<PainterlyBackground />
			<ThemeToggle />
			<RouterProvider router={router} />
		</>
	)
}
