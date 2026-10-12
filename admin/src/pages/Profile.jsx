import React, { useState, useEffect } from 'react';
import { Save, User, MapPin, Mail, Phone, Globe, Github, Linkedin, Code2, Sparkles, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import ImageUploadField from '../components/ImageUploadField';
import FileUploadField from '../components/FileUploadField';
import { useToast } from '../components/Toast';
import { getProfile, updateProfile } from '@shared/firebase/queries';
import { createDefaultProfile } from '@shared/models/schemas';
import { AVAILABILITY_STATUSES } from '@shared/constants/categories';
import { parseStringArray, joinStringArray } from '@shared/utilities/formatters';

export default function Profile() {
  const [profile, setProfile] = useState(createDefaultProfile());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroTagsInput, setHeroTagsInput] = useState('');
  const { addToast } = useToast();

  const addSocialLink = () => {
    setProfile(prev => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), { platform: '', url: '' }]
    }));
  };

  const removeSocialLink = (index) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).filter((_, i) => i !== index)
    }));
  };

  const updateSocialLink = (index, field, value) => {
    setProfile(prev => {
      const newLinks = [...(prev.socialLinks || [])];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return { ...prev, socialLinks: newLinks };
    });
  };

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getProfile();
        if (data) {
          setProfile(data);
          setHeroTagsInput(joinStringArray(data.heroTags || []));
        }
      } catch (err) {
        console.error(err);
        addToast('Failed to load profile', 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...profile,
        heroTags: parseStringArray(heroTagsInput)
      };
      await updateProfile(payload);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Profile Management">
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
          Loading profile from Firestore...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Profile Management">
      <form onSubmit={handleSubmit}>
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <div className="panel-title">Developer Identity & Bio</div>
              <div className="panel-subtitle">
                Core portfolio presentation data stored in Firestore (<code style={{ color: '#60a5fa' }}>portfolio/profile</code>)
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>

          <div className="panel-body">
            <div className="form-grid">
              {/* Profile Image Cloudinary Upload */}
              <div className="form-full">
                <ImageUploadField
                  label="Profile Photo (Cloudinary or URL)"
                  value={profile.profileImage}
                  onChange={(url) => setProfile({ ...profile, profileImage: url })}
                  folder="portfolio/profile"
                  hint="High-resolution professional portrait displayed in Hero and About sections"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-name">Full Name *</label>
                <input
                  id="prof-name"
                  type="text"
                  className="form-input"
                  value={profile.name || ''}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-title">Professional Title *</label>
                <input
                  id="prof-title"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Full Stack & AI/ML Engineer"
                  value={profile.title || ''}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group form-full">
                <label className="form-label" htmlFor="prof-shortBio">Short Introduction / Tagline *</label>
                <textarea
                  id="prof-shortBio"
                  className="form-textarea"
                  style={{ minHeight: '60px' }}
                  value={profile.shortBio || ''}
                  onChange={(e) => setProfile({ ...profile, shortBio: e.target.value })}
                  required
                />
              </div>

              <div className="form-group form-full">
                <label className="form-label" htmlFor="prof-about">About Me (Full Story)</label>
                <textarea
                  id="prof-about"
                  className="form-textarea"
                  style={{ minHeight: '120px' }}
                  value={profile.about || ''}
                  onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-loc">Location</label>
                <input
                  id="prof-loc"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Tamil Nadu, India"
                  value={profile.location || ''}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-avail">Availability Status</label>
                <select
                  id="prof-avail"
                  className="form-select"
                  value={profile.availabilityStatus || 'Open to Opportunities'}
                  onChange={(e) => setProfile({ ...profile, availabilityStatus: e.target.value })}
                >
                  {AVAILABILITY_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-email">Email Address</label>
                <input
                  id="prof-email"
                  type="email"
                  className="form-input"
                  value={profile.email || ''}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-phone">Phone Number</label>
                <input
                  id="prof-phone"
                  type="text"
                  className="form-input"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>

              <div className="form-group form-full">
                <label className="form-label" htmlFor="prof-tags">Hero Sub-Pills / Specializations (Comma separated)</label>
                <input
                  id="prof-tags"
                  type="text"
                  className="form-input"
                  placeholder="Full Stack Engineer, AI Solutions Architect, React & Cloud Practitioner"
                  value={heroTagsInput}
                  onChange={(e) => setHeroTagsInput(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Career & Stats Panel */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <div className="panel-title">Career Highlights & Impact Metrics</div>
              <div className="panel-subtitle">Key quantitative metrics showcased dynamically in the About section</div>
            </div>
          </div>
          <div className="panel-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="stat-years">Years of Experience</label>
                <input
                  id="stat-years"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 2+ or 3+"
                  value={profile.stats?.yearsExperience || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    stats: { ...(profile.stats || {}), yearsExperience: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="stat-projects">Production Projects</label>
                <input
                  id="stat-projects"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 15+"
                  value={profile.stats?.projectsCompleted || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    stats: { ...(profile.stats || {}), projectsCompleted: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="stat-tech">Technologies Mastered</label>
                <input
                  id="stat-tech"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 20+"
                  value={profile.stats?.technologiesMastered || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    stats: { ...(profile.stats || {}), technologiesMastered: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="stat-contrib">Git Contributions</label>
                <input
                  id="stat-contrib"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 500+"
                  value={profile.stats?.contributions || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    stats: { ...(profile.stats || {}), contributions: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Links & Socials Panel */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <div className="panel-title">Social Links & External Profiles</div>
              <div className="panel-subtitle">Profiles linked in header, hero and footer</div>
            </div>
          </div>
          <div className="panel-body">
            <div className="form-grid">
              <div className="form-group form-full">
                <FileUploadField
                  label="Resume (PDF Document)"
                  value={profile.resumeUrl}
                  onChange={(url) => setProfile({ ...profile, resumeUrl: url })}
                  folder="portfolio/documents"
                  hint="Upload your resume in PDF format"
                />
              </div>

              <div className="form-group form-full">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Dynamic Social Links</label>
                  <button type="button" onClick={addSocialLink} className="btn btn-secondary btn-sm">
                    <Plus size={14} /> Add Link
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(profile.socialLinks || []).map((link, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', minWidth: 0 }}>
                      <div style={{ flex: '1 1 200px', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', minWidth: 0 }}>
                        <div style={{ flex: '1 1 120px', minWidth: 0 }}>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Platform (e.g. GitHub)"
                            value={link.platform}
                            onChange={(e) => updateSocialLink(idx, 'platform', e.target.value)}
                          />
                        </div>
                        <div style={{ flex: '2 1 180px', minWidth: 0 }}>
                          <input
                            type="url"
                            className="form-input"
                            placeholder="URL (https://...)"
                            value={link.url}
                            onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                          />
                        </div>
                      </div>
                      <button type="button" className="btn-icon danger" onClick={() => removeSocialLink(idx)} style={{ alignSelf: 'flex-start' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {(!profile.socialLinks || profile.socialLinks.length === 0) && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                      No social links added yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-showcase">Project Showcase URL</label>
                <input
                  id="prof-showcase"
                  type="url"
                  className="form-input"
                  placeholder="http://localhost:5174"
                  value={profile.showcaseUrl || ''}
                  onChange={(e) => setProfile({ ...profile, showcaseUrl: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }} disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
