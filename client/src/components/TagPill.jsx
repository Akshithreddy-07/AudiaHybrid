import React from 'react';

/**
 * TagPill component
 * Outlined pill tag used for technology filtering in the illustration panel.
 */
export default function TagPill({
  label,
  active = false,
  onClick,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-pill text-[11px] font-semibold tracking-tight transition-all duration-200 cursor-pointer select-none active:scale-95 ${
        active
          ? 'bg-ink text-white border border-ink dark:bg-white dark:text-ink shadow-subtle'
          : 'bg-white/80 hover:bg-white text-ink border border-white/60 dark:bg-card-dark/80 dark:text-ink-dark dark:border-hairline-dark'
      } ${className}`}
    >
      {label}
    </button>
  );
}
