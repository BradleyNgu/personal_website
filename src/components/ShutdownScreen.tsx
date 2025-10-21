import { useEffect } from 'react'
import '../styles/shutdown.css'

interface ShutdownScreenProps {
  onComplete: () => void
}

function ShutdownScreen({ onComplete }: ShutdownScreenProps) {
  useEffect(() => {
    // Play shutdown sound
    const audio = new Audio('/assets/Microsoft Windows XP Shutdown Sound.mp3')
    audio.play().catch(error => {
      console.log('Audio playback failed:', error)
    })

    const timer = setTimeout(() => {
      onComplete()
    }, 3000) // Redirect after 3 seconds
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="shutdown-screen">
      <div className="shutdown-top-bar"></div>
      <div className="shutdown-content">
        <img src="/assets/icons/Window_XP.png" alt="Windows XP" className="shutdown-logo" />
        <div className="shutdown-message">
          Windows is shutting down...
        </div>
      </div>
      <div className="shutdown-bottom-bar"></div>
    </div>
  )
}

export default ShutdownScreen

