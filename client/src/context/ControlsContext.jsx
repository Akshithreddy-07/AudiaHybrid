import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * @typedef {'both' | 'optical' | 'rf'} LinkFocus
 * @typedef {'60s' | '5m' | '1h' | '24h'} TimeRange
 * @typedef {'raw' | 'moving_avg'} SmoothingMode
 * @typedef {'auto' | 'fixed'} YAxisMode
 * @typedef {'system' | 'light' | 'dark'} ThemeMode
 * @typedef {'socket' | 'sse'} TransportType
 * @typedef {import('../lib/units.js').DisplayUnit} DisplayUnit
 */

const STORAGE_KEY = 'audiahv_controls_v1';

const DEFAULT_STATE = {
  linkFocus: 'both',
  timeRange: '60s',
  isPaused: false,
  deviceId: 'ESP32-NODE-01',
  displayUnit: 'counts',
  smoothing: 'raw',
  yAxisMode: 'fixed',
  threshold: 20,
  theme: 'dark',
  transport: 'socket',
};

function loadStoredState() {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);

    const validFocus = ['both', 'optical', 'rf'].includes(parsed?.linkFocus) ? parsed.linkFocus : DEFAULT_STATE.linkFocus;
    const validRange = ['60s', '5m', '1h', '24h'].includes(parsed?.timeRange) ? parsed.timeRange : DEFAULT_STATE.timeRange;
    const validUnit = ['counts', 'percent', 'mv'].includes(parsed?.displayUnit) ? parsed.displayUnit : DEFAULT_STATE.displayUnit;
    const validSmoothing = ['raw', 'moving_avg'].includes(parsed?.smoothing) ? parsed.smoothing : DEFAULT_STATE.smoothing;
    const validYAxis = ['auto', 'fixed'].includes(parsed?.yAxisMode) ? parsed.yAxisMode : DEFAULT_STATE.yAxisMode;
    const validTheme = ['system', 'light', 'dark'].includes(parsed?.theme) ? parsed.theme : DEFAULT_STATE.theme;
    const validTransport = ['socket', 'sse'].includes(parsed?.transport) ? parsed.transport : DEFAULT_STATE.transport;
    const validThreshold = typeof parsed?.threshold === 'number' && parsed.threshold >= 5 && parsed.threshold <= 200
      ? parsed.threshold
      : DEFAULT_STATE.threshold;

    return {
      linkFocus: validFocus,
      timeRange: validRange,
      isPaused: false, // Always start unpaused
      deviceId: parsed?.deviceId || DEFAULT_STATE.deviceId,
      displayUnit: validUnit,
      smoothing: validSmoothing,
      yAxisMode: validYAxis,
      threshold: validThreshold,
      theme: validTheme,
      transport: validTransport,
    };
  } catch (e) {
    return DEFAULT_STATE;
  }
}

const ControlsContext = createContext(undefined);

export function ControlsProvider({ children }) {
  const [state, setState] = useState(loadStoredState);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          linkFocus: state.linkFocus,
          timeRange: state.timeRange,
          deviceId: state.deviceId,
          displayUnit: state.displayUnit,
          smoothing: state.smoothing,
          yAxisMode: state.yAxisMode,
          threshold: state.threshold,
          theme: state.theme,
          transport: state.transport,
        })
      );
    } catch (_) {}
  }, [state]);

  // Apply theme to document element
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else if (state.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System mode
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  }, [state.theme]);

  const setLinkFocus = useCallback((focus) => setState((prev) => ({ ...prev, linkFocus: focus })), []);
  const setTimeRange = useCallback((range) => setState((prev) => ({ ...prev, timeRange: range })), []);
  const setIsPaused = useCallback((val) => {
    setState((prev) => ({
      ...prev,
      isPaused: typeof val === 'function' ? val(prev.isPaused) : val,
    }));
  }, []);
  const togglePaused = useCallback(() => setIsPaused((prev) => !prev), [setIsPaused]);
  const setDeviceId = useCallback((id) => setState((prev) => ({ ...prev, deviceId: id })), []);
  const setDisplayUnit = useCallback((unit) => setState((prev) => ({ ...prev, displayUnit: unit })), []);
  const setSmoothing = useCallback((s) => setState((prev) => ({ ...prev, smoothing: s })), []);
  const setYAxisMode = useCallback((m) => setState((prev) => ({ ...prev, yAxisMode: m })), []);
  const setThreshold = useCallback((val) => setState((prev) => ({ ...prev, threshold: val })), []);
  const setTheme = useCallback((t) => setState((prev) => ({ ...prev, theme: t })), []);
  const setTransport = useCallback((t) => setState((prev) => ({ ...prev, transport: t })), []);

  const toggleTheme = useCallback(() => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in input, textarea, or select
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === '1') {
        e.preventDefault();
        setLinkFocus('both');
      } else if (e.key === '2') {
        e.preventDefault();
        setLinkFocus('optical');
      } else if (e.key === '3') {
        e.preventDefault();
        setLinkFocus('rf');
      } else if (e.code === 'Space') {
        e.preventDefault();
        togglePaused();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        toggleTheme();
      } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && shortcutsOpen) {
        setShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setLinkFocus, togglePaused, toggleTheme, shortcutsOpen]);

  return (
    <ControlsContext.Provider
      value={{
        ...state,
        setLinkFocus,
        setTimeRange,
        setIsPaused,
        togglePaused,
        setDeviceId,
        setDisplayUnit,
        setSmoothing,
        setYAxisMode,
        setThreshold,
        setTheme,
        toggleTheme,
        setTransport,
        shortcutsOpen,
        setShortcutsOpen,
      }}
    >
      {children}
    </ControlsContext.Provider>
  );
}

ControlsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useControls() {
  const context = useContext(ControlsContext);
  if (!context) {
    throw new Error('useControls must be used within a ControlsProvider');
  }
  return context;
}
