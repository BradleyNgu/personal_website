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
  const menuBarRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null)
  const hasMovedRef = useRef<boolean>(false)
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null)
  const resizeSizeRef = useRef<{ width: number; height: number } | null>(null)
  const rafRef = useRef<number | null>(null)
  
  // Detect if device is mobile (more specific detection)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  // Constrain window position to stay within viewport bounds
  const constrainPosition = (x: number, y: number): { x: number; y: number } => {
    // Get taskbar height from CSS variable or use mobile-specific value
    const taskbarHeight = isMobile ? 35 : 40 // Mobile: 35px, Desktop: 40px
    const viewportWidth = globalThis.innerWidth ?? 0
    const viewportHeight = (globalThis.innerHeight ?? 0) - taskbarHeight
    
    // Constrain X position: window must stay within viewport horizontally
    const minX = 0
    const maxX = Math.max(0, viewportWidth - window.size.width)
    const constrainedX = Math.max(minX, Math.min(maxX, x))
    
    // Constrain Y position: window must stay within viewport vertically (above taskbar)
    const minY = 0
    const maxY = Math.max(0, viewportHeight - window.size.height)
    const constrainedY = Math.max(minY, Math.min(maxY, y))
    
    return { x: constrainedX, y: constrainedY }
  }

  const handleMouseDownTitle = (e: React.MouseEvent) => {
    // Don't allow dragging if clicking on window controls
    const target = e.target as HTMLElement
    if (target.closest('.window-controls, .window-button')) return
    
    // On mobile, disable dragging when maximized (only allow when not maximized)
    if (isMobile && window.isMaximized) {
      onFocus()
      return
    }
    
    e.preventDefault()
    onFocus()
    
    if (window.isMaximized) {
      // When dragging a maximized window, restore it first
      // Calculate the restore position based on where the user clicked
      const restoreX = e.clientX - window.size.width / 2
      const restoreY = e.clientY - 50 // Offset from top
      
      // Unmaximize the window
      onMaximize()
      
      // Set position and start dragging
      onPositionChange({ x: restoreX, y: restoreY })
      
      setIsDragging(true)
      setDragStart({
        x: e.clientX - restoreX,
        y: e.clientY - restoreY,
      })
    } else {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y,
      })
    }
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
    // Don't allow dragging if touching window controls
    const target = e.target as HTMLElement
    if (target.closest('.window-controls, .window-button')) return
    
    const touch = e.touches[0]
    if (!touch) return
    
    // Store initial touch position and reset movement flag
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY }
    hasMovedRef.current = false
    
    // Always focus on touch start
    onFocus()
    
    // On mobile, if maximized, ONLY allow focusing - disable dragging completely
    if (isMobile && window.isMaximized) {
      setIsDragging(false)
      return
    }
    
    // On mobile, if not maximized, prepare for dragging (will start on move)
    if (isMobile && !window.isMaximized) {
      setIsDragging(false) // Don't start dragging until movement detected
      return
    }
    
    // Desktop behavior - start dragging immediately
    if (window.isMaximized) {
      // On desktop, when dragging a maximized window, restore it first
      const restoreX = touch.clientX - window.size.width / 2
      const restoreY = touch.clientY - 50
      
      // Unmaximize the window
      onMaximize()
      
      onPositionChange({ x: restoreX, y: restoreY })
      
      setIsDragging(true)
      setDragStart({
        x: touch.clientX - restoreX,
        y: touch.clientY - restoreY,
      })
    } else {
      // Allow dragging when window is not maximized (desktop)
      setIsDragging(true)
      setDragStart({
        x: touch.clientX - window.position.x,
        y: touch.clientY - window.position.y,
      })
    }
  }

  const handleTouchStartContent = (e: React.TouchEvent) => {
    if (window.isMaximized || isMobile) return
    
    // Check if the touched element is interactive (button, link, input, etc.)
    const target = e.target as HTMLElement
    const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], [onclick]')
    
    if (isInteractive) return
    
    // Don't call preventDefault on touchStart - rely on CSS touch-action
    onFocus()
    const touch = e.touches[0]
    if (!touch) return
    
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
    
    // Don't call preventDefault on touchStart - rely on CSS touch-action
    // stopPropagation is safe to call
    e.stopPropagation()
    
    onFocus()
    const touch = e.touches[0]
    if (!touch) return
    
    setIsResizing(true)
    setResizeStart({
      x: touch.clientX,
      y: touch.clientY,
      width: window.size.width,
      height: window.size.height,
    })
  }

  const handleMenuClick = (menuName: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFocus()
    
    // Toggle menu - if clicking the same menu, close it; otherwise open the clicked menu
    if (openMenu === menuName) {
      setOpenMenu(null)
    } else {
      setOpenMenu(menuName)
    }
  }

  const handleMenuItemClick = (action: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Handle menu item actions here
    console.log(`Menu action: ${action}`)
    setOpenMenu(null)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }

    if (openMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [openMenu])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && windowRef.current && !window.isMaximized) {
        // Use transform for smooth dragging - updates DOM directly without React re-renders
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y
        
        // Constrain position to viewport bounds
        const constrained = constrainPosition(newX, newY)
        
        // Store offset for final commit
        dragOffsetRef.current = constrained
        
        // Apply transform directly to DOM for smooth animation
        const baseX = window.position.x
        const baseY = window.position.y
        const deltaX = constrained.x - baseX
        const deltaY = constrained.y - baseY
        
        windowRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`
        windowRef.current.style.willChange = 'transform'
      } else if (isDragging) {
        // For maximized windows or if ref not available, use state updates
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y
        const constrained = constrainPosition(newX, newY)
        onPositionChange(constrained)
      }
      if (isResizing && windowRef.current) {
        const newWidth = Math.max(400, resizeStart.width + (e.clientX - resizeStart.x))
        const newHeight = Math.max(300, resizeStart.height + (e.clientY - resizeStart.y))
        
        // Store for final commit
        resizeSizeRef.current = { width: newWidth, height: newHeight }
        
        // Use requestAnimationFrame for smooth 60fps updates
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
        }
        
        rafRef.current = requestAnimationFrame(() => {
          if (windowRef.current && resizeSizeRef.current) {
            // Apply size directly to DOM for smooth resizing
            windowRef.current.style.width = `${resizeSizeRef.current.width}px`
            windowRef.current.style.height = `${resizeSizeRef.current.height}px`
          }
        })
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch || !touchStartPosRef.current) return
      
      // Calculate movement distance
      const deltaX = Math.abs(touch.clientX - touchStartPosRef.current.x)
      const deltaY = Math.abs(touch.clientY - touchStartPosRef.current.y)
      const moveThreshold = 10 // pixels - threshold to distinguish tap from drag
      
      // If user has moved significantly, mark as moved
      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        hasMovedRef.current = true
        
        // Prevent dragging on mobile when maximized - should never happen but safety check
        if (isMobile && window.isMaximized) {
          setIsDragging(false)
          e.preventDefault()
          return
        }
        
        // On mobile, if not maximized and we haven't started dragging yet, start it now
        if (isMobile && !window.isMaximized && !isDragging) {
          // Ensure current position is within bounds before starting drag
          const currentPos = constrainPosition(window.position.x, window.position.y)
          if (currentPos.x !== window.position.x || currentPos.y !== window.position.y) {
            // Snap window back to valid position if it's off-screen
            onPositionChange(currentPos)
          }
          
          setIsDragging(true)
          setDragStart({
            x: touch.clientX - currentPos.x,
            y: touch.clientY - currentPos.y,
          })
        }
      }
      
      if (isDragging && windowRef.current && !window.isMaximized) {
        // Prevent scrolling when dragging (touchmove is already non-passive)
        e.preventDefault()
        if (touch) {
          // Use transform for smooth dragging on touch devices too
          const newX = touch.clientX - dragStart.x
          const newY = touch.clientY - dragStart.y
          
          // Constrain position to viewport bounds
          const constrained = constrainPosition(newX, newY)
          
          dragOffsetRef.current = constrained
          
          const baseX = window.position.x
          const baseY = window.position.y
          const deltaX = constrained.x - baseX
          const deltaY = constrained.y - baseY
          
          windowRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`
          windowRef.current.style.willChange = 'transform'
        }
      } else if (isDragging) {
        // For maximized windows, use state updates
        e.preventDefault()
        if (touch) {
          const newX = touch.clientX - dragStart.x
          const newY = touch.clientY - dragStart.y
          const constrained = constrainPosition(newX, newY)
          onPositionChange(constrained)
        }
      }
      if (isResizing && windowRef.current) {
        // Prevent scrolling when resizing (touchmove is already non-passive)
        e.preventDefault()
        const touch = e.touches[0]
        if (touch) {
          const newWidth = Math.max(400, resizeStart.width + (touch.clientX - resizeStart.x))
          const newHeight = Math.max(300, resizeStart.height + (touch.clientY - resizeStart.y))
          
          // Store for final commit
          resizeSizeRef.current = { width: newWidth, height: newHeight }
          
          // Apply size directly to DOM for smooth resizing
          windowRef.current.style.width = `${newWidth}px`
          windowRef.current.style.height = `${newHeight}px`
        }
      }
    }

    const handleMouseUp = () => {
      // Cancel any pending RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      
      if (isDragging && dragOffsetRef.current && windowRef.current && !window.isMaximized) {
        // Constrain final position to viewport bounds before committing
        const constrained = constrainPosition(dragOffsetRef.current.x, dragOffsetRef.current.y)
        // Commit final position to state
        onPositionChange(constrained)
        // Reset transform
        windowRef.current.style.transform = ''
        windowRef.current.style.willChange = 'auto'
        dragOffsetRef.current = null
      }
      
      if (isResizing && resizeSizeRef.current && windowRef.current) {
        // Commit final size to state
        onSizeChange(resizeSizeRef.current)
        // Reset inline styles to let state control
        windowRef.current.style.width = ''
        windowRef.current.style.height = ''
        resizeSizeRef.current = null
      }
      
      setIsDragging(false)
      setIsResizing(false)
    }

    const handleTouchEnd = () => {
      // Cancel any pending RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      
      // On mobile, if maximized and user only tapped (didn't move), don't unmaximize
      // The hasMovedRef check ensures we only unmaximize if user actually dragged
      
      // Commit position if dragging
      if (isDragging && dragOffsetRef.current && windowRef.current && !window.isMaximized) {
        // Constrain final position to viewport bounds before committing
        const constrained = constrainPosition(dragOffsetRef.current.x, dragOffsetRef.current.y)
        onPositionChange(constrained)
        windowRef.current.style.transform = ''
        windowRef.current.style.willChange = 'auto'
        dragOffsetRef.current = null
      }
      
      // Commit size if resizing
      if (isResizing && resizeSizeRef.current && windowRef.current) {
        onSizeChange(resizeSizeRef.current)
        windowRef.current.style.width = ''
        windowRef.current.style.height = ''
        resizeSizeRef.current = null
      }
      
      // Reset touch tracking
      touchStartPosRef.current = null
      hasMovedRef.current = false
      
      setIsDragging(false)
      setIsResizing(false)
    }

    // Always listen for mouse events if dragging/resizing
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    
    // Always listen for touch events to detect movement (especially on mobile)
    // This is needed to distinguish taps from drags
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
    
    return () => {
      // Cancel any pending RAF
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      
      // Cleanup: reset transform if dragging was interrupted
      if (windowRef.current) {
        if (dragOffsetRef.current) {
          windowRef.current.style.transform = ''
          windowRef.current.style.willChange = 'auto'
        }
        if (resizeSizeRef.current) {
          windowRef.current.style.width = ''
          windowRef.current.style.height = ''
        }
      }
      
      if (isDragging || isResizing) {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, isResizing, dragStart, resizeStart, onPositionChange, onSizeChange, window.position, window.size, isMobile, window.isMaximized])

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
        transform: 'translateZ(0)', // Reset transform if dragging was interrupted
      }

  return (
    <div
      ref={windowRef}
      className={`window ${window.isMaximized ? 'maximized' : ''} ${isResizing ? 'resizing' : ''}`}
      style={style}
      onMouseDown={() => onFocus()}
    >
      <div 
        className="window-title-bar" 
        onMouseDown={isMobile && window.isMaximized ? undefined : handleMouseDownTitle} 
        onTouchStart={handleTouchStartTitle}
      >
        <div className="window-title">
          <img src={window.icon} alt="" className="window-icon" />
          <span style={{ flexShrink: 0 }}>{window.title}</span>
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
      
      <div 
        ref={menuBarRef}
        className="window-menu-bar"
      >
        <div className="menu-item-wrapper">
          <span 
            className={`menu-item ${openMenu === 'File' ? 'active' : ''}`}
            onClick={(e) => handleMenuClick('File', e)}
          >
            File
          </span>
          {openMenu === 'File' && (
            <div className="menu-dropdown">
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('New', e)}>New</div>
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('Open', e)}>Open</div>
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('Save', e)}>Save</div>
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('Save As', e)}>Save As...</div>
              <div className="menu-dropdown-separator"></div>
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('Exit', e)}>Exit</div>
            </div>
          )}
        </div>
        <div className="menu-item-wrapper">
          <span 
            className={`menu-item ${openMenu === 'Edit' ? 'active' : ''}`}
            onClick={(e) => handleMenuClick('Edit', e)}
          >
            Edit
          </span>
          {openMenu === 'Edit' && (
            <div className="menu-dropdown">
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('Undo', e)}>Undo</div>
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('Redo', e)}>Redo</div>
              <div className="menu-dropdown-separator"></div>
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('Cut', e)}>Cut</div>
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('Copy', e)}>Copy</div>
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('Paste', e)}>Paste</div>
              <div className="menu-dropdown-separator"></div>
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('Select All', e)}>Select All</div>
            </div>
          )}
        </div>
        <div className="menu-item-wrapper">
          <span 
            className={`menu-item ${openMenu === 'View' ? 'active' : ''}`}
            onClick={(e) => handleMenuClick('View', e)}
          >
            View
          </span>
          {openMenu === 'View' && (
            <div className="menu-dropdown">
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('Toolbar', e)}>Toolbar</div>
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('Status Bar', e)}>Status Bar</div>
              <div className="menu-dropdown-separator"></div>
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('Large Icons', e)}>Large Icons</div>
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('Small Icons', e)}>Small Icons</div>
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('List', e)}>List</div>
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('Details', e)}>Details</div>
              <div className="menu-dropdown-separator"></div>
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('Refresh', e)}>Refresh</div>
            </div>
          )}
        </div>
        <div className="menu-item-wrapper">
          <span 
            className={`menu-item ${openMenu === 'Help' ? 'active' : ''}`}
            onClick={(e) => handleMenuClick('Help', e)}
          >
            Help
          </span>
          {openMenu === 'Help' && (
            <div className="menu-dropdown">
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('Help Topics', e)}>Help Topics</div>
              <div className="menu-dropdown-item" onClick={(e) => handleMenuItemClick('About', e)}>About</div>
            </div>
          )}
        </div>
      </div>

      <div className="window-content">
        {window.component}
      </div>

      {!window.isMaximized && (
        <div className="window-resize-handle" onMouseDown={handleMouseDownResize} onTouchStart={isMobile ? undefined : handleTouchStartResize}></div>
      )}
    </div>
  )
}

export default Window

