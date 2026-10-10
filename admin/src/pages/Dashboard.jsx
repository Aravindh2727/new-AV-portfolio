import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Eye,
  FileEdit,
  Star,
  Code2,
  Award,
  Mail,
  GraduationCap,
  ArrowUpRight,
  PlusCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import {
  getProjects,
  getSkills,
  getCertifications,
  getContactMessages,
  getProfile
} from '@shared/firebase/queries';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    featuredProjects: 0,
    totalSkills: 0,
    totalCerts: 0,
    totalMessages: 0,
    unreadMessages: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [projects, skills, certs, messages, prof] = await Promise.all([
          getProjects(),
          getSkills(),
          getCertifications(),
          getContactMessages(),
          getProfile()
        ]);

        const published = projects.filter((p) => p.published === true);
        const drafts = projects.filter((p) => p.published === false);
        const featured = projects.filter((p) => p.featured === true);
        const unread = messages.filter((m) => !m.read);

        setStats({
          totalProjects: projects.length,
          publishedProjects: published.length,
          draftProjects: drafts.length,
          featuredProjects: featured.length,
          totalSkills: skills.length,
          totalCerts: certs.length,
          totalMessages: messages.length,
          unreadMessages: unread.length
        });

        setRecentProjects(projects.slice(0, 4));
        setRecentMessages(messages.slice(0, 4));
        setProfile(prof);
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <AdminLayout title="Dashboard Overview">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.08))',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: '16px',
        padding: '1.75rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Sparkles size={18} color="#60a5fa" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Central Management System
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Welcome back, {profile?.name || 'Engineer'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            All content managed here feeds directly into your Portfolio and Project Showcase via Cloud Firestore.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/projects" className="btn btn-primary btn-sm">
            <PlusCircle size={15} />
            <span>Manage Projects</span>
          </Link>
          <Link to="/messages" className="btn btn-secondary btn-sm">
            <Mail size={15} />
            <span>Messages ({stats.unreadMessages})</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.12)' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div className="metric-val">{stats.totalProjects}</div>
            <div className="metric-lbl">Total Projects</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.12)' }}>
            <Eye size={24} />
          </div>
          <div>
            <div className="metric-val">{stats.publishedProjects}</div>
            <div className="metric-lbl">Published</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ color: 'var(--text-dim)', background: 'rgba(100, 116, 139, 0.12)' }}>
            <FileEdit size={24} />
          </div>
          <div>
            <div className="metric-val">{stats.draftProjects}</div>
            <div className="metric-lbl">Drafts</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.12)' }}>
            <Star size={24} />
          </div>
          <div>
            <div className="metric-val">{stats.featuredProjects}</div>
            <div className="metric-lbl">Featured on Portfolio</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.12)' }}>
            <Code2 size={24} />
          </div>
          <div>
            <div className="metric-val">{stats.totalSkills}</div>
            <div className="metric-lbl">Active Skills</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ color: '#06b6d4', background: 'rgba(6, 182, 212, 0.12)' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="metric-val">{stats.totalCerts}</div>
            <div className="metric-lbl">Certifications</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap" style={{ color: '#ec4899', background: 'rgba(236, 72, 153, 0.12)' }}>
            <Mail size={24} />
          </div>
          <div>
            <div className="metric-val">{stats.totalMessages}</div>
            <div className="metric-lbl">Inquiries ({stats.unreadMessages} new)</div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Projects & Messages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1.5rem' }}>
        {/* Recent Projects Panel */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <div className="panel-title">Recent Projects</div>
              <div className="panel-subtitle">Latest portfolio & showcase entries</div>
            </div>
            <Link to="/projects" className="btn btn-secondary btn-sm">
              <span>View All</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="table-wrap">
            <table className="admin-table admin-table-compact">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Order</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((proj) => (
                  <tr key={proj.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{proj.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                        /{proj.slug}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-cat">{proj.category}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span className={`badge ${proj.published ? 'badge-published' : 'badge-draft'}`}>
                          {proj.published ? 'Published' : 'Draft'}
                        </span>
                        {proj.featured && (
                          <span className="badge badge-featured">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{proj.displayOrder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Messages Panel */}
        <div className="panel-card">
          <div className="panel-header">
            <div>
              <div className="panel-title">Recent Messages</div>
              <div className="panel-subtitle">Incoming inquiries from website contact forms</div>
            </div>
            <Link to="/messages" className="btn btn-secondary btn-sm">
              <span>View All</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="table-wrap">
            <table className="admin-table admin-table-compact">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {recentMessages.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>
                      No incoming messages yet.
                    </td>
                  </tr>
                ) : (
                  recentMessages.map((msg) => (
                    <tr key={msg.id}>
                      <td>
                        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {!msg.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />}
                          {msg.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{msg.email}</div>
                      </td>
                      <td>
                        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {msg.subject || '(No subject)'}
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
                          {msg.source || 'portfolio'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
