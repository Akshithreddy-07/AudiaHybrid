import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable PillButton component
 * Variants: primary (navy), ghost (frosted glass), accent (soft orange), outline
 */
export default function PillButton({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  ariaLabel,
  ...props
}) {
  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs font-medium gap-1.5',
    md: 'px-5 py-2.5 text-sm font-medium gap-2',
    lg: 'px-6 py-3 text-base font-semibold gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-primary-dark text-white hover:bg-primary-hover border border-white/20 shadow-md active:scale-95',
    ghost:
      'glass-panel text-text-primary dark:text-text-darkPrimary hover:bg-white/80 dark:hover:bg-white/20 border-white/60 dark:border-white/20 active:scale-95',
    accent:
      'bg-accent text-primary-dark hover:bg-accent-hover font-semibold shadow-glow-accent active:scale-95',
    outline:
      'bg-transparent border-2 border-primary-dark dark:border-white/60 text-primary-dark dark:text-white hover:bg-primary-dark hover:text-white active:scale-95',
  };

  const combinedClasses = `inline-flex items-center justify-center rounded-pill transition-all duration-200 focus-visible:outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && (
        <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
      )}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`group ${combinedClasses}`} aria-label={ariaLabel} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={`group ${combinedClasses}`}
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={`group ${combinedClasses}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      {content}
    </button>
  );
}
