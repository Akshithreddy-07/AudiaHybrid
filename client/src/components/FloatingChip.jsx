import React from 'react';

/**
 * FloatingChip component
 * Floats up/down 6px slowly using pure CSS animation over the illustration panel.
 */
export default function FloatingChip({
  icon: Icon,
  label,
  value,
  animation = 'float-slow',
  className = '',
}) {
  const animClass = animation === 'float-slow-alt' ? 'animate-float-slow-alt' : 'animate-float-slow';

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-pill bg-white text-ink border border-hairline-light shadow-floating select-none ${animClass} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 text-ink shrink-0" aria-hidden="true" />}
      <span className="text-[11px] font-semibold text-ink-secondary">{label}</span>
      <span className="text-xs font-bold text-ink">{value}</span>
    </div>
  );
}
