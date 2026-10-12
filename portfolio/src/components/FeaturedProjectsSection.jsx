import React from 'react';
import {
  ExternalLink,
  Github,
  FolderGit2,
  ArrowRight,
  Sparkles,
  Layers,
  Star
} from 'lucide-react';

export default function FeaturedProjectsSection({ projects, settings }) {
  const showcaseBaseUrl = settings?.showcaseUrl || import.meta.env.VITE_SHOWCASE_URL || 'http://localhost:5174';

  // Strict filter: only published == true && featured == true
  const featuredList = (projects || []).filter(
    (p) => p.published === true && p.featured === true
  );

  return (
    <section className="section" id="featured">
      <div className="portfolio-container">
        <div className="section-header">
          <div className="section-tag">
            <Star size={13} />
            <span>Curated Showcase</span>
          </div>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            Highlighting selected production applications, AI solutions, and developer systems.
          </p>
        </div>

        {/* Projects Cards Grid */}
        {featuredList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No featured projects configured yet. Visit the Admin Portal to feature projects.
          </div>
        ) : (
          <div className="projects-grid">
            {featuredList.map((proj) => {
              const detailsUrl = `${showcaseBaseUrl}/projects/${proj.slug}`;

              return (
                <div key={proj.id || proj.slug} className="project-card">
                  {/* Thumbnail */}
                  <div className="project-thumb-wrap">
                    {proj.thumbnailUrl ? (
                      <img
                        src={proj.thumbnailUrl}
                        alt={proj.title}
                        className="project-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <Layers size={36} />
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="project-body">
                    <div className="project-category-badge">{proj.category}</div>
                    <h3 className="project-title">{proj.title}</h3>
                    <p className="project-desc">{proj.shortDescription}</p>

                    {/* Technologies Pills */}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="project-tech-pills">
                        {proj.technologies.slice(0, 5).map((tech, i) => (
                          <span key={i} className="tech-pill">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="project-card-actions">
                      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            title="Open Live Website"
                          >
                            <span>Live Demo</span>
                            <ExternalLink size={12} />
                          </a>
                        )}

                        {proj.portalLinks && proj.portalLinks.map((portal, pIdx) => portal.url && (
                          <a
                            key={pIdx}
                            href={portal.url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            title={portal.label || 'Open Portal'}
                          >
                            <span>{portal.label || 'Portal'}</span>
                            <ExternalLink size={12} />
                          </a>
                        ))}

                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            title="View GitHub Repository"
                          >
                            <Github size={13} />
                            <span>Code</span>
                          </a>
                        )}
                      </div>

                      {/* View Deep Details on Project Showcase */}
                      <a
                        href={detailsUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: '0.825rem',
                          fontWeight: 700,
                          color: '#60a5fa',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                        title="View comprehensive engineering breakdown on Project Showcase"
                      >
                        <span>Details</span>
                        <ArrowRight size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Prominent Banner CTA to Project Showcase */}
        <div className="showcase-banner-cta">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <FolderGit2 size={20} color="#34d399" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Dedicated Project Showcase
              </span>
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Looking for more architectures and source code?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem', maxWidth: '650px' }}>
              Explore the standalone Project Showcase website featuring interactive category filtering, live tech stacks, system design breakdowns, and deep problem/solution documentation.
            </p>
          </div>

          <a
            href={showcaseBaseUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.35)'
            }}
          >
            <span>Explore All Projects in Showcase</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
