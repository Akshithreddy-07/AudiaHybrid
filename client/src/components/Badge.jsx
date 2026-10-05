import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Channel / Status Badge
 */
export default function Badge({
  children,
  variant = 'slate',
  size = 'md',
  icon: Icon,
  className = '',
  ...props
}) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-xs font-semibold gap-2',
  };

  const variantStyles = {
    rf: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    optical: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    audio: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    hybrid: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    success: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    danger: 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded-full border select-none ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.slate} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    'rf',
    'optical',
    'audio',
    'hybrid',
    'slate',
    'success',
    'warning',
    'danger',
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.element]),
  className: PropTypes.string,
};
