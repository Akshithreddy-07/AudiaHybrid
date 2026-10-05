import React from 'react';

/**
 * Reusable SectionHeader component
 * Displays section eyebrow badge, primary title, and descriptive subtitle.
 */
export default function SectionHeader({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
}) {
  const alignStyles = {
    center: 'text-center items-center',
    left: 'text-left items-start',
    right: 'text-right items-end',
  };

  return (
    <div className={`flex flex-col mb-8 md:mb-12 ${alignStyles[align]} ${className}`}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-pill bg-accent/20 border border-accent/40 text-xs font-semibold uppercase tracking-wider text-text-primary dark:text-accent mb-3 select-none">
          {badge}
        </span>
      )}
      {title && (
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-text-primary dark:text-text-darkPrimary tracking-tight">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-2.5 text-sm sm:text-base text-text-secondary dark:text-text-darkSecondary max-w-2xl font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
