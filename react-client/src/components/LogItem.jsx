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

export function LogItem({ log, style }) {
	const formatFecha = (fechaHora) => {
		if (!fechaHora) return '—'
		const date = new Date(fechaHora)
		if (isNaN(date.getTime())) return fechaHora
		return date.toLocaleDateString('es-AR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	const descripcionAccion = (accion, tipoEntidad, entidadID) => {
		const base = MAPA_ACCIONES[accion] || accion
		if (entidadID && entidadID !== '0' && entidadID !== '') {
			return `${base} (${tipoEntidad.toLowerCase()} #${entidadID})`
		}
		return base
	}

	return (
		<div className="log-item" style={style}>
			<div className="main-info">
				<p className='overline'>{log.rol}</p>
				<p className='title'>{descripcionAccion(log.accion, log.tipoEntidad, log.entidadID)}</p>
				<p className='actor'>{log.usuario}</p>
			</div>
			<div className="time-stamp">
				<p>{formatFecha(log.fechaHora)}</p>
			</div>
		</div>
	)
}
