import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ExternalLink,
  Github,
  ArrowRight,
  Filter,
  Layers,
  Star,
  Sparkles,
  Cpu,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  FolderGit2
} from 'lucide-react';
import { PROJECT_CATEGORIES } from '@shared/constants/categories';
import { sendContactMessage } from '@shared/firebase/queries';

export default function ShowcaseHome({ projects, profile, settings }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTech, setSelectedTech] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('order'); // 'order' | 'newest'

  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  const portfolioUrl = settings?.portfolioUrl || import.meta.env.VITE_PORTFOLIO_URL || 'http://localhost:5173';

  // Extract all unique technologies from published projects
  const allTechnologies = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => {
      if (Array.isArray(p.technologies)) {
        p.technologies.forEach((t) => set.add(t));
      }
    });
    return Array.from(set).sort();
  }, [projects]);

  // Client-side filtering & sorting
  const filteredProjects = useMemo(() => {
    let result = projects.filter((p) => p.published !== false);

    if (featuredOnly) {
      result = result.filter((p) => p.featured === true);
    }

    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedTech) {
      result = result.filter((p) =>
        p.technologies?.some(
          (t) => t.toLowerCase() === selectedTech.toLowerCase()
        )
      );
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.technologies?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else {
      result.sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
    }

    return result;
  }, [projects, featuredOnly, selectedCategory, selectedTech, searchTerm, sortBy]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactError('');

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactError('Please complete all required fields.');
      return;
    }

    setContactSubmitting(true);
    try {
      await sendContactMessage({
        ...contactForm,
        source: 'showcase'
      });
      setContactSuccess(true);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setContactError('Failed to send message. Please try again.');
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="showcase-hero">
        <div className="showcase-container">
          <div className="hero-pill-badge">
            <Cpu size={14} />
            <span>Developer Works & Architectural Demos</span>
          </div>

          <h1 className="showcase-hero-title">
            PROJECT <span className="gradient-text-emerald">SHOWCASE</span>
          </h1>

          <p className="showcase-hero-sub">
            A comprehensive gallery of production web applications, machine learning diagnostics, edge monitors, and developer utilities engineered by {profile?.name || 'Aravindh V'}.
          </p>

          {/* Quick Metrics Counter */}
          <div className="showcase-stats-row">
            <div className="showcase-stat-item">
              <span className="showcase-stat-val">{projects.length}+</span>
              <span className="showcase-stat-lbl">Built Applications</span>
            </div>
            <div className="showcase-stat-item">
              <span className="showcase-stat-val">{allTechnologies.length}+</span>
              <span className="showcase-stat-lbl">Technologies Used</span>
            </div>
            <div className="showcase-stat-item">
              <span className="showcase-stat-val">
                {projects.filter((p) => p.liveUrl).length}+
              </span>
              <span className="showcase-stat-lbl">Live Deployments</span>
            </div>
            <div className="showcase-stat-item">
              <span className="showcase-stat-val">100%</span>
              <span className="showcase-stat-lbl">Firestore Connected</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#gallery" className="cat-tab-btn active" style={{ padding: '0.65rem 1.4rem', textAlign: 'center', flex: '1 1 auto' }}>
              Explore Projects ({filteredProjects.length})
            </a>
            <a href={portfolioUrl} target="_blank" rel="noreferrer" className="cat-tab-btn" style={{ padding: '0.65rem 1.4rem', textAlign: 'center', flex: '1 1 auto', whiteSpace: 'normal', height: 'auto' }}>
              View Developer Bio on Portfolio ↗
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Controls (Search, Categories, Technologies, Sort) */}
      <section className="showcase-container" id="gallery">
        <div className="gallery-controls-card">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Search Input */}
            <div className="search-input-wrap" style={{ flex: '1 1 100%', minWidth: 0 }}>
              <input
                type="text"
                className="search-field"
                placeholder="Search projects by name, technology, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                size={18}
                color="#64748b"
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Featured toggle & Sort select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                className={`cat-tab-btn ${featuredOnly ? 'active' : ''}`}
                onClick={() => setFeaturedOnly(!featuredOnly)}
              >
                <Star size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                <span>Featured Only</span>
              </button>

              <select
                className="search-field"
                style={{ width: 'auto', padding: '0.6rem 1rem' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="order">Sort: Curated Order</option>
                <option value="newest">Sort: Newest First</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs-row">
            {PROJECT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cat-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Technology Pills Filter Bar */}
          {allTechnologies.length > 0 && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-tech)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '0.25rem' }}>
                Tech Tag:
              </span>
              <button
                className={`tech-tag ${selectedTech === '' ? 'active' : ''}`}
                style={{ cursor: 'pointer', borderColor: selectedTech === '' ? '#10b981' : undefined }}
                onClick={() => setSelectedTech('')}
              >
                All Tech
              </button>
              {allTechnologies.slice(0, 14).map((tech) => (
                <button
                  key={tech}
                  className="tech-tag"
                  style={{
                    cursor: 'pointer',
                    borderColor: selectedTech === tech ? '#10b981' : undefined,
                    color: selectedTech === tech ? '#34d399' : undefined,
                    background: selectedTech === tech ? 'rgba(16,185,129,0.15)' : undefined
                  }}
                  onClick={() => setSelectedTech(selectedTech === tech ? '' : tech)}
                >
                  {tech}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        {filteredProjects.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-tech)',
            borderRadius: '16px',
            padding: '4rem 2rem',
            textAlign: 'center',
            marginBottom: '4rem'
          }}>
            <Layers size={40} color="#64748b" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-pure)' }}>No projects found</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem', maxWidth: '400px', margin: '0.35rem auto 1.5rem auto' }}>
              No projects match your current filters. Try resetting your search query or selecting a different category.
            </p>
            <button
              className="cat-tab-btn active"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedTech('');
                setFeaturedOnly(false);
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="gallery-grid">
            {filteredProjects.map((proj) => (
              <div key={proj.id || proj.slug} className="gallery-card">
                {/* Thumbnail */}
                <div className="gallery-thumb-box">
                  {proj.thumbnailUrl ? (
                    <img
                      src={proj.thumbnailUrl}
                      alt={proj.title}
                      className="gallery-thumb-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                      <Layers size={36} />
                    </div>
                  )}
                  {proj.featured && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(7, 10, 18, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#f59e0b',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '9999px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      <Star size={11} fill="#f59e0b" />
                      <span>Featured</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="gallery-card-content">
                  <div className="gallery-card-meta">
                    <span className="cat-pill">{proj.category}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                      #{proj.displayOrder}
                    </span>
                  </div>

                  <h3 className="gallery-card-title">{proj.title}</h3>
                  <p className="gallery-card-desc">{proj.shortDescription}</p>

                  {/* Tech tags */}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="gallery-tech-pills">
                      {proj.technologies.slice(0, 5).map((tech, i) => (
                        <span key={i} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="gallery-card-footer">
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="cat-tab-btn"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          title="Open Live Website"
                        >
                          <span>Live</span>
                          <ExternalLink size={11} style={{ display: 'inline', marginLeft: '3px' }} />
                        </a>
                      )}

                      {proj.portalLinks && proj.portalLinks.map((portal, pIdx) => portal.url && (
                        <a
                          key={pIdx}
                          href={portal.url}
                          target="_blank"
                          rel="noreferrer"
                          className="cat-tab-btn"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          title={portal.label || 'Open Portal'}
                        >
                          <span>{portal.label || 'Portal'}</span>
                          <ExternalLink size={11} style={{ display: 'inline', marginLeft: '3px' }} />
                        </a>
                      ))}

                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="cat-tab-btn"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          title="View GitHub Repository"
                        >
                          <Github size={12} style={{ display: 'inline', marginRight: '3px' }} />
                          <span>Code</span>
                        </a>
                      )}
                    </div>

                    <Link
                      to={`/projects/${proj.slug || proj.id}`}
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#34d399',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                      title="View deep architecture and features"
                    >
                      <span>Details</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact CTA Section */}
      <section className="showcase-container" id="contact" style={{ marginBottom: '5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 182, 212, 0.05))',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '20px',
          padding: '3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: '2.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <FolderGit2 size={20} color="#34d399" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Engineering Inquiry
              </span>
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-pure)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Have a project or technical architecture in mind?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.75rem', lineHeight: '1.7' }}>
              Whether you need scalable cloud full-stack development, applied machine learning systems, or robust API backends, let's connect and build it.
            </p>

            <div style={{ marginTop: '2rem' }}>
              <a href={portfolioUrl} target="_blank" rel="noreferrer" className="btn-portfolio-back" style={{ whiteSpace: 'normal', height: 'auto', textAlign: 'center' }}>
                <span>View Full Resume & Credentials on Portfolio</span>
                <ExternalLink size={13} style={{ flexShrink: 0 }} />
              </a>
            </div>
          </div>

          <div>
            {contactSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-pure)' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem', fontSize: '0.9rem' }}>
                  Your inquiry has been stored securely in Cloud Firestore.
                </p>
                <button
                  className="cat-tab-btn"
                  style={{ marginTop: '1rem' }}
                  onClick={() => setContactSuccess(false)}
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {contactError && (
                  <div style={{ color: '#f43f5e', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertCircle size={15} />
                    <span>{contactError}</span>
                  </div>
                )}

                <div className="contact-inputs-grid">
                  <input
                    type="text"
                    className="search-field"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="Your Name *"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                  />
                  <input
                    type="email"
                    className="search-field"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="Your Email *"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                  />
                </div>

                <input
                  type="text"
                  className="search-field"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="Subject / Project Scope"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                />

                <textarea
                  className="search-field"
                  style={{ paddingLeft: '1rem', minHeight: '100px', resize: 'vertical' }}
                  placeholder="Describe your inquiry..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                />

                <button
                  type="submit"
                  className="cat-tab-btn active"
                  style={{ padding: '0.8rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  disabled={contactSubmitting}
                >
                  <Send size={15} />
                  <span>{contactSubmitting ? 'Transmitting...' : 'Send Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
