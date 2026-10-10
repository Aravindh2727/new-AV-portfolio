import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, Eye, EyeOff, X } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../components/Toast';
import { getEducation, saveEducation, deleteEducation } from '@shared/firebase/queries';
import { createDefaultEducation } from '@shared/models/schemas';

export default function Education() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(createDefaultEducation());
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getEducation();
      setItems(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load education', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    const fresh = createDefaultEducation();
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
    if (!currentItem.degree.trim() || !currentItem.institution.trim()) {
      addToast('Degree and Institution are required', 'error');
      return;
    }

    setSaving(true);
    try {
      await saveEducation(currentItem, isEditing ? currentItem.id : null);
      addToast(
        isEditing ? 'Education updated successfully.' : 'Education added successfully.',
        'success'
      );
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
      addToast('Failed to save education', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEducation(deleteTarget.id);
      addToast('Education deleted successfully.', 'success');
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete education', 'error');
    }
  };

  const handleTogglePublished = async (item) => {
    try {
      const updated = { ...item, published: !item.published };
      await saveEducation(updated, item.id);
      addToast(`Status updated to ${updated.published ? 'Published' : 'Hidden'}.`, 'success');
      await loadData();
    } catch (err) {
      console.error(err);
      addToast('Failed to toggle status', 'error');
    }
  };

  return (
    <AdminLayout title="Education Management">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>Add Education</span>
        </button>
      </div>

      <div className="panel-card">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Order</th>
                <th>Degree</th>
                <th>Institution</th>
                <th>Years</th>
                <th>Grade / Score</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    Loading education...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    No education records added yet.
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
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.degree}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.location}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.institution}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {item.startYear} — {item.endYear || 'Present'}
                      </span>
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                        {item.grade || 'N/A'}
                      </span>
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
                {isEditing ? `Edit Education: ${currentItem.degree}` : 'Add Education Record'}
              </h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group form-full">
                    <label className="form-label" htmlFor="edu-deg">Degree / Certificate Name *</label>
                    <input
                      id="edu-deg"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Bachelor of Engineering in Computer Science"
                      value={currentItem.degree}
                      onChange={(e) => setCurrentItem({ ...currentItem, degree: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edu-inst">Institution / University *</label>
                    <input
                      id="edu-inst"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Anna University Affiliated College"
                      value={currentItem.institution}
                      onChange={(e) => setCurrentItem({ ...currentItem, institution: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edu-loc">Location</label>
                    <input
                      id="edu-loc"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Tamil Nadu, India"
                      value={currentItem.location}
                      onChange={(e) => setCurrentItem({ ...currentItem, location: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edu-sy">Start Year</label>
                    <input
                      id="edu-sy"
                      type="text"
                      className="form-input"
                      placeholder="e.g. 2022"
                      value={currentItem.startYear}
                      onChange={(e) => setCurrentItem({ ...currentItem, startYear: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edu-ey">End Year</label>
                    <input
                      id="edu-ey"
                      type="text"
                      className="form-input"
                      placeholder="e.g. 2026"
                      value={currentItem.endYear}
                      onChange={(e) => setCurrentItem({ ...currentItem, endYear: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edu-grd">Grade / CGPA / Percentage</label>
                    <input
                      id="edu-grd"
                      type="text"
                      className="form-input"
                      placeholder="e.g. 8.8 CGPA or 94.6%"
                      value={currentItem.grade}
                      onChange={(e) => setCurrentItem({ ...currentItem, grade: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="edu-ord">Display Order</label>
                    <input
                      id="edu-ord"
                      type="number"
                      min="1"
                      className="form-input"
                      value={currentItem.displayOrder}
                      onChange={(e) => setCurrentItem({ ...currentItem, displayOrder: e.target.value })}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label" htmlFor="edu-desc">Description / Highlights</label>
                    <textarea
                      id="edu-desc"
                      className="form-textarea"
                      placeholder="Relevant coursework, specializations, academic honors..."
                      value={currentItem.description}
                      onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-checkbox-label" style={{ marginTop: '0.5rem' }}>
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
                  {saving ? 'Saving...' : isEditing ? 'Update Education' : 'Save Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Education"
        message={`Are you sure you want to delete "${deleteTarget?.degree}"?`}
        confirmText="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
