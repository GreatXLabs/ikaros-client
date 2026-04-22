import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { CuentaItem } from '../components/CuentaItem'
import { EllipsisMenu } from '../components/EllipsisMenu'
import './Cuentas.css'

const cuentasData = [
  {
    UsuarioID: 1,
    RolID: 1,
    Nombre: 'Admin',
    Apellido: 'Sistema',
    Usuario: 'admin',
    Clave: 'supersecreto007',
    RolNombre: 'Jefe'
  },
  {
    UsuarioID: 2,
    RolID: 2,
    Nombre: 'Carlos',
    Apellido: 'Rodríguez',
    Usuario: 'carlos.r',
    Clave: 'cr2024pass',
    RolNombre: 'Coordinador'
  },
  {
    UsuarioID: 3,
    RolID: 3,
    Nombre: 'María',
    Apellido: 'González',
    Usuario: 'maria.g',
    Clave: 'mg#asignacion23',
    RolNombre: 'Asignador'
  },
  {
    UsuarioID: 4,
    RolID: 4,
    Nombre: 'Juan',
    Apellido: 'Martínez',
    Usuario: 'juan.m',
    Clave: 'jm_registro99',
    RolNombre: 'Registrador'
  },
  {
    UsuarioID: 5,
    RolID: 5,
    Nombre: 'Ana',
    Apellido: 'Pérez',
    Usuario: 'ana.p',
    Clave: 'ap_rrhh2025',
    RolNombre: 'RRHH'
  },
  {
    UsuarioID: 6,
    RolID: 2,
    Nombre: 'Roberto',
    Apellido: 'López',
    Usuario: 'roberto.l',
    Clave: 'rl_coord!24',
    RolNombre: 'Coordinador'
  },
  {
    UsuarioID: 7,
    RolID: 4,
    Nombre: 'Laura',
    Apellido: 'Sánchez',
    Usuario: 'laura.s',
    Clave: 'ls_reg2024',
    RolNombre: 'Registrador'
  }
]

const roles = [
  { id: 1, nombre: 'Jefe' },
  { id: 2, nombre: 'Coordinador' },
  { id: 3, nombre: 'Asignador' },
  { id: 4, nombre: 'Registrador' },
  { id: 5, nombre: 'RRHH' }
]

export function Cuentas() {
  const navigate = useNavigate()
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

  const ellipsisItems = [
    {
      label: 'Crear cuenta',
      onClick: () => navigate('/Cuentas/Nueva')
    }
  ]

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

              <EllipsisMenu items={ellipsisItems} />
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

      {/* Modal de confirmación para eliminar */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>¿Eliminar cuenta?</h2>
            <p>Esta acción no puede ser revertida. Se eliminará permanentemente la cuenta y todos sus datos asociados.</p>
            <div className="modal-buttons">
              <button className="modal-cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
                Cancelar
              </button>
              <button className="modal-delete-btn" onClick={confirmDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
