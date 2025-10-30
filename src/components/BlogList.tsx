import { Paper, Stack, Typography } from '@mui/material'

export function BlogList({ posts }: { posts: { title: string; date?: string; excerpt?: string; link?: string }[] }) {
	if (!posts.length) {
		return (
			<Paper sx={{ p: 3 }}>
				<Typography color="text.secondary">No posts yet. Stay tuned.</Typography>
			</Paper>
		)
	}
	return (
		<Stack spacing={2}>
			{posts.map((p) => (
				<Paper key={p.title} sx={{ p: 2 }}>
					<Typography fontWeight={600}>{p.title}</Typography>
					{p.excerpt && (
						<Typography variant="body2" color="text.secondary">{p.excerpt}</Typography>
					)}
				</Paper>
			))}
		</Stack>
	)
}
