import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Code2,
  GraduationCap,
  Award,
  Trophy,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '@shared/theme/ThemeToggle';

export default function AdminLayout({ children, title, actions }) {
  const { currentUser, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/projects', label: 'Projects', icon: Briefcase },
    { to: '/skills', label: 'Skills', icon: Code2 },
    { to: '/experience', label: 'Experience', icon: Briefcase },
    { to: '/education', label: 'Education', icon: GraduationCap },
    { to: '/certifications', label: 'Certifications', icon: Award },
    { to: '/achievements', label: 'Achievements', icon: Trophy },
    { to: '/messages', label: 'Messages', icon: Mail },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Backdrop */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <img 
              src="/AV admin logo.png" 
              alt="Admin Logo" 
              style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'contain' }} 
            />
            <span>Ecosystem</span>
            <span className="admin-brand-badge">CMS</span>
          </div>
        </div>

        <nav className="admin-nav">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">
              {currentUser?.email ? currentUser.email[0].toUpperCase() : 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {currentUser?.displayName || 'Admin'}
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {currentUser?.email || ''}
              </div>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout} style={{ width: '100%' }}>
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0, flex: 1, marginRight: '1rem' }}>
            <button
              className="btn-icon mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ flexShrink: 0 }}
            >
              <Menu size={20} />
            </button>
            <h1 className="admin-header-title" style={{ minWidth: 0 }}>{title}</h1>
          </div>

          <div className="admin-header-actions">
            {actions}
            <ThemeToggle />

            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              title="Open Portfolio Website in new tab"
              style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 0.8rem' }}
            >
              <img src="/AV logo icon new.png" alt="Portfolio" style={{ width: 16, height: 16, borderRadius: 2, objectFit: 'contain' }} />
              <span>Portfolio</span>
              <ExternalLink size={12} />
            </a>
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              title="Open Project Showcase in new tab"
              style={{ borderRadius: 'var(--radius-full)', padding: '0.4rem 0.8rem' }}
            >
              <img src="/av project logo.png" alt="Showcase" style={{ width: 16, height: 16, borderRadius: 2, objectFit: 'contain' }} />
              <span>Showcase</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
