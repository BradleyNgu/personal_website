import { useEffect, useState } from 'react'

const RESUME_MANIFEST_URL = '/resume/manifest.json'

function getResumeUrl(filename: string) {
  return `/resume/${encodeURIComponent(filename)}`
}

function Resume() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [missingResume, setMissingResume] = useState(false)

  const openResume = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank')
    }
  }

  useEffect(() => {
    let cancelled = false

    const loadResume = async () => {
      try {
        const response = await fetch(RESUME_MANIFEST_URL)
        if (!response.ok) throw new Error('manifest not found')

        const data = (await response.json()) as { file: string | null }
        if (!data.file) {
          if (!cancelled) setMissingResume(true)
          return
        }

        const url = getResumeUrl(data.file)
        if (!cancelled) {
          setResumeUrl(url)
          window.open(url, '_blank')
        }
      } catch {
        if (!cancelled) setMissingResume(true)
      }
    }

    loadResume()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      padding: '20px',
      fontFamily: 'Tahoma, sans-serif',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        background: '#f0f0f0',
        border: '2px outset #d4d4d4',
        borderRadius: '4px',
        maxWidth: '500px',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📄</div>
        {missingResume ? (
          <>
            <h2 style={{ color: '#003c74', margin: '0 0 15px 0' }}>Resume Not Found</h2>
            <p style={{ margin: '0 0 20px 0', color: '#333', fontSize: '14px' }}>
              Add a PDF to the <code>public/resume/</code> folder. Any filename works — the site picks the newest PDF automatically.
            </p>
          </>
        ) : (
          <>
            <h2 style={{ color: '#003c74', margin: '0 0 15px 0' }}>Opening Resume...</h2>
            <p style={{ margin: '0 0 20px 0', color: '#333', fontSize: '14px' }}>
              Your resume should open in a new tab. If it doesn&apos;t open automatically,
              you can click the button below.
            </p>
            <button
              type="button"
              onClick={openResume}
              disabled={!resumeUrl}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(to bottom, #5c95d6 0%, #4f87cc 50%, #3b6fbc 100%)',
                border: '1px solid #0831d9',
                borderRadius: '3px',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: resumeUrl ? 'pointer' : 'not-allowed',
                opacity: resumeUrl ? 1 : 0.6,
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              }}
            >
              Open Resume in New Tab
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Resume
