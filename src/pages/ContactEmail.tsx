import { useState } from 'react'
import '../styles/pages.css'

function ContactEmail() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    try {
      // Using FormSubmit.co - a free form backend service
      const response = await fetch('https://formsubmit.co/bradleynguyen2004@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _captcha: 'false', // Disable captcha
          _template: 'table', // Use table template for better formatting
        }),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 5000)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📧 Send Me an Email</h1>
      </div>

      <div className="email-form-container">
        <div className="email-intro">
          <p>Have a question or want to work together? Fill out the form below and I'll get back to you as soon as possible!</p>
          <p className="email-direct">Or email me directly at: <strong>bradleynguyen2004@gmail.com</strong></p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="name">Your Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="John Doe"
                disabled={status === 'sending'}
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Your Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="john@example.com"
                disabled={status === 'sending'}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="subject">Subject *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="What's this about?"
              disabled={status === 'sending'}
            />
          </div>

          <div className="form-field">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="form-textarea"
              rows={8}
              placeholder="Your message here..."
              disabled={status === 'sending'}
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="send-button"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <div className="status-message success">
                ✓ Message sent successfully! I'll get back to you soon.
              </div>
            )}

            {status === 'error' && (
              <div className="status-message error">
                ✗ Failed to send message. Please try again or email me directly.
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactEmail

