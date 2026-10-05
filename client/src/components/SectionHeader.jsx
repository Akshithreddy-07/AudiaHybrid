import React from 'react';
import PropTypes from 'prop-types';

/**
 * SectionHeader Component
 */
export default function SectionHeader({
  badge,
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}) {
  const displayBadge = eyebrow || badge;

  const alignStyles = {
    center: 'text-center items-center',
    left: 'text-left items-start',
    right: 'text-right items-end',
  };

  return (
    <div className={`flex flex-col mb-8 sm:mb-10 ${alignStyles[align] || alignStyles.center} ${className}`}>
      {displayBadge && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-3 select-none">
          {displayBadge}
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

SectionHeader.propTypes = {
  badge: PropTypes.node,
  eyebrow: PropTypes.node,
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  className: PropTypes.string,
};
