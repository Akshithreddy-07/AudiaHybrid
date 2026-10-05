import React from 'react';

/**
 * StatBlock component
 * High-contrast editorial stat block with bold typography and lime square bullet.
 */
export default function StatBlock({
  value,
  label,
  sublabel,
  limeBullet = false,
  className = '',
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-2">
        {limeBullet && <span className="w-2 h-2 bg-accent-lime shrink-0" aria-hidden="true" />}
        <span className="text-3xl sm:text-4xl font-semibold tracking-headline text-ink dark:text-ink-dark">
          {value}
        </span>
      </div>
      <div className="text-xs font-semibold uppercase tracking-label text-ink-secondary dark:text-ink-secondaryDark">
        {label}
      </div>
      {sublabel && (
        <div className="text-[11px] text-ink-secondary/80 dark:text-ink-secondaryDark/80">
          {sublabel}
        </div>
      )}
    </div>
  );
}
