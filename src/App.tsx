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

