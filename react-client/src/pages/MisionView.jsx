import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { EventItem } from '../components/EventItem'
import { TripulanteItem } from '../components/TripulanteItem'
import { EllipsisMenu } from '../components/EllipsisMenu'
import { AddEventForm } from '../components/AddEventForm'
import { Button } from '../components/Button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRight } from "lucide-react"
import { Infoshow } from '../components/Infoshow'
import './MisionView.css'

// Datos de ejemplo - en producción vendrían de la BDD
const misionesData = {
  1042: {
    misionId: 1042,
    nombre: 'Implementación del módulo de Logs',
    descripcion: 'Desarrollo del sistema de auditoría y logs del sistema. Este módulo permitirá llevar un registro detallado de todas las operaciones realizadas en la plataforma.',
    estadoNombre: 'En curso',
    fechaInicioEstimada: '15/04/2026 09:00',
    fechaFinEstimada: '20/04/2026 18:00',
    fechaInicioReal: '15/04/2026 09:15',
    fechaFinReal: null
  },
  1043: {
    misionId: 1043,
    nombre: 'Migración de base de datos',
    descripcion: 'Migración completa de MySQL a PostgreSQL, incluyendo_validación de integridad de datos y pruebas de rendimiento.',
    estadoNombre: 'En curso',
    fechaInicioEstimada: '10/04/2026 08:00',
    fechaFinEstimada: '18/04/2026 17:00',
    fechaInicioReal: '10/04/2026 10:30',
    fechaFinReal: null
  },
  1044: {
    misionId: 1044,
    nombre: 'Diseño de interfaz de usuario',
    descripcion: 'Rediseño completo de la interfaz principal con foco en UX/UI y accesibilidad.',
    estadoNombre: 'Completada',
    fechaInicioEstimada: '08/04/2026 09:00',
    fechaFinEstimada: '16/04/2026 18:00',
    fechaInicioReal: '08/04/2026 09:00',
    fechaFinReal: '16/04/2026 16:15'
  },
  1045: {
    misionId: 1045,
    nombre: 'Configuración de servidores',
    descripcion: 'Configuración de los servidores de producción con todas las medidas de seguridad necesarias.',
    estadoNombre: 'Pendiente',
    fechaInicioEstimada: '22/04/2026 10:00',
    fechaFinEstimada: '25/04/2026 16:00',
    fechaInicioReal: null,
    fechaFinReal: null
  },
  1046: {
    misionId: 1046,
    nombre: 'Integración de APIs externas',
    descripcion: 'Conexión con APIs de terceros para sincronización de datos en tiempo real.',
    estadoNombre: 'Cancelada',
    fechaInicioEstimada: '05/04/2026 09:00',
    fechaFinEstimada: '12/04/2026 18:00',
    fechaInicioReal: '05/04/2026 09:00',
    fechaFinReal: '07/04/2026 14:00'
  }
}

const eventosPorMision = {
  1042: [
    { id: 1, misionID: 1042, misionNombre: 'Implementación del módulo de Logs', titulo: 'Inicio del desarrollo', fecha: '2026-04-15 09:15', descripcion: 'Se inició el desarrollo del módulo de auditoría.' },
    { id: 2, misionID: 1042, misionNombre: 'Implementación del módulo de Logs', titulo: 'Configuración inicial', fecha: '2026-04-16 11:00', descripcion: 'Se completó la configuración del entorno de desarrollo.' }
  ],
  1043: [
    { id: 3, misionID: 1043, misionNombre: 'Migración de base de datos', titulo: 'Backup completado', fecha: '2026-04-10 12:00', descripcion: 'Se realizó el backup completo de la base de datos.' }
  ],
  1044: [
    { id: 4, misionID: 1044, misionNombre: 'Diseño de interfaz de usuario', titulo: 'Prototipo aprobado', fecha: '2026-04-10 15:00', descripcion: 'El prototipo fue aprobado por el cliente.' },
    { id: 5, misionID: 1044, misionNombre: 'Diseño de interfaz de usuario', titulo: 'Desarrollo frontend', fecha: '2026-04-12 09:00', descripcion: 'Inicio del desarrollo del frontend.' },
    { id: 6, misionID: 1044, misionNombre: 'Diseño de interfaz de usuario', titulo: 'Misión completada', fecha: '2026-04-16 16:15', descripcion: 'Se finalizó el rediseño de la interfaz.' }
  ],
  1045: [],
  1046: [
    { id: 7, misionID: 1046, misionNombre: 'Integración de APIs externas', titulo: 'Misión cancelada', fecha: '2026-04-07 14:00', descripcion: 'La misión fue cancelada por cambios en requisitos.' }
  ]
}

