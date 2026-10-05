import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable PillSelect component
 * Glass styled select input for compact configuration controls.
 */
export default function PillSelect({
  label,
  value,
  onChange,
  options = [],
  id,
  className = '',
  icon: Icon,
}) {
  const selectId = id || `pill-select-${label?.toLowerCase().replace(/\s+/g, '-') || Math.random()}`;

  return (
    <div className={`relative inline-flex items-center group ${className}`}>
      {label && <label htmlFor={selectId} className="sr-only">{label}</label>}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-white/40 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20 border border-white/60 dark:border-white/20 transition-all duration-200">
        {Icon && <Icon className="w-3.5 h-3.5 text-accent shrink-0" aria-hidden="true" />}
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-transparent text-xs md:text-sm font-medium text-text-primary dark:text-text-darkPrimary pr-5 cursor-pointer focus:outline-none"
        >
          {options.map((opt) => (
            <option
              key={typeof opt === 'string' ? opt : opt.value}
              value={typeof opt === 'string' ? opt : opt.value}
              className="bg-white dark:bg-slate-900 text-text-primary dark:text-text-darkPrimary"
            >
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-text-secondary dark:text-text-darkSecondary pointer-events-none absolute right-2.5" aria-hidden="true" />
      </div>
    </div>
  );
}
