import React from 'react';
import {
  ArrowRight,
  Download,
  Mail,
  Github,
  Linkedin,
  Code2,
  Terminal,
  MapPin,
  ExternalLink,
  Twitter,
  Youtube,
  Instagram,
  Facebook,
  Globe
} from 'lucide-react';

const getSocialIcon = (platform = '', size = 18) => {
  const p = platform.toLowerCase();
  if (p.includes('github')) return <Github size={size} />;
  if (p.includes('linkedin')) return <Linkedin size={size} />;
  if (p.includes('leetcode')) return <Code2 size={size} />;
  if (p.includes('hackerrank')) return <Terminal size={size} />;
  if (p.includes('twitter') || p.includes('x.com')) return <Twitter size={size} />;
  if (p.includes('youtube')) return <Youtube size={size} />;
  if (p.includes('instagram')) return <Instagram size={size} />;
  if (p.includes('facebook')) return <Facebook size={size} />;
  return <Globe size={size} />;
};

export default function Hero({ profile }) {
  if (!profile) return null;

  return (
    <section className="hero-section" id="hero">
      <div className="portfolio-container">
        <div className="hero-grid">
          <div>
            {/* Availability Badge */}
            <div className="hero-status-pill">
              <span className="hero-status-pulse" />
              <span>{profile.availabilityStatus || 'Open to Opportunities'}</span>
            </div>

            {/* Name & Title */}
            <h1 className="hero-title">
              Hi, I'm{' '}
              <span className="hero-title-accent">{profile.name || 'Aravindh V'}</span>
            </h1>

            <div className="hero-role">
              {profile.title || 'Full Stack & AI/ML Engineer'}
            </div>

            {/* Bio */}
            <p className="hero-bio">
              {profile.shortBio ||
                'Building intelligent, scalable full-stack applications and high-performance developer systems.'}
            </p>

            {/* Hero Tags */}
            {profile.heroTags && profile.heroTags.length > 0 && (
              <div className="hero-tags-wrap">
                {profile.heroTags.map((tag, idx) => (
                  <span key={idx} className="hero-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="hero-actions">
              <a href="#featured" className="btn-primary">
                <span>Featured Projects</span>
                <ArrowRight size={16} />
              </a>

              <a href="#contact" className="btn-secondary">
                <Mail size={16} />
                <span>Contact Me</span>
              </a>

              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  title="Download Resume / CV"
                >
                  <Download size={16} />
                  <span>Resume</span>
                </a>
              )}
            </div>

            {/* Social Icons Bar */}
            <div className="hero-socials">
              {profile.socialLinks && profile.socialLinks.map((link, idx) => link.url && (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="social-btn"
                  title={`${link.platform} Profile`}
                >
                  {getSocialIcon(link.platform, 18)}
                </a>
              ))}
            </div>
          </div>

          {/* Profile Photo Display */}
          <div className="hero-avatar-card">
            <div className="avatar-frame">
              <img
                src={profile.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'}
                alt={profile.name || 'Developer Avatar'}
                className="avatar-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
