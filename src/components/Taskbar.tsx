import { useState, useEffect } from 'react'
import type { WindowState } from './Desktop'
import '../styles/taskbar.css'

interface TaskbarProps {
  windows: WindowState[]
  onWindowClick: (id: string) => void
  onShutdown: () => void
}

function Taskbar({ windows, onWindowClick, onShutdown }: TaskbarProps) {
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
          <div className="start-menu-header">
            <div className="user-profile-section">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bradley" 
                alt="Bradley Nguyen"
                className="user-avatar"
              />
              <span className="user-name-text">Bradley Nguyen</span>
            </div>
          </div>
          <div className="start-menu-content">
            <div className="start-menu-item">
              <span>📧 Email</span>
            </div>
            <div className="start-menu-item">
              <span>🌐 Internet</span>
            </div>
            <div className="start-menu-divider"></div>
            <div className="start-menu-item">
              <span>📁 My Documents</span>
            </div>
            <div className="start-menu-item">
              <span>🖼️ My Pictures</span>
            </div>
            <div className="start-menu-item">
              <span>🎵 My Music</span>
            </div>
            <div className="start-menu-divider"></div>
            <div className="start-menu-item">
              <span>⚙️ Control Panel</span>
            </div>
          </div>
          <div className="start-menu-footer">
            <div className="start-menu-item footer-item" onClick={onShutdown}>
              <span>🔌 Turn Off Computer</span>
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

