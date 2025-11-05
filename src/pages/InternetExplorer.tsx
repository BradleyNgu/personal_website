import { useState, useRef, useEffect } from 'react'
import { AudioVolumeManager } from '../utils/audioVolume'
import '../styles/internet-explorer.css'

// Type declarations for YouTube IFrame API
declare global {
  interface Window {
    YT?: {
      Player: new (elementId: HTMLElement | string, config: any) => any
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

interface InternetExplorerProps {
  onClose?: () => void
}

function InternetExplorer({ }: InternetExplorerProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const iframeRef = useRef<HTMLDivElement>(null)
  const youtubePlayerRef = useRef<any>(null)
  const youtubeApiLoadedRef = useRef(false)

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
    }
  ]

  // Load YouTube IFrame API
  useEffect(() => {
    if (youtubeApiLoadedRef.current) return
    
    // Check if script already exists
    if (window.YT && window.YT.Player) {
      youtubeApiLoadedRef.current = true
      return
    }

    // Load YouTube IFrame API script
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // Set up callback for when API is ready
    window.onYouTubeIframeAPIReady = () => {
      youtubeApiLoadedRef.current = true
      initializeYouTubePlayer()
    }

    // If API is already loaded (race condition)
    if (window.YT && window.YT.Player) {
      youtubeApiLoadedRef.current = true
      initializeYouTubePlayer()
    }
  }, [])

  // Initialize YouTube player when API is ready
  const initializeYouTubePlayer = () => {
    if (!iframeRef.current || !window.YT || !window.YT.Player) return
    
    const currentVideo = playlistVideos[currentVideoIndex]
    if (!currentVideo) return

    try {
      // Destroy existing player if any
      if (youtubePlayerRef.current && typeof youtubePlayerRef.current.destroy === 'function') {
        youtubePlayerRef.current.destroy()
        AudioVolumeManager.unregisterYouTubePlayer(youtubePlayerRef.current)
      }

      // Create new YouTube player - use the div element directly
      const player = new window.YT.Player(iframeRef.current, {
        videoId: currentVideo.id,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          showinfo: 0,
          controls: 1,
          iv_load_policy: 3,
          fs: 1,
          cc_load_policy: 0
        },
        events: {
          onReady: (event: any) => {
            // Set initial volume when player is ready
            const playerInstance = event.target
            AudioVolumeManager.registerYouTubePlayer(playerInstance)
          },
          onError: () => {
            console.log('YouTube player error')
          }
        }
      })

      youtubePlayerRef.current = player
    } catch (error) {
      console.log('Error initializing YouTube player:', error)
    }
  }

  // Reinitialize player when video changes
  useEffect(() => {
    if (youtubeApiLoadedRef.current && iframeRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        initializeYouTubePlayer()
      }, 100)
    }
  }, [currentVideoIndex])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (youtubePlayerRef.current) {
        try {
          if (typeof youtubePlayerRef.current.destroy === 'function') {
            youtubePlayerRef.current.destroy()
          }
          AudioVolumeManager.unregisterYouTubePlayer(youtubePlayerRef.current)
        } catch (error) {
          console.log('Error cleaning up YouTube player:', error)
        }
      }
    }
  }, [])

  // Get current video embed URL (fallback for if API fails)
  const getCurrentVideoEmbedUrl = () => {
    const currentVideo = playlistVideos[currentVideoIndex]
    if (currentVideo) {
      return `https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=1&iv_load_policy=3&fs=1&cc_load_policy=0`
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
            <div 
              ref={iframeRef}
              className="ie-iframe"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}
      </div>

    </div>
  )
}

export default InternetExplorer