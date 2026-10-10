import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  Eye,
  EyeOff,
  Check,
  X,
  Image as ImageIcon,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import ConfirmModal from '../components/ConfirmModal';
import ImageUploadField from '../components/ImageUploadField';
import { useToast } from '../components/Toast';
import {
  getProjects,
  saveProject,
  deleteProject
} from '@shared/firebase/queries';
import { slugify, parseStringArray, joinStringArray } from '@shared/utilities/formatters';
import { PROJECT_CATEGORIES } from '@shared/constants/categories';
import { createDefaultProject } from '@shared/models/schemas';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(createDefaultProject());
  const [techInput, setTechInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [screenshotsInput, setScreenshotsInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete Confirm State
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { addToast } = useToast();

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenCreate = () => {
    const fresh = createDefaultProject();
    fresh.displayOrder = projects.length + 1;
    setCurrentProject(fresh);
    setTechInput('');
    setFeaturesInput('');
    setScreenshotsInput('');
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj) => {
    setCurrentProject({ ...proj });
    setTechInput(joinStringArray(proj.technologies || []));
    setFeaturesInput(Array.isArray(proj.features) ? proj.features.join('\n') : '');
    setScreenshotsInput(joinStringArray(proj.screenshots || [], '\n'));
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setCurrentProject((prev) => ({
      ...prev,
      title,
      // Auto-generate slug if not editing existing slug manually
      slug: !isEditing ? slugify(title) : prev.slug
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentProject.title.trim()) {
      addToast('Project title is required', 'error');
      return;
    }

    if (!currentProject.slug.trim()) {
      currentProject.slug = slugify(currentProject.title);
    }

    setSaving(true);
    try {
      const payload = {
        ...currentProject,
        technologies: parseStringArray(techInput),
        features: featuresInput
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        screenshots: screenshotsInput
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        displayOrder: Number(currentProject.displayOrder) || 1
      };

      await saveProject(payload, isEditing ? currentProject.id : null);
      addToast(
        isEditing ? 'Project updated successfully.' : 'Project created successfully.',
        'success'
      );
      setIsModalOpen(false);
      await loadProjects();
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Error saving project', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProject(deleteTarget.id);
      addToast('Project deleted successfully.', 'success');
      setDeleteTarget(null);
      await loadProjects();
    } catch (err) {
      console.error(err);
      addToast('Error deleting project', 'error');
    }
  };

  const handleTogglePublished = async (proj) => {
    try {
      const updated = { ...proj, published: !proj.published };
      await saveProject(updated, proj.id);
      addToast(`Project marked as ${updated.published ? 'Published' : 'Draft'}.`, 'success');
      await loadProjects();
    } catch (err) {
      console.error(err);
      addToast('Failed to update published state', 'error');
    }
  };

  const handleToggleFeatured = async (proj) => {
    try {
      const updated = { ...proj, featured: !proj.featured };
      await saveProject(updated, proj.id);
      addToast(
        `Project ${updated.featured ? 'featured on Portfolio' : 'unfeatured'}.`,
        'success'
      );
      await loadProjects();
    } catch (err) {
      console.error(err);
      addToast('Failed to update featured state', 'error');
    }
  };

  // Filtered List
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.shortDescription?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'All' || p.category?.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout title="Project Management">
      {/* Controls Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: '200px', flex: '1 1 200px' }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search projects by title, stack..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="#64748b" />
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {PROJECT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Table Panel */}
      <div className="panel-card">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Order</th>
                <th>Thumbnail & Title</th>
                <th>Category & Tech</th>
                <th>Visibility</th>
                <th>Featured</th>
                <th>Live Demo / Links</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    Loading projects from Firestore...
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    No projects found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((proj) => (
                  <tr key={proj.id}>
                    <td>
                      <span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#60a5fa' }}>
                        {proj.displayOrder}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {proj.thumbnailUrl ? (
                          <img
                            src={proj.thumbnailUrl}
                            alt={proj.title}
                            style={{ width: 56, height: 42, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-color)' }}
                          />
                        ) : (
                          <div style={{ width: 56, height: 42, borderRadius: 6, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ImageIcon size={18} color="#64748b" />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{proj.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                            slug: {proj.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ marginBottom: '0.25rem' }}>
                        <span className="badge badge-cat">{proj.category}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {proj.technologies?.slice(0, 4).join(', ')}
                        {proj.technologies?.length > 4 ? '...' : ''}
                      </div>
                    </td>
                    <td>
                      <button
                        className={`badge ${proj.published ? 'badge-published' : 'badge-draft'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={() => handleTogglePublished(proj)}
                        title="Click to toggle Published status"
                      >
                        {proj.published ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{proj.published ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn-icon"
                        style={{
                          color: proj.featured ? '#f59e0b' : '#475569',
                          borderColor: proj.featured ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-color)'
                        }}
                        onClick={() => handleToggleFeatured(proj)}
                        title="Click to toggle Featured on Portfolio"
                      >
                        <Star size={16} fill={proj.featured ? '#f59e0b' : 'none'} />
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="btn-icon btn-sm" title="Live Website">
                            <ExternalLink size={14} />
                          </a>
                        )}
                        <a
                          href={`http://localhost:5174/projects/${proj.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="badge"
                          style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399' }}
                          title="View on Showcase"
                        >
                          Preview
                        </a>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button className="btn-icon" onClick={() => handleOpenEdit(proj)} title="Edit Project">
                          <Edit2 size={15} />
                        </button>
                        <button className="btn-icon danger" onClick={() => setDeleteTarget(proj)} title="Delete Project">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Create / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                {isEditing ? `Edit Project: ${currentProject.title}` : 'Create New Project'}
              </h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group form-full">
                    <label className="form-label" htmlFor="p-title">Project Title *</label>
                    <input
                      id="p-title"
                      type="text"
                      className="form-input"
                      placeholder="e.g. FarmFlow AI"
                      value={currentProject.title}
                      onChange={handleTitleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="p-slug">URL Slug *</label>
                    <input
                      id="p-slug"
                      type="text"
                      className="form-input"
                      placeholder="e.g. farmflow-ai"
                      value={currentProject.slug}
                      onChange={(e) => setCurrentProject({ ...currentProject, slug: slugify(e.target.value) })}
                      required
                    />
                    <span className="form-hint">Used for: /projects/{currentProject.slug || 'slug'}</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="p-cat">Category *</label>
                    <select
                      id="p-cat"
                      className="form-select"
                      value={currentProject.category}
                      onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value })}
                    >
                      {PROJECT_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label" htmlFor="p-short">Short Description *</label>
                    <textarea
                      id="p-short"
                      className="form-textarea"
                      style={{ minHeight: '60px' }}
                      placeholder="A crisp 1-2 sentence overview for cards..."
                      value={currentProject.shortDescription}
                      onChange={(e) => setCurrentProject({ ...currentProject, shortDescription: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label" htmlFor="p-desc">Detailed Description</label>
                    <textarea
                      id="p-desc"
                      className="form-textarea"
                      placeholder="Comprehensive project explanation, technical overview..."
                      value={currentProject.description}
                      onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                    />
                  </div>

                  {/* Thumbnail Image Upload (Cloudinary) */}
                  <div className="form-full">
                    <ImageUploadField
                      label="Thumbnail Image (Cloudinary or URL)"
                      value={currentProject.thumbnailUrl}
                      onChange={(url) => setCurrentProject({ ...currentProject, thumbnailUrl: url })}
                      folder="portfolio/projects"
                      hint="Primary image displayed in portfolio & showcase cards"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="p-problem">Problem Statement</label>
                    <textarea
                      id="p-problem"
                      className="form-textarea"
                      style={{ minHeight: '70px' }}
                      placeholder="What friction or limitation does this project solve?"
                      value={currentProject.problem}
                      onChange={(e) => setCurrentProject({ ...currentProject, problem: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="p-solution">Solution Architecture</label>
                    <textarea
                      id="p-solution"
                      className="form-textarea"
                      style={{ minHeight: '70px' }}
                      placeholder="How did you engineer the solution?"
                      value={currentProject.solution}
                      onChange={(e) => setCurrentProject({ ...currentProject, solution: e.target.value })}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label" htmlFor="p-tech">Technologies (Comma separated)</label>
                    <input
                      id="p-tech"
                      type="text"
                      className="form-input"
                      placeholder="React, FastAPI, PyTorch, Docker, PostgreSQL"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label" htmlFor="p-feat">Key Features (One per line)</label>
                    <textarea
                      id="p-feat"
                      className="form-textarea"
                      style={{ minHeight: '80px' }}
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      value={featuresInput}
                      onChange={(e) => setFeaturesInput(e.target.value)}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label" htmlFor="p-screens">Screenshots (Image URLs, One per line)</label>
                    <textarea
                      id="p-screens"
                      className="form-textarea"
                      style={{ minHeight: '70px' }}
                      placeholder="https://...&#10;https://..."
                      value={screenshotsInput}
                      onChange={(e) => setScreenshotsInput(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="p-live">Live Website URL</label>
                    <input
                      id="p-live"
                      type="url"
                      className="form-input"
                      placeholder="https://yourproject.dev"
                      value={currentProject.liveUrl}
                      onChange={(e) => setCurrentProject({ ...currentProject, liveUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="p-gh">GitHub Repository URL</label>
                    <input
                      id="p-gh"
                      type="url"
                      className="form-input"
                      placeholder="https://github.com/user/repo"
                      value={currentProject.githubUrl}
                      onChange={(e) => setCurrentProject({ ...currentProject, githubUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="p-demo">Interactive Demo / Sandbox URL</label>
                    <input
                      id="p-demo"
                      type="url"
                      className="form-input"
                      placeholder="https://preview.app"
                      value={currentProject.demoUrl}
                      onChange={(e) => setCurrentProject({ ...currentProject, demoUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="p-video">Walkthrough Video URL</label>
                    <input
                      id="p-video"
                      type="url"
                      className="form-input"
                      placeholder="https://youtube.com/watch?v=..."
                      value={currentProject.videoUrl}
                      onChange={(e) => setCurrentProject({ ...currentProject, videoUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="p-order">Display Order</label>
                    <input
                      id="p-order"
                      type="number"
                      min="1"
                      className="form-input"
                      value={currentProject.displayOrder}
                      onChange={(e) => setCurrentProject({ ...currentProject, displayOrder: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem' }}>
                      <label className="form-checkbox-label">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={currentProject.published}
                          onChange={(e) => setCurrentProject({ ...currentProject, published: e.target.checked })}
                        />
                        <span>Published</span>
                      </label>

                      <label className="form-checkbox-label">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={currentProject.featured}
                          onChange={(e) => setCurrentProject({ ...currentProject, featured: e.target.checked })}
                        />
                        <span>Featured on Portfolio</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving to Firestore...' : isEditing ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action removes it permanently from both the Portfolio and Project Showcase.`}
        confirmText="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
