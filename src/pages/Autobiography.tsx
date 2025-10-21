import { useState } from 'react'
import '../styles/pages.css'

interface AboutSection {
  id: string
  title: string
  content: string
}

const initialSections: AboutSection[] = [
  {
    id: '1',
    title: 'About Me',
    content: 'Hi! I\'m Bradley Nguyen. Add your introduction here...\n\nTell visitors about yourself, your background, interests, and what makes you unique.',
  },
  {
    id: '2',
    title: 'Education',
    content: 'University Name\nDegree Program\nGraduation Year\n\nRelevant Coursework:\n- Course 1\n- Course 2\n- Course 3',
  },
  {
    id: '3',
    title: 'Skills',
    content: 'Programming Languages:\n- Language 1\n- Language 2\n- Language 3\n\nFrameworks & Tools:\n- Tool 1\n- Tool 2\n- Tool 3',
  },
  {
    id: '4',
    title: 'Interests & Hobbies',
    content: 'Add your interests and hobbies here...\n\n• Hobby 1\n• Hobby 2\n• Hobby 3',
  },
]

function Autobiography() {
  const [sections, setSections] = useState<AboutSection[]>(initialSections)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<AboutSection | null>(null)

  const handleEdit = (section: AboutSection) => {
    setEditingId(section.id)
    setEditForm({ ...section })
  }

  const handleSave = () => {
    if (editForm) {
      setSections(sections.map(s => s.id === editForm.id ? editForm : s))
      setEditingId(null)
      setEditForm(null)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm(null)
  }

  const handleAddSection = () => {
    const newSection: AboutSection = {
      id: Date.now().toString(),
      title: 'New Section',
      content: 'Add content here...',
    }
    setSections([...sections, newSection])
  }

  const handleDelete = (id: string) => {
    setSections(sections.filter(s => s.id !== id))
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📝 About Bradley Nguyen</h1>
        <button className="xp-button" onClick={handleAddSection}>
          + Add Section
        </button>
      </div>

      <div className="about-sections">
        {sections.map(section => (
          <div key={section.id} className="about-card">
            {editingId === section.id && editForm ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Section Title:</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="xp-input"
                  />
                </div>
                <div className="form-group">
                  <label>Content:</label>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                    className="xp-textarea"
                    rows={10}
                  />
                </div>
                <div className="button-group">
                  <button className="xp-button primary" onClick={handleSave}>Save</button>
                  <button className="xp-button" onClick={handleCancel}>Cancel</button>
                  <button className="xp-button danger" onClick={() => {
                    handleDelete(section.id)
                    handleCancel()
                  }}>Delete</button>
                </div>
              </div>
            ) : (
              <>
                <h2>{section.title}</h2>
                <div className="about-content">
                  {section.content.split('\n').map((line, idx) => (
                    <p key={idx}>{line || '\u00A0'}</p>
                  ))}
                </div>
                <div className="card-actions">
                  <button className="xp-button small" onClick={() => handleEdit(section)}>
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

export default Autobiography

