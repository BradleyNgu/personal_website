import { useEffect } from 'react'

function Resume() {
  useEffect(() => {
    // Automatically open the PDF in a new tab when the component mounts
    window.open('/assets/BradleyNguyen.pdf', '_blank')
  }, [])

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'white',
      padding: '20px',
      fontFamily: 'Tahoma, sans-serif',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        background: '#f0f0f0',
        border: '2px outset #d4d4d4',
        borderRadius: '4px',
        maxWidth: '500px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📄</div>
        <h2 style={{ color: '#003c74', margin: '0 0 15px 0' }}>Opening Resume...</h2>
        <p style={{ margin: '0 0 20px 0', color: '#333', fontSize: '14px' }}>
          Your resume should open in a new tab. If it doesn't open automatically, 
          you can click the button below.
        </p>
        <button
          onClick={() => window.open('/assets/BradleyNguyen.pdf', '_blank')}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(to bottom, #5c95d6 0%, #4f87cc 50%, #3b6fbc 100%)',
            border: '1px solid #0831d9',
            borderRadius: '3px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          }}
        >
          📖 Open Resume in New Tab
        </button>
      </div>
    </div>
  )
}

export default Resume
