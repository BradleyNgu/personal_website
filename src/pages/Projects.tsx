import '../styles/pages.css'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  link?: string
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Personal Website',
    description: 'A Windows XP-themed portfolio website built with React and TypeScript',
    technologies: ['React', 'TypeScript', 'Vite', 'CSS'],
    link: '#',
  },
  {
    id: '2',
    title: 'Project 2',
    description: 'Add your project description here...',
    technologies: ['Technology 1', 'Technology 2'],
    link: '',
  },
  {
    id: '3',
    title: 'Project 3',
    description: 'Add your project description here...',
    technologies: ['Technology 1', 'Technology 2'],
    link: '',
  },
]

function Projects() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📂 My Projects</h1>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <div className="tech-tags">
              {project.technologies.map((tech, idx) => (
                <span key={idx} className="tech-tag">{tech}</span>
              ))}
            </div>
            {project.link && (
              <a href={project.link} className="project-link" target="_blank" rel="noopener noreferrer">
                View Project →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects
