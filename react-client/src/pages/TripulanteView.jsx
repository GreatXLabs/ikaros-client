import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { Infoshow } from '../components/Infoshow'
import { EllipsisMenu } from '../components/EllipsisMenu'
import { ConfirmModal } from '../components/ConfirmModal'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRight } from "lucide-react"
import { useAuth } from '../contexts/AuthContext'
import * as api from '../services/ikarosApi'
import './TripulanteView.css'

function parseTripulante(data) {
  if (!data) return null
  const parts = data.split('|')
  return {
    tripulanteId: parts[0] || '',
    nombre: parts[1] || '',
    apellido: parts[2] || '',
    imagen: parts[3] || '',
    estadoNombre: parts[4] || '',
    sexoID: parts[5] || '1',
    fechaNacimiento: parts[6] || '',
    peso: parts[7] || '',
    altura: parts[8] || ''
  }
}

const sexoLabel = { '1': 'Masculino', '2': 'Femenino' }

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr + 'T00:00:00')
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function TripulanteView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hasPermission } = useAuth()
  const [tripulante, setTripulante] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await api.consultarTripulante(id)
      if (res.success) {
        setTripulante(parseTripulante(res.data))
      } else {
        setError(res.message || 'Tripulante no encontrado')
      }
    } catch {
      setError('Error de conexión con el servidor')
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    await api.bajaTripulante(id)
    navigate('/Tripulantes')
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

  if (!tripulante) {
    return (
      <>
        <Background />
        <div className="main-wrapper">
          <Header />
          <div className="main-panel">
            <div className="no-data">{error || 'Tripulante no encontrado'}</div>
          </div>
        </div>
      </>
    )
  }

  const nombreCompleto = `${tripulante.nombre} ${tripulante.apellido}`
  const imageUrl = tripulante.imagen ? `http://localhost:8080${tripulante.imagen}` : null

  const ellipsisItems = []
  if (hasPermission('tripulantes:edit')) {
    ellipsisItems.push({ label: 'Editar tripulante', onClick: () => navigate(`/Tripulantes/${id}/Editar`) })
  }
  if (hasPermission('tripulantes:delete')) {
    ellipsisItems.push({ label: 'Eliminar tripulante', variant: 'danger', onClick: () => setShowDeleteConfirm(true) })
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
                <BreadcrumbLink>{nombreCompleto}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <div className="action-buttons">
              {ellipsisItems.length > 0 && <EllipsisMenu items={ellipsisItems} />}
            </div>
          </div>

          <div className="hero">
            {imageUrl ? (
              <img src={imageUrl} alt={nombreCompleto} />
            ) : (
              <div className="hero-placeholder" />
            )}
            <h1 className='tripulante-nombre'>{nombreCompleto}</h1>
          </div>

          <div className="tripulante-info">
            <div className='id-info'>
              <Infoshow label="ID" subtitle="" content={tripulante.tripulanteId.toString().padStart(3, '0')} />
              <Infoshow label="Estado" subtitle="" content={tripulante.estadoNombre} />
            </div>
            <div className='personal-info'>
              <Infoshow label="Altura" subtitle="" content={`${tripulante.altura} cm`} />
              <Infoshow label="Peso" subtitle="" content={`${tripulante.peso} kg`} />
              <Infoshow label="Sexo" subtitle="" content={sexoLabel[tripulante.sexoID] || '—'} />
            </div>
            <div className='date-info'>
              <Infoshow label="Fecha de nacimiento" subtitle="" content={formatDate(tripulante.fechaNacimiento)} />
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showDeleteConfirm}
        title="¿Dar de baja tripulante?"
        message="Esta acción cambiará el estado del tripulante a 'Inactivo'."
        confirmLabel="Dar de baja"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  )
}
