function ControlPanel() {
  const categories = [
    { 
      name: 'Appearance and Themes', 
      icon: '/assets/icons/Windows XP Icons/Display.png',
      description: 'Change desktop background, screen saver, or resolution'
    },
    { 
      name: 'Network and Internet Connections', 
      icon: '/assets/icons/Windows XP Icons/Wireless Network Connection.png',
      description: 'Connect to the Internet or a network'
    },
    { 
      name: 'Add or Remove Programs', 
      icon: '/assets/icons/Windows XP Icons/Add or Remove Programs.png',
      description: 'Install and remove programs'
    },
    { 
      name: 'Sounds, Speech, and Audio Devices', 
      icon: '/assets/icons/Windows XP Icons/Volume.png',
      description: 'Adjust volume and audio settings'
    },
    { 
      name: 'Performance and Maintenance', 
      icon: '/assets/icons/Windows XP Icons/System.png',
      description: 'Free up space on your hard disk'
    },
    { 
      name: 'Printers and Other Hardware', 
      icon: '/assets/icons/Windows XP Icons/Printer.png',
      description: 'Install and configure printers, cameras, and other devices'
    },
    { 
      name: 'User Accounts', 
      icon: '/assets/icons/Windows XP Icons/User.png',
      description: 'Change account settings and passwords'
    },
    { 
      name: 'Date, Time, Language, and Regional Options', 
      icon: '/assets/icons/Windows XP Icons/Clock.png',
      description: 'Change date, time, time zone, and number format'
    },
    { 
      name: 'Accessibility Options', 
      icon: '/assets/icons/Windows XP Icons/Accessibility.png',
      description: 'Configure Windows for your vision, hearing, and mobility needs'
    },
    { 
      name: 'Security Center', 
      icon: '/assets/icons/Windows XP Icons/Security.png',
      description: 'Check security status and configure settings'
    },
  ]

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      backgroundColor: '#ece9d8',
      fontFamily: 'Tahoma, sans-serif'
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '42px',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #d4d4d4',
        padding: '0 8px',
        gap: '4px'
      }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          border: '1px solid #999',
          backgroundColor: '#f0f0f0',
          cursor: 'pointer',
          fontSize: '11px',
          fontFamily: 'Tahoma, sans-serif'
        }}>
          <span>←</span> Back
        </button>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          border: '1px solid #999',
          backgroundColor: '#f0f0f0',
          cursor: 'pointer',
          fontSize: '11px',
          fontFamily: 'Tahoma, sans-serif'
        }}>
          🔍 Search
        </button>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          border: '1px solid #999',
          backgroundColor: '#f0f0f0',
          cursor: 'pointer',
          fontSize: '11px',
          fontFamily: 'Tahoma, sans-serif'
        }}>
          📁 Folders
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        overflow: 'hidden'
      }}>
        {/* Left Pane */}
        <div style={{
          width: '200px',
          backgroundColor: '#e8f4f8',
          borderRight: '1px solid #d4d4d4',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          fontSize: '11px'
        }}>
          {/* Control Panel Section */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#1e3f7a'
            }}>
              <span>☑</span>
              <span>Control Panel</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 8px',
              cursor: 'pointer',
              color: '#0066cc'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none'
            }}
            >
              <span style={{ fontSize: '14px' }}>📋</span>
              <span>Switch to Classic View</span>
            </div>
          </div>

          {/* See Also Section */}
          <div>
            <div style={{
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#1e3f7a'
            }}>
              See Also
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                color: '#0066cc'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none'
              }}
              >
                <span style={{ fontSize: '14px' }}>ℹ️</span>
                <span>Windows Update</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                color: '#0066cc'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none'
              }}
              >
                <span style={{ fontSize: '14px' }}>❓</span>
                <span>Help and Support</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                color: '#0066cc'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none'
              }}
              >
                <span style={{ fontSize: '14px' }}>⚙️</span>
                <span>Other Control Panel Options</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane */}
        <div style={{
          flex: 1,
          backgroundColor: '#d6e7f5',
          padding: '20px',
          position: 'relative',
          overflow: 'auto'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1e3f7a',
            marginBottom: '20px',
            marginTop: '0'
          }}>
            Pick a category
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            maxWidth: '800px'
          }}>
            {categories.map((category, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: 'white',
                  border: '1px solid #b0c4de',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e8f4f8'
                  e.currentTarget.style.borderColor = '#5c95d6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.borderColor = '#b0c4de'
                }}
              >
                <img 
                  src={category.icon} 
                  alt={category.name}
                  style={{ 
                    width: '48px', 
                    height: '48px',
                    flexShrink: 0
                  }}
                  onError={(e) => {
                    // Fallback if icon doesn't exist
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#1e3f7a',
                    marginBottom: '4px',
                    fontSize: '13px'
                  }}>
                    {category.name}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#666',
                    lineHeight: '1.4'
                  }}>
                    {category.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Watermark Graphic */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            opacity: 0.15,
            fontSize: '200px',
            color: '#1e3f7a',
            pointerEvents: 'none',
            userSelect: 'none'
          }}>
            ☑
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControlPanel
