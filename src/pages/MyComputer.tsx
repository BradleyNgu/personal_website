import React from 'react'

function MyComputer() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Computer</h1>
      </div>
      <div className="page-content">
        <div style={{ padding: '20px' }}>
          <h2 style={{ marginBottom: '20px', color: '#1e3f7a' }}>Storage Devices</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px',
              padding: '10px',
              border: '1px solid #d4d4d4',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9'
            }}>
              <img 
                src="/assets/icons/Windows XP Icons/Hard Disk.png" 
                alt="Local Disk" 
                style={{ width: '48px', height: '48px' }}
              />
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Local Disk (C:)</div>
                <div style={{ color: '#666', fontSize: '12px' }}>File System</div>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px',
              padding: '10px',
              border: '1px solid #d4d4d4',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9'
            }}>
              <img 
                src="/assets/icons/Windows XP Icons/CD Drive.png" 
                alt="CD Drive" 
                style={{ width: '48px', height: '48px' }}
              />
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>CD Drive (D:)</div>
                <div style={{ color: '#666', fontSize: '12px' }}>No disc inserted</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyComputer

