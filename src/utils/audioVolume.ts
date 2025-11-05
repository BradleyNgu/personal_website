// Global audio volume manager
let globalVolume = 30 // Default volume (0-100) - Lowered for better user experience
const activeAudioElements = new Set<HTMLAudioElement>()

export const AudioVolumeManager = {
  // Get current volume (0-100)
  getVolume(): number {
    return globalVolume
  },

  // Set volume (0-100)
  setVolume(volume: number): void {
    globalVolume = Math.max(0, Math.min(100, volume))
    const volumeNormalized = globalVolume / 100
    
    // Update all active audio elements
    activeAudioElements.forEach(audio => {
      audio.volume = volumeNormalized
    })
    
    // Dispatch event for components that might need it
    window.dispatchEvent(new CustomEvent('volumechange', { 
      detail: { volume: globalVolume } 
    }))
  },

  // Register an audio element to be controlled by the volume manager
  registerAudio(audio: HTMLAudioElement): void {
    activeAudioElements.add(audio)
    // Set initial volume
    audio.volume = globalVolume / 100
  },

  // Unregister an audio element
  unregisterAudio(audio: HTMLAudioElement): void {
    activeAudioElements.delete(audio)
  },

  // Apply current volume to an audio element (for new audio elements)
  applyVolume(audio: HTMLAudioElement): void {
    audio.volume = globalVolume / 100
  }
}

// Listen for volume changes and update any audio elements created after registration
window.addEventListener('volumechange', (e: Event) => {
  const customEvent = e as CustomEvent
  const volume = customEvent.detail.volume / 100
  activeAudioElements.forEach(audio => {
    audio.volume = volume
  })
})

