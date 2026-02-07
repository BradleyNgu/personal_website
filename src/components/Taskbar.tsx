import { useState, useEffect, useRef } from 'react'
import type { WindowState } from './Desktop'
import { AudioVolumeManager } from '../utils/audioVolume'
import '../styles/taskbar.css'

interface TaskbarProps {
  windows: WindowState[]
  onTaskbarReorder: (windowId: string, newIndex: number) => void
  onWindowClick: (id: string) => void
  onShutdown: () => void
  onLogOff: () => void
  onEmailClick: () => void
  onCommandPromptClick: () => void
  onMyPicturesClick: () => void
  onMyMusicClick: () => void
  onResumeClick: () => void
  onAutobiographyClick: () => void
  onInternetExplorerClick: () => void
  onSearchClick: () => void
  onRunClick: () => void
}

const DRAG_THRESHOLD_PX = 5

function Taskbar({ windows, onTaskbarReorder, onWindowClick, onShutdown, onLogOff, onEmailClick, onCommandPromptClick, onMyPicturesClick, onMyMusicClick, onResumeClick, onAutobiographyClick, onInternetExplorerClick, onSearchClick, onRunClick }: TaskbarProps) {
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [showSystemTrayMenu, setShowSystemTrayMenu] = useState(false)
  const [showAllPrograms, setShowAllPrograms] = useState(false)
  const [volume, setVolume] = useState(AudioVolumeManager.getVolume())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [draggingWindowId, setDraggingWindowId] = useState<string | null>(null)
  const [dragTranslateX, setDragTranslateX] = useState(0)
  const startMenuRef = useRef<HTMLDivElement>(null)
  const systemTrayMenuRef = useRef<HTMLDivElement>(null)
  const allProgramsRef = useRef<HTMLDivElement>(null)
  const systemTrayOpenTimeRef = useRef<number>(0)
  const touchHandledRef = useRef(false)
  const taskbarWindowsRef = useRef<HTMLDivElement>(null)
  const draggedButtonRef = useRef<HTMLButtonElement | null>(null)
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const didDragRef = useRef(false)
  const windowsRef = useRef(windows)
  windowsRef.current = windows

  // Initialize volume from manager
  useEffect(() => {
    setVolume(AudioVolumeManager.getVolume())
  }, [])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Close start menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const startButton = document.querySelector('.start-button')
      
      if (showStartMenu && 
          startMenuRef.current && 
          !startMenuRef.current.contains(target) &&
          !allProgramsRef.current?.contains(target) &&
          !startButton?.contains(target)) {
        setShowStartMenu(false)
        setShowAllPrograms(false)
      }
    }

    if (showStartMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showStartMenu])

  // Close system tray menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const systemTray = document.querySelector('.system-tray')
      
      // Ignore clicks that happen very soon after opening (prevents immediate close from touch-to-mouse conversion)
      const timeSinceOpen = Date.now() - systemTrayOpenTimeRef.current
      if (timeSinceOpen < 300) {
        return
      }
      
      if (showSystemTrayMenu && 
          systemTrayMenuRef.current && 
          !systemTrayMenuRef.current.contains(target) &&
          !systemTray?.contains(target)) {
        setShowSystemTrayMenu(false)
      }
    }

    if (showSystemTrayMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSystemTrayMenu])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const handleStartButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowStartMenu(!showStartMenu)
    setShowSystemTrayMenu(false) // Close system tray menu when opening start menu
  }

  const handleSystemTrayClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // On mobile, prevent the click event from firing after touchstart
    if (e.type === 'touchstart') {
      touchHandledRef.current = true
      setTimeout(() => {
        touchHandledRef.current = false
      }, 500)
    } else if (e.type === 'click' && touchHandledRef.current) {
      // Ignore click if touch was just handled
      return
    }
    
    const isOpening = !showSystemTrayMenu
    setShowSystemTrayMenu(!showSystemTrayMenu)
    setShowStartMenu(false) // Close start menu when opening system tray menu
    
    // Track when menu is opened (for mobile touch-to-mouse conversion)
    if (isOpening) {
      systemTrayOpenTimeRef.current = Date.now()
    }
  }

  const startTaskbarDrag = (windowId: string, clientX: number, clientY: number, buttonRect: DOMRect) => {
    didDragRef.current = false
    dragStartRef.current = { x: clientX, y: clientY }
    dragOffsetRef.current = { x: clientX - buttonRect.left, y: clientY - buttonRect.top }
    setDragTranslateX(0)
    setDraggingWindowId(windowId)
  }

  const handleTaskbarWindowMouseDown = (e: React.MouseEvent, windowId: string) => {
    e.preventDefault()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    startTaskbarDrag(windowId, e.clientX, e.clientY, rect)
  }

  const handleTaskbarWindowTouchStart = (e: React.TouchEvent, windowId: string) => {
    e.preventDefault()
    const touch = e.touches[0]
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    startTaskbarDrag(windowId, touch.clientX, touch.clientY, rect)
  }

  useEffect(() => {
    if (!draggingWindowId) return

    const applyMove = (clientX: number, clientY: number) => {
      const dx = clientX - dragStartRef.current.x
      const dy = clientY - dragStartRef.current.y
      if (!didDragRef.current && (Math.abs(dx) > DRAG_THRESHOLD_PX || Math.abs(dy) > DRAG_THRESHOLD_PX)) {
        didDragRef.current = true
      }
      const btn = draggedButtonRef.current
      if (btn) {
        const rect = btn.getBoundingClientRect()
        setDragTranslateX(clientX - dragOffsetRef.current.x - rect.left)
      }
    }

    const trySwap = (clientX: number) => {
      const container = taskbarWindowsRef.current
      if (!container) return
      const buttons = container.querySelectorAll<HTMLElement>('.taskbar-window')
      if (buttons.length === 0) return
      const currentWindows = windowsRef.current
      const currentIndex = currentWindows.findIndex(w => w.id === draggingWindowId)
      if (currentIndex === -1) return
      let targetIndex = -1
      for (let j = 0; j < buttons.length; j++) {
        const rect = buttons[j].getBoundingClientRect()
        if (clientX >= rect.left && clientX < rect.right) {
          const mid = rect.left + rect.width / 2
          if (j < currentIndex && clientX < mid) targetIndex = j
          else if (j > currentIndex && clientX >= mid) targetIndex = j
          break
        }
      }
      if (targetIndex !== -1 && targetIndex !== currentIndex) {
        onTaskbarReorder(draggingWindowId, targetIndex)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      applyMove(e.clientX, e.clientY)
      trySwap(e.clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      applyMove(touch.clientX, touch.clientY)
      trySwap(touch.clientX)
    }

    const endDrag = (wasClick: boolean) => {
      const id = draggingWindowId
      const hadDragged = didDragRef.current
      setDraggingWindowId(null)
      setDragTranslateX(0)
      draggedButtonRef.current = null
      if (wasClick && !hadDragged && id) {
        onWindowClick(id)
      }
    }

    const handleMouseUp = () => {
      endDrag(true)
    }

    const handleTouchEnd = () => {
      endDrag(true)
    }

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
  }, [draggingWindowId, onTaskbarReorder, onWindowClick])

  return (
    <div className="taskbar">
      <button 
        className={`start-button ${showStartMenu ? 'active' : ''}`}
        onClick={handleStartButtonClick}
      >
        <img src="/assets/icons/start_2.png" alt="Start" className="start-icon-img" />
      </button>

      {showStartMenu && (
        <div className="start-menu" ref={startMenuRef}>
          <div className="start-menu-top">
            <div className="user-profile-banner">
              <img 
                src="/assets/icons/profile_image.jpeg" 
                alt="Bradley Nguyen"
                className="user-avatar"
              />
              <span className="user-name-text">Bradley Nguyen</span>
            </div>
          </div>
          
          <div className="start-menu-main">
            <div className="start-menu-left">
              <div className="pinned-items">
                <div className="start-menu-item" 
                  onClick={() => {
                    onEmailClick()
                    setShowStartMenu(false)
                  }}
                  onTouchStart={() => {
                    onEmailClick()
                    setShowStartMenu(false)
                  }}
                >
                  <img src="/assets/icons/Windows XP Icons/Email.png" alt="" className="menu-icon-large" />
                  <span>Email</span>
                </div>
                <div className="start-menu-item" 
                  onClick={() => {
                    onInternetExplorerClick()
                    setShowStartMenu(false)
                  }}
                  onTouchStart={() => {
                    onInternetExplorerClick()
                    setShowStartMenu(false)
                  }}
                >
                  <img src="/assets/icons/Windows XP Icons/Internet Explorer 6.png" alt="" className="menu-icon-large" />
                  <span>Internet</span>
                </div>
                <div className="start-menu-item" 
                  onClick={() => {
                    onResumeClick()
                    setShowStartMenu(false)
                  }}
                  onTouchStart={() => {
                    onResumeClick()
                    setShowStartMenu(false)
                  }}
                >
                  <img src="/assets/icons/Windows XP Icons/pdf.png" alt="" className="menu-icon-large" />
                  <span>My Resume</span>
                </div>
              </div>
              <div className="start-menu-divider"></div>
              <div 
                className="start-menu-item all-programs"
                onMouseEnter={() => setShowAllPrograms(true)}
                onMouseLeave={() => {
                  // Delay closing to allow moving to submenu
                  setTimeout(() => {
                    if (!allProgramsRef.current?.matches(':hover')) {
                      setShowAllPrograms(false)
                    }
                  }, 200)
                }}
                onClick={() => setShowAllPrograms(!showAllPrograms)}
              >
                <span>All Programs</span>
                <span className="arrow-icon">▶</span>
              </div>
            </div>
            
            {showAllPrograms && (
              <div 
                className="all-programs-submenu"
                ref={allProgramsRef}
                onMouseEnter={() => setShowAllPrograms(true)}
                onMouseLeave={() => setShowAllPrograms(false)}
              >
                <div className="all-programs-list">
                  <div className="all-programs-item"
                    onClick={() => {
                      onEmailClick()
                      setShowStartMenu(false)
                      setShowAllPrograms(false)
                    }}
                  >
                    <img src="/assets/icons/Windows XP Icons/Email.png" alt="" className="menu-icon-small" />
                    <span>Email</span>
                  </div>
                  <div className="all-programs-item"
                    onClick={() => {
                      onInternetExplorerClick()
                      setShowStartMenu(false)
                      setShowAllPrograms(false)
                    }}
                  >
                    <img src="/assets/icons/Windows XP Icons/Internet Explorer 6.png" alt="" className="menu-icon-small" />
                    <span>Internet Explorer</span>
                  </div>
                  <div className="all-programs-item"
                    onClick={() => {
                      onCommandPromptClick()
                      setShowStartMenu(false)
                      setShowAllPrograms(false)
                    }}
                  >
                    <img src="/assets/icons/Windows XP Icons/Command Prompt.png" alt="" className="menu-icon-small" />
                    <span>Command Prompt</span>
                  </div>
                  <div className="all-programs-item"
                    onClick={() => {
                      onMyPicturesClick()
                      setShowStartMenu(false)
                      setShowAllPrograms(false)
                    }}
                  >
                    <img src="/assets/icons/Windows XP Icons/My Pictures.png" alt="" className="menu-icon-small" />
                    <span>My Pictures</span>
                  </div>
                  <div className="all-programs-item"
                    onClick={() => {
                      onMyMusicClick()
                      setShowStartMenu(false)
                      setShowAllPrograms(false)
                    }}
                  >
                    <img src="/assets/icons/Windows XP Icons/My Music.png" alt="" className="menu-icon-small" />
                    <span>My Music</span>
                  </div>
                  <div className="all-programs-item"
                    onClick={() => {
                      onResumeClick()
                      setShowStartMenu(false)
                      setShowAllPrograms(false)
                    }}
                  >
                    <img src="/assets/icons/Windows XP Icons/pdf.png" alt="" className="menu-icon-small" />
                    <span>My Resume</span>
                  </div>
                  <div className="all-programs-item"
                    onClick={() => {
                      onAutobiographyClick()
                      setShowStartMenu(false)
                      setShowAllPrograms(false)
                    }}
                  >
                    <img src="/assets/icons/Windows XP Icons/My Documents.png" alt="" className="menu-icon-small" />
                    <span>About Me</span>
                  </div>
                  <div className="all-programs-item"
                    onClick={() => {
                      onSearchClick()
                      setShowStartMenu(false)
                      setShowAllPrograms(false)
                    }}
                  >
                    <img src="/assets/icons/Windows XP Icons/Search.png" alt="" className="menu-icon-small" />
                    <span>Search</span>
                  </div>
                  <div className="all-programs-item"
                    onClick={() => {
                      onRunClick()
                      setShowStartMenu(false)
                      setShowAllPrograms(false)
                    }}
                  >
                    <img src="/assets/icons/Windows XP Icons/Run.png" alt="" className="menu-icon-small" />
                    <span>Run...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="start-menu-right">
              <div className="start-menu-item" 
                onClick={() => {
                  onAutobiographyClick()
                  setShowStartMenu(false)
                }}
                onTouchStart={() => {
                  onAutobiographyClick()
                  setShowStartMenu(false)
                }}
              >
                <img src="/assets/icons/Windows XP Icons/My Documents.png" alt="" className="menu-icon-small" />
                <span>About Me</span>
              </div>
              <div className="start-menu-item" 
                onClick={() => {
                  onMyPicturesClick()
                  setShowStartMenu(false)
                }}
                onTouchStart={() => {
                  onMyPicturesClick()
                  setShowStartMenu(false)
                }}
              >
                <img src="/assets/icons/Windows XP Icons/My Pictures.png" alt="" className="menu-icon-small" />
                <span>My Pictures</span>
              </div>
              <div className="start-menu-item" 
                onClick={() => {
                  onMyMusicClick()
                  setShowStartMenu(false)
                }}
                onTouchStart={() => {
                  onMyMusicClick()
                  setShowStartMenu(false)
                }}
              >
                <img src="/assets/icons/Windows XP Icons/My Music.png" alt="" className="menu-icon-small" />
                <span>My Music</span>
              </div>
              <div className="start-menu-divider"></div>
              <div className="start-menu-item" 
                onClick={() => {
                  onSearchClick()
                  setShowStartMenu(false)
                }}
                onTouchStart={() => {
                  onSearchClick()
                  setShowStartMenu(false)
                }}
              >
                <img src="/assets/icons/Windows XP Icons/Search.png" alt="" className="menu-icon-small" />
                <span>Search</span>
              </div>
              <div className="start-menu-item" 
                onClick={() => {
                  onRunClick()
                  setShowStartMenu(false)
                }}
                onTouchStart={() => {
                  onRunClick()
                  setShowStartMenu(false)
                }}
              >
                <img src="/assets/icons/Windows XP Icons/Run.png" alt="" className="menu-icon-small" />
                <span>Run...</span>
              </div>
            </div>
          </div>
          
          <div className="start-menu-bottom">
            <div className="bottom-buttons">
              <button className="log-off-btn" 
                onClick={onLogOff}
                onTouchStart={onLogOff}
              >
                <img src="/assets/icons/Windows XP Icons/Logout.png" alt="Log Off" className="btn-icon" />
                Log Off
              </button>
              <button className="turn-off-btn" 
                onClick={onShutdown}
                onTouchStart={onShutdown}
              >
                <img src="/assets/icons/Windows XP Icons/Power.png" alt="Turn Off" className="btn-icon" />
                Turn Off Computer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="quick-launch">
        <img 
          src="/assets/icons/Windows XP Icons/Internet Explorer 6.png" 
          alt="Internet Explorer" 
          className="quick-launch-icon" 
          title="Internet Explorer"
          onClick={onInternetExplorerClick}
        />
        <img 
          src="/assets/icons/Windows XP Icons/Command Prompt.png" 
          alt="Command Prompt" 
          className="quick-launch-icon" 
          title="Command Prompt"
          onClick={onCommandPromptClick}
        />
      </div>

      <div className="taskbar-windows" ref={taskbarWindowsRef}>
        {windows.map(window => (
          <button
            key={window.id}
            ref={draggingWindowId === window.id ? draggedButtonRef : undefined}
            className={`taskbar-window ${window.isMinimized ? '' : 'active'} ${draggingWindowId === window.id ? 'taskbar-window-dragging' : ''}`}
            style={draggingWindowId === window.id ? { transform: `translateX(${dragTranslateX}px)` } : undefined}
            onMouseDown={(e) => handleTaskbarWindowMouseDown(e, window.id)}
            onTouchStart={(e) => handleTaskbarWindowTouchStart(e, window.id)}
          >
            <img src={window.icon} alt="" className="taskbar-window-icon" />
            <span className="taskbar-window-title">{window.title}</span>
          </button>
        ))}
      </div>

      <div className="system-tray">
        <div className="tray-icons" onClick={handleSystemTrayClick} onTouchStart={handleSystemTrayClick}>
          <img src="/assets/icons/Windows XP Icons/Volume.png" alt="Volume" className="tray-icon" title="Volume" />
          <img src="/assets/icons/Windows XP Icons/Wireless Network Connection.png" alt="Network" className="tray-icon" title="Network" />
        </div>
        <div className="clock">{formatTime(currentTime)}</div>
      </div>

      {showSystemTrayMenu && (
        <div className="system-tray-menu" ref={systemTrayMenuRef}>
          <div className="system-tray-menu-top">
            <div className="system-tray-menu-title">System Tray</div>
          </div>
          
          <div className="system-tray-menu-main">
            <div className="system-tray-menu-section">
              <div className="system-tray-menu-item">
                <img src="/assets/icons/Windows XP Icons/Volume.png" alt="" className="menu-icon-small" />
                <div className="system-tray-menu-item-content">
                  <span className="system-tray-menu-item-title">Volume</span>
                  <div className="volume-slider-container">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={volume} 
                      onChange={(e) => {
                        const newVolume = Number(e.target.value)
                        setVolume(newVolume)
                        AudioVolumeManager.setVolume(newVolume)
                      }}
                      className="volume-slider" 
                    />
                    <span className="volume-percentage">{volume}%</span>
                  </div>
                </div>
              </div>
              <div className="system-tray-menu-divider"></div>
              <div className="system-tray-menu-item">
                <img src="/assets/icons/Windows XP Icons/Wireless Network Connection.png" alt="" className="menu-icon-small" />
                <div className="system-tray-menu-item-content">
                  <span className="system-tray-menu-item-title">Network Connection</span>
                  <span className="system-tray-menu-item-subtitle">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Taskbar

