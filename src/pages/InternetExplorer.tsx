import { useState, useRef } from 'react'
import '../styles/internet-explorer.css'

interface InternetExplorerProps {
  onClose?: () => void
}

function InternetExplorer({ }: InternetExplorerProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

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

  // Get current video embed URL
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
            <iframe
              ref={iframeRef}
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