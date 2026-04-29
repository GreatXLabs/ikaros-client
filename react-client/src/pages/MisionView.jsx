
import { useState, useEffect } from 'react'
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
import { ChevronRight } from "lucide-react"
import { Infoshow } from '../components/Infoshow'
import { useAuth } from '../contexts/AuthContext'
import * as api from '../services/ikarosApi'
import './MisionView.css'

function parseMision(data) {
	if (!data) return null
	const parts = data.split('|')
	return {
		misionId: parts[0] || '',
		nombre: parts[1] || '',
		descripcion: parts[2] || '',
		estadoNombre: parts[3] || '',
		fechaInicioEstimada: parts[4] || '',
		fechaFinEstimada: parts[5] || '',
		retrasoInicio: parts[6] || '',
		retrasoFin: parts[7] || ''
	}
}

function parseEventos(data, misionNombre) {
	if (!data) return []
	const items = data.split(';')
	return items.map(item => {
		const parts = item.split('~')
		return {
			id: parseInt(parts[0]) || 0,
			misionNombre: misionNombre || '',
			titulo: parts[1] || '',
			fecha: parts[2] || '',
			descripcion: parts[3] || '',
			estadoNombre: parts[4] || ''
		}
	}).filter(e => e.id)
}

function calcularFechaReal(fechaEstimada, retrasoSegundos) {
  if (!fechaEstimada || !retrasoSegundos) return null
  const retraso = parseInt(retrasoSegundos)
  if (isNaN(retraso)) return null
  return new Date(new Date(fechaEstimada).getTime() + retraso * 1000)
}

function formatFecha(fechaStr) {
	if (!fechaStr) return '—'
	const d = new Date(fechaStr)
	if (isNaN(d.getTime())) return fechaStr
	return d.toLocaleDateString('es-AR', {
		day: '2-digit', month: '2-digit', year: 'numeric',
		hour: '2-digit', minute: '2-digit'
	})
}


