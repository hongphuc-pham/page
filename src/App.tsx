import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { PainterlyBackground } from './components/PainterlyBackground'

export function App() {
	return (
		<>
			<PainterlyBackground />
			<RouterProvider router={router} />
		</>
	)
}
