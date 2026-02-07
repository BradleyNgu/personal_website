import { useState, useRef, useEffect } from 'react'
import { flushSync } from 'react-dom'
import Taskbar from './Taskbar'
import Window from './Window'
import DesktopIcon from './DesktopIcon'
import ErrorDialog from './ErrorDialog'
import Projects from '../pages/Projects'
import Experiences from '../pages/Experiences'
import Autobiography from '../pages/Autobiography'
import ContactEmail from '../pages/ContactEmail'
import RecycleBin from '../pages/RecycleBin'
import CommandPrompt from '../pages/CommandPrompt'
import MyPictures from '../pages/MyPictures'
import MyMusic from '../pages/MyMusic'
import Resume from '../pages/Resume'
import InternetExplorer from '../pages/InternetExplorer'
import Search from '../pages/Search'
import Run from '../pages/Run'
import { getCurrentWallpaper } from '../utils/wallpaperRotation'
import '../styles/desktop.css'

export interface WindowState {
  id: string
  title: string
  icon: string
  component: React.ReactNode
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
  hideMenuBar?: boolean
}

export interface IconPosition {
  id: string
  x: number
  y: number
}

export interface RecycleBinItem {
  id: string
  title: string
  icon: string
  originalPosition: { x: number; y: number }
}

interface DesktopProps {
  onShutdown: () => void
  onLogOff: () => void
}

// Helper function to constrain multi-selection icon positions within viewport
const constrainMultiSelectionDelta = (
  iconPositions: IconPosition[],
  selectedIds: string[],
  deltaX: number,
  deltaY: number,
  iconWidth: number = 75,
  iconHeight: number = 100
): { deltaX: number; deltaY: number } => {
  if (selectedIds.length === 0) return { deltaX, deltaY }
  
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const taskbarHeight = 40 // --taskbar-height (default)
  
  // Get actual taskbar height from CSS variable if available
  const rootStyle = getComputedStyle(document.documentElement)
  const actualTaskbarHeight = parseInt(rootStyle.getPropertyValue('--taskbar-height')) || taskbarHeight
  
  // Get selected icon positions
  const selectedIcons = iconPositions.filter(icon => selectedIds.includes(icon.id))
  if (selectedIcons.length === 0) return { deltaX, deltaY }
  
  // Calculate bounding box of selected icons
  const minX = Math.min(...selectedIcons.map(icon => icon.x))
  const maxX = Math.max(...selectedIcons.map(icon => icon.x + iconWidth))
  const minY = Math.min(...selectedIcons.map(icon => icon.y))
  const maxY = Math.max(...selectedIcons.map(icon => icon.y + iconHeight))
  
  // Calculate proposed new positions
  const newMinX = minX + deltaX
  const newMaxX = maxX + deltaX
  const newMinY = minY + deltaY
  const newMaxY = maxY + deltaY
  
  // Constrain deltaX
  let constrainedDeltaX = deltaX
  if (newMinX < 0) {
    constrainedDeltaX = -minX // Move to left edge
  } else if (newMaxX > viewportWidth) {
    constrainedDeltaX = viewportWidth - maxX // Move to right edge
  }
  
  // Constrain deltaY (accounting for taskbar)
  const maxViewportY = viewportHeight - actualTaskbarHeight
  let constrainedDeltaY = deltaY
  if (newMinY < 0) {
    constrainedDeltaY = -minY // Move to top edge
  } else if (newMaxY > maxViewportY) {
    constrainedDeltaY = maxViewportY - maxY // Move to bottom edge (above taskbar)
  }
  
  return { deltaX: constrainedDeltaX, deltaY: constrainedDeltaY }
}

