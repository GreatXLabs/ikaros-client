import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { ConfirmModal } from '../components/ConfirmModal'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRight } from "lucide-react"
import './NuevaMision.css'

export function NuevaMision() {
	const navigate = useNavigate()
	const [formData, setFormData] = useState({
		nombre: '',
		descripcion: '',
		fechaInicioEstimada: '',
		fechaFinEstimada: ''
	})
	const [showCancelConfirm, setShowCancelConfirm] = useState(false)
	const [showSaveConfirm, setShowSaveConfirm] = useState(false)

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleCreate = () => {
		setShowSaveConfirm(true)
	}

	const confirmSave = () => {
		console.log('Crear misión:', formData)
		navigate('/Misiones')
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
								<BreadcrumbLink href="/Misiones">Misiones</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbItem isCurrentPage>
								<BreadcrumbLink>Nueva misión</BreadcrumbLink>
							</BreadcrumbItem>
						</Breadcrumb>
						<div className="action-buttons">
							<Button label="Cancelar" color="red" onClick={handleCancel} />
							<Button label="Crear" color="blue" onClick={handleCreate} />
						</div>
					</div>

					<div className="form-container">
						<h1 className="form-title">Nueva misión</h1>

						<div className="form-group">
							<label className="form-label">Nombre</label>
							<input type="text" name="nombre" className="form-input" placeholder="Nombre de la misión" value={formData.nombre} onChange={handleChange} />
						</div>

						<div className="form-group">
							<label className="form-label">Descripción</label>
							<textarea name="descripcion" className="form-textarea" placeholder="Descripción de la misión" value={formData.descripcion} onChange={handleChange} rows={4} />
						</div>

						<div className="form-row">
							<div className="form-group">
								<label className="form-label">Fecha inicio estimada</label>
								<input type="datetime-local" name="fechaInicioEstimada" className="form-input form-datetime" value={formData.fechaInicioEstimada} onChange={handleChange} />
							</div>
							<div className="form-group">
								<label className="form-label">Fecha fin estimada</label>
								<input type="datetime-local" name="fechaFinEstimada" className="form-input form-datetime" value={formData.fechaFinEstimada} onChange={handleChange} />
							</div>
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
				title="¿Crear misión?"
				message="Se creará una nueva misión con los datos ingresados."
				confirmLabel="Crear"
				confirmVariant="primary"
				onConfirm={confirmSave}
				onCancel={() => setShowSaveConfirm(false)}
			/>
		</>
	)
}
