
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { MisionItem } from '../components/MisionItem'
import { DateRangeFilter } from '../components/DateRangeFilter'
import { EllipsisMenu } from '../components/EllipsisMenu'
import { ConfirmModal } from '../components/ConfirmModal'
import { useAuth } from '../contexts/AuthContext'
import { listarMisiones, actualizarEstadoMision, listarEstadosMisiones } from '../services/ikarosApi'
import './Misiones.css'

function parseMisiones(data) {
  if (!data) return []
  const items = data.split(';')
  return items.map(item => {
    const parts = item.split('~')
    return {
      misionId: parseInt(parts[0]),
      nombre: parts[1] || '',
      fechaInicioEstimada: parts[2] || '',
      fechaFinEstimada: parts[3] || '',
      retrasoInicio: parts[4] || '',
      retrasoFin: parts[5] || '',
      estadoNombre: parts[6] || ''
    }
  }).filter(m => m.misionId)
}

export function Misiones() {
  const navigate = useNavigate()
  const { hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEstado, setSelectedEstado] = useState('')
  const [dateRange, setDateRange] = useState([
    { startDate: null, endDate: null, key: 'selection' }
  ])
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [misionesData, setMisionesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [estados, setEstados] = useState([])

  useEffect(() => {
    loadMisiones()
    loadEstados()
  }, [])

  const loadMisiones = async () => {
    try {
      const res = await listarMisiones()
      if (res.success) {
        setMisionesData(parseMisiones(res.data))
      }
    } catch {
      setMisionesData([])
    }
    setLoading(false)
  }

  const loadEstados = async () => {
    try {
      const res = await listarEstadosMisiones()
      if (res.success && res.data) {
        setEstados(res.data.split(';').map(item => {
          const parts = item.split('~')
          return { id: parseInt(parts[0]), nombre: parts[1] || '' }
        }))
      }
    } catch {}
  }

  const filteredMisiones = misionesData.filter(mision => {
    const matchesSearch =
      mision.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mision.misionId.toString().includes(searchTerm)

    const matchesEstado = selectedEstado === '' || mision.estadoNombre === estados.find(e => e.id.toString() === selectedEstado)?.nombre

    const rangeStart = dateRange[0].startDate
    const rangeEnd = dateRange[0].endDate
    let matchesDate = true
    if (rangeStart || rangeEnd) {
      const dayStart = rangeStart ? new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate()) : null
      const dayEnd = rangeEnd ? new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate(), 23, 59, 59, 999) : null
      const misionStart = mision.fechaInicioEstimada ? new Date(mision.fechaInicioEstimada) : null
      const misionEnd = mision.fechaFinEstimada ? new Date(mision.fechaFinEstimada) : null
      if (misionStart && misionEnd) {
        matchesDate = (!dayStart || misionEnd >= dayStart) && (!dayEnd || misionStart <= dayEnd)
      } else if (misionStart) {
        matchesDate = (!dayStart || misionStart >= dayStart) && (!dayEnd || misionStart <= dayEnd)
      }
    }

    return matchesSearch && matchesEstado && matchesDate
  })

  const ellipsisItems = []
  if (hasPermission('misiones:create')) {
    ellipsisItems.push({
      label: 'Crear misión',
      onClick: () => navigate('/Misiones/Nueva')
    })
  }

  const handleDeleteMision = (misionId) => {
    setDeleteTarget(misionId)
  }

  const confirmDelete = async () => {
    if (deleteTarget) {
      await actualizarEstadoMision(deleteTarget, 'CANCELADA')
      loadMisiones()
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
                placeholder="Buscar misiones por nombre o ID..."
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
                  <option key={estado.id} value={estado.id.toString()}>{estado.nombre}</option>
                ))}
              </select>

              <DateRangeFilter
                dateRange={dateRange}
                onDateChange={setDateRange}
              />

              {ellipsisItems.length > 0 && <EllipsisMenu items={ellipsisItems} />}
            </div>
          </div>

          <div className="misiones-list">
            <div className="mision-list-header">
              <span>Id</span>
              <span>Nombre</span>
              <span>Fecha Inicio</span>
              <span>Fecha Finalización</span>
              <span>Estado</span>
            </div>
            {loading ? (
              <div className="no-results">Cargando misiones...</div>
            ) : filteredMisiones.map(mision => (
              <MisionItem
                key={mision.misionId}
                mision={mision}
                canEdit={hasPermission('misiones:edit')}
                canDelete={hasPermission('misiones:delete')}
                onDelete={handleDeleteMision}
              />
            ))}
            {!loading && filteredMisiones.length === 0 && (
              <div className="no-results">
                No se encontraron misiones que coincidan con los filtros
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        open={deleteTarget !== null}
        title="¿Eliminar misión?"
        message="Esta acción no puede ser revertida. Se eliminará permanentemente la misión y todos sus datos asociados."
        confirmLabel="Eliminar"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
