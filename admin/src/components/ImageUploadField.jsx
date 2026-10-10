import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Link as LinkIcon, Loader2, X } from 'lucide-react';
import { uploadToCloudinary } from '@shared/services/cloudinary';

export default function ImageUploadField({ label, value, onChange, folder = 'portfolio', hint }) {
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
      const res = await uploadToCloudinary(file, folder);
      onChange(res.imageUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Image upload failed. You can paste an image URL directly.');
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
              accept="image/*"
              style={{ display: 'none' }}
            />
            {uploading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <Loader2 className="animate-spin" size={26} color="#3b82f6" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Uploading to Cloudinary...</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <UploadCloud size={28} color="#94a3b8" />
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Click to upload image</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>PNG, JPG, WebP or SVG up to 10MB</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="url"
            className="form-input"
            placeholder="https://images.unsplash.com/... or Cloudinary URL"
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
        <div style={{ position: 'relative', marginTop: '0.5rem' }}>
          <img
            src={value}
            alt="Preview"
            className="image-preview-thumb"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/600x400/1e293b/94a3b8?text=Image+Preview';
            }}
          />
          <button
            type="button"
            onClick={handleClear}
            className="btn-icon danger"
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)'
            }}
            title="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
