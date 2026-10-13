import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Briefcase, Eye, EyeOff, X, ExternalLink } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import ConfirmModal from '../components/ConfirmModal';
import SectionVisibilityBadge from '../components/SectionVisibilityBadge';
import { useToast } from '../components/Toast';
import { getExperience, saveExperience, deleteExperience } from '@shared/firebase/queries';
import { createDefaultExperience } from '@shared/models/schemas';
import { parseStringArray, joinStringArray } from '@shared/utilities/formatters';

export default function Experience() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(createDefaultExperience());
  const [respInput, setRespInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getExperience();
      setItems(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load experience', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    const fresh = createDefaultExperience();
    fresh.displayOrder = items.length + 1;
    setCurrentItem(fresh);
    setRespInput('');
    setTechInput('');
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setCurrentItem({ ...item });
    setRespInput(Array.isArray(item.responsibilities) ? item.responsibilities.join('\n') : '');
    setTechInput(joinStringArray(item.technologies || []));
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentItem.company.trim() || !currentItem.role.trim()) {
      addToast('Company and Role are required', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...currentItem,
        responsibilities: respInput
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        technologies: parseStringArray(techInput),
        displayOrder: Number(currentItem.displayOrder) || 1
      };

      await saveExperience(payload, isEditing ? currentItem.id : null);
      addToast(
        isEditing ? 'Experience updated successfully.' : 'Experience added successfully.',
        'success'
      );
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
      addToast('Failed to save experience', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteExperience(deleteTarget.id);
      addToast('Experience deleted successfully.', 'success');
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete experience', 'error');
    }
  };

  const handleTogglePublished = async (item) => {
    try {
      const updated = { ...item, published: !item.published };
      await saveExperience(updated, item.id);
      addToast(`Status updated to ${updated.published ? 'Published' : 'Hidden'}.`, 'success');
      await loadData();
    } catch (err) {
      console.error(err);
      addToast('Failed to toggle status', 'error');
    }
  };

  return (
    <AdminLayout
      title="Experience Management"
      actions={<SectionVisibilityBadge sectionKey="experience" sectionName="Work Experience" />}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>Add Experience</span>
        </button>
      </div>

      <div className="panel-card">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Order</th>
                <th>Role & Company</th>
                <th>Timeline</th>
                <th>Location</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    Loading experience...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    No experience records yet.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#60a5fa' }}>
                        {item.displayOrder}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.role}</div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        {item.company}
                        {item.companyUrl && (
                          <a href={item.companyUrl} target="_blank" rel="noreferrer" style={{ marginLeft: '0.4rem', color: '#3b82f6' }}>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        {item.startDate} — {item.currentPosition ? 'Present' : item.endDate || 'N/A'}
                      </div>
                      {item.currentPosition && (
                        <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', fontSize: '0.7rem' }}>
                          Current
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.location || 'Remote'}</span>
                    </td>
                    <td>
                      <button
                        className={`badge ${item.published ? 'badge-published' : 'badge-draft'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={() => handleTogglePublished(item)}
                      >
                        {item.published ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{item.published ? 'Published' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button className="btn-icon" onClick={() => handleOpenEdit(item)} title="Edit Experience">
                          <Edit2 size={15} />
                        </button>
                        <button className="btn-icon danger" onClick={() => setDeleteTarget(item)} title="Delete Experience">
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

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                {isEditing ? `Edit Experience: ${currentItem.role}` : 'Add Work Experience'}
              </h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="exp-role">Job Title / Role *</label>
                    <input
                      id="exp-role"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Full Stack Engineering Intern"
                      value={currentItem.role}
                      onChange={(e) => setCurrentItem({ ...currentItem, role: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="exp-company">Company / Organization *</label>
                    <input
                      id="exp-company"
                      type="text"
                      className="form-input"
                      placeholder="e.g. TechCorp Inc."
                      value={currentItem.company}
                      onChange={(e) => setCurrentItem({ ...currentItem, company: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="exp-start">Start Date (e.g. Jun 2025)</label>
                    <input
                      id="exp-start"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Jan 2024"
                      value={currentItem.startDate}
                      onChange={(e) => setCurrentItem({ ...currentItem, startDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="exp-end">End Date (e.g. Present, Dec 2025)</label>
                    <input
                      id="exp-end"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Present"
                      disabled={currentItem.currentPosition}
                      value={currentItem.currentPosition ? 'Present' : currentItem.endDate}
                      onChange={(e) => setCurrentItem({ ...currentItem, endDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="exp-loc">Location</label>
                    <input
                      id="exp-loc"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Bengaluru, India or Remote"
                      value={currentItem.location}
                      onChange={(e) => setCurrentItem({ ...currentItem, location: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="exp-url">Company Website URL</label>
                    <input
                      id="exp-url"
                      type="url"
                      className="form-input"
                      placeholder="https://company.com"
                      value={currentItem.companyUrl}
                      onChange={(e) => setCurrentItem({ ...currentItem, companyUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label" htmlFor="exp-desc">Summary Description</label>
                    <textarea
                      id="exp-desc"
                      className="form-textarea"
                      style={{ minHeight: '60px' }}
                      value={currentItem.description}
                      onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label" htmlFor="exp-resp">Key Responsibilities & Achievements (One per line)</label>
                    <textarea
                      id="exp-resp"
                      className="form-textarea"
                      style={{ minHeight: '100px' }}
                      placeholder="Built real-time telemetry pipelines&#10;Decreased bundle size by 30%&#10;Mentored 4 junior developers"
                      value={respInput}
                      onChange={(e) => setRespInput(e.target.value)}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label" htmlFor="exp-tech">Technologies Used (Comma separated)</label>
                    <input
                      id="exp-tech"
                      type="text"
                      className="form-input"
                      placeholder="React, TypeScript, Firebase, Docker"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="exp-order">Display Order</label>
                    <input
                      id="exp-order"
                      type="number"
                      min="1"
                      className="form-input"
                      value={currentItem.displayOrder}
                      onChange={(e) => setCurrentItem({ ...currentItem, displayOrder: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem' }}>
                      <label className="form-checkbox-label">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={currentItem.currentPosition}
                          onChange={(e) => setCurrentItem({ ...currentItem, currentPosition: e.target.checked })}
                        />
                        <span>Current Position</span>
                      </label>
                      <label className="form-checkbox-label">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={currentItem.published}
                          onChange={(e) => setCurrentItem({ ...currentItem, published: e.target.checked })}
                        />
                        <span>Published</span>
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
                  {saving ? 'Saving...' : isEditing ? 'Update Experience' : 'Save Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Experience"
        message={`Are you sure you want to delete "${deleteTarget?.role} at ${deleteTarget?.company}"?`}
        confirmText="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
