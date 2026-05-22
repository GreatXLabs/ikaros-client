import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { ConfirmModal } from '../components/ConfirmModal'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRight } from "lucide-react"
import { registrarMision, listarMisiones } from '../services/ikarosApi'
import './NuevaMision.css'

const MAX_DESC_LENGTH = 510

function parseNombresMisiones(data) {
  if (!data) return []
  return data.split(';').map(item => {
    const parts = item.split('~')
    return parts[1] || ''
  }).filter(n => n)
}

export function NuevaMision() {
  const navigate = useNavigate()
  const [nombresExistentes, setNombresExistentes] = useState([])
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: ''
  })
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    const fetchMisiones = async () => {
      try {
        const res = await listarMisiones()
        if (res.success) {
          setNombresExistentes(parseNombresMisiones(res.data))
        }
      } catch { /* ignore */ }
    }
    fetchMisiones()
  }, [])

  const validate = (name, value, data) => {
    const errors = { ...fieldErrors }

    if (name === 'descripcion' || (data && data.descripcion !== undefined)) {
      const desc = name === 'descripcion' ? value : data.descripcion
      if (desc.length > MAX_DESC_LENGTH) {
        errors.descripcion = 'La descripción no puede superar los 510 caracteres'
      } else {
        delete errors.descripcion
      }
    }

    if (name === 'fechaInicio' || name === 'fechaFin') {
      const inicio = name === 'fechaInicio' ? value : data?.fechaInicio ?? formData.fechaInicio
      const fin = name === 'fechaFin' ? value : data?.fechaFin ?? formData.fechaFin

      delete errors.fechaInicio
      delete errors.fechaFin

      if (inicio) {
        const ahora = new Date()
        const dtInicio = new Date(inicio)
        if (dtInicio < ahora) {
          errors.fechaInicio = 'La fecha de inicio no puede ser anterior a la fecha actual'
        }
      }

      if (fin) {
        const ahora = new Date()
        const dtFin = new Date(fin)
        if (dtFin < ahora) {
          errors.fechaFin = 'La fecha de finalización no puede ser anterior a la fecha actual'
        }
      }

      if (inicio && fin) {
        const dtFin = new Date(fin)
        const dtInicio = new Date(inicio)
        if (dtFin < dtInicio) {
          errors.fechaFin = 'La fecha de finalización no puede ser anterior a la de inicio'
        }
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const newData = { ...formData, [name]: value }
    setFormData(newData)
    validate(name, value, newData)
  }

  const handleCreate = () => {
    setError('')
    if (!formData.nombre.trim() || !formData.descripcion.trim() || !formData.fechaInicio || !formData.fechaFin) {
      setError('Completá todos los campos obligatorios')
      return
    }
    if (nombresExistentes.some(n => n.toLowerCase() === formData.nombre.trim().toLowerCase())) {
      setError('Ya existe una misión con ese nombre')
      return
    }
    const isValid = validate(null, null, formData)
    if (!isValid) {
      setError('Corregí los campos marcados en rojo')
      return
    }
    setShowSaveConfirm(true)
  }

  const confirmSave = async () => {
    try {
      const res = await registrarMision(formData)
      if (res.success) {
        navigate('/Misiones')
      } else {
        setError(res.message || 'Error al crear la misión')
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
                <BreadcrumbLink href="/Misiones">Misiones</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>Nueva misión</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <div className="action-buttons">
              <Button label="Cancelar" color="red" onClick={handleCancel} />
              <Button label="Crear" color="blue" onClick={handleCreate} />
            </div>
          </div>

          <div className="form-container">
            <h1 className="form-title">Nueva misión</h1>

            {error && <p className="form-error">{error}</p>}

            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input type="text" name="nombre" className="form-input" placeholder="Nombre de la misión" value={formData.nombre} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                name="descripcion"
                className={`form-textarea${fieldErrors.descripcion ? ' field-error' : ''}`}
                placeholder="Descripción de la misión"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
                maxLength={510}
              />
              {fieldErrors.descripcion && <span className="field-error-msg">{fieldErrors.descripcion}</span>}
              <span className="char-counter">{formData.descripcion.length}/{MAX_DESC_LENGTH}</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fecha y hora de inicio</label>
                <input
                  type="datetime-local"
                  name="fechaInicio"
                  className={`form-input form-datetime${fieldErrors.fechaInicio ? ' field-error' : ''}`}
                  value={formData.fechaInicio}
                  onChange={handleChange}
                />
                {fieldErrors.fechaInicio && <span className="field-error-msg">{fieldErrors.fechaInicio}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Fecha y hora de finalización</label>
                <input
                  type="datetime-local"
                  name="fechaFin"
                  className={`form-input form-datetime${fieldErrors.fechaFin ? ' field-error' : ''}`}
                  value={formData.fechaFin}
                  onChange={handleChange}
                />
                {fieldErrors.fechaFin && <span className="field-error-msg">{fieldErrors.fechaFin}</span>}
              </div>
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
        title="¿Crear misión?"
        message="Se creará una nueva misión con los datos ingresados."
        confirmLabel="Crear"
        confirmVariant="primary"
        onConfirm={confirmSave}
        onCancel={() => setShowSaveConfirm(false)}
      />
    </>
  )
}
