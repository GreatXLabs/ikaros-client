import { useState, useEffect } from 'react'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { LogItem } from '../components/LogItem'
import { DateRangeFilter } from '../components/DateRangeFilter'
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
			fechaHora: parts[6] || ''
		}
	}).filter(l => l.id)
}

export function Logs() {
	const [searchTerm, setSearchTerm] = useState('')
	const [dateRange, setDateRange] = useState([
		{
			startDate: null,
			endDate: null,
			key: 'selection'
		}
	])
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

	const filteredLogs = logsData.filter(log => {
		const matchesSearch =
			log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
			log.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
			log.rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
			log.entidadID.toString().includes(searchTerm)

		const start = dateRange[0].startDate
		const end = dateRange[0].endDate
		if (!start && !end) return matchesSearch

		const logDate = new Date(log.fechaHora)
		if (isNaN(logDate.getTime())) return matchesSearch

		const startDate = start ? new Date(start.setHours(0, 0, 0, 0)) : null
		const endDate = end ? new Date(end.setHours(23, 59, 59, 999)) : null

		if (startDate && logDate < startDate) return false
		if (endDate && logDate > endDate) return false

		return matchesSearch
	})

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
							<DateRangeFilter
								dateRange={dateRange}
								onDateChange={setDateRange}
							/>
						</div>
					</div>
					<div className="logs-list">
						{loading ? (
							<div className="no-results">Cargando logs...</div>
						) : filteredLogs.map((log, index) => (
							<LogItem key={log.id} log={log} style={{ '--index': index }} />
						))}
						{!loading && filteredLogs.length === 0 && (
							<div className="no-results">No se encontraron logs</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
