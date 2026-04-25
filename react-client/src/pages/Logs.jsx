import { useState, useEffect } from 'react'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { LogItem } from '../components/LogItem'
import { DateRangeFilter } from '../components/DateRangeFilter'
import { verLogs } from '../services/ikarosApi'
import './Logs.css'

function parseLogs(data) {
  if (!data) return []
  const items = data.split(';')
  return items.map((item, index) => {
    const parts = item.split(':')
    return {
      id: index + 1,
      rol: parts[0] || '',
      title: parts[1] || '',
      message: parts[2] || '',
      actor: parts[3] || '',
      timestamp: parts[4] || ''
    }
  })
}

const roles = ['ASIGNADOR', 'COORDINADOR', 'REGISTRADOR', 'RRHH', 'JEFE']

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
  const [logsData, setLogsData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    try {
      const res = await verLogs()
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
      log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.rol.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRol = selectedRol === '' || log.rol.toUpperCase() === selectedRol

    return matchesSearch && matchesRol
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
            {loading ? (
              <div className="no-results">Cargando logs...</div>
            ) : filteredLogs.map(log => (
              <LogItem key={log.id} log={log} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
