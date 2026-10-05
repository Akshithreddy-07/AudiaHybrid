import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('audia_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isHighContrast, setIsHighContrast] = useState(() => {
    return localStorage.getItem('audia_high_contrast') === 'true';
  });

  const [isLargeText, setIsLargeText] = useState(() => {
    return localStorage.getItem('audia_large_text') === 'true';
  });

  // Apply dark theme class
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('audia_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('audia_theme', 'light');
    }
  }, [isDark]);

  // Apply high contrast class
  useEffect(() => {
    const root = document.documentElement;
    if (isHighContrast) {
      root.classList.add('high-contrast');
      localStorage.setItem('audia_high_contrast', 'true');
    } else {
      root.classList.remove('high-contrast');
      localStorage.setItem('audia_high_contrast', 'false');
    }
  }, [isHighContrast]);

  // Apply large text class
  useEffect(() => {
    const root = document.documentElement;
    if (isLargeText) {
      root.classList.add('large-text');
      localStorage.setItem('audia_large_text', 'true');
    } else {
      root.classList.remove('large-text');
      localStorage.setItem('audia_large_text', 'false');
    }
  }, [isLargeText]);

  const toggleDark = () => setIsDark((prev) => !prev);
  const toggleHighContrast = () => setIsHighContrast((prev) => !prev);
  const toggleLargeText = () => setIsLargeText((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleDark,
        isHighContrast,
        toggleHighContrast,
        isLargeText,
        toggleLargeText,
      }}
    >
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
