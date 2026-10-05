import React, { useState, useEffect } from 'react';
import componentsData from '../data/components.json';
import SectionHeader from '../components/SectionHeader';
import StageDiagram from '../components/StageDiagram';
import StagePanel from '../components/StagePanel';
import Card from '../components/Card';
import usePageTitle from '../hooks/usePageTitle';
import { Cpu, HelpCircle } from 'lucide-react';

export default function Architecture() {
  usePageTitle('Hardware Architecture & 11-Stage Pipeline');

  // Helper to extract stage ID from URL hash or default to first stage
  const getInitialStageId = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const match = componentsData.find(
        (s) => s.id === hash || s.id === `stage-${hash}` || String(s.order) === hash
      );
      if (match) return match.id;
    }
    return componentsData[0]?.id || 'stage-mic';
  };

  const [selectedStageId, setSelectedStageId] = useState(getInitialStageId);
  const [selectedVariant, setSelectedVariant] = useState('rf');
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  // Sync with URL Hash changes (e.g. back/forward button or deep links)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const match = componentsData.find(
          (s) => s.id === hash || s.id === `stage-${hash}` || String(s.order) === hash
        );
        if (match) {
          setSelectedStageId(match.id);
          setMobilePanelOpen(true);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const selectedStage = componentsData.find((s) => s.id === selectedStageId) || componentsData[0];

  const handleSelectStage = (id) => {
    setSelectedStageId(id);
    setMobilePanelOpen(true);
    // Update URL hash cleanly without causing a full page jump
    window.history.replaceState(null, '', `#${id}`);
  };

  const handleClosePanel = () => {
    setMobilePanelOpen(false);
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <SectionHeader
        eyebrow="ANALOG SIGNAL PROCESSING PIPELINE"
        title="Hardware System Architecture"
        subtitle="Interactive schematic breakdown of the 11-stage dual-link transmitter and receiver circuitry, from acoustic capture to headphone demodulation."
        align="center"
      />

      {/* Main Two-Column Layout on Desktop: Diagram (Left 7 cols) + Panel (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Diagram Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Click or use Arrow Keys to inspect any circuit stage</span>
            </div>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200">
              11 Stages Total
            </span>
          </div>

          <StageDiagram
            stages={componentsData}
            selectedId={selectedStageId}
            onSelectStage={handleSelectStage}
          />

          {/* Quick Architecture Summary Card */}
          <Card className="p-5 text-xs text-slate-600 dark:text-slate-400 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-xs">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <span>Key Circuit Engineering Principles</span>
            </h4>
            <p className="leading-relaxed">
              The AudiaHybrid architecture employs zero microcontroller DSP overhead in the primary audio path. Pure analog pre-amplification (LM741), speech bandpass filtering (300 Hz–3.4 kHz), and collector AM modulation (BC547) guarantee zero processing latency (&lt; 1 ms), making it ideal for real-time classroom and medical assistive listening.
            </p>
          </Card>
        </div>

        {/* Right Stage Inspector Panel on Desktop (Sticky) */}
        <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-20">
          <StagePanel
            stage={selectedStage}
            onClose={() => {}}
            selectedVariant={selectedVariant}
            onVariantChange={setSelectedVariant}
          />
        </div>
      </div>

      {/* Mobile Modal / Bottom Sheet Panel when opened on smaller screens */}
      {mobilePanelOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full sm:max-w-xl max-h-[85vh] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl">
            <StagePanel
              stage={selectedStage}
              onClose={handleClosePanel}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
            />
          </div>
        </div>
      )}
    </div>
  );
}
