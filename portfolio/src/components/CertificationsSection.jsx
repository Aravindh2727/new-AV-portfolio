import React from 'react';
import { Award, Trophy, ExternalLink, Calendar } from 'lucide-react';

export default function CertificationsSection({
  certifications,
  achievements,
  showCertifications = true,
  showAchievements = true
}) {
  const publishedCerts = (certifications || []).filter((c) => c.published !== false);
  const publishedAchs = (achievements || []).filter((a) => a.published !== false);

  if (!showCertifications && !showAchievements) return null;

  return (
    <section className="section" id="certifications">
      <div className="portfolio-container">
        {/* Certifications Block */}
        {showCertifications && (
          <>
            <div className="section-header">
              <div className="section-tag">
                <Award size={13} />
                <span>Verified Credentials</span>
              </div>
              <h2 className="section-title">Certifications & Specializations</h2>
              <p className="section-subtitle">
                Industry accredited certifications in cloud computing, front-end architecture, and AI.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem', marginBottom: showAchievements && publishedAchs.length > 0 ? '5rem' : 0 }}>
              {publishedCerts.map((cert) => (
                <div key={cert.id} className="about-card" style={{ padding: '1.75rem', marginBottom: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                {cert.imageUrl ? (
                  <img
                    src={cert.imageUrl}
                    alt={cert.name}
                    style={{ width: 54, height: 54, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border-subtle)' }}
                  />
                ) : (
                  <div style={{ width: 54, height: 54, borderRadius: 10, background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                    <Award size={26} />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cert.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#60a5fa', fontWeight: 600, marginTop: '0.2rem' }}>
                    {cert.issuer}
                  </div>
                </div>
              </div>

              {cert.description && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem', flex: 1 }}>
                  {cert.description}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Issued: {cert.issueDate || 'Verified'}
                </span>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="badge"
                    style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', gap: '0.35rem' }}
                  >
                    <span>View Credential</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </>
    )}

        {/* Honors & Achievements Block */}
        {showAchievements && publishedAchs.length > 0 && (
          <>
            <div className="section-header" id="achievements">
              <div className="section-tag" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.25)' }}>
                <Trophy size={13} />
                <span>Honors & Milestones</span>
              </div>
              <h2 className="section-title">Key Achievements</h2>
              <p className="section-subtitle">
                Hackathons, algorithmic milestones, and technical presentations.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
              {publishedAchs.map((ach) => (
                <div key={ach.id} className="about-card" style={{ padding: '1.75rem', marginBottom: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                    {ach.imageUrl ? (
                      <img
                        src={ach.imageUrl}
                        alt={ach.title}
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-subtle)' }}
                      />
                    ) : (
                      <div style={{ width: 50, height: 50, borderRadius: 8, background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
                        <Trophy size={24} />
                      </div>
                    )}
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{ach.title}</h3>
                      <div style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 600, marginTop: '0.15rem' }}>
                        {ach.organization} {ach.date ? `• ${ach.date}` : ''}
                      </div>
                    </div>
                  </div>

                  {ach.description && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
                      {ach.description}
                    </p>
                  )}

                  {ach.url && (
                    <a
                      href={ach.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.825rem', color: '#60a5fa', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
                    >
                      <span>Proof / Link</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
