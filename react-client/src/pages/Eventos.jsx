import { useState, useEffect } from 'react'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { EventItem } from '../components/EventItem'
import { AddEventForm } from '../components/AddEventForm'
import { ConfirmModal } from '../components/ConfirmModal'
import { useAuth } from '../contexts/AuthContext'
import { registrarEvento, listarMisiones } from '../services/ikarosApi'
import './Eventos.css'

function parseMisionesForFilter(data) {
  if (!data) return []
  const items = data.split(';')
  return items.map(item => {
    const parts = item.split(':')
    return { id: parseInt(parts[0]), nombre: parts[1] || '' }
  }).filter(m => m.id)
}

export function Eventos() {
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMision, setSelectedMision] = useState('')
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [misionesList, setMisionesList] = useState([])

  useEffect(() => {
    loadMisiones()
  }, [])

  const loadMisiones = async () => {
    try {
      const res = await listarMisiones()
      if (res.success) {
        setMisionesList(parseMisionesForFilter(res.data))
      }
    } catch {
      setMisionesList([])
    }
  }

  const misiones = misionesList.map(m => m.nombre)

  const handleAddEvent = async (evento) => {
    await registrarEvento(evento)
    setShowAddEvent(false)
  }

  const handleDeleteEvent = (eventId) => {
    setDeleteTarget(eventId)
  }

  const confirmDelete = () => {
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
                value={selectedMision}
                onChange={(e) => setSelectedMision(e.target.value)}
              >
                <option value="">Todas las misiones</option>
                {misiones.map(mision => (
                  <option key={mision} value={mision}>{mision}</option>
                ))}
              </select>
              {hasPermission('eventos:create') && (
                <button className="add-event-btn" onClick={() => setShowAddEvent(true)}>
                  + Evento
                </button>
              )}
            </div>
          </div>
          <div className="eventos-list">
            {!misiones.length && (
              <div className="no-results">No hay misiones activas para registrar eventos</div>
            )}
          </div>
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
