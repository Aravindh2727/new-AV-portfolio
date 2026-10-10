import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ShowcaseNavbar from './components/ShowcaseNavbar';
import ShowcaseFooter from './components/ShowcaseFooter';
import ShowcaseHome from './pages/ShowcaseHome';
import ProjectDetails from './pages/ProjectDetails';

import { getProjects, getProfile, getSettings } from '@shared/firebase/queries';
import { ThemeProvider } from '@shared/theme/ThemeContext';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [projList, profData, settsData] = await Promise.all([
          getProjects({ publishedOnly: true }),
          getProfile(),
          getSettings()
        ]);
        setProjects(projList);
        setProfile(profData);
        setSettings(settsData);
      } catch (err) {
        console.error('Failed to load showcase data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-showcase, #070a12)',
        color: 'var(--text-muted)',
        gap: '1rem'
      }}>
        <div style={{
          width: 44,
          height: 44,
          border: '3px solid rgba(16, 185, 129, 0.2)',
          borderTopColor: '#10b981',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>Connecting to Showcase Repository...</span>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="showcase-app">
        {/* Cyber Grid Background */}
        <div className="cyber-grid-bg" />
        <div className="cyber-radial-accent" />

        {/* Navbar */}
        <ShowcaseNavbar settings={settings} />

        {/* Routing */}
        <Routes>
          <Route
            path="/"
            element={
              <ShowcaseHome
                projects={projects}
                profile={profile}
                settings={settings}
              />
            }
          />
          <Route
            path="/projects/:slug"
            element={
              <ProjectDetails
                profile={profile}
                settings={settings}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Footer */}
        <ShowcaseFooter profile={profile} settings={settings} />
      </div>
    </ThemeProvider>
  );
}
