import VolumeOffIcon from '@mui/icons-material/VolumeOffOutlined'
import VolumeUpIcon from '@mui/icons-material/VolumeUpOutlined'
import { Tooltip } from '@mui/material'
import { useState } from 'react'
import { tokens } from '../theme'

/**
 * Audio control — STUB for v1.
 * TODO(audio): wire an ambient loop + scene-transition whoosh via the Web
 * Audio API (create on first unmute to satisfy autoplay policies; crossfade
 * gain nodes on beat boundaries from scene/useScrollProgress). Muted by
 * default; this control currently only toggles UI state.
 *
 * Plain button chrome (not MUI Box) to keep the sx-union type light.
 */
export function AudioToggle() {
	const [muted, setMuted] = useState(true)
	const Icon = muted ? VolumeOffIcon : VolumeUpIcon

	return (
		<Tooltip title={muted ? 'Sound (coming soon)' : 'Mute'} placement="left" arrow>
			<button
				type="button"
				className="chrome-btn audio-toggle"
				aria-label={muted ? 'Unmute ambient sound' : 'Mute ambient sound'}
				aria-pressed={!muted}
				onClick={() => setMuted((m) => !m)}
				style={{
					position: 'fixed',
					right: 16,
					bottom: 16,
					zIndex: 20,
					width: 40,
					height: 40,
					display: 'grid',
					placeItems: 'center',
					borderRadius: '50%',
					border: `1px solid ${tokens.line}`,
					background: 'var(--toggle-pill-bg)',
					backdropFilter: 'blur(12px)',
					color: tokens.text.secondary,
					transition: 'color 160ms ease, border-color 160ms ease',
				}}
			>
				<Icon sx={{ fontSize: 18 }} />
			</button>
		</Tooltip>
	)
}
