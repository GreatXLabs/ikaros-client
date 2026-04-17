import { useState } from 'react'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { MisionItem } from '../components/MisionItem'
import './Misiones.css'

const misionesData = [
  {
    misionId: 1042,
    nombre: 'Implementación del módulo de Logs',
    descripcion: 'Desarrollo del sistema de auditoría y logs del sistema',
    fechaInicioEstimada: '2026-04-15T09:00:00',
    fechaFinEstimada: '2026-04-20T18:00:00',
    retrasoInicio: '+00:00:00',
    retrasoFin: '-00:00:00',
    estadoMID: 2,
    estadoNombre: 'En curso'
  },
  {
    misionId: 1043,
    nombre: 'Migración de base de datos',
    descripcion: 'Migración de MySQL a PostgreSQL',
    fechaInicioEstimada: '2026-04-10T08:00:00',
    fechaFinEstimada: '2026-04-18T17:00:00',
    retrasoInicio: '+02:30:00',
    retrasoFin: '-00:00:00',
    estadoMID: 2,
    estadoNombre: 'En curso'
  },
  {
    misionId: 1044,
    nombre: 'Diseño de interfaz de usuario',
    descripcion: 'Rediseño completo de la interfaz principal',
    fechaInicioEstimada: '2026-04-08T09:00:00',
    fechaFinEstimada: '2026-04-16T18:00:00',
    retrasoInicio: '+00:00:00',
    retrasoFin: '-01:45:00',
    estadoMID: 3,
    estadoNombre: 'Completada'
  },
  {
    misionId: 1045,
    nombre: 'Configuración de servidores',
    descripcion: 'Configuración de los servidores de producción',
    fechaInicioEstimada: '2026-04-22T10:00:00',
    fechaFinEstimada: '2026-04-25T16:00:00',
    retrasoInicio: '00:00:00',
    retrasoFin: '00:00:00',
    estadoMID: 1,
    estadoNombre: 'Pendiente'
  },
  {
    misionId: 1046,
    nombre: 'Integración de APIs externas',
    descripcion: 'Conexión con APIs de terceros para sincronización',
    fechaInicioEstimada: '2026-04-05T09:00:00',
    fechaFinEstimada: '2026-04-12T18:00:00',
    retrasoInicio: '+04:00:00',
    retrasoFin: '-00:00:00',
    estadoMID: 4,
    estadoNombre: 'Cancelada'
  }
]

const estados = [
  { id: 1, nombre: 'Pendiente' },
  { id: 2, nombre: 'En curso' },
  { id: 3, nombre: 'Completada' },
  { id: 4, nombre: 'Cancelada' }
]

export function Misiones() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEstado, setSelectedEstado] = useState('')
  const [dateRange, setDateRange] = useState({ inicio: '', fin: '' })

  const filteredMisiones = misionesData.filter(mision => {
    const matchesSearch =
      mision.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mision.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mision.misionId.toString().includes(searchTerm)

    const matchesEstado = selectedEstado === '' || mision.estadoMID.toString() === selectedEstado

    const matchesDateRange =
      (!dateRange.inicio || new Date(mision.fechaInicioEstimada) >= new Date(dateRange.inicio)) &&
      (!dateRange.fin || new Date(mision.fechaInicioEstimada) <= new Date(dateRange.fin))

    return matchesSearch && matchesEstado && matchesDateRange
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
                placeholder="Buscar misiones por nombre, descripción o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filters-container">
              <select
                className="filter-select"
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
              >
                <option value="">Todos los estados</option>
                {estados.map(estado => (
                  <option key={estado.id} value={estado.id.toString()}>{estado.nombre}</option>
                ))}
              </select>
              <input
                type="date"
                className="filter-select filter-date"
                value={dateRange.inicio}
                onChange={(e) => setDateRange(prev => ({ ...prev, inicio: e.target.value }))}
                title="Fecha inicio estimada desde"
              />
              <input
                type="date"
                className="filter-select filter-date"
                value={dateRange.fin}
                onChange={(e) => setDateRange(prev => ({ ...prev, fin: e.target.value }))}
                title="Fecha inicio estimada hasta"
              />
            </div>
          </div>

          {/* Lista de misiones */}
          <div className="misiones-list">
            <div className="mision-list-header">
              <span>Id</span>
              <span>Nombre</span>
              <span>Fecha Inicio</span>
              <span>Fecha Finalización</span>
              <span>Estado</span>
            </div>
            {filteredMisiones.map(mision => (
              <MisionItem
                key={mision.misionId}
                mision={mision}
              />
            ))}
          </div>

          {filteredMisiones.length === 0 && (
            <div className="no-results">
              No se encontraron misiones que coincidan con los filtros
            </div>
          )}
        </div>
      </div>
    </>
  )
}