import React from 'react';
import { Database, Filter } from 'lucide-react';
import Card from '../components/Card';

export default function History() {
  return (
    <div className="w-full flex flex-col px-4 sm:px-6 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-hairline-light dark:border-hairline-dark pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 bg-accent-lime shrink-0" />
          <span className="text-xs font-bold uppercase tracking-label text-ink dark:text-ink-dark">
            PostgreSQL Telemetry History
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-headline text-ink dark:text-ink-dark">
          Historical Analytics
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark max-w-2xl leading-relaxed">
          Time-bucketed channel analytics aggregated over 1h, 6h, and 24h intervals with min/max/average statistics.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <Card variant="default" rounded="rounded-card" className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-ink dark:text-ink-dark" />
          <span className="text-xs font-bold text-ink dark:text-ink-dark">Interval:</span>
          <div className="inline-flex items-center p-1 rounded-pill bg-surface-subtle dark:bg-surface-subtleDark border border-hairline-light dark:border-hairline-dark">
            <button type="button" className="px-3 py-1 rounded-pill bg-ink text-white dark:bg-white dark:text-ink text-xs font-semibold">1h</button>
            <button type="button" className="px-3 py-1 rounded-pill text-xs font-medium text-ink dark:text-ink-dark hover:bg-black/5">6h</button>
            <button type="button" className="px-3 py-1 rounded-pill text-xs font-medium text-ink dark:text-ink-dark hover:bg-black/5">24h</button>
          </div>
        </div>

        <div className="text-xs text-ink-secondary dark:text-ink-secondaryDark font-mono">
          SQL: <code className="bg-surface-subtle dark:bg-surface-subtleDark px-2 py-0.5 rounded border border-hairline-light dark:border-hairline-dark">date_trunc('minute', ts)</code>
        </div>
      </Card>

      {/* Roadmap Card */}
      <Card variant="default" rounded="rounded-card" className="p-8 text-center space-y-4">
        <Database className="w-8 h-8 text-ink dark:text-ink-dark mx-auto" />
        <h3 className="text-xl font-bold tracking-headline text-ink dark:text-ink-dark">
          History Analytics Wired in Phase 4 & Phase 7
        </h3>
        <p className="text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark max-w-xl mx-auto leading-relaxed">
          In Phase 4, the Express backend `/api/readings/history` endpoint and PostgreSQL database will be established, and Phase 7 will render full interactive historical charts.
        </p>
      </Card>
    </div>
  );
}
