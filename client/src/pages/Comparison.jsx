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
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';
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
  const { technologies, metrics } = comparisonData;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs font-mono font-bold text-brand-600 uppercase">Physical Layer Evaluation</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            RF vs. Optical Transmission Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            In-depth engineering comparison between electromagnetic wave propagation and optical photon transmission.
          </p>
        </div>

        <div className="inline-flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setViewMode('sideBySide')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'sideBySide'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
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
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Full Table</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SIDE-BY-SIDE CARDS */}
      {viewMode === 'sideBySide' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* RF Column */}
          <Card variant="default" className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold shadow-sm shadow-blue-500/20">
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
                ~100 MHz LC Carrier
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

          {/* Optical Column */}
          <Card variant="default" className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm shadow-amber-500/20">
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
        <Card variant="default" className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px] text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white">
                  <th className="py-3.5 px-4 w-1/4">Evaluation Criterion</th>
                  <th className="py-3.5 px-4 w-3/8 text-blue-600 dark:text-blue-400 font-mono">Radio Frequency (RF Link)</th>
                  <th className="py-3.5 px-4 w-3/8 text-amber-600 dark:text-amber-400 font-mono">Optical Link (LED–Photodiode)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {metrics.map((m) => {
                  const Icon = iconMap[m.icon] || Radio;
                  return (
                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white align-top">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{m.feature}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300 align-top">
                        <div className="font-semibold text-slate-900 dark:text-white mb-1 font-mono text-xs">
                          {m.rfSummary}
                        </div>
                        <p className="text-xs leading-relaxed">{m.rf}</p>
                      </td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300 align-top">
                        <div className="font-semibold text-slate-900 dark:text-white mb-1 font-mono text-xs">
                          {m.opticalSummary}
                        </div>
                        <p className="text-xs leading-relaxed">{m.optical}</p>
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
