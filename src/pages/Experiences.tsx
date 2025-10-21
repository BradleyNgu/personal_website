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
    company: 'dynaCERT Inc.',
    position: 'Full Stack Developer Co-op',
    period: 'May 2025 - Present',
    description: 'Building enterprise-scale industrial IoT dashboard systems with React, TypeScript, Node.js, MySQL, Docker, and Postman',
    responsibilities: [
      'Spearheaded a full-stack industrial IoT dashboard system serving 120+ enterprise customers and 450+ hydrogen generator units globally, delivering real-time monitoring capabilities that reduced equipment downtime by 20% and improved operational efficiency',
      'Architected scalable React/TypeScript frontend and Node.js backend infrastructure with MySQL database integration, supporting concurrent monitoring of 25+ critical parameters (reactor states, temperatures, voltages, GPS telemetry) and reducing data processing latency by 65%',
      'Developed advanced data visualization and export capabilities featuring real-time charts, filtering systems, and Excel export functionality, empowering field technicians and fleet managers to process service data 80% faster and reducing manual reporting overhead',
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
              <div className="experience-company-info">
                <img src="/assets/icons/dynacert.png" alt="dynaCERT Logo" className="company-logo" />
                <div>
                  <h3>{experience.position}</h3>
                  <h4>{experience.company}</h4>
                </div>
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
