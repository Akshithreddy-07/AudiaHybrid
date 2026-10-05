import { createSlice } from '@reduxjs/toolkit';

// Helper to get initial theme from localStorage or system preference
const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('audia_theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getInitialHighContrast = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('audia_high_contrast') === 'true';
};

const getInitialLargeText = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('audia_large_text') === 'true';
};

const initialState = {
  theme: getInitialTheme(),
  highContrast: getInitialHighContrast(),
  largeText: getInitialLargeText(),
};

// Apply DOM classes based on state
export const applyThemeToDOM = (state) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (state.theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  if (state.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }

  if (state.largeText) {
    root.classList.add('large-text');
  } else {
    root.classList.remove('large-text');
  }
};

// Initial run on module load
applyThemeToDOM(initialState);

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('audia_theme', state.theme);
      applyThemeToDOM(state);
    },
    setTheme: (state, action) => {
      state.theme = action.payload === 'dark' ? 'dark' : 'light';
      localStorage.setItem('audia_theme', state.theme);
      applyThemeToDOM(state);
    },
    toggleHighContrast: (state) => {
      state.highContrast = !state.highContrast;
      localStorage.setItem('audia_high_contrast', String(state.highContrast));
      applyThemeToDOM(state);
    },
    toggleLargeText: (state) => {
      state.largeText = !state.largeText;
      localStorage.setItem('audia_large_text', String(state.largeText));
      applyThemeToDOM(state);
    },
  },
});

export const { toggleTheme, setTheme, toggleHighContrast, toggleLargeText } = uiSlice.actions;

export const selectTheme = (state) => state.ui.theme;
export const selectIsDark = (state) => state.ui.theme === 'dark';
export const selectHighContrast = (state) => state.ui.highContrast;
export const selectLargeText = (state) => state.ui.largeText;

export default uiSlice.reducer;
