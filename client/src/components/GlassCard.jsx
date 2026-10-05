import React from 'react';

/**
 * Reusable GlassCard component
 * Implements frosted glass aesthetics with accessible high-contrast and dark-mode states.
 */
export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  rounded = 'rounded-card',
  hover = false,
  as: Component = 'div',
  ...props
}) {
  const variantStyles = {
    default: 'glass-panel text-text-primary dark:text-text-darkPrimary',
    accent: 'glass-panel border-accent/40 bg-white/70 dark:bg-purple-950/40 text-text-primary dark:text-text-darkPrimary',
    dark: 'bg-primary-dark/90 text-white border border-white/20 shadow-glass-dark',
    subtle: 'bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 text-text-primary dark:text-text-darkPrimary',
  };

  const hoverStyles = hover
    ? 'transition-all duration-300 hover:shadow-glass-hover hover:-translate-y-1'
    : 'transition-all duration-200';

  return (
    <Component
      className={`${rounded} ${variantStyles[variant] || variantStyles.default} ${hoverStyles} p-5 md:p-6 relative overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
