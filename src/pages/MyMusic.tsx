import { useState, useEffect } from 'react'
import { AudioVolumeManager } from '../utils/audioVolume'

interface MusicFile {
  name: string
  path: string
  size: string
  date: string
  duration: string
  artist: string
  album: string
  thumbnail: string
}

function MyMusic() {
  const [musicFiles, setMusicFiles] = useState<MusicFile[]>([])
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'large' | 'small' | 'list'>('large')
  const [currentPath] = useState('My Music')
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  // Load music files from the MyMusic folder
  useEffect(() => {
    const loadMusicFiles = async () => {
      setLoading(true)
      
      // Sample music files that could be in the folder
      const knownMusicFiles = [
        'Max Verstappen meme (4K).mp3',
        'sample2.mp3', 
        'sample3.mp3',
        'favorite_song.wav',
        'playlist_track.mp3'
      ]
      
      const detectedMusic: MusicFile[] = []
      
      // Check which music files exist by trying to load them
      for (const filename of knownMusicFiles) {
        const audio = new Audio()
        audio.oncanplaythrough = () => {
          // Music file exists, add it to the list
          const music: MusicFile = {
            name: filename,
            path: `/MyMusic/${filename}`,
            size: `${Math.floor(Math.random() * 8) + 2}.${Math.floor(Math.random() * 9)} MB`,
            date: new Date().toLocaleDateString('en-US'),
            duration: `${Math.floor(Math.random() * 4) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            artist: ['Various Artists', 'Your Favorite Artist', 'Local Band', 'Indie Musician'][Math.floor(Math.random() * 4)],
            album: ['Greatest Hits', 'Best of Collection', 'Personal Favorites', 'Chill Vibes'][Math.floor(Math.random() * 4)],
            thumbnail: '/assets/icons/Windows XP Icons/Generic Document.png'
          }
          detectedMusic.push(music)
          setMusicFiles([...detectedMusic])
        }
        audio.onerror = () => {
          // Music file doesn't exist, skip it
          console.log(`Music file not found: ${filename}`)
        }
        audio.src = `/MyMusic/${filename}`
      }
      
      // Set loading to false after a short delay
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }

    loadMusicFiles()
  }, [])

  const handleMusicClick = (musicName: string, isCtrlKey: boolean) => {
    if (isCtrlKey) {
      setSelectedFiles(prev => 
        prev.includes(musicName) 
          ? prev.filter(name => name !== musicName)
          : [...prev, musicName]
      )
    } else {
      setSelectedFiles([musicName])
    }
  }

  const handlePlayMusic = (musicName: string) => {
    // Stop current audio if playing
    if (audioElement) {
      audioElement.pause()
      audioElement.currentTime = 0
      AudioVolumeManager.unregisterAudio(audioElement)
    }

    // Create new audio element
    const audio = new Audio(`/MyMusic/${musicName}`)
    AudioVolumeManager.registerAudio(audio)
    setAudioElement(audio)
    setCurrentTrack(musicName)
    setIsPlaying(true)

    // Set up event listeners
    audio.onended = () => {
      setIsPlaying(false)
      setCurrentTrack(null)
      AudioVolumeManager.unregisterAudio(audio)
    }

    audio.onerror = () => {
      console.log(`Error playing: ${musicName}`)
      setIsPlaying(false)
      setCurrentTrack(null)
      AudioVolumeManager.unregisterAudio(audio)
    }

    // Play the audio
    audio.play().catch(error => {
      console.log(`Playback failed: ${error}`)
      setIsPlaying(false)
      setCurrentTrack(null)
      AudioVolumeManager.unregisterAudio(audio)
    })
  }

  const handleViewModeChange = (mode: 'large' | 'small' | 'list') => {
    setViewMode(mode)
  }

  return (
    <div className="my-music">
      <div className="explorer-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn" title="Back">
            <img src="/assets/icons/Windows XP Icons/Back.png" alt="Back" />
          </button>
          <button className="toolbar-btn" title="Forward">
            <img src="/assets/icons/Windows XP Icons/Forward.png" alt="Forward" />
          </button>
          <button className="toolbar-btn" title="Up">
            <img src="/assets/icons/Windows XP Icons/Up.png" alt="Up" />
          </button>
          <div className="toolbar-separator"></div>
          <button className="toolbar-btn" title="Search">
            <img src="/assets/icons/Windows XP Icons/Search.png" alt="Search" />
          </button>
          <button className="toolbar-btn" title="Folders">
            <img src="/assets/icons/Windows XP Icons/Folder View.png" alt="Folders" />
          </button>
        </div>
        <div className="toolbar-right">
          <select 
            className="view-selector" 
            value={viewMode}
            onChange={(e) => handleViewModeChange(e.target.value as 'large' | 'small' | 'list')}
          >
            <option value="large">Large Icons</option>
            <option value="small">Small Icons</option>
            <option value="list">List</option>
          </select>
        </div>
      </div>

      <div className="explorer-content">
        <div className="left-pane">
          <div className="music-tasks-section">
            <h3>Music Tasks</h3>
            <div className="task-item">
              <img src="/assets/icons/Windows XP Icons/Play.png" alt="" />
              <span>Play selection</span>
            </div>
            <div className="task-item">
              <img src="/assets/icons/Windows XP Icons/Internet Explorer 6.png" alt="" />
              <span>Shop for music online</span>
            </div>
            <div className="task-item">
              <img src="/assets/icons/Windows XP Icons/CD.png" alt="" />
              <span>Copy to audio CD</span>
            </div>
          </div>

          <div className="file-folder-tasks-section">
            <h3>File and Folder Tasks</h3>
            <div className="task-item">
              <img src="/assets/icons/Windows XP Icons/Move.png" alt="" />
              <span>Move the selected items</span>
            </div>
            <div className="task-item">
              <img src="/assets/icons/Windows XP Icons/Copy.png" alt="" />
              <span>Copy the selected items</span>
            </div>
            <div className="task-item">
              <img src="/assets/icons/Windows XP Icons/Email.png" alt="" />
              <span>E-mail the selected items</span>
            </div>
            <div className="task-item">
              <img src="/assets/icons/Windows XP Icons/Delete.png" alt="" />
              <span>Delete the selected items</span>
            </div>
          </div>

          <div className="other-places-section">
            <h3>Other Places</h3>
            <div className="place-item">
              <img src="/assets/icons/Windows XP Icons/My Music.png" alt="" />
              <span>My Music</span>
            </div>
            <div className="place-item">
              <img src="/assets/icons/Windows XP Icons/My Documents.png" alt="" />
              <span>About Me</span>
            </div>
            <div className="place-item">
              <img src="/assets/icons/Windows XP Icons/Shared Documents.png" alt="" />
              <span>Shared Documents</span>
            </div>
            <div className="place-item">
              <img src="/assets/icons/Windows XP Icons/My Network Places.png" alt="" />
              <span>My Network Places</span>
            </div>
          </div>

          <div className="details-section">
            <h3>Details</h3>
            <div className="detail-item">My Music</div>
            <div className="detail-item">File Folder</div>
          </div>
        </div>

        <div className="right-pane">
          <div className="address-bar">
            Address: <span className="current-path">{currentPath}</span>
          </div>

          {loading ? (
            <div className="loading-folder">
              <div className="loading-spinner"></div>
              <p>Loading music...</p>
            </div>
          ) : musicFiles.length === 0 ? (
            <div className="empty-folder">
              <div className="empty-folder-icon">
                <img src="/assets/icons/Windows XP Icons/My Music.png" alt="Empty Folder" />
              </div>
              <div className="empty-folder-text">
                <h3>This folder is empty</h3>
                <p>To add music to this folder, drag audio files here or copy them from another location.</p>
              </div>
            </div>
          ) : (
            <div className={`music-gallery ${viewMode}-icons`}>
              {musicFiles.map((music, index) => (
                <div
                  key={index}
                  className={`music-item ${selectedFiles.includes(music.name) ? 'selected' : ''} ${currentTrack === music.name ? 'playing' : ''}`}
                  onClick={(e) => handleMusicClick(music.name, e.ctrlKey || e.metaKey)}
                  onDoubleClick={() => handlePlayMusic(music.name)}
                >
                  <div className="music-thumbnail">
                    <img 
                      src={music.thumbnail} 
                      alt={music.name}
                      onError={(e) => {
                        e.currentTarget.src = '/assets/icons/Windows XP Icons/Generic Document.png'
                      }}
                    />
                    {currentTrack === music.name && (
                      <div className="play-indicator">
                        <img src="/assets/icons/Windows XP Icons/Play.png" alt="Playing" />
                      </div>
                    )}
                  </div>
                  <div className="music-info">
                    <div className="music-name">{music.name}</div>
                    <div className="music-details">
                      <span>{music.artist}</span>
                      <span>{music.album}</span>
                      <span>{music.duration}</span>
                      <span>{music.size}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mini Player */}
          {currentTrack && (
            <div className="mini-player">
              <div className="player-info">
                <span className="track-name">{currentTrack}</span>
                <span className="player-status">{isPlaying ? 'Playing' : 'Paused'}</span>
              </div>
              <div className="player-controls">
                <button 
                  className="control-btn"
                  onClick={() => {
                    if (audioElement) {
                      if (isPlaying) {
                        audioElement.pause()
                        setIsPlaying(false)
                      } else {
                        audioElement.play().catch(error => {
                          console.log(`Playback failed: ${error}`)
                        })
                        setIsPlaying(true)
                      }
                    }
                  }}
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button 
                  className="control-btn"
                  onClick={() => {
                    if (audioElement) {
                      audioElement.pause()
                      audioElement.currentTime = 0
                      AudioVolumeManager.unregisterAudio(audioElement)
                    }
                    setCurrentTrack(null)
                    setIsPlaying(false)
                    setAudioElement(null)
                  }}
                >
                  ⏹️
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyMusic
