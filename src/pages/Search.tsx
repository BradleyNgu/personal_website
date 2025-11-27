import React, { useState, useEffect } from 'react'
import Projects from './Projects'
import Experiences from './Experiences'
import Autobiography from './Autobiography'
import ContactEmail from './ContactEmail'
import Resume from './Resume'
import MyPictures from './MyPictures'
import MyMusic from './MyMusic'
import InternetExplorer from './InternetExplorer'
import CommandPrompt from './CommandPrompt'

interface SearchResult {
  id: string
  type: 'application' | 'project' | 'experience'
  title: string
  subtitle?: string
  icon?: string
  action: () => void
}

interface SearchProps {
  onOpenWindow: (id: string, title: string, icon: string, component: React.ReactNode) => void
}

// Import project and experience data
const projects = [
  {
    id: '1',
    title: 'Meido',
    description: 'Full-stack conversational AI desktop application with voice synthesis and anime recommendations',
    technologies: ['Electron', 'Node.js', 'Express.js'],
  },
  {
    id: '2',
    title: 'X2 Insulin Pump Simulator',
    description: 'Fully functional desktop simulator of the Tandem t:slim X2 insulin pump with Control-IQ algorithm',
    technologies: ['C++', 'Qt'],
  },
  {
    id: '3',
    title: 'Dumpster Diver',
    description: 'End-to-end automated waste sorting system using machine learning and IoT hardware',
    technologies: ['Python', 'JavaScript', 'OpenCV', 'C++', 'Flask', 'TensorFlow', 'SQLite', 'Arduino', 'Keras', 'HTML/CSS'],
  },
  {
    id: '4',
    title: 'Elevator Simulator',
    description: 'Real-time elevator simulation system with smart scheduling and safety protocols',
    technologies: ['C++', 'Qt'],
  },
  {
    id: '5',
    title: 'Playtopia',
    description: 'Blockchain-based interactive game creation platform with smart contracts and real-time rewards',
    technologies: ['Python', 'JavaScript', 'OpenCV', 'C++', 'Flask', 'Cairo', 'Blockchain', 'TypeScript', 'Node.js', 'React.js', 'Arduino', 'HTML/CSS'],
  },
  {
    id: '6',
    title: 'Qmove',
    description: 'AI-powered rehabilitation tracker using computer vision to monitor joint range of motion',
    technologies: ['Streamlit', 'OpenCV', 'Flask', 'MongoDB', 'Node.js', 'MediaPipe', 'React.js', 'CSS'],
  },
  {
    id: '7',
    title: 'The Heart Stopper',
    description: 'Gesture-controlled energy drink dispenser using computer vision and Arduino',
    technologies: ['Python', 'OpenCV', 'C++', 'MediaPipe', 'Arduino'],
  },
  {
    id: '8',
    title: 'NewsBuzz',
    description: 'Real-time news aggregation platform with AI summaries and location-based insights',
    technologies: ['Express.js', 'HTML', 'Node.js', 'React.js', 'CSS'],
  },
]

const experiences = [
  {
    id: '1',
    company: 'dynaCERT Inc.',
    position: 'Full Stack Developer Co-op',
    description: 'Building enterprise-scale industrial IoT dashboard systems with React, TypeScript, Node.js, MySQL, Docker, and Postman',
    technologies: ['React', 'TypeScript', 'Node.js', 'MySQL', 'Docker', 'Postman'],
  },
]

