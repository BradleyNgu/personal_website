/** Virtual Windows-style paths for Command Prompt (matches site apps / desktop). */

export type FsEntry = { name: string; isDir: boolean; size?: number }

const DESKTOP_DATE = '04/17/2026  10:30 AM'

export const INITIAL_CWD = 'C:\\Users\\Bradley'

/** Every navigable directory path (keys use this exact casing). */
export const VIRTUAL_FS: Record<string, FsEntry[]> = {
  'C:\\': [{ name: 'Users', isDir: true }],
  'C:\\Users': [{ name: 'Bradley', isDir: true }],
  'C:\\Users\\Bradley': [
    { name: 'Desktop', isDir: true },
    { name: 'Documents', isDir: true },
    { name: 'Downloads', isDir: true },
    { name: 'Start Menu', isDir: true },
  ],
  'C:\\Users\\Bradley\\Desktop': [
    { name: 'My Projects.lnk', isDir: false, size: 892 },
    { name: 'My Experience.lnk', isDir: false, size: 904 },
    { name: 'About Me.lnk', isDir: false, size: 768 },
    { name: 'My Resume.lnk', isDir: false, size: 1_024 },
    { name: 'Recycle Bin.lnk', isDir: false, size: 512 },
    { name: 'readme.txt', isDir: false, size: 1_024 },
  ],
  'C:\\Users\\Bradley\\Documents': [],
  'C:\\Users\\Bradley\\Downloads': [],
  'C:\\Users\\Bradley\\Start Menu': [{ name: 'Programs', isDir: true }],
  'C:\\Users\\Bradley\\Start Menu\\Programs': [
    { name: 'My Projects.lnk', isDir: false, size: 892 },
    { name: 'My Experience.lnk', isDir: false, size: 904 },
    { name: 'Email.lnk', isDir: false, size: 640 },
    { name: 'Internet Explorer.lnk', isDir: false, size: 720 },
    { name: 'Command Prompt.lnk', isDir: false, size: 580 },
    { name: 'My Pictures.lnk', isDir: false, size: 688 },
    { name: 'My Music.lnk', isDir: false, size: 672 },
    { name: 'My Resume.lnk', isDir: false, size: 1_024 },
    { name: 'About Me.lnk', isDir: false, size: 768 },
    { name: 'Search.lnk', isDir: false, size: 596 },
    { name: 'Run.lnk', isDir: false, size: 448 },
  ],
}

export const VIRTUAL_FILE_TEXT: Record<string, string[]> = {
  'C:\\Users\\Bradley\\Desktop\\readme.txt': [
    'README.TXT',
    'Welcome to Bradley\'s Portfolio!',
    '',
    'This is a fully interactive Windows XP themed portfolio',
    'website built with React and TypeScript.',
    '',
    'Features:',
    '  * Draggable and resizable windows',
    '  * Desktop icons with double-click functionality',
    '  * Working command prompt with custom commands',
    '  * Taskbar with window management',
    '  * Start menu with applications',
    '  * Recycle bin functionality',
    '  * Fully responsive design',
    '',
    'Try exploring different applications on the desktop!',
    '',
    'Type "help" for a list of available commands.',
    '',
  ],
}

