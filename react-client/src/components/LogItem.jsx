import { useState } from 'react'
import { createPortal } from 'react-dom'
import './LogItem.css'

const MAPA_ACCIONES = {
	'Crear Mision': 'Creó una nueva misión',
	'Modificar Mision': 'Modificó una misión',
	'Cancelar Mision': 'Canceló una misión',
	'Finalizar Mision': 'Finalizó una misión',
	'Asignar Trip. Mision': 'Asignó un tripulante a una misión',
	'Registrar Evento': 'Registró un evento',
	'Desestimar Evento': 'Desestimó un evento',
	'Alta Tripulante': 'Registró un nuevo tripulante',
	'Modificar Tripulante': 'Modificó un tripulante',
	'Baja Tripulante': 'Dio de baja un tripulante',
	'Asignar Aptitud': 'Asignó una aptitud',
	'Modificar Calificacion': 'Modificó una calificación',
	'Alta Usuario': 'Creó un nuevo usuario',
	'Modificar Usuario': 'Modificó un usuario',
	'Inicio de Sesion': 'Inició sesión',
	'Cierre de Sesion': 'Cerró sesión'
}

function parseDetalles(raw) {
	if (!raw || raw === '') return []
	return raw.split('|').map(part => {
		if (part.includes(':')) {
			const colonIdx = part.indexOf(':')
			const campo = part.slice(0, colonIdx)
			const resto = part.slice(colonIdx + 1)
			if (resto.includes('->')) {
				const arrowIdx = resto.indexOf('->')
				return { campo, oldVal: resto.slice(0, arrowIdx), newVal: resto.slice(arrowIdx + 2), type: 'diff' }
			}
			if (resto.includes('=')) {
				const eqIdx = resto.indexOf('=')
				return { campo, valor: resto.slice(eqIdx + 1), type: 'kv' }
			}
			return { campo, valor: resto, type: 'info' }
		}
		if (part.includes('=')) {
			const eqIdx = part.indexOf('=')
			return { campo: part.slice(0, eqIdx), valor: part.slice(eqIdx + 1), type: 'kv' }
		}
		return { campo: '', valor: part, type: 'info' }
	})
}

function LogDetailModal({ log, onClose }) {
	const formatFecha = (fechaHora) => {
		if (!fechaHora) return '—'
		const date = new Date(fechaHora)
		if (isNaN(date.getTime())) return fechaHora
		return date.toLocaleDateString('es-AR', {
			day: '2-digit', month: '2-digit', year: 'numeric',
			hour: '2-digit', minute: '2-digit', second: '2-digit'
		})
	}

	const descripcionAccion = (accion, tipoEntidad, entidadID) => {
		const base = MAPA_ACCIONES[accion] || accion
		if (entidadID && entidadID !== '0' && entidadID !== '') {
			return `${base} (${tipoEntidad.toLowerCase()} #${entidadID})`
		}
		return base
	}

	const detalles = parseDetalles(log.descripcion)

	return createPortal(
		<div className="log-modal-overlay" onClick={onClose}>
			<div className="log-modal" onClick={e => e.stopPropagation()}>
				<button className="log-modal-close" onClick={onClose}>×</button>

				<h2 className="log-modal-title">{descripcionAccion(log.accion, log.tipoEntidad, log.entidadID)}</h2>

				<div className="log-modal-meta">
					<div className="log-modal-meta-item">
						<span className="label">Usuario</span>
						<span className="value">{log.usuario}</span>
					</div>
					<div className="log-modal-meta-item">
						<span className="label">Rol</span>
						<span className="value">{log.rol}</span>
					</div>
					<div className="log-modal-meta-item">
						<span className="label">Fecha</span>
						<span className="value">{formatFecha(log.fechaHora)}</span>
					</div>
					<div className="log-modal-meta-item">
						<span className="label">Entidad</span>
						<span className="value">{log.tipoEntidad} #{log.entidadID}</span>
					</div>
				</div>

				{detalles.length > 0 && (
					<div className="log-modal-detalles">
						<h3>Detalles</h3>
						{detalles.map((d, i) => (
							<div key={i} className={`log-modal-detalle ${d.type === 'diff' ? 'detalle-diff' : ''}`}>
								{d.campo && <span className="detalle-campo">{d.campo}</span>}
								{d.type === 'diff' ? (
									<div className="detalle-diff-values">
										<span className="detalle-old">{d.oldVal || '(vacío)'}</span>
										<span className="detalle-arrow">→</span>
										<span className="detalle-new">{d.newVal || '(vacío)'}</span>
									</div>
								) : (
									<span className="detalle-valor">{d.valor}</span>
								)}
							</div>
						))}
					</div>
				)}

				{detalles.length === 0 && (
					<p className="log-modal-no-detalles">Sin detalles adicionales</p>
				)}
			</div>
		</div>,
		document.body
	)
}

export function LogItem({ log, style }) {
	const [showModal, setShowModal] = useState(false)

	const formatFecha = (fechaHora) => {
		if (!fechaHora) return '—'
		const date = new Date(fechaHora)
		if (isNaN(date.getTime())) return fechaHora
		return date.toLocaleDateString('es-AR', {
			day: '2-digit', month: '2-digit', year: 'numeric',
			hour: '2-digit', minute: '2-digit'
		})
	}

	const descripcionAccion = (accion, tipoEntidad, entidadID) => {
		const base = MAPA_ACCIONES[accion] || accion
		if (entidadID && entidadID !== '0' && entidadID !== '') {
			return `${base} (${tipoEntidad.toLowerCase()} #${entidadID})`
		}
		return base
	}

	const hasDetails = log.descripcion && log.descripcion !== ''

	return (
		<>
			<div className={`log-item${hasDetails ? ' has-details' : ''}`} style={style} onClick={() => setShowModal(true)}>
				<div className="main-info">
					<p className='overline'>{log.rol}</p>
					<p className='title'>{descripcionAccion(log.accion, log.tipoEntidad, log.entidadID)}</p>
					<p className='actor'>{log.usuario}</p>
				</div>
				<div className="time-stamp">
					<p>{formatFecha(log.fechaHora)}</p>
				</div>
			</div>

			{showModal && (
				<LogDetailModal
					log={log}
					onClose={() => setShowModal(false)}
				/>
			)}
		</>
	)
}
