import React, { useState } from 'react';
import {
  ArrowRight,
  Download,
  Mail,
  Eye,
  Loader2,
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
import ResumeModal from './ResumeModal';

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
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadResume = async (e) => {
    if (e) e.preventDefault();
    if (!profile?.resumeUrl || isDownloading) return;

    setIsDownloading(true);
    const fileName = `${(profile.name || 'Aravindh_V').replace(/\s+/g, '_')}_Resume.pdf`;

    try {
      const response = await fetch(profile.resumeUrl);
      if (!response.ok) throw new Error('Fetch failed');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1500);
    } catch (err) {
      console.warn('Direct blob download fallback to attachment URL:', err);
      let downloadUrl = profile.resumeUrl;
      if (downloadUrl.includes('cloudinary.com') && downloadUrl.includes('/upload/')) {
        const cleanBase = fileName.replace(/\.[^/.]+$/, '');
        downloadUrl = downloadUrl.replace('/upload/', `/upload/fl_attachment:${encodeURIComponent(cleanBase)}/`);
      }
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

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

            {profile.title && (
              <div className="hero-role">
                {profile.title}
              </div>
            )}

            {/* Bio */}
            {profile.shortBio && (
              <p className="hero-bio">
                {profile.shortBio}
              </p>
            )}

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
                <div className="resume-btn-group">
                  <button
                    type="button"
                    onClick={() => setIsResumeModalOpen(true)}
                    className="btn-secondary btn-resume-preview"
                    title="Preview Resume in modal"
                    id="hero-preview-resume-btn"
                  >
                    <Eye size={16} />
                    <span>Preview Resume</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadResume}
                    className="btn-secondary btn-resume-download"
                    title="Download Resume PDF"
                    id="hero-download-resume-btn"
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Download size={16} />
                    )}
                  </button>
                </div>
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
                src={
                  profile.profileImage &&
                  !profile.profileImage.includes('unsplash.com') &&
                  !profile.profileImage.includes('photo-1507003211169') &&
                  !profile.profileImage.includes('photo-1534528741775')
                    ? profile.profileImage
                    : '/avatar.jpg'
                }
                alt={profile.name || 'Developer Avatar'}
                className="avatar-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/avatar.jpg';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resume Preview Modal */}
      {profile.resumeUrl && (
        <ResumeModal
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
          resumeUrl={profile.resumeUrl}
          name={profile.name || 'Aravindh V'}
        />
      )}
    </section>
  );
}
