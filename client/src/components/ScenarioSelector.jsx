import React from 'react';
import PropTypes from 'prop-types';
import { School, Building2, Landmark, Radio, Sun, Sparkles } from 'lucide-react';

/**
 * ScenarioSelector Component
 */
export default function ScenarioSelector({
  scenarios = [],
  selectedId,
  onSelect,
}) {
  const getIcon = (id) => {
    switch (id) {
      case 'classroom':
        return <School className="w-4 h-4" />;
      case 'hospital':
        return <Building2 className="w-4 h-4" />;
      case 'museum':
        return <Landmark className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getLinkBadge = (link) => {
    switch (link) {
      case 'RF':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
            <Radio className="w-2.5 h-2.5" />
            RF
          </span>
        );
      case 'Optical':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
            <Sun className="w-2.5 h-2.5" />
            Optical
          </span>
        );
      case 'Hybrid':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
            <Sparkles className="w-2.5 h-2.5" />
            Hybrid
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-wrap gap-2.5 justify-center">
      {scenarios.map((scenario) => {
        const isSelected = scenario.id === selectedId;
        return (
          <button
            key={scenario.id}
            type="button"
            onClick={() => onSelect(scenario.id)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
              isSelected
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
            }`}
          >
            {getIcon(scenario.id)}
            <span>{scenario.title}</span>
            {getLinkBadge(scenario.recommendedLink)}
          </button>
        );
      })}
    </div>
  );
}

ScenarioSelector.propTypes = {
  scenarios: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      recommendedLink: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
