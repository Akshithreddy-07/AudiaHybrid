import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable RoundIconButton component
 * Circular button for icon-only actions, navigation, and controls.
 */
export default function RoundIconButton({
  icon: Icon,
  to,
  onClick,
  variant = 'ghost',
  size = 'md',
  active = false,
  ariaLabel,
  title,
  className = '',
  badge,
  disabled = false,
  type = 'button',
  ...props
}) {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-14 h-14 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  const variantStyles = {
    primary:
      'bg-primary-dark text-white hover:bg-primary-hover shadow-md border border-white/20',
    ghost:
      'glass-panel text-text-primary dark:text-text-darkPrimary hover:bg-white/90 dark:hover:bg-white/20 border-white/60 dark:border-white/20',
    accent:
      'bg-accent text-primary-dark hover:bg-accent-hover font-semibold shadow-glow-accent',
    subtle:
      'bg-black/5 dark:bg-white/5 text-text-secondary dark:text-text-darkSecondary hover:bg-black/10 dark:hover:bg-white/15',
  };

  const activeStyles = active
    ? '!bg-primary-dark !text-white !border-white/40 shadow-lg ring-2 ring-primary-dark/30 dark:ring-white/30 scale-105'
    : '';

  const combinedClasses = `relative inline-flex items-center justify-center rounded-full transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant]} ${activeStyles} ${className}`;

  const content = (
    <>
      {Icon && <Icon className={`${iconSizes[size]} shrink-0 transition-transform duration-200 group-hover:scale-110`} aria-hidden="true" />}
      {badge && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-white dark:border-page-dark" />
      )}
      <span className="sr-only">{ariaLabel || title}</span>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`group ${combinedClasses}`}
        aria-label={ariaLabel || title}
        title={title}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={`group ${combinedClasses}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || title}
      title={title}
      {...props}
    >
      {content}
    </button>
  );
}
