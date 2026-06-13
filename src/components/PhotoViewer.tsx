import { useState, useEffect } from 'react'
import '../styles/window.css'
import '../styles/generic-viewer.css'
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
  const [isFullscreen, setIsFullscreen] = useState(false)

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
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
    <div className="generic-viewer-overlay photo-viewer-overlay" onClick={onClose}>
      <div className="generic-viewer-container photo-viewer-container" onClick={(e) => e.stopPropagation()}>
        <div className="window-title-bar photo-viewer-titlebar">
          <div className="window-title">
            <img
              src="/assets/icons/Windows XP Icons/JPG.png"
              alt=""
              className="window-icon"
              draggable={false}
              onError={(e) => {
                e.currentTarget.src = '/assets/icons/Windows XP Icons/My Pictures.png'
              }}
            />
            <span title={currentPhoto.name}>{currentPhoto.name}</span>
            <span className="photo-viewer-index">({currentPhotoIndex + 1} of {photos.length})</span>
          </div>
          <div className="window-controls">
            <button
              type="button"
              className="window-button maximize"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Restore' : 'Maximize'}
              aria-label={isFullscreen ? 'Restore' : 'Maximize'}
            >
              <img
                src={isFullscreen ? '/assets/icons/Windows XP Icons/Restore.png' : '/assets/icons/Windows XP Icons/Maximize.png'}
                alt=""
                draggable={false}
              />
            </button>
            <button
              type="button"
              className="window-button close"
              onClick={onClose}
              title="Close"
              aria-label="Close viewer"
            >
              <img src="/assets/icons/Windows XP Icons/Exit.png" alt="" draggable={false} />
            </button>
          </div>
        </div>

        <div className="explorer-toolbar photo-viewer-actions">
          <div className="toolbar-left">
            <button
              type="button"
              className="toolbar-btn"
              onClick={onPrevious}
              disabled={currentPhotoIndex === 0}
              title="Previous"
              aria-label="Previous photo"
            >
              <img src="/assets/icons/Windows XP Icons/Back.png" alt="" />
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={onNext}
              disabled={currentPhotoIndex === photos.length - 1}
              title="Next"
              aria-label="Next photo"
            >
              <img src="/assets/icons/Windows XP Icons/Forward.png" alt="" />
            </button>
            <div className="toolbar-separator" />
            <button type="button" className="toolbar-btn" onClick={handleZoomOut} title="Zoom out" aria-label="Zoom out">
              <span className="photo-viewer-tool-label">−</span>
            </button>
            <button
              type="button"
              className="photo-viewer-zoom"
              onClick={handleResetZoom}
              title="Actual size"
              aria-label={`Zoom ${zoom}%, reset to actual size`}
            >
              {zoom}%
            </button>
            <button type="button" className="toolbar-btn" onClick={handleZoomIn} title="Zoom in" aria-label="Zoom in">
              <span className="photo-viewer-tool-label">+</span>
            </button>
            <div className="toolbar-separator" />
            <button type="button" className="toolbar-btn" onClick={handleRotate} title="Rotate" aria-label="Rotate clockwise">
              <span className="photo-viewer-tool-label">↻</span>
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={handleResetRotation}
              disabled={rotation === 0}
              title="Reset rotation"
              aria-label="Reset rotation"
            >
              <span className="photo-viewer-tool-label">↺</span>
            </button>
            <div className="toolbar-separator photo-viewer-desktop-only" />
            <button
              type="button"
              className="toolbar-btn photo-viewer-desktop-only"
              onClick={handlePrint}
              title="Print"
              aria-label="Print"
            >
              <img src="/assets/icons/Windows XP Icons/Printer.png" alt="" />
            </button>
            <button type="button" className="toolbar-btn" onClick={handleDownload} title="Download" aria-label="Download">
              <img src="/assets/icons/Windows XP Icons/Save.png" alt="" />
            </button>
          </div>
        </div>

        <div className="generic-viewer-content photo-viewer-content">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p>Loading image...</p>
            </div>
          ) : (
            <img
              src={currentPhoto.path}
              alt={currentPhoto.name}
              className="photo-viewer-image"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease',
              }}
              onError={(e) => {
                e.currentTarget.src = '/assets/icons/Windows XP Icons/Generic Document.png'
              }}
            />
          )}
        </div>

        <div className="generic-viewer-status-bar">
          <div className="status-left">
            <span className="photo-viewer-status-name">{currentPhoto.name}</span>
            <span className="photo-viewer-status-meta">{currentPhoto.size}</span>
            <span className="photo-viewer-status-meta">{currentPhoto.date}</span>
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
