import React from 'react';
import PropTypes from 'prop-types';
import { Layers, Sparkles } from 'lucide-react';

/**
 * StageNode component for the hardware block diagram
 */
export default function StageNode({
  stage,
  isSelected = false,
  onClick,
  onKeyDown,
}) {
  const isTransmitter = stage.group === 'transmitter';
  const hasVariants = Boolean(stage.variants && stage.variants.length > 0);

  const getBorderColor = () => {
    if (isSelected) {
      return 'border-blue-600 dark:border-blue-500 ring-2 ring-blue-500/20 shadow-md';
    }
    return 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm';
  };

  return (
    <button
      type="button"
      id={`node-${stage.id}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-current={isSelected ? 'step' : undefined}
      aria-label={`Stage ${stage.order}: ${stage.name}`}
      className={`group relative flex flex-col items-start p-3.5 rounded-xl bg-white dark:bg-slate-900 border text-left transition-all cursor-pointer w-full min-w-[200px] max-w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${getBorderColor()}`}
    >
      {/* Top Bar: Number & Tag */}
      <div className="flex items-center justify-between w-full mb-2">
        <span
          className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[11px] font-mono font-bold ${
            isSelected
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
          }`}
        >
          {stage.order}
        </span>

        <div className="flex items-center gap-1">
          {hasVariants && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Dual</span>
            </span>
          )}
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
              isTransmitter
                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
            }`}
          >
            {isTransmitter ? 'Tx' : 'Rx'}
          </span>
        </div>
      </div>

      {/* Stage Name */}
      <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1 transition-colors">
        {stage.name}
      </div>

      {/* Primary IC / Part snippet */}
      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate w-full">
        <Layers className="w-3 h-3 shrink-0 text-slate-400" />
        <span className="truncate">{stage.keyParts[0] || 'Discrete Stage'}</span>
      </div>

      {/* Selection indicator pill */}
      {isSelected && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-blue-600 dark:bg-blue-400" />
      )}
    </button>
  );
}

StageNode.propTypes = {
  stage: PropTypes.shape({
    id: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    group: PropTypes.oneOf(['transmitter', 'receiver', 'both']).isRequired,
    keyParts: PropTypes.arrayOf(PropTypes.string).isRequired,
    variants: PropTypes.array,
  }).isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
};
