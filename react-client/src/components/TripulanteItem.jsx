import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../services/ikarosApi'
import './TripulanteItem.css'

const estadosColores = {
  'ACTIVO': 'activo',
  'INACTIVO': 'inactivo',
  'RETIRADO': 'retirado'
}

export function TripulanteItem({ tripulante, canEdit = false, canDelete = false, onDelete }) {
  const navigate = useNavigate()
  const estadoClass = estadosColores[tripulante.EstadoNombre?.toUpperCase()] || 'inactivo'
  const [showMenu, setShowMenu] = useState(false)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
  const menuRef = useRef(null)

  const imgUrl = tripulante.Imagen ? `${API_URL}${tripulante.Imagen}` : null

  const handleClick = () => {
    navigate(`/Tripulantes/${tripulante.TripulanteID}`)
  }

  const handleContextMenu = (e) => {
    if (!canEdit && !canDelete) return
    e.preventDefault()
    setMenuPos({ x: e.clientX, y: e.clientY })
    setShowMenu(true)
  }

  useEffect(() => {
    if (!showMenu) return
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape') setShowMenu(false)
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
      <div className="tripulante-item" onClick={handleClick} onContextMenu={handleContextMenu}>
        <div className="tripulante-img-wrapper">
          {imgUrl ? (
            <img src={imgUrl} alt={`${tripulante.Nombre} ${tripulante.Apellido}`} className="tripulante-img" />
          ) : (
            <div className="tripulante-img-placeholder"></div>
          )}
          <span className={`estado-indicator ${estadoClass}`}></span>
        </div>
        <p className='Nombre'>{tripulante.Nombre} {tripulante.Apellido}</p>
        <div className='info'>
          <span>{tripulante.SexoNombre}</span>
          <span>{tripulante.Altura}cm</span>
          <span>{tripulante.Peso}kg</span>
        </div>
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
                navigate(`/Tripulantes/${tripulante.TripulanteID}/Editar`)
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
                onDelete?.(tripulante.TripulanteID)
                setShowMenu(false)
              }}
            >
              Eliminar
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  )
}
