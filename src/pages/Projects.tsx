import { useEffect, useRef } from 'react'
import '../styles/pages.css'
import { projects } from '../data/siteData'

interface ProjectsProps {
  highlightProjectId?: string
}

function Projects({ highlightProjectId }: ProjectsProps = {}) {
  const projectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    if (highlightProjectId && projectRefs.current[highlightProjectId]) {
      const element = projectRefs.current[highlightProjectId]
      if (element) {
        // Scroll to the element
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Add highlight effect
        element.style.backgroundColor = '#fff3cd'
        element.style.transition = 'background-color 0.3s'
        setTimeout(() => {
          if (element) {
            element.style.backgroundColor = ''
            setTimeout(() => {
              if (element) {
                element.style.transition = ''
              }
            }, 300)
          }
        }, 2000)
      }
    }
  }, [highlightProjectId])

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📂 My Projects</h1>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div 
            key={project.id} 
            className="project-card"
            ref={(el) => {
              projectRefs.current[project.id] = el
            }}
          >
            <h3>{project.title}</h3>
            {project.award && (
              <div className="project-award">{project.award}</div>
            )}
            <p className="project-description">{project.description}</p>
            <div className="tech-tags">
              {project.technologies.map((tech, idx) => (
                <span key={idx} className="tech-tag">{tech}</span>
              ))}
            </div>
            {project.highlights && project.highlights.length > 0 && (
              <ul className="project-highlights">
                {project.highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            )}
            {project.link && (
              <a href={project.link} className="project-link" target="_blank" rel="noopener noreferrer">
                View on GitHub →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects
