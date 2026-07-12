import './Button.css'

export function Button({ label, color, onClick, disabled }) {
	const colorClass = color ? `button-${color}` : ''

	return (
		<button className={`button ${colorClass} ${disabled ? 'button-disabled' : ''}`} onClick={onClick} disabled={disabled}>
			<p>{label}</p>
		</button>
	)
}
