import '../styles/pages.css'

interface AboutSection {
  id: string
  title: string
  content: string
}

const sections: AboutSection[] = [
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
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📝 About Bradley Nguyen</h1>
      </div>

      <div className="about-sections">
        {sections.map(section => (
          <div key={section.id} className="about-card">
            <h2>{section.title}</h2>
            <div className="about-content">
              {section.content.split('\n').map((line, idx) => (
                <p key={idx}>{line || '\u00A0'}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Autobiography
