/* eslint-disable react-refresh/only-export-components -- router-definition file exports the router, not a component */
import { createHashRouter, Outlet, ScrollRestoration } from 'react-router-dom'
import { Story } from './pages/Story'

function Layout() {
	return (
		<>
			<Outlet />
			<ScrollRestoration />
		</>
	)
}

export const router = createHashRouter([
	{
		path: '/',
		element: <Layout />,
		children: [{ index: true, element: <Story /> }],
	},
])
