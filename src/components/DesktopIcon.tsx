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
  const [clickCount, setClickCount] = useState(0)

  const handleClick = () => {
    setSelected(true)
    setClickCount(prev => prev + 1)

    setTimeout(() => {
      setClickCount(prev => {
        if (prev === 2) {
          onDoubleClick()
          setSelected(false)
          return 0
        }
        return 0
      })
    }, 300)
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

