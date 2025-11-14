import { useState, useEffect, useRef } from 'react'
import '../styles/icon.css'

// Helper function to constrain icon within viewport
const constrainIconPosition = (x: number, y: number, iconWidth: number, iconHeight: number): { x: number; y: number } => {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const taskbarHeight = 40 // --taskbar-height (default)
  
  // Get actual taskbar height from CSS variable if available
  const rootStyle = getComputedStyle(document.documentElement)
  const actualTaskbarHeight = parseInt(rootStyle.getPropertyValue('--taskbar-height')) || taskbarHeight
  
  // Constrain X: icon must stay within viewport horizontally
  const constrainedX = iconWidth > viewportWidth
    ? Math.max(0, x) // Only prevent going off left edge
    : Math.max(0, Math.min(x, viewportWidth - iconWidth)) // Keep entire icon visible
  
  // Constrain Y: icon must stay within viewport vertically (accounting for taskbar)
  const maxY = viewportHeight - actualTaskbarHeight - iconHeight
  const constrainedY = Math.max(0, Math.min(y, maxY))
  
  return { x: constrainedX, y: constrainedY }
}

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
  hasMultipleSelected: boolean
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
  onSelect,
  hasMultipleSelected
}: DesktopIconProps) {
  const [clickTime, setClickTime] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const iconRef = useRef<HTMLDivElement>(null)
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null)
  const lastDragOverTimeRef = useRef<number>(0)
  const rafRef = useRef<number | null>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    const now = Date.now()
    
    if (now - clickTime < 300) {
      // Double click detected
      e.stopPropagation()
      onDoubleClick()
      setClickTime(0)
    } else {
      // Single click
      setClickTime(now)
      
      // If multiple icons are selected, don't change selection - just let desktop handle dragging
      if (hasMultipleSelected) {
        // Let the desktop handle multi-selection dragging
        return
      }
      
      // Only change selection if not part of a multi-selection
      onSelect(id, e.ctrlKey || e.metaKey)
      
      // Only start individual dragging if not part of a multi-selection
      if (!e.ctrlKey && !e.metaKey) {
        e.stopPropagation()
        setIsDragging(true)
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        })
      } else {
        e.stopPropagation()
      }
      
      setTimeout(() => {
        setClickTime(0)
      }, 300)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const now = Date.now()
    const touch = e.touches[0]
    
    if (now - clickTime < 300) {
      // Double tap detected
      e.stopPropagation()
      onDoubleClick()
      setClickTime(0)
    } else {
      // Single tap
      setClickTime(now)
      
      // If multiple icons are selected, don't change selection - just let desktop handle dragging
      if (hasMultipleSelected) {
        // Let the desktop handle multi-selection dragging
        return
      }
      
      // Only change selection if not part of a multi-selection
      onSelect(id, false) // Touch doesn't support ctrl/meta key
      
      // Start dragging for touch only if not part of a multi-selection
      e.stopPropagation()
      setIsDragging(true)
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      })
      
      setTimeout(() => {
        setClickTime(0)
      }, 300)
    }
  }

  useEffect(() => {
    // Don't start individual dragging if multiple icons are selected
    if (hasMultipleSelected) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && iconRef.current) {
        let newX = e.clientX - dragStart.x
        let newY = e.clientY - dragStart.y
        
        // Constrain icon to stay within viewport
        const iconWidth = iconRef.current.offsetWidth
        const iconHeight = iconRef.current.offsetHeight
        const constrained = constrainIconPosition(newX, newY, iconWidth, iconHeight)
        newX = constrained.x
        newY = constrained.y
        
        // Store for final commit
        dragOffsetRef.current = { x: newX, y: newY }
        
        // Use requestAnimationFrame for smooth 60fps updates
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
        }
        
        rafRef.current = requestAnimationFrame(() => {
          if (iconRef.current) {
            // Apply transform directly to DOM for smooth dragging
            const deltaX = newX - position.x
            const deltaY = newY - position.y
            
            iconRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`
            iconRef.current.style.willChange = 'transform'
          }
        })
        
        // Throttle onDragOver calls to avoid too many state updates (every 150ms)
        const now = Date.now()
        if (!isRecycleBin && now - lastDragOverTimeRef.current >= 150) {
          onDragOver(id, newX, newY)
          lastDragOverTimeRef.current = now
        }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && iconRef.current) {
        e.preventDefault()
        const touch = e.touches[0]
        let newX = touch.clientX - dragStart.x
        let newY = touch.clientY - dragStart.y
        
        // Constrain icon to stay within viewport
        const iconWidth = iconRef.current.offsetWidth
        const iconHeight = iconRef.current.offsetHeight
        const constrained = constrainIconPosition(newX, newY, iconWidth, iconHeight)
        newX = constrained.x
        newY = constrained.y
        
        // Store for final commit
        dragOffsetRef.current = { x: newX, y: newY }
        
        // Apply transform directly to DOM immediately for smooth dragging
        const deltaX = newX - position.x
        const deltaY = newY - position.y
        
        iconRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`
        iconRef.current.style.willChange = 'transform'
        
        // Throttle onDragOver calls to avoid too many state updates (every 150ms)
        const now = Date.now()
        if (!isRecycleBin && now - lastDragOverTimeRef.current >= 150) {
          onDragOver(id, newX, newY)
          lastDragOverTimeRef.current = now
        }
      }
    }

    const handleMouseUp = () => {
      if (isDragging) {
        // Cancel any pending RAF
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
        
        // Commit final position to state
        if (dragOffsetRef.current && iconRef.current) {
          onPositionChange(id, dragOffsetRef.current.x, dragOffsetRef.current.y)
          // Reset transform
          iconRef.current.style.transform = ''
          iconRef.current.style.willChange = 'auto'
          dragOffsetRef.current = null
        }
        
        if (!isRecycleBin) {
          onDropOnRecycleBin(id)
        }
      }
      setIsDragging(false)
    }

    const handleTouchEnd = () => {
      if (isDragging) {
        // Commit final position to state
        if (dragOffsetRef.current && iconRef.current) {
          onPositionChange(id, dragOffsetRef.current.x, dragOffsetRef.current.y)
          // Reset transform
          iconRef.current.style.transform = ''
          iconRef.current.style.willChange = 'auto'
          dragOffsetRef.current = null
        }
        
        if (!isRecycleBin) {
          onDropOnRecycleBin(id)
        }
      }
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      return () => {
        // Cancel any pending RAF
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
        
        // Cleanup: reset transform if dragging was interrupted
        if (iconRef.current && dragOffsetRef.current) {
          iconRef.current.style.transform = ''
          iconRef.current.style.willChange = 'auto'
        }
        
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, dragStart, id, onPositionChange, onDragOver, onDropOnRecycleBin, isRecycleBin, hasMultipleSelected, position])

  return (
    <div
      ref={iconRef}
      className={`desktop-icon ${isSelected ? 'selected' : ''} ${isRecycleBinHovered ? 'recycle-bin-hovered' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{ left: `${position.x}px`, top: `${position.y}px`, transform: 'translateZ(0)' }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      data-icon-id={id}
    >
      <div className="icon-image-container">
        <img 
          src={icon} 
          alt={title} 
          className="icon-image" 
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>
      <div className="icon-label">
        <span>{title}</span>
      </div>
    </div>
  )
}

export default DesktopIcon

