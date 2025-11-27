import { useEffect, useRef } from 'react'
import '../styles/pages.css'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  link?: string
  award?: string
  highlights: string[]
}

interface ProjectsProps {
  highlightProjectId?: string
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Meido',
    description: 'Full-stack conversational AI desktop application with voice synthesis and anime recommendations',
    technologies: ['Electron', 'Node.js', 'Express.js'],
    link: 'https://github.com/BradleyNgu/SolutionHacks',
    award: '🏆 Winner for Silliest Most Convoluted Project @ SolutionHacks',
    highlights: [
      'You know you\'ve always wanted one. A personal maid that goes around your desktop. Now, the time has finally come.',
      'Introducing Meido-Chan, an anime-specialized chatbot with the ability to not only converse with you, but also manage your own MyAnimeList account!',
      'Includes based opinions as well!',
    ],
  },
  {
    id: '2',
    title: 'X2 Insulin Pump Simulator',
    description: 'Fully functional desktop simulator of the Tandem t:slim X2 insulin pump with Control-IQ algorithm',
    technologies: ['C++', 'Qt'],
    link: 'https://github.com/BradleyNgu/COMP3004-W25',
    award: '🎓 Academic Project - 97.5% Grade',
    highlights: [
      'Developed a fully functional desktop simulator of the Tandem t:slim X2 insulin pump, replicating core functionalities and interface of the real-world device',
      'Interactive Touchscreen UI simulating the real insulin pump experience with Manual & Automated Bolus Delivery, including override and dose suggestions',
      'Implemented Control-IQ Algorithm Simulation for dynamic insulin adjustments based on CGM data with Alerts & History Tracking',
      'Security & Accessibility features like PIN lock screen and sleep mode with Test Panel for simulating device states and critical edge cases',
      'Worked collaboratively using GitHub with an incremental development approach, incorporating UML diagrams, a traceability matrix, and rigorous testing',
    ],
  },
  {
    id: '3',
    title: 'Dumpster Diver',
    description: 'End-to-end automated waste sorting system using machine learning and IoT hardware',
    technologies: ['Python', 'JavaScript', 'OpenCV', 'C++', 'Flask', 'TensorFlow', 'SQLite', 'Arduino', 'Keras', 'HTML/CSS'],
    link: 'https://github.com/BradleyNgu/cuHacking',
    award: '🏆 Challenge Winner @ cuHacking 6',
    highlights: [
      'Developed an end-to-end waste sorting system that integrates computer vision, machine learning, and Arduino-controlled hardware to identify and sort waste automatically',
      'Built Flask-based web dashboard with real-time data visualization using Chart.js and a custom model training pipeline',
      'Built a complete IoT data pipeline from physical sorting to analytics, enabling tracking of recycling trends and event logs',
    ],
  },
  {
    id: '4',
    title: 'Elevator Simulator',
    description: 'Real-time elevator simulation system with smart scheduling and safety protocols',
    technologies: ['C++', 'Qt'],
    link: 'https://github.com/BradleyNgu/COMP3004/tree/main/assignment3',
    award: '🎓 Academic Project - 99% Grade',
    highlights: [
      'Built a full-featured, real-time elevator simulation system using C++ and Qt allowing configuration of simulation parameters',
      'Developed a smart elevator scheduling algorithm that prioritizes direction, proximity, and current load',
      'Integrated a GUI with real-time logging and status updates for all elevator movements and safety protocols',
      'Implemented safety logic with state machines and modal dialogs (e.g., Help alarm with auto-call countdown)',
      'Applied design patterns like Singleton, Observer, and Strategy for robust architecture',
    ],
  },
  {
    id: '5',
    title: 'Playtopia',
    description: 'Blockchain-based interactive game creation platform with smart contracts and real-time rewards',
    technologies: ['Python', 'JavaScript', 'OpenCV', 'C++', 'Flask', 'Cairo', 'Blockchain', 'TypeScript', 'Node.js', 'React.js', 'Arduino', 'HTML/CSS'],
    link: 'https://github.com/xavierdmello/Playtopia',
    award: '🥈 2nd for Best Use of Starknet @ uOttaHack 7',
    highlights: [
      'Playtopia is a decentralized gaming platform that allows users to upload their custom-built games and rewards players using blockchain-powered smart contracts',
      'Provides a seamless interface for hosting and interacting with games while leveraging real-time feedback through hardware-software integration',
    ],
  },
  {
    id: '6',
    title: 'Qmove',
    description: 'AI-powered rehabilitation tracker using computer vision to monitor joint range of motion',
    technologies: ['Streamlit', 'OpenCV', 'Flask', 'MongoDB', 'Node.js', 'MediaPipe', 'React.js', 'CSS'],
    link: 'https://github.com/BradleyNgu/QHacks',
    award: '🏥 QHacks 2025',
    highlights: [
      'Qmove tracks the range of motion (ROM) for injured joints, such as a shoulder after dislocation, using a camera and OpenCV',
      'Records daily progress and feeds the data to a trained Physiotherapist AI, which recommends tailored rehabilitation programs',
      'Visualizes the recovery journey through interactive graphs powered by Streamlit',
      'Users can log in, store their data securely in the cloud using MongoDB, and monitor their improvements over time',
    ],
  },
  {
    id: '7',
    title: 'The Heart Stopper',
    description: 'Gesture-controlled energy drink dispenser using computer vision and Arduino',
    technologies: ['Python', 'OpenCV', 'C++', 'MediaPipe', 'Arduino'],
    link: 'https://github.com/BradleyNgu/Hack-the-Hill',
    award: '🏆 1st for Best uOttawa x Carleton Collaboration @ Hack the Hill II',
    highlights: [
      'The Heart Stopper is a machine that pours a designated amount of energy drink based on how many fingers you hold up to your webcam',
      'Hold up one finger, you just need a slight pick-me-up. Hold up two, a little extra kick is all you need',
      'Hold up 3 or 4, things are starting to get serious. Hold up 5, the situation is dire and you need to lock in',
    ],
  },
  {
    id: '8',
    title: 'NewsBuzz',
    description: 'Real-time news aggregation platform with AI summaries and location-based insights',
    technologies: ['Express.js', 'HTML', 'Node.js', 'React.js', 'CSS'],
    link: 'https://github.com/BradleyNgu/HawkHacks',
    award: '🚀 HawkHacks 2024 - First Hackathon',
    highlights: [
      'NewsBuzz is a dynamic web application designed to provide users with real-time news updates from various categories such as business, entertainment, health, science, sports, and technology',
      'Built with React.js for the front end and Node.js with Express for the backend',
      'Leverages the power of the NewsAPI, OpenAI API, and Google Maps API to offer a visually engaging and informative experience',
    ],
  },
]

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
