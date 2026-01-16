import React, { useState, useEffect } from 'react'
import '../styles/welcome.css'

interface WelcomeScreenProps {
  onLogin: () => void
  onSkip: () => void
  onShutdown: () => void
}

function WelcomeScreen({ onLogin, onSkip, onShutdown }: WelcomeScreenProps) {
  const [stage, setStage] = useState<'initial' | 'clicked' | 'typing' | 'loggingIn'>('initial')
  const [password, setPassword] = useState('')
  const typingIntervalRef = React.useRef<number | null>(null)

  useEffect(() => {
    if (stage === 'typing') {
      // Reset password to empty when typing starts
      setPassword('')
      // Simulate typing password - use regular characters that will be converted to dots by password input
      const passwordLength = 16
      let currentLength = 0
      // Start typing after a brief delay to ensure the field is visible
      const startDelay = setTimeout(() => {
        const typingInterval = setInterval(() => {
          if (currentLength < passwordLength) {
            // Add one character at a time - password field will show dots
            setPassword('x'.repeat(currentLength + 1))
            currentLength++
          } else {
            clearInterval(typingInterval)
            typingIntervalRef.current = null
            setStage('loggingIn')
            // Wait a moment before logging in
            setTimeout(() => {
              onLogin()
            }, 500)
          }
        }, 100)
        typingIntervalRef.current = typingInterval
      }, 100)
      
      return () => {
        clearTimeout(startDelay)
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current)
          typingIntervalRef.current = null
        }
      }
    }
  }, [stage, onLogin])

  const handleSkip = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current)
      typingIntervalRef.current = null
    }
    onSkip()
  }

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
          <div className="inspired-by-text">Inspired by:</div>
          <img src="/assets/icons/Window_XP.png" alt="Windows XP" className="windows-xp-logo" />
        </div>
        <div className="instruction-text">
          To begin, click your user name
        </div>
        {/* Mobile user button - shown only on mobile */}
        <div className="mobile-user-section">
          <div className={`user-account-tile ${stage !== 'initial' ? 'active' : ''}`} onClick={handleUserClick}>
            <img 
              src="/assets/icons/profile_image.jpeg" 
              alt="Bradley Nguyen" 
              className="user-account-icon"
            />
            <div className="user-account-label">Bradley Nguyen</div>
          </div>
          {stage !== 'initial' && (
            <div className="password-section">
              <div className="password-label">Type your password</div>
              <div className="password-input-container">
                <input 
                  type="password" 
                  value={password} 
                  readOnly 
                  placeholder=""
                  className="password-input"
                />
                <button className="password-arrow-btn">
                  <img src="/assets/icons/Windows XP Icons/Go.png" alt="Go" className="arrow-icon" />
                </button>
              </div>
              {stage === 'typing' && (
                <button className="skip-btn" onClick={handleSkip}>
                  Skip
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="welcome-divider"></div>

      <div className="welcome-right">
        <div className={`user-account-tile ${stage !== 'initial' ? 'active' : ''}`} onClick={handleUserClick}>
          <img 
            src="/assets/icons/profile_image.jpeg" 
            alt="Bradley Nguyen" 
            className="user-account-icon"
          />
          <div className="user-account-label">Bradley Nguyen</div>
        </div>
        {stage !== 'initial' && (
          <div className="password-section">
            <div className="password-label">Type your password</div>
            <div className="password-input-container">
              <input 
                type="password" 
                value={password} 
                readOnly 
                placeholder=""
                className="password-input"
              />
              <button className="password-arrow-btn">
                <img src="/assets/icons/Windows XP Icons/Go.png" alt="Go" className="arrow-icon" />
              </button>
            </div>
            {stage === 'typing' && (
              <button className="skip-btn" onClick={handleSkip}>
                Skip
              </button>
            )}
          </div>
        )}
      </div>

      <div className="welcome-footer">
        <div className="footer-left">
          <button className="turn-off-btn" onClick={onShutdown}>
            <img src="/assets/icons/Windows XP Icons/Power.png" alt="Power" className="shutdown-icon" />
            Turn off computer
          </button>
          {stage === 'initial' && (
            <button className="skip-btn-footer" onClick={handleSkip}>
              Skip
            </button>
          )}
        </div>
        <div className="footer-info">
          After you log on, you can add or change accounts.
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen

