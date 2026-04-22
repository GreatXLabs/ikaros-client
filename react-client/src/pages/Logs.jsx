import { useState } from 'react'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Logo } from "../components/Logo"
import { LogItem } from '../components/LogItem'
import { DateRangeFilter } from '../components/DateRangeFilter'
import './Logs.css'

// Datos de ejemplo para los logs
const logsData = [
  {
    id: 1,
    rol: 'Asignador',
    title: 'Usuario inició sesión',
    message: 'El usuario Juan Pérez ha iniciado sesión exitosamente desde IP 192.168.1.1',
    actor: 'Juan Pérez',
    timestamp: '2026-04-17 10:30:00'
  },
  {
    id: 2,
    rol: 'Coordinador',
    title: 'Archivo subido',
    message: 'Se ha subido el archivo informe.pdf al sistema (2.5 MB)',
    actor: 'Sistema',
    timestamp: '2026-04-17 10:15:00'
  },
  {
    id: 3,
    rol: 'Registrador',
    title: 'Error de conexión',
    message: 'No se pudo conectar a la base de datos después de 3 intentos',
    actor: 'Sistema',
    timestamp: '2026-04-17 09:45:00'
  },
  {
    id: 4,
    rol: 'RRHH',
    title: 'Usuario cerró sesión',
    message: 'El usuario María García ha cerrado sesión',
    actor: 'María García',
    timestamp: '2026-04-16 09:30:00'
  },
  {
    id: 5,
    rol: 'Asignador',
    title: 'Backup completado',
    message: 'Backup automático completado: backup_20260417.sql (150 MB)',
    actor: 'Sistema',
    timestamp: '2026-04-16 08:00:00'
  },
  {
    id: 6,
    rol: 'Coordinador',
    title: 'Reporte generado',
    message: 'Se generó el reporte financiero mensual de abril',
    actor: 'Carlos López',
    timestamp: '2026-04-15 07:45:00'
  },
  {
    id: 7,
    rol: 'Registrador',
    title: 'Nueva baja de empleado',
    message: 'Empleado registrado como dado de baja en sistema',
    actor: 'Ana Martínez',
    timestamp: '2026-04-15 07:30:00'
  }
]

// Lista de opciones para el filtro de roles
const roles = ['Asignador', 'Coordinador', 'Registrador', 'RRHH']

export function Logs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRol, setSelectedRol] = useState('')
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection'
    }
  ])

  const filteredLogs = logsData.filter(log => {
    const matchesSearch =
      log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.rol.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRol = selectedRol === '' || log.rol === selectedRol

    const logDate = new Date(log.timestamp)
    logDate.setHours(0, 0, 0, 0)
    const matchesDateRange =
      (!dateRange[0].startDate || logDate >= dateRange[0].startDate) &&
      (!dateRange[0].endDate || logDate <= dateRange[0].endDate)

    return matchesSearch && matchesRol && matchesDateRange
  })

  return (
    <>
      <Background />
      <div className="main-wrapper">
        <Header/>
        <div className="main-panel">
          <div className="top-bar">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Buscar logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filters-container">
              <select
                className="filter-select"
                value={selectedRol}
                onChange={(e) => setSelectedRol(e.target.value)}
              >
                <option value="">Todos los roles</option>
                {roles.map(rol => (
                  <option key={rol} value={rol}>{rol}</option>
                ))}
              </select>

              <DateRangeFilter
                dateRange={dateRange}
                onDateChange={setDateRange}
              />
            </div>
          </div>
          <div className="logs-list">
            {filteredLogs.map(log => (
              <LogItem key={log.id} log={log} />
            ))}
          </div>

        </div>

      </div>


    </>
  )
}