export function normalizeFsPath(path: string): string {
  let p = path.trim().replace(/\//g, '\\')
  if (p.startsWith('"') && p.endsWith('"')) {
    p = p.slice(1, -1).trim()
  }
  const parts = p.split('\\').filter((s) => s.length > 0)
  if (parts.length === 0) return ''
  const drive = parts[0].endsWith(':') ? parts[0].toUpperCase() : parts[0]
  if (parts.length === 1 && drive.endsWith(':')) {
    return `${drive}\\`
  }
  const rest = parts.slice(1)
  return [drive, ...rest].join('\\')
}

export function fsKey(path: string): string | null {
  const n = normalizeFsPath(path)
  if (n in VIRTUAL_FS) return n
  const lower = n.toLowerCase()
  for (const k of Object.keys(VIRTUAL_FS)) {
    if (k.toLowerCase() === lower) return k
  }
  return null
}

export function isVirtualDir(path: string): boolean {
  return fsKey(path) !== null
}

/** Resolve `target` against `current` (handles .., ., drive-relative). */
export function resolveVirtualPath(current: string, target: string): string | null {
  let t = target.trim().replace(/\//g, '\\')
  if (t.startsWith('"') && t.endsWith('"')) {
    t = t.slice(1, -1).trim()
  }
  if (!t) return normalizeFsPath(current)

  const currentKey = fsKey(current)
  if (!currentKey) return null

  if (/^[a-zA-Z]:$/.test(t)) {
    return normalizeFsPath(`${t}\\`)
  }
  if (/^[a-zA-Z]:\\/.test(t)) {
    return normalizeFsPath(t)
  }
  if (t.startsWith('\\')) {
    const drive = currentKey.slice(0, 2)
    return normalizeFsPath(drive + t)
  }

  let segments = currentKey.split('\\').filter(Boolean)
  const pieces = t.split('\\').filter((s) => s.length > 0)
  for (const piece of pieces) {
    if (piece === '.') continue
    if (piece === '..') {
      if (segments.length <= 1) return null
      segments = segments.slice(0, -1)
    } else {
      segments = [...segments, piece]
    }
  }
  return segments.join('\\')
}

export function formatDirListing(absolutePath: string): string[] | null {
  const key = fsKey(absolutePath)
  if (!key) return null

  const entries = VIRTUAL_FS[key]
  const lines: string[] = [
    ' Volume in drive C has no label.',
    ' Volume Serial Number is 1234-5678',
    '',
    ` Directory of ${key}`,
    '',
  ]

  const dated = (isDir: boolean, name: string, size?: number) => {
    if (isDir) {
      return `${DESKTOP_DATE}    <DIR>          ${name}`
    }
    const n = (size ?? 0).toLocaleString('en-US')
    return `${DESKTOP_DATE}  ${n.padStart(17)}  ${name}`
  }

  lines.push(dated(true, '.'))
  lines.push(dated(true, '..'))
  for (const e of entries) {
    lines.push(dated(e.isDir, e.name, e.isDir ? undefined : e.size))
  }

  const fileCount = entries.filter((e) => !e.isDir).length
  const dirCount = entries.filter((e) => e.isDir).length + 2
  const totalBytes = entries.filter((e) => !e.isDir).reduce((a, e) => a + (e.size ?? 0), 0)
  lines.push(`               ${fileCount} File(s)${' '.repeat(Math.max(0, 10 - String(totalBytes).length))}${totalBytes.toLocaleString()} bytes`)
  lines.push(`               ${dirCount} Dir(s)   1,000,000,000 bytes free`)

  return lines
}

/** ASCII tree of virtual FS under `C:\\Users\\Bradley` (directories only). */
export function formatVirtualTree(): string[] {
  const rootKey = fsKey('C:\\Users\\Bradley')
  if (!rootKey) return []
  const out: string[] = ['Folder PATH listing', 'Volume serial number is 1234-5678', '', rootKey]

  const walk = (dirKey: string, linePrefix: string) => {
    const dirs = VIRTUAL_FS[dirKey]
      .filter((e) => e.isDir)
      .sort((a, b) => a.name.localeCompare(b.name))
    dirs.forEach((d, i) => {
      const isLast = i === dirs.length - 1
      const branch = isLast ? '\u2514\u2500\u2500\u2500' : '\u251c\u2500\u2500\u2500'
      out.push(`${linePrefix}${branch}${d.name}`)
      const childKey = `${dirKey}\\${d.name}`
      if (fsKey(childKey) && VIRTUAL_FS[fsKey(childKey)!].some((e) => e.isDir)) {
        walk(fsKey(childKey)!, linePrefix + (isLast ? '    ' : '\u2502   '))
      }
    })
  }

  walk(rootKey, '')
  return out
}

export function resolveFilePath(cwd: string, fileArg: string): string | null {
  let f = fileArg.trim().replace(/\//g, '\\')
  if (f.startsWith('"') && f.endsWith('"')) f = f.slice(1, -1).trim()
  if (!f) return null
  const resolved = resolveVirtualPath(cwd, f)
  if (!resolved) return null
  const key = fsKey(resolved)
  if (key && key in VIRTUAL_FS) return null
  const parent = resolved.includes('\\') ? resolved.slice(0, resolved.lastIndexOf('\\')) : ''
  const base = resolved.includes('\\') ? resolved.slice(resolved.lastIndexOf('\\') + 1) : resolved
  const parentKey = fsKey(parent)
  if (!parentKey) return null
  const match = VIRTUAL_FS[parentKey].find((e) => !e.isDir && e.name.toLowerCase() === base.toLowerCase())
  if (!match) return null
  return `${parentKey}\\${match.name}`
}

const PATH_COMMANDS = new Set(['cd', 'chdir', 'dir', 'type'])

/** Single-word commands the prompt recognizes (for Tab completion). */
export const COMPLETABLE_COMMANDS = [
  'brew',
  'cd',
  'chdir',
  'cls',
  'coffee',
  'contact',
  'date',
  'dir',
  'echo',
  'edu',
  'education',
  'help',
  'hostname',
  'ipconfig',
  'joke',
  'links',
  'netstat',
  'ping',
  'secret',
  'social',
  'starwars',
  'systeminfo',
  'tasklist',
  'time',
  'tree',
  'type',
  'ver',
  'whoami',
].sort((a, b) => a.localeCompare(b))

function longestCommonPrefixNames(names: string[]): string {
  if (names.length === 0) return ''
  const lower = names.map((s) => s.toLowerCase())
  let i = 0
  const first = lower[0]
  while (i < first.length) {
    const c = first[i]
    if (!lower.every((s) => i < s.length && s[i] === c)) break
    i++
  }
  return names[0].slice(0, i)
}

/**
 * Tab completion for the virtual CMD: first token completes known commands;
 * after cd/chdir/dir/type, completes file and folder names under cwd (or under a relative path prefix).
 */
export function tabComplete(line: string, cursor: number, cwd: string): { line: string; cursor: number } | null {
  const before = line.slice(0, cursor)
  const after = line.slice(cursor)

  const lead = before.match(/^\s*/)
  const i0 = lead ? lead[0].length : 0
  const tail = before.slice(i0)
  const sp = tail.indexOf(' ')

  if (sp === -1) {
    const prefix = tail
    if (!prefix) return null
    const cand = COMPLETABLE_COMMANDS.filter((c) => c.toLowerCase().startsWith(prefix.toLowerCase()))
    if (cand.length === 0) return null
    if (cand.length === 1 && cand[0].toLowerCase() === prefix.toLowerCase()) {
      const next = line.slice(0, i0) + cand[0] + ' ' + after
      return { line: next, cursor: i0 + cand[0].length + 1 }
    }
    const lcp = longestCommonPrefixNames(cand)
    if (lcp.length <= prefix.length) return null
    const next = line.slice(0, i0) + lcp + after
    return { line: next, cursor: i0 + lcp.length }
  }

  const cmd = tail.slice(0, sp).toLowerCase()
  if (!PATH_COMMANDS.has(cmd)) return null

  const afterFirstSpace = before.slice(i0 + sp + 1)
  const argLead = afterFirstSpace.match(/^\s*/)
  const argStartInLine = i0 + sp + 1 + (argLead ? argLead[0].length : 0)
  const argPart = before.slice(argStartInLine)
  if (argPart.length === 0) return null

  const ix = Math.max(argPart.lastIndexOf('\\'), argPart.lastIndexOf('/'))
  const rel = ix >= 0 ? argPart.slice(0, ix) : ''
  const partial = ix >= 0 ? argPart.slice(ix + 1) : argPart
  if (!partial) return null

  const parentResolved = rel ? resolveVirtualPath(cwd, rel) : cwd
  const parentKey = parentResolved ? fsKey(parentResolved) : null
  if (!parentKey || !VIRTUAL_FS[parentKey]) return null

  const matches = VIRTUAL_FS[parentKey].filter((e) => e.name.toLowerCase().startsWith(partial.toLowerCase()))
  if (matches.length === 0) return null

  const replaceStart = before.length - partial.length
  const addSlash = (cmd === 'cd' || cmd === 'chdir') && matches.length === 1 && matches[0].isDir

  if (matches.length === 1) {
    const name = matches[0].name
    const insert = name + (addSlash ? '\\' : '')
    const next = line.slice(0, replaceStart) + insert + after
    return { line: next, cursor: replaceStart + insert.length }
  }

  const names = matches.map((m) => m.name)
  const lcp = longestCommonPrefixNames(names)
  if (lcp.length <= partial.length) return null
  const next = line.slice(0, replaceStart) + lcp + after
  return { line: next, cursor: replaceStart + lcp.length }
}