export function MisionView() {
	const { id } = useParams()
	const navigate = useNavigate()
	const { hasPermission } = useAuth()
	const [mision, setMision] = useState(null)
	const [eventos, setEventos] = useState([])
	const [tripulantes, setTripulantes] = useState([])
	const [loading, setLoading] = useState(true)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const [showStartConfirm, setShowStartConfirm] = useState(false)
	const [showEndConfirm, setShowEndConfirm] = useState(false)
	const [showAddEvent, setShowAddEvent] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		loadData()
	}, [id])
	const loadData = async () => {
		setLoading(true)
		try {
			const [misionRes, eventosRes, tripRes] = await Promise.all([
				api.consultarMision(id),
				api.consultarEventos(id),
				api.listarTripulantesMision(id)
			])

			const parsedMision = misionRes.success ? parseMision(misionRes.data) : null

			if (parsedMision) {
				setMision(parsedMision)
			} else {
				setError(misionRes.message || 'Misión no encontrada')
			}

			if (eventosRes.success) {
				setEventos(parseEventos(eventosRes.data, parsedMision?.nombre || ''))
			}

			if (tripRes.success && tripRes.data) {
				const tripItems = tripRes.data.split(';').map(item => {
					const parts = item.split('~')
					return { TripulanteID: parseInt(parts[0]) || 0, Nombre: parts[1] || '', Apellido: parts[2] || '', Imagen: parts[3] || '', Estado: parts[4] || '' }
				}).filter(t => t.TripulanteID)
				setTripulantes(tripItems)
			}
		} catch {
			setError('Error de conexión con el servidor')
		}
		setLoading(false)
	}

	if (loading) {
		return (
			<>
				<Background />
				<div className="main-wrapper">
					<Header />
					<div className="main-panel">
						<div className="no-data">Cargando misión...</div>
					</div>
				</div>
			</>
		)
	}

	if (!mision) {
		return (
			<>
				<Background />
				<div className="main-wrapper">
					<Header />
					<div className="main-panel">
						<div className="no-data">{error || 'Misión no encontrada'}</div>
					</div>
				</div>
			</>
		)
	}


	const ellipsisItems = []
	if (hasPermission('misiones:edit')) {
		ellipsisItems.push({ label: 'Editar misión', onClick: () => navigate(`/Misiones/${id}/Editar`) })
	}
	if (hasPermission('misiones:delete')) {
		ellipsisItems.push({ label: 'Cancelar misión', variant: 'danger', onClick: () => setShowDeleteConfirm(true) })
	}

	const eventosEllipsisItems = []
	if (hasPermission('eventos:create')) {
		eventosEllipsisItems.push({ label: 'Registrar evento', onClick: () => setShowAddEvent(true) })
	}

	const handleDelete = async () => {
		await api.actualizarEstadoMision(id, 'CANCELADA')
		navigate('/Misiones')
	}

	const handleStartMission = async () => {
		let retrasoInicio = null
		if (mision.fechaInicioEstimada) {
			const estimada = new Date(mision.fechaInicioEstimada).getTime()
			const ahora = Date.now()
			retrasoInicio = Math.round((ahora - estimada) / 1000)
		}
		await api.actualizarEstadoMision(id, 'EN CURSO', retrasoInicio, undefined)
		setShowStartConfirm(false)
		loadData()
	}

	const handleEndMission = async () => {
		let retrasoFin = null
		if (mision.fechaFinEstimada) {
			const estimada = new Date(mision.fechaFinEstimada).getTime()
			const ahora = Date.now()
			retrasoFin = Math.round((ahora - estimada) / 1000)
		}
		await api.actualizarEstadoMision(id, 'FINALIZADA', undefined, retrasoFin)
		setShowEndConfirm(false)
		loadData()
	}

	const handleAddEvent = async (evento) => {
		await api.registrarEvento(evento)
		setShowAddEvent(false)
		loadData()
	}

	const handleDeleteEvent = async (eventoId) => {
		await api.bajaEvento(eventoId)
		loadData()
	}

	const misionesList = [{ id: parseInt(id), nombre: mision.nombre }]

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
							{hasPermission('misiones:start') && mision.estadoNombre?.toUpperCase() === 'PLANIFICADA' && (
								<Button label="Iniciar misión" color="blue" onClick={() => setShowStartConfirm(true)} />
							)}
							{hasPermission('misiones:end') && mision.estadoNombre?.toUpperCase() === 'EN CURSO' && (
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
							<div className="time">
								<Infoshow label="Fecha inicio" subtitle="Estimada" content={formatFecha(mision.fechaInicioEstimada)} />
								<Infoshow label="Fecha finalización" subtitle="Estimada" content={formatFecha(mision.fechaFinEstimada)} />
							</div>
							<div className="time">
								<Infoshow  subtitle="Real" content={formatFecha(calcularFechaReal(mision.fechaInicioEstimada, mision.retrasoInicio))} />
								<Infoshow  subtitle="Real" content={formatFecha(calcularFechaReal(mision.fechaFinEstimada, mision.retrasoFin))} />
							</div>
							
						</div>
					</div>

					<div className="section-title-with-action">
						<h2>Eventos registrados</h2>
						{eventosEllipsisItems.length > 0 && <EllipsisMenu items={eventosEllipsisItems} />}
					</div>

					<div className="eventos-section">
						{eventos.length > 0 ? (
							eventos.map(evento => (
								<EventItem key={evento.id} event={evento} canDelete={hasPermission('eventos:delete')} onDelete={handleDeleteEvent} />
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
				title="¿Cancelar misión?"
				message="Esta acción cambiará el estado de la misión a 'Cancelada'."
				confirmLabel="Cancelar misión"
				confirmVariant="danger"
				onConfirm={handleDelete}
				onCancel={() => setShowDeleteConfirm(false)}
			/>

			<ConfirmModal
				open={showStartConfirm}
				title="¿Iniciar misión?"
				message="Se registrará el inicio de la misión. Esta acción cambiará el estado a 'En curso'."
				confirmLabel="Iniciar"
				confirmVariant="primary"
				onConfirm={handleStartMission}
				onCancel={() => setShowStartConfirm(false)}
			/>

			<ConfirmModal
				open={showEndConfirm}
				title="¿Finalizar misión?"
				message="Se registrará la finalización de la misión. Esta acción cambiará el estado a 'Finalizada'."
				confirmLabel="Finalizar"
				confirmVariant="danger"
				onConfirm={handleEndMission}
				onCancel={() => setShowEndConfirm(false)}
			/>

			{showAddEvent && (
				<AddEventForm
					misiones={misionesList}
					defaultMisionId={parseInt(id)}
					onClose={() => setShowAddEvent(false)}
					onSubmit={handleAddEvent}
				/>
			)}
		</>
	)
}
