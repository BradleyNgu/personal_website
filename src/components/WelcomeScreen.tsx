import { useState, useEffect } from 'react'
import '../styles/welcome.css'

interface WelcomeScreenProps {
  onLogin: () => void
}

function WelcomeScreen({ onLogin }: WelcomeScreenProps) {
  const [stage, setStage] = useState<'initial' | 'clicked' | 'typing' | 'loggingIn'>('initial')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (stage === 'typing') {
      // Simulate typing password
      const dots = '••••••••'
      let currentDot = 0
      const typingInterval = setInterval(() => {
        if (currentDot < dots.length) {
          setPassword(dots.substring(0, currentDot + 1))
          currentDot++
        } else {
          clearInterval(typingInterval)
          setStage('loggingIn')
          // Wait a moment before logging in
          setTimeout(() => {
            onLogin()
          }, 500)
        }
      }, 100)
      return () => clearInterval(typingInterval)
    }
  }, [stage, onLogin])

  const handleUserClick = () => {
    if (stage === 'initial') {
      setStage('clicked')
      setTimeout(() => {
        setStage('typing')
      }, 300)
    }
  }

  return (
    <div className="welcome-screen">
      <div className="welcome-top-bar"></div>
      
      <div className="welcome-main">
        <div className="windows-logo-section">
          <img src="/assets/icons/Window_XP.png" alt="Windows XP" className="windows-xp-logo" />
        </div>
        <div className="instruction-text">
          To begin, click your user name
        </div>
      </div>

      <div className="welcome-divider"></div>

      <div className="welcome-right">
        {stage === 'initial' ? (
          <div className="user-account-tile" onClick={handleUserClick}>
            <img 
              src="/assets/icons/profile_image.jpeg" 
              alt="Bradley Nguyen" 
              className="user-account-icon"
            />
            <div className="user-account-label">Bradley Nguyen</div>
          </div>
        ) : (
          <div className="password-section">
            <div className="password-user-info">
              <img 
                src="/assets/icons/profile_image.jpeg" 
                alt="Bradley Nguyen" 
                className="password-user-icon"
              />
              <div className="password-user-name">Bradley Nguyen</div>
            </div>
            <div className="password-input-container">
              <input 
                type="password" 
                value={password} 
                readOnly 
                placeholder="Type your password"
                className="password-input"
              />
              <button className="password-arrow-btn">
                <img src="/assets/icons/Windows XP Icons/Go.png" alt="Go" className="arrow-icon" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="welcome-footer">
        <button className="turn-off-btn" onClick={() => window.location.href = 'https://www.youtube.com/watch?v=ZtiQk-vqmBA'}>
          <img src="/assets/icons/Windows XP Icons/Power.png" alt="Power" className="shutdown-icon" />
          Turn off computer
        </button>
        <div className="footer-info">
          After you log on, you can add or change accounts.<br />
          Just go to Control Panel and click User Accounts.
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen

