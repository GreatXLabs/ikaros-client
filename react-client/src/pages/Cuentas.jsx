import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { CuentaItem } from '../components/CuentaItem'
import { EllipsisMenu } from '../components/EllipsisMenu'
import { ConfirmModal } from '../components/ConfirmModal'
import { useAuth } from '../contexts/AuthContext'
import { cuentasData, roles } from '../data/cuentasData'
import './Cuentas.css'

export function Cuentas() {
	const navigate = useNavigate()
	const { hasPermission, user } = useAuth()
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedRol, setSelectedRol] = useState('')
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const [cuentaToDelete, setCuentaToDelete] = useState(null)

	const filteredCuentas = cuentasData.filter(cuenta => {
		const matchesSearch =
			cuenta.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
			cuenta.Apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
			cuenta.Usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
			cuenta.UsuarioID.toString().includes(searchTerm)

		const matchesRol = selectedRol === '' || cuenta.RolNombre === selectedRol

		return matchesSearch && matchesRol
	})

	const ellipsisItems = []
	if (hasPermission('cuentas:create')) {
		ellipsisItems.push({
			label: 'Crear cuenta',
			onClick: () => navigate('/Cuentas/Nueva')
		})
	}

	const handleDeleteCuenta = (usuarioId) => {
		setCuentaToDelete(usuarioId)
		setShowDeleteConfirm(true)
	}

	const confirmDelete = () => {
		console.log('Eliminar cuenta:', cuentaToDelete)
		setShowDeleteConfirm(false)
		setCuentaToDelete(null)
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
								placeholder="Buscar cuentas por nombre, usuario o ID..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="filters-container">
							<select
								className="filter-select"
								value={selectedRol}
								onChange={(e) => setSelectedRol(e.target.value)}
							>
								<option value="">Todos los roles</option>
								{roles.map(rol => (
									<option key={rol.id} value={rol.nombre}>{rol.nombre}</option>
								))}
							</select>

							{ellipsisItems.length > 0 && <EllipsisMenu items={ellipsisItems} />}
						</div>
					</div>

					<div className="cuentas-list">
						<div className="cuenta-list-header">
							<span>Id</span>
							<span>Nombre</span>
							<span>Contraseña</span>
							<span>Rol</span>
						</div>
						{filteredCuentas.map(cuenta => (
							<CuentaItem
								key={cuenta.UsuarioID}
								cuenta={cuenta}
								onDelete={handleDeleteCuenta}
								canEdit={hasPermission('cuentas:edit') && !(cuenta.RolID === 1 && user.RolNombre !== 'Jefe')}
								canDelete={hasPermission('cuentas:delete') && !(cuenta.RolID === 1 && user.RolNombre !== 'Jefe')}
							/>
						))}
					</div>

					{filteredCuentas.length === 0 && (
						<div className="no-results">
							No se encontraron cuentas que coincidan con los filtros
						</div>
					)}
				</div>
			</div>

			<ConfirmModal
				open={showDeleteConfirm}
				title="¿Eliminar cuenta?"
				message="Esta acción no puede ser revertida. Se eliminará permanentemente la cuenta y todos sus datos asociados."
				confirmLabel="Eliminar"
				confirmVariant="danger"
				onConfirm={confirmDelete}
				onCancel={() => { setShowDeleteConfirm(false); setCuentaToDelete(null) }}
			/>
		</>
	)
}
