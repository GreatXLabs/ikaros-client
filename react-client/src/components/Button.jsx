import './Button.css'

export function Button({ label, color }) {
  const colorClass = color ? `button-${color}` : ''

  return (
    <button className={`button ${colorClass}`}>
      <p>{label}</p>
    </button>
  )
}
