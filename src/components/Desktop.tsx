import { useState } from 'react'
import Taskbar from './Taskbar'
import Window from './Window'
import DesktopIcon from './DesktopIcon'
import Projects from '../pages/Projects'
import Experiences from '../pages/Experiences'
import Autobiography from '../pages/Autobiography'
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

function Desktop() {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [highestZIndex, setHighestZIndex] = useState(1)

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

  const desktopIcons = [
    {
      id: 'projects',
      title: 'Projects',
      icon: '/assets/icons/projects.png',
      onDoubleClick: () => openWindow('projects', 'Projects', '/assets/icons/projects.png', <Projects />),
    },
    {
      id: 'experiences',
      title: 'Experiences',
      icon: '/assets/icons/experiences.png',
      onDoubleClick: () => openWindow('experiences', 'Experiences', '/assets/icons/experiences.png', <Experiences />),
    },
    {
      id: 'autobiography',
      title: 'Autobiography',
      icon: '/assets/icons/folder.png',
      onDoubleClick: () => openWindow('autobiography', 'Autobiography', '/assets/icons/folder.png', <Autobiography />),
    },
  ]

  return (
    <div className="desktop">
      <div className="desktop-icons">
        {desktopIcons.map((icon, index) => (
          <DesktopIcon
            key={icon.id}
            title={icon.title}
            icon={icon.icon}
            onDoubleClick={icon.onDoubleClick}
            position={{ x: 20, y: 20 + index * 100 }}
          />
        ))}
      </div>

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
          }
          bringToFront(id)
        }}
      />
    </div>
  )
}

export default Desktop

