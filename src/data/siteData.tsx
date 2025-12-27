// Centralized data file - Update projects and experiences here
// Changes will automatically reflect in both the display pages and search

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  link: string
  award?: string
  highlights: string[]
}

export interface Experience {
  id: string
  company: string
  position: string
  period: string
  location: string
  logo: string
  responsibilities: string[]
  // Additional keywords for search (optional)
  searchKeywords?: string[]
}

export interface Extracurricular {
  id: string
  organization: string
  position: string
  period: string
  location: string
  logo: string
  responsibilities: string[]
  searchKeywords?: string[]
}

// ===========================================
// PROJECTS - Add new projects here
// ===========================================
export const projects: Project[] = [
  {
    id: '1',
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
    id: '5',
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
    id: '6',
    title: 'Fitness Club Management System',
    description: 'A full-stack fitness club management system with a web interface',
    technologies: ['Python', 'SQLAlchemy', 'PostgreSQL', 'HTML/CSS', 'JavaScript', 'React.js', 'fitness', 'gym', 'health'],
    link: 'https://github.com/COMP3005-Project',
    award: '🎓 Academic Project - 109% Grade',
    highlights: [
      'Full-Stack Gym Management Application - A comprehensive database-driven web application for managing a health and fitness club, built with PostgreSQL backend, Flask REST API, and React frontend (COMP3005 course project)',
      'Three-Tier User System - Supports distinct user roles with separate dashboards and functionality: Members (gym clients), Trainers (fitness instructors), and Admins (facility managers)',
      'Member Features - Members can register accounts, track health metrics (weight, body fat, heart rate), set fitness goals, book personal training sessions, register for group fitness classes, view billing, and access a personalized dashboard',
      'Trainer Features - Trainers can set their availability schedules (date-specific time windows), view their upcoming PT sessions and fitness classes, and search for member profiles including health metrics and fitness goals',
      'Admin Features - Admins manage the entire facility including room booking conflicts, equipment maintenance tracking, fitness class creation, billing generation, payment processing, and comprehensive financial reporting with revenue analytics',
      'Intelligent Scheduling System - Complex availability logic that prevents booking conflicts by checking trainer schedules, room capacity limits (accounting for concurrent PT sessions and fitness classes), business hours (9am-5pm), and trainer availability windows',
      'Modern Tech Stack - Built with Flask + SQLAlchemy ORM (backend), PostgreSQL 14+ (database with triggers and constraints), React + Vite (frontend), bcrypt authentication, and RESTful API architecture with 20+ endpoints',
    ],
  },
  {
    id: '7',
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
    id: '8',
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
    id: '9',
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

// ===========================================
// WORK EXPERIENCE - Add new experiences here
// ===========================================
export const experiences: Experience[] = [
  {
    id: '1',
    company: 'dynaCERT Inc.',
    position: 'Full-Stack Developer',
    period: 'May 2025 – December 2025',
    location: 'Toronto, ON',
    logo: '/assets/icons/dynacert.png',
    responsibilities: [
      'Architected and deployed a full-stack **industrial IoT monitoring dashboard** with **18 RESTful APIs** and **20+ React components**, processing real-time telemetry from a **MySQL backend** for **450+ H2 generator units** across multiple time granularities',
      'Implemented a scalable **Node.js microservices architecture** with **7 controllers** and **9 services**, containerized via **Docker** for development and production, and deployed to hydralytica.com serving live industrial data',
      'Built a comprehensive **data visualization and reporting system** featuring **6 table modules**, **40+ dynamic filters**, and **5 automated Excel export formats**, enabling cross-fleet performance analytics for **120+ enterprise clients**',
      'Developed a **C++ native module** for **binary data parsing**, achieving **10-100x faster processing** compared to JavaScript; integrated with **Node.js** via node-addon-api and supported cross-platform builds (Windows, macOS, Linux) for real-time H2Gen unit telemetry processing',
    ],
    searchKeywords: ['React', 'TypeScript', 'Node.js', 'MySQL', 'Docker', 'C++', 'IoT', 'full stack', 'co-op'],
  },
]

// ===========================================
// EXTRACURRICULAR - Add new activities here
// ===========================================
export const extracurriculars: Extracurricular[] = [
  {
    id: 'cuhacking',
    organization: 'cuHacking',
    position: 'Hacker Experience Team Lead',
    period: 'Sep. 2025 – Present',
    location: 'Ottawa, ON',
    logo: '/assets/icons/cuhacking_logo.jpeg',
    responsibilities: [
      'Coordinate and enhance the participant experience for **300+ hackers** through event planning, workshops, and sponsor engagement initiatives',
      'Collaborate with cross-functional teams to manage logistics, marketing, and hacker communication using **Notion, Discord, and Google Workspace**',
      'Support technical workshops and hackathon preparation events to promote inclusivity and technical growth among university participants',
    ],
    searchKeywords: ['hackathon', 'event planning', 'team lead', 'Notion', 'Discord'],
  },
]

// ===========================================
// HELPER FUNCTIONS
// ===========================================

// Parse markdown-style bold text (**text**) and convert to React elements
export function parseBoldText(text: string): (string | JSX.Element)[] {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

