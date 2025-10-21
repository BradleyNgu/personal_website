import { useEffect } from 'react'
import '../styles/loading.css'

interface LoadingScreenProps {
  onComplete: () => void
}

function LoadingScreen({ onComplete }: LoadingScreenProps) {
  useEffect(() => {
    // Play startup sound
    const audio = new Audio('/assets/Microsoft Windows XP Startup Sound.mp3')
    audio.play().catch(error => {
      console.log('Audio playback failed:', error)
    })

    const timer = setTimeout(() => {
      onComplete()
    }, 4000) // Show loading for 4 seconds
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="loading-screen">
      <div className="loading-top-bar"></div>
      
      <div className="loading-content">
        <div className="loading-left">
          <div className="welcome-text">welcome</div>
        </div>

        <div className="loading-divider"></div>

        <div className="loading-right">
          <div className="loading-user-section">
            <img 
              src="/assets/icons/profile_image.jpeg" 
              alt="Bradley Nguyen" 
              className="loading-user-icon"
            />
            <div className="loading-user-info">
              <div className="loading-user-name">Bradley Nguyen</div>
              <div className="loading-message">Loading your personal settings...</div>
            </div>
          </div>
        </div>
      </div>

      <div className="loading-bottom-bar"></div>
    </div>
  )
}

export default LoadingScreen

