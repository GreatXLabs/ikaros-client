import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRight } from "lucide-react"
import './NuevaCuenta.css'

const roles = [
  { id: 1, nombre: 'Jefe' },
  { id: 2, nombre: 'Coordinador' },
  { id: 3, nombre: 'Asignador' },
  { id: 4, nombre: 'Registrador' },
  { id: 5, nombre: 'RRHH' }
]

export function NuevaCuenta() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    Nombre: '',
    Apellido: '',
    Usuario: '',
    Clave: '',
    RolID: 2
  })
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCreate = () => {
    console.log('Crear cuenta:', formData)
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

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="Nombre"
                  className="form-input"
                  placeholder="Nombre"
                  value={formData.Nombre}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Apellido</label>
                <input
                  type="text"
                  name="Apellido"
                  className="form-input"
                  placeholder="Apellido"
                  value={formData.Apellido}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Usuario</label>
              <input
                type="text"
                name="Usuario"
                className="form-input"
                placeholder="Nombre de usuario"
                value={formData.Usuario}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="Clave"
                className="form-input"
                placeholder="Contraseña"
                value={formData.Clave}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rol</label>
              <select
                name="RolID"
                className="form-input form-select"
                value={formData.RolID}
                onChange={handleChange}
              >
                {roles.map(rol => (
                  <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para cancelar */}
      {showCancelConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>¿Estás seguro?</h2>
            <p>Los cambios no podrán ser revertidos. Perderás toda la información ingresada.</p>
            <div className="modal-buttons">
              <Button label="No, volver" onClick={() => setShowCancelConfirm(false)} />
              <Button label="Sí, cancelar" color="red" onClick={confirmCancel} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
