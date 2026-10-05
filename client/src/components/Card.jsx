import React from 'react';

/**
 * Technical Card Component
 * Crisp border, subtle background contrast, and optional header.
 */
export default function Card({
  children,
  className = '',
  variant = 'default',
  hover = false,
  as: Component = 'div',
  ...props
}) {
  const variantStyles = {
    default: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm',
    subtle: 'bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100',
    flat: 'bg-white dark:bg-slate-900 border-0',
    highlight: 'bg-white dark:bg-slate-900 border-2 border-brand-500/50 shadow-glow-blue',
  };

  const hoverStyles = hover
    ? 'transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
    : '';

  return (
    <Component
      className={`rounded-xl ${variantStyles[variant] || variantStyles.default} ${hoverStyles} p-5 sm:p-6 relative ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
