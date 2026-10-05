import React from 'react';

/**
 * Technical TelemetryMeter Component
 */
export default function TelemetryMeter({
  label,
  value = 0,
  max = 100,
  min = 0,
  unit = '%',
  color = 'rf',
  showValue = true,
  className = '',
}) {
  const clampedValue = Math.min(Math.max(value, min), max);
  const percentage = ((clampedValue - min) / (max - min)) * 100;

  const colorStyles = {
    rf: 'bg-blue-500',
    optical: 'bg-amber-500',
    audio: 'bg-emerald-500',
    hybrid: 'bg-purple-500',
    default: 'bg-brand-600',
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-slate-500 dark:text-slate-400 font-medium">{label}</span>
        {showValue && (
          <span className="font-mono font-bold text-slate-900 dark:text-white">
            {value}{unit}
          </span>
        )}
      </div>
      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colorStyles[color] || colorStyles.default}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-label={label}
        />
      </div>
    </div>
  );
}
