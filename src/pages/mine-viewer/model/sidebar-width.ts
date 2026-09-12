const STORAGE_KEY = 'mine-explorer.sidebar-width'
const DEFAULT_WIDTH = 360

export const MIN_SIDEBAR_WIDTH = 260
export const MAX_SIDEBAR_WIDTH = 640

export const readSidebarWidth = () => {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? 'null'
    )

    if (typeof stored === 'number' && Number.isFinite(stored) && stored > 0) {
      return Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, stored))
    }
  } catch {
    // Invalid or unavailable storage must not prevent the page from opening.
  }

  return DEFAULT_WIDTH
}

export const saveSidebarWidth = (width: number) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(width))
  } catch {
    // Resizing still works for this session when storage is unavailable.
  }
}
