import { useState } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import LoadingScreen from './components/LoadingScreen'
import Desktop from './components/Desktop'
import ShutdownScreen from './components/ShutdownScreen'
import './styles/App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [shuttingDown, setShuttingDown] = useState(false)

  // ZOOM LOCK DISABLED - User can now zoom in/out
  /*
  useEffect(() => {
    // Prevent zoom gestures
    const preventZoom = (e: WheelEvent) => {
      // Prevent Ctrl/Cmd + scroll wheel zoom
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
      }
    }

    const preventTouchZoom = (e: TouchEvent) => {
      // Prevent pinch-to-zoom (two-finger gestures)
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    // Prevent keyboard zoom (Ctrl/Cmd + Plus/Minus/0)
    const preventKeyZoom = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0' || e.keyCode === 187 || e.keyCode === 189 || e.keyCode === 48)) {
        e.preventDefault()
      }
    }

    // Prevent double-tap zoom on mobile
    let lastTouchEnd = 0
    const preventDoubleTapZoom = (e: TouchEvent) => {
      const now = Date.now()
      if (now - lastTouchEnd <= 300) {
        e.preventDefault()
      }
      lastTouchEnd = now
    }

    window.addEventListener('wheel', preventZoom, { passive: false })
    window.addEventListener('touchmove', preventTouchZoom, { passive: false })
    window.addEventListener('keydown', preventKeyZoom)
    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false })

    return () => {
      window.removeEventListener('wheel', preventZoom)
      window.removeEventListener('touchmove', preventTouchZoom)
      window.removeEventListener('keydown', preventKeyZoom)
      document.removeEventListener('touchend', preventDoubleTapZoom)
    }
  }, [])
  */

  const handleLogin = () => {
    setLoading(true)
  }

  const handleLoadingComplete = () => {
    setLoading(false)
    setLoggedIn(true)
  }

  const handleShutdown = () => {
    setShuttingDown(true)
  }

  const handleLogOff = () => {
    setLoggedIn(false)
    setLoading(false)
  }

  const handleShutdownComplete = () => {
    window.location.href = 'https://www.linkedin.com/in/bradley-nguyen-cs/'
  }

  return (
    <div className="app">
      {shuttingDown ? (
        <ShutdownScreen onComplete={handleShutdownComplete} />
      ) : loading ? (
        <LoadingScreen onComplete={handleLoadingComplete} />
      ) : !loggedIn ? (
        <WelcomeScreen onLogin={handleLogin} onShutdown={handleShutdown} />
      ) : (
        <Desktop onShutdown={handleShutdown} onLogOff={handleLogOff} />
      )}
    </div>
  )
}

export default App

