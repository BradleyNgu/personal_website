import { useState, useEffect } from 'react'
import '../styles/generic-viewer.css'

interface GenericViewerProps {
  title: string
  content: React.ReactNode
  onClose: () => void
  showToolbar?: boolean
  showStatusBar?: boolean
  statusInfo?: {
    left?: string[]
    right?: string[]
  }
}

function GenericViewer({ 
  title, 
  content, 
  onClose, 
  showToolbar = true, 
  showStatusBar = true,
  statusInfo = { left: [], right: [] }
}: GenericViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'F11':
          e.preventDefault()
          toggleFullscreen()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Error attempting to enable fullscreen:', err)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="generic-viewer-overlay" onClick={onClose}>
      <div className="generic-viewer-container" onClick={(e) => e.stopPropagation()}>
        {showToolbar && (
          <div className="generic-viewer-toolbar">
            <div className="toolbar-left">
              <button className="toolbar-button" onClick={handleRefresh}>
                <img src="/assets/icons/Windows XP Icons/Refresh.png" alt="Refresh" />
                Refresh
              </button>
              <div className="toolbar-separator"></div>
              <button className="toolbar-button" onClick={handlePrint}>
                <img src="/assets/icons/Windows XP Icons/Print.png" alt="Print" />
                Print
              </button>
            </div>
            
            <div className="toolbar-center">
              <span className="viewer-title">{title}</span>
            </div>
            
            <div className="toolbar-right">
              <button className="toolbar-button" onClick={toggleFullscreen}>
                <img src="/assets/icons/Windows XP Icons/Fullscreen.png" alt="Fullscreen" />
                Fullscreen
              </button>
              <button className="toolbar-button close-button" onClick={onClose}>
                <img src="/assets/icons/Windows XP Icons/Close.png" alt="Close" />
                Close
              </button>
            </div>
          </div>
        )}

        <div className="generic-viewer-content">
          {content}
        </div>

        {showStatusBar && (
          <div className="generic-viewer-status-bar">
            <div className="status-left">
              {statusInfo.left?.map((info, index) => (
                <span key={index}>{info}</span>
              ))}
            </div>
            <div className="status-right">
              {statusInfo.right?.map((info, index) => (
                <span key={index}>{info}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GenericViewer
