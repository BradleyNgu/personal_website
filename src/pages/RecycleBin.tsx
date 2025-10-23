import React from 'react'

interface RecycleBinItem {
  id: string
  title: string
  icon: string
}

interface RecycleBinProps {
  items: RecycleBinItem[]
  onDelete: (id: string) => void
  onRestore: (id: string) => void
}

function RecycleBin({ items, onDelete, onRestore }: RecycleBinProps) {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([])

  const handleSelectItem = (id: string, isCtrlKey: boolean) => {
    if (isCtrlKey) {
      setSelectedItems(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      )
    } else {
      setSelectedItems([id])
    }
  }

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return
    
    const confirmMessage = selectedItems.length === 1
      ? 'Are you sure you want to permanently delete this item?'
      : `Are you sure you want to permanently delete ${selectedItems.length} items?`
    
    if (window.confirm(confirmMessage)) {
      selectedItems.forEach(id => onDelete(id))
      setSelectedItems([])
    }
  }

  const handleRestoreSelected = () => {
    if (selectedItems.length === 0) return
    
    selectedItems.forEach(id => onRestore(id))
    setSelectedItems([])
  }

  return (
    <div className="recycle-bin-page">
      <div className="recycle-bin-toolbar">
        <div className="toolbar-section">
          <button 
            className="toolbar-button"
            onClick={handleRestoreSelected}
            disabled={selectedItems.length === 0}
          >
            <img src="/assets/icons/Windows XP Icons/Undo.png" alt="Restore" />
            <span>Restore</span>
          </button>
          <button 
            className="toolbar-button delete-button"
            onClick={handleDeleteSelected}
            disabled={selectedItems.length === 0}
          >
            <img src="/assets/icons/Windows XP Icons/Delete.png" alt="Delete" />
            <span>Delete</span>
          </button>
        </div>
        <div className="toolbar-info">
          {selectedItems.length > 0 ? (
            <span>{selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected</span>
          ) : (
            <span>{items.length} item{items.length !== 1 ? 's' : ''} in Recycle Bin</span>
          )}
        </div>
      </div>

      <div className="recycle-bin-content">
        {items.length === 0 ? (
          <div className="empty-bin-message">
            <img src="/assets/icons/recyclin-bin.png" alt="Empty Recycle Bin" className="empty-bin-icon" />
            <p>Recycle Bin is empty</p>
          </div>
        ) : (
          <div className="recycle-bin-items">
            {items.map(item => (
              <div
                key={item.id}
                className={`recycle-bin-item ${selectedItems.includes(item.id) ? 'selected' : ''}`}
                onClick={(e) => handleSelectItem(item.id, e.ctrlKey || e.metaKey)}
              >
                <img src={item.icon} alt={item.title} className="item-icon" />
                <span className="item-title">{item.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecycleBin

