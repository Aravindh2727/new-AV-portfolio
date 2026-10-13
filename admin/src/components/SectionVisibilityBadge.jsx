import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { getSettings, toggleSectionVisibility } from '@shared/firebase/queries';
import { useToast } from './Toast';

export default function SectionVisibilityBadge({ sectionKey, sectionName }) {
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const settings = await getSettings();
        if (isMounted && settings?.sections) {
          setEnabled(settings.sections[sectionKey] !== false);
        }
      } catch (err) {
        console.error('Failed to load section setting:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [sectionKey]);

  const handleToggle = async () => {
    if (updating || loading) return;
    const nextState = !enabled;
    setUpdating(true);
    try {
      await toggleSectionVisibility(sectionKey, nextState);
      setEnabled(nextState);
      addToast(
        nextState
          ? `✓ "${sectionName}" section is now VISIBLE on Portfolio`
          : `⊘ "${sectionName}" section is now HIDDEN on Portfolio`,
        nextState ? 'success' : 'info'
      );
    } catch (err) {
      console.error(err);
      addToast(`Failed to update ${sectionName} visibility.`, 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <span className="header-section-toggle-btn" style={{ opacity: 0.6 }}>
        <Loader2 size={13} className="animate-spin" />
        <span>Loading status...</span>
      </span>
    );
  }

  return (
    <button
      type="button"
      className={`header-section-toggle-btn ${enabled ? 'is-active' : 'is-inactive'}`}
      onClick={handleToggle}
      disabled={updating}
      title={`Click to ${enabled ? 'disable / hide' : 'enable / show'} the "${sectionName}" section on the public portfolio website`}
    >
      {updating ? (
        <Loader2 size={13} className="animate-spin" />
      ) : enabled ? (
        <Eye size={14} />
      ) : (
        <EyeOff size={14} />
      )}
      <span>Portfolio: {enabled ? 'Enabled' : 'Disabled'}</span>
    </button>
  );
}
