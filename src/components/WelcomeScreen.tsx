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
      <div className="welcome-content">
        {stage === 'initial' && (
          <>
            <div className="windows-logo">
              <img src="/assets/wallpaper.jpg" alt="Windows XP" style={{display: 'none'}} />
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
            <div className="welcome-message">To begin, click your user name</div>
          </>
        )}
        
        {stage !== 'initial' && (
          <div className={`login-box ${stage === 'loggingIn' ? 'logging-in' : ''}`}>
            <div className="user-profile">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bradley" 
                alt="Bradley Nguyen" 
                className="profile-pic"
              />
            </div>
            <div className="user-name">Bradley Nguyen</div>
            {stage !== 'clicked' && (
              <div className="password-container">
                <input 
                  type="password" 
                  value={password} 
                  readOnly 
                  placeholder="Type your password"
                  className="password-input"
                />
                <button className="login-btn">
                  <span className="arrow">→</span>
                </button>
              </div>
            )}
            {stage === 'loggingIn' && (
              <div className="loading-message">Logging in...</div>
            )}
          </div>
        )}

        {stage === 'initial' && (
          <div className="user-selector" onClick={handleUserClick}>
            <div className="user-icon-container">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bradley" 
                alt="Bradley Nguyen" 
                className="user-icon"
              />
              <div className="user-label">Bradley Nguyen</div>
            </div>
          </div>
        )}
      </div>

      <div className="welcome-footer">
        <button className="turn-off-btn">
          <div className="shutdown-icon"></div>
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

