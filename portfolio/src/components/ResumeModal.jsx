import React, { useState, useEffect } from 'react';
import { Eye, Download, ExternalLink, X, FileText, Loader2, RefreshCw } from 'lucide-react';

export default function ResumeModal({ isOpen, onClose, resumeUrl, name = 'Aravindh V' }) {
  const [loading, setLoading] = useState(true);
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);

  // Close on Escape key and lock body scroll when modal is active
  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setUseGoogleViewer(false);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !resumeUrl) return null;

  // Resolve best embed preview URL
  let embedUrl = resumeUrl;
  if (useGoogleViewer) {
    embedUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(resumeUrl)}&embedded=true`;
  } else if (resumeUrl.includes('drive.google.com')) {
    embedUrl = resumeUrl.replace(/\/view(\?.*)?$/, '/preview');
  } else if (resumeUrl.toLowerCase().endsWith('.pdf')) {
    // Add PDF viewer flags
    embedUrl = `${resumeUrl}#toolbar=1&navpanes=0&scrollbar=1`;
  }

  return (
    <div
      className="resume-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Resume Preview Modal"
    >
      <div
        className="resume-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="resume-modal-header">
          <div className="resume-modal-title-group">
            <span className="resume-modal-badge">
              <FileText size={12} />
              <span>PDF</span>
            </span>
            <div className="resume-modal-title">
              {name} — Curriculum Vitae
            </div>
          </div>

          <div className="resume-modal-actions">
            {/* Toggle fallback viewer if needed */}
            <button
              type="button"
              className="resume-action-btn"
              onClick={() => {
                setLoading(true);
                setUseGoogleViewer((prev) => !prev);
              }}
              title={useGoogleViewer ? 'Switch to Direct PDF Viewer' : 'Switch to Google Docs Viewer'}
            >
              <RefreshCw size={14} />
              <span>{useGoogleViewer ? 'Direct Viewer' : 'Alt Viewer'}</span>
            </button>

            {/* Open in New Window */}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="resume-action-btn"
              title="Open Resume in new browser tab"
            >
              <ExternalLink size={14} />
              <span>Open Tab</span>
            </a>

            {/* Direct Download */}
            <a
              href={resumeUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="resume-action-btn primary"
              title="Download Resume PDF"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </a>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="resume-modal-close-btn"
              title="Close modal (Esc)"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content - Document Viewer */}
        <div className="resume-modal-body">
          {loading && (
            <div className="resume-loading-overlay">
              <Loader2 size={36} className="animate-spin" color="var(--accent-indigo)" />
              <div style={{ fontSize: '0.925rem', fontWeight: 600 }}>Loading resume preview...</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Preparing document viewer
              </div>
            </div>
          )}

          <iframe
            key={embedUrl}
            src={embedUrl}
            title={`${name} Resume Preview`}
            onLoad={() => setLoading(false)}
            loading="lazy"
          />
        </div>

        {/* Footer info & helper */}
        <div className="resume-fallback-bar">
          <span>Having trouble loading the embedded preview in your browser?</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href={resumeUrl} target="_blank" rel="noreferrer">
              Open directly in new tab &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
