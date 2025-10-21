import { useState } from 'react'
import '../styles/pages.css'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  link?: string
}

const initialProjects: Project[] = [
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
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Project | null>(null)

  const handleEdit = (project: Project) => {
    setEditingId(project.id)
    setEditForm({ ...project })
  }

  const handleSave = () => {
    if (editForm) {
      setProjects(projects.map(p => p.id === editForm.id ? editForm : p))
      setEditingId(null)
      setEditForm(null)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm(null)
  }

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: 'New Project',
      description: 'Add description...',
      technologies: [],
      link: '',
    }
    setProjects([...projects, newProject])
  }

  const handleDelete = (id: string) => {
    setProjects(projects.filter(p => p.id !== id))
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📂 My Projects</h1>
        <button className="xp-button" onClick={handleAddProject}>
          + Add Project
        </button>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project.id} className="project-card">
            {editingId === project.id && editForm ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="xp-input"
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="xp-textarea"
                    rows={4}
                  />
                </div>
                <div className="form-group">
                  <label>Technologies (comma separated):</label>
                  <input
                    type="text"
                    value={editForm.technologies.join(', ')}
                    onChange={(e) => setEditForm({ 
                      ...editForm, 
                      technologies: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                    })}
                    className="xp-input"
                  />
                </div>
                <div className="form-group">
                  <label>Link:</label>
                  <input
                    type="text"
                    value={editForm.link || ''}
                    onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                    className="xp-input"
                  />
                </div>
                <div className="button-group">
                  <button className="xp-button primary" onClick={handleSave}>Save</button>
                  <button className="xp-button" onClick={handleCancel}>Cancel</button>
                  <button className="xp-button danger" onClick={() => {
                    handleDelete(project.id)
                    handleCancel()
                  }}>Delete</button>
                </div>
              </div>
            ) : (
              <>
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
                <div className="card-actions">
                  <button className="xp-button small" onClick={() => handleEdit(project)}>
                    Edit
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects

