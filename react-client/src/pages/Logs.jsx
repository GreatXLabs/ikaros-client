import { useState } from 'react'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Logo } from "../components/Logo"
import { LogItem } from '../components/LogItem'
import './Logs.css'

// Datos de ejemplo para los logs
const logsData = [
  {
    id: 1,
    title: 'Usuario inició sesión',
    message: 'El usuario Juan Pérez ha iniciado sesión exitosamente desde IP 192.168.1.1',
    actor: 'Juan Pérez',
    timestamp: '2026-04-17 10:30:00'
  },
  {
    id: 2,
    title: 'Archivo subido',
    message: 'Se ha subido el archivo informe.pdf al sistema (2.5 MB)',
    actor: 'Sistema',
    timestamp: '2026-04-17 10:15:00'
  },
  {
    id: 3,
    title: 'Error de conexión',
    message: 'No se pudo conectar a la base de datos después de 3 intentos',
    actor: 'Sistema',
    timestamp: '2026-04-17 09:45:00'
  },
  {
    id: 4,
    title: 'Usuario cerró sesión',
    message: 'El usuario María García ha cerrado sesión',
    actor: 'María García',
    timestamp: '2026-04-17 09:30:00'
  },
  {
    id: 5,
    title: 'Backup completado',
    message: 'Backup automático completado: backup_20260417.sql (150 MB)',
    actor: 'Sistema',
    timestamp: '2026-04-17 08:00:00'
  }
]

export function Logs() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredLogs = logsData.filter(log =>
    log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.actor.toLowerCase().includes(searchTerm.toLowerCase())
  )

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