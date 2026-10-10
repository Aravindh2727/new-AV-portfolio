import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEMES, THEME_KEY, getInitialTheme, applyThemeToDocument } from './theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    // Apply theme to DOM immediately on mount and updates
    applyThemeToDocument(theme);
  }, [theme]);

  // Synchronize theme across multiple open ecosystem tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === THEME_KEY && (e.newValue === THEMES.LIGHT || e.newValue === THEMES.DARK)) {
        setThemeState(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK));
  };

  const setTheme = (newTheme) => {
    if (newTheme === THEMES.LIGHT || newTheme === THEMES.DARK) {
      setThemeState(newTheme);
    }
  };

  const isDark = theme === THEMES.DARK;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
