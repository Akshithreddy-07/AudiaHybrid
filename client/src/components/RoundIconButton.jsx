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
  variant = 'black',
  size = 'md',
  active = false,
  ariaLabel,
  title,
  className = '',
  badge = false,
  disabled = false,
  type = 'button',
  ...props
}) {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const variantStyles = {
    black:
      'bg-ink text-white hover:bg-neutral-800 dark:bg-white dark:text-ink dark:hover:bg-neutral-200 border border-transparent shadow-subtle',
    white:
      'bg-white text-ink dark:bg-card-dark dark:text-ink-dark border border-hairline-light dark:border-hairline-dark hover:border-ink dark:hover:border-white shadow-subtle',
    ghost:
      'bg-transparent text-ink dark:text-ink-dark hover:bg-black/5 dark:hover:bg-white/10',
    lime:
      'bg-accent-lime text-ink font-bold hover:bg-[#b8e85c]',
  };

  const activeStyles = active
    ? '!bg-ink !text-white dark:!bg-white dark:!text-ink ring-2 ring-ink/20 dark:ring-white/20'
    : '';

  const combinedClasses = `relative inline-flex items-center justify-center rounded-full transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.black} ${activeStyles} ${className}`;

  const content = (
    <>
      {Icon && <Icon className={`${iconSizes[size]} shrink-0 transition-transform duration-200`} aria-hidden="true" />}
      {badge && (
        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-accent-lime rounded-full border-2 border-white dark:border-card-dark" />
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
