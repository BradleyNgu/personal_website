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

  const handleMouseDownResize = (e: React.MouseEvent) => {
    if (window.isMaximized) return
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

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, dragStart, resizeStart, onPositionChange, onSizeChange])

  if (window.isMinimized) return null

  const style: React.CSSProperties = window.isMaximized
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 'calc(100% - 40px)',
        zIndex: window.zIndex,
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
      className="window"
      style={style}
      onMouseDown={onFocus}
    >
      <div className="window-title-bar" onMouseDown={handleMouseDownTitle}>
        <div className="window-title">
          <img src={window.icon} alt="" className="window-icon" />
          <span>{window.title}</span>
        </div>
        <div className="window-controls">
          <button className="window-button minimize" onClick={onMinimize} title="Minimize">
            <span>_</span>
          </button>
          <button className="window-button maximize" onClick={onMaximize} title="Maximize">
            <span>{window.isMaximized ? '❐' : '□'}</span>
          </button>
          <button className="window-button close" onClick={onClose} title="Close">
            <span>×</span>
          </button>
        </div>
      </div>
      
      <div className="window-menu-bar">
        <span className="menu-item">File</span>
        <span className="menu-item">Edit</span>
        <span className="menu-item">View</span>
        <span className="menu-item">Help</span>
      </div>

      <div className="window-content">
        {window.component}
      </div>

      {!window.isMaximized && (
        <div className="window-resize-handle" onMouseDown={handleMouseDownResize}></div>
      )}
    </div>
  )
}

export default Window

