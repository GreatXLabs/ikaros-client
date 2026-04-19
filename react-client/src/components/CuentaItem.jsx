import './CuentaItem.css'

export function CuentaItem({ cuenta }) {
  const { UsuarioID, Nombre, Apellido, Clave, RolNombre } = cuenta

  // Ocultar contraseña mostrando solo los últimos 3-4 caracteres
  const formatClave = (clave) => {
    if (!clave) return '—'
    const len = clave.length
    const visibleChars = Math.min(4, len)
    const maskedLen = Math.max(3, len - visibleChars)
    return '*'.repeat(maskedLen) + clave.slice(-visibleChars)
  }

  return (
    <div className="cuenta-item">
      <span className="cuenta-cell cell-id">{UsuarioID}</span>
      <span className="cuenta-cell cell-nombre">{Nombre} {Apellido}</span>
      <span className="cuenta-cell cell-clave">{formatClave(Clave)}</span>
      <span className="cuenta-cell cell-rol">
        <span className={`rol-badge rol-${RolNombre?.toLowerCase()}`}>{RolNombre}</span>
      </span>
    </div>
  )
}
