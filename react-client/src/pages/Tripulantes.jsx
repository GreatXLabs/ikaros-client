import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { EllipsisMenu } from '../components/EllipsisMenu'
import { ConfirmModal } from '../components/ConfirmModal'
import { useAuth } from '../contexts/AuthContext'
import { listarTripulantes, bajaTripulante, listarEstadosTripulantes } from '../services/ikarosApi'
import { TripulanteItem } from '../components/TripulanteItem'
import './Tripulantes.css'

function parseTripulantes(data) {
  if (!data) return []
  const items = data.split(';')
  return items.map(item => {
    const parts = item.split('~')
    return {
      TripulanteID: parseInt(parts[0]),
      Nombre: parts[1] || '',
      Apellido: parts[2] || '',
      Imagen: parts[3] || '',
      EstadoNombre: parts[4] || 'Activo',
      SexoNombre: parts[5] || '',
      Peso: parts[6] || '',
      Altura: parts[7] || ''
    }
  }).filter(t => t.TripulanteID)
}

export function Tripulantes() {
  const navigate = useNavigate()
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEstado, setSelectedEstado] = useState('')
  const [selectedSexo, setSelectedSexo] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [tripulantesData, setTripulantesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [estados, setEstados] = useState([])
  const sexos = [
    { id: 'M', nombre: 'Masculino' },
    { id: 'F', nombre: 'Femenino' }
  ]

  useEffect(() => {
    loadTripulantes()
    loadEstados()
  }, [])

  const loadTripulantes = async () => {
    try {
      const res = await listarTripulantes()
      if (res.success) {
        setTripulantesData(parseTripulantes(res.data))
      }
    } catch {
      setTripulantesData([])
    }
    setLoading(false)
  }

  const loadEstados = async () => {
    try {
      const res = await listarEstadosTripulantes()
      if (res.success && res.data) {
        setEstados(res.data.split(";").map(item => {
          const parts = item.split("~")
          return { id: parseInt(parts[0]), nombre: parts[1] || "" }
        }))
      }
    } catch {}
  }

  const filteredTripulantes = tripulantesData.filter(tripulante => {
    const matchesSearch =
      tripulante.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tripulante.Apellido.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEstado = selectedEstado === '' || tripulante.EstadoNombre === estados.find(e => e.id.toString() === selectedEstado)?.nombre

    const matchesSexo = selectedSexo === '' || tripulante.SexoNombre.toUpperCase().startsWith(selectedSexo)

    return matchesSearch && matchesEstado && matchesSexo
  })

  const ellipsisItems = []
  if (hasPermission('tripulantes:create')) {
    ellipsisItems.push({
      label: 'Crear tripulante',
      onClick: () => navigate('/Tripulantes/Nuevo')
    })
  }

  const handleDeleteTripulante = (tripulanteId) => {
    setDeleteTarget(tripulanteId)
  }

  const confirmDelete = async () => {
    if (deleteTarget) {
      await bajaTripulante(deleteTarget)
      loadTripulantes()
    }
    setDeleteTarget(null)
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
                placeholder="Buscar tripulante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filters-container">
              <select
                className="filter-select"
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
              >
                <option value="">Todos los estados</option>
                {estados.map(estado => (
                  <option key={estado.id} value={estado.id}>{estado.nombre}</option>
                ))}
              </select>
              <select
                className="filter-select"
                value={selectedSexo}
                onChange={(e) => setSelectedSexo(e.target.value)}
              >
                <option value="">Todos los sexos</option>
                {sexos.map(sexo => (
                  <option key={sexo.id} value={sexo.id}>{sexo.nombre}</option>
                ))}
              </select>

              {ellipsisItems.length > 0 && <EllipsisMenu items={ellipsisItems} />}
            </div>
          </div>
          <div className="tripulantes-container">
            {loading ? (
              <div className="no-results">Cargando tripulantes...</div>
            ) : filteredTripulantes.map((tripulante, index) => (
              <TripulanteItem
                key={tripulante.TripulanteID}
                tripulante={tripulante}
                canEdit={hasPermission('tripulantes:edit')}
                canDelete={hasPermission('tripulantes:delete')}
                onDelete={handleDeleteTripulante}
                style={{ '--index': index }}
              />
            ))}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={deleteTarget !== null}
        title="¿Eliminar tripulante?"
        message="Esta acción no puede ser revertida. Se eliminará permanentemente el tripulante y todos sus datos asociados."
        confirmLabel="Eliminar"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
