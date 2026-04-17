import { Link } from 'react-router-dom'
import './MisionItem.css'

const ESTADO_CLASS = {
  'En curso': 'active',
  'Pendiente': 'pending',
  'Completada': 'done',
  'Cancelada': 'overdue',
}

function formatFecha(isoString) {
  if (!isoString) return '—'
  const d = new Date(isoString)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`
}

function parseDelta(delta) {
  if (!delta || delta === '00:00:00' || delta === '+00:00:00' || delta === '-00:00:00') return null
  return delta
}

export function MisionItem({ mision }) {
  const {
    misionId,
    nombre,
    fechaInicioEstimada,
    fechaFinEstimada,
    retrasoInicio,
    retrasoFin,
    estadoNombre,
  } = mision

  const deltaInicio = parseDelta(retrasoInicio)
  const deltaFin = parseDelta(retrasoFin)
  const estadoKey = ESTADO_CLASS[estadoNombre] ?? 'pending'

  return (
    <Link to={`/misiones/${misionId}`} className="mision-item">
      <span className="mision-cell cell-id">M{String(misionId).slice(-2)}</span>
      <span className="mision-cell cell-nombre">
        {nombre}
      </span>
      <span className="mision-cell cell-fecha">
        {formatFecha(fechaInicioEstimada)}
        {deltaInicio && <span className="mision-delta">{deltaInicio}</span>}
      </span>
      <span className="mision-cell cell-fecha">
        {formatFecha(fechaFinEstimada)}
        {deltaFin && <span className="mision-delta">{deltaFin}</span>}
      </span>
      <span className="mision-cell cell-estado">
        <span className={`mision-status status-${estadoKey}`}>{estadoNombre}</span>
      </span>
    </Link>
  )
}
