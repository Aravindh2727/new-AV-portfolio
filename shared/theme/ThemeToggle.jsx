import React from 'react';
import { LampDesk } from 'lucide-react';
import { useTheme } from './ThemeContext';

/**
 * Universal Lamp-Style Theme Toggle Button for the Developer Ecosystem
 */
export default function ThemeToggle({
  className = '',
  size = 18,
  style = {},
  variant = 'default' // 'default' | 'pill' | 'header'
}) {
  const { theme, isDark, toggleTheme } = useTheme();

  const tooltipText = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-lamp-toggle ${isDark ? 'is-dark' : 'is-light'} ${className}`}
      title={tooltipText}
      aria-label={tooltipText}
      aria-pressed={!isDark}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.45rem',
        borderRadius: '10px',
        border: '1px solid var(--border-subtle, var(--border-tech, var(--border-color, rgba(255, 255, 255, 0.1))))',
        background: isDark
          ? 'var(--border-subtle, var(--border-tech, var(--border-color)))'
          : 'rgba(0, 0, 0, 0.04)',
        color: isDark ? '#fbbf24' : '#d97706',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        ...style
      }}
    >
      {/* Lamp Icon */}
      <LampDesk
        size={size}
        style={{
          transition: 'transform 0.3s ease, filter 0.3s ease, color 0.3s ease',
          filter: isDark
            ? 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.45))'
            : 'drop-shadow(0 0 6px rgba(217, 119, 6, 0.3))',
          transform: isDark ? 'rotate(0deg)' : 'rotate(-4deg)'
        }}
      />
      <span className="sr-only" style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: 0
      }}>
        {tooltipText}
      </span>
    </button>
  );
}
