import React from 'react';
import { History as HistoryIcon, Clock, Calendar, Database, Filter } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import SectionHeader from '../components/SectionHeader';
import PillButton from '../components/PillButton';

export default function History() {
  return (
    <div className="w-full flex flex-col px-4 sm:px-6 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="relative rounded-3xl hero-sky-bg p-6 sm:p-10 mb-8 overflow-hidden shadow-glass border border-white/70 dark:border-white/20">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-pill bg-white/60 dark:bg-black/40 border border-white/60 text-xs font-bold uppercase tracking-wider text-primary-dark dark:text-accent mb-3">
            <HistoryIcon className="w-3.5 h-3.5" /> PostgreSQL Data Logging
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-primary-dark dark:text-white tracking-tight">
            Historical <span className="font-semibold text-accent">Telemetry</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-text-primary dark:text-text-darkPrimary max-w-2xl leading-relaxed">
            Time-bucketed channel analytics aggregated over 1h, 6h, and 24h intervals with min/max/average statistics.
          </p>
        </div>
      </div>

      {/* Filters Bar Placeholder */}
      <GlassCard variant="default" rounded="rounded-card" className="p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold text-text-primary dark:text-text-darkPrimary">Time Window:</span>
          <div className="inline-flex items-center p-1 rounded-pill bg-white/50 dark:bg-black/20 border border-white/60 dark:border-white/10">
            <button type="button" className="px-3 py-1 rounded-pill bg-primary-dark text-white text-xs font-semibold">1 Hour</button>
            <button type="button" className="px-3 py-1 rounded-pill text-xs font-medium text-text-primary dark:text-text-darkPrimary hover:bg-white/50">6 Hours</button>
            <button type="button" className="px-3 py-1 rounded-pill text-xs font-medium text-text-primary dark:text-text-darkPrimary hover:bg-white/50">24 Hours</button>
          </div>
        </div>

        <div className="text-xs text-text-secondary dark:text-text-darkSecondary">
          Database: PostgreSQL Time-Bucketed <code className="font-mono bg-black/5 px-1.5 py-0.5 rounded">date_trunc('minute')</code>
        </div>
      </GlassCard>

      {/* History Placeholder */}
      <GlassCard variant="default" rounded="rounded-card" className="p-8 text-center space-y-4">
        <Database className="w-8 h-8 text-accent mx-auto animate-pulse" />
        <h3 className="text-xl font-bold text-text-primary dark:text-text-darkPrimary">
          History Analytics Wired in Phase 4 & Phase 7
        </h3>
        <p className="text-sm text-text-secondary dark:text-text-darkSecondary max-w-xl mx-auto">
          In Phase 4, the Express backend `/api/readings/history` endpoint and PostgreSQL database will be established, and Phase 7 will render full interactive historical charts.
        </p>
      </GlassCard>
    </div>
  );
}
