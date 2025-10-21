import { useState } from 'react'
import '../styles/icon.css'

interface DesktopIconProps {
  title: string
  icon: string
  onDoubleClick: () => void
  position: { x: number; y: number }
}

function DesktopIcon({ title, icon, onDoubleClick, position }: DesktopIconProps) {
  const [selected, setSelected] = useState(false)
  const [clickTime, setClickTime] = useState(0)

  const handleClick = () => {
    setSelected(true)
    const now = Date.now()
    
    if (now - clickTime < 300) {
      // Double click detected
      onDoubleClick()
      setSelected(false)
      setClickTime(0)
    } else {
      // Single click
      setClickTime(now)
      setTimeout(() => {
        setClickTime(0)
      }, 300)
    }
  }

  return (
    <div
      className={`desktop-icon ${selected ? 'selected' : ''}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onClick={handleClick}
    >
      <div className="icon-image-container">
        <img src={icon} alt={title} className="icon-image" />
      </div>
      <div className="icon-label">
        <span>{title}</span>
      </div>
    </div>
  )
}

export default DesktopIcon

