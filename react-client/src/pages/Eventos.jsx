import { useState, useEffect, useMemo } from 'react'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { EventItem } from '../components/EventItem'
import { AddEventForm } from '../components/AddEventForm'
import { DateRangeFilter } from '../components/DateRangeFilter'
import { Pagination } from '../components/Pagination'
import { ConfirmModal } from '../components/ConfirmModal'
import { useAuth } from '../contexts/AuthContext'
import { registrarEvento, bajaEvento, listarMisiones, listarTodosEventos } from '../services/ikarosApi'
import './Eventos.css'

function parseMisionesForFilter(data) {
  if (!data) return []
  const items = data.split(';')
  return items.map(item => {
    const parts = item.split('~')
    return { id: parseInt(parts[0]), nombre: parts[1] || '' }
  }).filter(m => m.id)
}

function parseEventos(data) {
  if (!data) return []
  const items = data.split(';')
  return items.map((item, index) => {
    const parts = item.split('~')
    return {
      id: parseInt(parts[0]) || index + 1,
      misionNombre: parts[1] || '',
      titulo: parts[2] || '',
      fecha: parts[3] || '',
      descripcion: parts[4] || '',
      estadoNombre: parts[5] || ''
    }
  }).filter(e => e.id)
}

export function Eventos() {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMision, setSelectedMision] = useState('')
  const [dateRange, setDateRange] = useState([
    { startDate: null, endDate: null, key: 'selection' }
  ])
  const [sortBy, setSortBy] = useState('fecha-desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [misionesList, setMisionesList] = useState([])
  const [eventosData, setEventosData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [eventosRes, misionesRes] = await Promise.all([
        listarTodosEventos(),
        listarMisiones()
      ])
      if (misionesRes.success) {
        setMisionesList(parseMisionesForFilter(misionesRes.data))
      }
      if (eventosRes.success) {
        setEventosData(parseEventos(eventosRes.data))
      }
    } catch {
      setEventosData([])
    }
    setLoading(false)
  }

  const misiones = misionesList.map(m => m.nombre)

  const processedEventos = useMemo(() => {
    let result = eventosData.filter(event => {
      const matchesSearch =
        event.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.descripcion.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesMision = !selectedMision || event.misionNombre === selectedMision

      const rangeStart = dateRange[0].startDate
      const rangeEnd = dateRange[0].endDate
      let matchesDate = true
      if (rangeStart || rangeEnd) {
        const eventDate = new Date(event.fecha)
        if (!isNaN(eventDate.getTime())) {
          const dayStart = rangeStart ? new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate()) : null
          const dayEnd = rangeEnd ? new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate(), 23, 59, 59, 999) : null
          if (dayStart && eventDate < dayStart) matchesDate = false
          if (dayEnd && eventDate > dayEnd) matchesDate = false
        }
      }

      return matchesSearch && matchesMision && matchesDate
    })

    result.sort((a, b) => {
      const dateA = new Date(a.fecha).getTime()
      const dateB = new Date(b.fecha).getTime()
      switch (sortBy) {
        case 'fecha-asc': return dateA - dateB
        case 'fecha-desc': return dateB - dateA
        case 'titulo-asc': return a.titulo.localeCompare(b.titulo)
        case 'titulo-desc': return b.titulo.localeCompare(a.titulo)
        case 'mision': return a.misionNombre.localeCompare(b.misionNombre)
        default: return dateB - dateA
      }
    })

    return result
  }, [eventosData, searchTerm, selectedMision, dateRange, sortBy])

  const totalPages = Math.max(1, Math.ceil(processedEventos.length / pageSize))
  const paginatedEventos = processedEventos.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => {
    setPage(1)
  }, [searchTerm, selectedMision, dateRange, sortBy])

  const handleAddEvent = async (evento) => {
    await registrarEvento(evento)
    setShowAddEvent(false)
    loadAll()
  }

  const handleDeleteEvent = (eventId) => {
    setDeleteTarget(eventId)
  }

  const confirmDelete = async () => {
    if (deleteTarget) {
      await bajaEvento(deleteTarget)
      loadAll()
    }
    setDeleteTarget(null)
  }

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
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filters-container">
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="fecha-desc">Más reciente</option>
                <option value="fecha-asc">Más antiguo</option>
                <option value="titulo-asc">Título A-Z</option>
                <option value="titulo-desc">Título Z-A</option>
                <option value="mision">Por misión</option>
              </select>
              <select
                className="filter-select"
                value={selectedMision}
                onChange={(e) => setSelectedMision(e.target.value)}
              >
                <option value="">Todas las misiones</option>
                {misiones.map(mision => (
                  <option key={mision} value={mision}>{mision}</option>
                ))}
              </select>
              <DateRangeFilter
                dateRange={dateRange}
                onDateChange={setDateRange}
              />
              {hasPermission('eventos:create') && (
                <button className="add-event-btn" onClick={() => setShowAddEvent(true)}>
                  + Evento
                </button>
              )}
            </div>
          </div>
          <div className="eventos-list">
            {loading ? (
              <div className="no-results">Cargando eventos...</div>
            ) : paginatedEventos.length === 0 ? (
              <div className="no-results">No hay eventos registrados</div>
            ) : (
              paginatedEventos.map((event, index) => (
                <EventItem
                  key={event.id}
                  event={event}
                  canDelete={hasPermission('eventos:delete')}
                  onDelete={handleDeleteEvent}
                  style={{ '--index': index }}
                />
              ))
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

      {showAddEvent && (
        <AddEventForm
          misiones={misionesList}
          onClose={() => setShowAddEvent(false)}
          onSubmit={handleAddEvent}
        />
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="¿Desestimar evento?"
        message="Esta acción registrará la desestimación del evento. No podrá ser revertida."
        confirmLabel="Desestimar"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
