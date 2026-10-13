import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Play,
  Video,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Layers,
  ArrowRight,
  User,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { getProjectBySlug, getProjects } from '@shared/firebase/queries';

export default function ProjectDetails({ profile, settings }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);

  const portfolioUrl = settings?.portfolioUrl || import.meta.env.VITE_PORTFOLIO_URL || 'https://av-portfolio-08j7.onrender.com';

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const current = await getProjectBySlug(slug, { publishedOnly: true });
        if (!current) {
          setProject(null);
          return;
        }

        setProject(current);

        // Fetch related projects from the same category
        try {
          const all = await getProjects({ publishedOnly: true });
          const related = all
            .filter((p) => p.slug !== current.slug && p.id !== current.id && p.category === current.category)
            .slice(0, 3);
          setRelatedProjects(related);
        } catch (relErr) {
          console.warn('Failed to load related projects:', relErr);
        }

        // Set document title dynamically for SEO
        document.title = `${current.title} | ${profile?.name || 'Aravindh V'} Engineering`;
      } catch (err) {
        console.error('Failed to load project details:', err);
        setError(err.message || 'Failed to connect to the showcase repository.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, profile]);

  if (loading) {
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{
          width: 44,
          height: 44,
          border: '3px solid rgba(16, 185, 129, 0.2)',
          borderTopColor: '#10b981',
          borderRadius: '50%',
          animation: 'details-spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes details-spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: '0.95rem', fontWeight: 500, letterSpacing: '0.02em' }}>
          Loading project architecture...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="showcase-container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div style={{
          maxWidth: '520px',
          margin: '0 auto',
          background: 'var(--bg-card)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '3rem 2rem'
        }}>
          <AlertTriangle size={44} color="#ef4444" style={{ margin: '0 auto 1.25rem auto' }} />
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-pure)', marginBottom: '0.75rem', fontWeight: 800 }}>
            Unable to Load Project
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
            {error}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.reload()}
              className="cat-tab-btn active"
              style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}
            >
              Retry Connection
            </button>
            <Link to="/" className="cat-tab-btn" style={{ padding: '0.75rem 1.5rem' }}>
              ← Back to Showcase
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="showcase-container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div style={{
          maxWidth: '540px',
          margin: '0 auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-tech)',
          borderRadius: '16px',
          padding: '3.5rem 2rem'
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}>
            <Layers size={28} color="#34d399" />
          </div>
          <h2 style={{ fontSize: '1.85rem', color: 'var(--text-pure)', marginBottom: '0.75rem', fontWeight: 800 }}>
            Project Not Found
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
            The project slug <code style={{ color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontFamily: 'monospace' }}>"{slug}"</code> does not exist in the database or has not been published yet.
          </p>
          <Link to="/" className="cat-tab-btn active" style={{ padding: '0.75rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Project Showcase</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="showcase-container">
      {/* Header & Breadcrumbs */}
      <div className="details-page-header">
        <div className="breadcrumbs-bar">
          <Link to="/" style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ArrowLeft size={14} />
            <span>Showcase</span>
          </Link>
          <span>/</span>
          <span>{project.category}</span>
          <span>/</span>
          <span style={{ color: 'var(--text-pure)' }}>{project.title}</span>
        </div>

        <div className="details-title-row">
          <div>
            <span className="cat-pill" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
              {project.category}
            </span>
            <h1 className="details-main-title">{project.title}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', marginTop: '0.5rem', maxWidth: '780px' }}>
              {project.shortDescription}
            </p>
          </div>

          {/* Action Links */}
          <div className="details-action-buttons">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="cat-tab-btn active"
                style={{ padding: '0.65rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <span>Live Website</span>
                <ExternalLink size={14} />
              </a>
            )}

            {project.portalLinks && project.portalLinks.map((portal, pIdx) => portal.url && (
              <a
                key={pIdx}
                href={portal.url}
                target="_blank"
                rel="noreferrer"
                className="cat-tab-btn active"
                style={{ padding: '0.65rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                title={portal.label || 'Portal'}
              >
                <span>{portal.label || 'Portal'}</span>
                <ExternalLink size={14} />
              </a>
            ))}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="cat-tab-btn"
                style={{ padding: '0.65rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Github size={15} />
                <span>Source Code</span>
              </a>
            )}

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="cat-tab-btn"
                style={{ padding: '0.65rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Play size={14} />
                <span>Interactive Demo</span>
              </a>
            )}

            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="cat-tab-btn"
                style={{ padding: '0.65rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Video size={14} />
                <span>Video Walkthrough</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Sidebar */}
      <div className="details-grid-layout">
        <div>
          {/* Hero Banner Image */}
          {project.thumbnailUrl && (
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="details-banner-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';
              }}
            />
          )}

          {/* Problem & Solution Comparative Breakdown */}
          {(project.problem || project.solution) && (
            <div className="problem-solution-grid">
              {project.problem && (
                <div className="problem-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f43f5e', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <AlertTriangle size={18} />
                    <span>Problem Statement</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
                    {project.problem}
                  </p>
                </div>
              )}

              {project.solution && (
                <div className="solution-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <Lightbulb size={18} />
                    <span>Engineered Solution</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
                    {project.solution}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Full Description */}
          {project.description && (
            <div className="spec-box">
              <h3 className="spec-box-title">
                <Cpu size={18} color="#34d399" />
                <span>System Overview & Architecture</span>
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {project.description}
              </p>
            </div>
          )}

          {/* Key Features Checklist */}
          {project.features && project.features.length > 0 && (
            <div className="spec-box">
              <h3 className="spec-box-title">
                <CheckCircle2 size={18} color="#10b981" />
                <span>Key Engineering Features</span>
              </h3>
              <ul className="features-check-list">
                {project.features.map((feat, idx) => (
                  <li key={idx} className="features-check-item">
                    <span style={{ color: '#10b981', marginTop: '3px' }}>✔</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Screenshots Gallery with Lightbox */}
          {project.screenshots && project.screenshots.length > 0 && (
            <div className="spec-box">
              <h3 className="spec-box-title">
                <ImageIcon size={18} color="#06b6d4" />
                <span>Screenshots & System Previews</span>
              </h3>
              <div className="screenshots-row">
                {project.screenshots.map((imgUrl, i) => (
                  <div
                    key={i}
                    className="screenshot-item"
                    onClick={() => setActiveLightboxImg(imgUrl)}
                    title="Click to inspect full resolution"
                  >
                    <img src={imgUrl} alt={`Screenshot ${i + 1}`} className="screenshot-img" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div style={{ marginTop: '3rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '1.25rem' }}>
                Related {project.category} Projects
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {relatedProjects.map((rel) => (
                  <Link
                    key={rel.id}
                    to={`/projects/${rel.slug}`}
                    className="gallery-card"
                    style={{ padding: '1.25rem' }}
                  >
                    <div style={{ fontSize: '0.75rem', color: '#06b6d4', textTransform: 'uppercase', fontWeight: 700 }}>
                      {rel.category}
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-pure)', margin: '0.35rem 0' }}>
                      {rel.title}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {rel.shortDescription?.slice(0, 90)}...
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside>
          <div className="author-card">
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Technologies Deployed
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '2rem' }}>
              {project.technologies?.map((tech, i) => (
                <span key={i} className="tech-tag" style={{ color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
                  {tech}
                </span>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-tech)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                About the Developer
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <img
                  src={
                    profile?.profileImage &&
                    !profile.profileImage.includes('unsplash.com') &&
                    !profile.profileImage.includes('photo-1507003211169') &&
                    !profile.profileImage.includes('photo-1534528741775')
                      ? profile.profileImage
                      : '/avatar.jpg'
                  }
                  alt={profile?.name || 'Aravindh'}
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-tech)' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/avatar.jpg';
                  }}
                />
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-pure)', fontSize: '0.95rem' }}>
                    {profile?.name || 'Aravindh V'}
                  </div>
                  {profile?.title && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {profile.title}
                    </div>
                  )}
                </div>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
                {profile?.shortBio}
              </p>
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="cat-tab-btn active"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.825rem', padding: '0.65rem' }}
              >
                <User size={13} />
                <span>Visit Main Portfolio</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div style={{ borderTop: '1px solid var(--border-tech)', paddingTop: '1.25rem' }}>
              <Link
                to="/"
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 600
                }}
              >
                <ArrowLeft size={14} />
                <span>Back to All Projects</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Lightbox Modal for Screenshots */}
      {activeLightboxImg && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
          onClick={() => setActiveLightboxImg(null)}
        >
          <button
            onClick={() => setActiveLightboxImg(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: 'var(--text-pure)',
              cursor: 'pointer'
            }}
          >
            <X size={28} />
          </button>
          <img
            src={activeLightboxImg}
            alt="Fullscreen preview"
            style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: '12px', border: '1px solid var(--border-tech)', objectFit: 'contain' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
