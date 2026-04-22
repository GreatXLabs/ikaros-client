import { useState } from 'react'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { EventItem } from '../components/EventItem'
import { AddEventForm } from '../components/AddEventForm'
import './Eventos.css'

// Datos de ejemplo para los eventos
const eventosData = [
  {
    id: 1,
    misionID: 1,
    misionNombre: 'Apolo XI',
    titulo: 'Despegue exitoso',
    fecha: '2026-04-17 10:30:00',
    descripcion: 'El módulo de comando ha despegado exitosamente desde la base espacial Kennedy a las 10:30 horas local.'
  },
  {
    id: 2,
    misionID: 1,
    misionNombre: 'Apolo XI',
    titulo: 'Entrada en órbita terrestre',
    fecha: '2026-04-17 11:15:00',
    descripcion: 'La nave ha completado la inserción orbital y se encuentra en una órbita estable a 400km de altura.'
  },
  {
    id: 3,
    misionID: 2,
    misionNombre: 'Artemis II',
    titulo: 'Verificación de sistemas',
    fecha: '2026-04-17 09:45:00',
    descripcion: 'Se han completado las verificaciones de todos los sistemas críticos de la nave. Todo funciona correctamente.'
  },
  {
    id: 4,
    misionID: 3,
    misionNombre: 'Marte One',
    titulo: 'Anomalía en comunicaciones',
    fecha: '2026-04-17 09:30:00',
    descripcion: 'Se detectó una interrupción temporal en el enlace de comunicaciones con la base marciana.'
  },
  {
    id: 5,
    misionID: 2,
    misionNombre: 'Artemis II',
    titulo: 'Ajuste de trayectoria',
    fecha: '2026-04-17 08:00:00',
    descripcion: 'Corrección de rumbo ejecutada exitosamente. Nueva trayectoria calculada para optimizar el consumo de combustible.'
  },
  {
    id: 6,
    misionID: 4,
    misionNombre: 'ISS Maintenance',
    titulo: 'Inicio de EVA',
    fecha: '2026-04-17 07:45:00',
    descripcion: 'Los astronautas han comenzado la actividad extravehicular para reparar el panel solar dañado.'
  },
  {
    id: 7,
    misionID: 1,
    misionNombre: 'Apolo XI',
    titulo: 'Contacto con módulo lunar',
    fecha: '2026-04-17 07:30:00',
    descripcion: 'Acoplamiento exitoso entre el módulo de comando y el módulo lunar. Todos los sistemas operativos.'
  }
]

const misionesList = [
  { id: 1, nombre: 'Apolo XI' },
  { id: 2, nombre: 'Artemis II' },
  { id: 3, nombre: 'Marte One' },
  { id: 4, nombre: 'ISS Maintenance' }
]

// Lista de opciones para el filtro de roles
const roles = ['Asignador', 'Coordinador', 'Registrador', 'RRHH']

export function Eventos() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMision, setSelectedMision] = useState('')
  const [showAddEvent, setShowAddEvent] = useState(false)

  // Obtener lista única de misiones para el filtro
  const misiones = [...new Set(eventosData.map(event => event.misionNombre))]

  const filteredEventos = eventosData.filter(event => {
    const matchesSearch =
      event.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.misionNombre.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesMision = selectedMision === '' || event.misionNombre === selectedMision

    return matchesSearch && matchesMision
  })

  const handleAddEvent = (evento) => {
    console.log('Nuevo evento:', evento)
  }

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
              <button className="add-event-btn" onClick={() => setShowAddEvent(true)}>
                + Evento
              </button>
            </div>
          </div>
          <div className="eventos-list">
            {filteredEventos.map(event => (
              <EventItem key={event.id} event={event} />
            ))}
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
    </>
  )
}
