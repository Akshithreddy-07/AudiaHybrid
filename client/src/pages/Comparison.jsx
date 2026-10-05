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
} from 'lucide-react';
import Card from '../components/Card';
import comparisonData from '../data/comparison.json';

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
    <div className="w-full flex flex-col px-4 sm:px-6 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto space-y-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-hairline-light dark:border-hairline-dark">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-accent-lime shrink-0" />
            <span className="text-xs font-bold uppercase tracking-label text-ink dark:text-ink-dark">
              Physical Layer Evaluation
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-headline text-ink dark:text-ink-dark">
            RF vs. Optical Comparison
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark max-w-2xl leading-relaxed">
            Direct parameter comparison between electromagnetic wave propagation and optical photon
            transmission in assistive listening.
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center p-1 rounded-pill bg-white dark:bg-card-dark border border-hairline-light dark:border-hairline-dark shadow-subtle">
            <button
              type="button"
              onClick={() => setViewMode('sideBySide')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-xs font-bold transition-all ${
                viewMode === 'sideBySide'
                  ? 'bg-ink text-white dark:bg-white dark:text-ink shadow-subtle'
                  : 'text-ink dark:text-ink-dark hover:bg-surface-subtle'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-ink text-white dark:bg-white dark:text-ink shadow-subtle'
                  : 'text-ink dark:text-ink-dark hover:bg-surface-subtle'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          {/* Mobile Segmented Switch (<768px in sideBySide mode) */}
          {viewMode === 'sideBySide' && (
            <div className="md:hidden inline-flex items-center p-1 rounded-pill bg-white dark:bg-card-dark border border-hairline-light dark:border-hairline-dark shadow-subtle w-full">
              <button
                type="button"
                onClick={() => setMobileTab('rf')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-pill text-xs font-bold transition-all ${
                  mobileTab === 'rf'
                    ? 'bg-badge-rf text-white shadow-subtle'
                    : 'text-ink dark:text-ink-dark'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>RF Link</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileTab('optical')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-pill text-xs font-bold transition-all ${
                  mobileTab === 'optical'
                    ? 'bg-badge-optical text-white shadow-subtle'
                    : 'text-ink dark:text-ink-dark'
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
      {/* VIEW 1: SIDE-BY-SIDE TALL WHITE CARDS                                     */}
      {/* ========================================================================= */}
      {viewMode === 'sideBySide' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* RF Card */}
          <div className={`${mobileTab === 'rf' ? 'block' : 'hidden md:block'}`}>
            <Card variant="default" rounded="rounded-card" className="p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-badge-rf text-white flex items-center justify-center shadow-subtle">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-headline text-ink dark:text-ink-dark">
                      {technologies.rf.name}
                    </h2>
                    <p className="text-xs text-ink-secondary dark:text-ink-secondaryDark">
                      {technologies.rf.tagline}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-pill bg-badge-rf/10 text-badge-rf border border-badge-rf/20">
                  Carrier ~100 MHz
                </span>
              </div>

              {/* Metric Rows */}
              <div className="space-y-3">
                {metrics.map((metric) => {
                  const Icon = iconMap[metric.icon] || Radio;
                  return (
                    <div
                      key={`rf-${metric.id}`}
                      className="p-3.5 rounded-2xl bg-surface-subtle dark:bg-surface-subtleDark border border-hairline-light dark:border-hairline-dark"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-ink dark:text-ink-dark mb-1">
                        <Icon className="w-3.5 h-3.5 text-badge-rf" />
                        <span>{metric.feature}</span>
                      </div>
                      <p className="text-xs text-ink-secondary dark:text-ink-secondaryDark leading-relaxed">
                        {metric.rf}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Strengths & Limitations */}
              <div className="pt-4 border-t border-hairline-light dark:border-hairline-dark space-y-2 text-xs">
                <div className="text-[11px] font-bold uppercase tracking-label text-ink-secondary dark:text-ink-secondaryDark mb-2">
                  Key Trade-Offs
                </div>
                {technologies.rf.pros.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 text-status-ok">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span className="text-ink dark:text-ink-dark">{p}</span>
                  </div>
                ))}
                {technologies.rf.cons.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-status-danger">
                    <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span className="text-ink dark:text-ink-dark">{c}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Optical Card */}
          <div className={`${mobileTab === 'optical' ? 'block' : 'hidden md:block'}`}>
            <Card variant="default" rounded="rounded-card" className="p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-badge-optical text-white flex items-center justify-center shadow-subtle">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-headline text-ink dark:text-ink-dark">
                      {technologies.optical.name}
                    </h2>
                    <p className="text-xs text-ink-secondary dark:text-ink-secondaryDark">
                      {technologies.optical.tagline}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-pill bg-badge-optical/10 text-badge-optical border border-badge-optical/20">
                  LED + Photodiode
                </span>
              </div>

              {/* Metric Rows */}
              <div className="space-y-3">
                {metrics.map((metric) => {
                  const Icon = iconMap[metric.icon] || Sun;
                  return (
                    <div
                      key={`opt-${metric.id}`}
                      className="p-3.5 rounded-2xl bg-surface-subtle dark:bg-surface-subtleDark border border-hairline-light dark:border-hairline-dark"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-ink dark:text-ink-dark mb-1">
                        <Icon className="w-3.5 h-3.5 text-badge-optical" />
                        <span>{metric.feature}</span>
                      </div>
                      <p className="text-xs text-ink-secondary dark:text-ink-secondaryDark leading-relaxed">
                        {metric.optical}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Strengths & Limitations */}
              <div className="pt-4 border-t border-hairline-light dark:border-hairline-dark space-y-2 text-xs">
                <div className="text-[11px] font-bold uppercase tracking-label text-ink-secondary dark:text-ink-secondaryDark mb-2">
                  Key Trade-Offs
                </div>
                {technologies.optical.pros.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 text-status-ok">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span className="text-ink dark:text-ink-dark">{p}</span>
                  </div>
                ))}
                {technologies.optical.cons.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-status-danger">
                    <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span className="text-ink dark:text-ink-dark">{c}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: FULL COMPARISON TABLE                                             */}
      {/* ========================================================================= */}
      {viewMode === 'table' && (
        <Card variant="default" rounded="rounded-card" className="p-4 sm:p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b border-hairline-light dark:border-hairline-dark text-xs font-bold text-ink dark:text-ink-dark uppercase tracking-label">
                  <th className="py-3 px-4 w-1/4">Evaluation Parameter</th>
                  <th className="py-3 px-4 w-3/8 text-badge-rf">Radio Frequency (RF)</th>
                  <th className="py-3 px-4 w-3/8 text-badge-optical">Optical (LED–Photodiode)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline-light dark:divide-hairline-dark text-xs sm:text-sm">
                {metrics.map((metric) => {
                  const Icon = iconMap[metric.icon] || Radio;
                  return (
                    <tr key={metric.id} className="hover:bg-surface-subtle dark:hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-ink dark:text-ink-dark align-top">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-ink-secondary dark:text-ink-secondaryDark shrink-0" />
                          <span>{metric.feature}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-ink-secondary dark:text-ink-secondaryDark align-top">
                        <div className="font-semibold text-ink dark:text-ink-dark mb-1">{metric.rfSummary}</div>
                        <p className="text-xs opacity-85">{metric.rf}</p>
                      </td>
                      <td className="py-3.5 px-4 text-ink-secondary dark:text-ink-secondaryDark align-top">
                        <div className="font-semibold text-ink dark:text-ink-dark mb-1">{metric.opticalSummary}</div>
                        <p className="text-xs opacity-85">{metric.optical}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

    </div>
  );
}
