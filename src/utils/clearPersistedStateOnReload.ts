/**
 * Recycle bin / desktop simulation state is stored in localStorage so it survives
 * log off → log on (same tab, no document reload).
 *
 * A full page refresh (F5 / reload) should restore the original desktop, so we
 * clear that storage when the navigation type is "reload", before React reads it.
 */
const PERSISTED_DESKTOP_KEYS = ['recycleBinItems', 'permanentlyDeleted'] as const

/**
 * Detect full reload synchronously so localStorage is cleared before React's first render.
 * Legacy `performance.navigation` is still the most reliable for sync; Navigation Timing 2 as fallback.
 */
function isPageReload(): boolean {
  if (typeof performance === 'undefined') return false

  try {
    const legacy = (performance as unknown as { navigation?: { type: number } }).navigation
    if (legacy && typeof legacy.type === 'number') {
      // 1 = TYPE_RELOAD (deprecated API, widely synchronous)
      return legacy.type === 1
    }
  } catch {
    /* ignore */
  }

  const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
  return entries[0]?.type === 'reload'
}

export function clearPersistedDesktopStateOnReload(): void {
  if (typeof window === 'undefined') return

  try {
    if (!isPageReload()) return

    for (const key of PERSISTED_DESKTOP_KEYS) {
      localStorage.removeItem(key)
    }
  } catch {
    // ignore (private mode, quota, etc.)
  }
}
