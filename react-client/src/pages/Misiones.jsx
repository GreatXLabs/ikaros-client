import { useState, useRef, useEffect } from 'react'
import { DateRangePicker } from 'react-date-range'
import { es } from 'date-fns/locale'
import { Background } from '../components/Background'
import { Header } from '../components/Header'
import { MisionItem } from '../components/MisionItem'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import './Misiones.css'

const misionesData = [
  {
    misionId: 1042,
    nombre: 'Implementación del módulo de Logs',
    descripcion: 'Desarrollo del sistema de auditoría y logs del sistema',
    fechaInicioEstimada: '2026-04-15T09:00:00',
    fechaFinEstimada: '2026-04-20T18:00:00',
    retrasoInicio: '+00:00:00',
    retrasoFin: '-00:00:00',
    estadoMID: 2,
    estadoNombre: 'En curso'
  },
  {
    misionId: 1043,
    nombre: 'Migración de base de datos',
    descripcion: 'Migración de MySQL a PostgreSQL',
    fechaInicioEstimada: '2026-04-10T08:00:00',
    fechaFinEstimada: '2026-04-18T17:00:00',
    retrasoInicio: '+02:30:00',
    retrasoFin: '-00:00:00',
    estadoMID: 2,
    estadoNombre: 'En curso'
  },
  {
    misionId: 1044,
    nombre: 'Diseño de interfaz de usuario',
    descripcion: 'Rediseño completo de la interfaz principal',
    fechaInicioEstimada: '2026-04-08T09:00:00',
    fechaFinEstimada: '2026-04-16T18:00:00',
    retrasoInicio: '+00:00:00',
    retrasoFin: '-01:45:00',
    estadoMID: 3,
    estadoNombre: 'Completada'
  },
  {
    misionId: 1045,
    nombre: 'Configuración de servidores',
    descripcion: 'Configuración de los servidores de producción',
    fechaInicioEstimada: '2026-04-22T10:00:00',
    fechaFinEstimada: '2026-04-25T16:00:00',
    retrasoInicio: '00:00:00',
    retrasoFin: '00:00:00',
    estadoMID: 1,
    estadoNombre: 'Pendiente'
  },
  {
    misionId: 1046,
    nombre: 'Integración de APIs externas',
    descripcion: 'Conexión con APIs de terceros para sincronización',
    fechaInicioEstimada: '2026-04-05T09:00:00',
    fechaFinEstimada: '2026-04-12T18:00:00',
    retrasoInicio: '+04:00:00',
    retrasoFin: '-00:00:00',
    estadoMID: 4,
    estadoNombre: 'Cancelada'
  }
]

const estados = [
  { id: 1, nombre: 'Planificada' },
  { id: 2, nombre: 'Preparada' },
  { id: 3, nombre: 'En curso' },
  { id: 4, nombre: 'Finalizada' },
  { id: 5, nombre: 'Cancelada' }
]

export function Misiones() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEstado, setSelectedEstado] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection'
    }
  ])
  const datePickerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredMisiones = misionesData.filter(mision => {
    const matchesSearch =
      mision.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mision.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mision.misionId.toString().includes(searchTerm)

    const matchesEstado = selectedEstado === '' || mision.estadoMID.toString() === selectedEstado

    const matchesDateRange =
      (!dateRange[0].startDate || new Date(mision.fechaInicioEstimada) >= dateRange[0].startDate) &&
      (!dateRange[0].endDate || new Date(mision.fechaInicioEstimada) <= dateRange[0].endDate)

    return matchesSearch && matchesEstado && matchesDateRange
  })

  const formatDateDisplay = () => {
    const start = dateRange[0].startDate
    const end = dateRange[0].endDate

    if (!start && !end) return 'Seleccionar fecha'

    const format = (date) => {
      if (!date) return ''
      return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    if (start && end) {
      if (start.getTime() === end.getTime()) {
        return format(start)
      }
      return `${format(start)} - ${format(end)}`
    }

    return format(start)
  }

  const clearDateSelection = (e) => {
    e.stopPropagation()
    setDateRange([{
      startDate: null,
      endDate: null,
      key: 'selection'
    }])
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
                placeholder="Buscar misiones por nombre, descripción o ID..."
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

              <div className="date-picker-wrapper" ref={datePickerRef}>
                <button
                  className="date-picker-button"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                >
                  <svg className="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{formatDateDisplay()}</span>
                </button>

                {showDatePicker && (
                  <div className="date-picker-dropdown">
                    <div className="date-picker-header">
                      <span>Seleccioná fecha o rango</span>
                      {(dateRange[0].startDate || dateRange[0].endDate) && (
                        <button className="clear-date-btn" onClick={clearDateSelection}>
                          Limpiar
                        </button>
                      )}
                    </div>
                    <DateRangePicker
                      onChange={(item) => setDateRange([item.selection])}
                      showSelectionPreview={true}
                      moveRangeOnFirstSelection={false}
                      months={1}
                      ranges={dateRange}
                      direction="horizontal"
                      locale={es}
                    />
                  </div>
                )}
              </div>
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
            {filteredMisiones.map(mision => (
              <MisionItem
                key={mision.misionId}
                mision={mision}
              />
            ))}
          </div>

          {filteredMisiones.length === 0 && (
            <div className="no-results">
              No se encontraron misiones que coincidan con los filtros
            </div>
          )}
        </div>
      </div>
    </>
  )
}
