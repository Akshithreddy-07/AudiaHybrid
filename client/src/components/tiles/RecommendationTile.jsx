import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Layers, Info } from 'lucide-react';
import { evaluateLinkRecommendation, INITIAL_HYSTERESIS_STATE } from '../../lib/recommendation.js';

export function RecommendationTile({
  opticalCount = 0,
  rfCount = 0,
  isStale = false,
  threshold = 20,
}) {
  const hysteresisStateRef = useRef(INITIAL_HYSTERESIS_STATE);

  const result = evaluateLinkRecommendation(
    opticalCount ?? 0,
    rfCount ?? 0,
    isStale ?? false,
    hysteresisStateRef.current,
    threshold ?? 20
  );

  hysteresisStateRef.current = result.nextState;

  const linkBadgeColor =
    result.recommendedLink === 'optical'
      ? 'bg-[#EF9F27]/15 border-[#EF9F27]/40 text-[#EF9F27]'
      : result.recommendedLink === 'rf'
      ? 'bg-[#378ADD]/15 border-[#378ADD]/40 text-[#378ADD]'
      : result.recommendedLink === 'both'
      ? 'bg-[#5DCAA5]/15 border-[#5DCAA5]/40 text-[#5DCAA5]'
      : 'bg-[#E5484D]/15 border-[#E5484D]/40 text-[#E5484D]';

  return (
    <article className="bg-[#151A1D] border border-[#262D31] rounded p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-[#262D31] pb-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#5DCAA5]" />
          <span className="text-xs font-mono font-bold uppercase text-[#E6E3DA]">
            Link Recommendation (Hysteresis Arbitrated)
          </span>
        </div>
        <div className={`px-2 py-0.5 rounded border text-[11px] font-mono font-bold uppercase ${linkBadgeColor}`}>
          RECOMMEND: {(result.recommendedLink || 'NONE').toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Recommendation Statement */}
        <div className="md:col-span-8 space-y-1">
          <p className="text-xs font-mono text-[#E6E3DA] leading-relaxed">
            {result.plainReason || 'Awaiting signal telemetry frames...'}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8A919A]">
            <Info className="w-3.5 h-3.5 text-[#8A919A] shrink-0" />
            <span>{result.adviceNote}</span>
          </div>
        </div>

        {/* Optical vs RF Balance Bar */}
        <div className="md:col-span-4 space-y-1.5 text-[10px] font-mono">
          <div className="flex justify-between">
            <span className="text-[#EF9F27]">Optical: {result.opticalPercentage ?? 0}%</span>
            <span className="text-[#378ADD]">RF: {result.rfPercentage ?? 0}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#0F1214] rounded overflow-hidden flex">
            <div
              className="bg-[#EF9F27] h-full transition-all duration-300"
              style={{ width: `${result.opticalPercentage ?? 0}%` }}
            />
            <div
              className="bg-[#378ADD] h-full transition-all duration-300"
              style={{ width: `${result.rfPercentage ?? 0}%` }}
            />
          </div>
          <div className="text-[#8A919A] text-right">
            Hysteresis Switch Window: 3s @ &gt;20% delta
          </div>
        </div>
      </div>
    </article>
  );
}

RecommendationTile.propTypes = {
  opticalCount: PropTypes.number,
  rfCount: PropTypes.number,
  isStale: PropTypes.bool,
  threshold: PropTypes.number,
};
