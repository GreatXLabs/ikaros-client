import './EventItem.css'

export function EventItem({ event }) {
  return (
    <div className="event-item">
      <div className="main-info">
        <p className='overline'>{event.misionNombre}</p>
        <p className='title'>{event.titulo}</p>
        <p className='descripcion'>{event.descripcion}</p>
      </div>

      <div className="time-stamp">
        <p>{event.fecha}</p>
      </div>
    </div>
  )
}
