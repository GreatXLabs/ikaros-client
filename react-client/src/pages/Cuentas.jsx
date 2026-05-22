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

function parseUsuarios(data) {
  if (!data) return []
  const items = data.split(';')
  return items.map(item => {
    const parts = item.split('~')
    return {
      UsuarioID: parseInt(parts[0]),
      Usuario: parts[1] || '',
      Nombre: parts[2] || '',
      Apellido: parts[3] || '',
      Clave: parts[4] || '',
      RolNombre: parts[5]?.toUpperCase() || '',
      RolID: parts[6] || '',
      EstadoNombre: parts[7] || 'Activo'
    }
  }).filter(u => u.UsuarioID)
}

function parseRoles(data) {
  if (!data) return []
  const items = data.split(';')
  return items.map(item => {
    const parts = item.split('~')
    return { id: parseInt(parts[0]), nombre: parts[1]?.toUpperCase() || '' }
  }).filter(r => r.id)
}

export function Cuentas() {
  const navigate = useNavigate()
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRol, setSelectedRol] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [cuentaToDelete, setCuentaToDelete] = useState(null)
  const [cuentasData, setCuentasData] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)

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

  const loadRoles = async () => {
    try {
      const res = await api.consultarRoles()
      if (res.success) {
        setRoles(parseRoles(res.data))
      }
    } catch {
      setRoles([])
    }
  }

  useEffect(() => {
    loadCuentas()
    loadRoles()
  }, [])

  const visibleCuentas = cuentasData.filter(c => c.RolNombre?.toUpperCase() !== 'JEFE')

  const filteredCuentas = visibleCuentas.filter(cuenta => {
    const matchesSearch =
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
      try {
        await api.bajaUsuario(cuentaToDelete)
        setCuentasData(prev =>
          prev.map(c =>
            c.UsuarioID === cuentaToDelete
              ? { ...c, EstadoNombre: 'Inactivo' }
              : c
          )
        )
      } catch {
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
                placeholder="Buscar cuentas por usuario o ID..."
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
              <span>Usuario</span>
              <span>Contraseña</span>
              <span>Rol</span>
              <span>Estado</span>
            </div>
            {loading ? (
              <div className="no-results">Cargando cuentas...</div>
            ) : filteredCuentas.map(cuenta => (
              <CuentaItem
                key={cuenta.UsuarioID}
                cuenta={cuenta}
                onDelete={handleDeleteCuenta}
                canEdit={hasPermission('cuentas:edit') && cuenta.EstadoNombre?.toLowerCase() !== 'inactivo'}
                canDelete={hasPermission('cuentas:delete') && cuenta.EstadoNombre?.toLowerCase() !== 'inactivo'}
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
        title="¿Dar de baja cuenta?"
        message="Esta acción cambiará el estado de la cuenta a Inactivo. El usuario no podrá iniciar sesión."
        confirmLabel="Dar de baja"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={() => { setShowDeleteConfirm(false); setCuentaToDelete(null) }}
      />
    </>
  )
}
