import React, { useState } from 'react'

function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Simulate search results
      const results = [
        `Found files matching "${searchQuery}"`,
        'My Documents',
        'My Pictures',
        'My Music',
      ]
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Search</h1>
      </div>
      <div className="page-content">
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px', color: '#1e3f7a' }}>Search for Files and Folders</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter search term..."
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #999',
                  borderRadius: '3px',
                  fontSize: '14px',
                  fontFamily: 'Tahoma, sans-serif',
                }}
              />
              <button
                onClick={handleSearch}
                style={{
                  padding: '8px 20px',
                  backgroundColor: '#3c6dc5',
                  color: 'white',
                  border: '1px solid #1e3f7a',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontFamily: 'Tahoma, sans-serif',
                  fontWeight: 'bold',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#5c95d6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3c6dc5'
                }}
              >
                Search
              </button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div>
              <h3 style={{ marginBottom: '15px', color: '#1e3f7a' }}>Search Results</h3>
              <div style={{
                border: '1px solid #d4d4d4',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
                padding: '15px',
              }}>
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '10px',
                      borderBottom: index < searchResults.length - 1 ? '1px solid #e0e0e0' : 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e8f4f8'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchQuery && searchResults.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No results found. Try a different search term.
            </div>
          )}

          {!searchQuery && (
            <div style={{ padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '4px' }}>
              <h3 style={{ marginBottom: '10px', color: '#1e3f7a' }}>Search Tips</h3>
              <ul style={{ fontSize: '13px', lineHeight: '1.8', paddingLeft: '20px' }}>
                <li>Use * to match any characters (e.g., *.txt finds all text files)</li>
                <li>Use ? to match a single character</li>
                <li>Search is case-insensitive</li>
                <li>You can search by file name, content, or date</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search


