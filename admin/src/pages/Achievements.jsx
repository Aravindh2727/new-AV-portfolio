import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Trophy, Eye, EyeOff, X, ExternalLink } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import ConfirmModal from '../components/ConfirmModal';
import ImageUploadField from '../components/ImageUploadField';
import { useToast } from '../components/Toast';
import { getAchievements, saveAchievement, deleteAchievement } from '@shared/firebase/queries';
import { createDefaultAchievement } from '@shared/models/schemas';

export default function Achievements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(createDefaultAchievement());
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAchievements();
      setItems(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load achievements', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    const fresh = createDefaultAchievement();
    fresh.displayOrder = items.length + 1;
    setCurrentItem(fresh);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setCurrentItem({ ...item });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentItem.title.trim()) {
      addToast('Achievement title is required', 'error');
      return;
    }

    setSaving(true);
    try {
      await saveAchievement(currentItem, isEditing ? currentItem.id : null);
      addToast(
        isEditing ? 'Achievement updated.' : 'Achievement added.',
        'success'
      );
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
      addToast('Failed to save achievement', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAchievement(deleteTarget.id);
      addToast('Achievement deleted.', 'success');
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete achievement', 'error');
    }
  };

  const handleTogglePublished = async (item) => {
    try {
      const updated = { ...item, published: !item.published };
      await saveAchievement(updated, item.id);
      addToast(`Status updated to ${updated.published ? 'Published' : 'Hidden'}.`, 'success');
      await loadData();
    } catch (err) {
      console.error(err);
      addToast('Failed to toggle status', 'error');
    }
  };

  return (
    <AdminLayout title="Achievements Management">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>Add Achievement</span>
        </button>
      </div>

      <div className="panel-card">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Order</th>
                <th>Achievement Title</th>
                <th>Organization</th>
                <th>Date</th>
                <th>Link</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    Loading achievements...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    No achievements added yet.
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            style={{ width: 44, height: 34, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border-color)' }}
                          />
                        ) : (
                          <div style={{ width: 44, height: 34, borderRadius: 4, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trophy size={16} color="#f59e0b" />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }}>
                        {item.organization || 'General'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.date || 'N/A'}</span>
                    </td>
                    <td>
                      {item.url ? (
                        <a href={item.url} target="_blank" rel="noreferrer" className="btn-icon btn-sm" title="Open Link">
                          <ExternalLink size={13} />
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>None</span>
                      )}
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
                        <button className="btn-icon" onClick={() => handleOpenEdit(item)} title="Edit">
                          <Edit2 size={15} />
                        </button>
                        <button className="btn-icon danger" onClick={() => setDeleteTarget(item)} title="Delete">
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

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                {isEditing ? `Edit Achievement: ${currentItem.title}` : 'Add Achievement'}
              </h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group form-full">
                    <label className="form-label" htmlFor="ach-title">Achievement Title *</label>
                    <input
                      id="ach-title"
                      type="text"
                      className="form-input"
                      placeholder="e.g. 1st Place Winner — State Level Hackathon 2025"
                      value={currentItem.title}
                      onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="ach-org">Organization / Issuing Body</label>
                    <input
                      id="ach-org"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Tamil Nadu Innovation Forum"
                      value={currentItem.organization}
                      onChange={(e) => setCurrentItem({ ...currentItem, organization: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="ach-date">Date / Year</label>
                    <input
                      id="ach-date"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Nov 2025 or 2024"
                      value={currentItem.date}
                      onChange={(e) => setCurrentItem({ ...currentItem, date: e.target.value })}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label" htmlFor="ach-url">Reference / Article / Proof URL</label>
                    <input
                      id="ach-url"
                      type="url"
                      className="form-input"
                      placeholder="https://..."
                      value={currentItem.url}
                      onChange={(e) => setCurrentItem({ ...currentItem, url: e.target.value })}
                    />
                  </div>

                  <div className="form-full">
                    <ImageUploadField
                      label="Achievement Photo / Trophy / Certificate Image"
                      value={currentItem.imageUrl}
                      onChange={(url) => setCurrentItem({ ...currentItem, imageUrl: url })}
                      folder="portfolio/achievements"
                      hint="Optional image from ceremony or certificate"
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label" htmlFor="ach-desc">Description</label>
                    <textarea
                      id="ach-desc"
                      className="form-textarea"
                      placeholder="Describe the context, challenge, and impact..."
                      value={currentItem.description}
                      onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="ach-ord">Display Order</label>
                    <input
                      id="ach-ord"
                      type="number"
                      min="1"
                      className="form-input"
                      value={currentItem.displayOrder}
                      onChange={(e) => setCurrentItem({ ...currentItem, displayOrder: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ justifyContent: 'center' }}>
                    <label className="form-checkbox-label" style={{ marginTop: '1.25rem' }}>
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={currentItem.published}
                        onChange={(e) => setCurrentItem({ ...currentItem, published: e.target.checked })}
                      />
                      <span>Published (Visible on Portfolio)</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : isEditing ? 'Update Achievement' : 'Save Achievement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Achievement"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmText="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
