import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './EventItem.css'

export function EventItem({ event, canDelete = false, onDelete, style }) {
	console.log(`[EventItem] id=${event.id} titulo="${event.titulo}" estado="${event.estadoNombre}"`)
	const [showMenu, setShowMenu] = useState(false)
	const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
	const menuRef = useRef(null)

	const formatFecha = (fechaHora) => {
		if (!fechaHora) return '—'
		const date = new Date(fechaHora)
		if (isNaN(date.getTime())) return fechaHora
		return date.toLocaleDateString('es-AR', {
			day: '2-digit', month: '2-digit', year: 'numeric',
			hour: '2-digit', minute: '2-digit'
		})
	}

	const handleContextMenu = (e) => {
		if (!canDelete) return
		e.preventDefault()
		setMenuPos({ x: e.clientX, y: e.clientY })
		setShowMenu(true)
	}

	useEffect(() => {
		if (!showMenu) return
		const handleClickOutside = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false)
		}
		const handleEscape = (e) => { if (e.key === 'Escape') setShowMenu(false) }
		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleEscape)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleEscape)
		}
	}, [showMenu])

	return (
		<>
			<div className={`event-item${event.estadoNombre?.toUpperCase() === "DESESTIMADO" ? " desestimado" : ""}`} style={style} onContextMenu={handleContextMenu}>
				<div className="main-info">
					<p className='overline'>{event.misionNombre}</p>
					<p className='title'>{event.titulo}</p>
					<p className='descripcion'>{event.descripcion}</p>
				</div>

				<div className="time-stamp">
					<p>{formatFecha(event.fecha)}</p>
				</div>
			</div>

			{showMenu && canDelete && createPortal(
				<div
					ref={menuRef}
					className="context-menu"
					style={{ left: menuPos.x, top: menuPos.y }}
				>
					<div
						className="context-menu-item danger"
						onClick={() => {
							onDelete?.(event.id)
							setShowMenu(false)
						}}
					>
						Desestimar evento
					</div>
				</div>,
				document.body
			)}
		</>
	)
}
