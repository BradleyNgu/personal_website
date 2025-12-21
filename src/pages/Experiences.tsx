import { useEffect, useRef } from 'react'
import '../styles/pages.css'

interface Experience {
  id: string
  company: string
  position: string
  period: string
  responsibilities: string[]
}

interface ExperiencesProps {
  highlightExperienceId?: string
}

const experiences: Experience[] = [
  {
    id: '1',
    company: 'dynaCERT Inc.',
    position: 'Full-Stack Developer',
    period: 'May 2025 – December 2025',
    responsibilities: [
      'Architected and deployed a full-stack **industrial IoT monitoring dashboard** with **18 RESTful APIs** and **20+ React components**, processing real-time telemetry from a **MySQL backend** for **450+ H2 generator units** across multiple time granularities',
      'Implemented a scalable **Node.js microservices architecture** with **7 controllers** and **9 services**, containerized via **Docker** for development and production, and deployed to hydralytica.com serving live industrial data',
      'Built a comprehensive **data visualization and reporting system** featuring **6 table modules**, **40+ dynamic filters**, and **5 automated Excel export formats**, enabling cross-fleet performance analytics for **120+ enterprise clients**',
      'Developed a **C++ native module** for **binary data parsing**, achieving **10-100x faster processing** compared to JavaScript; integrated with **Node.js** via node-addon-api and supported cross-platform builds (Windows, macOS, Linux) for real-time H2Gen unit telemetry processing',
    ],
  },
]

function Experiences({ highlightExperienceId }: ExperiencesProps = {}) {
  const experienceRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    if (highlightExperienceId && experienceRefs.current[highlightExperienceId]) {
      const element = experienceRefs.current[highlightExperienceId]
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
  }, [highlightExperienceId])

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>💼 Work Experience</h1>
      </div>

      <div className="experiences-timeline">
        {experiences.map(experience => (
          <div 
            key={experience.id} 
            className="experience-card"
            ref={(el) => {
              experienceRefs.current[experience.id] = el
            }}
          >
            <div className="experience-header">
              <div className="experience-company-info">
                <img src="/assets/icons/dynacert.png" alt="dynaCERT Logo" className="company-logo" />
                <div>
                  <h3>{experience.position}</h3>
                  <h4>{experience.company}</h4>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span className="experience-period">{experience.period}</span>
                <span style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Toronto, ON</span>
              </div>
            </div>
            {experience.responsibilities.length > 0 && (
              <ul className="responsibilities-list">
                {experience.responsibilities.map((resp, idx) => {
                  // Parse markdown-style bold text (**text**) and convert to HTML
                  const parts = resp.split(/(\*\*.*?\*\*)/g)
                  return (
                    <li key={idx}>
                      {parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={i}>{part.slice(2, -2)}</strong>
                        }
                        return <span key={i}>{part}</span>
                      })}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="page-header" style={{ marginTop: '40px' }}>
        <h1>🎯 Extracurricular Activities</h1>
      </div>

      <div className="experiences-timeline">
        <div className="experience-card">
          <div className="experience-header">
            <div className="experience-company-info">
              <img src="/assets/icons/cuhacking_logo.jpeg" alt="cuHacking Logo" className="company-logo" />
              <div>
                <h3>Hacker Experience Team Lead</h3>
                <h4>cuHacking</h4>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span className="experience-period">Sep. 2025 – Present</span>
              <span style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Ottawa, ON</span>
            </div>
          </div>
          <ul className="responsibilities-list">
            <li>Coordinate and enhance the participant experience for <strong>300+ hackers</strong> through event planning, workshops, and sponsor engagement initiatives</li>
            <li>Collaborate with cross-functional teams to manage logistics, marketing, and hacker communication using <strong>Notion, Discord, and Google Workspace</strong></li>
            <li>Support technical workshops and hackathon preparation events to promote inclusivity and technical growth among university participants</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Experiences
