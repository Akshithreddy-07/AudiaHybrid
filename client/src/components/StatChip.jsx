import React from 'react';

/**
 * Reusable StatChip component
 * Compact badge/pill displaying a hardware metric, tag, or status.
 */
export default function StatChip({
  icon: Icon,
  label,
  value,
  variant = 'default',
  size = 'md',
  className = '',
}) {
  const variantStyles = {
    default: 'bg-white/50 dark:bg-white/10 text-text-primary dark:text-text-darkPrimary border-white/60 dark:border-white/20',
    primary: 'bg-primary-dark text-white border-white/20',
    accent: 'bg-accent/20 text-text-primary dark:text-text-darkPrimary border-accent/40',
    success: 'bg-status-success/20 text-emerald-800 dark:text-emerald-300 border-status-success/40',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-xs md:text-sm gap-2',
    lg: 'px-4 py-2 text-sm gap-2.5',
  };

  return (
    <div
      className={`inline-flex items-center rounded-pill border ${variantStyles[variant]} ${sizeStyles[size]} transition-all duration-200 select-none ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0 text-accent" aria-hidden="true" />}
      {label && <span className="text-text-secondary dark:text-text-darkSecondary font-normal">{label}:</span>}
      <span className="font-semibold">{value}</span>
    </div>
  );
}
