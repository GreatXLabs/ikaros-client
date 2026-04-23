import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './ConfirmModal.css'

export function ConfirmModal({ open, title, message, confirmLabel = 'Confirmar', confirmVariant = 'danger', onConfirm, onCancel }) {
	const overlayRef = useRef(null)

	useEffect(() => {
		if (!open) return
		const handleEscape = (e) => {
			if (e.key === 'Escape') onCancel?.()
		}
		document.addEventListener('keydown', handleEscape)
		return () => document.removeEventListener('keydown', handleEscape)
	}, [open, onCancel])

	if (!open) return null

	return createPortal(
		<div className="modal-overlay" ref={overlayRef} onClick={(e) => {
			if (e.target === overlayRef.current) onCancel?.()
		}}>
			<div className="modal-content">
				<h2>{title}</h2>
				<p>{message}</p>
				<div className="modal-buttons">
					<button className="modal-cancel-btn" onClick={onCancel}>
						Cancelar
					</button>
					<button className={`modal-confirm-btn ${confirmVariant}`} onClick={onConfirm}>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>,
		document.body
	)
}
