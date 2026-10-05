import React, { useState } from 'react';
import { ArrowRight, SlidersHorizontal, Radio, Sun, Sparkles, X } from 'lucide-react';
import PillSelect from './PillSelect';
import PillButton from './PillButton';
import GlassCard from './GlassCard';

/**
 * Floating Pill Bar component
 * Interactive configuration pill allowing environment, mode, and range selection.
 */
export default function PillBar({
  environment,
  setEnvironment,
  mode,
  setMode,
  range,
  setRange,
  className = '',
}) {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const envOptions = [
    { label: 'Classroom', value: 'Classroom' },
    { label: 'Hospital', value: 'Hospital' },
    { label: 'Museum', value: 'Museum' },
  ];

  const modeOptions = [
    { label: 'Hybrid Dual-Link', value: 'Hybrid' },
    { label: 'RF Only', value: 'RF' },
    { label: 'Optical Only', value: 'Optical' },
  ];

  const rangeOptions = [
    { label: 'Up to 10 m (Short)', value: 'Up to 10 m' },
    { label: '10–30 m (Medium)', value: '10–30 m' },
    { label: '30 m+ (Long Range)', value: '30 m+' },
  ];

  return (
    <>
      {/* Desktop Floating Pill Bar */}
      <div
        className={`hidden md:inline-flex items-center gap-2 p-1.5 rounded-pill glass-panel border-white/80 dark:border-white/20 shadow-xl backdrop-blur-glass ${className}`}
      >
        {/* Quick RF Select Button */}
        <button
          type="button"
          onClick={() => setMode('RF')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-xs font-semibold transition-all ${
            mode === 'RF'
              ? 'bg-primary-dark text-white shadow-md'
              : 'hover:bg-white/50 dark:hover:bg-white/10 text-text-primary dark:text-text-darkPrimary'
          }`}
          aria-label="Set mode to RF"
        >
          <Radio className="w-3.5 h-3.5 text-accent" />
          <span>RF</span>
          <ArrowRight className="w-3 h-3 text-accent" />
        </button>

        <div className="w-px h-5 bg-black/10 dark:bg-white/15 mx-1" />

        {/* Environment Select */}
        <PillSelect
          label="Environment"
          value={environment}
          onChange={setEnvironment}
          options={envOptions}
        />

        <div className="w-px h-5 bg-black/10 dark:bg-white/15 mx-1" />

        {/* Link Mode Select */}
        <PillSelect
          label="Link mode"
          value={mode}
          onChange={setMode}
          options={modeOptions}
          icon={Sparkles}
        />

        <div className="w-px h-5 bg-black/10 dark:bg-white/15 mx-1" />

        {/* Range Select */}
        <PillSelect
          label="Range"
          value={range}
          onChange={setRange}
          options={rangeOptions}
        />

        <div className="w-px h-5 bg-black/10 dark:bg-white/15 mx-1" />

        {/* Quick Optical Select Button */}
        <button
          type="button"
          onClick={() => setMode('Optical')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-xs font-semibold transition-all ${
            mode === 'Optical'
              ? 'bg-primary-dark text-white shadow-md'
              : 'hover:bg-white/50 dark:hover:bg-white/10 text-text-primary dark:text-text-darkPrimary'
          }`}
          aria-label="Set mode to Optical"
        >
          <Sun className="w-3.5 h-3.5 text-accent" />
          <span>Optical</span>
          <ArrowRight className="w-3 h-3 text-accent" />
        </button>
      </div>

      {/* Mobile Collapsed Button */}
      <div className="md:hidden flex justify-center w-full">
        <button
          type="button"
          onClick={() => setIsMobileModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-pill glass-panel shadow-lg text-xs font-bold text-text-primary dark:text-text-darkPrimary border-white/80"
          aria-label="Open link configuration finder"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
          <span>Configure Link & Environment</span>
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </button>
      </div>

      {/* Mobile Configuration Drawer */}
      {isMobileModalOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm">
            <GlassCard
              variant="default"
              rounded="rounded-3xl"
              className="p-5 shadow-2xl border-2 border-white/70 dark:border-white/20 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-bold text-text-primary dark:text-text-darkPrimary">
                    Find Your Link
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileModalOpen(false)}
                  className="p-1 rounded-full text-text-secondary dark:text-text-darkSecondary"
                  aria-label="Close configuration"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-left">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary dark:text-text-darkSecondary mb-1">
                    Environment
                  </label>
                  <select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/70 dark:bg-black/30 border border-black/10 dark:border-white/10 text-xs font-medium"
                  >
                    {envOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary dark:text-text-darkSecondary mb-1">
                    Link Mode
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/70 dark:bg-black/30 border border-black/10 dark:border-white/10 text-xs font-medium"
                  >
                    {modeOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary dark:text-text-darkSecondary mb-1">
                    Target Range
                  </label>
                  <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/70 dark:bg-black/30 border border-black/10 dark:border-white/10 text-xs font-medium"
                  >
                    {rangeOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <PillButton
                variant="primary"
                size="md"
                className="w-full mt-2"
                onClick={() => setIsMobileModalOpen(false)}
              >
                Apply Configuration
              </PillButton>
            </GlassCard>
          </div>
        </div>
      )}
    </>
  );
}
