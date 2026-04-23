import './Button.css'

export function Button({ label, color, onClick }) {
	const colorClass = color ? `button-${color}` : ''

	return (
		<button className={`button ${colorClass}`} onClick={onClick}>
			<p>{label}</p>
		</button>
	)
}
