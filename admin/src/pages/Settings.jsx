import React, { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon, Database, ShieldAlert, CheckCircle2, RefreshCw, Sparkles, ExternalLink } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../components/Toast';
import { getSettings, updateSettings } from '@shared/firebase/queries';
import { isFirebaseConfigured } from '@shared/firebase/config';
import { createDefaultSettings } from '@shared/models/schemas';

export default function Settings() {
  const [settings, setSettings] = useState(createDefaultSettings());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { addToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getSettings();
        if (data) setSettings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
