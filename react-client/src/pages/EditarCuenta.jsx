import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRight } from "lucide-react"
import './NuevaCuenta.css'

const cuentasData = {
  1: { UsuarioID: 1, RolID: 1, Nombre: 'Admin', Apellido: 'Sistema', Usuario: 'admin', Clave: 'supersecreto007' },
  2: { UsuarioID: 2, RolID: 2, Nombre: 'Carlos', Apellido: 'Rodríguez', Usuario: 'carlos.r', Clave: 'cr2024pass' },
  3: { UsuarioID: 3, RolID: 3, Nombre: 'María', Apellido: 'González', Usuario: 'maria.g', Clave: 'mg#asignacion23' },
  4: { UsuarioID: 4, RolID: 4, Nombre: 'Juan', Apellido: 'Martínez', Usuario: 'juan.m', Clave: 'jm_registro99' },
  5: { UsuarioID: 5, RolID: 5, Nombre: 'Ana', Apellido: 'Pérez', Usuario: 'ana.p', Clave: 'ap_rrhh2025' },
  6: { UsuarioID: 6, RolID: 2, Nombre: 'Roberto', Apellido: 'López', Usuario: 'roberto.l', Clave: 'rl_coord!24' },
  7: { UsuarioID: 7, RolID: 4, Nombre: 'Laura', Apellido: 'Sánchez', Usuario: 'laura.s', Clave: 'ls_reg2024' }
}

const roles = [
  { id: 1, nombre: 'Jefe' },
  { id: 2, nombre: 'Coordinador' },
  { id: 3, nombre: 'Asignador' },
  { id: 4, nombre: 'Registrador' },
  { id: 5, nombre: 'RRHH' }
]

export function EditarCuenta() {
  const navigate = useNavigate()
  const { id } = useParams()
  const cuenta = cuentasData[id] || Object.values(cuentasData)[0]

  const [formData, setFormData] = useState({
    Nombre: cuenta.Nombre,
    Apellido: cuenta.Apellido,
    Usuario: cuenta.Usuario,
    Clave: cuenta.Clave,
    RolID: cuenta.RolID
  })
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
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
            <p>Los cambios no podrán ser revertidos. Perderás las modificaciones realizadas.</p>
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
