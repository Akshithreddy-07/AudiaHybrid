import React from 'react';

/**
 * Reusable Meter component
 * Horizontal progress indicator with glass styling for RF, Optical, and Audio levels.
 */
export default function Meter({
  label,
  value = 0,
  max = 100,
  unit = '%',
  color = 'accent',
  showValue = true,
  className = '',
}) {
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percentage = (clampedValue / max) * 100;

  const colorStyles = {
    accent: 'bg-accent',
    primary: 'bg-primary-dark dark:bg-purple-400',
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    danger: 'bg-status-danger',
  };

  return (
    <div className={`w-full space-y-1 ${className}`}>
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-text-secondary dark:text-text-darkSecondary">{label}</span>
        {showValue && (
          <span className="font-semibold text-text-primary dark:text-text-darkPrimary">
            {value}{unit}
          </span>
        )}
      </div>
      <div className="w-full h-2 rounded-pill bg-black/10 dark:bg-white/10 overflow-hidden p-0.5 border border-white/40 dark:border-white/10">
        <div
          className={`h-full rounded-pill transition-all duration-500 ease-out ${colorStyles[color] || colorStyles.accent}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        />
      </div>
    </div>
  );
}
