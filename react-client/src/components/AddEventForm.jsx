import { useState, useEffect, useRef } from 'react'
import './AddEventForm.css'

export function AddEventForm({ misiones, defaultMisionId, onClose, onSubmit }) {
  const [misionId, setMisionId] = useState(defaultMisionId || '')
  const [titulo, setTitulo] = useState('')
	const [validationError, setValidationError] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const tituloRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    tituloRef.current?.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    setValidationError('')
    if (!titulo.trim() || !misionId) {
      setValidationError('Completá todos los campos obligatorios')
      return
    }

    const now = new Date()
    const timestamp = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0')

    const mision = misiones.find(m => m.id.toString() === misionId.toString())

    onSubmit({
      misionID: parseInt(misionId),
      misionNombre: mision?.nombre || '',
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      fecha: timestamp
    })

    setTitulo('')
    setDescripcion('')
    tituloRef.current?.focus()
  }

  return (
    <div className="add-event-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose()
    }}>
      <div className="add-event-form" ref={containerRef}>
        <div className="add-event-header">
          <h3>Registrar evento</h3>
				{validationError && <p className="form-error">{validationError}</p>}
          <button className="add-event-close" onClick={onClose}>Esc</button>
        </div>

        <form onSubmit={handleSubmit} className="add-event-fields">
          <div className="add-event-field">
            <label>Misión</label>
            <select
              value={misionId}
              onChange={(e) => setMisionId(e.target.value)}
              className="add-event-select"
            >
<option value="" disabled>Seleccione misión</option>
              {misiones.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </div>

          <div className="add-event-field">
            <label>Título</label>
            <input
              ref={tituloRef}
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título del evento"
              className="add-event-input"
            />
          </div>

          <div className="add-event-field">
            <label>Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder="Descripción del evento (Shift+Enter para salto de línea)"
              className="add-event-textarea"
              rows={3}
            />
          </div>

          <div className="add-event-hint">
            <span>Enter para enviar · Shift+Enter salto de línea · Esc para cerrar</span>
          </div>
        </form>
      </div>
    </div>
  )
}
