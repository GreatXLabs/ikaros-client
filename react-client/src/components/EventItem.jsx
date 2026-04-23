import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './EventItem.css'

export function EventItem({ event, canDelete = false, onDelete }) {
	const [showMenu, setShowMenu] = useState(false)
	const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
	const menuRef = useRef(null)

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
			<div className="event-item" onContextMenu={handleContextMenu}>
				<div className="main-info">
					<p className='overline'>{event.misionNombre}</p>
					<p className='title'>{event.titulo}</p>
					<p className='descripcion'>{event.descripcion}</p>
				</div>

				<div className="time-stamp">
					<p>{event.fecha}</p>
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
