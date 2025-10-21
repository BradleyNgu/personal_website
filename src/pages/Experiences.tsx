import '../styles/pages.css'

interface Experience {
  id: string
  company: string
  position: string
  period: string
  description: string
  responsibilities: string[]
}

const experiences: Experience[] = [
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
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>💼 Work Experience</h1>
      </div>

      <div className="experiences-timeline">
        {experiences.map(experience => (
          <div key={experience.id} className="experience-card">
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
          </div>
        ))}
      </div>
    </div>
  )
}

export default Experiences
