import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRight } from "lucide-react"
import './NuevaMision.css'

// Datos de ejemplo - en producción vendrían de la BDD
const misionesData = {
  1042: {
    misionId: 1042,
    nombre: 'Implementación del módulo de Logs',
    descripcion: 'Desarrollo del sistema de auditoría y logs del sistema. Este módulo permitirá llevar un registro detallado de todas las operaciones realizadas en la plataforma.',
    fechaInicioEstimada: '2026-04-15T09:00',
    fechaFinEstimada: '2026-04-20T18:00'
  },
  1043: {
    misionId: 1043,
    nombre: 'Migración de base de datos',
    descripcion: 'Migración completa de MySQL a PostgreSQL',
    fechaInicioEstimada: '2026-04-10T08:00',
    fechaFinEstimada: '2026-04-18T17:00'
  },
  1044: {
    misionId: 1044,
    nombre: 'Diseño de interfaz de usuario',
    descripcion: 'Rediseño completo de la interfaz principal',
    fechaInicioEstimada: '2026-04-08T09:00',
    fechaFinEstimada: '2026-04-16T18:00'
  },
  1045: {
    misionId: 1045,
    nombre: 'Configuración de servidores',
    descripcion: 'Configuración de los servidores de producción',
    fechaInicioEstimada: '2026-04-22T10:00',
    fechaFinEstimada: '2026-04-25T16:00'
  },
  1046: {
    misionId: 1046,
    nombre: 'Integración de APIs externas',
    descripcion: 'Conexión con APIs de terceros para sincronización',
    fechaInicioEstimada: '2026-04-05T09:00',
    fechaFinEstimada: '2026-04-12T18:00'
  }
}

export function EditarMision() {
  const navigate = useNavigate()
  const { id } = useParams()
  const mision = misionesData[id] || Object.values(misionesData)[0]

  const [formData, setFormData] = useState({
    nombre: mision.nombre,
    descripcion: mision.descripcion,
    fechaInicioEstimada: mision.fechaInicioEstimada,
    fechaFinEstimada: mision.fechaFinEstimada
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
    // TODO: Lógica para guardar cambios
    console.log('Guardar cambios:', formData)
    navigate(`/Misiones/${id}`)
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
                <BreadcrumbLink href="/Misiones">Misiones</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/Misiones/${id}`}>{mision.nombre}</BreadcrumbLink>
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
            <h1 className="form-title">Editar misión</h1>

            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="form-input"
                placeholder="Nombre de la misión"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                name="descripcion"
                className="form-textarea"
                placeholder="Descripción de la misión"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fecha inicio estimada</label>
                <input
                  type="datetime-local"
                  name="fechaInicioEstimada"
                  className="form-input form-datetime"
                  value={formData.fechaInicioEstimada}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fecha fin estimada</label>
                <input
                  type="datetime-local"
                  name="fechaFinEstimada"
                  className="form-input form-datetime"
                  value={formData.fechaFinEstimada}
                  onChange={handleChange}
                />
              </div>
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
