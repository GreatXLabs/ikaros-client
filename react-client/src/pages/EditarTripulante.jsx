import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Button } from '../components/Button'
import { ConfirmModal } from '../components/ConfirmModal'
import { ImageCropModal } from '../components/ImageCropModal'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRight, Plus, X, Camera } from "lucide-react"
import { consultarTripulante, modificarTripulante, consultarAptitudes, consultarCapacidades, guardarCapacidades, subirImagenTripulante, API_URL } from '../services/ikarosApi'
import './NuevoTripulante.css'

const estados = [
  { id: 1, nombre: 'ACTIVO' },
  { id: 2, nombre: 'INACTIVO' },
  { id: 3, nombre: 'RETIRADO' }
]

function parseAptitudes(data) {
  if (!data) return []
  const items = data.split(';')
  return items.map(item => {
    const parts = item.split('~')
    return { id: parseInt(parts[0]), nombre: parts[1] || '' }
  }).filter(a => a.id)
}

function parseTripulante(data) {
  if (!data) return null
  const parts = data.split('|')
  return {
    tripulanteId: parts[0] || '',
    nombre: parts[1] || '',
    apellido: parts[2] || '',
    peso: parts[3] || '',
    altura: parts[4] || '',
    imagen: parts[5] || '',
    fechaNacimiento: parts[6] || '',
    estadoNombre: parts[7] || 'ACTIVO',
    sexoNombre: parts[8] || 'Masculino'
  }
}

const sexoFromNombre = { 'Masculino': 'M', 'Femenino': 'F' }