function Desktop({ onShutdown, onLogOff }: DesktopProps) {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [highestZIndex, setHighestZIndex] = useState(1)
  const [iconPositions, setIconPositions] = useState<IconPosition[]>([
    { id: 'projects', x: 20, y: 20 },
    { id: 'experiences', x: 20, y: 140 },
    { id: 'autobiography', x: 20, y: 260 },
    { id: 'resume', x: 20, y: 380 },
    { id: 'recycle-bin', x: 20, y: 500 },
  ])
  const [initialIconPositions] = useState<IconPosition[]>([
    { id: 'projects', x: 20, y: 20 },
    { id: 'experiences', x: 20, y: 140 },
    { id: 'autobiography', x: 20, y: 260 },
    { id: 'resume', x: 20, y: 380 },
    { id: 'recycle-bin', x: 20, y: 500 },
  ])
  const [selectedIcons, setSelectedIcons] = useState<string[]>([])
  const [selectionBox, setSelectionBox] = useState<{
    startX: number
    startY: number
    endX: number
    endY: number
  } | null>(null)
  const [recycleBinItems, setRecycleBinItems] = useState<RecycleBinItem[]>([])
  const [isRecycleBinHovered, setIsRecycleBinHovered] = useState(false)
  const [isDraggingSelected, setIsDraggingSelected] = useState(false)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null)
  const [errorDialog, setErrorDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
  }>({
    isOpen: false,
    title: '',
    message: ''
  })
  const desktopRef = useRef<HTMLDivElement>(null)
  const selectionBoxRef = useRef<HTMLDivElement>(null)
  const recycleBinHoveredRef = useRef<boolean>(false)
  const lastDragOverTimeRef = useRef<number>(0)
  // Throttle multi-drag updates to one per frame so desktop doesn't re-render 100+ times/sec (mouse fires very often; touch doesn't)
  const multiDragLastPointerRef = useRef<{ x: number; y: number } | null>(null)
  const multiDragLastCommittedRef = useRef<{ x: number; y: number } | null>(null)
  const multiDragRafRef = useRef<number | null>(null)

  const openWindow = (id: string, title: string, icon: string, component: React.ReactNode, hideMenuBar: boolean = false) => {
    // Check if window is already open
    const existingWindow = windows.find(w => w.id === id)
    if (existingWindow) {
      // Update the component (useful for highlighting specific items from search)
      setWindows(prevWindows => prevWindows.map(w => 
        w.id === id ? { ...w, component } : w
      ))
      // Bring to front and restore if minimized
      bringToFront(id)
      if (existingWindow.isMinimized) {
        toggleMinimize(id)
      }
      return
    }

    const newWindow: WindowState = {
      id,
      title,
      icon,
      component,
      isMinimized: false,
      isMaximized: true,
      position: { x: 100 + windows.length * 30, y: 50 + windows.length * 30 },
      size: { width: 800, height: 600 },
      zIndex: highestZIndex + 1,
      hideMenuBar,
    }

    setWindows([...windows, newWindow])
    setHighestZIndex(highestZIndex + 1)
  }

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id))
  }

  const toggleMinimize = (id: string) => {
    console.log('toggleMinimize called for:', id)
    setWindows(prevWindows => prevWindows.map(w => {
      if (w.id === id) {
        console.log('Toggling minimized state for:', id, 'from', w.isMinimized, 'to', !w.isMinimized)
        return { ...w, isMinimized: !w.isMinimized }
      }
      return w
    }))
  }

  const toggleMaximize = (id: string) => {
    setWindows(prevWindows => prevWindows.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ))
  }

  const bringToFront = (id: string) => {
    setHighestZIndex(prevZIndex => {
      const newZIndex = prevZIndex + 1
      setWindows(prevWindows => prevWindows.map(w => 
        w.id === id ? { ...w, zIndex: newZIndex } : w
      ))
      return newZIndex
    })
  }

  const updateWindowPosition = (id: string, position: { x: number; y: number }) => {
    flushSync(() => {
      setWindows(prevWindows => prevWindows.map(w => 
        w.id === id ? { ...w, position } : w
      ))
    })
  }

  const updateWindowSize = (id: string, size: { width: number; height: number }) => {
    flushSync(() => {
      setWindows(prevWindows => prevWindows.map(w => 
        w.id === id ? { ...w, size } : w
      ))
    })
  }

  const reorderTaskbarWindows = (windowId: string, newIndex: number) => {
    setWindows(prev => {
      const idx = prev.findIndex(w => w.id === windowId)
      if (idx === -1 || idx === newIndex) return prev
      const item = prev[idx]
      const next = [...prev]
      next.splice(idx, 1)
      next.splice(newIndex, 0, item)
      return next
    })
  }

  const openEmailWindow = () => {
    openWindow('email', 'Email - Contact Bradley', '/assets/icons/Windows XP Icons/Email.png', <ContactEmail />)
  }

  const openCommandPrompt = () => {
    openWindow('cmd', 'C:\\WINDOWS\\system32\\cmd.exe', '/assets/icons/Windows XP Icons/Command Prompt.png', <CommandPrompt />, true)
  }

  const openMyPictures = () => {
    openWindow('my-pictures', 'My Pictures', '/assets/icons/Windows XP Icons/My Pictures.png', <MyPictures />)
  }

  const openMyMusic = () => {
    openWindow('my-music', 'My Music', '/assets/icons/Windows XP Icons/My Music.png', <MyMusic />)
  }

  const openResume = () => {
    openWindow('resume', 'My Resume', '/assets/icons/Windows XP Icons/pdf.png', <Resume />)
  }

  const openAutobiography = () => {
    openWindow('autobiography', 'About Me', '/assets/icons/folder.png', <Autobiography />)
  }

  const openInternetExplorer = () => {
    openWindow('internet-explorer', 'Internet Explorer', '/assets/icons/Windows XP Icons/Internet Explorer 6.png', <InternetExplorer />)
  }



  const openSearch = () => {
    openWindow('search', 'Search', '/assets/icons/Windows XP Icons/Search.png', <Search onOpenWindow={openWindow} />)
  }

  const handleRunCommand = (command: string) => {
    const cmd = command.toLowerCase().trim()
    
    // Map commands to application openers
    if (cmd === 'cmd' || cmd === 'command' || cmd === 'command prompt') {
      openCommandPrompt()
    } else if (cmd === 'email' || cmd === 'mail') {
      openEmailWindow()
    } else if (cmd === 'internet' || cmd === 'ie' || cmd === 'explorer' || cmd === 'browser') {
      openInternetExplorer()
    } else if (cmd === 'pictures' || cmd === 'my pictures' || cmd === 'photos') {
      openMyPictures()
    } else if (cmd === 'music' || cmd === 'my music') {
      openMyMusic()
    } else if (cmd === 'resume' || cmd === 'cv') {
      openResume()
    } else if (cmd === 'about' || cmd === 'autobiography' || cmd === 'about me') {
      openAutobiography()
    } else if (cmd === 'search' || cmd === 'find') {
      openSearch()
    }
  }

  const openRun = () => {
    openWindow('run', 'Run', '/assets/icons/Windows XP Icons/Run.png', <Run onRunCommand={handleRunCommand} />)
  }


  const updateIconPosition = (id: string, x: number, y: number) => {
    setIconPositions(prev => 
      prev.map(icon => icon.id === id ? { ...icon, x, y } : icon)
    )
  }

  const handleIconDragOver = (iconId: string, x: number, y: number) => {
    // Throttle updates to avoid too many re-renders (every 50ms)
    const now = Date.now()
    if (now - lastDragOverTimeRef.current < 50) {
      return
    }
    lastDragOverTimeRef.current = now
    
    // Check if dragging over recycle bin
    const recycleBinPos = iconPositions.find(p => p.id === 'recycle-bin')
    if (recycleBinPos && iconId !== 'recycle-bin') {
      const distance = Math.sqrt(
        Math.pow(x - recycleBinPos.x, 2) + Math.pow(y - recycleBinPos.y, 2)
      )
      const isHovered = distance < 100
      
      // Only update state if hover state actually changed
      if (isHovered !== recycleBinHoveredRef.current) {
        recycleBinHoveredRef.current = isHovered
        setIsRecycleBinHovered(isHovered)
      }
    } else {
      // Only update state if hover state actually changed
      if (recycleBinHoveredRef.current) {
        recycleBinHoveredRef.current = false
        setIsRecycleBinHovered(false)
      }
    }
  }

  const isApplicationOpen = (iconId: string): boolean => {
    return windows.some(window => window.id === iconId)
  }

  const showErrorDialog = (title: string, message: string) => {
    setErrorDialog({
      isOpen: true,
      title,
      message
    })
  }

  const closeErrorDialog = () => {
    setErrorDialog({
      isOpen: false,
      title: '',
      message: ''
    })
  }

  const handleIconDropOnRecycleBin = (iconId: string) => {
    if (isRecycleBinHovered) {
      // Get all items to move to bin (selected items or just the dragged item)
      const toRecycle = selectedIcons.includes(iconId) 
        ? selectedIcons.filter(id => id !== 'recycle-bin')
        : [iconId]
      
      // Check if any of the items to recycle are currently open
      const openApplications = toRecycle.filter(id => isApplicationOpen(id))
      
      if (openApplications.length > 0) {
        // Show error dialog for open applications
        const appNames = openApplications.map(id => {
          const icon = desktopIcons.find(i => i.id === id)
          return icon?.title || id
        }).join(', ')
        
        // Reset positions of items that couldn't be moved
        setIconPositions(prev => 
          prev.map(icon => {
            if (toRecycle.includes(icon.id)) {
              const originalPosition = initialIconPositions.find(p => p.id === icon.id)
              return originalPosition ? { ...icon, ...originalPosition } : icon
            }
            return icon
          })
        )
        
        showErrorDialog(
          'Cannot Move Items',
          `Cannot move ${appNames} to the Recycle Bin because ${openApplications.length === 1 ? 'it is' : 'they are'} currently open. Please close the application${openApplications.length > 1 ? 's' : ''} and try again.`
        )
        setIsRecycleBinHovered(false)
        return
      }
      
      if (toRecycle.length > 0) {
        // Move items to recycle bin
        const itemsToAdd: RecycleBinItem[] = toRecycle.map(id => {
          const icon = desktopIcons.find(i => i.id === id)
          const originalPosition = initialIconPositions.find(p => p.id === id)
          return {
            id,
            title: icon?.title || '',
            icon: icon?.icon || '',
            originalPosition: originalPosition || { x: 20, y: 20 }
          }
        })
        
        setRecycleBinItems(prev => [...prev, ...itemsToAdd])
        setSelectedIcons([])
      }
      setIsRecycleBinHovered(false)
    }
  }

  const handleDeleteFromBin = (itemId: string) => {
    setRecycleBinItems(prev => prev.filter(item => item.id !== itemId))
    // Also remove the icon position to prevent it from reappearing
    setIconPositions(prev => prev.filter(pos => pos.id !== itemId))
    // Remove from selected icons if it was selected
    setSelectedIcons(prev => prev.filter(id => id !== itemId))
  }

  const handleRestoreFromBin = (itemId: string) => {
    const item = recycleBinItems.find(i => i.id === itemId)
    if (item) {
      // Restore the icon to its original position from when the page first loaded
      setIconPositions(prev => {
        const existingIndex = prev.findIndex(p => p.id === itemId)
        if (existingIndex >= 0) {
          // Update existing position
          const updated = [...prev]
          updated[existingIndex] = { id: itemId, x: item.originalPosition.x, y: item.originalPosition.y }
          return updated
        } else {
          // Add new position
          return [...prev, { id: itemId, x: item.originalPosition.x, y: item.originalPosition.y }]
        }
      })
      // Remove from recycle bin
      setRecycleBinItems(prev => prev.filter(i => i.id !== itemId))
    }
  }

  // Update RecycleBin window when items change
  useEffect(() => {
    const recycleBinWindow = windows.find(w => w.id === 'recycle-bin')
    if (recycleBinWindow) {
      setWindows(prevWindows => prevWindows.map(w => 
        w.id === 'recycle-bin' 
          ? {
              ...w,
              component: (
                <RecycleBin 
                  items={recycleBinItems}
                  onDelete={handleDeleteFromBin}
                  onRestore={handleRestoreFromBin}
                />
              )
            }
          : w
      ))
    }
  }, [recycleBinItems])

  const handleDesktopMouseDown = (e: React.MouseEvent) => {
    // Check if clicking on a selected icon (even if not on desktop background)
    const clickedIcon = (e.target as HTMLElement).closest('.desktop-icon')
    if (clickedIcon && selectedIcons.length > 0) {
      const iconId = clickedIcon.getAttribute('data-icon-id')
      if (iconId && selectedIcons.includes(iconId)) {
        // Start dragging selected icons
        const coords = { x: e.clientX, y: e.clientY }
        multiDragLastCommittedRef.current = coords
        setIsDraggingSelected(true)
        setDragOffset(coords)
        return
      }
    }
    
    // Only start selection box if clicking on desktop background
    if (e.target === desktopRef.current || (e.target as HTMLElement).classList.contains('desktop-icons')) {
      // Start selection box
      setSelectedIcons([])
      setSelectionBox({
        startX: e.clientX,
        startY: e.clientY,
        endX: e.clientX,
        endY: e.clientY,
      })
    }
  }

  const handleDesktopTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    
    // Check if touching a selected icon (even if not on desktop background)
    const touchedIcon = (e.target as HTMLElement).closest('.desktop-icon')
    if (touchedIcon && selectedIcons.length > 0) {
      const iconId = touchedIcon.getAttribute('data-icon-id')
      if (iconId && selectedIcons.includes(iconId)) {
        // Start dragging selected icons
        const coords = { x: touch.clientX, y: touch.clientY }
        multiDragLastCommittedRef.current = coords
        setIsDraggingSelected(true)
        setDragOffset(coords)
        return
      }
    }
    
    // Only start selection box if touching desktop background
    if (e.target === desktopRef.current || (e.target as HTMLElement).classList.contains('desktop-icons')) {
      // Start selection box
      setSelectedIcons([])
      setSelectionBox({
        startX: touch.clientX,
        startY: touch.clientY,
        endX: touch.clientX,
        endY: touch.clientY,
      })
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (selectionBox && selectionBoxRef.current) {
        // Update selection box directly in DOM for smooth rendering
        const left = Math.min(selectionBox.startX, e.clientX)
        const top = Math.min(selectionBox.startY, e.clientY)
        const width = Math.abs(e.clientX - selectionBox.startX)
        const height = Math.abs(e.clientY - selectionBox.startY)
        
        selectionBoxRef.current.style.left = `${left}px`
        selectionBoxRef.current.style.top = `${top}px`
        selectionBoxRef.current.style.width = `${width}px`
        selectionBoxRef.current.style.height = `${height}px`
        
        // Update selected icons in real-time as selection box moves
        const box = {
          left: Math.min(selectionBox.startX, e.clientX),
          right: Math.max(selectionBox.startX, e.clientX),
          top: Math.min(selectionBox.startY, e.clientY),
          bottom: Math.max(selectionBox.startY, e.clientY),
        }

        const selected = iconPositions.filter(icon => {
          const iconRight = icon.x + 80
          const iconBottom = icon.y + 80
          return (
            icon.x < box.right &&
            iconRight > box.left &&
            icon.y < box.bottom &&
            iconBottom > box.top
          )
        }).map(icon => icon.id)

        setSelectedIcons(selected)
      }
      
      if (isDraggingSelected && selectedIcons.length > 0) {
        multiDragLastPointerRef.current = { x: e.clientX, y: e.clientY }
        if (multiDragRafRef.current === null) {
          multiDragRafRef.current = requestAnimationFrame(() => {
            multiDragRafRef.current = null
            const latest = multiDragLastPointerRef.current
            const prev = multiDragLastCommittedRef.current
            if (!latest || !prev) return
            const deltaX = latest.x - prev.x
            const deltaY = latest.y - prev.y
            const constrained = constrainMultiSelectionDelta(iconPositions, selectedIcons, deltaX, deltaY)
            setIconPositions(prevPos => 
              prevPos.map(icon => 
                selectedIcons.includes(icon.id)
                  ? { ...icon, x: icon.x + constrained.deltaX, y: icon.y + constrained.deltaY }
                  : icon
              )
            )
            const recycleBinPos = iconPositions.find(p => p.id === 'recycle-bin')
            if (recycleBinPos) {
              const distance = Math.sqrt(
                Math.pow(latest.x - recycleBinPos.x, 2) + Math.pow(latest.y - recycleBinPos.y, 2)
              )
              setIsRecycleBinHovered(distance < 100)
            }
            multiDragLastCommittedRef.current = latest
            setDragOffset(latest)
          })
        }
      }
    }

    const handleMouseUp = () => {
      if (selectionBox) {
        // Selection is already handled in real-time during mouse move
        setSelectionBox(null)
      }
      
      if (isDraggingSelected) {
        if (multiDragRafRef.current !== null) {
          cancelAnimationFrame(multiDragRafRef.current)
          multiDragRafRef.current = null
        }
        multiDragLastPointerRef.current = null
        multiDragLastCommittedRef.current = null
        // Check if dropped on recycle bin
        if (isRecycleBinHovered && selectedIcons.length > 0) {
          const toRecycle = selectedIcons.filter(id => id !== 'recycle-bin')
          
          // Check if any of the items to recycle are currently open
          const openApplications = toRecycle.filter(id => isApplicationOpen(id))
          
          if (openApplications.length > 0) {
            // Show error dialog for open applications
            const appNames = openApplications.map(id => {
              const icon = desktopIcons.find(i => i.id === id)
              return icon?.title || id
            }).join(', ')
            
            // Reset positions of items that couldn't be moved
            setIconPositions(prev => 
              prev.map(icon => {
                if (toRecycle.includes(icon.id)) {
                  const originalPosition = initialIconPositions.find(p => p.id === icon.id)
                  return originalPosition ? { ...icon, ...originalPosition } : icon
                }
                return icon
              })
            )
            
            showErrorDialog(
              'Cannot Move Items',
              `Cannot move ${appNames} to the Recycle Bin because ${openApplications.length === 1 ? 'it is' : 'they are'} currently open. Please close the application${openApplications.length > 1 ? 's' : ''} and try again.`
            )
          } else if (toRecycle.length > 0) {
            const itemsToAdd: RecycleBinItem[] = toRecycle.map(id => {
              const icon = desktopIcons.find(i => i.id === id)
              const originalPosition = initialIconPositions.find(p => p.id === id)
              return {
                id,
                title: icon?.title || '',
                icon: icon?.icon || '',
                originalPosition: originalPosition || { x: 20, y: 20 }
              }
            })
            
            setRecycleBinItems(prev => [...prev, ...itemsToAdd])
            setSelectedIcons([])
          }
        }
        
        setIsDraggingSelected(false)
        setDragOffset(null)
        setIsRecycleBinHovered(false)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      if (selectionBox && selectionBoxRef.current) {
        // Update selection box directly in DOM for smooth rendering on touch
        const left = Math.min(selectionBox.startX, touch.clientX)
        const top = Math.min(selectionBox.startY, touch.clientY)
        const width = Math.abs(touch.clientX - selectionBox.startX)
        const height = Math.abs(touch.clientY - selectionBox.startY)
        
        selectionBoxRef.current.style.left = `${left}px`
        selectionBoxRef.current.style.top = `${top}px`
        selectionBoxRef.current.style.width = `${width}px`
        selectionBoxRef.current.style.height = `${height}px`
        
        // Update selected icons in real-time as selection box moves
        const box = {
          left: Math.min(selectionBox.startX, touch.clientX),
          right: Math.max(selectionBox.startX, touch.clientX),
          top: Math.min(selectionBox.startY, touch.clientY),
          bottom: Math.max(selectionBox.startY, touch.clientY),
        }

        const selected = iconPositions.filter(icon => {
          const iconRight = icon.x + 80
          const iconBottom = icon.y + 80
          return (
            icon.x < box.right &&
            iconRight > box.left &&
            icon.y < box.bottom &&
            iconBottom > box.top
          )
        }).map(icon => icon.id)

        setSelectedIcons(selected)
      }
      
      if (isDraggingSelected && selectedIcons.length > 0) {
        multiDragLastPointerRef.current = { x: touch.clientX, y: touch.clientY }
        if (multiDragRafRef.current === null) {
          multiDragRafRef.current = requestAnimationFrame(() => {
            multiDragRafRef.current = null
            const latest = multiDragLastPointerRef.current
            const prev = multiDragLastCommittedRef.current
            if (!latest || !prev) return
            const deltaX = latest.x - prev.x
            const deltaY = latest.y - prev.y
            const constrained = constrainMultiSelectionDelta(iconPositions, selectedIcons, deltaX, deltaY)
            setIconPositions(prevPos => 
              prevPos.map(icon => 
                selectedIcons.includes(icon.id)
                  ? { ...icon, x: icon.x + constrained.deltaX, y: icon.y + constrained.deltaY }
                  : icon
              )
            )
            const recycleBinPos = iconPositions.find(p => p.id === 'recycle-bin')
            if (recycleBinPos) {
              const distance = Math.sqrt(
                Math.pow(latest.x - recycleBinPos.x, 2) + Math.pow(latest.y - recycleBinPos.y, 2)
              )
              setIsRecycleBinHovered(distance < 100)
            }
            multiDragLastCommittedRef.current = latest
            setDragOffset(latest)
          })
        }
      }
    }

    const handleTouchEnd = () => {
      if (selectionBox) {
        // Selection is already handled in real-time during touch move
        setSelectionBox(null)
      }
      
      if (isDraggingSelected) {
        if (multiDragRafRef.current !== null) {
          cancelAnimationFrame(multiDragRafRef.current)
          multiDragRafRef.current = null
        }
        multiDragLastPointerRef.current = null
        multiDragLastCommittedRef.current = null
        // Check if dropped on recycle bin
        if (isRecycleBinHovered && selectedIcons.length > 0) {
          const toRecycle = selectedIcons.filter(id => id !== 'recycle-bin')
          
          // Check if any of the items to recycle are currently open
          const openApplications = toRecycle.filter(id => isApplicationOpen(id))
          
          if (openApplications.length > 0) {
            // Show error dialog for open applications
            const appNames = openApplications.map(id => {
              const icon = desktopIcons.find(i => i.id === id)
              return icon?.title || id
            }).join(', ')
            
            // Reset positions of items that couldn't be moved
            setIconPositions(prev => 
              prev.map(icon => {
                if (toRecycle.includes(icon.id)) {
                  const originalPosition = initialIconPositions.find(p => p.id === icon.id)
                  return originalPosition ? { ...icon, ...originalPosition } : icon
                }
                return icon
              })
            )
            
            showErrorDialog(
              'Cannot Move Items',
              `Cannot move ${appNames} to the Recycle Bin because ${openApplications.length === 1 ? 'it is' : 'they are'} currently open. Please close the application${openApplications.length > 1 ? 's' : ''} and try again.`
            )
          } else if (toRecycle.length > 0) {
            const itemsToAdd: RecycleBinItem[] = toRecycle.map(id => {
              const icon = desktopIcons.find(i => i.id === id)
              const originalPosition = initialIconPositions.find(p => p.id === id)
              return {
                id,
                title: icon?.title || '',
                icon: icon?.icon || '',
                originalPosition: originalPosition || { x: 20, y: 20 }
              }
            })
            
            setRecycleBinItems(prev => [...prev, ...itemsToAdd])
            setSelectedIcons([])
          }
        }
        
        setIsDraggingSelected(false)
        setDragOffset(null)
        setIsRecycleBinHovered(false)
      }
    }

    if (selectionBox || isDraggingSelected) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true })
      document.addEventListener('touchend', handleTouchEnd)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove, true)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [selectionBox, iconPositions, isDraggingSelected, dragOffset, selectedIcons])

  const desktopIcons = [
    {
      id: 'projects',
      title: 'My Projects',
      icon: '/assets/icons/projects.png',
      onDoubleClick: () => openWindow('projects', 'My Projects', '/assets/icons/projects.png', <Projects />),
    },
    {
      id: 'experiences',
      title: 'My Experience',
      icon: '/assets/icons/experiences.png',
      onDoubleClick: () => openWindow('experiences', 'My Experience', '/assets/icons/experiences.png', <Experiences />),
    },
    {
      id: 'autobiography',
      title: 'About Me',
      icon: '/assets/icons/folder.png',
      onDoubleClick: () => openWindow('autobiography', 'About Me', '/assets/icons/folder.png', <Autobiography />),
    },
    {
      id: 'resume',
      title: 'My Resume',
      icon: '/assets/icons/Windows XP Icons/pdf.png',
      onDoubleClick: () => openWindow('resume', 'My Resume', '/assets/icons/Windows XP Icons/pdf.png', <Resume />),
    },
    {
      id: 'recycle-bin',
      title: 'Recycle Bin',
      icon: '/assets/icons/recyclin-bin.png',
      onDoubleClick: () => openWindow(
        'recycle-bin', 
        'Recycle Bin', 
        '/assets/icons/recyclin-bin.png', 
        <RecycleBin 
          items={recycleBinItems}
          onDelete={handleDeleteFromBin}
          onRestore={handleRestoreFromBin}
        />
      ),
    },
  ]

  const currentWallpaper = getCurrentWallpaper()

  return (
    <div 
      ref={desktopRef}
      className={`desktop ${isDraggingSelected ? 'multi-drag-active' : ''}`}
      style={{
        background: `url('${currentWallpaper}') center/cover no-repeat`
      }}
      onMouseDown={handleDesktopMouseDown}
      onTouchStart={handleDesktopTouchStart}
    >
      <div className="desktop-icons">
        {desktopIcons
          .filter(icon => !recycleBinItems.some(item => item.id === icon.id))
          .map((icon) => {
            const position = iconPositions.find(p => p.id === icon.id)
            if (!position) return null // Don't render if no position found
            const isRecycleBin = icon.id === 'recycle-bin'
            return (
              <DesktopIcon
                key={icon.id}
                id={icon.id}
                title={icon.title}
                icon={icon.icon}
                onDoubleClick={icon.onDoubleClick}
                position={position}
                isSelected={selectedIcons.includes(icon.id)}
                isRecycleBin={isRecycleBin}
                isRecycleBinHovered={isRecycleBin && isRecycleBinHovered}
                onPositionChange={updateIconPosition}
                onDragOver={handleIconDragOver}
                onDropOnRecycleBin={handleIconDropOnRecycleBin}
                onSelect={(iconId: string, addToSelection: boolean) => {
                  if (addToSelection) {
                    setSelectedIcons(prev => 
                      prev.includes(iconId) ? prev.filter(i => i !== iconId) : [...prev, iconId]
                    )
                  } else {
                    setSelectedIcons([iconId])
                  }
                }}
                hasMultipleSelected={selectedIcons.length > 1}
              />
            )
          })
          .filter(Boolean)}
      </div>

      {selectionBox && (
        <div
          ref={selectionBoxRef}
          className="selection-box"
          style={{
            left: Math.min(selectionBox.startX, selectionBox.endX),
            top: Math.min(selectionBox.startY, selectionBox.endY),
            width: Math.abs(selectionBox.endX - selectionBox.startX),
            height: Math.abs(selectionBox.endY - selectionBox.startY),
          }}
        />
      )}

      {windows.map(window => (
        <Window
          key={window.id}
          window={window}
          onClose={() => closeWindow(window.id)}
          onMinimize={() => toggleMinimize(window.id)}
          onMaximize={() => toggleMaximize(window.id)}
          onFocus={() => bringToFront(window.id)}
          onPositionChange={(pos) => updateWindowPosition(window.id, pos)}
          onSizeChange={(size) => updateWindowSize(window.id, size)}
        />
      ))}

      <Taskbar 
        windows={windows}
        onTaskbarReorder={reorderTaskbarWindows}
        onWindowClick={(id) => {
          const window = windows.find(w => w.id === id)
          console.log('Taskbar click on window:', id, 'isMinimized:', window?.isMinimized)
          if (window?.isMinimized) {
            console.log('Restoring minimized window:', id)
            toggleMinimize(id)
            bringToFront(id)
          } else {
            console.log('Focusing window:', id)
            bringToFront(id)
          }
        }}
        onShutdown={onShutdown}
        onLogOff={onLogOff}
        onEmailClick={openEmailWindow}
        onCommandPromptClick={openCommandPrompt}
        onMyPicturesClick={openMyPictures}
        onMyMusicClick={openMyMusic}
        onResumeClick={openResume}
        onAutobiographyClick={openAutobiography}
        onInternetExplorerClick={openInternetExplorer}
        onSearchClick={openSearch}
        onRunClick={openRun}
      />

      <ErrorDialog
        isOpen={errorDialog.isOpen}
        title={errorDialog.title}
        message={errorDialog.message}
        onClose={closeErrorDialog}
      />
    </div>
  )
}

export default Desktop

