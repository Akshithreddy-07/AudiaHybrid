import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  X,
  Radio,
  Sun,
  Activity,
  Zap,
  Info,
  Layers,
  ShieldAlert,
} from 'lucide-react';
import DataTable from './DataTable';

/**
 * StagePanel Component - Side drawer/card showing in-depth hardware stage specs
 */
export default function StagePanel({
  stage,
  onClose,
  selectedVariant = 'rf',
  onVariantChange,
}) {
  // Listen for Esc key to close panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!stage) return null;

  const hasVariants = Boolean(stage.variants && stage.variants.length > 0);
  const activeVariantData = hasVariants
    ? stage.variants.find((v) => v.type === selectedVariant) || stage.variants[0]
    : null;

  // Use variant specific data when available, otherwise fall back to top-level stage data
  const keyParts = activeVariantData?.keyParts || stage.keyParts || [];
  const typicalValues = activeVariantData?.typicalValues || stage.typicalValues || [];
  const notes = activeVariantData?.notes || stage.notes;

  const tableColumns = [
    { key: 'label', label: 'Parameter', className: 'font-medium text-slate-900 dark:text-white w-1/2' },
    { key: 'value', label: 'Typical Value', className: 'font-mono text-blue-600 dark:text-blue-400 w-1/2' },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-600 text-white">
              STAGE {stage.order} OF 11
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {stage.group}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {stage.name}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close stage details"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Segmented Variant Tab for Dual-Output Stages */}
      {hasVariants && (
        <div className="px-4 sm:px-5 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/20">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Select Active Transmission Channel Variant:
          </div>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => onVariantChange('rf')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-semibold transition-all ${
                selectedVariant === 'rf'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>RF Subsystem</span>
            </button>
            <button
              type="button"
              onClick={() => onVariantChange('optical')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-semibold transition-all ${
                selectedVariant === 'optical'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Optical Subsystem</span>
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="p-4 sm:p-5 space-y-5 overflow-y-auto max-h-[calc(100vh-280px)] text-xs">
        {/* Purpose */}
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5 text-xs">
            <Zap className="w-3.5 h-3.5 text-blue-500" />
            <span>Circuit Function & Purpose</span>
          </h4>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            {stage.purpose}
          </p>
        </div>

        {/* Signal Before / After Waveform Box */}
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Signal Transformation</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Input Signal (Before)
              </span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {stage.signalBefore}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
              <span className="font-semibold text-blue-600 dark:text-blue-400 block mb-1">
                Output Signal (After)
              </span>
              <span className="font-mono text-slate-800 dark:text-slate-200">
                {stage.signalAfter}
              </span>
            </div>
          </div>
        </div>

        {/* Key Components */}
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5 text-xs">
            <Layers className="w-3.5 h-3.5 text-purple-500" />
            <span>Key Bill of Materials (BOM)</span>
          </h4>
          <ul className="grid grid-cols-1 gap-1.5">
            {keyParts.map((part, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 font-mono text-slate-700 dark:text-slate-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <span>{part}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Typical Engineering Values Table */}
        {typicalValues.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5 text-xs">
              <Info className="w-3.5 h-3.5 text-blue-500" />
              <span>Typical Operating Values</span>
            </h4>
            <DataTable
              columns={tableColumns}
              rows={typicalValues}
              rowKey="label"
              caption={`Typical values for ${stage.name}`}
            />
          </div>
        )}

        {/* Hardware & Tuning Notes */}
        {notes && (
          <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-amber-900 dark:text-amber-200">
            <div className="font-semibold flex items-center gap-1.5 mb-1 text-xs text-amber-800 dark:text-amber-300">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>ECE Lab & Tuning Note</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

StagePanel.propTypes = {
  stage: PropTypes.shape({
    id: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    group: PropTypes.string.isRequired,
    purpose: PropTypes.string.isRequired,
    keyParts: PropTypes.arrayOf(PropTypes.string),
    typicalValues: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ),
    notes: PropTypes.string,
    signalBefore: PropTypes.string,
    signalAfter: PropTypes.string,
    variants: PropTypes.array,
  }),
  onClose: PropTypes.func.isRequired,
  selectedVariant: PropTypes.oneOf(['rf', 'optical']),
  onVariantChange: PropTypes.func.isRequired,
};
