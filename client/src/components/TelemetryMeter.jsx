import React from 'react';
import PropTypes from 'prop-types';

/**
 * Technical Telemetry Meter with peak hold & channel color accents
 */
export default function TelemetryMeter({
  label,
  value = 0,
  unit = '%',
  min = 0,
  max = 100,
  channel = 'rf',
  showTicks = true,
  status = 'Normal',
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const channelColors = {
    rf: 'bg-blue-600 dark:bg-blue-500',
    optical: 'bg-amber-500 dark:bg-amber-400',
    audio: 'bg-emerald-500 dark:bg-emerald-400',
    hybrid: 'bg-purple-600 dark:bg-purple-400',
  };

  const channelText = {
    rf: 'text-blue-600 dark:text-blue-400',
    optical: 'text-amber-600 dark:text-amber-400',
    audio: 'text-emerald-600 dark:text-emerald-400',
    hybrid: 'text-purple-600 dark:text-purple-400',
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </span>
        <div className="flex items-center gap-2">
          {status && (
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              {status}
            </span>
          )}
          <span className={`font-mono font-bold ${channelText[channel] || channelText.rf}`}>
            {value.toFixed ? value.toFixed(1) : value} {unit}
          </span>
        </div>
      </div>

      {/* Meter Track */}
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700/60">
        <div
          className={`h-full rounded-full transition-all duration-300 ${channelColors[channel] || channelColors.rf}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Scale / Ticks */}
      {showTicks && (
        <div className="flex justify-between text-[9px] font-mono text-slate-400">
          <span>{min}{unit}</span>
          <span>{((min + max) / 2).toFixed(0)}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      )}
    </div>
  );
}

TelemetryMeter.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
  unit: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  channel: PropTypes.oneOf(['rf', 'optical', 'audio', 'hybrid']),
  showTicks: PropTypes.bool,
  status: PropTypes.string,
  className: PropTypes.string,
};
