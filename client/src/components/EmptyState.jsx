import React from 'react';
import PropTypes from 'prop-types';
import { PackageOpen } from 'lucide-react';

/**
 * Generic EmptyState component
 */
export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No records found',
  description = 'There is currently no data or activity to display.',
  action = null,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
        {React.isValidElement(Icon) ? Icon : <Icon className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.element]),
  title: PropTypes.node.isRequired,
  description: PropTypes.node,
  action: PropTypes.node,
  className: PropTypes.string,
};
