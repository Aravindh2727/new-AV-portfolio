import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Award, Eye, EyeOff, X, ExternalLink, Image as ImageIcon } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import ConfirmModal from '../components/ConfirmModal';
import ImageUploadField from '../components/ImageUploadField';
import { useToast } from '../components/Toast';
import { getCertifications, saveCertification, deleteCertification } from '@shared/firebase/queries';
import { createDefaultCertification } from '@shared/models/schemas';

export default function Certifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(createDefaultCertification());
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getCertifications();
      setItems(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load certifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    const fresh = createDefaultCertification();
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
    if (!currentItem.name.trim() || !currentItem.issuer.trim()) {
      addToast('Certificate name and Issuer are required', 'error');
      return;
    }

    setSaving(true);
    try {
      await saveCertification(currentItem, isEditing ? currentItem.id : null);
      addToast(
        isEditing ? 'Certification updated.' : 'Certification created.',
        'success'
      );
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error(err);
      addToast('Failed to save certification', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCertification(deleteTarget.id);
      addToast('Certification deleted.', 'success');
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete certification', 'error');
    }
  };

  const handleTogglePublished = async (item) => {
    try {
      const updated = { ...item, published: !item.published };
      await saveCertification(updated, item.id);
      addToast(`Status updated to ${updated.published ? 'Published' : 'Hidden'}.`, 'success');
      await loadData();
    } catch (err) {
      console.error(err);
      addToast('Failed to toggle status', 'error');
    }
  };

  return (
    <AdminLayout title="Certifications Management">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          <span>Add Certification</span>
        </button>
      </div>

      <div className="panel-card">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Order</th>
                <th>Certificate & Image</th>
                <th>Issuer</th>
                <th>Issue Date</th>
                <th>Verification</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    Loading certifications...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    No certifications added yet.
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
                            alt={item.name}
                            style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--border-color)' }}
                          />
                        ) : (
                          <div style={{ width: 48, height: 36, borderRadius: 4, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Award size={16} color="#64748b" />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-cat">{item.issuer}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.issueDate || 'N/A'}</span>
                    </td>
                    <td>
                      {item.credentialUrl ? (
                        <a href={item.credentialUrl} target="_blank" rel="noreferrer" className="badge" style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa' }}>
                          <ExternalLink size={12} />
                          <span>Verify</span>
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
                {isEditing ? `Edit Certification: ${currentItem.name}` : 'Add Certification'}
              </h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group form-full">
                    <label className="form-label" htmlFor="cert-name">Certificate Name *</label>
                    <input
                      id="cert-name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. AWS Certified Cloud Practitioner"
                      value={currentItem.name}
                      onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="cert-issuer">Issuer / Provider *</label>
                    <input
                      id="cert-issuer"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Amazon Web Services, Meta, Coursera"
                      value={currentItem.issuer}
                      onChange={(e) => setCurrentItem({ ...currentItem, issuer: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="cert-date">Issue Date</label>
                    <input
                      id="cert-date"
                      type="text"
                      className="form-input"
                      placeholder="e.g. 2025 or Dec 2024"
                      value={currentItem.issueDate}
                      onChange={(e) => setCurrentItem({ ...currentItem, issueDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label" htmlFor="cert-cred">Credential / Verification URL</label>
                    <input
                      id="cert-cred"
                      type="url"
                      className="form-input"
                      placeholder="https://coursera.org/verify/..."
                      value={currentItem.credentialUrl}
                      onChange={(e) => setCurrentItem({ ...currentItem, credentialUrl: e.target.value })}
                    />
                  </div>

                  {/* Cloudinary Image Upload */}
                  <div className="form-full">
                    <ImageUploadField
                      label="Certificate Badge / Image (Cloudinary or URL)"
                      value={currentItem.imageUrl}
                      onChange={(url) => setCurrentItem({ ...currentItem, imageUrl: url })}
                      folder="portfolio/certificates"
                      hint="Certificate verification image or credential badge"
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label" htmlFor="cert-desc">Description</label>
                    <textarea
                      id="cert-desc"
                      className="form-textarea"
                      placeholder="Key skills demonstrated or coursework completed..."
                      value={currentItem.description}
                      onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="cert-order">Display Order</label>
                    <input
                      id="cert-order"
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
                  {saving ? 'Saving...' : isEditing ? 'Update Certification' : 'Save Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Certification"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        confirmText="Confirm Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
