import React from 'react';
import { ChevronLeft, ChevronRight, GraduationCap, Stethoscope, Landmark } from 'lucide-react';
import RoundIconButton from './RoundIconButton';

export const scenarios = [
  {
    id: 'Classroom',
    name: 'Classroom',
    badge: 'Hybrid Optimal',
    icon: GraduationCap,
    desc: 'Hybrid dual-carrier: RF penetrates multi-row desks while optical delivers crystal-clear front-row audio.',
    svgType: 'classroom',
  },
  {
    id: 'Hospital',
    name: 'Hospital',
    badge: 'Optical Preferred',
    icon: Stethoscope,
    desc: 'Pure optical link: Zero electromagnetic emissions ensures safety around sensitive MRI/ICU equipment.',
    svgType: 'hospital',
  },
  {
    id: 'Museum',
    name: 'Museum',
    badge: 'Zone Selective',
    icon: Landmark,
    desc: 'Localized optical exhibit beacons prevent audio bleed between exhibits; RF handles wide tour narration.',
    svgType: 'museum',
  },
];

export default function ScenarioCarousel({
  activeIndex,
  onChange,
  className = '',
}) {
  const currentScenario = scenarios[activeIndex] || scenarios[0];

  const handlePrev = () => {
    onChange((activeIndex - 1 + scenarios.length) % scenarios.length);
  };

  const handleNext = () => {
    onChange((activeIndex + 1) % scenarios.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label="Application Scenarios"
      className={`rounded-card bg-white dark:bg-card-dark border border-hairline-light dark:border-hairline-dark shadow-floating p-4 md:p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink select-none ${className}`}
    >
      {/* Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        Active scenario {activeIndex + 1} of {scenarios.length}: {currentScenario.name}. {currentScenario.desc}
      </div>

      {/* Header: Counter & Arrows */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-headline text-ink dark:text-ink-dark">
            0{activeIndex + 1}
          </span>
          <span className="text-xs font-semibold text-ink-secondary dark:text-ink-secondaryDark">
            / 0{scenarios.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <RoundIconButton
            icon={ChevronLeft}
            onClick={handlePrev}
            size="sm"
            variant="white"
            ariaLabel="Previous Scenario"
            title="Previous Scenario"
          />
          <RoundIconButton
            icon={ChevronRight}
            onClick={handleNext}
            size="sm"
            variant="black"
            ariaLabel="Next Scenario"
            title="Next Scenario"
          />
        </div>
      </div>

      {/* 3 Thumbnail Tiles */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {scenarios.map((sc, idx) => {
          const isSelected = activeIndex === idx;
          const Icon = sc.icon;
          return (
            <button
              key={sc.id}
              type="button"
              onClick={() => onChange(idx)}
              aria-selected={isSelected}
              role="tab"
              className={`flex flex-col items-center justify-between p-2.5 rounded-2xl transition-all duration-200 cursor-pointer h-24 sm:h-28 text-center relative overflow-hidden ${
                isSelected
                  ? 'bg-ink text-white dark:bg-white dark:text-ink ring-2 ring-ink/20 dark:ring-white/20'
                  : 'bg-surface-subtle dark:bg-surface-subtleDark hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-ink dark:text-ink-dark border border-hairline-light dark:border-hairline-dark'
              }`}
            >
              {/* Mini Tile Artwork / Icon */}
              <div className="my-auto">
                <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${isSelected ? 'text-accent-lime dark:text-ink' : 'text-ink-secondary dark:text-ink-secondaryDark'}`} />
              </div>

              {/* Bottom Label Pill */}
              <span className={`px-2 py-0.5 rounded-pill text-[10px] sm:text-xs font-bold tracking-tight truncate w-full ${
                isSelected
                  ? 'bg-white text-ink dark:bg-card-dark dark:text-white'
                  : 'bg-white/80 dark:bg-card-dark/80 text-ink dark:text-ink-dark'
              }`}>
                {sc.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
