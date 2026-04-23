import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { EllipsisMenu } from '../components/EllipsisMenu'
import { ConfirmModal } from '../components/ConfirmModal'
import { useAuth } from '../contexts/AuthContext'
import './Tripulantes.css'
import { TripulanteItem } from '../components/TripulanteItem'

const tripulantesData = [
	{ TripulanteID: 1, EstadoTID: 1, Peso: 78.5, Altura: 1.82, Nombre: 'Carlos', Apellido: 'Rodríguez', FechaDeNacimiento: '1985-03-15', Sexo: 'M' },
	{ TripulanteID: 2, EstadoTID: 1, Peso: 62.0, Altura: 1.68, Nombre: 'María', Apellido: 'González', FechaDeNacimiento: '1990-07-22', Sexo: 'F' },
	{ TripulanteID: 3, EstadoTID: 2, Peso: 85.0, Altura: 1.75, Nombre: 'Juan', Apellido: 'Martínez', FechaDeNacimiento: '1978-11-08', Sexo: 'M' },
	{ TripulanteID: 4, EstadoTID: 1, Peso: 70.2, Altura: 1.90, Nombre: 'Ana', Apellido: 'Pérez', FechaDeNacimiento: '1988-05-30', Sexo: 'F' },
	{ TripulanteID: 5, EstadoTID: 3, Peso: 88.0, Altura: 1.80, Nombre: 'Roberto', Apellido: 'López', FechaDeNacimiento: '1965-09-12', Sexo: 'M' },
	{ TripulanteID: 6, EstadoTID: 2, Peso: 65.5, Altura: 1.72, Nombre: 'Laura', Apellido: 'Sánchez', FechaDeNacimiento: '1992-01-25', Sexo: 'F' },
	{ TripulanteID: 7, EstadoTID: 1, Peso: 82.0, Altura: 1.85, Nombre: 'Diego', Apellido: 'Fernández', FechaDeNacimiento: '1983-12-03', Sexo: 'M' }
]

const estados = [
	{ id: 1, nombre: 'Activo' },
	{ id: 2, nombre: 'Inactivo' },
	{ id: 3, nombre: 'Retirado' }
]

const sexos = [
	{ id: 'M', nombre: 'Masculino' },
	{ id: 'F', nombre: 'Femenino' }
]

export function Tripulantes() {
	const navigate = useNavigate()
	const { hasPermission } = useAuth()
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedEstado, setSelectedEstado] = useState('')
	const [selectedSexo, setSelectedSexo] = useState('')
	const [deleteTarget, setDeleteTarget] = useState(null)

	const filteredTripulantes = tripulantesData.filter(tripulante => {
		const matchesSearch =
			tripulante.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
			tripulante.Apellido.toLowerCase().includes(searchTerm.toLowerCase())

		const matchesEstado = selectedEstado === '' || tripulante.EstadoTID === parseInt(selectedEstado)
		const matchesSexo = selectedSexo === '' || tripulante.Sexo === selectedSexo

		return matchesSearch && matchesEstado && matchesSexo
	})

	const ellipsisItems = []
	if (hasPermission('tripulantes:create')) {
		ellipsisItems.push({
			label: 'Crear tripulante',
			onClick: () => navigate('/Tripulantes/Nuevo')
		})
	}

	const handleDeleteTripulante = (tripulanteId) => {
		setDeleteTarget(tripulanteId)
	}

	const confirmDelete = () => {
		console.log('Eliminar tripulante:', deleteTarget)
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
								placeholder="Buscar tripulante..."
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
									<option key={estado.id} value={estado.id}>{estado.nombre}</option>
								))}
							</select>
							<select
								className="filter-select"
								value={selectedSexo}
								onChange={(e) => setSelectedSexo(e.target.value)}
							>
								<option value="">Todos los sexos</option>
								{sexos.map(sexo => (
									<option key={sexo.id} value={sexo.id}>{sexo.nombre}</option>
								))}
							</select>

							{ellipsisItems.length > 0 && <EllipsisMenu items={ellipsisItems} />}
						</div>
					</div>
					<div className="tripulantes-container">
						{filteredTripulantes.map(tripulante => (
							<TripulanteItem
								key={tripulante.TripulanteID}
								tripulante={tripulante}
								canEdit={hasPermission('tripulantes:edit')}
								canDelete={hasPermission('tripulantes:delete')}
								onDelete={handleDeleteTripulante}
							/>
						))}
					</div>
				</div>
			</div>

			<ConfirmModal
				open={deleteTarget !== null}
				title="¿Eliminar tripulante?"
				message="Esta acción no puede ser revertida. Se eliminará permanentemente el tripulante y todos sus datos asociados."
				confirmLabel="Eliminar"
				confirmVariant="danger"
				onConfirm={confirmDelete}
				onCancel={() => setDeleteTarget(null)}
			/>
		</>
	)
}
