import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { ConfirmModal } from '../components/ConfirmModal'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRight } from "lucide-react"
import { consultarMision, modificarMision } from '../services/ikarosApi'
import './NuevaMision.css'

function parseMision(data) {
  if (!data) return null
  const parts = data.split('|')
  return {
    misionId: parts[0] || '',
    nombre: parts[1] || '',
    descripcion: parts[2] || '',
    estadoNombre: parts[3] || '',
    fechaInicioEstimada: parts[4] || '',
    fechaFinEstimada: parts[5] || '',
    retrasoInicio: parts[6] || '',
    retrasoFin: parts[7] || ''
  }
}

function toDatetimeLocal(fechaStr) {
  if (!fechaStr) return ''
  const d = new Date(fechaStr)
  if (isNaN(d.getTime())) return fechaStr
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function EditarMision() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [misionNombre, setMisionNombre] = useState('')
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fechaInicioEstimada: '',
    fechaFinEstimada: ''
  })
  const [estado, setEstado] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await consultarMision(id)
      if (res.success) {
        const m = parseMision(res.data)
        if (m) {
          setMisionNombre(m.nombre)
          setEstado(m.estadoNombre)
          setFormData({
            nombre: m.nombre,
            descripcion: m.descripcion,
            fechaInicioEstimada: toDatetimeLocal(m.fechaInicioEstimada),
            fechaFinEstimada: toDatetimeLocal(m.fechaFinEstimada)
          })
        } else {
          setError('Misión no encontrada')
        }
      } else {
        setError(res.message || 'Misión no encontrada')
      }
    } catch {
      setError('Error de conexión con el servidor')
    }
    setLoading(false)
  }

  const validate = (name, value, data) => {
    const errors = { ...fieldErrors }

    if (name === 'fechaInicioEstimada' || name === 'fechaFinEstimada') {
      const inicio = name === 'fechaInicioEstimada' ? value : data?.fechaInicioEstimada ?? formData.fechaInicioEstimada
      const fin = name === 'fechaFinEstimada' ? value : data?.fechaFinEstimada ?? formData.fechaFinEstimada

      delete errors.fechaInicioEstimada
      delete errors.fechaFinEstimada

      if (inicio && fin) {
        const dtFin = new Date(fin)
        const dtInicio = new Date(inicio)
        if (dtFin < dtInicio) {
          errors.fechaFinEstimada = 'La fecha de finalización no puede ser anterior a la de inicio'
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

  const handleSave = () => {
    setError('')
    if (!formData.nombre.trim() || !formData.descripcion.trim()) {
      setError('Completá todos los campos obligatorios')
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
      const res = await modificarMision(id, {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        fechaInicio: formData.fechaInicioEstimada,
        fechaFin: formData.fechaFinEstimada
      })
      if (res.success) {
        navigate(`/Misiones/${id}`)
      } else {
        setError(res.message || 'Error al modificar la misión')
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

  if (loading) {
    return (
      <>
        <Background />
        <div className="main-wrapper">
          <Header />
          <div className="main-panel">
            <div className="no-data">Cargando misión...</div>
          </div>
        </div>
      </>
    )
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
                <BreadcrumbLink href={`/Misiones/${id}`}>{misionNombre}</BreadcrumbLink>
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

            {error && <p className="form-error">{error}</p>}

            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input type="text" name="nombre" className="form-input" placeholder="Nombre de la misión" value={formData.nombre} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea name="descripcion" className="form-textarea" placeholder="Descripción de la misión" value={formData.descripcion} onChange={handleChange} rows={4} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fecha inicio estimada</label>
                <input
                  type="datetime-local"
                  lang="es"
                  name="fechaInicioEstimada"
                  className={`form-input form-datetime${fieldErrors.fechaInicioEstimada ? ' field-error' : ''}`}
                  value={formData.fechaInicioEstimada}
                  onChange={handleChange}
                />
                {fieldErrors.fechaInicioEstimada && <span className="field-error-msg">{fieldErrors.fechaInicioEstimada}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Fecha fin estimada</label>
                <input
                  type="datetime-local"
                  lang="es"
                  name="fechaFinEstimada"
                  className={`form-input form-datetime${fieldErrors.fechaFinEstimada ? ' field-error' : ''}`}
                  value={formData.fechaFinEstimada}
                  onChange={handleChange}
                />
                {fieldErrors.fechaFinEstimada && <span className="field-error-msg">{fieldErrors.fechaFinEstimada}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showCancelConfirm}
        title="¿Estás seguro?"
        message="Los cambios no podrán ser revertidos. Perderás las modificaciones realizadas."
        confirmLabel="Sí, cancelar"
        confirmVariant="danger"
        onConfirm={confirmCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />

      <ConfirmModal
        open={showSaveConfirm}
        title="¿Guardar cambios?"
        message="Se actualizarán los datos de la misión con la información ingresada."
        confirmLabel="Guardar"
        confirmVariant="primary"
        onConfirm={confirmSave}
        onCancel={() => setShowSaveConfirm(false)}
      />
    </>
  )
}
