import { useState } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import Desktop from './components/Desktop'
import ShutdownScreen from './components/ShutdownScreen'
import './styles/App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [shuttingDown, setShuttingDown] = useState(false)

  const handleShutdown = () => {
    setShuttingDown(true)
  }

  const handleShutdownComplete = () => {
    window.location.href = 'https://www.youtube.com/watch?v=ZtiQk-vqmBA'
  }

  return (
    <div className="app">
      {shuttingDown ? (
        <ShutdownScreen onComplete={handleShutdownComplete} />
      ) : !loggedIn ? (
        <WelcomeScreen onLogin={() => setLoggedIn(true)} />
      ) : (
        <Desktop onShutdown={handleShutdown} />
      )}
    </div>
  )
}

export default App

