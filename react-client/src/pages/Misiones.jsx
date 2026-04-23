import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { MisionItem } from '../components/MisionItem'
import { DateRangeFilter } from '../components/DateRangeFilter'
import { EllipsisMenu } from '../components/EllipsisMenu'
import { ConfirmModal } from '../components/ConfirmModal'
import { useAuth } from '../contexts/AuthContext'
import './Misiones.css'

const misionesData = [
	{ misionId: 1042, nombre: 'Implementación del módulo de Logs', descripcion: 'Desarrollo del sistema de auditoría y logs del sistema', fechaInicioEstimada: '2026-04-15T09:00:00', fechaFinEstimada: '2026-04-20T18:00:00', retrasoInicio: '+00:00:00', retrasoFin: '-00:00:00', estadoMID: 2, estadoNombre: 'En curso' },
	{ misionId: 1043, nombre: 'Migración de base de datos', descripcion: 'Migración de MySQL a PostgreSQL', fechaInicioEstimada: '2026-04-10T08:00:00', fechaFinEstimada: '2026-04-18T17:00:00', retrasoInicio: '+02:30:00', retrasoFin: '-00:00:00', estadoMID: 2, estadoNombre: 'En curso' },
	{ misionId: 1044, nombre: 'Diseño de interfaz de usuario', descripcion: 'Rediseño completo de la interfaz principal', fechaInicioEstimada: '2026-04-08T09:00:00', fechaFinEstimada: '2026-04-16T18:00:00', retrasoInicio: '+00:00:00', retrasoFin: '-01:45:00', estadoMID: 3, estadoNombre: 'Completada' },
	{ misionId: 1045, nombre: 'Configuración de servidores', descripcion: 'Configuración de los servidores de producción', fechaInicioEstimada: '2026-04-22T10:00:00', fechaFinEstimada: '2026-04-25T16:00:00', retrasoInicio: '00:00:00', retrasoFin: '00:00:00', estadoMID: 1, estadoNombre: 'Pendiente' },
	{ misionId: 1046, nombre: 'Integración de APIs externas', descripcion: 'Conexión con APIs de terceros para sincronización', fechaInicioEstimada: '2026-04-05T09:00:00', fechaFinEstimada: '2026-04-12T18:00:00', retrasoInicio: '+04:00:00', retrasoFin: '-00:00:00', estadoMID: 4, estadoNombre: 'Cancelada' }
]

const estados = [
	{ id: 1, nombre: 'Planificada' },
	{ id: 2, nombre: 'Preparada' },
	{ id: 3, nombre: 'En curso' },
	{ id: 4, nombre: 'Finalizada' },
	{ id: 5, nombre: 'Cancelada' }
]

export function Misiones() {
	const navigate = useNavigate()
	const { hasPermission } = useAuth()
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedEstado, setSelectedEstado] = useState('')
	const [dateRange, setDateRange] = useState([
		{ startDate: null, endDate: null, key: 'selection' }
	])
	const [deleteTarget, setDeleteTarget] = useState(null)

	const filteredMisiones = misionesData.filter(mision => {
		const matchesSearch =
			mision.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
			mision.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
			mision.misionId.toString().includes(searchTerm)

		const matchesEstado = selectedEstado === '' || mision.estadoMID.toString() === selectedEstado

		const matchesDateRange =
			(!dateRange[0].startDate || new Date(mision.fechaInicioEstimada) >= dateRange[0].startDate) &&
			(!dateRange[0].endDate || new Date(mision.fechaInicioEstimada) <= dateRange[0].endDate)

		return matchesSearch && matchesEstado && matchesDateRange
	})

	const ellipsisItems = []
	if (hasPermission('misiones:create')) {
		ellipsisItems.push({
			label: 'Crear misión',
			onClick: () => navigate('/Misiones/Nueva')
		})
	}

	const handleDeleteMision = (misionId) => {
		setDeleteTarget(misionId)
	}

	const confirmDelete = () => {
		console.log('Eliminar misión:', deleteTarget)
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

							<DateRangeFilter
								dateRange={dateRange}
								onDateChange={setDateRange}
							/>

							{ellipsisItems.length > 0 && <EllipsisMenu items={ellipsisItems} />}
						</div>
					</div>

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
								canEdit={hasPermission('misiones:edit')}
								canDelete={hasPermission('misiones:delete')}
								onDelete={handleDeleteMision}
							/>
						))}
						{filteredMisiones.length === 0 && (
							<div className="no-results">
								No se encontraron misiones que coincidan con los filtros
							</div>
						)}
					</div>
				</div>
			</div>

			<ConfirmModal
				open={deleteTarget !== null}
				title="¿Eliminar misión?"
				message="Esta acción no puede ser revertida. Se eliminará permanentemente la misión y todos sus datos asociados."
				confirmLabel="Eliminar"
				confirmVariant="danger"
				onConfirm={confirmDelete}
				onCancel={() => setDeleteTarget(null)}
			/>
		</>
	)
}