export function EditarTripulante() {
  const navigate = useNavigate()
  const { id } = useParams()
  const fileInputRef = useRef(null)
  const [aptitudes, setAptitudes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    Nombre: '',
    Apellido: '',
    Peso: '',
    Altura: '',
    Sexo: 'M',
    FechaDeNacimiento: '',
    Estado: 'ACTIVO',
    imagen: '',
    aptitudes: [{ aptitudID: '', calificacion: '', fechaExamen: '' }]
  })
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const [cropImage, setCropImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    try {
      const [tripRes, aptRes, capRes] = await Promise.all([
        consultarTripulante(id),
        consultarAptitudes(),
        consultarCapacidades(id)
      ])

      if (tripRes.success) {
        const t = parseTripulante(tripRes.data)
        if (t) {
          let existingAptitudes = [{ aptitudID: '', calificacion: '', fechaExamen: '' }]
          if (capRes.success && capRes.data) {
            const parsed = capRes.data.split(';').map(item => {
              const parts = item.split('~')
              return {
                aptitudID: parts[0] || '',
                calificacion: parts[2] || '',
                fechaExamen: parts[3] || ''
              }
            }).filter(a => a.aptitudID)
            if (parsed.length > 0) existingAptitudes = parsed
          }

          setFormData({
            Nombre: t.nombre,
            Apellido: t.apellido,
            Peso: t.peso,
            Altura: t.altura,
            Sexo: sexoFromNombre[t.sexoNombre] || 'M',
            FechaDeNacimiento: t.fechaNacimiento,
            Estado: t.estadoNombre,
            imagen: t.imagen,
            aptitudes: existingAptitudes
          })
          if (t.imagen) {
            setPreviewUrl(`${API_URL}${t.imagen}`)
          }
        }
      } else {
        setError(tripRes.message || 'Tripulante no encontrado')
      }

      if (aptRes.success) {
        setAptitudes(parseAptitudes(aptRes.data))
      }
    } catch {
      setError('Error de conexión con el servidor')
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAptitudChange = (index, field, value) => {
    setFormData(prev => {
      const newAptitudes = [...prev.aptitudes]
      newAptitudes[index] = { ...newAptitudes[index], [field]: value }
      return { ...prev, aptitudes: newAptitudes }
    })
  }

  const addAptitud = () => {
    setFormData(prev => ({
      ...prev,
      aptitudes: [...prev.aptitudes, { aptitudID: '', calificacion: '', fechaExamen: '' }]
    }))
  }

  const removeAptitud = (index) => {
    setFormData(prev => ({
      ...prev,
      aptitudes: prev.aptitudes.filter((_, i) => i !== index)
    }))
  }

  const handleSelectImage = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setCropImage(reader.result)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleCropComplete = async (croppedFile) => {
    setCropImage(null)
    try {
      const res = await subirImagenTripulante(croppedFile)
      if (res.success) {
        setFormData(prev => ({ ...prev, imagen: res.path }))
        setPreviewUrl(`${API_URL}${res.path}`)
      } else {
        setError(res.message || 'Error al subir la imagen')
      }
    } catch {
      setError('Error al subir la imagen')
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imagen: '' }))
    setPreviewUrl(null)
  }

  const handleSave = () => {
    setError('')
    if (!formData.Nombre.trim() || !formData.Apellido.trim() || !formData.Peso || !formData.Altura || !formData.FechaDeNacimiento) {
      setError('Completá todos los campos obligatorios')
      return
    }
    setShowSaveConfirm(true)
  }

  const confirmSave = async () => {
    try {
      const res = await modificarTripulante(id, {
        estado: formData.Estado,
        sexo: formData.Sexo,
        fechaNacimiento: formData.FechaDeNacimiento,
        peso: formData.Peso,
        altura: formData.Altura,
        nombre: formData.Nombre,
        apellido: formData.Apellido,
        imagen: formData.imagen
      })
      if (res.success) {
        const capacidades = formData.aptitudes
          .filter(a => a.aptitudID && a.calificacion)
          .map(a => ({
            aptitudID: a.aptitudID,
            calificacion: a.calificacion,
            fechaExamen: a.fechaExamen || ''
          }))
        if (capacidades.length > 0) {
          await guardarCapacidades(id, capacidades)
        }
        navigate(`/Tripulantes/${id}`)
      } else {
        setError(res.message || 'Error al modificar el tripulante')
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
            <div className="no-data">Cargando tripulante...</div>
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
                <BreadcrumbLink href="/Tripulantes">Tripulantes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/Tripulantes/${id}`}>{formData.Nombre} {formData.Apellido}</BreadcrumbLink>
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

            {error && <p className="form-error">{error}</p>}

            <div className="form-row image-row">
              <div className="form-group image-group">
                <label className="form-label">Foto</label>
                <div className="image-upload-area">
                  {previewUrl ? (
                    <div className="image-preview-container">
                      <img src={previewUrl} alt="Preview" className="image-preview" />
                      <div className="image-preview-actions">
                        <button type="button" className="image-action-btn" onClick={handleSelectImage}>Cambiar</button>
                        <button type="button" className="image-action-btn image-action-remove" onClick={handleRemoveImage}>Quitar</button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" className="image-upload-btn" onClick={handleSelectImage}>
                      <Camera size={24} />
                      <span>Subir foto</span>
                    </button>
                  )}
                </div>
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} hidden />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input type="text" name="Nombre" className="form-input" placeholder="Nombre" value={formData.Nombre} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Apellido</label>
                <input type="text" name="Apellido" className="form-input" placeholder="Apellido" value={formData.Apellido} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Peso (kg)</label>
                <input type="number" name="Peso" className="form-input" placeholder="70" step="1" value={formData.Peso} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Altura (cm)</label>
                <input type="number" name="Altura" className="form-input" placeholder="175" step="1" value={formData.Altura} onChange={handleChange} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Sexo</label>
                <select name="Sexo" className="form-input form-select" value={formData.Sexo} onChange={handleChange}>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Estado</label>
                <select name="Estado" className="form-input form-select" value={formData.Estado} onChange={handleChange}>
                  {estados.map(estado => (
                    <option key={estado.id} value={estado.nombre}>{estado.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de nacimiento</label>
              <input type="date" name="FechaDeNacimiento" max={new Date().toISOString().split("T")[0]} className="form-input" value={formData.FechaDeNacimiento} onChange={handleChange} />
            </div>



            <h2 className="form-section-title">Aptitudes</h2>

            <div className="aptitudes-form-section">
              {formData.aptitudes.map((aptitud, index) => (
                <div key={index} className="aptitud-form-row">
                  <div className="form-group aptitud-nombre-group">
                    <select
                      className="form-input"
                      value={aptitud.aptitudID}
                      onChange={(e) => handleAptitudChange(index, 'aptitudID', e.target.value)}
                    >
                      <option value="">Seleccionar aptitud</option>
                      {aptitudes.map(a => (
                        <option key={a.id} value={a.id}>{a.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group aptitud-calif-group">
                    <input
                      type="number"
                      className="form-input"
                      placeholder="1-100"
                      min="0"
                      max="100"
                      value={aptitud.calificacion}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === '') {
                          handleAptitudChange(index, 'calificacion', '');
                          return;
                        }
                        const val = Math.min(100, Math.max(1, Number(raw)));
                        handleAptitudChange(index, 'calificacion', val);
                      }}
                      onBlur={(e) => {
                        if (e.target.value === '' || Number(e.target.value) < 1) {
                          handleAptitudChange(index, 'calificacion', 1);
                        }
                      }}
                    />
                  </div>
                  <div className="form-group aptitud-fecha-group">
                    <input
                      type="date"
                      className="form-input"
                      value={aptitud.fechaExamen}
                      onChange={(e) => handleAptitudChange(index, 'fechaExamen', e.target.value)}
                    />
                  </div>
                  {formData.aptitudes.length > 1 && (
                    <button type="button" className="aptitud-remove-btn" onClick={() => removeAptitud(index)}>
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="add-aptitud-btn" onClick={addAptitud}>
                <Plus size={16} /> Agregar aptitud
              </button>
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
        message="Se actualizarán los datos del tripulante con la información ingresada."
        confirmLabel="Guardar"
        confirmVariant="primary"
        onConfirm={confirmSave}
        onCancel={() => setShowSaveConfirm(false)}
      />

      {cropImage && (
        <ImageCropModal
          imageSrc={cropImage}
          onClose={() => setCropImage(null)}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  )
}
