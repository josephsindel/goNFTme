/**
 * Storage management utilities for handling localStorage quota
 */

/**
 * Get current localStorage usage in bytes
 */
export function getStorageUsage(): number {
  if (typeof window === 'undefined') return 0
  
  let total = 0
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length
    }
  }
  return total
}

/**
 * Get available localStorage space in bytes
 */
export function getAvailableStorage(): number {
  const maxStorage = 5 * 1024 * 1024 // 5MB typical limit
  return maxStorage - getStorageUsage()
}

/**
 * Clear old uploaded images to free up space
 */
export function clearOldImages(keepCount: number = 5): number {
  if (typeof window === 'undefined') return 0
  
  const keys = Object.keys(localStorage)
  const imageKeys = keys.filter(key => key.startsWith('image-user-upload-'))
  
  if (imageKeys.length <= keepCount) return 0
  
  // Sort by timestamp (oldest first) and remove excess
  const toRemove = imageKeys.toSorted((a, b) => a.localeCompare(b)).slice(0, imageKeys.length - keepCount)
  
  toRemove.forEach(key => {
    localStorage.removeItem(key)
  })
  
  return toRemove.length
}

/**
 * Format storage size for display
 */
export function formatStorageSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Check if there's enough space for a file
 */
export function hasSpaceForFile(file: File): boolean {
  const estimatedSize = file.size * 1.37 // Base64 encoding overhead
  return getAvailableStorage() > estimatedSize
}

/**
 * Get storage status for debugging
 */
export function getStorageStatus() {
  const usage = getStorageUsage()
  const available = getAvailableStorage()
  const total = usage + available
  
  return {
    usage,
    available,
    total,
    usagePercent: Math.round((usage / total) * 100),
    formattedUsage: formatStorageSize(usage),
    formattedAvailable: formatStorageSize(available),
    formattedTotal: formatStorageSize(total)
  }
}
