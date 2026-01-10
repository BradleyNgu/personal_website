import { useState, useRef, useEffect } from 'react'
import { AudioVolumeManager } from '../utils/audioVolume'
import '../styles/internet-explorer.css'

// YouTube IFrame API types
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

interface InternetExplorerProps {
  onClose?: () => void
}

function InternetExplorer({ }: InternetExplorerProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<any>(null)
  const youtubeAPILoadedRef = useRef(false)
  const volumeToApplyRef = useRef<number | null>(null)

  // YouTube playlist videos using the provided links in correct order
  const playlistVideos = [
    {
      id: 'yIoVqAdDfVA',
      title: 'Hack The Hill 2 Demo',
      url: 'https://www.youtube.com/watch?v=yIoVqAdDfVA'
    },
    {
      id: 'EWgPZXef9b4',
      title: 'cuHacking 6 Dumpster Diver',
      url: 'https://www.youtube.com/watch?v=EWgPZXef9b4'
    },
    {
      id: '86Ogicxxqpk',
      title: 'COMP3004 - Elevator Simulator - zenics',
      url: 'https://www.youtube.com/watch?v=86Ogicxxqpk&t=1s'
    },
    {
      id: 'aARcW3aMKM0',
      title: '3004 Final - Team Two - Shane Bateman',
      url: 'https://www.youtube.com/watch?v=aARcW3aMKM0'
    },
    {
      id: 'OHxGY2OEQ0k',
      title: 'Meido-chan Demo',
      url: 'https://www.youtube.com/watch?v=OHxGY2OEQ0k'
    },
    {
      id: 'JyTwrIHdYjk',
      title: 'COMP3005 Final Project Bradley Daniel Torrey',
      url: 'https://www.youtube.com/watch?v=JyTwrIHdYjk'
    }
  ]

  // Get current video embed URL (using enablejsapi=1 for IFrame API)
  // Only use this for initial load - once player is initialized, use API methods
  const getCurrentVideoEmbedUrl = () => {
    const currentVideo = playlistVideos[currentVideoIndex]
    if (currentVideo) {
      // enablejsapi=1 is required for YouTube IFrame API to work
      return `https://www.youtube.com/embed/${currentVideo.id}?enablejsapi=1&autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1&iv_load_policy=3&fs=1&cc_load_policy=0&origin=${window.location.origin}`
    }
    return ''
  }
  
  // Get current video title
  const getCurrentVideoTitle = () => {
    const currentVideo = playlistVideos[currentVideoIndex]
    return currentVideo ? currentVideo.title : 'Unknown Video'
  }

  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setIsLoading(true)
      setCurrentVideoIndex(currentVideoIndex - 1)
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }

  const handleNextVideo = () => {
    if (currentVideoIndex < playlistVideos.length - 1) {
      setIsLoading(true)
      setCurrentVideoIndex(currentVideoIndex + 1)
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }
  
  // Load YouTube IFrame API
  useEffect(() => {
    if (youtubeAPILoadedRef.current) return

    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      youtubeAPILoadedRef.current = true
      // Wait a bit for iframe to be ready
      setTimeout(() => {
        initializePlayer()
      }, 500)
      return
    }

    // Load the IFrame API script
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // Set up callback for when API is ready
    window.onYouTubeIframeAPIReady = () => {
      youtubeAPILoadedRef.current = true
      console.log('YouTube IFrame API ready')
      // Wait a bit for iframe to be ready
      setTimeout(() => {
        initializePlayer()
      }, 500)
    }
  }, [])

  // Initialize YouTube player when iframe is ready
  const initializePlayer = () => {
    if (!iframeRef.current || !window.YT || !window.YT.Player) {
      console.log('YouTube API not ready or iframe not available')
      return
    }

    // Don't reinitialize if player already exists and is ready
    if (playerRef.current) {
      try {
        // Check if player is ready by trying to get its state
        const playerState = playerRef.current.getPlayerState?.()
        if (playerState !== undefined) {
          // Player exists and is functional, just update volume
          const volume = volumeToApplyRef.current ?? AudioVolumeManager.getVolume()
          playerRef.current.setVolume(volume)
          return
        }
      } catch (error) {
        // Player might be invalid, reset it
        console.log('Player appears invalid, will reinitialize')
        playerRef.current = null
      }
    }

    try {
      const currentVideo = playlistVideos[currentVideoIndex]
      if (!currentVideo) return

      // Create player instance pointing to existing iframe
      // Use the iframe element directly, not just the ID
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: (event: any) => {
            console.log('YouTube player ready for video:', currentVideo.id)
            // Set initial volume when player is ready
            const volume = volumeToApplyRef.current ?? AudioVolumeManager.getVolume()
            try {
              event.target.setVolume(volume) // YouTube API expects 0-100
              volumeToApplyRef.current = volume
              console.log('Initial volume set to:', volume)
            } catch (error) {
              console.error('Error setting initial volume:', error)
            }
          },
          onStateChange: (event: any) => {
            // When video starts playing, buffering, or becomes ready, ensure volume is set
            const state = event.data
            // Apply volume on all state changes to catch when new videos load
            const volume = volumeToApplyRef.current ?? AudioVolumeManager.getVolume()
            try {
              if (typeof event.target.setVolume === 'function') {
                event.target.setVolume(volume)
                console.log('Volume set on state change (state:', state, '):', volume)
              }
            } catch (error) {
              console.error('Error setting volume on state change:', error)
            }
          },
          onError: (event: any) => {
            console.error('YouTube player error:', event.data)
          }
        }
      })
      console.log('YouTube player initialized for video:', currentVideo.id)
    } catch (error) {
      console.error('Error initializing YouTube player:', error)
    }
  }

  // Update YouTube player volume when AudioVolumeManager volume changes
  useEffect(() => {
    const handleVolumeChange = (e: Event) => {
      const customEvent = e as CustomEvent
      const volume = customEvent.detail?.volume
      if (volume === undefined) return
      
      // Update the ref so it's available for new videos
      volumeToApplyRef.current = volume
      
      // Try multiple times to set volume, in case player isn't ready
      const trySetVolume = (attempts = 5) => {
        if (attempts === 0) return
        
        if (playerRef.current) {
          try {
            if (typeof playerRef.current.setVolume === 'function') {
              playerRef.current.setVolume(volume)
              console.log('YouTube volume set to:', volume)
              return
            }
          } catch (error) {
            console.error('Error setting YouTube volume:', error)
          }
        }
        
        // Retry after delay if first attempt failed
        if (attempts > 1) {
          setTimeout(() => trySetVolume(attempts - 1), 300)
        }
      }
      
      trySetVolume()
    }

    window.addEventListener('volumechange', handleVolumeChange)
    return () => {
      window.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [])

  // Update player when video changes
  useEffect(() => {
    if (!iframeRef.current) return

    const currentVideo = playlistVideos[currentVideoIndex]
    if (!currentVideo) return

    // Get current volume before changing video
    const currentVolume = AudioVolumeManager.getVolume()
    volumeToApplyRef.current = currentVolume

    // Store timeout IDs and interval ID for cleanup
    const timeoutIds: ReturnType<typeof setTimeout>[] = []
    let volumeCheckInterval: ReturnType<typeof setInterval> | null = null

    // If player is already initialized, use API to change video (preserves volume control)
    if (playerRef.current && youtubeAPILoadedRef.current) {
      try {
        if (typeof playerRef.current.loadVideoById === 'function') {
          console.log('Loading video via API:', currentVideo.id)
          
          // Set volume BEFORE loading new video to ensure it's ready
          if (typeof playerRef.current.setVolume === 'function') {
            playerRef.current.setVolume(currentVolume)
            volumeToApplyRef.current = currentVolume
            console.log('Volume set before video load:', currentVolume)
          }
          
          // Load the new video
          playerRef.current.loadVideoById(currentVideo.id, 0)
          
          // Ensure volume is set after video loads (multiple attempts with increasing intervals)
          // YouTube resets volume to 100% when loading new videos, so we need to aggressively set it
          const setVolumeAfterLoad = (attempt = 0) => {
            if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
              const volume = volumeToApplyRef.current ?? AudioVolumeManager.getVolume()
              try {
                playerRef.current.setVolume(volume)
                console.log(`Volume set after video load (attempt ${attempt + 1}):`, volume)
              } catch (error) {
                console.error('Error setting volume after load:', error)
              }
            }
          }
          
          // Try multiple times with increasing intervals to catch when video is ready
          timeoutIds.push(setTimeout(() => setVolumeAfterLoad(0), 100))
          timeoutIds.push(setTimeout(() => setVolumeAfterLoad(1), 300))
          timeoutIds.push(setTimeout(() => setVolumeAfterLoad(2), 500))
          timeoutIds.push(setTimeout(() => setVolumeAfterLoad(3), 1000))
          timeoutIds.push(setTimeout(() => setVolumeAfterLoad(4), 2000))
          timeoutIds.push(setTimeout(() => setVolumeAfterLoad(5), 3000))
          
          // Also set up a periodic check for the first few seconds after video loads
          let checkCount = 0
          volumeCheckInterval = setInterval(() => {
            if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
              const volume = volumeToApplyRef.current ?? AudioVolumeManager.getVolume()
              try {
                playerRef.current.setVolume(volume)
                checkCount++
                if (checkCount >= 10) { // Check for up to 5 seconds (10 * 500ms)
                  if (volumeCheckInterval) {
                    clearInterval(volumeCheckInterval)
                    volumeCheckInterval = null
                  }
                }
              } catch (error) {
                if (volumeCheckInterval) {
                  clearInterval(volumeCheckInterval)
                  volumeCheckInterval = null
                }
              }
            } else {
              if (volumeCheckInterval) {
                clearInterval(volumeCheckInterval)
                volumeCheckInterval = null
              }
            }
          }, 500)
          
          // Cleanup function
          return () => {
            timeoutIds.forEach(id => clearTimeout(id))
            if (volumeCheckInterval) {
              clearInterval(volumeCheckInterval)
            }
          }
        }
      } catch (error) {
        console.error('Error loading video via API:', error)
        // Fall through to src change
      }
    }
    
    // Player not initialized yet, change src and initialize player
    if (iframeRef.current) {
      const newUrl = getCurrentVideoEmbedUrl()
      if (iframeRef.current.src !== newUrl) {
        console.log('Changing iframe src to:', newUrl)
        iframeRef.current.src = newUrl
        playerRef.current = null // Reset player so it can be reinitialized
      }
    }
    
    // Initialize player after src change
    if (youtubeAPILoadedRef.current && !playerRef.current) {
      const timer = setTimeout(() => {
        if (iframeRef.current && youtubeAPILoadedRef.current) {
          initializePlayer()
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentVideoIndex])


  return (
    <div className="internet-explorer">
      {/* Toolbar */}
      <div className="ie-toolbar">
        <div className="ie-toolbar-left">
          <button 
            className="ie-toolbar-btn" 
            onClick={handlePreviousVideo}
            disabled={currentVideoIndex <= 0}
            title="Previous Video"
          >
            <img src="/assets/icons/Windows XP Icons/Back.png" alt="Back" />
          </button>
          <button 
            className="ie-toolbar-btn" 
            onClick={handleNextVideo}
            disabled={currentVideoIndex >= playlistVideos.length - 1}
            title="Next Video"
          >
            <img src="/assets/icons/Windows XP Icons/Forward.png" alt="Forward" />
          </button>
        </div>
        <div className="ie-toolbar-right">
          <div className="ie-address-bar">
            <span className="ie-address-label">Address:</span>
            <input
              type="text"
              value={playlistVideos[currentVideoIndex]?.url || ''}
              className="ie-address-input"
              readOnly
            />
            <button className="ie-go-btn">
              <img src="/assets/icons/Windows XP Icons/Go.png" alt="Go" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="ie-content">
        {isLoading ? (
          <div className="ie-loading">
            <div className="ie-loading-spinner"></div>
            <div className="ie-loading-text">Loading video...</div>
          </div>
        ) : (
          <div className="ie-video-container">
            <div className="ie-video-info-bar">
              <span className="ie-video-title">{getCurrentVideoTitle()}</span>
              <span className="ie-video-position">({currentVideoIndex + 1} of {playlistVideos.length})</span>
            </div>
            <iframe
              ref={iframeRef}
              id="youtube-player"
              src={getCurrentVideoEmbedUrl()}
              className="ie-iframe"
              title="YouTube Playlist"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>

    </div>
  )
}

export default InternetExplorer