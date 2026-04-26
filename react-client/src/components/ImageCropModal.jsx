import { useState, useCallback, useRef } from 'react'
import Cropper from 'react-easy-crop'
import { Button } from './Button'
import './ImageCropModal.css'

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext('2d')

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(blob)
    }, 'image/jpeg', 0.9)
  })
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.crossOrigin = 'anonymous'
    image.src = url
  })
}

export function ImageCropModal({ imageSrc, onClose, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [processing, setProcessing] = useState(false)

  const onCropChange = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return
    setProcessing(true)
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels)
      const file = new File([blob], 'tripulante.jpg', { type: 'image/jpeg' })
      onCropComplete(file)
    } catch {
      setProcessing(false)
    }
  }

  return (
    <div className="crop-overlay">
      <div className="crop-modal">
        <h2 className="crop-title">Recortar imagen</h2>
        <div className="crop-container">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            restrictPosition={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropChange}
          />
        </div>
        <div className="crop-zoom">
          <label className="crop-zoom-label">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
          />
        </div>
        <div className="crop-actions">
          <Button label="Cancelar" color="red" onClick={onClose} />
          <Button
            label={processing ? 'Procesando...' : 'Confirmar'}
            color="blue"
            onClick={handleConfirm}
            disabled={processing}
          />
        </div>
      </div>
    </div>
  )
}
