import React, { useState, useEffect } from 'react'

interface Photo {
  name: string
  path: string
  size: string
  date: string
  thumbnail: string
}

function MyPictures() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'large' | 'small' | 'list'>('large')
  const [currentPath, setCurrentPath] = useState('My Pictures')
  const [loading, setLoading] = useState(true)

  // Load photos from the MyPictures folder
  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true)
      
      const knownPhotos = [
        'SolutionHacks.jpg',
        'The_gang.jpg', 
        'uOttaHack.jpg'
      ]
      
      const detectedPhotos: Photo[] = []
      
      // Check which photos exist by trying to load them
      for (const filename of knownPhotos) {
        const img = new Image()
        img.onload = () => {
          // Photo exists, add it to the list
          const photo: Photo = {
            name: filename,
            path: `/MyPictures/${filename}`,
            size: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9)} MB`,
            date: new Date().toLocaleDateString('en-US'),
            thumbnail: `/MyPictures/${filename}`
          }
          detectedPhotos.push(photo)
          setPhotos([...detectedPhotos])
        }
        img.onerror = () => {
          // Photo doesn't exist, skip it
        }
        img.src = `/MyPictures/${filename}`
      }
      
      // Set loading to false after a short delay
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }

    loadPhotos()
  }, [])

  const handlePhotoClick = (photoName: string, isCtrlKey: boolean) => {
    if (isCtrlKey) {
      setSelectedPhotos(prev => 
        prev.includes(photoName) 
          ? prev.filter(name => name !== photoName)
          : [...prev, photoName]
      )
    } else {
      setSelectedPhotos([photoName])
    }
  }

  const handleViewModeChange = (mode: 'large' | 'small' | 'list') => {
    setViewMode(mode)
  }


  return (
    <div className="my-pictures">
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
          <div className="tasks-section">
            <h3>File and Folder Tasks</h3>
            <div className="task-item">
              <img src="/assets/icons/Windows XP Icons/New Folder.png" alt="" />
              <span>Make a new folder</span>
            </div>
            <div className="task-item">
              <img src="/assets/icons/Windows XP Icons/Internet Explorer 6.png" alt="" />
              <span>Publish this folder to the Web</span>
            </div>
          </div>

          <div className="other-places-section">
            <h3>Other Places</h3>
            <div className="place-item">
              <img src="/assets/icons/Windows XP Icons/My Pictures.png" alt="" />
              <span>My Pictures</span>
            </div>
            <div className="place-item">
              <img src="/assets/icons/Windows XP Icons/My Documents.png" alt="" />
              <span>My Documents</span>
            </div>
            <div className="place-item">
              <img src="/assets/icons/Windows XP Icons/Shared Documents.png" alt="" />
              <span>Shared Documents</span>
            </div>
            <div className="place-item">
              <img src="/assets/icons/Windows XP Icons/My Computer.png" alt="" />
              <span>My Computer</span>
            </div>
            <div className="place-item">
              <img src="/assets/icons/Windows XP Icons/My Network Places.png" alt="" />
              <span>My Network Places</span>
            </div>
          </div>

          <div className="details-section">
            <h3>Details</h3>
            <div className="detail-item">My Pictures</div>
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
              <p>Loading pictures...</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="empty-folder">
              <div className="empty-folder-icon">
                <img src="/assets/icons/Windows XP Icons/My Pictures.png" alt="Empty Folder" />
              </div>
              <div className="empty-folder-text">
                <h3>This folder is empty</h3>
                <p>To add pictures to this folder, drag them here or copy them from another location.</p>
              </div>
            </div>
          ) : (
            <div className={`photo-gallery ${viewMode}-icons`}>
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className={`photo-item ${selectedPhotos.includes(photo.name) ? 'selected' : ''}`}
                  onClick={(e) => handlePhotoClick(photo.name, e.ctrlKey || e.metaKey)}
                >
                  <div className="photo-thumbnail">
                    <img 
                      src={photo.thumbnail} 
                      alt={photo.name}
                      onError={(e) => {
                        // Fallback to a default image if the photo doesn't exist
                        e.currentTarget.src = '/assets/icons/Windows XP Icons/Generic Document.png'
                      }}
                    />
                  </div>
                  <div className="photo-info">
                    <div className="photo-name">{photo.name}</div>
                    <div className="photo-details">
                      <span>{photo.size}</span>
                      <span>{photo.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyPictures
