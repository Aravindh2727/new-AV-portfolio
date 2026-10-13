import React, { useState, useEffect } from 'react';
import {
  Save,
  Settings as SettingsIcon,
  Database,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Rocket,
  Send,
  Layers,
  Eye,
  EyeOff,
  User,
  Code2,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  FolderGit2,
  Mail,
  Check
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../components/Toast';
import { getSettings, updateSettings } from '@shared/firebase/queries';
import { isFirebaseConfigured } from '@shared/firebase/config';
import { createDefaultSettings, createDefaultSectionVisibility } from '@shared/models/schemas';

export default function Settings() {
  const [settings, setSettings] = useState(createDefaultSettings());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deployingService, setDeployingService] = useState(null);

  const { addToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getSettings();
        if (data) {
          setSettings({
            ...createDefaultSettings(),
            ...data,
            sections: {
              ...createDefaultSectionVisibility(),
              ...(data.sections || {})
            }
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const SECTION_CONFIGS = [
    {
      key: 'hero',
      label: 'Hero & Introduction Banner',
      icon: User,
      color: '#3b82f6',
      description: 'Landing hero with avatar, title, bio summary, and CTA buttons.'
    },
    {
      key: 'about',
      label: 'About Me',
      icon: User,
      color: '#8b5cf6',
      description: 'Full developer bio, career metrics, highlights, and story.'
    },
    {
      key: 'skills',
      label: 'Technical Skills',
      icon: Code2,
      color: '#06b6d4',
      description: 'Categorized technical proficiencies, tools, and expertise levels.'
    },
    {
      key: 'experience',
      label: 'Work Experience',
      icon: Briefcase,
      color: '#10b981',
      description: 'Career positions, company roles, timeline, and responsibilities.'
    },
    {
      key: 'education',
      label: 'Academic Education',
      icon: GraduationCap,
      color: '#a855f7',
      description: 'Degrees, educational institutions, grades, and academic foundation.'
    },
    {
      key: 'certifications',
      label: 'Certifications',
      icon: Award,
      color: '#f59e0b',
      description: 'Verified cloud, engineering, and architecture certifications.'
    },
    {
      key: 'achievements',
      label: 'Achievements & Awards',
      icon: Trophy,
      color: '#ec4899',
      description: 'Hackathons, honors, competitions, and notable milestones.'
    },
    {
      key: 'projects',
      label: 'Featured Projects',
      icon: FolderGit2,
      color: '#6366f1',
      description: 'Curated projects gallery cards with live links and details.'
    },
    {
      key: 'contact',
      label: 'Contact Inquiries Form',
      icon: Mail,
      color: '#14b8a6',
      description: 'Direct inquiry submission form, email links, and social channels.'
    }
  ];

  const handleToggleSection = (sectionKey) => {
    const currentVal = settings.sections?.[sectionKey] !== false;
    setSettings({
      ...settings,
      sections: {
        ...(settings.sections || {}),
        [sectionKey]: !currentVal
      }
    });
  };

  const handleSetAllSections = (enable) => {
    const updated = {};
    SECTION_CONFIGS.forEach((sec) => {
      updated[sec.key] = enable;
    });
    setSettings({
      ...settings,
      sections: updated
    });
    addToast(
      enable ? 'All portfolio sections set to ENABLED' : 'All portfolio sections set to DISABLED',
      'info'
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(settings);
      addToast('Settings updated successfully.', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerDeploy = async (hookUrl, serviceName) => {
    const url = hookUrl || (
      serviceName === 'Portfolio'
        ? import.meta.env.VITE_RENDER_DEPLOY_HOOK_PORTFOLIO
        : serviceName === 'Project Showcase'
        ? import.meta.env.VITE_RENDER_DEPLOY_HOOK_SHOWCASE
        : import.meta.env.VITE_RENDER_DEPLOY_HOOK_ADMIN
    );

    if (!url) {
      addToast(`No deploy hook URL configured for ${serviceName}`, 'error');
      return;
    }

    setDeployingService(serviceName);
    try {
      await fetch(url, { method: 'POST', mode: 'no-cors' });
      addToast(`🚀 Deploy triggered for ${serviceName}! Check Render dashboard for progress.`, 'success');
    } catch (err) {
      addToast(`Failed to trigger deploy for ${serviceName}: ${err.message}`, 'error');
    } finally {
      setDeployingService(null);
    }
  };

  const handleTriggerAllDeploys = async () => {
    setDeployingService('all');
    try {
      const hooks = [
        { url: settings.deployHookPortfolio || import.meta.env.VITE_RENDER_DEPLOY_HOOK_PORTFOLIO, name: 'Portfolio' },
        { url: settings.deployHookShowcase || import.meta.env.VITE_RENDER_DEPLOY_HOOK_SHOWCASE, name: 'Project Showcase' },
        { url: settings.deployHookAdmin || import.meta.env.VITE_RENDER_DEPLOY_HOOK_ADMIN, name: 'Admin CMS' }
      ];

      for (const h of hooks) {
        if (h.url) {
          await fetch(h.url, { method: 'POST', mode: 'no-cors' });
        }
      }
      addToast('🚀 All 3 deployments triggered on Render! Check Render dashboard.', 'success');
    } catch (err) {
      addToast(`Failed to trigger all deployments: ${err.message}`, 'error');
    } finally {
      setDeployingService(null);
    }
  };



  return (
    <AdminLayout title="System Settings & Ecosystem Controls">
      <form onSubmit={handleSave}>
        {/* Connection Status Banner */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderRadius: '12px',
          background: isFirebaseConfigured() ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          border: `1px solid ${isFirebaseConfigured() ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Database size={22} color={isFirebaseConfigured() ? '#10b981' : '#f59e0b'} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                Firebase Status: {isFirebaseConfigured() ? 'Connected to Cloud Firestore' : 'Running in Local Sandbox / Demo Mode'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isFirebaseConfigured()
                  ? 'All writes sync in real-time across Portfolio, Showcase, and Admin.'
                  : 'Place your Firebase keys in .env to connect to live Cloud Firestore. Local state is actively maintained.'}
              </div>
            </div>
          </div>

        </div>

        {/* Global Ecosystem URLs Panel */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <div className="panel-title">Ecosystem Navigation URLs</div>
              <div className="panel-subtitle">Target endpoints for cross-website links and redirects</div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>

          <div className="panel-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="set-port">Personal Portfolio URL</label>
                <input
                  id="set-port"
                  type="url"
                  className="form-input"
                  placeholder="http://localhost:5173"
                  value={settings.portfolioUrl || ''}
                  onChange={(e) => setSettings({ ...settings, portfolioUrl: e.target.value })}
                />
                <span className="form-hint">Used by Showcase navigation to link back to Portfolio</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="set-show">Project Showcase URL</label>
                <input
                  id="set-show"
                  type="url"
                  className="form-input"
                  placeholder="http://localhost:5174"
                  value={settings.showcaseUrl || ''}
                  onChange={(e) => setSettings({ ...settings, showcaseUrl: e.target.value })}
                />
                <span className="form-hint">Used by Portfolio to link directly to Project Showcase</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="set-adm">Admin Portal URL</label>
                <input
                  id="set-adm"
                  type="url"
                  className="form-input"
                  placeholder="http://localhost:5175"
                  value={settings.adminUrl || ''}
                  onChange={(e) => setSettings({ ...settings, adminUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="set-mail">Primary Contact Email</label>
                <input
                  id="set-mail"
                  type="email"
                  className="form-input"
                  placeholder="contact@example.com"
                  value={settings.contactEmail || ''}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                />
              </div>

              <div className="form-group form-full">
                <label className="form-label" htmlFor="set-foot">Global Footer Copyright / Attribution</label>
                <input
                  id="set-foot"
                  type="text"
                  className="form-input"
                  placeholder="© 2026 Aravindh V. Engineered with React & Firebase."
                  value={settings.footerText || ''}
                  onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                />
              </div>

              <div className="form-group form-full">
                <label className="form-label" htmlFor="set-meta">Meta Description for SEO</label>
                <textarea
                  id="set-meta"
                  className="form-textarea"
                  style={{ minHeight: '60px' }}
                  placeholder="Personal developer ecosystem showcasing engineering projects, skills, and experience."
                  value={settings.metaDescription || ''}
                  onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                />
              </div>

              <div className="form-group form-full">
                <label className="form-checkbox-label" style={{ marginTop: '0.5rem' }}>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  />
                  <span>Maintenance Mode (Temporarily disables contact forms)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Section Visibility Controls Panel */}
        <div className="panel-card" style={{ marginTop: '2rem' }}>
          <div className="panel-header">
            <div>
              <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Layers size={18} color="var(--accent-blue, #3b82f6)" />
                <span>Portfolio Section Visibility Controls</span>
              </div>
              <div className="panel-subtitle">
                Enable or disable individual sections on your public portfolio website with instant toggle switches
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleSetAllSections(true)}
                title="Enable all sections on the public portfolio"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <Eye size={14} />
                <span>Enable All</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleSetAllSections(false)}
                title="Disable all sections on the public portfolio"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <EyeOff size={14} />
                <span>Disable All</span>
              </button>
            </div>
          </div>

          <div className="panel-body">
            <div className="section-visibility-grid">
              {SECTION_CONFIGS.map((sec) => {
                const Icon = sec.icon;
                const isEnabled = settings.sections?.[sec.key] !== false;
                return (
                  <div
                    key={sec.key}
                    className={`section-toggle-card ${isEnabled ? '' : 'is-disabled'}`}
                    onClick={() => handleToggleSection(sec.key)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="section-toggle-info">
                      <div
                        className="section-toggle-icon"
                        style={{
                          background: isEnabled ? `${sec.color}20` : 'rgba(100, 116, 139, 0.1)',
                          color: isEnabled ? sec.color : 'var(--text-dim)'
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="section-toggle-title">
                          <span>{sec.label}</span>
                          <span className={`section-status-pill ${isEnabled ? 'enabled' : 'disabled'}`}>
                            {isEnabled ? 'Visible' : 'Hidden'}
                          </span>
                        </div>
                        <div className="section-toggle-desc">{sec.description}</div>
                      </div>
                    </div>

                    <label
                      className="toggle-switch"
                      onClick={(e) => e.stopPropagation()}
                      title={`Toggle ${sec.label}`}
                    >
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => handleToggleSection(sec.key)}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Render Deploy Hooks & 1-Click Trigger Panel */}
        <div className="panel-card" style={{ marginTop: '2rem' }}>
          <div className="panel-header">
            <div>
              <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Rocket size={18} color="var(--primary, #3b82f6)" />
                <span>Production Deployments (Render Deploy Hooks)</span>
              </div>
              <div className="panel-subtitle">
                Trigger instant live redeploys on Render with one click, or update your webhook URLs
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleTriggerAllDeploys}
              disabled={deployingService !== null}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Send size={15} />
              <span>{deployingService === 'all' ? 'Triggering...' : 'Deploy Entire Ecosystem'}</span>
            </button>
          </div>

          <div className="panel-body">
            <div className="form-grid">
              {/* Portfolio Hook */}
              <div className="form-group form-full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="form-label" htmlFor="set-hook-port" style={{ margin: 0 }}>
                    Portfolio Deploy Hook (my-portfolio)
                  </label>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => handleTriggerDeploy(settings.deployHookPortfolio, 'Portfolio')}
                    disabled={deployingService !== null}
                    style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}
                  >
                    {deployingService === 'Portfolio' ? 'Triggering...' : '🚀 Trigger Deploy'}
                  </button>
                </div>
                <input
                  id="set-hook-port"
                  type="url"
                  className="form-input"
                  placeholder="https://api.render.com/deploy/srv-xxxx?key=yyyy"
                  value={settings.deployHookPortfolio || ''}
                  onChange={(e) => setSettings({ ...settings, deployHookPortfolio: e.target.value })}
                />
                <span className="form-hint">Webhook URL to build and deploy the Personal Portfolio on Render</span>
              </div>

              {/* Showcase Hook */}
              <div className="form-group form-full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="form-label" htmlFor="set-hook-show" style={{ margin: 0 }}>
                    Project Showcase Deploy Hook (my-showcase)
                  </label>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => handleTriggerDeploy(settings.deployHookShowcase, 'Project Showcase')}
                    disabled={deployingService !== null}
                    style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}
                  >
                    {deployingService === 'Project Showcase' ? 'Triggering...' : '🚀 Trigger Deploy'}
                  </button>
                </div>
                <input
                  id="set-hook-show"
                  type="url"
                  className="form-input"
                  placeholder="https://api.render.com/deploy/srv-xxxx?key=yyyy"
                  value={settings.deployHookShowcase || ''}
                  onChange={(e) => setSettings({ ...settings, deployHookShowcase: e.target.value })}
                />
                <span className="form-hint">Webhook URL to build and deploy the Project Showcase gallery on Render</span>
              </div>

              {/* Admin Hook */}
              <div className="form-group form-full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="form-label" htmlFor="set-hook-adm" style={{ margin: 0 }}>
                    Admin CMS Deploy Hook (my-admin)
                  </label>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => handleTriggerDeploy(settings.deployHookAdmin, 'Admin CMS')}
                    disabled={deployingService !== null}
                    style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}
                  >
                    {deployingService === 'Admin CMS' ? 'Triggering...' : '🚀 Trigger Deploy'}
                  </button>
                </div>
                <input
                  id="set-hook-adm"
                  type="url"
                  className="form-input"
                  placeholder="https://api.render.com/deploy/srv-xxxx?key=yyyy"
                  value={settings.deployHookAdmin || ''}
                  onChange={(e) => setSettings({ ...settings, deployHookAdmin: e.target.value })}
                />
                <span className="form-hint">Webhook URL to build and deploy the Admin CMS portal on Render</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }} disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>


    </AdminLayout>
  );
}
