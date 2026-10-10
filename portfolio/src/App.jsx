import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import TimelineSection from './components/TimelineSection';
import CertificationsSection from './components/CertificationsSection';
import FeaturedProjectsSection from './components/FeaturedProjectsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

import {
  getProfile,
  getSettings,
  getProjects,
  getSkills,
  getExperience,
  getEducation,
  getCertifications,
  getAchievements
} from '@shared/firebase/queries';
import { ThemeProvider } from '@shared/theme/ThemeContext';

export default function App() {
  const [data, setData] = useState({
    profile: null,
    settings: null,
    projects: [],
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    achievements: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAllPortfolioData() {
      try {
        setLoading(true);
        const [
          profile,
          settings,
          projects,
          skills,
          experience,
          education,
          certifications,
          achievements
        ] = await Promise.all([
          getProfile(),
          getSettings(),
          getProjects({ publishedOnly: true }),
          getSkills({ publishedOnly: true }),
          getExperience({ publishedOnly: true }),
          getEducation({ publishedOnly: true }),
          getCertifications({ publishedOnly: true }),
          getAchievements({ publishedOnly: true })
        ]);

        setData({
          profile,
          settings,
          projects,
          skills,
          experience,
          education,
          certifications,
          achievements
        });
      } catch (err) {
        console.error('Failed to load portfolio data:', err);
        setError('Failed to connect to portfolio database. Please refresh or check connection.');
      } finally {
        setLoading(false);
      }
    }

    loadAllPortfolioData();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#080a10',
        color: 'var(--text-secondary)',
        gap: '1rem'
      }}>
        <div style={{
          width: 44,
          height: 44,
          border: '3px solid rgba(99, 102, 241, 0.2)',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>Connecting to Portfolio Firestore...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#080a10',
        color: '#f43f5e',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div>
          <h2>Connection Error</h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="portfolio-app">
        {/* Dynamic Background Mesh */}
        <div className="bg-mesh" />

        {/* Navigation */}
        <Navbar profile={data.profile} settings={data.settings} />

        {/* Hero Section */}
        <Hero profile={data.profile} />

        {/* About Section */}
        <AboutSection profile={data.profile} />

        {/* Technical Skills */}
        <SkillsSection skills={data.skills} />

        {/* Experience & Education Timelines */}
        <TimelineSection experience={data.experience} education={data.education} />

        {/* Certifications & Achievements */}
        <CertificationsSection
          certifications={data.certifications}
          achievements={data.achievements}
        />

        {/* Featured Projects (Only published & featured) */}
        <FeaturedProjectsSection projects={data.projects} settings={data.settings} />

        {/* Contact Form */}
        <ContactSection profile={data.profile} settings={data.settings} />

        {/* Footer */}
        <Footer profile={data.profile} settings={data.settings} />
      </div>
    </ThemeProvider>
  );
}
