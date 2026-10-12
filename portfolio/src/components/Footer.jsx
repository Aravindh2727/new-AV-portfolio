import React from 'react';
import { Github, Linkedin, Code2, Terminal, ArrowUp, FolderGit2 } from 'lucide-react';

export default function Footer({ profile, settings }) {
  const showcaseUrl = settings?.showcaseUrl || import.meta.env.VITE_SHOWCASE_URL || 'https://av-project-showcase.onrender.com';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="portfolio-footer">
      <div className="footer-inner">
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {profile?.name || 'Aravindh V'}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {settings?.footerText || '© 2026 Aravindh V. Engineered with React, Vite & Firebase.'}
          </p>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <a
            href={showcaseUrl}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <FolderGit2 size={15} />
            <span>Project Showcase</span>
          </a>

          {profile?.socialLinks && profile.socialLinks.map((link, idx) => link.url && link.platform && (
            <a key={idx} href={link.url} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {link.platform}
            </a>
          ))}

          <a href="#contact" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Contact
          </a>

          <button
            onClick={scrollToTop}
            className="social-btn"
            style={{ width: 34, height: 34, marginLeft: '0.5rem' }}
            title="Back to Top"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
