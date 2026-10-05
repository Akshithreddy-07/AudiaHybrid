import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable PillButton component
 * Variants: primary (solid black), outline (hairline border), ghost, lime
 */
export default function PillButton({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  limeDot = false,
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  ariaLabel,
  ...props
}) {
  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs font-semibold gap-1.5',
    md: 'px-5 py-2.5 text-xs md:text-sm font-semibold gap-2',
    lg: 'px-6 py-3 text-sm md:text-base font-semibold gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-ink text-white hover:bg-neutral-800 dark:bg-white dark:text-ink dark:hover:bg-neutral-200 border border-transparent shadow-subtle active:scale-[0.98]',
    outline:
      'bg-white dark:bg-card-dark text-ink dark:text-ink-dark border border-hairline-light dark:border-hairline-dark hover:border-ink dark:hover:border-white active:scale-[0.98]',
    ghost:
      'bg-transparent text-ink dark:text-ink-dark hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.98]',
    lime:
      'bg-accent-lime text-ink hover:bg-[#b8e85c] font-bold border border-transparent shadow-subtle active:scale-[0.98]',
  };

  const combinedClasses = `inline-flex items-center justify-center rounded-pill transition-all duration-200 focus-visible:outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer tracking-tight ${sizeStyles[size]} ${variantStyles[variant] || variantStyles.primary} ${className}`;

  const content = (
    <>
      {limeDot && <span className="w-1.5 h-1.5 rounded-none bg-accent-lime shrink-0 mr-0.5" aria-hidden="true" />}
      {Icon && iconPosition === 'left' && (
        <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105" />
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
