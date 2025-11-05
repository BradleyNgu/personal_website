import { useEffect, useRef } from 'react'
import { AudioVolumeManager } from '../utils/audioVolume'
import '../styles/shutdown.css'

interface ShutdownScreenProps {
  onComplete: () => void
}

function ShutdownScreen({ onComplete }: ShutdownScreenProps) {
  const hasPlayedSound = useRef(false)

  useEffect(() => {
    // Play shutdown sound only once (even in React StrictMode)
    if (!hasPlayedSound.current) {
      hasPlayedSound.current = true
      const audio = new Audio('/assets/Microsoft Windows XP Shutdown Sound.mp3')
      AudioVolumeManager.registerAudio(audio)
      audio.play().catch(error => {
        console.log('Audio playback failed:', error)
      })

      const timer = setTimeout(() => {
        onComplete()
      }, 3000) // Redirect after 3 seconds
      
      // Cleanup: unregister when component unmounts
      return () => {
        AudioVolumeManager.unregisterAudio(audio)
        clearTimeout(timer)
      }
    }
  }, [onComplete]) // Empty dependency array - run only once on mount

  return (
    <div className="shutdown-screen">
      <div className="shutdown-top-bar"></div>
      <div className="shutdown-content">
        <div className="inspired-by-text">Inspired by:</div>
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

