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
    content: 'Hi! I\'m Bradley Nguyen, a Computer Science student at Carleton University pursuing a Bachelor\'s degree in the Honours Co-op program with a Software Engineering stream. I\'m passionate about building IoT systems and software/hardware solutions that solve real-world problems.\n\n Outside of school, I do a lot of hackathons on the side, in which I have won over $2,700 in prizes competing against 1000+ participants. Other than working with tech, I\'m interested in F1, sim racing, and playing volleyball.',
  },
  {
    id: '2',
    title: 'Education',
    content: 'Carleton University\nBachelor of Computer Science, Honours Program (Co-op)\nSoftware Engineering Stream\n2023 - 2027\nMajor CGPA: 3.77/4.0',
  },
  {
    id: '3',
    title: 'Technical Skills',
    content: 'Languages:\nJava, Python, C/C++, SQL, JavaScript, TypeScript, HTML/CSS\n\nFrameworks & Libraries:\nReact, Node.js, Express.js, Flask, Tailwind, Vite, MongoDB, Electron\n\nDeveloper Tools:\nGit, GitHub, Docker, Postman, Google Cloud Platform, Microsoft Azure, Linux/Unix, Jira, Excel',
  },
  {
    id: '4',
    title: 'Achievements',
    content: '🏆 Winner at SolutionHacks 2025 - $200 prize\n🏆 Challenge Winner at cuHacking 6 - $300 prize\n🥈 2nd Place at uOttaHack 7 (Best Use of Starknet) - $2,200 prize',
  },
  {
    id: '5',
    title: 'Contact',
    content: '📧 Email: bradleynguyen2004@gmail.com\n📱 Phone: 647-686-9717\n💼 LinkedIn: linkedin.com/in/bradley-nguyen-cs\n👨‍💻 GitHub: github.com/bradleyngu\n\nFeel free to reach out for collaboration opportunities, project discussions, or just to connect!',
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
              {section.id === '5' ? (
                // Special handling for contact section with hyperlinks
                <div>
                  <p>📧 Email: <a href="mailto:bradleynguyen2004@gmail.com">bradleynguyen2004@gmail.com</a></p>
                  <p>📱 Phone: <a href="tel:647-686-9717">647-686-9717</a></p>
                  <p>💼 LinkedIn: <a href="https://linkedin.com/in/bradley-nguyen-cs" target="_blank" rel="noopener noreferrer">linkedin.com/in/bradley-nguyen-cs</a></p>
                  <p>👨‍💻 GitHub: <a href="https://github.com/bradleyngu" target="_blank" rel="noopener noreferrer">github.com/bradleyngu</a></p>
                  <p></p>
                  <p>Feel free to reach out for collaboration opportunities, project discussions, or just to connect!</p>
                </div>
              ) : (
                section.content.split('\n').map((line, idx) => (
                  <p key={idx}>{line || '\u00A0'}</p>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Autobiography
