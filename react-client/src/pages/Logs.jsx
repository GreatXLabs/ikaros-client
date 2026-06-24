import { useState, useEffect, useMemo } from 'react'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { LogItem } from '../components/LogItem'
import { DateRangeFilter } from '../components/DateRangeFilter'
import { Pagination } from '../components/Pagination'
import * as api from '../services/ikarosApi'
import './Logs.css'

function parseLogs(data) {
	if (!data) return []
	const items = data.split(';')
	return items.map(item => {
		const parts = item.split('~')
		return {
			id: parseInt(parts[0]) || 0,
			usuario: parts[1] || '',
			rol: parts[2] || '',
			accion: parts[3] || '',
			tipoEntidad: parts[4] || '',
			entidadID: parts[5] || '',
			fechaHora: parts[6] || '',
			detalles: parts[7] || ''
		}
	}).filter(l => l.id)
}

const ALL_ACCIONES = [
	'Crear Mision', 'Modificar Mision', 'Cancelar Mision', 'Finalizar Mision',
	'Asignar Trip. Mision', 'Registrar Evento', 'Desestimar Evento',
	'Alta Tripulante', 'Modificar Tripulante', 'Baja Tripulante',
	'Asignar Aptitud', 'Modificar Calificacion',
	'Alta Usuario', 'Modificar Usuario',
	'Inicio de Sesion', 'Cierre de Sesion'
]

const ALL_ENTIDADES = ['Mision', 'Tripulante', 'Evento', 'Usuario', 'Capacidad']

export function Logs() {
	const [searchTerm, setSearchTerm] = useState('')
	const [dateRange, setDateRange] = useState([
		{
			startDate: null,
			endDate: null,
			key: 'selection'
		}
	])
	const [selectedAccion, setSelectedAccion] = useState('')
	const [selectedEntidad, setSelectedEntidad] = useState('')
	const [sortBy, setSortBy] = useState('fecha-desc')
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(15)
	const [logsData, setLogsData] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		loadLogs()
	}, [])

	const loadLogs = async () => {
		try {
			const res = await api.verLogs()
			if (res.success) {
				setLogsData(parseLogs(res.data))
			}
		} catch {
			setLogsData([])
		}
		setLoading(false)
	}

	const filteredLogs = useMemo(() => {
		let result = logsData.filter(log => {
			const matchesSearch =
				log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
				log.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
				log.rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
				log.entidadID.toString().includes(searchTerm)

			const start = dateRange[0].startDate
			const end = dateRange[0].endDate
			let matchesDate = true
			if (start || end) {
				const logDate = new Date(log.fechaHora)
				if (!isNaN(logDate.getTime())) {
					const startDate = start ? new Date(start.setHours(0, 0, 0, 0)) : null
					const endDate = end ? new Date(end.setHours(23, 59, 59, 999)) : null
					if (startDate && logDate < startDate) matchesDate = false
					if (endDate && logDate > endDate) matchesDate = false
				}
			}

			const matchesAccion = selectedAccion === '' || log.accion === selectedAccion
			const matchesEntidad = selectedEntidad === '' || log.tipoEntidad === selectedEntidad

			return matchesSearch && matchesDate && matchesAccion && matchesEntidad
		})

		result.sort((a, b) => {
			const dateA = new Date(a.fechaHora).getTime()
			const dateB = new Date(b.fechaHora).getTime()
			switch (sortBy) {
				case 'fecha-asc': return dateA - dateB
				case 'fecha-desc': return dateB - dateA
				case 'usuario': return a.usuario.localeCompare(b.usuario)
				default: return dateB - dateA
			}
		})

		return result
	}, [logsData, searchTerm, dateRange, selectedAccion, selectedEntidad, sortBy])

	const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize))
	const paginatedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize)

	useEffect(() => {
		setPage(1)
	}, [searchTerm, dateRange, selectedAccion, selectedEntidad, sortBy])

	const uniqueAcciones = [...new Set(logsData.map(l => l.accion).filter(Boolean))].sort()
	const uniqueEntidades = [...new Set(logsData.map(l => l.tipoEntidad).filter(Boolean))].sort()

	return (
		<>
			<Background />
			<div className="main-wrapper">
				<Header />
				<div className="main-panel">
					<div className="top-bar">
						<div className="search-container">
							<input
								type="text"
								className="search-input"
								placeholder="Buscar logs por usuario, acción o rol..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="filters-container">
							<select
								className="filter-select"
								value={selectedAccion}
								onChange={(e) => setSelectedAccion(e.target.value)}
							>
								<option value="">Todas las acciones</option>
								{uniqueAcciones.map(accion => (
									<option key={accion} value={accion}>{accion}</option>
								))}
							</select>

							<select
								className="filter-select"
								value={selectedEntidad}
								onChange={(e) => setSelectedEntidad(e.target.value)}
							>
								<option value="">Todas las entidades</option>
								{uniqueEntidades.map(ent => (
									<option key={ent} value={ent}>{ent}</option>
								))}
							</select>

							<DateRangeFilter
								dateRange={dateRange}
								onDateChange={setDateRange}
							/>

							<select
								className="filter-select"
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
							>
								<option value="fecha-desc">Más reciente</option>
								<option value="fecha-asc">Más antiguo</option>
								<option value="usuario">Por usuario</option>
							</select>
						</div>
					</div>
					<div className="logs-list">
						{loading ? (
							<div className="no-results">Cargando logs...</div>
						) : paginatedLogs.map((log, index) => (
							<LogItem key={log.id} log={log} style={{ '--index': index }} />
						))}
						{!loading && filteredLogs.length === 0 && (
							<div className="no-results">No se encontraron logs</div>
						)}
					</div>

					<Pagination
						currentPage={page}
						totalPages={totalPages}
						pageSize={pageSize}
						onPageChange={setPage}
						onPageSizeChange={setPageSize}
					/>
				</div>
			</div>
		</>
	)
}
