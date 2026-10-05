import React from 'react';

/**
 * Editorial Meter component
 * Thin solid bar on #E7E8EA track.
 */
export default function Meter({
  label,
  value = 0,
  max = 100,
  unit = '%',
  color = 'ink',
  showValue = true,
  className = '',
}) {
  const clampedValue = Math.min(Math.max(value, 0), max);
  const percentage = (clampedValue / max) * 100;

  const barColors = {
    ink: 'bg-ink dark:bg-white',
    rf: 'bg-badge-rf',
    optical: 'bg-badge-optical',
    ok: 'bg-status-ok',
    warn: 'bg-status-warn',
    danger: 'bg-status-danger',
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-ink-secondary dark:text-ink-secondaryDark">{label}</span>
        {showValue && (
          <span className="font-bold text-ink dark:text-ink-dark">
            {value}{unit}
          </span>
        )}
      </div>
      <div className="w-full h-1.5 rounded-full bg-[#E7E8EA] dark:bg-neutral-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColors[color] || barColors.ink}`}
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
