import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { EventItem } from '../components/EventItem'
import { TripulanteItem } from '../components/TripulanteItem'
import { EllipsisMenu } from '../components/EllipsisMenu'
import { AddEventForm } from '../components/AddEventForm'
import { Button } from '../components/Button'
import { ConfirmModal } from '../components/ConfirmModal'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRight, Play, Square } from "lucide-react"
import { Infoshow } from '../components/Infoshow'
import { useAuth } from '../contexts/AuthContext'
import './MisionView.css'

const misionesData = {
	1042: { misionId: 1042, nombre: 'Implementación del módulo de Logs', descripcion: 'Desarrollo del sistema de auditoría y logs del sistema. Este módulo permitirá llevar un registro detallado de todas las operaciones realizadas en la plataforma.', estadoNombre: 'En curso', estadoMID: 3, fechaInicioEstimada: '15/04/2026 09:00', fechaFinEstimada: '20/04/2026 18:00', fechaInicioReal: '15/04/2026 09:15', fechaFinReal: null },
	1043: { misionId: 1043, nombre: 'Migración de base de datos', descripcion: 'Migración completa de MySQL a PostgreSQL, incluyendo validación de integridad de datos y pruebas de rendimiento.', estadoNombre: 'En curso', estadoMID: 3, fechaInicioEstimada: '10/04/2026 08:00', fechaFinEstimada: '18/04/2026 17:00', fechaInicioReal: '10/04/2026 10:30', fechaFinReal: null },
	1044: { misionId: 1044, nombre: 'Diseño de interfaz de usuario', descripcion: 'Rediseño completo de la interfaz principal con foco en UX/UI y accesibilidad.', estadoNombre: 'Completada', estadoMID: 4, fechaInicioEstimada: '08/04/2026 09:00', fechaFinEstimada: '16/04/2026 18:00', fechaInicioReal: '08/04/2026 09:00', fechaFinReal: '16/04/2026 16:15' },
	1045: { misionId: 1045, nombre: 'Configuración de servidores', descripcion: 'Configuración de los servidores de producción con todas las medidas de seguridad necesarias.', estadoNombre: 'Pendiente', estadoMID: 1, fechaInicioEstimada: '22/04/2026 10:00', fechaFinEstimada: '25/04/2026 16:00', fechaInicioReal: null, fechaFinReal: null },
	1046: { misionId: 1046, nombre: 'Integración de APIs externas', descripcion: 'Conexión con APIs de terceros para sincronización de datos en tiempo real.', estadoNombre: 'Cancelada', estadoMID: 5, fechaInicioEstimada: '05/04/2026 09:00', fechaFinEstimada: '12/04/2026 18:00', fechaInicioReal: '05/04/2026 09:00', fechaFinReal: '07/04/2026 14:00' }
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
	const { hasPermission } = useAuth()
	const mision = misionesData[id] || Object.values(misionesData)[0]
	const eventos = eventosPorMision[mision.misionId] || []
	const tripulantes = tripulantesPorMision[mision.misionId] || []
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const [showStartConfirm, setShowStartConfirm] = useState(false)
	const [showEndConfirm, setShowEndConfirm] = useState(false)
	const [showAddEvent, setShowAddEvent] = useState(false)

	const ellipsisItems = []
	if (hasPermission('misiones:edit')) {
		ellipsisItems.push({ label: 'Editar misión', onClick: () => navigate(`/Misiones/${id}/Editar`) })
	}
	if (hasPermission('misiones:delete')) {
		ellipsisItems.push({ label: 'Eliminar misión', variant: 'danger', onClick: () => setShowDeleteConfirm(true) })
	}

	const eventosEllipsisItems = []
	if (hasPermission('eventos:create')) {
		eventosEllipsisItems.push({ label: 'Registrar evento', onClick: () => setShowAddEvent(true) })
	}

	const handleDelete = () => {
		console.log('Eliminar misión:', mision.misionId)
		navigate(-1)
	}

	const handleStartMission = () => {
		console.log('Iniciar misión:', mision.misionId)
		setShowStartConfirm(false)
	}

	const handleEndMission = () => {
		console.log('Finalizar misión:', mision.misionId)
		setShowEndConfirm(false)
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
							{hasPermission('misiones:start') && mision.estadoMID === 1 && (
								<Button label="Iniciar misión" color="blue" onClick={() => setShowStartConfirm(true)} />
							)}
							{hasPermission('misiones:end') && mision.estadoMID === 3 && (
								<Button label="Finalizar misión" color="red" onClick={() => setShowEndConfirm(true)} />
							)}
							{ellipsisItems.length > 0 && <EllipsisMenu items={ellipsisItems} />}
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
						{eventosEllipsisItems.length > 0 && <EllipsisMenu items={eventosEllipsisItems} />}
					</div>

					<div className="eventos-section">
						{eventos.length > 0 ? (
							eventos.map(evento => (
								<EventItem key={evento.id} event={evento} canDelete={hasPermission('eventos:delete')} />
							))
						) : (
							<div className="no-data">No hay eventos registrados para esta misión</div>
						)}
					</div>

					<div className="section-title">
						<h2>Tripulantes</h2>
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

			<ConfirmModal
				open={showDeleteConfirm}
				title="¿Eliminar misión?"
				message="Esta acción no puede ser revertida. Se eliminará permanentemente la misión y todos sus datos asociados."
				confirmLabel="Eliminar"
				confirmVariant="danger"
				onConfirm={handleDelete}
				onCancel={() => setShowDeleteConfirm(false)}
			/>

			<ConfirmModal
				open={showStartConfirm}
				title="¿Iniciar misión?"
				message="Se registrará el inicio de la misión. Esta acción cambiará el estado de la misión a 'En curso'."
				confirmLabel="Iniciar"
				confirmVariant="primary"
				onConfirm={handleStartMission}
				onCancel={() => setShowStartConfirm(false)}
			/>

			<ConfirmModal
				open={showEndConfirm}
				title="¿Finalizar misión?"
				message="Se registrará la finalización de la misión. Esta acción cambiará el estado de la misión a 'Completada'."
				confirmLabel="Finalizar"
				confirmVariant="danger"
				onConfirm={handleEndMission}
				onCancel={() => setShowEndConfirm(false)}
			/>

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
