import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, X } from 'lucide-react';
import { uploadToCloudinary } from '@shared/services/cloudinary';

export default function FileUploadField({ label, value, onChange, folder = 'portfolio', hint }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('upload'); // 'upload' | 'url'
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const res = await uploadToCloudinary(file, folder, 'auto');
      onChange(res.imageUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'File upload failed. You can paste a URL directly.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className="form-group">
      <div className="form-label">
        <span>{label}</span>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
          <button
            type="button"
            className="btn-icon btn-sm"
            style={{ border: 'none', color: mode === 'upload' ? '#3b82f6' : '#64748b', background: 'none' }}
            onClick={() => setMode('upload')}
          >
            Upload
          </button>
          <span>|</span>
          <button
            type="button"
            className="btn-icon btn-sm"
            style={{ border: 'none', color: mode === 'url' ? '#3b82f6' : '#64748b', background: 'none' }}
            onClick={() => setMode('url')}
          >
            Direct URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div>
          <div
            className="image-uploader-box"
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/pdf,image/*"
              style={{ display: 'none' }}
            />
            {uploading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <Loader2 className="animate-spin" size={26} color="#3b82f6" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Uploading file...</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <UploadCloud size={28} color="#94a3b8" />
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Click to upload file (PDF)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Max 10MB</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="url"
            className="form-input"
            placeholder="https://..."
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}

      {error && (
        <div style={{ color: '#f43f5e', fontSize: '0.8rem', marginTop: '0.25rem' }}>
          {error}
        </div>
      )}

      {hint && !error && <div className="form-hint">{hint}</div>}

      {value && (
        <div style={{ position: 'relative', marginTop: '0.5rem', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FileText size={24} color="#3b82f6" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
            <a href={value} target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>{value}</a>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="btn-icon danger"
            title="Remove file"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
