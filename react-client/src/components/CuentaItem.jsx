import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import './CuentaItem.css'

export function CuentaItem({ cuenta, onDelete, canEdit = true, canDelete = true }) {
	const navigate = useNavigate()
	const { UsuarioID, Nombre, Apellido, Clave, RolNombre } = cuenta
	const [showMenu, setShowMenu] = useState(false)
	const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
	const menuRef = useRef(null)

	const formatClave = (clave) => {
		if (!clave) return '—'
		const len = clave.length
		const visibleChars = Math.min(4, len)
		const maskedLen = Math.max(3, len - visibleChars)
		return '*'.repeat(maskedLen) + clave.slice(-visibleChars)
	}

	const handleContextMenu = (e) => {
		if (!canEdit && !canDelete) return
		e.preventDefault()
		setMenuPos({ x: e.clientX, y: e.clientY })
		setShowMenu(true)
	}

	const handleEdit = () => {
		navigate(`/Cuentas/${UsuarioID}/Editar`)
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
			<div className="cuenta-item" onContextMenu={handleContextMenu}>
				<span className="cuenta-cell cell-id">{UsuarioID}</span>
				<span className="cuenta-cell cell-nombre">{Nombre} {Apellido}</span>
				<span className="cuenta-cell cell-clave">{formatClave(Clave)}</span>
				<span className="cuenta-cell cell-rol">
					<span className={`rol-badge rol-${RolNombre?.toLowerCase()}`}>{RolNombre}</span>
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
							Eliminar
						</div>
					)}
				</div>,
				document.body
			)}
		</>
	)
}
