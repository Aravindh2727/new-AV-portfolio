import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, ArrowLeft, ExternalLink, Sparkles, User, Mail, Menu, X } from 'lucide-react';
import ThemeToggle from '@shared/theme/ThemeToggle';

export default function ShowcaseNavbar({ settings }) {
  const portfolioUrl = settings?.portfolioUrl || import.meta.env.VITE_PORTFOLIO_URL || 'http://localhost:5173';

  return (
    <header className="showcase-navbar">
      <div className="showcase-nav-inner">
        <Link to="/" className="showcase-brand">
          <img 
            src="/av project logo.png" 
            alt="Showcase Logo" 
            style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'contain' }} 
          />
          <span className="showcase-brand-text" style={{ color: 'var(--text-pure)' }}>ENGINEERING</span>
          <span className="showcase-brand-tag">SHOWCASE</span>
        </Link>

        <div className="showcase-nav-actions">
          <ThemeToggle />

          <a
            href={portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-portfolio-back"
            title="Return to Personal Developer Portfolio"
          >
            <img src="/AV logo icon new.png" alt="Portfolio Logo" style={{ width: 16, height: 16, borderRadius: 2, objectFit: 'contain' }} />
            <span className="portfolio-link-text">My Portfolio</span>
            <ExternalLink size={12} />
          </a>

          <a
            href="#contact"
            className="showcase-contact-link"
          >
            <Mail size={15} />
            <span className="contact-link-text">Contact</span>
          </a>
        </div>
      </div>
    </header>
  );
}
