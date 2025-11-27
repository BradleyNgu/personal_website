import { useState } from 'react'

interface RunProps {
  onRunCommand?: (command: string) => void
}

function Run({ onRunCommand }: RunProps) {
  const [command, setCommand] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const handleRun = () => {
    if (command.trim()) {
      const cmd = command.trim().toLowerCase()
      setHistory(prev => [...prev, command])
      
      // Call the handler if provided
      if (onRunCommand) {
        onRunCommand(cmd)
      }
      
      setCommand('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRun()
    }
  }

  // Map of commands to application names
  const commandMap: { [key: string]: string } = {
    'cmd': 'Command Prompt',
    'command': 'Command Prompt',
    'command prompt': 'Command Prompt',
    'email': 'Email',
    'mail': 'Email',
    'internet': 'Internet Explorer',
    'ie': 'Internet Explorer',
    'explorer': 'Internet Explorer',
    'browser': 'Internet Explorer',
    'pictures': 'My Pictures',
    'my pictures': 'My Pictures',
    'photos': 'My Pictures',
    'music': 'My Music',
    'my music': 'My Music',
    'resume': 'Resume',
    'cv': 'Resume',
    'about': 'About Me',
    'autobiography': 'About Me',
    'about me': 'About Me',
    'computer': 'My Computer',
    'my computer': 'My Computer',
    'control': 'Control Panel',
    'control panel': 'Control Panel',
    'help': 'Help and Support',
    'help and support': 'Help and Support',
    'support': 'Help and Support',
    'search': 'Search',
    'find': 'Search',
  }

  const commonCommands = [
    'cmd',
    'email',
    'internet',
    'pictures',
    'music',
    'resume',
    'about',
    'computer',
    'control panel',
    'help',
    'search',
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Run</h1>
      </div>
      <div className="page-content">
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#1e3f7a' }}>
              Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a program name..."
                list="common-commands"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #999',
                  borderRadius: '3px',
                  fontSize: '14px',
                  fontFamily: 'Tahoma, sans-serif',
                }}
              />
              <datalist id="common-commands">
                {commonCommands.map((cmd, index) => (
                  <option key={index} value={cmd} />
                ))}
              </datalist>
              <button
                onClick={handleRun}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#3c6dc5',
                  color: 'white',
                  border: '1px solid #1e3f7a',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontFamily: 'Tahoma, sans-serif',
                  fontWeight: 'bold',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5c95d6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3c6dc5'
                }}
              >
                OK
              </button>
              <button
                onClick={() => setCommand('')}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#e0e0e0',
                  color: '#333',
                  border: '1px solid #999',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontFamily: 'Tahoma, sans-serif',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#d0d0d0'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#e0e0e0'
                }}
              >
                Cancel
              </button>
            </div>
          </div>

          {history.length > 0 && (
            <div>
              <h3 style={{ marginBottom: '10px', color: '#1e3f7a' }}>Recent Commands</h3>
              <div style={{
                border: '1px solid #d4d4d4',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
                padding: '10px',
                maxHeight: '200px',
                overflowY: 'auto',
              }}>
                {history.slice().reverse().map((cmd, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '5px',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                    onClick={() => setCommand(cmd)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e8f4f8'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    {cmd}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
            <h3 style={{ marginBottom: '10px', color: '#1e3f7a' }}>Available Applications</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {commonCommands.map((cmd, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCommand(cmd)
                    setTimeout(() => handleRun(), 100)
                  }}
                  style={{
                    padding: '5px 12px',
                    backgroundColor: 'white',
                    border: '1px solid #999',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontFamily: 'Tahoma, sans-serif',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e8f4f8'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                  }}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Run
