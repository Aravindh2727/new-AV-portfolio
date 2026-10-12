/**
 * Ecosystem Shared Theme Utilities
 * Supports persistent 'light' and 'dark' modes with system preference detection
 */

export const THEME_KEY = 'ecosystem_theme';

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

/**
 * Determine the initial theme from localStorage or system preference
 * Defaults to 'dark' for the ecosystem if unspecified.
 */
export function getInitialTheme() {
  if (typeof window === 'undefined') return THEMES.DARK;

  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === THEMES.LIGHT || savedTheme === THEMES.DARK) {
      return savedTheme;
    }
  } catch (e) {
    console.warn('Error reading theme from localStorage:', e);
  }

  // Default to dark mode for developer ecosystem
  return THEMES.DARK;
}

/**
 * Apply the theme attribute to the HTML document and body
 * and persist to localStorage
 */
export function applyThemeToDocument(theme) {
  if (typeof document === 'undefined') return;

  const validTheme = theme === THEMES.LIGHT ? THEMES.LIGHT : THEMES.DARK;
  document.documentElement.setAttribute('data-theme', validTheme);
  document.body.setAttribute('data-theme', validTheme);
  document.documentElement.style.colorScheme = validTheme;

  // Set or remove the .dark-mode / .light-mode helper classes
  if (validTheme === THEMES.DARK) {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }

  try {
    localStorage.setItem(THEME_KEY, validTheme);
  } catch (e) {
    console.warn('Error writing theme to localStorage:', e);
  }
}
