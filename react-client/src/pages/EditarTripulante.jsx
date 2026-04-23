import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { ConfirmModal } from '../components/ConfirmModal'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRight, Plus, X } from "lucide-react"
import './NuevoTripulante.css'

const tripulantesData = {
	1: { TripulanteID: 1, EstadoTID: 1, Peso: 78.5, Altura: 1.82, Nombre: 'Carlos', Apellido: 'Rodríguez', FechaDeNacimiento: '1985-03-15', Sexo: 'M', aptitudes: [{ id: 1, nombre: 'Piloto de naves', calificacion: 9, fechaExamen: '2026-01-15' }, { id: 2, nombre: 'Reparación de sistemas', calificacion: 7, fechaExamen: '2026-02-20' }, { id: 3, nombre: 'Primeros auxilios', calificacion: 8, fechaExamen: '2026-03-10' }] },
	2: { TripulanteID: 2, EstadoTID: 1, Peso: 62.0, Altura: 1.68, Nombre: 'María', Apellido: 'González', FechaDeNacimiento: '1990-07-22', Sexo: 'F', aptitudes: [{ id: 1, nombre: 'Comunicaciones', calificacion: 10, fechaExamen: '2026-01-05' }, { id: 2, nombre: 'Primeros auxilios', calificacion: 9, fechaExamen: '2026-02-15' }] },
	3: { TripulanteID: 3, EstadoTID: 2, Peso: 85.0, Altura: 1.75, Nombre: 'Juan', Apellido: 'Martínez', FechaDeNacimiento: '1978-11-08', Sexo: 'M', aptitudes: [{ id: 1, nombre: 'Piloto de naves', calificacion: 6, fechaExamen: '2026-01-20' }] },
	4: { TripulanteID: 4, EstadoTID: 1, Peso: 70.2, Altura: 1.90, Nombre: 'Ana', Apellido: 'Pérez', FechaDeNacimiento: '1988-05-30', Sexo: 'F', aptitudes: [{ id: 1, nombre: 'Ingeniería de propulsión', calificacion: 9, fechaExamen: '2026-03-01' }, { id: 2, nombre: 'Reparación de sistemas', calificacion: 8, fechaExamen: '2026-03-15' }] },
	5: { TripulanteID: 5, EstadoTID: 3, Peso: 88.0, Altura: 1.80, Nombre: 'Roberto', Apellido: 'López', FechaDeNacimiento: '1965-09-12', Sexo: 'M', aptitudes: [] },
	6: { TripulanteID: 6, EstadoTID: 2, Peso: 65.5, Altura: 1.72, Nombre: 'Laura', Apellido: 'Sánchez', FechaDeNacimiento: '1992-01-25', Sexo: 'F', aptitudes: [{ id: 1, nombre: 'Médico de vuelo', calificacion: 10, fechaExamen: '2026-02-01' }] },
	7: { TripulanteID: 7, EstadoTID: 1, Peso: 82.0, Altura: 1.85, Nombre: 'Diego', Apellido: 'Fernández', FechaDeNacimiento: '1983-12-03', Sexo: 'M', aptitudes: [{ id: 1, nombre: 'Navegación espacial', calificacion: 9, fechaExamen: '2026-01-10' }, { id: 2, nombre: 'Comunicaciones', calificacion: 7, fechaExamen: '2026-02-25' }] }
}

const estados = [
	{ id: 1, nombre: 'Activo' },
	{ id: 2, nombre: 'Inactivo' },
	{ id: 3, nombre: 'Retirado' }
]

