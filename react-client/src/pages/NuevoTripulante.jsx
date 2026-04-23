import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { ConfirmModal } from '../components/ConfirmModal'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRight, Plus, X } from "lucide-react"
import './NuevoTripulante.css'

const estados = [
	{ id: 1, nombre: 'Activo' },
	{ id: 2, nombre: 'Inactivo' },
	{ id: 3, nombre: 'Retirado' }
]

export function NuevoTripulante() {
	const navigate = useNavigate()
	const [formData, setFormData] = useState({
		Nombre: '',
		Apellido: '',
		Peso: '',
		Altura: '',
		Sexo: 'M',
		FechaDeNacimiento: '',
		EstadoTID: 1,
		aptitudes: [{ nombre: '', calificacion: '', fechaExamen: '' }]
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

	const handleCreate = () => {
		setShowSaveConfirm(true)
	}

	const confirmSave = () => {
		console.log('Crear tripulante:', formData)
		navigate('/Tripulantes')
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
							<BreadcrumbItem isCurrentPage>
								<BreadcrumbLink>Nuevo tripulante</BreadcrumbLink>
							</BreadcrumbItem>
						</Breadcrumb>
						<div className="action-buttons">
							<Button label="Cancelar" color="red" onClick={handleCancel} />
							<Button label="Crear" color="blue" onClick={handleCreate} />
						</div>
					</div>

					<div className="form-container">
						<h1 className="form-title">Nuevo tripulante</h1>

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
				message="Los cambios no podrán ser revertidos. Perderás toda la información ingresada."
				confirmLabel="Sí, cancelar"
				confirmVariant="danger"
				onConfirm={confirmCancel}
				onCancel={() => setShowCancelConfirm(false)}
			/>

			<ConfirmModal
				open={showSaveConfirm}
				title="¿Crear tripulante?"
				message="Se creará un nuevo tripulante con los datos y aptitudes ingresadas."
				confirmLabel="Crear"
				confirmVariant="primary"
				onConfirm={confirmSave}
				onCancel={() => setShowSaveConfirm(false)}
			/>
		</>
	)
}
