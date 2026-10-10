import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', isDanger = true }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <AlertTriangle size={20} color={isDanger ? '#f43f5e' : '#f59e0b'} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{title}</h3>
          </div>
          <button className="btn-icon" onClick={onCancel}>
            <X size={16} />
          </button>
        </div>
        <div className="modal-body" style={{ color: 'var(--text-muted)', fontSize: '0.925rem' }}>
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