const tripulantesPorMision = {
  1042: [
    { TripulanteID: 1, Nombre: 'Carlos', Apellido: 'Rodríguez', Peso: 78.5, Altura: 1.82, Sexo: 'M', EstadoTID: 1 },
    { TripulanteID: 2, Nombre: 'María', Apellido: 'González', Peso: 62.0, Altura: 1.68, Sexo: 'F', EstadoTID: 1 }
  ],
  1043: [
    { TripulanteID: 3, Nombre: 'Juan', Apellido: 'Martínez', Peso: 85.0, Altura: 1.75, Sexo: 'M', EstadoTID: 2 }
  ],
  1044: [
    { TripulanteID: 4, Nombre: 'Ana', Apellido: 'Pérez', Peso: 70.2, Altura: 1.90, Sexo: 'F', EstadoTID: 1 },
    { TripulanteID: 7, Nombre: 'Diego', Apellido: 'Fernández', Peso: 82.0, Altura: 1.85, Sexo: 'M', EstadoTID: 1 }
  ],
  1045: [
    { TripulanteID: 5, Nombre: 'Roberto', Apellido: 'López', Peso: 88.0, Altura: 1.80, Sexo: 'M', EstadoTID: 3 },
    { TripulanteID: 6, Nombre: 'Laura', Apellido: 'Sánchez', Peso: 65.5, Altura: 1.72, Sexo: 'F', EstadoTID: 2 }
  ],
  1046: []
}

const misionesList = [
  { id: 1042, nombre: 'Implementación del módulo de Logs' },
  { id: 1043, nombre: 'Migración de base de datos' },
  { id: 1044, nombre: 'Diseño de interfaz de usuario' },
  { id: 1045, nombre: 'Configuración de servidores' },
  { id: 1046, nombre: 'Integración de APIs externas' }
]

export function MisionView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const mision = misionesData[id] || Object.values(misionesData)[0]
  const eventos = eventosPorMision[mision.misionId] || []
  const tripulantes = tripulantesPorMision[mision.misionId] || []
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showAddEvent, setShowAddEvent] = useState(false)

  const ellipsisItems = [
    { label: 'Editar misión', onClick: () => navigate(`/Misiones/${id}/Editar`) },
    { label: 'Eliminar misión', variant: 'danger', onClick: () => setShowDeleteConfirm(true) }
  ]

  const eventosEllipsisItems = [
    { label: 'Registrar evento', onClick: () => setShowAddEvent(true) }
  ]

  const handleDelete = () => {
    console.log('Eliminar misión:', mision.misionId)
    navigate(-1)
  }

  const handleAddEvent = (evento) => {
    console.log('Nuevo evento:', evento)
  }

  return (
    <>
      <Background />
      <div className="main-wrapper">
        <Header />
        <div className="main-panel">
          <div className="top-line">
            <Breadcrumb separator={<ChevronRight size={14} color="gray" />}>
              <BreadcrumbItem>
                <BreadcrumbLink href="/Misiones">Misiones</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>{mision.nombre}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <div className="action-buttons">
              <EllipsisMenu items={ellipsisItems} />
            </div>
          </div>

          <div className="hero">
            <h1 className='mision-title'>{mision.nombre}</h1>
            <p className="mision-description">{mision.descripcion}</p>
          </div>

          <div className="mision-info">
            <div className='id-info'>
              <Infoshow label="ID" subtitle="" content={mision.misionId.toString()} />
              <Infoshow label="Estado" subtitle="" content={mision.estadoNombre} />
            </div>
            <div className='time-info'>
              <Infoshow label="Fecha inicio" subtitle="Estimada" content={mision.fechaInicioEstimada} />
              <Infoshow label="Fecha finalización" subtitle="Estimada" content={mision.fechaFinEstimada} />
            </div>
            <div className='time-info'>
              <Infoshow label="" subtitle="Real" content={mision.fechaInicioReal || '—'} />
              <Infoshow label="" subtitle="Real" content={mision.fechaFinReal || '—'} />
            </div>
          </div>

          <div className="section-title-with-action">
            <h2>Eventos registrados</h2>
            <EllipsisMenu items={eventosEllipsisItems} />
          </div>

          <div className="eventos-section">
            {eventos.length > 0 ? (
              eventos.map(evento => (
                <EventItem key={evento.id} event={evento} />
              ))
            ) : (
              <div className="no-data">No hay eventos registrados para esta misión</div>
            )}
          </div>

          <div className="section-title">
            <h2>Tripulantes </h2>
          </div>

          <div className="tripulantes-section">
            {tripulantes.length > 0 ? (
              tripulantes.map(tripulante => (
                <TripulanteItem key={tripulante.TripulanteID} tripulante={tripulante} />
              ))
            ) : (
              <div className="no-data">No hay tripulantes asignados a esta misión</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>¿Eliminar misión?</h2>
            <p>Esta acción no puede ser revertida. Se eliminará permanentemente la misión y todos sus datos asociados.</p>
            <div className="modal-buttons">
              <Button label="Cancelar" onClick={() => setShowDeleteConfirm(false)} />
              <Button label="Eliminar" color="red" onClick={handleDelete} />
            </div>
          </div>
        </div>
      )}

      {/* Formulario de registro de eventos */}
      {showAddEvent && (
        <AddEventForm
          misiones={misionesList}
          defaultMisionId={mision.misionId}
          onClose={() => setShowAddEvent(false)}
          onSubmit={handleAddEvent}
        />
      )}
    </>
  )
}
