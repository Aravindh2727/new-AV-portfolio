import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, MapPin, Phone, MessageSquare } from 'lucide-react';
import { sendContactMessage } from '@shared/firebase/queries';

export default function ContactSection({ profile, settings }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Form Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // Basic Client-Side Rate Limiting
    const lastSent = localStorage.getItem('last_contact_ts');
    if (lastSent && Date.now() - Number(lastSent) < 15000) {
      setErrorMsg('Please wait a few seconds before submitting another inquiry.');
      return;
    }

    setSubmitting(true);
    try {
      await sendContactMessage({
        ...formData,
        source: 'portfolio'
      });
      localStorage.setItem('last_contact_ts', String(Date.now()));
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to send message. Please try reaching out via direct email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section" id="contact">
      <div className="portfolio-container">
        <div className="section-header">
          <div className="section-tag">
            <Mail size={13} />
            <span>Get In Touch</span>
          </div>
          <h2 className="section-title">Let's Build Something Together</h2>
          <p className="section-subtitle">
            Have a project in mind, an opportunity to discuss, or just want to connect? Reach out below.
          </p>
        </div>

        <div className="contact-grid">
          {/* Left info column */}
          <div className="contact-card">
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Direct Channels
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '2rem', fontSize: '0.95rem' }}>
              I am typically responsive within 24 hours. Feel free to send an inquiry or message directly through email or professional networks.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {profile?.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</div>
                    <a href={`mailto:${profile.email}`} style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}

              {profile?.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</div>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                      {profile.phone}
                    </span>
                  </div>
                </div>
              )}

              {profile?.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(6, 182, 212, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</div>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                      {profile.location}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Form column */}
          <div className="contact-card">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: '1.25rem' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Message Transmitted!
                </h3>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.75rem', fontSize: '0.95rem' }}>
                  Thank you for reaching out. Your inquiry has been stored securely in Firestore and forwarded to the administrator.
                </p>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  Send a Message
                </h3>

                {errorMsg && (
                  <div style={{
                    backgroundColor: 'rgba(244, 63, 94, 0.15)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: '#f43f5e',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      className="contact-input"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="contact-input"
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    className="contact-input"
                    placeholder="e.g. Project Collaboration or Opportunity"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                    Message *
                  </label>
                  <textarea
                    className="contact-input"
                    rows="5"
                    placeholder="Tell me about your project, idea, or questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.85rem' }}
                  disabled={submitting}
                >
                  <Send size={16} />
                  <span>{submitting ? 'Transmitting Message...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
