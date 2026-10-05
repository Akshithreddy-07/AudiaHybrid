import React from 'react';
import PropTypes from 'prop-types';
import {
  Radio,
  Sun,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Tag,
} from 'lucide-react';

/**
 * ScenarioCard Component - Detailed card showcasing real-world assistive listening deployment
 */
export default function ScenarioCard({ scenario }) {
  if (!scenario) return null;

  const isRF = scenario.recommendedLink === 'RF';
  const isOptical = scenario.recommendedLink === 'Optical';
  const isHybrid = scenario.recommendedLink === 'Hybrid';

  const badgeTheme = isRF
    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    : isOptical
    ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
    : 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';

  const renderIllustration = () => {
    if (isRF) {
      return (
        <svg viewBox="0 0 400 180" className="w-full h-auto max-h-48 text-slate-800 dark:text-slate-200" fill="none">
          {/* Background Grid */}
          <rect width="400" height="180" rx="12" fill="currentColor" fillOpacity="0.03" />
          
          {/* Obstacle Wall in middle */}
          <rect x="185" y="40" width="16" height="100" rx="4" fill="#94A3B8" fillOpacity="0.4" />
          <text x="193" y="155" fontSize="9" textAnchor="middle" fill="#64748B" fontFamily="monospace">Obstacle / Wall</text>
          
          {/* Transmitter Station */}
          <rect x="35" y="60" width="60" height="60" rx="8" fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="1.5" />
          <text x="65" y="85" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#3B82F6" fontFamily="sans-serif">RF Tx</text>
          <text x="65" y="100" fontSize="8" textAnchor="middle" fill="#64748B" fontFamily="monospace">Lecturer</text>
          
          {/* RF Propagation Waves penetrating wall */}
          <path d="M 105 75 A 25 25 0 0 1 105 105" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
          <path d="M 120 65 A 40 40 0 0 1 120 115" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
          <path d="M 145 55 A 60 60 0 0 1 145 125" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
          
          {/* Wave penetrating obstacle */}
          <path d="M 220 55 A 60 60 0 0 1 220 125" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
          <path d="M 255 65 A 40 40 0 0 1 255 115" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
          <path d="M 285 75 A 25 25 0 0 1 285 105" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />

          {/* Receiver Station */}
          <rect x="305" y="60" width="60" height="60" rx="8" fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeWidth="1.5" />
          <text x="335" y="85" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#3B82F6" fontFamily="sans-serif">RF Rx</text>
          <text x="335" y="100" fontSize="8" textAnchor="middle" fill="#64748B" fontFamily="monospace">Student</text>
        </svg>
      );
    }

    if (isOptical) {
      return (
        <svg viewBox="0 0 400 180" className="w-full h-auto max-h-48 text-slate-800 dark:text-slate-200" fill="none">
          <rect width="400" height="180" rx="12" fill="currentColor" fillOpacity="0.03" />
          
          {/* MRI Machine Icon / Area */}
          <rect x="175" y="45" width="50" height="90" rx="6" fill="#F59E0B" fillOpacity="0.08" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
          <text x="200" y="90" fontSize="9" textAnchor="middle" fill="#F59E0B" fontFamily="sans-serif" fontWeight="bold">MRI Area</text>
          <text x="200" y="105" fontSize="8" textAnchor="middle" fill="#94A3B8" fontFamily="monospace">0% EMI Allowed</text>

          {/* Transmitter Station */}
          <rect x="35" y="60" width="60" height="60" rx="8" fill="#F59E0B" fillOpacity="0.15" stroke="#F59E0B" strokeWidth="1.5" />
          <text x="65" y="85" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#D97706" fontFamily="sans-serif">LED Tx</text>
          <text x="65" y="100" fontSize="8" textAnchor="middle" fill="#64748B" fontFamily="monospace">Doctor</text>

          {/* Collimated Direct Optical Light Beam */}
          <polygon points="95,85 305,70 305,110 95,95" fill="url(#opticalGradient)" />
          <line x1="95" y1="90" x2="305" y2="90" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 4" />

          {/* Receiver Station */}
          <rect x="305" y="60" width="60" height="60" rx="8" fill="#F59E0B" fillOpacity="0.15" stroke="#F59E0B" strokeWidth="1.5" />
          <text x="335" y="85" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#D97706" fontFamily="sans-serif">Photo Rx</text>
          <text x="335" y="100" fontSize="8" textAnchor="middle" fill="#64748B" fontFamily="monospace">Patient</text>

          <defs>
            <linearGradient id="opticalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      );
    }

    // Hybrid Illustration
    return (
      <svg viewBox="0 0 400 180" className="w-full h-auto max-h-48 text-slate-800 dark:text-slate-200" fill="none">
        <rect width="400" height="180" rx="12" fill="currentColor" fillOpacity="0.03" />

        {/* Dual Transmitter */}
        <rect x="35" y="60" width="65" height="60" rx="8" fill="#8B5CF6" fillOpacity="0.15" stroke="#8B5CF6" strokeWidth="1.5" />
        <text x="67" y="85" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#7C3AED" fontFamily="sans-serif">Dual Tx</text>
        <text x="67" y="100" fontSize="8" textAnchor="middle" fill="#64748B" fontFamily="monospace">Docent/Guide</text>

        {/* Top RF path (Halls) */}
        <path d="M 110 70 Q 200 35 290 70" stroke="#3B82F6" strokeWidth="2" strokeDasharray="3 3" fill="none" />
        <text x="200" y="45" fontSize="8" textAnchor="middle" fill="#3B82F6" fontFamily="monospace">RF (Spacious Halls)</text>

        {/* Bottom Optical path (Spotlight Showcase) */}
        <path d="M 110 110 Q 200 145 290 110" stroke="#F59E0B" strokeWidth="2" fill="none" />
        <text x="200" y="145" fontSize="8" textAnchor="middle" fill="#D97706" fontFamily="monospace">Optical (Display Case)</text>

        {/* Dual Receiver */}
        <rect x="300" y="60" width="65" height="60" rx="8" fill="#8B5CF6" fillOpacity="0.15" stroke="#8B5CF6" strokeWidth="1.5" />
        <text x="332" y="85" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#7C3AED" fontFamily="sans-serif">Hybrid Rx</text>
        <text x="332" y="100" fontSize="8" textAnchor="middle" fill="#64748B" fontFamily="monospace">Visitor</text>
      </svg>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${badgeTheme}`}>
              {isRF && <Radio className="w-3.5 h-3.5" />}
              {isOptical && <Sun className="w-3.5 h-3.5" />}
              {isHybrid && <Sparkles className="w-3.5 h-3.5" />}
              <span>RECOMMENDED LINK: {scenario.recommendedLink.toUpperCase()}</span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {scenario.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>Range: {scenario.idealRange}</span>
        </div>
      </div>

      {/* SVG Transmission Diagram */}
      <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
          Transmission Topology & Signal Vector:
        </div>
        {renderIllustration()}
      </div>

      {/* Summary */}
      <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {scenario.summary}
      </div>

      {/* Two-column analysis: Why this link vs Cautions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Why this link */}
        <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
          <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Engineering Justification</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {scenario.why.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cautions */}
        <div className="p-4 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
          <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Environmental Cautions & Constraints</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {scenario.cautions.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tags */}
      <div className="pt-2 flex flex-wrap items-center gap-1.5">
        <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
        {scenario.environmentTags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}

ScenarioCard.propTypes = {
  scenario: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    recommendedLink: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    why: PropTypes.arrayOf(PropTypes.string).isRequired,
    cautions: PropTypes.arrayOf(PropTypes.string).isRequired,
    idealRange: PropTypes.string.isRequired,
    environmentTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
};
