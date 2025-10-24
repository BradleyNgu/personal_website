import React from 'react'
import '../styles/error-dialog.css'

interface ErrorDialogProps {
  isOpen: boolean
  title: string
  message: string
  onClose: () => void
}

function ErrorDialog({ isOpen, title, message, onClose }: ErrorDialogProps) {
  if (!isOpen) return null

  return (
    <div className="error-dialog-overlay">
      <div className="error-dialog">
        <div className="error-dialog-header">
          <div className="error-dialog-title">{title}</div>
          <button className="error-dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="error-dialog-content">
          <div className="error-dialog-icon">
            <img src="/assets/icons/Windows XP Icons/Critical.png" alt="Critical Error" />
          </div>
          <div className="error-dialog-message">{message}</div>
        </div>
        <div className="error-dialog-footer">
          <button 
            className="error-dialog-button"
            onClick={onClose}
            autoFocus
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorDialog
