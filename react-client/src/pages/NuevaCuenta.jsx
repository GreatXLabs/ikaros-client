import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { ConfirmModal } from '../components/ConfirmModal'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRight } from "lucide-react"
import { useAuth } from '../contexts/AuthContext'
import * as api from '../services/ikarosApi'
import './NuevaCuenta.css'

function parseUsuarios(data) {
  if (!data) return []
  return data.split(';').map(item => {
    const parts = item.split('~')
    return { Usuario: parts[1] || '' }
  }).filter(u => u.Usuario)
}

function parseRoles(data) {
	if (!data) return []
	const items = data.split(';')
	return items.map(item => {
		const parts = item.split('~')
		return { id: parseInt(parts[0]), nombre: parts[1]?.toUpperCase() || '' }
	}).filter(r => r.id)
}

export function NuevaCuenta() {
	const navigate = useNavigate()
	const { user: _user } = useAuth()
	const [roles, setRoles] = useState([])
	const [usuariosExistentes, setUsuariosExistentes] = useState([])
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

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [rolesRes, usuariosRes] = await Promise.all([
					api.consultarRoles(),
					api.listarUsuarios()
				])
				if (rolesRes.success) {
					const parsed = parseRoles(rolesRes.data).filter(r => r.nombre !== 'JEFE')
					setRoles(parsed)
					if (parsed.length > 0) {
						setFormData(prev => ({ ...prev, RolID: parsed[0].id }))
					}
				}
				if (usuariosRes.success) {
					setUsuariosExistentes(parseUsuarios(usuariosRes.data))
				}
			} catch {
				setRoles([])
			}
		}
		fetchData()
	}, [])

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleCreate = () => {
		setError('')
		if (!formData.Nombre.trim() || !formData.Apellido.trim() || !formData.Usuario.trim() || !formData.Clave.trim()) {
			setError('Completá todos los campos obligatorios')
			return
		}
		if (usuariosExistentes.some(u => u.Usuario.toLowerCase() === formData.Usuario.trim().toLowerCase())) {
			setError('El nombre de usuario ya existe')
			return
		}
		setShowSaveConfirm(true)
	}

	const confirmSave = async () => {
		const selectedRole = roles.find(r => r.id.toString() === formData.RolID.toString())
		try {
			const res = await api.registrarUsuario({
				usuario: formData.Usuario,
				nombre: formData.Nombre,
				apellido: formData.Apellido,
				clave: formData.Clave,
				rol: selectedRole?.nombre || 'COORDINADOR'
			})
			if (res.success) {
				navigate('/Cuentas')
			} else {
				setError(res.message || 'Error al crear la cuenta')
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
							<BreadcrumbItem isCurrentPage>
								<BreadcrumbLink>Nueva cuenta</BreadcrumbLink>
							</BreadcrumbItem>
						</Breadcrumb>
						<div className="action-buttons">
							<Button label="Cancelar" color="red" onClick={handleCancel} />
							<Button label="Crear" color="blue" onClick={handleCreate} />
						</div>
					</div>

					<div className="form-container">
						<h1 className="form-title">Nueva cuenta</h1>

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
							<input type="password" name="Clave" className="form-input" placeholder="Contraseña" value={formData.Clave} onChange={handleChange} />
						</div>

						<div className="form-group">
							<label className="form-label">Rol</label>
							<select name="RolID" className="form-input form-select" value={formData.RolID} onChange={handleChange}>
								{roles.map(rol => (
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
				message="Los cambios no podrán ser revertidos. Perderás toda la información ingresada."
				confirmLabel="Sí, cancelar"
				confirmVariant="danger"
				onConfirm={confirmCancel}
				onCancel={() => setShowCancelConfirm(false)}
			/>

			<ConfirmModal
				open={showSaveConfirm}
				title="¿Crear cuenta?"
				message="Se creará una nueva cuenta con los datos ingresados."
				confirmLabel="Crear"
				confirmVariant="primary"
				onConfirm={confirmSave}
				onCancel={() => setShowSaveConfirm(false)}
			/>
		</>
	)
}
