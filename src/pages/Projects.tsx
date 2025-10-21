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

const projects: Project[] = [
  {
    id: '1',
    title: 'Meido',
    description: 'Full-stack conversational AI desktop application with voice synthesis and anime recommendations',
    technologies: ['Electron', 'JavaScript', 'Node.js', 'Google Gemini AI', 'OAuth', 'Google Cloud', 'Express.js'],
    link: 'https://github.com/BradleyNgu/SolutionHacks',
    award: '🏆 Winner at SolutionHacks - $200 prize (100+ participants)',
    highlights: [
      'Developed full-stack conversational AI desktop application using Node.js/Express backend and Electron frontend, integrating 3+ APIs (Google Gemini AI, Google Cloud TTS, MyAnimeList OAuth) with advanced text-to-speech capabilities',
      'Engineered intelligent recommendation system with custom AI personality using prompt engineering and machine learning parameters, implementing multi-provider TTS synthesis (Google Cloud, Web Speech API)',
      'Implemented secure API architecture with RESTful endpoints, OAuth 2.0 authentication, and modular service layers, delivering 20+ API routes for chat, voice synthesis, and user data management',
    ],
  },
  {
    id: '2',
    title: 'Dumpster Diver',
    description: 'End-to-end automated waste sorting system using machine learning and IoT hardware',
    technologies: ['Python', 'TensorFlow', 'Keras', 'OpenCV', 'JavaScript', 'PHP', 'SQLite', 'Arduino', 'HTML/CSS'],
    link: 'https://github.com/BradleyNgu/cuHacking',
    award: '🏆 Challenge Winner at cuHacking 6 - $300 prize (300+ participants)',
    highlights: [
      'Built an end-to-end automated waste sorting system using TensorFlow, Keras, and OpenCV, integrated with Arduino-controlled hardware for real-time object detection and actuation',
      'Designed and implemented a SQLite database to log classification events, store system activity, and support backend queries for live dashboard updates',
      'Engineered a full-stack IoT data pipeline, enabling seamless communication between hardware, ML models, database, and front-end components',
    ],
  },
  {
    id: '3',
    title: 'Playtopia',
    description: 'Blockchain-based interactive game creation platform with smart contracts and real-time rewards',
    technologies: ['Starknet', 'React', 'Flask', 'OpenCV', 'Python', 'Tailwind', 'Vite', 'TypeScript', 'Cairo'],
    link: 'https://github.com/xavierdmello/Playtopia',
    award: '🥈 2nd Place - Best Use of Starknet at uOttaHack 7 - $2,200 prize (850+ participants)',
    highlights: [
      'Developed an interactive game platform with Starknet smart contracts, React, and Python, supporting 1000+ game sessions and 100+ user-created levels',
      'Integrated OpenCV for real-time ball detection, improving accuracy by 20% and triggering Starknet smart contracts to reward players with STRK tokens',
      'Engineered hardware-software integration with Python for game controllers and real-time blockchain updates, achieving 100% accuracy in tracking game outcomes',
    ],
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
