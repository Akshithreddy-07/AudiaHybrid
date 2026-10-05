import React, { useState } from 'react';
import { Database } from 'lucide-react';
import Card from '../components/Card';

export default function History() {
  const [timeRange, setTimeRange] = useState('24h');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs font-mono font-bold text-brand-600 uppercase">PostgreSQL Telemetry Archive</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Historical Data Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Time-bucketed aggregation queries (<code className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-brand-600">date_trunc('minute', ts)</code>) for RF and Optical channel stability.
          </p>
        </div>

        {/* Filter Interval Buttons */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {['1h', '6h', '24h'].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
                  timeRange === range
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Aggregate Metric Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="default" className="p-4 space-y-1">
          <div className="text-[11px] font-mono text-slate-500 uppercase">RF CARRIER AVERAGE</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">76.8%</div>
          <div className="text-xs text-emerald-600 font-mono">Min: 62.4% • Max: 89.1%</div>
        </Card>
        <Card variant="default" className="p-4 space-y-1">
          <div className="text-[11px] font-mono text-slate-500 uppercase">RF RSSI AVERAGE</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">-56 dBm</div>
          <div className="text-xs text-emerald-600 font-mono">P95: -51 dBm • SNR: 41 dB</div>
        </Card>
        <Card variant="default" className="p-4 space-y-1">
          <div className="text-[11px] font-mono text-slate-500 uppercase">OPTICAL LEVEL AVERAGE</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">61.5%</div>
          <div className="text-xs text-amber-600 font-mono">Min: 0.0% (Dropouts: 2)</div>
        </Card>
        <Card variant="default" className="p-4 space-y-1">
          <div className="text-[11px] font-mono text-slate-500 uppercase">HYBRID UPTIME</div>
          <div className="text-2xl font-bold font-mono text-emerald-600">100.0%</div>
          <div className="text-xs text-slate-500 font-mono">Zero dropouts on combined link</div>
        </Card>
      </div>

      {/* Database Query Stream Roadmap */}
      <Card variant="default" className="p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center">
          <Database className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-lg mx-auto">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            PostgreSQL Time-Series Query Engine
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            In Phase 4, the Express REST backend endpoint <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">/api/readings/history?hours=24</code> will connect to the indexed <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">readings(channel, ts DESC)</code> PostgreSQL table to deliver instant historical charts.
          </p>
        </div>
      </Card>

    </div>
  );
}
