import React from 'react';

/**
 * Editorial Card Component
 * Solid white/dark card with 20px radius and 1px hairline border.
 */
export default function Card({
  children,
  className = '',
  variant = 'default',
  rounded = 'rounded-card',
  hover = false,
  as: Component = 'div',
  ...props
}) {
  const variantStyles = {
    default: 'bg-card-light dark:bg-card-dark border border-hairline-light dark:border-hairline-dark text-ink-light dark:text-ink-dark shadow-card',
    subtle: 'bg-surface-subtle dark:bg-surface-subtleDark border border-hairline-light dark:border-hairline-dark text-ink-light dark:text-ink-dark',
    dark: 'bg-ink text-white dark:bg-white dark:text-ink border border-ink',
    flat: 'bg-white dark:bg-card-dark border-0',
  };

  const hoverStyles = hover
    ? 'transition-all duration-200 hover:border-ink dark:hover:border-white hover:shadow-subtle'
    : 'transition-all duration-200';

  return (
    <Component
      className={`${rounded} ${variantStyles[variant] || variantStyles.default} ${hoverStyles} p-5 md:p-6 relative ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
