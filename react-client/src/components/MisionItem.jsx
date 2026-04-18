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

  // Convertir el string a segundos totales para comparar con 0
  // El formato es "+HH:MM:SS" o "-HH:MM:SS"
  const signChar = delta.startsWith('-') ? -1 : 1
  const timePart = delta.replace(/^[+-]/, '') // Quitamos el signo para parsear el tiempo
  const [hours, minutes, seconds] = timePart.split(':').map(Number)
  const totalSeconds = (hours * 3600) + (minutes * 60) + seconds
  const signedSeconds = signChar * totalSeconds

  // Determinar si es adelanto o retardo basado en el valor numérico
  const isAdvantage = signedSeconds < 0 // Adelanto (negativo)
  const isDelay = signedSeconds > 0     // Retardo (positivo)

  return {
    value: delta, // Mostramos el string original con signo (+HH:MM:SS o -HH:MM:SS)
    isAdvantage,
    isDelay
  }
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
      <span className="mision-cell cell-id">{misionId}</span>
      <span className="mision-cell cell-nombre">
        {nombre}
      </span>
      <span className="mision-cell cell-fecha">
        {formatFecha(fechaInicioEstimada)}
        {deltaInicio && <span className={`mision-delta ${deltaInicio.isDelay ? 'delta-retardo' : 'delta-adelanto'}`}>{deltaInicio.value}</span>}
      </span>
      <span className="mision-cell cell-fecha">
        {formatFecha(fechaFinEstimada)}
        {deltaFin && <span className={`mision-delta ${deltaFin.isDelay ? 'delta-retardo' : 'delta-adelanto'}`}>{deltaFin.value}</span>}
      </span>
      <span className="mision-cell cell-estado">
        <span className={`mision-status status-${estadoKey}`}>{estadoNombre}</span>
      </span>
    </Link>
  )
}
