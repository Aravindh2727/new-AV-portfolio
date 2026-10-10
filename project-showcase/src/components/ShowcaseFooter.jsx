import React from 'react';
import { Github, Linkedin, ExternalLink, ArrowUp, User } from 'lucide-react';

export default function ShowcaseFooter({ profile, settings }) {
  const portfolioUrl = settings?.portfolioUrl || import.meta.env.VITE_PORTFOLIO_URL || 'http://localhost:5173';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="showcase-footer">
      <div className="showcase-footer-inner">
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-pure)', marginBottom: '0.2rem' }}>
            PROJECT SHOWCASE // {profile?.name || 'Aravindh V'}
          </div>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            {settings?.footerText || '© 2026 Aravindh V. Engineered with React, Vite & Cloud Firestore.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <User size={14} />
            <span>Portfolio</span>
            <ExternalLink size={12} />
          </a>

          {profile?.socialLinks && profile.socialLinks.map((link, idx) => link.url && link.platform && (
            <a key={idx} href={link.url} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {link.platform}
            </a>
          ))}

          <a href="#contact" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Contact
          </a>

          <button
            onClick={scrollToTop}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: 'var(--pill-bg)',
              border: '1px solid var(--border-tech)',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Scroll to Top"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
