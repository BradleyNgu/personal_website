import { useState, useRef, useEffect } from 'react'
import Taskbar from './Taskbar'
import Window from './Window'
import DesktopIcon from './DesktopIcon'
import Projects from '../pages/Projects'
import Experiences from '../pages/Experiences'
import Autobiography from '../pages/Autobiography'
import ContactEmail from '../pages/ContactEmail'
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
}

export interface IconPosition {
  id: string
  x: number
  y: number
}

interface DesktopProps {
  onShutdown: () => void
  onLogOff: () => void
}

function Desktop({ onShutdown, onLogOff }: DesktopProps) {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [highestZIndex, setHighestZIndex] = useState(1)
  const [iconPositions, setIconPositions] = useState<IconPosition[]>([
    { id: 'projects', x: 20, y: 20 },
    { id: 'experiences', x: 20, y: 120 },
    { id: 'autobiography', x: 20, y: 220 },
    { id: 'recycle-bin', x: 20, y: 320 },
  ])
  const [selectedIcons, setSelectedIcons] = useState<string[]>([])
  const [selectionBox, setSelectionBox] = useState<{
    startX: number
    startY: number
    endX: number
    endY: number
  } | null>(null)
  const [deletedIcons, setDeletedIcons] = useState<string[]>([])
  const [isRecycleBinHovered, setIsRecycleBinHovered] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [itemsToDelete, setItemsToDelete] = useState<string[]>([])
  const desktopRef = useRef<HTMLDivElement>(null)

  const openWindow = (id: string, title: string, icon: string, component: React.ReactNode) => {
    // Check if window is already open
    const existingWindow = windows.find(w => w.id === id)
    if (existingWindow) {
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
      isMaximized: false,
      position: { x: 100 + windows.length * 30, y: 50 + windows.length * 30 },
      size: { width: 800, height: 600 },
      zIndex: highestZIndex + 1,
    }

    setWindows([...windows, newWindow])
    setHighestZIndex(highestZIndex + 1)
  }

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id))
  }

  const toggleMinimize = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ))
  }

  const toggleMaximize = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ))
  }

  const bringToFront = (id: string) => {
    const newZIndex = highestZIndex + 1
    setWindows(windows.map(w => 
      w.id === id ? { ...w, zIndex: newZIndex } : w
    ))
    setHighestZIndex(newZIndex)
  }

  const updateWindowPosition = (id: string, position: { x: number; y: number }) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, position } : w
    ))
  }

  const updateWindowSize = (id: string, size: { width: number; height: number }) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, size } : w
    ))
  }

  const openEmailWindow = () => {
    openWindow('email', 'Email - Contact Bradley', '/assets/icons/experiences.png', <ContactEmail />)
  }

  const updateIconPosition = (id: string, x: number, y: number) => {
    setIconPositions(prev => 
      prev.map(icon => icon.id === id ? { ...icon, x, y } : icon)
    )
  }

  const handleIconDragOver = (iconId: string, x: number, y: number) => {
    // Check if dragging over recycle bin
    const recycleBinPos = iconPositions.find(p => p.id === 'recycle-bin')
    if (recycleBinPos && iconId !== 'recycle-bin') {
      const distance = Math.sqrt(
        Math.pow(x - recycleBinPos.x, 2) + Math.pow(y - recycleBinPos.y, 2)
      )
      setIsRecycleBinHovered(distance < 100)
    } else {
      setIsRecycleBinHovered(false)
    }
  }

  const handleIconDropOnRecycleBin = (iconId: string) => {
    if (isRecycleBinHovered) {
      // Get all items to delete (selected items or just the dragged item)
      const toDelete = selectedIcons.includes(iconId) 
        ? selectedIcons.filter(id => id !== 'recycle-bin')
        : [iconId]
      
      if (toDelete.length > 0) {
        setItemsToDelete(toDelete)
        setShowDeleteConfirm(true)
      }
      setIsRecycleBinHovered(false)
    }
  }

  const confirmDelete = () => {
    setDeletedIcons(prev => [...prev, ...itemsToDelete])
    setSelectedIcons([])
    setShowDeleteConfirm(false)
    setItemsToDelete([])
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setItemsToDelete([])
  }

  const handleDesktopMouseDown = (e: React.MouseEvent) => {
    if (e.target === desktopRef.current || (e.target as HTMLElement).classList.contains('desktop-icons')) {
      setSelectedIcons([])
      setSelectionBox({
        startX: e.clientX,
        startY: e.clientY,
        endX: e.clientX,
        endY: e.clientY,
      })
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (selectionBox) {
        setSelectionBox(prev => prev ? {
          ...prev,
          endX: e.clientX,
          endY: e.clientY,
        } : null)
      }
    }

    const handleMouseUp = () => {
      if (selectionBox) {
        // Calculate which icons are within the selection box
        const box = {
          left: Math.min(selectionBox.startX, selectionBox.endX),
          right: Math.max(selectionBox.startX, selectionBox.endX),
          top: Math.min(selectionBox.startY, selectionBox.endY),
          bottom: Math.max(selectionBox.startY, selectionBox.endY),
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
        setSelectionBox(null)
      }
    }

    if (selectionBox) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [selectionBox, iconPositions])

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
      title: 'My Documents',
      icon: '/assets/icons/folder.png',
      onDoubleClick: () => openWindow('autobiography', 'My Documents', '/assets/icons/folder.png', <Autobiography />),
    },
    {
      id: 'recycle-bin',
      title: 'Recycle Bin',
      icon: '/assets/icons/recyclin-bin.png',
      onDoubleClick: () => {}, // Empty function - just for decoration
    },
  ]

  return (
    <div 
      ref={desktopRef}
      className="desktop" 
      onMouseDown={handleDesktopMouseDown}
    >
      <div className="desktop-icons">
        {desktopIcons
          .filter(icon => !deletedIcons.includes(icon.id))
          .map((icon) => {
            const position = iconPositions.find(p => p.id === icon.id) || { x: 20, y: 20 }
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
              />
            )
          })}
      </div>

      {selectionBox && (
        <div
          className="selection-box"
          style={{
            left: Math.min(selectionBox.startX, selectionBox.endX),
            top: Math.min(selectionBox.startY, selectionBox.endY),
            width: Math.abs(selectionBox.endX - selectionBox.startX),
            height: Math.abs(selectionBox.endY - selectionBox.startY),
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-dialog">
            <div className="dialog-title">Confirm Delete</div>
            <div className="dialog-message">
              Are you sure you want to delete {itemsToDelete.length} item{itemsToDelete.length > 1 ? 's' : ''}?
            </div>
            <div className="dialog-buttons">
              <button className="dialog-button confirm" onClick={confirmDelete}>Yes</button>
              <button className="dialog-button cancel" onClick={cancelDelete}>No</button>
            </div>
          </div>
        </div>
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
        onWindowClick={(id) => {
          const window = windows.find(w => w.id === id)
          if (window?.isMinimized) {
            toggleMinimize(id)
            bringToFront(id)
          } else {
            bringToFront(id)
          }
        }}
        onShutdown={onShutdown}
        onLogOff={onLogOff}
        onEmailClick={openEmailWindow}
      />
    </div>
  )
}

export default Desktop

