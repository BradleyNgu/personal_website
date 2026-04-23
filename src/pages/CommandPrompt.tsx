import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  INITIAL_CWD,
  formatDirListing,
  formatVirtualTree,
  isVirtualDir,
  resolveVirtualPath,
  resolveFilePath,
  fsKey,
  VIRTUAL_FILE_TEXT,
  tabComplete,
} from '../utils/virtualCmdFs'

interface Command {
  command: string
  output: string[]
  timestamp: Date
  cwd: string
}

function CommandPrompt() {
  const [commands, setCommands] = useState<Command[]>([])
  const [currentCommand, setCurrentCommand] = useState('')
  const [cwd, setCwd] = useState(INITIAL_CWD)
  const [isExecuting, setIsExecuting] = useState(false)
  const [showInputAtTop, setShowInputAtTop] = useState(true)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      if (commands.length === 0) {
        // Show initial prompt at top
        terminalRef.current.scrollTop = 0
      } else {
        // Scroll to bottom for new commands - use setTimeout to ensure DOM is updated
        setTimeout(() => {
          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight
          }
        }, 0)
      }
    }
  }, [commands, currentCommand])

  // Ensure input is visible when focused (especially on mobile)
  useEffect(() => {
    if (inputRef.current && terminalRef.current) {
      const scrollIntoView = () => {
        setTimeout(() => {
          if (terminalRef.current && inputRef.current) {
            // Scroll to ensure input is visible
            inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            // Also scroll terminal to bottom
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight
          }
        }, 100)
      }
      
      inputRef.current.addEventListener('focus', scrollIntoView)
      
      return () => {
        if (inputRef.current) {
          inputRef.current.removeEventListener('focus', scrollIntoView)
        }
      }
    }
  }, [showInputAtTop])

  const executeCommand = useCallback((command: string) => {
    if (!command.trim()) return

    // Move input to bottom after first command
    if (showInputAtTop) {
      setShowInputAtTop(false)
    }

    const snapshotCwd = cwd
    const trimmed = command.trim()
    const firstSpace = trimmed.indexOf(' ')
    const verb = firstSpace === -1 ? trimmed.toLowerCase() : trimmed.slice(0, firstSpace).toLowerCase()
    const args = firstSpace === -1 ? '' : trimmed.slice(firstSpace + 1).trim()
    let output: string[] = []

    if (verb === 'cls') {
      setCommands([])
      setShowInputAtTop(true)
      return
    }

    if (verb === 'cd' || verb === 'chdir') {
      if (!args) {
        output = [cwd]
      } else {
        const dest = resolveVirtualPath(cwd, args)
        const canon = dest ? fsKey(dest) : null
        if (!canon || !isVirtualDir(canon)) {
          output = ['The system cannot find the path specified.']
        } else {
          setCwd(canon)
          output = []
        }
      }
      setCommands((prev) => [...prev, { command, output, timestamp: new Date(), cwd: snapshotCwd }])
      return
    }

    if (verb === 'dir') {
      const targetPath = args ? resolveVirtualPath(cwd, args) : cwd
      const canon = targetPath ? fsKey(targetPath) : null
      if (!canon || !isVirtualDir(canon)) {
        output = ['File Not Found']
      } else {
        output = formatDirListing(canon) ?? ['File Not Found']
      }
      setCommands((prev) => [...prev, { command, output, timestamp: new Date(), cwd: snapshotCwd }])
      return
    }

    if (verb === 'echo') {
      output = [args]
      setCommands((prev) => [...prev, { command, output, timestamp: new Date(), cwd: snapshotCwd }])
      return
    }

    if (verb === 'type' && args) {
      const filePath = resolveFilePath(cwd, args)
      if (!filePath) {
        output = ['The system cannot find the file specified.']
      } else {
        const textKey = Object.keys(VIRTUAL_FILE_TEXT).find((k) => k.toLowerCase() === filePath.toLowerCase())
        output = textKey ? VIRTUAL_FILE_TEXT[textKey] : ['The system cannot find the file specified.']
      }
      setCommands((prev) => [...prev, { command, output, timestamp: new Date(), cwd: snapshotCwd }])
      return
    }

    const cmd = trimmed.toLowerCase()

    switch (cmd) {
      case 'help':
        output = [
          '\n',
          'PORTFOLIO COMMANDS',
          'CONTACT        Displays contact information and links.',
          'EDUCATION      Displays educational background and coursework.',
          'JOKE           Tells a random programming joke.',
          'SOCIAL         Displays social media links.',
          'TYPE           Displays the contents of a text file. Try "type readme.txt"',
          '\n',
          'SYSTEM COMMANDS',
          'CD             Displays the name of or changes the current directory.',
          'CHDIR          Same as CD.',
          'CLS            Clears the screen.',
          'DATE           Displays or sets the date.',
          'DIR            Displays a list of files and subdirectories in a directory.',
          'ECHO           Displays messages, or turns command echoing on or off.',
          'HELP           Provides Help information for Windows commands.',
          'HOSTNAME       Displays the computer name.',
          'IPCONFIG       Displays IP configuration information.',
          'NETSTAT        Displays active network connections.',
          'PING           Tests network connectivity.',
          'SYSTEMINFO     Displays machine specific properties and configuration.',
          'TASKLIST       Displays all currently running tasks including services.',
          'TIME           Displays or sets the system time.',
          'TREE           Graphically displays the directory structure of a drive or path.',
          'VER            Displays the Windows version.',
          'WHOAMI         Displays current user name.',
          '\n',
          'EASTER EGGS',
          'Type "secret" to discover hidden commands...',
          '\n',
        ]
        break
      case 'ver':
        output = ['Microsoft Windows XP [Version 5.1.2600]']
        break
      case 'date':
        output = [`The current date is: ${new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`]
        break
      case 'time':
        output = [`The current time is: ${new Date().toLocaleTimeString()}`]
        break
      case 'whoami':
        output = ['Bradley Nguyen']
        break
      case 'hostname':
        output = ['BRADLEY-PC']
        break
      case 'ipconfig':
        output = [
          'Windows IP Configuration',
          '',
          'Ethernet adapter Local Area Connection:',
          '   Connection-specific DNS Suffix  . : local',
          '   IP Address. . . . . . . . . . . . : 192.168.1.100',
          '   Subnet Mask . . . . . . . . . . . : 255.255.255.0',
          '   Default Gateway . . . . . . . . . : 192.168.1.1'
        ]
        break
      case 'ping':
        output = [
          'Pinging google.com [142.250.191.14] with 32 bytes of data:',
          'Reply from 142.250.191.14: bytes=32 time=15ms TTL=54',
          'Reply from 142.250.191.14: bytes=32 time=12ms TTL=54',
          'Reply from 142.250.191.14: bytes=32 time=18ms TTL=54',
          'Reply from 142.250.191.14: bytes=32 time=14ms TTL=54',
          '',
          'Ping statistics for 142.250.191.14:',
          '    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),',
          'Approximate round trip times in milli-seconds:',
          '    Minimum = 12ms, Maximum = 18ms, Average = 14ms'
        ]
        break
      case 'tree':
        output = formatVirtualTree()
        break
      case 'systeminfo':
        output = [
          'Host Name:                 BRADLEY-PC',
          'OS Name:                   Microsoft Windows XP Professional',
          'OS Version:                5.1.2600 Service Pack 3 Build 2600',
          'OS Manufacturer:           Microsoft Corporation',
          'System Manufacturer:       Custom Build',
          'System Model:              Portfolio Edition',
          'System Type:               x64-based PC',
          'Processor(s):              1 Processor(s) Installed.',
          '                           [01]: Intel64 Family 6 Model 158',
          'BIOS Version:              American Megatrends Inc. 1.0',
          'Total Physical Memory:     16,384 MB',
          'Available Physical Memory: 8,192 MB',
          'Virtual Memory: Max Size:  32,768 MB',
          'Virtual Memory: Available: 16,384 MB',
          'Page File Location(s):     C:\\pagefile.sys',
          'Domain:                    WORKGROUP',
          'Logon Server:              \\\\BRADLEY-PC',
          'Time Zone:                 (UTC-08:00) Pacific Time (US & Canada)'
        ]
        break
      case 'tasklist':
        output = [
          '',
          'Image Name                     PID Session Name        Session#    Mem Usage',
          '========================= ======== ================ =========== ============',
          'System Idle Process              0 Services                   0         24 K',
          'System                           4 Services                   0        236 K',
          'smss.exe                       368 Services                   0        416 K',
          'csrss.exe                      584 Services                   0      3,284 K',
          'winlogon.exe                   608 Services                   0      2,848 K',
          'services.exe                   652 Services                   0      3,780 K',
          'lsass.exe                      664 Services                   0      6,224 K',
          'svchost.exe                    856 Services                   0      4,956 K',
          'explorer.exe                 1,424 Console                    1     23,108 K',
          'chrome.exe                   2,156 Console                    1    156,892 K',
          'vscode.exe                   3,248 Console                    1    245,760 K',
          'node.exe                     4,892 Console                    1     89,432 K',
          'portfolio.exe                5,120 Console                    1     42,688 K'
        ]
        break
      case 'netstat':
        output = [
          '',
          'Active Connections',
          '',
          '  Proto  Local Address          Foreign Address        State',
          '  TCP    127.0.0.1:3000         0.0.0.0:0              LISTENING',
          '  TCP    127.0.0.1:5173         0.0.0.0:0              LISTENING',
          '  TCP    192.168.1.100:443      github.com:443         ESTABLISHED',
          '  TCP    192.168.1.100:443      linkedin.com:443       ESTABLISHED',
          '  TCP    192.168.1.100:80       bradleynguyen.dev:80   ESTABLISHED',
          '  TCP    192.168.1.100:22       gitlab.com:22          TIME_WAIT'
        ]
        break
      case 'contact':
        output = [
          'CONTACT INFORMATION',
          '',
          '📧 Email:    bradleynguyen2004@gmail.com',
          '💼 LinkedIn: linkedin.com/in/bradley-nguyen-cs',
          '🐙 GitHub:   github.com/bradleyngu',
          '📍 Location: Toronto, Ontario',
          '',
          'Click the Email icon on the desktop to send me a message!',
          ''
        ]
        break
      case 'social':
      case 'links':
        output = [
          'SOCIAL LINKS',
          '',
          '💼 LinkedIn: https://linkedin.com/in/bradley-nguyen-cs',
          '🐙 GitHub:   https://github.com/bradleyngu',
          ''
        ]
        break
      case 'education':
      case 'edu':
        output = [
          'EDUCATION',
          '',
          '🎓 Bachelor of Science in Computer Science',
          '   Carleton University',
          '   Expected Graduation: Fall 2027',
          '   GPA: 3.77/4.0',
          '',
          '📚 Relevant Coursework:',
          '   • Data Structures & Algorithms',
          '   • Software Engineering',
          '   • Database Systems',
          '   • Web Development',
          ''
        ]
        break
      case 'easter egg':
      case 'secret':
        output = [
          '🎮 You found a secret command!',
          'Fun fact: I can name any roller coaster if given an image!',
          '\n',
          'Try these hidden commands:',
          '  • starwars', 
          '  • coffee',
          ''
        ]
        break
      case 'starwars':
        output = [
          '    _________ __                 __      __                     ',
          '   /   _____//  |______ _______ /  \\    /  \\_____ _______  ______',
          '   \\_____  \\\\   __\\__  \\\\_  __ \\\\   \\/\\/   /\\__  \\\\_  __ \\/  ___/',
          '   /        \\|  |  / __ \\|  | \\/ \\        /  / __ \\|  | \\/\\___ \\ ',
          '  /_______  /|__| (____  /__|     \\__/\\  /  (____  /__|  /____  >',
          '          \\/           \\/              \\/        \\/           \\/ ',
          '',
          '"May the Force be with you."',
          '                    - Obi-Wan Kenobi',
          ''
        ]
        break
      case 'coffee':
      case 'brew':
        output = [
          '      ( (',
          '       ) )',
          '    .........', 
          '    |       |]',
          '    \\       /',
          '     `-----\'',
          '',
          '☕ Brewing coffee...',
          '☕ Coffee ready! Time to code.',
          '',
          'Error 418: I\'m a teapot (but I made coffee anyway)',
          ''
        ]
        break
      case 'joke':
        const jokes = [
          'Why do programmers prefer dark mode?\nBecause light attracts bugs! 🐛',
          'How many programmers does it take to change a light bulb?\nNone. It\'s a hardware problem. 💡',
          'Why did the developer go broke?\nBecause he used up all his cache! 💰',
          'What\'s a programmer\'s favorite hangout place?\nFoo Bar! 🍺',
          'Why do Java developers wear glasses?\nBecause they don\'t C#! 👓'
        ]
        output = [jokes[Math.floor(Math.random() * jokes.length)]]
        break
      default:
        output = [`'${command}' is not recognized as an internal or external command, operable program or batch file.`]
    }

    setCommands((prev) => [...prev, {
      command,
      output,
      timestamp: new Date(),
      cwd: snapshotCwd,
    }])
  }, [cwd, showInputAtTop])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const input = e.currentTarget
      const pos = input.selectionStart ?? currentCommand.length
      const result = tabComplete(currentCommand, pos, cwd)
      if (!result) return
      setCurrentCommand(result.line)
      requestAnimationFrame(() => {
        const el = inputRef.current
        if (el) {
          el.setSelectionRange(result.cursor, result.cursor)
        }
      })
      return
    }
    if (e.key === 'Enter') {
      setIsExecuting(true)
      executeCommand(currentCommand)
      setCurrentCommand('')
      setTimeout(() => setIsExecuting(false), 100)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCommand(e.target.value)
  }

  const handleTerminalClick = () => {
    // Focus input when clicking anywhere in the terminal
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className="command-prompt">
      <div className="terminal-content" ref={terminalRef} onClick={handleTerminalClick}>
        <div className="welcome-message">
          Microsoft Windows XP [Version 5.1.2600]<br />
          Bradley Nguyen 1985-2001 Microsoft Corp.<br />
          <br />
          {showInputAtTop && (
            <>
              <div style={{ marginBottom: '8px', color: '#c0c0c0' }}>
                Type 'help' to see available commands.
              </div>
              <div className="initial-prompt-line">
                <span className="prompt">{cwd}&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentCommand}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="command-input"
                  autoFocus
                  disabled={isExecuting}
                  placeholder=""
                />
              </div>
            </>
          )}
        </div>
        {commands.map((cmd, index) => (
          <div key={index} className="command-block">
            <div className="command-line">
              <span className="prompt">{cmd.cwd}&gt;</span>
              <span className="command">{cmd.command}</span>
            </div>
            {cmd.output.map((line, lineIndex) => (
              <div key={lineIndex} className="output-line">
                {line}
              </div>
            ))}
          </div>
        ))}
        {!showInputAtTop && (
          <div className="current-line">
            <span className="prompt">{cwd}&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="command-input"
              autoFocus
              disabled={isExecuting}
              placeholder=""
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CommandPrompt
