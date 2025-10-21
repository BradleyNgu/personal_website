import { useState } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import Desktop from './components/Desktop'
import './styles/App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <div className="app">
      {!loggedIn ? (
        <WelcomeScreen onLogin={() => setLoggedIn(true)} />
      ) : (
        <Desktop />
      )}
    </div>
  )
}

export default App

