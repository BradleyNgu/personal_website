import { useState, useRef, useEffect } from 'react'
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

function Desktop({ onShutdown, onLogOff }: DesktopProps) {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [highestZIndex, setHighestZIndex] = useState(1)
  const [iconPositions, setIconPositions] = useState<IconPosition[]>([
    { id: 'projects', x: 20, y: 20 },
    { id: 'experiences', x: 20, y: 120 },
    { id: 'autobiography', x: 20, y: 220 },
    { id: 'resume', x: 20, y: 320 },
    { id: 'recycle-bin', x: 20, y: 420 },
  ])
  const [initialIconPositions] = useState<IconPosition[]>([
    { id: 'projects', x: 20, y: 20 },
    { id: 'experiences', x: 20, y: 120 },
    { id: 'autobiography', x: 20, y: 220 },
    { id: 'resume', x: 20, y: 320 },
    { id: 'recycle-bin', x: 20, y: 420 },
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
    setWindows(prevWindows => prevWindows.map(w => 
      w.id === id ? { ...w, position } : w
    ))
  }

  const updateWindowSize = (id: string, size: { width: number; height: number }) => {
    setWindows(prevWindows => prevWindows.map(w => 
      w.id === id ? { ...w, size } : w
    ))
  }

  const openEmailWindow = () => {
    openWindow('email', 'Email - Contact Bradley', '/assets/icons/Windows XP Icons/Email.png', <ContactEmail />)
  }

  const openCommandPrompt = () => {
    openWindow('cmd', 'C:\\WINDOWS\\system32\\cmd.exe', '/assets/icons/Windows XP Icons/Command Prompt.png', <CommandPrompt />)
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
    if (e.target === desktopRef.current || (e.target as HTMLElement).classList.contains('desktop-icons')) {
      // Check if clicking on a selected icon
      const clickedIcon = (e.target as HTMLElement).closest('.desktop-icon')
      if (clickedIcon && selectedIcons.length > 0) {
        const iconId = clickedIcon.getAttribute('data-icon-id')
        if (iconId && selectedIcons.includes(iconId)) {
          // Start dragging selected icons
          setIsDraggingSelected(true)
          setDragOffset({
            x: e.clientX,
            y: e.clientY
          })
          return
        }
      }
      
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
    if (e.target === desktopRef.current || (e.target as HTMLElement).classList.contains('desktop-icons')) {
      const touch = e.touches[0]
      // Check if touching a selected icon
      const touchedIcon = (e.target as HTMLElement).closest('.desktop-icon')
      if (touchedIcon && selectedIcons.length > 0) {
        const iconId = touchedIcon.getAttribute('data-icon-id')
        if (iconId && selectedIcons.includes(iconId)) {
          // Start dragging selected icons
          setIsDraggingSelected(true)
          setDragOffset({
            x: touch.clientX,
            y: touch.clientY
          })
          return
        }
      }
      
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
      if (selectionBox) {
        setSelectionBox(prev => prev ? {
          ...prev,
          endX: e.clientX,
          endY: e.clientY,
        } : null)
      }
      
      if (isDraggingSelected && dragOffset && selectedIcons.length > 0) {
        const deltaX = e.clientX - dragOffset.x
        const deltaY = e.clientY - dragOffset.y
        
        // Update positions of all selected icons
        setIconPositions(prev => 
          prev.map(icon => 
            selectedIcons.includes(icon.id)
              ? { ...icon, x: Math.max(0, icon.x + deltaX), y: Math.max(0, icon.y + deltaY) }
              : icon
          )
        )
        
        // Check if hovering over recycle bin
        const recycleBinPos = iconPositions.find(p => p.id === 'recycle-bin')
        if (recycleBinPos) {
          const distance = Math.sqrt(
            Math.pow(e.clientX - recycleBinPos.x, 2) + Math.pow(e.clientY - recycleBinPos.y, 2)
          )
          setIsRecycleBinHovered(distance < 100)
        }
        
        setDragOffset({ x: e.clientX, y: e.clientY })
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
      
      if (isDraggingSelected) {
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
      if (selectionBox) {
        setSelectionBox(prev => prev ? {
          ...prev,
          endX: touch.clientX,
          endY: touch.clientY,
        } : null)
      }
      
      if (isDraggingSelected && dragOffset && selectedIcons.length > 0) {
        const deltaX = touch.clientX - dragOffset.x
        const deltaY = touch.clientY - dragOffset.y
        
        // Update positions of all selected icons
        setIconPositions(prev => 
          prev.map(icon => 
            selectedIcons.includes(icon.id)
              ? { ...icon, x: Math.max(0, icon.x + deltaX), y: Math.max(0, icon.y + deltaY) }
              : icon
          )
        )
        
        // Check if hovering over recycle bin
        const recycleBinPos = iconPositions.find(p => p.id === 'recycle-bin')
        if (recycleBinPos) {
          const distance = Math.sqrt(
            Math.pow(touch.clientX - recycleBinPos.x, 2) + Math.pow(touch.clientY - recycleBinPos.y, 2)
          )
          setIsRecycleBinHovered(distance < 100)
        }
        
        setDragOffset({ x: touch.clientX, y: touch.clientY })
      }
    }

    const handleTouchEnd = () => {
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
      
      if (isDraggingSelected) {
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
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
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

  return (
    <div 
      ref={desktopRef}
      className={`desktop ${isDraggingSelected ? 'multi-drag-active' : ''}`}
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
              />
            )
          })
          .filter(Boolean)}
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

