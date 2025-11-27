import React from 'react'

function HelpAndSupport() {
  const helpTopics = [
    { title: 'Getting Started', description: 'Learn the basics of using Windows XP' },
    { title: 'Troubleshooting', description: 'Find solutions to common problems' },
    { title: 'System Information', description: 'View details about your computer' },
    { title: 'Keyboard Shortcuts', description: 'Learn useful keyboard shortcuts' },
    { title: 'Network and Internet', description: 'Connect to networks and the internet' },
    { title: 'Security and Privacy', description: 'Keep your computer secure' },
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Help and Support Center</h1>
      </div>
      <div className="page-content">
        <div style={{ padding: '20px', display: 'flex', gap: '30px' }}>
          <div style={{ flex: '1' }}>
            <h2 style={{ marginBottom: '20px', color: '#1e3f7a' }}>Pick a Help Topic</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {helpTopics.map((topic, index) => (
                <div
                  key={index}
                  style={{
                    padding: '15px',
                    border: '1px solid #d4d4d4',
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e8f4f8'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9f9f9'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#1e3f7a' }}>
                    {topic.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {topic.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ width: '300px', padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
            <h3 style={{ marginBottom: '15px', color: '#1e3f7a' }}>Did you know?</h3>
            <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#333' }}>
              Windows XP Help and Support provides comprehensive assistance for all your computing needs. 
              Browse topics, search for answers, or contact support for additional help.
            </p>
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '4px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Quick Tips:</div>
              <ul style={{ fontSize: '12px', lineHeight: '1.8', paddingLeft: '20px' }}>
                <li>Press F1 for context-sensitive help</li>
                <li>Use the search box to find specific topics</li>
                <li>Check the index for a complete list of topics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpAndSupport

