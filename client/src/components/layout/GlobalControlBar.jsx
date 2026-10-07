import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Sliders,
  Play,
  Pause,
  Sun,
  Moon,
  Monitor,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useControls } from '../../context/ControlsContext.jsx';

/**
 * Global control bar offering shared filtering, time windows, and pause controls
 */
export function GlobalControlBar({ pendingCount = 0 }) {
  const {
    linkFocus,
    setLinkFocus,
    timeRange,
    setTimeRange,
    isPaused,
    togglePaused,
    displayUnit,
    setDisplayUnit,
    smoothing,
    setSmoothing,
    yAxisMode,
    setYAxisMode,
    threshold,
    setThreshold,
    theme,
    setTheme,
    setShortcutsOpen,
  } = useControls();

  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <aside aria-label="Global Instrument Controls" className="w-full bg-[#151A1D] border-b border-[#262D31]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-2.5">
        {/* Mobile Accordion Toggle */}
        <div className="md:hidden flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8A919A]">
            <Sliders className="w-3.5 h-3.5 text-[#5DCAA5]" />
            <span>Instrument Settings</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={togglePaused}
              className={`px-2.5 py-1 text-xs font-mono rounded border flex items-center gap-1.5 ${
                isPaused
                  ? 'bg-[#EF9F27]/15 border-[#EF9F27] text-[#EF9F27]'
                  : 'bg-[#0F1214] border-[#262D31] text-[#E6E3DA]'
              }`}
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              <span>{isPaused ? `Resume (+${pendingCount})` : 'Pause'}</span>
            </button>

            <button
              onClick={() => setMobileExpanded(!mobileExpanded)}
              className="p-1.5 text-xs font-mono rounded bg-[#0F1214] border border-[#262D31] text-[#8A919A]"
              aria-label="Toggle controls drawer"
            >
              {mobileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Desktop Bar & Mobile Expandable Drawer */}
        <div className={`${mobileExpanded ? 'block mt-3 pt-3 border-t border-[#262D31]' : 'hidden md:flex'} flex-wrap items-center justify-between gap-3 text-xs font-mono`}>
          
          {/* Group 1: Primary Stream Actions (Link Focus, Time Range, Pause) */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Link Focus Segmented Control */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#8A919A] text-[11px] uppercase tracking-wider">Link Focus:</span>
              <div className="flex rounded border border-[#262D31] bg-[#0F1214] p-0.5" role="group" aria-label="Link focus filter">
                {['both', 'optical', 'rf'].map((focus) => (
                  <button
                    key={focus}
                    onClick={() => setLinkFocus(focus)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase transition-colors ${
                      linkFocus === focus
                        ? focus === 'optical'
                          ? 'bg-[#EF9F27]/20 text-[#EF9F27] border border-[#EF9F27]/40'
                          : focus === 'rf'
                          ? 'bg-[#378ADD]/20 text-[#378ADD] border border-[#378ADD]/40'
                          : 'bg-[#5DCAA5]/20 text-[#5DCAA5] border border-[#5DCAA5]/40'
                        : 'text-[#8A919A] hover:text-[#E6E3DA] border border-transparent'
                    }`}
                  >
                    {focus}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#8A919A] text-[11px] uppercase tracking-wider">Window:</span>
              <div className="flex rounded border border-[#262D31] bg-[#0F1214] p-0.5" role="group" aria-label="Time window selector">
                {['60s', '5m', '1h', '24h'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                      timeRange === range
                        ? 'bg-[#262D31] text-[#E6E3DA] font-bold'
                        : 'text-[#8A919A] hover:text-[#E6E3DA]'
                    }`}
                  >
                    {range === '60s' ? '60 s' : range === '5m' ? '5 min' : range === '1h' ? '1 h' : '24 h'}
                  </button>
                ))}
              </div>
            </div>

            {/* Pause / Resume Button (Desktop) */}
            <button
              onClick={togglePaused}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
                isPaused
                  ? 'bg-[#EF9F27]/15 border-[#EF9F27] text-[#EF9F27] font-bold'
                  : 'bg-[#0F1214] border-[#262D31] text-[#E6E3DA] hover:bg-[#1C2226]'
              }`}
              title="Shortcut: Space"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'Resume Stream' : 'Pause'}</span>
              {isPaused && pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded bg-[#EF9F27] text-black font-bold text-[10px]">
                  +{pendingCount}
                </span>
              )}
            </button>

          </div>

          {/* Group 2: Display Units, Smoothing, Y-Axis, Threshold, Theme */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Units Selector with Tooltip */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#8A919A] text-[11px] uppercase tracking-wider">Units:</span>
              <div className="flex rounded border border-[#262D31] bg-[#0F1214] p-0.5" role="group" aria-label="Telemetry display units">
                {['counts', 'percent', 'mv'].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setDisplayUnit(unit)}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                      displayUnit === unit
                        ? 'bg-[#262D31] text-[#E6E3DA] font-bold'
                        : 'text-[#8A919A] hover:text-[#E6E3DA]'
                    }`}
                    title={
                      unit === 'mv'
                        ? 'Approximate mV = counts × 3300 / 4095 (Note: ESP32 ADC non-linearity at 11 dB attenuation)'
                        : undefined
                    }
                  >
                    {unit === 'counts' ? 'Counts' : unit === 'percent' ? '% FS' : 'approx. mV'}
                  </button>
                ))}
              </div>
            </div>

            {/* Smoothing: Raw vs Moving Average */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#8A919A] text-[11px] uppercase tracking-wider">Filter:</span>
              <div className="flex rounded border border-[#262D31] bg-[#0F1214] p-0.5" role="group" aria-label="Smoothing filter">
                {['raw', 'moving_avg'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSmoothing(mode)}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                      smoothing === mode
                        ? 'bg-[#262D31] text-[#E6E3DA] font-bold'
                        : 'text-[#8A919A] hover:text-[#E6E3DA]'
                    }`}
                  >
                    {mode === 'raw' ? 'Raw' : 'Avg (5s)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Y-Axis: Auto vs Fixed */}
            <div className="flex items-center gap-1.5">
              <span className="text-[#8A919A] text-[11px] uppercase tracking-wider">Y-Axis:</span>
              <div className="flex rounded border border-[#262D31] bg-[#0F1214] p-0.5" role="group" aria-label="Y-Axis mode">
                {['fixed', 'auto'].map((yMode) => (
                  <button
                    key={yMode}
                    onClick={() => setYAxisMode(yMode)}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                      yAxisMode === yMode
                        ? 'bg-[#262D31] text-[#E6E3DA] font-bold'
                        : 'text-[#8A919A] hover:text-[#E6E3DA]'
                    }`}
                  >
                    {yMode === 'fixed' ? 'Fixed (0-4k)' : 'Auto'}
                  </button>
                ))}
              </div>
            </div>

            {/* Threshold Line Slider (Display Only) */}
            <div className="flex items-center gap-1.5" title="Mirrors the backend default; changing it does not affect the server">
              <span className="text-[#8A919A] text-[11px] uppercase tracking-wider">Threshold:</span>
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={threshold ?? 20}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-16 h-1 accent-[#5DCAA5] cursor-pointer"
                aria-label="Display threshold line"
              />
              <span className="text-[#5DCAA5] text-[11px] font-bold tabular-nums w-7">{threshold ?? 20}</span>
            </div>

            {/* Theme Selector */}
            <div className="flex rounded border border-[#262D31] bg-[#0F1214] p-0.5" role="group" aria-label="Color theme">
              {['dark', 'light', 'system'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                    theme === t ? 'bg-[#262D31] text-[#E6E3DA]' : 'text-[#8A919A] hover:text-[#E6E3DA]'
                  }`}
                  title={`Theme: ${t}`}
                >
                  {t === 'dark' ? <Moon className="w-3 h-3" /> : t === 'light' ? <Sun className="w-3 h-3" /> : <Monitor className="w-3 h-3" />}
                </button>
              ))}
            </div>

            {/* Keyboard Shortcuts Trigger */}
            <button
              onClick={() => setShortcutsOpen(true)}
              className="p-1 rounded bg-[#0F1214] border border-[#262D31] text-[#8A919A] hover:text-[#E6E3DA] transition-colors"
              title="Keyboard Shortcuts (Press ?)"
              aria-label="Open keyboard shortcuts guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      </div>
    </aside>
  );
}

GlobalControlBar.propTypes = {
  pendingCount: PropTypes.number,
};
