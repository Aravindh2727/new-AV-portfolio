import React from 'react';
import { User, MapPin, Award, CheckCircle, Zap } from 'lucide-react';

export default function AboutSection({ profile }) {
  if (!profile) return null;

  const stats = profile.stats || {};
  const hasStats = Boolean(
    stats.yearsExperience ||
    stats.projectsCompleted ||
    stats.technologiesMastered ||
    stats.contributions
  );

  return (
    <section className="section" id="about">
      <div className="portfolio-container">
        <div className="section-header">
          <div className="section-tag">
            <User size={13} />
            <span>Identity & Background</span>
          </div>
          <h2 className="section-title">Architecting Products with Precision</h2>
          <p className="section-subtitle">
            Bridging frontend craftsmanship with distributed cloud infrastructure.
          </p>
        </div>

        <div className="about-card">
          <div style={{ display: 'grid', gridTemplateColumns: hasStats ? 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))' : '1fr', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Engineering from First Principles
              </h3>
              {profile.about && (
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.025rem', marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
                  {profile.about}
                </p>
              )}

              {profile.location && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#60a5fa', fontSize: '0.9rem', fontWeight: 600 }}>
                  <MapPin size={16} />
                  <span>Based in {profile.location}</span>
                </div>
              )}
            </div>

            {/* Metrics & Highlights */}
            {hasStats && (
              <div>
                <div className="stats-grid" style={{ marginTop: 0 }}>
                  {stats.yearsExperience && (
                    <div className="stat-box">
                      <div className="stat-number">{stats.yearsExperience}</div>
                      <div className="stat-label">Years Experience</div>
                    </div>
                  )}
                  {stats.projectsCompleted && (
                    <div className="stat-box">
                      <div className="stat-number">{stats.projectsCompleted}</div>
                      <div className="stat-label">Production Projects</div>
                    </div>
                  )}
                  {stats.technologiesMastered && (
                    <div className="stat-box">
                      <div className="stat-number">{stats.technologiesMastered}</div>
                      <div className="stat-label">Tech Stack Tools</div>
                    </div>
                  )}
                  {stats.contributions && (
                    <div className="stat-box">
                      <div className="stat-number">{stats.contributions}</div>
                      <div className="stat-label">Git Contributions</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
