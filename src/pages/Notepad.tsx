import { useState, useRef, useEffect, useContext, useCallback } from 'react'
import { WindowInstanceContext, PORTFOLIO_WINDOW_MENU_EVENT } from '../components/Window'
import { TIRAMISU_FILENAME, TIRAMISU_RECIPE } from '../data/tiramisuRecipe'
import '../styles/notepad.css'

type OpenMenu = 'File' | 'Edit' | 'Format' | 'View' | 'Help' | null

function Notepad() {
  const { windowId } = useContext(WindowInstanceContext)
  const [content, setContent] = useState(TIRAMISU_RECIPE)
  const [fileName, setFileName] = useState(TIRAMISU_FILENAME)
  const [isDirty, setIsDirty] = useState(false)
  const [wordWrap, setWordWrap] = useState(true)
  const [statusBarVisible, setStatusBarVisible] = useState(true)
  const [fontSize, setFontSize] = useState(14)
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null)
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 })

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const menuBarRef = useRef<HTMLDivElement>(null)

  const updateCursorPos = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    const before = el.value.slice(0, el.selectionStart)
    const lines = before.split('\n')
    setCursorPos({ line: lines.length, col: (lines[lines.length - 1]?.length ?? 0) + 1 })
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNew = useCallback(() => {
    if (isDirty && !window.confirm('Discard unsaved changes?')) {
      setOpenMenu(null)
      return
    }
    setContent(TIRAMISU_RECIPE)
    setFileName(TIRAMISU_FILENAME)
    setIsDirty(false)
    setOpenMenu(null)
    setTimeout(() => textareaRef.current?.focus(), 0)
  }, [isDirty])

  const handleOpenClick = () => {
    setOpenMenu(null)
    fileInputRef.current?.click()
  }

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setContent(String(reader.result ?? ''))
      setFileName(file.name)
      setIsDirty(false)
      setTimeout(() => {
        textareaRef.current?.focus()
        updateCursorPos()
      }, 0)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleSave = useCallback(() => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const name = fileName.toLowerCase().endsWith('.txt') ? fileName : `${fileName}.txt`
    link.href = url
    link.download = name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setFileName(name)
    setIsDirty(false)
    setOpenMenu(null)
  }, [content, fileName])

  const handleExit = () => {
    setOpenMenu(null)
    if (isDirty && !window.confirm('Discard unsaved changes?')) return
    if (windowId) {
      document.dispatchEvent(
        new CustomEvent(PORTFOLIO_WINDOW_MENU_EVENT, { detail: { windowId, action: 'Exit' } })
      )
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return
      const key = e.key.toLowerCase()
      if (key === 's') {
        e.preventDefault()
        handleSave()
      } else if (key === 'n') {
        e.preventDefault()
        handleNew()
      } else if (key === 'o') {
        e.preventDefault()
        fileInputRef.current?.click()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleSave, handleNew])

  const runEditCommand = (command: string) => {
    textareaRef.current?.focus()
    try {
      document.execCommand(command)
    } catch {
      /* ignore */
    }
    setOpenMenu(null)
  }

  const handleSelectAll = () => {
    const el = textareaRef.current
    if (!el) return
    el.focus()
    el.select()
    updateCursorPos()
    setOpenMenu(null)
  }

  return (
    <div className="notepad">
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,text/plain"
        className="notepad-file-input"
        onChange={handleFileSelected}
      />

      <div className="window-menu-bar" ref={menuBarRef}>
        {(['File', 'Edit', 'Format', 'View', 'Help'] as const).map((menu) => (
          <div key={menu} className="menu-item-wrapper">
            <span
              className={`menu-item ${openMenu === menu ? 'active' : ''}`}
              onClick={() => setOpenMenu(openMenu === menu ? null : menu)}
              onMouseEnter={() => {
                if (openMenu) setOpenMenu(menu)
              }}
            >
              {menu}
            </span>
            {openMenu === menu && (
              <div className="menu-dropdown">
                {menu === 'File' && (
                  <>
                    <div className="menu-dropdown-item" onClick={handleNew}>
                      New<span className="notepad-shortcut">Ctrl+N</span>
                    </div>
                    <div className="menu-dropdown-item" onClick={handleOpenClick}>
                      Open...<span className="notepad-shortcut">Ctrl+O</span>
                    </div>
                    <div className="menu-dropdown-item" onClick={handleSave}>
                      Save<span className="notepad-shortcut">Ctrl+S</span>
                    </div>
                    <div className="menu-dropdown-separator" />
                    <div className="menu-dropdown-item" onClick={handleExit}>
                      Exit
                    </div>
                  </>
                )}
                {menu === 'Edit' && (
                  <>
                    <div className="menu-dropdown-item" onClick={() => runEditCommand('undo')}>
                      Undo<span className="notepad-shortcut">Ctrl+Z</span>
                    </div>
                    <div className="menu-dropdown-separator" />
                    <div className="menu-dropdown-item" onClick={() => runEditCommand('cut')}>
                      Cut<span className="notepad-shortcut">Ctrl+X</span>
                    </div>
                    <div className="menu-dropdown-item" onClick={() => runEditCommand('copy')}>
                      Copy<span className="notepad-shortcut">Ctrl+C</span>
                    </div>
                    <div className="menu-dropdown-item" onClick={() => runEditCommand('paste')}>
                      Paste<span className="notepad-shortcut">Ctrl+V</span>
                    </div>
                    <div className="menu-dropdown-item" onClick={() => runEditCommand('delete')}>
                      Delete<span className="notepad-shortcut">Del</span>
                    </div>
                    <div className="menu-dropdown-separator" />
                    <div className="menu-dropdown-item" onClick={handleSelectAll}>
                      Select All<span className="notepad-shortcut">Ctrl+A</span>
                    </div>
                  </>
                )}
                {menu === 'Format' && (
                  <>
                    <div
                      className={`menu-dropdown-item ${wordWrap ? 'notepad-checked' : ''}`}
                      onClick={() => {
                        setWordWrap(v => !v)
                        setOpenMenu(null)
                      }}
                    >
                      Word Wrap
                    </div>
                    <div className="menu-dropdown-separator" />
                    <div
                      className="menu-dropdown-item"
                      onClick={() => {
                        setFontSize(12)
                        setOpenMenu(null)
                      }}
                    >
                      Font: Small
                    </div>
                    <div
                      className="menu-dropdown-item"
                      onClick={() => {
                        setFontSize(14)
                        setOpenMenu(null)
                      }}
                    >
                      Font: Medium
                    </div>
                    <div
                      className="menu-dropdown-item"
                      onClick={() => {
                        setFontSize(18)
                        setOpenMenu(null)
                      }}
                    >
                      Font: Large
                    </div>
                  </>
                )}
                {menu === 'View' && (
                  <div
                    className={`menu-dropdown-item ${statusBarVisible ? 'notepad-checked' : ''}`}
                    onClick={() => {
                      setStatusBarVisible(v => !v)
                      setOpenMenu(null)
                    }}
                  >
                    Status Bar
                  </div>
                )}
                {menu === 'Help' && (
                  <div
                    className="menu-dropdown-item"
                    onClick={() => {
                      window.alert('Notepad\n\nA simple text editor for this Windows XP portfolio.\n\nBradley Nguyen')
                      setOpenMenu(null)
                    }}
                  >
                    About Notepad
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        className={`notepad-textarea ${wordWrap ? 'wrap' : 'no-wrap'}`}
        value={content}
        spellCheck={false}
        style={{ fontSize: `${fontSize}px` }}
        placeholder=""
        onChange={(e) => {
          setContent(e.target.value)
          setIsDirty(true)
        }}
        onClick={updateCursorPos}
        onKeyUp={updateCursorPos}
        onSelect={updateCursorPos}
      />

      {statusBarVisible && (
        <div className="notepad-status-bar">
          <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
          <span>{content.length} character{content.length === 1 ? '' : 's'}</span>
        </div>
      )}
    </div>
  )
}

export default Notepad
