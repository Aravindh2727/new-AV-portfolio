import React, { useState, useEffect } from 'react';
import { ExternalLink, Menu, X, Sparkles, FolderGit2 } from 'lucide-react';
import ThemeToggle from '@shared/theme/ThemeToggle';

export default function Navbar({ profile, settings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showcaseUrl = settings?.showcaseUrl || import.meta.env.VITE_SHOWCASE_URL || 'http://localhost:5174';

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Education', href: '#education' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Featured Work', href: '#featured' },
    { label: 'Contact', href: '#contact' }
  ];

  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    const sectionIds = navItems.map(item => item.href.substring(1));
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="portfolio-navbar">
      <div className="portfolio-nav-inner">
        <a href="#" className="nav-brand">
          <img 
            src="/AV logo icon new.png" 
            alt="Portfolio Logo" 
            style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'contain' }} 
          />
          <span>
            {profile?.name ? profile.name.split(' ')[0] : 'Aravindh'}
          </span>
        </a>

        <nav>
          <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            {navItems.map((item) => (
              <li key={item.label}>
                <a 
                  href={item.href} 
                  className={`nav-link ${activeSection === item.href.substring(1) ? 'active' : ''}`} 
                  onClick={handleLinkClick}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-cta">
          {/* Lamp Theme Toggle */}
          <ThemeToggle />

          <a
            href={showcaseUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-showcase"
            title="Open Project Showcase Website"
          >
            <img src="/av project logo.png" alt="Showcase Logo" style={{ width: 16, height: 16, borderRadius: 2, objectFit: 'contain' }} />
            <span>Project Showcase</span>
            <ExternalLink size={12} />
          </a>

          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}
