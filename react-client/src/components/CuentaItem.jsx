import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import './CuentaItem.css'

export function CuentaItem({ cuenta, onDelete, canEdit = true, canDelete = true, style }) {
  const navigate = useNavigate()
  const { UsuarioID, Usuario, RolNombre, EstadoNombre } = cuenta
  const [showMenu, setShowMenu] = useState(false)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
  const menuRef = useRef(null)

  const isInactive = EstadoNombre?.toLowerCase() === 'inactivo'

  const handleContextMenu = (e) => {
    if (!canEdit && !canDelete) return
    e.preventDefault()
    setMenuPos({ x: e.clientX, y: e.clientY })
    setShowMenu(true)
  }

  const handleEdit = () => {
    navigate(`/Cuentas/${UsuarioID}/Editar`, { state: { cuenta } })
  }

  const handleDelete = () => {
    onDelete && onDelete(UsuarioID)
  }

  useEffect(() => {
    if (!showMenu) return

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [showMenu])

  return (
    <>
      <div className={`cuenta-item${isInactive ? ' cuenta-inactive' : ''}`} style={style} onClick={handleEdit} onContextMenu={handleContextMenu}>
        <span className="cuenta-cell cell-id">{UsuarioID}</span>
        <span className="cuenta-cell cell-nombre">{Usuario}</span>
        <span className="cuenta-cell cell-rol">
          <span className={`rol-badge rol-${RolNombre?.toLowerCase()}`}>{RolNombre}</span>
        </span>
        <span className="cuenta-cell cell-estado">
          <span className={`estado-badge ${isInactive ? 'cancelada' : 'completada'}`}>{EstadoNombre || 'Activo'}</span>
        </span>
      </div>

      {showMenu && createPortal(
        <div
          ref={menuRef}
          className="context-menu"
          style={{ left: menuPos.x, top: menuPos.y }}
        >
          {canEdit && (
            <div
              className="context-menu-item"
              onClick={() => {
                handleEdit()
                setShowMenu(false)
              }}
            >
              Editar
            </div>
          )}
          {canDelete && (
            <div
              className="context-menu-item danger"
              onClick={() => {
                handleDelete()
                setShowMenu(false)
              }}
            >
              Dar de baja
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  )
}
