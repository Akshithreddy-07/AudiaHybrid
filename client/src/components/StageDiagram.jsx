import React from 'react';
import PropTypes from 'prop-types';
import { ArrowDown, Radio, Eye } from 'lucide-react';
import StageNode from './StageNode';

/**
 * StageDiagram Component - Flow diagram for the 11-stage hardware pipeline
 */
export default function StageDiagram({
  stages = [],
  selectedId,
  onSelectStage,
}) {
  const txStages = stages.filter((s) => s.group === 'transmitter' || s.order <= 7);
  const rxStages = stages.filter((s) => s.group === 'receiver' || s.order > 7);

  // Keyboard navigation across nodes
  const handleKeyDown = (e, currentIndex) => {
    let nextIndex = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % stages.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + stages.length) % stages.length;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectStage(stages[currentIndex].id);
      return;
    }

    if (nextIndex !== null) {
      const nextStage = stages[nextIndex];
      onSelectStage(nextStage.id);
      const nextElem = document.getElementById(`node-${nextStage.id}`);
      if (nextElem) nextElem.focus();
    }
  };

  return (
    <div className="space-y-8">
      {/* Transmitter Chain Section */}
      <div className="p-4 sm:p-6 rounded-2xl bg-blue-50/30 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <Radio className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Transmitter Section (Stages 1 – 7)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded bg-blue-100/60 dark:bg-blue-900/40">
            Acoustic → Analog Modulation
          </span>
        </div>

        {/* Tx Grid / Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {txStages.map((stage) => {
            const overallIndex = stages.findIndex((s) => s.id === stage.id);
            const isSelected = stage.id === selectedId;
            return (
              <StageNode
                key={stage.id}
                stage={stage}
                isSelected={isSelected}
                onClick={() => onSelectStage(stage.id)}
                onKeyDown={(e) => handleKeyDown(e, overallIndex)}
              />
            );
          })}
        </div>
      </div>

      {/* Over-the-Air Transmission Link Graphic Indicator */}
      <div className="flex flex-col items-center justify-center py-2 text-center">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-mono font-semibold shadow-sm">
          <span>Wireless Propagation Medium (RF Waves & IR Light Beams)</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </div>
      </div>

      {/* Receiver Chain Section */}
      <div className="p-4 sm:p-6 rounded-2xl bg-amber-50/30 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-600 flex items-center justify-center text-white">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Receiver Section (Stages 8 – 11)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-100/60 dark:bg-amber-900/40">
            Demodulation → Power Amp → Audio Output
          </span>
        </div>

        {/* Rx Grid / Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {rxStages.map((stage) => {
            const overallIndex = stages.findIndex((s) => s.id === stage.id);
            const isSelected = stage.id === selectedId;
            return (
              <StageNode
                key={stage.id}
                stage={stage}
                isSelected={isSelected}
                onClick={() => onSelectStage(stage.id)}
                onKeyDown={(e) => handleKeyDown(e, overallIndex)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

StageDiagram.propTypes = {
  stages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      group: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedId: PropTypes.string,
  onSelectStage: PropTypes.func.isRequired,
};