export function EditarTripulante() {
	const navigate = useNavigate()
	const { id } = useParams()
	const tripulante = tripulantesData[id] || Object.values(tripulantesData)[0]

	const [formData, setFormData] = useState({
		Nombre: tripulante.Nombre,
		Apellido: tripulante.Apellido,
		Peso: tripulante.Peso,
		Altura: tripulante.Altura,
		Sexo: tripulante.Sexo,
		FechaDeNacimiento: tripulante.FechaDeNacimiento,
		EstadoTID: tripulante.EstadoTID,
		aptitudes: tripulante.aptitudes.length > 0
			? tripulante.aptitudes.map(a => ({ nombre: a.nombre, calificacion: a.calificacion.toString(), fechaExamen: a.fechaExamen }))
			: [{ nombre: '', calificacion: '', fechaExamen: '' }]
	})
	const [showCancelConfirm, setShowCancelConfirm] = useState(false)
	const [showSaveConfirm, setShowSaveConfirm] = useState(false)

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleAptitudChange = (index, field, value) => {
		setFormData(prev => {
			const newAptitudes = [...prev.aptitudes]
			newAptitudes[index] = { ...newAptitudes[index], [field]: value }
			return { ...prev, aptitudes: newAptitudes }
		})
	}

	const addAptitud = () => {
		setFormData(prev => ({
			...prev,
			aptitudes: [...prev.aptitudes, { nombre: '', calificacion: '', fechaExamen: '' }]
		}))
	}

	const removeAptitud = (index) => {
		setFormData(prev => ({
			...prev,
			aptitudes: prev.aptitudes.filter((_, i) => i !== index)
		}))
	}

	const handleSave = () => {
		setShowSaveConfirm(true)
	}

	const confirmSave = () => {
		console.log('Guardar cambios:', formData)
		navigate(`/Tripulantes/${id}`)
	}

	const handleCancel = () => {
		setShowCancelConfirm(true)
	}

	const confirmCancel = () => {
		navigate(-1)
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
								<BreadcrumbLink href="/Tripulantes">Tripulantes</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbItem>
								<BreadcrumbLink href={`/Tripulantes/${id}`}>{tripulante.Nombre} {tripulante.Apellido}</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbItem isCurrentPage>
								<BreadcrumbLink>Editar</BreadcrumbLink>
							</BreadcrumbItem>
						</Breadcrumb>
						<div className="action-buttons">
							<Button label="Cancelar" color="red" onClick={handleCancel} />
							<Button label="Guardar" color="blue" onClick={handleSave} />
						</div>
					</div>

					<div className="form-container">
						<h1 className="form-title">Editar tripulante</h1>

						<div className="form-row">
							<div className="form-group">
								<label className="form-label">Nombre</label>
								<input type="text" name="Nombre" className="form-input" placeholder="Nombre" value={formData.Nombre} onChange={handleChange} />
							</div>
							<div className="form-group">
								<label className="form-label">Apellido</label>
								<input type="text" name="Apellido" className="form-input" placeholder="Apellido" value={formData.Apellido} onChange={handleChange} />
							</div>
						</div>

						<div className="form-row">
							<div className="form-group">
								<label className="form-label">Peso (kg)</label>
								<input type="number" name="Peso" className="form-input" placeholder="70.5" step="0.1" value={formData.Peso} onChange={handleChange} />
							</div>
							<div className="form-group">
								<label className="form-label">Altura (m)</label>
								<input type="number" name="Altura" className="form-input" placeholder="1.75" step="0.01" value={formData.Altura} onChange={handleChange} />
							</div>
						</div>

						<div className="form-row">
							<div className="form-group">
								<label className="form-label">Sexo</label>
								<select name="Sexo" className="form-input form-select" value={formData.Sexo} onChange={handleChange}>
									<option value="M">Masculino</option>
									<option value="F">Femenino</option>
								</select>
							</div>
							<div className="form-group">
								<label className="form-label">Estado</label>
								<select name="EstadoTID" className="form-input form-select" value={formData.EstadoTID} onChange={handleChange}>
									{estados.map(estado => (
										<option key={estado.id} value={estado.id}>{estado.nombre}</option>
									))}
								</select>
							</div>
						</div>

						<div className="form-group">
							<label className="form-label">Fecha de nacimiento</label>
							<input type="date" name="FechaDeNacimiento" className="form-input" value={formData.FechaDeNacimiento} onChange={handleChange} />
						</div>

						<h2 className="form-section-title">Aptitudes</h2>

						<div className="aptitudes-form-section">
							{formData.aptitudes.map((aptitud, index) => (
								<div key={index} className="aptitud-form-row">
									<div className="form-group aptitud-nombre-group">
										<input
											type="text"
											className="form-input"
											placeholder="Nombre de aptitud"
											value={aptitud.nombre}
											onChange={(e) => handleAptitudChange(index, 'nombre', e.target.value)}
										/>
									</div>
									<div className="form-group aptitud-calif-group">
										<input
											type="number"
											className="form-input"
											placeholder="1-10"
											min="1"
											max="10"
											value={aptitud.calificacion}
											onChange={(e) => handleAptitudChange(index, 'calificacion', e.target.value)}
										/>
									</div>
									<div className="form-group aptitud-fecha-group">
										<input
											type="date"
											className="form-input"
											value={aptitud.fechaExamen}
											onChange={(e) => handleAptitudChange(index, 'fechaExamen', e.target.value)}
										/>
									</div>
									{formData.aptitudes.length > 1 && (
										<button type="button" className="aptitud-remove-btn" onClick={() => removeAptitud(index)}>
											<X size={16} />
										</button>
									)}
								</div>
							))}
							<button type="button" className="add-aptitud-btn" onClick={addAptitud}>
								<Plus size={16} /> Agregar aptitud
							</button>
						</div>
					</div>
				</div>
			</div>

			<ConfirmModal
				open={showCancelConfirm}
				title="¿Estás seguro?"
				message="Los cambios no podrán ser revertidos. Perderás las modificaciones realizadas."
				confirmLabel="Sí, cancelar"
				confirmVariant="danger"
				onConfirm={confirmCancel}
				onCancel={() => setShowCancelConfirm(false)}
			/>

			<ConfirmModal
				open={showSaveConfirm}
				title="¿Guardar cambios?"
				message="Se actualizarán los datos del tripulante con la información ingresada."
				confirmLabel="Guardar"
				confirmVariant="primary"
				onConfirm={confirmSave}
				onCancel={() => setShowSaveConfirm(false)}
			/>
		</>
	)
}
