import { useState } from 'react'
import '../styles/pages.css'

interface Experience {
  id: string
  company: string
  position: string
  period: string
  description: string
  responsibilities: string[]
}

const initialExperiences: Experience[] = [
  {
    id: '1',
    company: 'Company Name',
    position: 'Job Title',
    period: '2023 - Present',
    description: 'Brief description of your role and impact...',
    responsibilities: [
      'Responsibility 1',
      'Responsibility 2',
      'Responsibility 3',
    ],
  },
  {
    id: '2',
    company: 'Previous Company',
    position: 'Previous Position',
    period: '2021 - 2023',
    description: 'Brief description of your role and impact...',
    responsibilities: [
      'Responsibility 1',
      'Responsibility 2',
    ],
  },
]

function Experiences() {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Experience | null>(null)

  const handleEdit = (experience: Experience) => {
    setEditingId(experience.id)
    setEditForm({ ...experience })
  }

  const handleSave = () => {
    if (editForm) {
      setExperiences(experiences.map(e => e.id === editForm.id ? editForm : e))
      setEditingId(null)
      setEditForm(null)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm(null)
  }

  const handleAddExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: 'Company Name',
      position: 'Position',
      period: 'Start - End',
      description: 'Add description...',
      responsibilities: [],
    }
    setExperiences([...experiences, newExperience])
  }

  const handleDelete = (id: string) => {
    setExperiences(experiences.filter(e => e.id !== id))
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>💼 Work Experience</h1>
        <button className="xp-button" onClick={handleAddExperience}>
          + Add Experience
        </button>
      </div>

      <div className="experiences-timeline">
        {experiences.map(experience => (
          <div key={experience.id} className="experience-card">
            {editingId === experience.id && editForm ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Company:</label>
                  <input
                    type="text"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="xp-input"
                  />
                </div>
                <div className="form-group">
                  <label>Position:</label>
                  <input
                    type="text"
                    value={editForm.position}
                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                    className="xp-input"
                  />
                </div>
                <div className="form-group">
                  <label>Period:</label>
                  <input
                    type="text"
                    value={editForm.period}
                    onChange={(e) => setEditForm({ ...editForm, period: e.target.value })}
                    className="xp-input"
                  />
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="xp-textarea"
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Responsibilities (one per line):</label>
                  <textarea
                    value={editForm.responsibilities.join('\n')}
                    onChange={(e) => setEditForm({ 
                      ...editForm, 
                      responsibilities: e.target.value.split('\n').filter(r => r.trim())
                    })}
                    className="xp-textarea"
                    rows={5}
                  />
                </div>
                <div className="button-group">
                  <button className="xp-button primary" onClick={handleSave}>Save</button>
                  <button className="xp-button" onClick={handleCancel}>Cancel</button>
                  <button className="xp-button danger" onClick={() => {
                    handleDelete(experience.id)
                    handleCancel()
                  }}>Delete</button>
                </div>
              </div>
            ) : (
              <>
                <div className="experience-header">
                  <div>
                    <h3>{experience.position}</h3>
                    <h4>{experience.company}</h4>
                  </div>
                  <span className="experience-period">{experience.period}</span>
                </div>
                <p className="experience-description">{experience.description}</p>
                {experience.responsibilities.length > 0 && (
                  <ul className="responsibilities-list">
                    {experience.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                )}
                <div className="card-actions">
                  <button className="xp-button small" onClick={() => handleEdit(experience)}>
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

export default Experiences

