import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRight } from "lucide-react"
import './NuevoTripulante.css'

const tripulantesData = {
  1: {
    TripulanteID: 1,
    EstadoTID: 1,
    Peso: 78.5,
    Altura: 1.82,
    Nombre: 'Carlos',
    Apellido: 'Rodríguez',
    FechaDeNacimiento: '1985-03-15',
    Sexo: 'M'
  },
  2: {
    TripulanteID: 2,
    EstadoTID: 1,
    Peso: 62.0,
    Altura: 1.68,
    Nombre: 'María',
    Apellido: 'González',
    FechaDeNacimiento: '1990-07-22',
    Sexo: 'F'
  },
  3: {
    TripulanteID: 3,
    EstadoTID: 2,
    Peso: 85.0,
    Altura: 1.75,
    Nombre: 'Juan',
    Apellido: 'Martínez',
    FechaDeNacimiento: '1978-11-08',
    Sexo: 'M'
  },
  4: {
    TripulanteID: 4,
    EstadoTID: 1,
    Peso: 70.2,
    Altura: 1.90,
    Nombre: 'Ana',
    Apellido: 'Pérez',
    FechaDeNacimiento: '1988-05-30',
    Sexo: 'F'
  },
  5: {
    TripulanteID: 5,
    EstadoTID: 3,
    Peso: 88.0,
    Altura: 1.80,
    Nombre: 'Roberto',
    Apellido: 'López',
    FechaDeNacimiento: '1965-09-12',
    Sexo: 'M'
  },
  6: {
    TripulanteID: 6,
    EstadoTID: 2,
    Peso: 65.5,
    Altura: 1.72,
    Nombre: 'Laura',
    Apellido: 'Sánchez',
    FechaDeNacimiento: '1992-01-25',
    Sexo: 'F'
  },
  7: {
    TripulanteID: 7,
    EstadoTID: 1,
    Peso: 82.0,
    Altura: 1.85,
    Nombre: 'Diego',
    Apellido: 'Fernández',
    FechaDeNacimiento: '1983-12-03',
    Sexo: 'M'
  }
}

const estados = [
  { id: 1, nombre: 'Activo' },
  { id: 2, nombre: 'Inactivo' },
  { id: 3, nombre: 'Retirado' }
]

export function EditarTripulante() {
  const navigate = useNavigate()
  const { id } = useParams()
  const tripulante = tripulantesData[id] || Object.values(tripulantesData)[0]

  const [formData, setFormData] = useState({
    Nombre: tripulante.Nombre,
    Apellido: tripulante.Apellido,
    Peso: tripulante.Peso,
    Altura: tripulante.Altura,
    Sexo: tripulante.Sexo,
    FechaDeNacimiento: tripulante.FechaDeNacimiento,
    EstadoTID: tripulante.EstadoTID
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
    navigate(`/Tripulantes/${id}`)
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
              <BreadcrumbItem>
                <BreadcrumbLink href={`/Tripulantes/${id}`}>{tripulante.Nombre} {tripulante.Apellido}</BreadcrumbLink>
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
            <h1 className="form-title">Editar tripulante</h1>

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
