import { useState, useEffect, useRef } from 'react'
import type { WindowState } from './Desktop'
import { AudioVolumeManager } from '../utils/audioVolume'
import '../styles/taskbar.css'

interface TaskbarProps {
  windows: WindowState[]
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
}

function Taskbar({ windows, onWindowClick, onShutdown, onLogOff, onEmailClick, onCommandPromptClick, onMyPicturesClick, onMyMusicClick, onResumeClick, onAutobiographyClick, onInternetExplorerClick }: TaskbarProps) {
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [showSystemTrayMenu, setShowSystemTrayMenu] = useState(false)
  const [volume, setVolume] = useState(AudioVolumeManager.getVolume())
  const [currentTime, setCurrentTime] = useState(new Date())
  const startMenuRef = useRef<HTMLDivElement>(null)
  const systemTrayMenuRef = useRef<HTMLDivElement>(null)

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
          !startButton?.contains(target)) {
        setShowStartMenu(false)
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
    setShowSystemTrayMenu(!showSystemTrayMenu)
    setShowStartMenu(false) // Close start menu when opening system tray menu
  }

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
              <div className="start-menu-item all-programs">
                <span>All Programs</span>
                <span className="arrow-icon">▶</span>
              </div>
            </div>
            
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
              <div className="start-menu-item">
                <img src="/assets/icons/Windows XP Icons/My Computer.png" alt="" className="menu-icon-small" />
                <span>My Computer</span>
              </div>
              <div className="start-menu-divider"></div>
              <div className="start-menu-item">
                <img src="/assets/icons/Windows XP Icons/Control Panel.png" alt="" className="menu-icon-small" />
                <span>Control Panel</span>
              </div>
              <div className="start-menu-item">
                <img src="/assets/icons/Windows XP Icons/Help and Support.png" alt="" className="menu-icon-small" />
                <span>Help and Support</span>
              </div>
              <div className="start-menu-item">
                <img src="/assets/icons/Windows XP Icons/Search.png" alt="" className="menu-icon-small" />
                <span>Search</span>
              </div>
              <div className="start-menu-item">
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

      <div className="taskbar-windows">
        {windows.map(window => (
          <button
            key={window.id}
            className={`taskbar-window ${window.isMinimized ? '' : 'active'}`}
            onClick={() => {
              console.log('Taskbar button clicked for window:', window.id, 'isMinimized:', window.isMinimized)
              onWindowClick(window.id)
            }}
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

