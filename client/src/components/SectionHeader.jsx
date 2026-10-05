import React from 'react';

/**
 * Editorial SectionHeader Component
 * Clean, bold typography with optional lime square bullet and uppercase category badge.
 */
export default function SectionHeader({
  badge,
  title,
  subtitle,
  limeBullet = true,
  align = 'left',
  className = '',
}) {
  const alignStyles = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div className={`flex flex-col mb-8 sm:mb-10 ${alignStyles[align]} ${className}`}>
      {badge && (
        <div className="flex items-center gap-2 mb-3">
          {limeBullet && <span className="w-2 h-2 bg-accent-lime shrink-0" aria-hidden="true" />}
          <span className="text-xs font-bold uppercase tracking-label text-ink dark:text-ink-dark select-none">
            {badge}
          </span>
        </div>
      )}
      {title && (
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-headline text-ink dark:text-ink-dark">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-2 text-sm sm:text-base text-ink-secondary dark:text-ink-secondaryDark max-w-2xl font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
