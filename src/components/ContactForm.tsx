import { Alert, Button, Snackbar, Stack, TextField } from '@mui/material'
import { useState } from 'react'

export function ContactForm() {
	const [open, setOpen] = useState(false)
	const [values, setValues] = useState({ name: '', email: '', message: '' })
	const [errors, setErrors] = useState<{ [k: string]: string }>({})

	function validate() {
		const e: { [k: string]: string } = {}
		if (!values.name) e.name = 'Name is required'
		if (!values.email || !/^[^@]+@[^@]+\.[^@]+$/.test(values.email)) e.email = 'Valid email required'
		if (!values.message) e.message = 'Message is required'
		setErrors(e)
		return Object.keys(e).length === 0
	}

	function onSubmit(ev: React.FormEvent) {
		ev.preventDefault()
		if (!validate()) return
		setOpen(true)
		setValues({ name: '', email: '', message: '' })
	}

	return (
		<form onSubmit={onSubmit} noValidate>
			<Stack spacing={2}>
				<TextField label="Name" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} error={!!errors.name} helperText={errors.name} />
				<TextField label="Email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} error={!!errors.email} helperText={errors.email} />
				<TextField label="Message" value={values.message} onChange={(e) => setValues({ ...values, message: e.target.value })} error={!!errors.message} helperText={errors.message} minRows={4} multiline />
				<Button type="submit" variant="contained">Send</Button>
				<Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
					<Alert severity="success" onClose={() => setOpen(false)}>Message sent. Thanks!</Alert>
				</Snackbar>
			</Stack>
		</form>
	)
}
