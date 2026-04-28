import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { ConfirmModal } from '../components/ConfirmModal'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRight } from "lucide-react"
import { useAuth } from '../contexts/AuthContext'
import * as api from '../services/ikarosApi'
import './NuevaCuenta.css'

function parseRoles(data) {
	if (!data) return []
	const items = data.split(';')
	return items.map(item => {
		const parts = item.split('~')
		return { id: parseInt(parts[0]), nombre: parts[1]?.toUpperCase() || '' }
	}).filter(r => r.id)
}

export function EditarCuenta() {
	const navigate = useNavigate()
	const { id } = useParams()
	const location = useLocation()
	const { user } = useAuth()
	const [roles, setRoles] = useState([])
	const [formData, setFormData] = useState({
		Nombre: '',
		Apellido: '',
		Usuario: '',
		Clave: '',
		RolID: ''
	})
	const [showCancelConfirm, setShowCancelConfirm] = useState(false)
	const [showSaveConfirm, setShowSaveConfirm] = useState(false)
	const [error, setError] = useState('')

	const cuenta = location.state?.cuenta

	useEffect(() => {
		if (cuenta) {
			setFormData({
				Nombre: cuenta.Nombre || '',
				Apellido: cuenta.Apellido || '',
				Usuario: cuenta.Usuario || '',
				Clave: '',
				RolID: cuenta.RolID || ''
			})
		}

		const fetchRoles = async () => {
			try {
				const res = await api.consultarRoles()
				if (res.success) {
					const parsed = parseRoles(res.data)
					setRoles(parsed)
					if (!cuenta && parsed.length > 0) {
						setFormData(prev => ({ ...prev, RolID: parsed[0].id.toString() }))
					}
				}
			} catch {
				setRoles([])
			}
		}
		fetchRoles()
	}, [])

	if (!cuenta) {
		return (
			<>
				<Background />
				<div className="main-wrapper">
					<Header />
					<div className="main-panel">
						<div className="no-data">No se encontró la cuenta</div>
					</div>
				</div>
			</>
		)
	}

	const filteredRoles = roles.filter(r => r.nombre !== 'JEFE')

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSave = () => {
		setError('')
		setShowSaveConfirm(true)
	}

	const confirmSave = async () => {
		const selectedRole = roles.find(r => r.id.toString() === formData.RolID)
		try {
			const res = await api.modificarUsuario({
				usuario: formData.Usuario,
				nombre: formData.Nombre,
				apellido: formData.Apellido,
				clave: formData.Clave,
				rol: selectedRole?.nombre || ''
			})
			if (res.success) {
				navigate('/Cuentas')
			} else {
				setError(res.message || 'Error al modificar la cuenta')
			}
		} catch {
			setError('Error de conexión con el servidor')
		}
		setShowSaveConfirm(false)
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
								<BreadcrumbLink href={`/Cuentas/${id}`}>{cuenta.Usuario}</BreadcrumbLink>
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

						{error && <p className="form-error">{error}</p>}

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
							<input type="password" name="Clave" className="form-input" placeholder="Nueva contraseña (dejar vacío para mantener)" value={formData.Clave} onChange={handleChange} />
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
