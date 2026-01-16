import { useEffect, useRef } from 'react'
import '../styles/pages.css'
import { experiences, extracurriculars, parseBoldText } from '../data/siteData'

interface ExperiencesProps {
  highlightExperienceId?: string
}

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
        <h1>Work Experience</h1>
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
                <img src={experience.logo} alt={`${experience.company} Logo`} className="company-logo" />
                <div>
                  <h3>{experience.position}</h3>
                  <h4>{experience.company}</h4>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span className="experience-period">{experience.period}</span>
                <span style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{experience.location}</span>
              </div>
            </div>
            {experience.responsibilities.length > 0 && (
              <ul className="responsibilities-list">
                {experience.responsibilities.map((resp, idx) => (
                  <li key={idx}>{parseBoldText(resp)}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="page-header" style={{ marginTop: '40px' }}>
        <h1>Extracurricular Activities</h1>
      </div>

      <div className="experiences-timeline">
        {extracurriculars.map(ext => (
          <div 
            key={ext.id}
            className="experience-card"
            ref={(el) => {
              experienceRefs.current[ext.id] = el
            }}
          >
            <div className="experience-header">
              <div className="experience-company-info">
                <img src={ext.logo} alt={`${ext.organization} Logo`} className="company-logo" />
                <div>
                  <h3>{ext.position}</h3>
                  <h4>{ext.organization}</h4>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span className="experience-period">{ext.period}</span>
                <span style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{ext.location}</span>
              </div>
            </div>
            <ul className="responsibilities-list">
              {ext.responsibilities.map((resp, idx) => (
                <li key={idx}>{parseBoldText(resp)}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Experiences
