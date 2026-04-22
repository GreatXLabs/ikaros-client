import { useNavigate } from 'react-router-dom'
import './TripulanteItem.css'

const estadosColores = {
  1: 'activo',
  2: 'inactivo',
  3: 'retirado'
}

export function TripulanteItem({ tripulante }) {
  const navigate = useNavigate()
  const estadoClass = estadosColores[tripulante.EstadoTID] || 'inactivo'

  const handleClick = () => {
    navigate(`/Tripulantes/${tripulante.TripulanteID}`)
  }

  return (
    <div className="tripulante-item" onClick={handleClick}>
      <div className="tripulante-img-wrapper">
        <img
          src={tripulante.img || 'https://via.placeholder.com/150'}
          alt={`${tripulante.Nombre} ${tripulante.Apellido}`}
          className="tripulante-img"
        />
        <span className={`estado-indicator ${estadoClass}`}></span>
      </div>
      <p className='Nombre'>{tripulante.Nombre} {tripulante.Apellido}</p>
      <div className='info'>
        <span>{tripulante.Sexo}</span>
        <span>{tripulante.Altura}m</span>
        <span>{tripulante.Peso}kg</span>
      </div>
    </div>
  )
}
