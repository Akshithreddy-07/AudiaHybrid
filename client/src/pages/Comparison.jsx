import React, { useState } from 'react';
import {
  Radio,
  Sun,
  Eye,
  Maximize2,
  ZapOff,
  ShieldCheck,
  Building2,
  Clock,
  Cpu,
  CheckCircle2,
  XCircle,
  Columns2,
  TableProperties,
  Sparkles,
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import SectionHeader from '../components/SectionHeader';
import PillButton from '../components/PillButton';
import StatChip from '../components/StatChip';
import comparisonData from '../data/comparison.json';

// Map icon strings to Lucide icon components
const iconMap = {
  Eye,
  Maximize2,
  ZapOff,
  ShieldCheck,
  Building2,
  Clock,
  Cpu,
  Radio,
  Sun,
};

export default function Comparison() {
  const [viewMode, setViewMode] = useState('sideBySide'); // 'sideBySide' | 'table'
  const [mobileTab, setMobileTab] = useState('rf'); // 'rf' | 'optical'

  const { technologies, metrics } = comparisonData;

  return (
    <div className="w-full flex flex-col px-4 sm:px-6 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto">
      {/* Header with Short Hero Gradient Background */}
      <div className="relative rounded-3xl hero-sky-bg p-6 sm:p-10 mb-8 overflow-hidden shadow-glass border border-white/70 dark:border-white/20">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-pill bg-white/60 dark:bg-black/40 border border-white/60 text-xs font-bold uppercase tracking-wider text-primary-dark dark:text-accent mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Physical Layer Trade-Offs
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-primary-dark dark:text-white tracking-tight">
            RF vs. Optical <span className="font-semibold text-accent">Comparison</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-text-primary dark:text-text-darkPrimary max-w-2xl leading-relaxed">
            Understanding why a single wireless channel is never enough for all assistive listening
            scenarios, and how the hybrid architecture combines the best of both worlds.
          </p>
        </div>

        {/* View Mode Toggle Switch (Side-by-Side vs Table) */}
        <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-black/10 dark:border-white/10">
          <div className="inline-flex items-center p-1 rounded-pill glass-panel border-white/60 dark:border-white/20 shadow-md">
            <button
              type="button"
              onClick={() => setViewMode('sideBySide')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-pill text-xs font-bold transition-all ${
                viewMode === 'sideBySide'
                  ? 'bg-primary-dark text-white shadow-md'
                  : 'text-text-primary dark:text-text-darkPrimary hover:bg-white/50'
              }`}
              aria-label="Switch to Side by Side view"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Side-by-Side Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-pill text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-primary-dark text-white shadow-md'
                  : 'text-text-primary dark:text-text-darkPrimary hover:bg-white/50'
              }`}
              aria-label="Switch to Table view"
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>Full Comparison Table</span>
            </button>
          </div>

          {/* Mobile Segmented Switch (Visible only on < 768px in sideBySide mode) */}
          {viewMode === 'sideBySide' && (
            <div className="md:hidden inline-flex items-center p-1 rounded-pill glass-panel border-white/60 dark:border-white/20 shadow-md w-full">
              <button
                type="button"
                onClick={() => setMobileTab('rf')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-pill text-xs font-bold transition-all ${
                  mobileTab === 'rf'
                    ? 'bg-primary-dark text-white shadow-md'
                    : 'text-text-primary dark:text-text-darkPrimary'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Radio Frequency (RF)</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('optical')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-pill text-xs font-bold transition-all ${
                  mobileTab === 'optical'
                    ? 'bg-primary-dark text-white shadow-md'
                    : 'text-text-primary dark:text-text-darkPrimary'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Optical Link</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: SIDE-BY-SIDE TALL GLASS CARDS                                     */}
      {/* ========================================================================= */}
      {viewMode === 'sideBySide' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* RF Card */}
          <div className={`${mobileTab === 'rf' ? 'block' : 'hidden md:block'}`}>
            <GlassCard
              variant="default"
              rounded="rounded-card"
              className="p-6 md:p-8 space-y-6 border-indigo-200/60 dark:border-indigo-900/40 shadow-xl"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 flex items-center justify-center text-primary-dark dark:text-indigo-300 shadow-sm">
                    <Radio className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-text-primary dark:text-text-darkPrimary">
                      {technologies.rf.name}
                    </h2>
                    <p className="text-xs text-text-secondary dark:text-text-darkSecondary">
                      {technologies.rf.tagline}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-pill bg-indigo-100 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200">
                  Carrier ~100 MHz
                </span>
              </div>

              {/* Metrics Rows with Icons */}
              <div className="space-y-4">
                {metrics.map((metric) => {
                  const Icon = iconMap[metric.icon] || Sparkles;
                  return (
                    <div
                      key={`rf-${metric.id}`}
                      className="p-3.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 hover:bg-white/70 transition-all"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-primary-dark dark:text-indigo-300 mb-1">
                        <Icon className="w-3.5 h-3.5 text-accent" />
                        <span>{metric.feature}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-text-primary dark:text-text-darkPrimary font-normal leading-relaxed">
                        {metric.rf}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Key Pros & Cons */}
              <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-text-darkSecondary">
                  Summary Strengths & Limitations
                </h4>
                <div className="space-y-2 text-xs">
                  {technologies.rf.pros.map((pro, i) => (
                    <div key={i} className="flex items-start gap-2 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </div>
                  ))}
                  {technologies.rf.cons.map((con, i) => (
                    <div key={i} className="flex items-start gap-2 text-rose-700 dark:text-rose-300">
                      <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Optical Card */}
          <div className={`${mobileTab === 'optical' ? 'block' : 'hidden md:block'}`}>
            <GlassCard
              variant="default"
              rounded="rounded-card"
              className="p-6 md:p-8 space-y-6 border-amber-200/60 dark:border-amber-900/40 shadow-xl"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
                    <Sun className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-text-primary dark:text-text-darkPrimary">
                      {technologies.optical.name}
                    </h2>
                    <p className="text-xs text-text-secondary dark:text-text-darkSecondary">
                      {technologies.optical.tagline}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-pill bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                  LED + Photodiode
                </span>
              </div>

              {/* Metrics Rows with Icons */}
              <div className="space-y-4">
                {metrics.map((metric) => {
                  const Icon = iconMap[metric.icon] || Sparkles;
                  return (
                    <div
                      key={`opt-${metric.id}`}
                      className="p-3.5 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 hover:bg-white/70 transition-all"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">
                        <Icon className="w-3.5 h-3.5 text-accent" />
                        <span>{metric.feature}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-text-primary dark:text-text-darkPrimary font-normal leading-relaxed">
                        {metric.optical}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Key Pros & Cons */}
              <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary dark:text-text-darkSecondary">
                  Summary Strengths & Limitations
                </h4>
                <div className="space-y-2 text-xs">
                  {technologies.optical.pros.map((pro, i) => (
                    <div key={i} className="flex items-start gap-2 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </div>
                  ))}
                  {technologies.optical.cons.map((con, i) => (
                    <div key={i} className="flex items-start gap-2 text-rose-700 dark:text-rose-300">
                      <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: FULL COMPARISON TABLE                                             */}
      {/* ========================================================================= */}
      {viewMode === 'table' && (
        <GlassCard variant="default" rounded="rounded-card" className="p-4 sm:p-6 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-black/15 dark:border-white/15 text-xs font-bold text-text-primary dark:text-text-darkPrimary uppercase tracking-wider">
                  <th className="py-3 px-4 w-1/4">Evaluation Metric</th>
                  <th className="py-3 px-4 w-3/8 text-primary-dark dark:text-indigo-300">Radio Frequency (RF)</th>
                  <th className="py-3 px-4 w-3/8 text-amber-700 dark:text-amber-300">Optical (LED–Photodiode)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5 text-xs sm:text-sm">
                {metrics.map((metric) => {
                  const Icon = iconMap[metric.icon] || Sparkles;
                  return (
                    <tr key={metric.id} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-semibold text-text-primary dark:text-text-darkPrimary align-top">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-accent shrink-0" />
                          <span>{metric.feature}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-text-secondary dark:text-text-darkSecondary align-top">
                        <div className="font-medium text-text-primary dark:text-text-darkPrimary mb-1">
                          {metric.rfSummary}
                        </div>
                        <p className="text-xs opacity-80">{metric.rf}</p>
                      </td>
                      <td className="py-4 px-4 text-text-secondary dark:text-text-darkSecondary align-top">
                        <div className="font-medium text-text-primary dark:text-text-darkPrimary mb-1">
                          {metric.opticalSummary}
                        </div>
                        <p className="text-xs opacity-80">{metric.optical}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
