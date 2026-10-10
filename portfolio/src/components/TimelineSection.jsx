import React from 'react';
import { Briefcase, GraduationCap, MapPin, Calendar, ExternalLink } from 'lucide-react';

export default function TimelineSection({ experience, education }) {
  const publishedExp = (experience || []).filter((e) => e.published !== false);
  const publishedEdu = (education || []).filter((e) => e.published !== false);

  return (
    <div id="experience">
      {/* Experience Section */}
      <section className="section">
        <div className="portfolio-container">
          <div className="section-header">
            <div className="section-tag">
              <Briefcase size={13} />
              <span>Career Trajectory</span>
            </div>
            <h2 className="section-title">Work Experience</h2>
            <p className="section-subtitle">
              Roles, engineering responsibilities, and systems delivered in industry.
            </p>
          </div>

          <div className="timeline-wrap">
            {publishedExp.map((item) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-card">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h3 className="timeline-role">{item.role}</h3>
                      <div style={{ fontSize: '1rem', color: '#60a5fa', fontWeight: 600, marginTop: '0.2rem' }}>
                        {item.company}
                        {item.companyUrl && (
                          <a
                            href={item.companyUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ marginLeft: '0.4rem', color: '#93c5fd' }}
                            title="Visit website"
                          >
                            <ExternalLink size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />
                          </a>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge" style={{ background: 'var(--pill-bg)', color: 'var(--text-secondary)' }}>
                        <Calendar size={12} />
                        <span>{item.startDate} — {item.currentPosition ? 'Present' : item.endDate || 'N/A'}</span>
                      </span>
                      {item.currentPosition && (
                        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                          Current
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="timeline-meta">
                    {item.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={13} />
                        <span>{item.location}</span>
                      </span>
                    )}
                  </div>

                  {item.description && <p className="timeline-desc">{item.description}</p>}

                  {item.responsibilities && item.responsibilities.length > 0 && (
                    <ul className="timeline-list">
                      {item.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  )}

                  {item.technologies && item.technologies.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                      {item.technologies.map((tech, i) => (
                        <span key={i} className="tech-pill">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="section" id="education" style={{ paddingTop: '2rem' }}>
        <div className="portfolio-container">
          <div className="section-header">
            <div className="section-tag">
              <GraduationCap size={13} />
              <span>Academic Foundations</span>
            </div>
            <h2 className="section-title">Education</h2>
            <p className="section-subtitle">
              Formal engineering education and academic accomplishments.
            </p>
          </div>

          <div className="timeline-wrap">
            {publishedEdu.map((item) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-dot" style={{ background: '#8b5cf6', boxShadow: '0 0 10px #8b5cf6' }} />
                <div className="timeline-card">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h3 className="timeline-role">{item.degree}</h3>
                      <div style={{ fontSize: '1rem', color: '#c084fc', fontWeight: 600, marginTop: '0.2rem' }}>
                        {item.institution}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge" style={{ background: 'var(--pill-bg)', color: 'var(--text-secondary)' }}>
                        <Calendar size={12} />
                        <span>{item.startYear} — {item.endYear || 'Present'}</span>
                      </span>
                      {item.grade && (
                        <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
                          {item.grade}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="timeline-meta">
                    {item.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={13} />
                        <span>{item.location}</span>
                      </span>
                    )}
                  </div>

                  {item.description && <p className="timeline-desc">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
