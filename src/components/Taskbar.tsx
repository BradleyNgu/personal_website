import { useState, useEffect } from 'react'
import type { WindowState } from './Desktop'
import '../styles/taskbar.css'

interface TaskbarProps {
  windows: WindowState[]
  onWindowClick: (id: string) => void
  onShutdown: () => void
  onEmailClick: () => void
}

function Taskbar({ windows, onWindowClick, onShutdown, onEmailClick }: TaskbarProps) {
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <div className="taskbar">
      <button 
        className={`start-button ${showStartMenu ? 'active' : ''}`}
        onClick={() => setShowStartMenu(!showStartMenu)}
      >
        <img src="/assets/icons/start_2.png" alt="Start" className="start-icon-img" />
      </button>

      {showStartMenu && (
        <div className="start-menu">
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
                <div className="start-menu-item" onClick={() => {
                  onEmailClick()
                  setShowStartMenu(false)
                }}>
                  <img src="/assets/icons/Windows XP Icons/Email.png" alt="" className="menu-icon-large" />
                  <span>Email</span>
                </div>
                <div className="start-menu-item">
                  <img src="/assets/icons/Windows XP Icons/Internet Explorer 6.png" alt="" className="menu-icon-large" />
                  <span>Internet</span>
                </div>
              </div>
            </div>
            
            <div className="start-menu-right">
              <div className="start-menu-item">
                <img src="/assets/icons/Windows XP Icons/My Documents.png" alt="" className="menu-icon-small" />
                <span>My Documents</span>
              </div>
              <div className="start-menu-item">
                <img src="/assets/icons/folder.png" alt="" className="menu-icon-small" />
                <span>My Recent Documents</span>
                <span className="arrow">▶</span>
              </div>
              <div className="start-menu-item">
                <img src="/assets/icons/Windows XP Icons/My Pictures.png" alt="" className="menu-icon-small" />
                <span>My Pictures</span>
              </div>
              <div className="start-menu-item">
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
            <div className="all-programs-btn">
              <span className="arrow-icon">▶</span>
              <span>All Programs</span>
            </div>
            <div className="bottom-buttons">
              <button className="log-off-btn">
                <img src="/assets/icons/Windows XP Icons/Logout.png" alt="Log Off" className="btn-icon" />
                Log Off
              </button>
              <button className="turn-off-btn" onClick={onShutdown}>
                <img src="/assets/icons/Windows XP Icons/Power.png" alt="Turn Off" className="btn-icon" />
                Turn Off Computer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="taskbar-windows">
        {windows.map(window => (
          <button
            key={window.id}
            className={`taskbar-window ${window.isMinimized ? '' : 'active'}`}
            onClick={() => onWindowClick(window.id)}
          >
            <img src={window.icon} alt="" className="taskbar-window-icon" />
            <span className="taskbar-window-title">{window.title}</span>
          </button>
        ))}
      </div>

      <div className="system-tray">
        <div className="tray-icons">
          <span className="tray-icon" title="Volume">🔊</span>
          <span className="tray-icon" title="Network">📶</span>
        </div>
        <div className="clock">{formatTime(currentTime)}</div>
      </div>
    </div>
  )
}

export default Taskbar

