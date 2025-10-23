import { useState, useEffect } from 'react'
import '../styles/icon.css'

interface DesktopIconProps {
  id: string
  title: string
  icon: string
  onDoubleClick: () => void
  position: { x: number; y: number }
  isSelected: boolean
  isRecycleBin: boolean
  isRecycleBinHovered: boolean
  onPositionChange: (id: string, x: number, y: number) => void
  onDragOver: (id: string, x: number, y: number) => void
  onDropOnRecycleBin: (id: string) => void
  onSelect: (id: string, addToSelection: boolean) => void
}

function DesktopIcon({ 
  id,
  title, 
  icon, 
  onDoubleClick, 
  position,
  isSelected,
  isRecycleBin,
  isRecycleBinHovered,
  onPositionChange,
  onDragOver,
  onDropOnRecycleBin,
  onSelect
}: DesktopIconProps) {
  const [clickTime, setClickTime] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    const now = Date.now()
    
    if (now - clickTime < 300) {
      // Double click detected
      onDoubleClick()
      setClickTime(0)
    } else {
      // Single click
      setClickTime(now)
      onSelect(id, e.ctrlKey || e.metaKey)
      
      // Only start individual dragging if not part of a multi-selection
      if (!e.ctrlKey && !e.metaKey) {
        setIsDragging(true)
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        })
      }
      
      setTimeout(() => {
        setClickTime(0)
      }, 300)
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, e.clientX - dragStart.x)
        const newY = Math.max(0, e.clientY - dragStart.y)
        onPositionChange(id, newX, newY)
        if (!isRecycleBin) {
          onDragOver(id, newX, newY)
        }
      }
    }

    const handleMouseUp = () => {
      if (isDragging) {
        if (!isRecycleBin) {
          onDropOnRecycleBin(id)
        }
      }
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart, id, onPositionChange, onDragOver, onDropOnRecycleBin, isRecycleBin])

  return (
    <div
      className={`desktop-icon ${isSelected ? 'selected' : ''} ${isRecycleBinHovered ? 'recycle-bin-hovered' : ''}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseDown={handleMouseDown}
      data-icon-id={id}
    >
      <div className="icon-image-container">
        <img src={icon} alt={title} className="icon-image" />
      </div>
      <div className="icon-label">
        <span>{title}</span>
      </div>
    </div>
  )
}

export default DesktopIcon

