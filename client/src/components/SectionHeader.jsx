import React from 'react';

/**
 * SectionHeader Component
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
    <div className={`flex flex-col mb-10 ${alignStyles[align]} ${className}`}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-3 select-none">
          {badge}
        </span>
      )}
      {title && (
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
