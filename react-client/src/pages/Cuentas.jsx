import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { CuentaItem } from '../components/CuentaItem'
import { EllipsisMenu } from '../components/EllipsisMenu'
import { ConfirmModal } from '../components/ConfirmModal'
import { useAuth } from '../contexts/AuthContext'
import * as api from '../services/ikarosApi'
import './Cuentas.css'

const roles = [
  { id: 1, nombre: 'JEFE' },
  { id: 2, nombre: 'COORDINADOR' },
  { id: 3, nombre: 'ASIGNADOR' },
  { id: 4, nombre: 'REGISTRADOR' },
  { id: 5, nombre: 'RRHH' }
]

function parseUsuarios(data) {
  if (!data) return []
  const items = data.split(';')
  return items.map(item => {
    const parts = item.split(':')
    return {
      UsuarioID: parseInt(parts[0]),
      Usuario: parts[1] || '',
      Nombre: parts[2] || '',
      Apellido: parts[3] || '',
      RolNombre: parts[4]?.toUpperCase() || ''
    }
  }).filter(u => u.UsuarioID)
}

export function Cuentas() {
  const navigate = useNavigate()
  const { hasPermission, user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRol, setSelectedRol] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [cuentaToDelete, setCuentaToDelete] = useState(null)
  const [cuentasData, setCuentasData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCuentas()
  }, [])

  const loadCuentas = async () => {
    try {
      const res = await api.listarUsuarios()
      if (res.success) {
        setCuentasData(parseUsuarios(res.data))
      }
    } catch {
      setCuentasData([])
    }
    setLoading(false)
  }

  const visibleCuentas = user?.RolNombre?.toUpperCase() === 'JEFE'
    ? cuentasData
    : cuentasData.filter(c => c.RolNombre?.toUpperCase() !== 'JEFE')

  const filteredCuentas = visibleCuentas.filter(cuenta => {
    const matchesSearch =
      cuenta.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cuenta.Apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cuenta.Usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cuenta.UsuarioID?.toString().includes(searchTerm)

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

  const confirmDelete = async () => {
    if (cuentaToDelete) {
      const cuenta = cuentasData.find(c => c.UsuarioID === cuentaToDelete)
      if (cuenta) {
        await api.bajaUsuario(cuenta.Usuario)
        loadCuentas()
      }
    }
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
            {loading ? (
              <div className="no-results">Cargando cuentas...</div>
            ) : filteredCuentas.map(cuenta => (
              <CuentaItem
                key={cuenta.UsuarioID}
                cuenta={cuenta}
                onDelete={handleDeleteCuenta}
                canEdit={hasPermission('cuentas:edit') && !(cuenta.RolNombre?.toUpperCase() === 'JEFE' && user?.RolNombre?.toUpperCase() !== 'JEFE')}
                canDelete={hasPermission('cuentas:delete') && !(cuenta.RolNombre?.toUpperCase() === 'JEFE' && user?.RolNombre?.toUpperCase() !== 'JEFE')}
              />
            ))}
            {!loading && filteredCuentas.length === 0 && (
              <div className="no-results">
                No se encontraron cuentas que coincidan con los filtros
              </div>
            )}
          </div>
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
