import { useState, useEffect } from 'react'
import '../styles/photo-viewer.css'

interface PhotoViewerProps {
  photos: Array<{
    name: string
    path: string
    size: string
    date: string
    thumbnail: string
  }>
  currentPhotoIndex: number
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

function PhotoViewer({ photos, currentPhotoIndex, onClose, onNext, onPrevious }: PhotoViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  const currentPhoto = photos[currentPhotoIndex]

  useEffect(() => {
    setIsLoading(true)
    const img = new Image()
    img.onload = () => setIsLoading(false)
    img.onerror = () => setIsLoading(false)
    img.src = currentPhoto.path
  }, [currentPhoto.path])

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onClose()
        break
      case 'ArrowLeft':
        onPrevious()
        break
      case 'ArrowRight':
        onNext()
        break
      case 'F11':
        e.preventDefault()
        toggleFullscreen()
        break
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Error attempting to enable fullscreen:', err)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 400))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25))
  }

  const handleResetZoom = () => {
    setZoom(100)
  }

  const handleResetRotation = () => {
    setRotation(0)
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = currentPhoto.path
    link.download = currentPhoto.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="photo-viewer-overlay" onClick={onClose}>
      <div className="photo-viewer-container" onClick={(e) => e.stopPropagation()}>
        <div className="photo-viewer-toolbar">
          <div className="toolbar-left">
            <button className="toolbar-button" onClick={onPrevious} disabled={currentPhotoIndex === 0}>
              <img src="/assets/icons/Windows XP Icons/Back.png" alt="Previous" />
              Previous
            </button>
            <button className="toolbar-button" onClick={onNext} disabled={currentPhotoIndex === photos.length - 1}>
              <img src="/assets/icons/Windows XP Icons/Forward.png" alt="Next" />
              Next
            </button>
            <div className="toolbar-separator"></div>
            <button className="toolbar-button" onClick={handleZoomOut}>
              <img src="/assets/icons/Windows XP Icons/Zoom Out.png" alt="Zoom Out" />
              Zoom Out
            </button>
            <span className="zoom-level">{zoom}%</span>
            <button className="toolbar-button" onClick={handleZoomIn}>
              <img src="/assets/icons/Windows XP Icons/Zoom In.png" alt="Zoom In" />
              Zoom In
            </button>
            <button className="toolbar-button" onClick={handleResetZoom}>
              <img src="/assets/icons/Windows XP Icons/Actual Size.png" alt="Actual Size" />
              Actual Size
            </button>
            <button className="toolbar-button" onClick={handleResetRotation}>
              <img src="/assets/icons/Windows XP Icons/Reset.png" alt="Reset Rotation" />
              Reset Rotation
            </button>
          </div>
          
          <div className="toolbar-center">
            <span className="photo-info">
              {currentPhotoIndex + 1} of {photos.length} - {currentPhoto.name}
            </span>
          </div>
          
          <div className="toolbar-right">
            <button className="toolbar-button" onClick={handleRotate}>
              <img src="/assets/icons/Windows XP Icons/Rotate.png" alt="Rotate" />
              Rotate
            </button>
            <button className="toolbar-button" onClick={handlePrint}>
              <img src="/assets/icons/Windows XP Icons/Print.png" alt="Print" />
              Print
            </button>
            <button className="toolbar-button" onClick={handleDownload}>
              <img src="/assets/icons/Windows XP Icons/Save.png" alt="Download" />
              Download
            </button>
            <button className="toolbar-button" onClick={toggleFullscreen}>
              <img src="/assets/icons/Windows XP Icons/Maximize.png" alt="Fullscreen" />
              Fullscreen
            </button>
            <button className="toolbar-button close-button" onClick={onClose}>
              <img src="/assets/icons/Windows XP Icons/Exit.png" alt="Close" />
              Close
            </button>
          </div>
        </div>

        <div className="photo-viewer-content">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading image...</p>
            </div>
          ) : (
            <img
              src={currentPhoto.path}
              alt={currentPhoto.name}
              className="photo-viewer-image"
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease'
              }}
              onError={(e) => {
                e.currentTarget.src = '/assets/icons/Windows XP Icons/Generic Document.png'
              }}
            />
          )}
        </div>

        <div className="photo-viewer-status-bar">
          <div className="status-left">
            <span>{currentPhoto.name}</span>
            <span>{currentPhoto.size}</span>
            <span>{currentPhoto.date}</span>
          </div>
          <div className="status-right">
            <span>{zoom}%</span>
            {rotation !== 0 && <span>Rotated {rotation}°</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhotoViewer
