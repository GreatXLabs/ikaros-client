import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { ConfirmModal } from '../components/ConfirmModal'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRight } from "lucide-react"
import { useAuth } from '../contexts/AuthContext'
import { cuentasData, roles } from '../data/cuentasData'
import './NuevaCuenta.css'

export function EditarCuenta() {
	const navigate = useNavigate()
	const { id } = useParams()
	const { user } = useAuth()
	const cuenta = cuentasData.find(c => c.UsuarioID === parseInt(id)) || cuentasData[0]

	if (cuenta.RolID === 1 && user?.RolNombre !== 'Jefe') {
		return (
			<>
				<Background />
				<div className="main-wrapper">
					<Header />
					<div className="main-panel">
						<div className="no-data">Acceso no autorizado</div>
					</div>
				</div>
			</>
		)
	}

	const filteredRoles = user?.RolNombre === 'Jefe'
		? roles
		: roles.filter(r => r.nombre !== 'Jefe')

	const [formData, setFormData] = useState({
		Nombre: cuenta.Nombre,
		Apellido: cuenta.Apellido,
		Usuario: cuenta.Usuario,
		Clave: cuenta.Clave,
		RolID: cuenta.RolID
	})
	const [showCancelConfirm, setShowCancelConfirm] = useState(false)
	const [showSaveConfirm, setShowSaveConfirm] = useState(false)

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSave = () => {
		setShowSaveConfirm(true)
	}

	const confirmSave = () => {
		console.log('Guardar cambios:', formData)
		navigate('/Cuentas')
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
								<BreadcrumbLink href="/Cuentas">Cuentas</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbItem>
								<BreadcrumbLink href={`/Cuentas/${id}`}>{cuenta.Nombre} {cuenta.Apellido}</BreadcrumbLink>
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
						<h1 className="form-title">Editar cuenta</h1>

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

						<div className="form-group">
							<label className="form-label">Usuario</label>
							<input type="text" name="Usuario" className="form-input" placeholder="Nombre de usuario" value={formData.Usuario} onChange={handleChange} />
						</div>

						<div className="form-group">
							<label className="form-label">Contraseña</label>
							<input type="password" name="Clave" className="form-input" placeholder="Contraseña" value={formData.Clave} onChange={handleChange} />
						</div>

						<div className="form-group">
							<label className="form-label">Rol</label>
							<select name="RolID" className="form-input form-select" value={formData.RolID} onChange={handleChange}>
								{filteredRoles.map(rol => (
									<option key={rol.id} value={rol.id}>{rol.nombre}</option>
								))}
							</select>
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
				message="Se actualizarán los datos de la cuenta con la información ingresada."
				confirmLabel="Guardar"
				confirmVariant="primary"
				onConfirm={confirmSave}
				onCancel={() => setShowSaveConfirm(false)}
			/>
		</>
	)
}
