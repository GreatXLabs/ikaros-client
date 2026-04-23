import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import './TripulanteItem.css'

const estadosColores = {
	1: 'activo',
	2: 'inactivo',
	3: 'retirado'
}

export function TripulanteItem({ tripulante, canEdit = false, canDelete = false, onDelete }) {
	const navigate = useNavigate()
	const estadoClass = estadosColores[tripulante.EstadoTID] || 'inactivo'
	const [showMenu, setShowMenu] = useState(false)
	const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
	const menuRef = useRef(null)

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
					<img
						src={tripulante.img || 'https://via.placeholder.com/150'}
						alt={`${tripulante.Nombre} ${tripulante.Apellido}`}
						className="tripulante-img"
					/>
					<span className={`estado-indicator ${estadoClass}`}></span>
				</div>
				<p className='Nombre'>{tripulante.Nombre} {tripulante.Apellido}</p>
				<div className='info'>
					<span>{tripulante.Sexo}</span>
					<span>{tripulante.Altura}m</span>
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
