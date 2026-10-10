import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Code2, Eye, EyeOff, Filter, X } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../components/Toast';
import { getSkills, saveSkill, deleteSkill } from '@shared/firebase/queries';
import { SKILL_CATEGORIES, SKILL_LEVELS } from '@shared/constants/categories';
import { createDefaultSkill } from '@shared/models/schemas';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(createDefaultSkill());
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { addToast } = useToast();

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await getSkills();
      setSkills(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load skills', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleOpenCreate = () => {
    const fresh = createDefaultSkill();
    fresh.displayOrder = skills.length + 1;
    setCurrentSkill(fresh);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill) => {
    setCurrentSkill({ ...skill });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentSkill.name.trim()) {
      addToast('Skill name is required', 'error');
      return;
    }

    setSaving(true);
    try {
      await saveSkill(currentSkill, isEditing ? currentSkill.id : null);
      addToast(
        isEditing ? 'Skill updated successfully.' : 'Skill added successfully.',
        'success'
      );
      setIsModalOpen(false);
      await loadSkills();
    } catch (err) {
      console.error(err);
      addToast('Error saving skill', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSkill(deleteTarget.id);
      addToast('Skill deleted successfully.', 'success');
      setDeleteTarget(null);
      await loadSkills();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete skill', 'error');
    }
  };

  const handleTogglePublished = async (skill) => {
    try {
      const updated = { ...skill, published: !skill.published };
      await saveSkill(updated, skill.id);
      addToast(`Skill ${updated.published ? 'enabled' : 'disabled'}.`, 'success');
      await loadSkills();
    } catch (err) {
      console.error(err);
      addToast('Failed to update skill status', 'error');
    }
  };

  const filteredSkills = skills.filter((s) => {
    if (filterCat === 'All') return true;
    return s.category === filterCat;
  });

  return (
    <AdminLayout title="Skills Management">
      {/* Controls Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Filter size={16} color="#64748b" />
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${filterCat === 'All' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterCat('All')}
            >
              All ({skills.length})
            </button>
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${filterCat === cat ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterCat(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Skills Table */}
      <div className="panel-card">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Order</th>
                <th>Skill Name</th>
                <th>Category</th>
                <th>Proficiency Level</th>
                <th>Icon / Identifier</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    Loading skills...
                  </td>
                </tr>
              ) : filteredSkills.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    No skills in this category yet.
                  </td>
                </tr>
              ) : (
                filteredSkills.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#60a5fa' }}>
                        {s.displayOrder}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{s.name}</div>
                    </td>
                    <td>
                      <span className="badge badge-cat">{s.category}</span>
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
                        {s.level}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {s.icon || 'Code'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`badge ${s.published ? 'badge-published' : 'badge-draft'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        onClick={() => handleTogglePublished(s)}
                      >
                        {s.published ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{s.published ? 'Active' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button className="btn-icon" onClick={() => handleOpenEdit(s)} title="Edit Skill">
                          <Edit2 size={15} />
                        </button>
                        <button className="btn-icon danger" onClick={() => setDeleteTarget(s)} title="Delete Skill">
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

      {/* Add / Edit Skill Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {isEditing ? `Edit Skill: ${currentSkill.name}` : 'Add New Skill'}
              </h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group form-full">
                    <label className="form-label" htmlFor="sk-name">Skill Name *</label>
                    <input
                      id="sk-name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. React.js, Python, Docker"
                      value={currentSkill.name}
                      onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="sk-cat">Category *</label>
                    <select
                      id="sk-cat"
                      className="form-select"
                      value={currentSkill.category}
                      onChange={(e) => setCurrentSkill({ ...currentSkill, category: e.target.value })}
                    >
                      {SKILL_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="sk-lvl">Proficiency Level</label>
                    <select
                      id="sk-lvl"
                      className="form-select"
                      value={currentSkill.level}
                      onChange={(e) => setCurrentSkill({ ...currentSkill, level: e.target.value })}
                    >
                      {SKILL_LEVELS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="sk-icon">Icon Name</label>
                    <input
                      id="sk-icon"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Code, Database, Zap, Cpu"
                      value={currentSkill.icon || ''}
                      onChange={(e) => setCurrentSkill({ ...currentSkill, icon: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="sk-order">Display Order</label>
                    <input
                      id="sk-order"
                      type="number"
                      min="1"
                      className="form-input"
                      value={currentSkill.displayOrder}
                      onChange={(e) => setCurrentSkill({ ...currentSkill, displayOrder: e.target.value })}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-checkbox-label" style={{ marginTop: '0.5rem' }}>
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={currentSkill.published}
                        onChange={(e) => setCurrentSkill({ ...currentSkill, published: e.target.checked })}
                      />
                      <span>Active (Visible on Portfolio)</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : isEditing ? 'Update Skill' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Skill"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmText="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
