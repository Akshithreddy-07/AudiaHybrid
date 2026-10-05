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
  Columns,
  Table as TableIcon,
} from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import SectionHeader from '../components/SectionHeader';
import DataTable from '../components/DataTable';
import usePageTitle from '../hooks/usePageTitle';
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
  usePageTitle('RF vs. Optical Transmission Matrix');
  const [viewMode, setViewMode] = useState('sideBySide'); // 'sideBySide' | 'table'
  const { technologies, metrics } = comparisonData;

  const tableColumns = [
    {
      key: 'feature',
      label: 'Evaluation Criterion',
      className: 'font-bold text-slate-900 dark:text-white w-1/4',
      render: (val, row) => {
        const Icon = iconMap[row.icon] || Radio;
        return (
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{val}</span>
          </div>
        );
      },
    },
    {
      key: 'rf',
      label: 'Radio Frequency (RF Link)',
      className: 'w-3/8 align-top',
      render: (val, row) => (
        <div>
          <div className="font-semibold text-blue-600 dark:text-blue-400 mb-1 font-mono text-xs">
            {row.rfSummary}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{val}</p>
        </div>
      ),
    },
    {
      key: 'optical',
      label: 'Optical Link (LED–Photodiode)',
      className: 'w-3/8 align-top',
      render: (val, row) => (
        <div>
          <div className="font-semibold text-amber-600 dark:text-amber-400 mb-1 font-mono text-xs">
            {row.opticalSummary}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{val}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <SectionHeader
          eyebrow="PHYSICAL LAYER EVALUATION"
          title="RF vs. Optical Transmission Matrix"
          subtitle="In-depth engineering comparison between electromagnetic wave propagation and optical photon transmission."
          align="left"
          className="mb-0"
        />

        <div className="inline-flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('sideBySide')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'sideBySide'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Full Table</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SIDE-BY-SIDE CARDS */}
      {viewMode === 'sideBySide' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* RF Card */}
          <Card variant="default" className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {technologies.rf.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {technologies.rf.tagline}
                  </p>
                </div>
              </div>
              <Badge variant="rf" size="sm">
                455 kHz – 1.6 MHz AM
              </Badge>
            </div>

            {/* Metrics List */}
            <div className="space-y-3.5">
              {metrics.map((m) => {
                const Icon = iconMap[m.icon] || Radio;
                return (
                  <div key={m.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                      <Icon className="w-3.5 h-3.5 text-blue-500" />
                      <span>{m.feature}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {m.rf}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Pros & Cons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="font-mono font-bold text-slate-500 uppercase">Key Advantages & Trade-Offs</div>
              {technologies.rf.pros.map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
              {technologies.rf.cons.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-rose-600 dark:text-rose-400">
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Optical Card */}
          <Card variant="default" className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {technologies.optical.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {technologies.optical.tagline}
                  </p>
                </div>
              </div>
              <Badge variant="optical" size="sm">
                LED + BPW34
              </Badge>
            </div>

            {/* Metrics List */}
            <div className="space-y-3.5">
              {metrics.map((m) => {
                const Icon = iconMap[m.icon] || Sun;
                return (
                  <div key={m.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                      <Icon className="w-3.5 h-3.5 text-amber-500" />
                      <span>{m.feature}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {m.optical}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Pros & Cons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="font-mono font-bold text-slate-500 uppercase">Key Advantages & Trade-Offs</div>
              {technologies.optical.pros.map((p, i) => (
                <div key={i} className="flex items-start gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
              {technologies.optical.cons.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-rose-600 dark:text-rose-400">
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </Card>

        </div>
      )}

      {/* VIEW 2: FULL EVALUATION TABLE */}
      {viewMode === 'table' && (
        <DataTable
          columns={tableColumns}
          rows={metrics}
          caption="RF vs Optical Evaluation Table"
        />
      )}

    </div>
  );
}
