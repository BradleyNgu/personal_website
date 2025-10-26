import { useEffect, useRef, useState } from 'react'
import type { WindowState } from './Desktop'
import '../styles/window.css'

interface WindowProps {
  window: WindowState
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onFocus: () => void
  onPositionChange: (position: { x: number; y: number }) => void
  onSizeChange: (size: { width: number; height: number }) => void
}

function Window({
  window,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  onSizeChange,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  
  // Detect if device is mobile (more specific detection)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  const handleMouseDownTitle = (e: React.MouseEvent) => {
    if (window.isMaximized) return
    e.preventDefault()
    onFocus()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y,
    })
  }

  const handleMouseDownContent = (e: React.MouseEvent) => {
    if (window.isMaximized || isMobile) return
    
    // Check if the clicked element is interactive (button, link, input, etc.)
    const target = e.target as HTMLElement
    const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], [onclick]')
    
    if (isInteractive) return
    
    e.preventDefault()
    onFocus()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y,
    })
  }

  const handleTouchStartTitle = (e: React.TouchEvent) => {
    if (window.isMaximized) return
    e.preventDefault()
    onFocus()
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({
      x: touch.clientX - window.position.x,
      y: touch.clientY - window.position.y,
    })
  }

  const handleTouchStartContent = (e: React.TouchEvent) => {
    if (window.isMaximized || isMobile) return
    
    // Check if the touched element is interactive (button, link, input, etc.)
    const target = e.target as HTMLElement
    const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], [onclick]')
    
    if (isInteractive) return
    
    e.preventDefault()
    onFocus()
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({
      x: touch.clientX - window.position.x,
      y: touch.clientY - window.position.y,
    })
  }

  const handleMouseDownResize = (e: React.MouseEvent) => {
    if (window.isMaximized || isMobile) return
    e.preventDefault()
    e.stopPropagation()
    onFocus()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: window.size.width,
      height: window.size.height,
    })
  }

  const handleTouchStartResize = (e: React.TouchEvent) => {
    if (window.isMaximized || isMobile) return
    e.preventDefault()
    e.stopPropagation()
    onFocus()
    const touch = e.touches[0]
    setIsResizing(true)
    setResizeStart({
      x: touch.clientX,
      y: touch.clientY,
      width: window.size.width,
      height: window.size.height,
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onPositionChange({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
      if (isResizing) {
        const newWidth = Math.max(400, resizeStart.width + (e.clientX - resizeStart.x))
        const newHeight = Math.max(300, resizeStart.height + (e.clientY - resizeStart.y))
        onSizeChange({ width: newWidth, height: newHeight })
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        const touch = e.touches[0]
        onPositionChange({
          x: touch.clientX - dragStart.x,
          y: touch.clientY - dragStart.y,
        })
      }
      if (isResizing) {
        const touch = e.touches[0]
        const newWidth = Math.max(400, resizeStart.width + (touch.clientX - resizeStart.x))
        const newHeight = Math.max(300, resizeStart.height + (touch.clientY - resizeStart.y))
        onSizeChange({ width: newWidth, height: newHeight })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, isResizing, dragStart, resizeStart, onPositionChange, onSizeChange])

  if (window.isMinimized) return null

  const style: React.CSSProperties = window.isMaximized
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - var(--taskbar-height, 40px))',
        zIndex: window.zIndex,
        borderRadius: 0,
      }
    : {
        position: 'absolute',
        left: `${window.position.x}px`,
        top: `${window.position.y}px`,
        width: `${window.size.width}px`,
        height: `${window.size.height}px`,
        zIndex: window.zIndex,
      }

  return (
    <div
      ref={windowRef}
      className={`window ${window.isMaximized ? 'maximized' : ''}`}
      style={style}
      onMouseDown={() => onFocus()}
    >
      <div className="window-title-bar" onMouseDown={handleMouseDownTitle} onTouchStart={handleTouchStartTitle}>
        <div className="window-title">
          <img src={window.icon} alt="" className="window-icon" />
          <span>{window.title}</span>
        </div>
        <div className="window-controls">
          <button className="window-button minimize" onClick={onMinimize} title="Minimize">
            <img src="/assets/icons/Windows XP Icons/Minimize.png" alt="Minimize" />
          </button>
          <button className="window-button maximize" onClick={onMaximize} title={window.isMaximized ? "Restore" : "Maximize"}>
            <img src={window.isMaximized ? "/assets/icons/Windows XP Icons/Restore.png" : "/assets/icons/Windows XP Icons/Maximize.png"} alt={window.isMaximized ? "Restore" : "Maximize"} />
          </button>
          <button className="window-button close" onClick={onClose} title="Close">
            <img src="/assets/icons/Windows XP Icons/Exit.png" alt="Close" />
          </button>
        </div>
      </div>
      
      <div className="window-menu-bar" onMouseDown={handleMouseDownContent} onTouchStart={isMobile ? undefined : handleTouchStartContent}>
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Help</span>
      </div>

      <div className="window-content" onMouseDown={handleMouseDownContent} onTouchStart={isMobile ? undefined : handleTouchStartContent}>
        {window.component}
      </div>

      {!window.isMaximized && (
        <div className="window-resize-handle" onMouseDown={handleMouseDownResize} onTouchStart={isMobile ? undefined : handleTouchStartResize}></div>
      )}
    </div>
  )
}

export default Window

