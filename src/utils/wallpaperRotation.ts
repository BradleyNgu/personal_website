/**
 * Gets the current wallpaper based on weekly rotation
 * Cycles through wallpaper.jpg, wallpaper2.png, and wallpaper3.png
 * Changes every week (7 days)
 */
export function getCurrentWallpaper(): string {
  const wallpapers = [
    '/assets/wallpaper.jpg',
    '/assets/wallpaper2.png',
    '/assets/wallpaper3.png'
  ]
  
  // Get the current date
  const now = new Date()
  
  // Calculate weeks since a fixed reference date (January 1, 2024)
  // This ensures consistent rotation regardless of year
  const referenceDate = new Date(2024, 0, 1) // January 1, 2024
  const timeDiff = now.getTime() - referenceDate.getTime()
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const weekNumber = Math.floor(daysDiff)
  
  // Cycle through wallpapers based on week number
  const wallpaperIndex = weekNumber % wallpapers.length
  
  return wallpapers[wallpaperIndex]
}