function Search({ onOpenWindow }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  const performSearch = (query: string): SearchResult[] => {
    if (!query.trim()) return []

    const lowerQuery = query.toLowerCase().trim()
    const results: SearchResult[] = []

    // Search applications
    const applications = [
      { id: 'projects', title: 'My Projects', keywords: ['projects', 'project', 'portfolio', 'work'], icon: '/assets/icons/projects.png', component: <Projects /> },
      { id: 'experiences', title: 'My Experience', keywords: ['experience', 'experiences', 'work', 'job', 'employment', 'career'], icon: '/assets/icons/experiences.png', component: <Experiences /> },
      { id: 'autobiography', title: 'About Me', keywords: ['about', 'me', 'autobiography', 'bio', 'who'], icon: '/assets/icons/folder.png', component: <Autobiography /> },
      { id: 'resume', title: 'My Resume', keywords: ['resume', 'cv', 'curriculum vitae'], icon: '/assets/icons/Windows XP Icons/pdf.png', component: <Resume /> },
      { id: 'email', title: 'Email - Contact Bradley', keywords: ['email', 'contact', 'mail', 'message'], icon: '/assets/icons/Windows XP Icons/Email.png', component: <ContactEmail /> },
      { id: 'my-pictures', title: 'My Pictures', keywords: ['pictures', 'pics', 'photos', 'images', 'gallery'], icon: '/assets/icons/Windows XP Icons/My Pictures.png', component: <MyPictures /> },
      { id: 'my-music', title: 'My Music', keywords: ['music', 'songs', 'audio', 'tracks'], icon: '/assets/icons/Windows XP Icons/My Music.png', component: <MyMusic /> },
      { id: 'internet-explorer', title: 'Internet Explorer', keywords: ['internet', 'browser', 'web', 'youtube', 'videos'], icon: '/assets/icons/Windows XP Icons/Internet Explorer 6.png', component: <InternetExplorer /> },
      { id: 'cmd', title: 'Command Prompt', keywords: ['cmd', 'command', 'prompt', 'terminal', 'cli'], icon: '/assets/icons/Windows XP Icons/Command Prompt.png', component: <CommandPrompt />, hideMenuBar: true },
    ]

    applications.forEach(app => {
      if (app.keywords.some(keyword => keyword.includes(lowerQuery) || lowerQuery.includes(keyword)) ||
          app.title.toLowerCase().includes(lowerQuery)) {
        results.push({
          id: app.id,
          type: 'application',
          title: app.title,
          icon: app.icon,
          action: () => onOpenWindow(app.id, app.title, app.icon, app.component),
        })
      }
    })

    // Search projects
    projects.forEach(project => {
      const matchesTitle = project.title.toLowerCase().includes(lowerQuery)
      const matchesDescription = project.description.toLowerCase().includes(lowerQuery)
      const matchesTech = project.technologies.some(tech => tech.toLowerCase().includes(lowerQuery))

      if (matchesTitle || matchesDescription || matchesTech) {
        results.push({
          id: `project-${project.id}`,
          type: 'project',
          title: project.title,
          subtitle: project.description,
          icon: '/assets/icons/projects.png',
          action: () => onOpenWindow('projects', 'My Projects', '/assets/icons/projects.png', <Projects highlightProjectId={project.id} />),
        })
      }
    })

    // Search experiences
    experiences.forEach(exp => {
      const matchesCompany = exp.company.toLowerCase().includes(lowerQuery)
      const matchesPosition = exp.position.toLowerCase().includes(lowerQuery)
      const matchesDescription = exp.description.toLowerCase().includes(lowerQuery)
      const matchesTech = exp.technologies?.some(tech => tech.toLowerCase().includes(lowerQuery))

      if (matchesCompany || matchesPosition || matchesDescription || matchesTech) {
        results.push({
          id: `experience-${exp.id}`,
          type: 'experience',
          title: `${exp.position} at ${exp.company}`,
          subtitle: exp.description,
          icon: '/assets/icons/experiences.png',
          action: () => onOpenWindow('experiences', 'My Experience', '/assets/icons/experiences.png', <Experiences highlightExperienceId={exp.id} />),
        })
      }
    })

    return results
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = performSearch(searchQuery)
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

  // Auto-search as user types (with debounce)
  useEffect(() => {
    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        const results = performSearch(searchQuery)
        setSearchResults(results)
      }, 300) // 300ms debounce
      return () => clearTimeout(timer)
    } else {
      setSearchResults([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const handleResultClick = (result: SearchResult) => {
    result.action()
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
              <h3 style={{ marginBottom: '15px', color: '#1e3f7a' }}>
                Search Results ({searchResults.length})
              </h3>
              <div style={{
                border: '1px solid #d4d4d4',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
                padding: '15px',
                maxHeight: '400px',
                overflowY: 'auto',
              }}>
                {searchResults.map((result, index) => (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    style={{
                      padding: '12px',
                      borderBottom: index < searchResults.length - 1 ? '1px solid #e0e0e0' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e8f4f8'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    {result.icon && (
                      <img 
                        src={result.icon} 
                        alt="" 
                        style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', color: '#1e3f7a', marginBottom: '4px' }}>
                        {result.title}
                      </div>
                      {result.subtitle && (
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {result.subtitle}
                        </div>
                      )}
                      <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                        {result.type === 'application' && 'Application'}
                        {result.type === 'project' && 'Project'}
                        {result.type === 'experience' && 'Work Experience'}
                      </div>
                    </div>
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
                <li>Search for applications: "Projects", "Resume", "Email", "Pictures", etc.</li>
                <li>Search for projects by name: "Meido", "Insulin Pump", "Dumpster Diver"</li>
                <li>Search by technology: "React", "Python", "C++", "Node.js"</li>
                <li>Search for work experience: "dynaCERT", "Full Stack", "IoT"</li>
                <li>Click on any result to open it</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search
