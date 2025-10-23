import { useState } from 'react'

function Resume() {
  const [showFallback, setShowFallback] = useState(false)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/assets/BradleyNguyen.pdf'
    link.download = 'BradleyNguyen_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpenInNewTab = () => {
    window.open('/assets/BradleyNguyen.pdf', '_blank')
  }

  const handleShowFallback = () => {
    setShowFallback(true)
  }

  if (showFallback) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'white',
        padding: '20px',
        fontFamily: 'Tahoma, sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          padding: '20px',
          background: '#f0f0f0',
          border: '2px outset #d4d4d4',
          borderRadius: '4px'
        }}>
          <h2 style={{ color: '#003c74', margin: '0 0 10px 0' }}>📄 Bradley Nguyen - Resume</h2>
          <p style={{ margin: '0 0 15px 0', color: '#333' }}>
            Your resume is ready to view. Choose an option below:
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleOpenInNewTab}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(to bottom, #5c95d6 0%, #4f87cc 50%, #3b6fbc 100%)',
                border: '1px solid #0831d9',
                borderRadius: '3px',
                color: 'white',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)'
              }}
            >
              📖 Open in New Tab
            </button>
            <button
              onClick={handleDownload}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(to bottom, #5c95d6 0%, #4f87cc 50%, #3b6fbc 100%)',
                border: '1px solid #0831d9',
                borderRadius: '3px',
                color: 'white',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)'
              }}
            >
              💾 Download PDF
            </button>
          </div>
        </div>
        
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          background: '#f8f8f8',
          border: '2px inset #d4d4d4',
          borderRadius: '4px',
          padding: '20px'
        }}>
          <div style={{ textAlign: 'center', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📄</div>
            <p style={{ margin: '0', fontSize: '14px' }}>
              PDF viewer not available on this device.<br/>
              Use the buttons above to view or download your resume.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 10
      }}>
        <button
          onClick={handleShowFallback}
          style={{
            padding: '5px 10px',
            background: 'linear-gradient(to bottom, #5c95d6 0%, #4f87cc 50%, #3b6fbc 100%)',
            border: '1px solid #0831d9',
            borderRadius: '3px',
            color: 'white',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          }}
        >
          Alternative View
        </button>
      </div>
      <iframe
        src="/assets/BradleyNguyen.pdf"
        width="100%"
        height="100%"
        style={{
          border: 'none',
          background: 'white'
        }}
        title="Bradley Nguyen Resume"
      />
    </div>
  )
}

export default Resume
