import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRight } from "lucide-react"
import { Infoshow } from '../components/Infoshow'
import { EllipsisMenu } from '../components/EllipsisMenu'
import { ConfirmModal } from '../components/ConfirmModal'
import { useAuth } from '../contexts/AuthContext'
import './TripulanteView.css'

const tripulantesData = {
	1: { TripulanteID: 1, EstadoTID: 1, Peso: 78.5, Altura: 1.82, Nombre: 'Carlos', Apellido: 'Rodríguez', FechaDeNacimiento: '1985-03-15', Sexo: 'M', aptitudes: [{ id: 1, nombre: 'Piloto de naves', calificacion: 9, fechaExamen: '2026-01-15' }, { id: 2, nombre: 'Reparación de sistemas', calificacion: 7, fechaExamen: '2026-02-20' }, { id: 3, nombre: 'Primeros auxilios', calificacion: 8, fechaExamen: '2026-03-10' }], misiones: [{ misionId: 1042, nombre: 'Implementación del módulo de Logs', fechaInicioEstimada: '2026-04-15T09:00:00', fechaFinEstimada: '2026-04-20T18:00:00', estadoNombre: 'En curso' }] },
	2: { TripulanteID: 2, EstadoTID: 1, Peso: 62.0, Altura: 1.68, Nombre: 'María', Apellido: 'González', FechaDeNacimiento: '1990-07-22', Sexo: 'F', aptitudes: [{ id: 1, nombre: 'Comunicaciones', calificacion: 10, fechaExamen: '2026-01-05' }, { id: 2, nombre: 'Primeros auxilios', calificacion: 9, fechaExamen: '2026-02-15' }], misiones: [{ misionId: 1042, nombre: 'Implementación del módulo de Logs', fechaInicioEstimada: '2026-04-15T09:00:00', fechaFinEstimada: '2026-04-20T18:00:00', estadoNombre: 'En curso' }, { misionId: 1043, nombre: 'Migración de base de datos', fechaInicioEstimada: '2026-04-10T08:00:00', fechaFinEstimada: '2026-04-18T17:00:00', estadoNombre: 'En curso' }] },
	3: { TripulanteID: 3, EstadoTID: 2, Peso: 85.0, Altura: 1.75, Nombre: 'Juan', Apellido: 'Martínez', FechaDeNacimiento: '1978-11-08', Sexo: 'M', aptitudes: [{ id: 1, nombre: 'Piloto de naves', calificacion: 6, fechaExamen: '2026-01-20' }], misiones: [{ misionId: 1043, nombre: 'Migración de base de datos', fechaInicioEstimada: '2026-04-10T08:00:00', fechaFinEstimada: '2026-04-18T17:00:00', estadoNombre: 'En curso' }] },
	4: { TripulanteID: 4, EstadoTID: 1, Peso: 70.2, Altura: 1.90, Nombre: 'Ana', Apellido: 'Pérez', FechaDeNacimiento: '1988-05-30', Sexo: 'F', aptitudes: [{ id: 1, nombre: 'Ingeniería de propulsión', calificacion: 9, fechaExamen: '2026-03-01' }, { id: 2, nombre: 'Reparación de sistemas', calificacion: 8, fechaExamen: '2026-03-15' }], misiones: [{ misionId: 1044, nombre: 'Diseño de interfaz de usuario', fechaInicioEstimada: '2026-04-08T09:00:00', fechaFinEstimada: '2026-04-16T18:00:00', estadoNombre: 'Completada' }] },
	5: { TripulanteID: 5, EstadoTID: 3, Peso: 88.0, Altura: 1.80, Nombre: 'Roberto', Apellido: 'López', FechaDeNacimiento: '1965-09-12', Sexo: 'M', aptitudes: [], misiones: [] },
	6: { TripulanteID: 6, EstadoTID: 2, Peso: 65.5, Altura: 1.72, Nombre: 'Laura', Apellido: 'Sánchez', FechaDeNacimiento: '1992-01-25', Sexo: 'F', aptitudes: [{ id: 1, nombre: 'Médico de vuelo', calificacion: 10, fechaExamen: '2026-02-01' }], misiones: [] },
	7: { TripulanteID: 7, EstadoTID: 1, Peso: 82.0, Altura: 1.85, Nombre: 'Diego', Apellido: 'Fernández', FechaDeNacimiento: '1983-12-03', Sexo: 'M', aptitudes: [{ id: 1, nombre: 'Navegación espacial', calificacion: 9, fechaExamen: '2026-01-10' }, { id: 2, nombre: 'Comunicaciones', calificacion: 7, fechaExamen: '2026-02-25' }], misiones: [{ misionId: 1044, nombre: 'Diseño de interfaz de usuario', fechaInicioEstimada: '2026-04-08T09:00:00', fechaFinEstimada: '2026-04-16T18:00:00', estadoNombre: 'Completada' }] }
}

const misionesDisponibles = [
	{ misionId: 1045, nombre: 'Configuración de servidores', estadoNombre: 'Pendiente' },
	{ misionId: 1047, nombre: 'Pruebas de integración', estadoNombre: 'Pendiente' },
	{ misionId: 1048, nombre: 'Capacitación del equipo', estadoNombre: 'Pendiente' }
]

const estados = { 1: 'Activo', 2: 'Inactivo', 3: 'Retirado' }
const sexos = { 'M': 'Masculino', 'F': 'Femenino' }

function formatDate(dateStr) {
	if (!dateStr) return '—'
	const date = new Date(dateStr)
	return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatDateTime(dateStr) {
	if (!dateStr) return '—'
	const date = new Date(dateStr)
	return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' +
		date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

const estadoColors = { 'Pendiente': 'pendiente', 'En curso': 'en-curso', 'Completada': 'completada', 'Cancelada': 'cancelada' }

export function TripulanteView() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { hasPermission } = useAuth()
	const tripulante = tripulantesData[id]
	const [showAssignModal, setShowAssignModal] = useState(false)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	const ellipsisItems = []
	if (hasPermission('tripulantes:edit')) {
		ellipsisItems.push({ label: 'Editar tripulante', onClick: () => navigate(`/Tripulantes/${id}/Editar`) })
	}
	if (hasPermission('tripulantes:delete')) {
		ellipsisItems.push({ label: 'Eliminar tripulante', variant: 'danger', onClick: () => setShowDeleteConfirm(true) })
	}

	const handleAssignMision = (misionId) => {
		console.log('Asignar misión:', misionId, 'a tripulante:', id)
		setShowAssignModal(false)
	}

	const handleDelete = () => {
		console.log('Eliminar tripulante:', id)
		navigate(-1)
	}

	if (!tripulante) {
		return (
			<>
				<Background />
				<div className="main-wrapper">
					<Header />
					<div className="main-panel">
						<div className="no-data">Tripulante no encontrado</div>
					</div>
				</div>
			</>
		)
	}

	const nombreCompleto = `${tripulante.Nombre} ${tripulante.Apellido}`

	return (
		<>
			<Background />
			<div className="main-wrapper">
				<Header />
				<div className="main-panel">
					<div className="top-line">
						<Breadcrumb separator={<ChevronRight size={14} color="gray" />}>
							<BreadcrumbItem>
								<BreadcrumbLink href="/Tripulantes">Tripulantes</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbItem isCurrentPage>
								<BreadcrumbLink>{nombreCompleto}</BreadcrumbLink>
							</BreadcrumbItem>
						</Breadcrumb>
						<div className="action-buttons">
							{ellipsisItems.length > 0 && <EllipsisMenu items={ellipsisItems} />}
						</div>
					</div>

					<div className="hero">
						<img src="" alt="" />
						<h1 className='tripulante-nombre'>{nombreCompleto}</h1>
					</div>

					<div className="tripulante-info">
						<div className='id-info'>
							<Infoshow label="ID" subtitle="" content={tripulante.TripulanteID.toString().padStart(3, '0')} />
							<Infoshow label="Estado" subtitle="" content={estados[tripulante.EstadoTID]} />
						</div>
						<div className='personal-info'>
							<Infoshow label="Altura" subtitle="" content={`${tripulante.Altura}m`} />
							<Infoshow label="Peso" subtitle="" content={`${tripulante.Peso}kg`} />
							<Infoshow label="Sexo" subtitle="" content={sexos[tripulante.Sexo]} />
						</div>
						<div className='date-info'>
							<Infoshow label="Fecha de nacimiento" subtitle="" content={formatDate(tripulante.FechaDeNacimiento)} />
						</div>
					</div>

					<div className="section-title">
						<h2>Aptitudes</h2>
					</div>

					<div className="aptitudes-section">
						{tripulante.aptitudes.length > 0 ? (
							tripulante.aptitudes.map(aptitud => (
								<div key={aptitud.id} className="aptitude-item">
									<div className="aptitude-top">
										<span className="aptitude-nombre">{aptitud.nombre}</span>
										<span className="aptitude-calificacion">{aptitud.calificacion}/10</span>
									</div>
									<span className="aptitude-fecha">Examen: {formatDate(aptitud.fechaExamen)}</span>
								</div>
							))
						) : (
							<div className="no-data">No hay aptitudes registradas</div>
						)}
					</div>

					<div className="section-title-with-action">
						<h2>Misiones asignadas</h2>
						{hasPermission('tripulantes:assign-mission') && (
							<EllipsisMenu items={[{ label: 'Asignar misión', onClick: () => setShowAssignModal(true) }]} />
						)}
					</div>

					<div className="misiones-table-container">
						{tripulante.misiones.length > 0 ? (
							<div className="misiones-table">
								<div className="misiones-table-header">
									<span>ID</span>
									<span>Nombre</span>
									<span>Fecha Inicio</span>
									<span>Fecha Finalización</span>
									<span>Estado</span>
								</div>
								{tripulante.misiones.map(mision => (
									<div
										key={mision.misionId}
										className="misiones-table-row"
										onClick={() => navigate(`/Misiones/${mision.misionId}`)}
									>
										<span>{mision.misionId}</span>
										<span>{mision.nombre}</span>
										<span>{formatDateTime(mision.fechaInicioEstimada)}</span>
										<span>{formatDateTime(mision.fechaFinEstimada)}</span>
										<span className={`estado-badge ${estadoColors[mision.estadoNombre] || ''}`}>
											{mision.estadoNombre}
										</span>
									</div>
								))}
							</div>
						) : (
							<div className="no-data">No hay misiones asignadas</div>
						)}
					</div>
				</div>
			</div>

			{showAssignModal && (
				<div className="modal-overlay" onClick={(e) => { if (e.target.className === 'modal-overlay') setShowAssignModal(false) }}>
					<div className="modal-content modal-content-wide">
						<h2>Asignar misión</h2>
						<p>Selecciona una misión pendiente para asignar a {nombreCompleto}.</p>
						<div className="modal-misiones-list">
							{misionesDisponibles.length > 0 ? (
								<>
									<div className="modal-misiones-header">
										<span>Nombre</span>
										<span>Estado</span>
									</div>
									{misionesDisponibles.map(mision => (
										<div
											key={mision.misionId}
											className="modal-mision-item"
											onClick={() => handleAssignMision(mision.misionId)}
										>
											<span className="modal-mision-nombre">{mision.nombre}</span>
											<span className={`estado-badge ${estadoColors[mision.estadoNombre] || ''}`}>
												{mision.estadoNombre}
											</span>
										</div>
									))}
								</>
							) : (
								<div className="no-data">No hay misiones pendientes disponibles</div>
							)}
						</div>
						<div className="modal-buttons">
							<button className="modal-cancel-btn" onClick={() => setShowAssignModal(false)}>
								Cancelar
							</button>
						</div>
					</div>
				</div>
			)}

			<ConfirmModal
				open={showDeleteConfirm}
				title="¿Eliminar tripulante?"
				message="Esta acción no puede ser revertida. Se eliminará permanentemente el tripulante y todos sus datos asociados."
				confirmLabel="Eliminar"
				confirmVariant="danger"
				onConfirm={handleDelete}
				onCancel={() => setShowDeleteConfirm(false)}
			/>
		</>
	)
}
