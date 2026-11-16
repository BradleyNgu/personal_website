import { TIRAMISU_FILENAME, TIRAMISU_RECIPE } from '../data/tiramisuRecipe'

export const NOTEPAD_STORAGE_KEY = 'notepadDocument'

export type NotepadPersistedState = {
  content: string
  fileName: string
  wordWrap: boolean
  statusBarVisible: boolean
  fontSize: number
}

export const DEFAULT_NOTEPAD_STATE: NotepadPersistedState = {
  content: TIRAMISU_RECIPE,
  fileName: TIRAMISU_FILENAME,
  wordWrap: true,
  statusBarVisible: true,
  fontSize: 14,
}

export function loadNotepadState(): NotepadPersistedState {
  try {
    const raw = localStorage.getItem(NOTEPAD_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_NOTEPAD_STATE }

    const parsed = JSON.parse(raw) as Partial<NotepadPersistedState>
    return {
      content: typeof parsed.content === 'string' ? parsed.content : DEFAULT_NOTEPAD_STATE.content,
      fileName: typeof parsed.fileName === 'string' && parsed.fileName.trim()
        ? parsed.fileName
        : DEFAULT_NOTEPAD_STATE.fileName,
      wordWrap: typeof parsed.wordWrap === 'boolean' ? parsed.wordWrap : DEFAULT_NOTEPAD_STATE.wordWrap,
      statusBarVisible:
        typeof parsed.statusBarVisible === 'boolean'
          ? parsed.statusBarVisible
          : DEFAULT_NOTEPAD_STATE.statusBarVisible,
      fontSize:
        typeof parsed.fontSize === 'number' && parsed.fontSize > 0
          ? parsed.fontSize
          : DEFAULT_NOTEPAD_STATE.fontSize,
    }
  } catch {
    return { ...DEFAULT_NOTEPAD_STATE }
  }
}

export function saveNotepadState(state: NotepadPersistedState): void {
  try {
    localStorage.setItem(NOTEPAD_STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* private mode / quota */
  }
}

/** Content lines for virtual CMD `type tiramisu.txt` (uses saved notepad when present). */
export function getPersistedNotepadLines(): string[] {
  return loadNotepadState().content.split('\n')
}
