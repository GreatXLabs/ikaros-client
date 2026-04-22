import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRight } from "lucide-react"
import './NuevoTripulante.css'

const estados = [
  { id: 1, nombre: 'Activo' },
  { id: 2, nombre: 'Inactivo' },
  { id: 3, nombre: 'Retirado' }
]

export function NuevoTripulante() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    Nombre: '',
    Apellido: '',
    Peso: '',
    Altura: '',
    Sexo: 'M',
    FechaDeNacimiento: '',
    EstadoTID: 1
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
    console.log('Crear tripulante:', formData)
    navigate('/Tripulantes')
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
                <BreadcrumbLink href="/Tripulantes">Tripulantes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>Nuevo tripulante</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <div className="action-buttons">
              <Button label="Cancelar" color="red" onClick={handleCancel} />
              <Button label="Crear" color="blue" onClick={handleCreate} />
            </div>
          </div>

          <div className="form-container">
            <h1 className="form-title">Nuevo tripulante</h1>

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

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Peso (kg)</label>
                <input
                  type="number"
                  name="Peso"
                  className="form-input"
                  placeholder="70.5"
                  step="0.1"
                  value={formData.Peso}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Altura (m)</label>
                <input
                  type="number"
                  name="Altura"
                  className="form-input"
                  placeholder="1.75"
                  step="0.01"
                  value={formData.Altura}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Sexo</label>
                <select
                  name="Sexo"
                  className="form-input form-select"
                  value={formData.Sexo}
                  onChange={handleChange}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  name="EstadoTID"
                  className="form-input form-select"
                  value={formData.EstadoTID}
                  onChange={handleChange}
                >
                  {estados.map(estado => (
                    <option key={estado.id} value={estado.id}>{estado.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de nacimiento</label>
              <input
                type="date"
                name="FechaDeNacimiento"
                className="form-input"
                value={formData.FechaDeNacimiento}
                onChange={handleChange}
              />
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
