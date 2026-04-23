import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import './MisionItem.css'

const ESTADO_CLASS = {
	'En curso': 'active',
	'Pendiente': 'pending',
	'Completada': 'done',
	'Cancelada': 'overdue',
}

function formatFecha(isoString) {
	if (!isoString) return '—'
	const d = new Date(isoString)
	const dd = String(d.getDate()).padStart(2, '0')
	const mm = String(d.getMonth() + 1).padStart(2, '0')
	const yyyy = d.getFullYear()
	const hh = String(d.getHours()).padStart(2, '0')
	const min = String(d.getMinutes()).padStart(2, '0')
	return `${dd}/${mm}/${yyyy} ${hh}:${min}`
}

function parseDelta(delta) {
	if (!delta || delta === '00:00:00' || delta === '+00:00:00' || delta === '-00:00:00') return null
	const signChar = delta.startsWith('-') ? -1 : 1
	const timePart = delta.replace(/^[+-]/, '')
	const [hours, minutes, seconds] = timePart.split(':').map(Number)
	const totalSeconds = (hours * 3600) + (minutes * 60) + seconds
	const signedSeconds = signChar * totalSeconds
	return {
		value: delta,
		isAdvantage: signedSeconds < 0,
		isDelay: signedSeconds > 0
	}
}

function ContextMenuPortal({ menuRef, menuPos, items, onClose }) {
	useEffect(() => {
		if (!items.length) return
		const handleClickOutside = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) onClose()
		}
		const handleEscape = (e) => { if (e.key === 'Escape') onClose() }
		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleEscape)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleEscape)
		}
	}, [items, menuRef, onClose])

	return createPortal(
		<div ref={menuRef} className="context-menu" style={{ left: menuPos.x, top: menuPos.y }}>
			{items.map((item, i) => (
				<div
					key={i}
					className={`context-menu-item ${item.danger ? 'danger' : ''}`}
					onClick={() => { item.action(); onClose() }}
				>
					{item.label}
				</div>
			))}
		</div>,
		document.body
	)
}

export function MisionItem({ mision, canEdit = false, canDelete = false, onDelete }) {
	const navigate = useNavigate()
	const [showMenu, setShowMenu] = useState(false)
	const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
	const menuRef = useRef(null)

	const {
		misionId, nombre, fechaInicioEstimada, fechaFinEstimada,
		retrasoInicio, retrasoFin, estadoNombre,
	} = mision

	const deltaInicio = parseDelta(retrasoInicio)
	const deltaFin = parseDelta(retrasoFin)
	const estadoKey = ESTADO_CLASS[estadoNombre] ?? 'pending'

	const handleContextMenu = (e) => {
		if (!canEdit && !canDelete) return
		e.preventDefault()
		setMenuPos({ x: e.clientX, y: e.clientY })
		setShowMenu(true)
	}

	const menuItems = []
	if (canEdit) menuItems.push({ label: 'Editar', action: () => navigate(`/Misiones/${misionId}/Editar`) })
	if (canDelete) menuItems.push({ label: 'Eliminar', danger: true, action: () => onDelete?.(misionId) })

	return (
		<>
			<div className="mision-item" onClick={() => navigate(`/misiones/${misionId}`)} onContextMenu={handleContextMenu}>
				<span className="mision-cell cell-id">{misionId}</span>
				<span className="mision-cell cell-nombre">{nombre}</span>
				<span className="mision-cell cell-fecha">
					{formatFecha(fechaInicioEstimada)}
					{deltaInicio && <span className={`mision-delta ${deltaInicio.isDelay ? 'delta-retardo' : 'delta-adelanto'}`}>{deltaInicio.value}</span>}
				</span>
				<span className="mision-cell cell-fecha">
					{formatFecha(fechaFinEstimada)}
					{deltaFin && <span className={`mision-delta ${deltaFin.isDelay ? 'delta-retardo' : 'delta-adelanto'}`}>{deltaFin.value}</span>}
				</span>
				<span className="mision-cell cell-estado">
					<span className={`mision-status status-${estadoKey}`}>{estadoNombre}</span>
				</span>
			</div>

			{showMenu && menuItems.length > 0 && (
				<ContextMenuPortal
					menuRef={menuRef}
					menuPos={menuPos}
					items={menuItems}
					onClose={() => setShowMenu(false)}
				/>
			)}
		</>
	)
}
