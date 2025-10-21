import { useEffect } from 'react'
import '../styles/shutdown.css'

interface ShutdownScreenProps {
  onComplete: () => void
}

function ShutdownScreen({ onComplete }: ShutdownScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000) // Redirect after 3 seconds
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="shutdown-screen">
      <div className="shutdown-content">
        <div className="windows-logo-shutdown">
          <div className="xp-flag">
            <div className="flag-red"></div>
            <div className="flag-green"></div>
            <div className="flag-blue"></div>
            <div className="flag-yellow"></div>
          </div>
          <div className="windows-text">
            <span className="microsoft">Microsoft</span>
            <span className="windows">Windows<sup>XP</sup></span>
          </div>
        </div>
        <div className="shutdown-message">
          Windows is shutting down...
        </div>
        <div className="shutdown-spinner">
          <div className="spinner-dot"></div>
          <div className="spinner-dot"></div>
          <div className="spinner-dot"></div>
        </div>
      </div>
    </div>
  )
}

export default ShutdownScreen

