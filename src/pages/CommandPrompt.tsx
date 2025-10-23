import React, { useState, useRef, useEffect } from 'react'

interface Command {
  command: string
  output: string[]
  timestamp: Date
}

function CommandPrompt() {
  const [commands, setCommands] = useState<Command[]>([
    {
      command: 'help',
      output: [
        'For more information on a specific command, type HELP command-name',
        'ASSOC          Displays or modifies file extension associations.',
        'ATTRIB         Displays or changes file attributes.',
        'BREAK          Sets or clears extended CTRL+C checking.',
        'BCDEDIT        Sets properties in boot database to control boot loading.',
        'CACLS          Displays or modifies access control lists (ACLs) of files.',
        'CALL           Calls one batch program from another.',
        'CD             Displays the name of or changes the current directory.',
        'CHCP           Displays or sets the active code page number.',
        'CHDIR          Displays the name of or changes the current directory.',
        'CHKDSK         Checks a disk and displays a status report.',
        'CHKNTFS        Displays or modifies the checking of disk at boot time.',
        'CLS            Clears the screen.',
        'CMD            Starts a new instance of the Windows command interpreter.',
        'COLOR          Sets the default console foreground and background colors.',
        'COMP           Compares the contents of two files or sets of files.',
        'COMPACT        Displays or alters the compression of files on NTFS partitions.',
        'COPY           Copies one or more files to another location.',
        'DATE           Displays or sets the date.',
        'DEL            Deletes one or more files.',
        'DIR            Displays a list of files and subdirectories in a directory.',
        'DISKPART       Displays or configures Disk Partition properties.',
        'DOSKEY         Edits command lines, recalls Windows commands, and creates macros.',
        'DRIVERQUERY    Displays current device driver status and properties.',
        'ECHO           Displays messages, or turns command echoing on or off.',
        'ENDLOCAL       Ends localization of environment changes in a batch file.',
        'ERASE          Deletes one or more files.',
        'EXIT           Quits the CMD.EXE program (command interpreter).',
        'FC             Compares two files or sets of files, and displays the differences between them.',
        'FIND           Searches for a text string in a file or files.',
        'FINDSTR        Searches for strings in files.',
        'FOR            Runs a specified command for each file in a set of files.',
        'FORMAT         Formats a disk for use with Windows.',
        'FSUTIL         Displays or configures the file system utilities.',
        'FTYPE          Displays or modifies file types used in file extension associations.',
        'GOTO           Directs the Windows command interpreter to a labeled line in a batch program.',
        'GPRESULT       Displays Group Policy information for machine or user.',
        'GRAFTABL       Enables Windows to display an extended character set in graphics mode.',
        'HELP           Provides Help information for Windows commands.',
        'ICACLS         Display, modify, backup, or restore ACLs for files and directories.',
        'IF             Performs conditional processing in batch programs.',
        'LABEL          Creates, changes, or deletes the volume label of a disk.',
        'MD             Creates a directory.',
        'MKDIR          Creates a directory.',
        'MODE           Configures a system device.',
        'MORE           Displays output one screen at a time.',
        'MOVE           Moves one or more files from one directory to another directory.',
        'OPENFILES      Displays files opened by remote users for a file share.',
        'PATH           Displays or sets a search path for executable files.',
        'PAUSE          Suspends processing of a batch file and displays a message.',
        'POPD           Restores the previous value of the current directory saved by PUSHD.',
        'PRINT          Prints a text file.',
        'PROMPT         Changes the Windows command prompt.',
        'PUSHD          Saves the current directory then changes it.',
        'RD             Removes a directory.',
        'RECOVER        Recovers readable information from a bad or defective disk.',
        'REM            Records comments (remarks) in batch files or CONFIG.SYS.',
        'REN            Renames a file or files.',
        'RENAME         Renames a file or files.',
        'REPLACE        Replaces files.',
        'RMDIR          Removes a directory.',
        'ROBOCOPY       Advanced utility to copy files and directory trees.',
        'SET            Displays, sets, or removes Windows environment variables.',
        'SETLOCAL       Begins localization of environment changes in a batch file.',
        'SC             Displays or configures services (background processes).',
        'SCHTASKS       Schedules commands and programs to run on a computer.',
        'SHIFT          Shifts the position of replaceable parameters in batch files.',
        'SHUTDOWN       Allows proper local or remote shutdown of machine.',
        'SORT           Sorts input.',
        'START          Starts a separate window to run a specified program or command.',
        'SUBST          Associates a path with a drive letter.',
        'SYSTEMINFO     Displays machine specific properties and configuration.',
        'TASKLIST       Displays all currently running tasks including services.',
        'TASKKILL       Kill or stop a running process or application.',
        'TIME           Displays or sets the system time.',
        'TITLE          Sets the window title for a CMD.EXE session.',
        'TREE           Graphically displays the directory structure of a drive or path.',
        'TYPE           Displays the contents of a text file.',
        'VER            Displays the Windows version.',
        'VOL            Displays a disk volume label and serial number.',
        'XCOPY          Copies files and directory trees.',
        '',
        'For more information on tools see the online Help.'
      ],
      timestamp: new Date()
    }
  ])
  const [currentCommand, setCurrentCommand] = useState('')
  const [currentPath] = useState('C:\\Users\\Bradley>')
  const [isExecuting, setIsExecuting] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [commands])

  const executeCommand = (command: string) => {
    if (!command.trim()) return

    const cmd = command.trim().toLowerCase()
    let output: string[] = []

    switch (cmd) {
      case 'help':
        output = [
          'For more information on a specific command, type HELP command-name',
          'ASSOC          Displays or modifies file extension associations.',
          'ATTRIB         Displays or changes file attributes.',
          'BREAK          Sets or clears extended CTRL+C checking.',
          'BCDEDIT        Sets properties in boot database to control boot loading.',
          'CACLS          Displays or modifies access control lists (ACLs) of files.',
          'CALL           Calls one batch program from another.',
          'CD             Displays the name of or changes the current directory.',
          'CHCP           Displays or sets the active code page number.',
          'CHDIR          Displays the name of or changes the current directory.',
          'CHKDSK         Checks a disk and displays a status report.',
          'CHKNTFS        Displays or modifies the checking of disk at boot time.',
          'CLS            Clears the screen.',
          'CMD            Starts a new instance of the Windows command interpreter.',
          'COLOR          Sets the default console foreground and background colors.',
          'COMP           Compares the contents of two files or sets of files.',
          'COMPACT        Displays or alters the compression of files on NTFS partitions.',
          'COPY           Copies one or more files to another location.',
          'DATE           Displays or sets the date.',
          'DEL            Deletes one or more files.',
          'DIR            Displays a list of files and subdirectories in a directory.',
          'DISKPART       Displays or configures Disk Partition properties.',
          'DOSKEY         Edits command lines, recalls Windows commands, and creates macros.',
          'DRIVERQUERY    Displays current device driver status and properties.',
          'ECHO           Displays messages, or turns command echoing on or off.',
          'ENDLOCAL       Ends localization of environment changes in a batch file.',
          'ERASE          Deletes one or more files.',
          'EXIT           Quits the CMD.EXE program (command interpreter).',
          'FC             Compares two files or sets of files, and displays the differences between them.',
          'FIND           Searches for a text string in a file or files.',
          'FINDSTR        Searches for strings in files.',
          'FOR            Runs a specified command for each file in a set of files.',
          'FORMAT         Formats a disk for use with Windows.',
          'FSUTIL         Displays or configures the file system utilities.',
          'FTYPE          Displays or modifies file types used in file extension associations.',
          'GOTO           Directs the Windows command interpreter to a labeled line in a batch program.',
          'GPRESULT       Displays Group Policy information for machine or user.',
          'GRAFTABL       Enables Windows to display an extended character set in graphics mode.',
          'HELP           Provides Help information for Windows commands.',
          'ICACLS         Display, modify, backup, or restore ACLs for files and directories.',
          'IF             Performs conditional processing in batch programs.',
          'LABEL          Creates, changes, or deletes the volume label of a disk.',
          'MD             Creates a directory.',
          'MKDIR          Creates a directory.',
          'MODE           Configures a system device.',
          'MORE           Displays output one screen at a time.',
          'MOVE           Moves one or more files from one directory to another directory.',
          'OPENFILES      Displays files opened by remote users for a file share.',
          'PATH           Displays or sets a search path for executable files.',
          'PAUSE          Suspends processing of a batch file and displays a message.',
          'POPD           Restores the previous value of the current directory saved by PUSHD.',
          'PRINT          Prints a text file.',
          'PROMPT         Changes the Windows command prompt.',
          'PUSHD          Saves the current directory then changes it.',
          'RD             Removes a directory.',
          'RECOVER        Recovers readable information from a bad or defective disk.',
          'REM            Records comments (remarks) in batch files or CONFIG.SYS.',
          'REN            Renames a file or files.',
          'RENAME         Renames a file or files.',
          'REPLACE        Replaces files.',
          'RMDIR          Removes a directory.',
          'ROBOCOPY       Advanced utility to copy files and directory trees.',
          'SET            Displays, sets, or removes Windows environment variables.',
          'SETLOCAL       Begins localization of environment changes in a batch file.',
          'SC             Displays or configures services (background processes).',
          'SCHTASKS       Schedules commands and programs to run on a computer.',
          'SHIFT          Shifts the position of replaceable parameters in batch files.',
          'SHUTDOWN       Allows proper local or remote shutdown of machine.',
          'SORT           Sorts input.',
          'START          Starts a separate window to run a specified program or command.',
          'SUBST          Associates a path with a drive letter.',
          'SYSTEMINFO     Displays machine specific properties and configuration.',
          'TASKLIST       Displays all currently running tasks including services.',
          'TASKKILL       Kill or stop a running process or application.',
          'TIME           Displays or sets the system time.',
          'TITLE          Sets the window title for a CMD.EXE session.',
          'TREE           Graphically displays the directory structure of a drive or path.',
          'TYPE           Displays the contents of a text file.',
          'VER            Displays the Windows version.',
          'VOL            Displays a disk volume label and serial number.',
          'XCOPY          Copies files and directory trees.',
          '',
          'For more information on tools see the online Help.'
        ]
        break
      case 'cls':
        setCommands([])
        return
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
      case 'dir':
        output = [
          ' Volume in drive C has no label.',
          ' Volume Serial Number is 1234-5678',
          '',
          ' Directory of C:\\Users\\Bradley',
          '',
          '12/25/2023  10:30 AM    <DIR>          Documents',
          '12/25/2023  10:30 AM    <DIR>          Desktop',
          '12/25/2023  10:30 AM    <DIR>          Downloads',
          '12/25/2023  10:30 AM    <DIR>          Pictures',
          '12/25/2023  10:30 AM    <DIR>          Music',
          '12/25/2023  10:30 AM    <DIR>          Videos',
          '12/25/2023  10:30 AM             1,024  readme.txt',
          '12/25/2023  10:30 AM             2,048  notes.doc',
          '               2 File(s)          3,072 bytes',
          '               6 Dir(s)   1,000,000,000 bytes free'
        ]
        break
      case 'echo':
        const echoText = command.substring(5).trim()
        output = [echoText]
        break
      case 'whoami':
        output = ['Bradley\\Bradley']
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
      default:
        output = [`'${command}' is not recognized as an internal or external command, operable program or batch file.`]
    }

    setCommands(prev => [...prev, {
      command,
      output,
      timestamp: new Date()
    }])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
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

  return (
    <div className="command-prompt">
      <div className="terminal-content" ref={terminalRef}>
        {commands.map((cmd, index) => (
          <div key={index} className="command-block">
            <div className="command-line">
              <span className="prompt">{currentPath}</span>
              <span className="command">{cmd.command}</span>
            </div>
            {cmd.output.map((line, lineIndex) => (
              <div key={lineIndex} className="output-line">
                {line}
              </div>
            ))}
          </div>
        ))}
        <div className="current-line">
          <span className="prompt">{currentPath}</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="command-input"
            autoFocus
            disabled={isExecuting}
          />
        </div>
      </div>
    </div>
  )
}

export default CommandPrompt
