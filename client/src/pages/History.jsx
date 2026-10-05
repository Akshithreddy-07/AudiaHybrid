import React, { useState } from 'react';
import { Database, Clock, Download } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';
import DataTable from '../components/DataTable';
import usePageTitle from '../hooks/usePageTitle';
import useToast from '../hooks/useToast';

const mockHistoryRecords = [
  { id: 'rec-1', timestamp: '2026-10-05 22:45:00', channel: 'RF AM (1MHz)', avgLevel: '78.2%', rssi: '-58 dBm', snr: '+42 dB', status: 'Stable' },
  { id: 'rec-2', timestamp: '2026-10-05 22:40:00', channel: 'Optical IR (940nm)', avgLevel: '89.5%', rssi: '420 Lux', snr: '+55 dB', status: 'Optimal' },
  { id: 'rec-3', timestamp: '2026-10-05 22:35:00', channel: 'Hybrid Combined', avgLevel: '85.0%', rssi: 'Active Failover', snr: '+48 dB', status: 'Optimal' },
  { id: 'rec-4', timestamp: '2026-10-05 22:30:00', channel: 'RF AM (1MHz)', avgLevel: '74.1%', rssi: '-62 dBm', snr: '+38 dB', status: 'Stable' },
  { id: 'rec-5', timestamp: '2026-10-05 22:25:00', channel: 'Optical IR (940nm)', avgLevel: '91.0%', rssi: '445 Lux', snr: '+56 dB', status: 'Optimal' },
];

export default function History() {
  usePageTitle('Historical Analytics & Telemetry Archive');
  const { showToast } = useToast();
  const [timeRange, setTimeRange] = useState('24h');

  const historyColumns = [
    { key: 'timestamp', label: 'Time Window', className: 'font-mono text-slate-900 dark:text-white' },
    { key: 'channel', label: 'Channel Subsystem', className: 'font-medium' },
    { key: 'avgLevel', label: 'Avg Signal Level', className: 'font-mono text-blue-600 dark:text-blue-400 font-bold' },
    { key: 'rssi', label: 'Carrier RSSI / Flux', className: 'font-mono text-slate-600 dark:text-slate-300' },
    { key: 'snr', label: 'Signal-to-Noise (SNR)', className: 'font-mono text-emerald-600 dark:text-emerald-400' },
    {
      key: 'status',
      label: 'Channel Health',
      render: (val) => (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
          {val}
        </span>
      ),
    },
  ];

  const handleExport = () => {
    showToast('Telemetry CSV archive export prepared (REST API wired in Phase 4)', 'info');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <SectionHeader
          eyebrow="POSTGRESQL TELEMETRY ARCHIVE"
          title="Historical Data Analytics"
          subtitle="Time-bucketed aggregation queries (date_trunc('minute', ts)) for RF and Optical channel stability evaluation."
          align="left"
          className="mb-0"
        />

        {/* Filter Interval Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleExport}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            <span>Export CSV</span>
          </Button>

          <div className="inline-flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {['1h', '6h', '24h', '7d'].map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
                  timeRange === range
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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

      {/* Aggregated Readings Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <span>Recent 5-Minute Time-Bucket Aggregates</span>
        </h3>
        <DataTable
          columns={historyColumns}
          rows={mockHistoryRecords}
          caption="Aggregated Telemetry Records Table"
        />
      </div>

      {/* Database Query Stream Roadmap */}
      <Card variant="default" className="p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
          <Database className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-lg mx-auto">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
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
