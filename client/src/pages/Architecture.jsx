import React from 'react';
import { Cpu, ArrowRight, Layers, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import SectionHeader from '../components/SectionHeader';
import PillButton from '../components/PillButton';

export default function Architecture() {
  return (
    <div className="w-full flex flex-col px-4 sm:px-6 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="relative rounded-3xl hero-sky-bg p-6 sm:p-10 mb-8 overflow-hidden shadow-glass border border-white/70 dark:border-white/20">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-pill bg-white/60 dark:bg-black/40 border border-white/60 text-xs font-bold uppercase tracking-wider text-primary-dark dark:text-accent mb-3">
            <Cpu className="w-3.5 h-3.5" /> Hardware & Circuit Pipeline
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-primary-dark dark:text-white tracking-tight">
            System <span className="font-semibold text-accent">Architecture</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-text-primary dark:text-text-darkPrimary max-w-2xl leading-relaxed">
            Transmitter and receiver module breakdowns with an interactive 11-stage analog
            signal-chain diagram.
          </p>
        </div>
      </div>

      {/* Module Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <GlassCard variant="default" rounded="rounded-card" hover className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-primary-dark dark:text-indigo-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">Module A</span>
              <h2 className="text-xl font-bold text-text-primary dark:text-text-darkPrimary">
                Transmitter Unit (Tx)
              </h2>
            </div>
          </div>
          <p className="text-sm text-text-secondary dark:text-text-darkSecondary leading-relaxed">
            Converts acoustic speech into simultaneous RF electromagnetic waves and optical intensity-modulated light via analog filtering, buffer stages, and AM modulation.
          </p>
          <div className="p-3 rounded-2xl bg-white/40 dark:bg-white/5 text-xs text-text-primary dark:text-text-darkPrimary font-medium border border-white/40">
            Mic $\rightarrow$ LM741 Pre-amp $\rightarrow$ RC Filter $\rightarrow$ Buffer $\rightarrow$ Tone $\rightarrow$ AM Modulator $\rightarrow$ RF / LED Output
          </div>
        </GlassCard>

        <GlassCard variant="default" rounded="rounded-card" hover className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Module B</span>
              <h2 className="text-xl font-bold text-text-primary dark:text-text-darkPrimary">
                Receiver Unit (Rx)
              </h2>
            </div>
          </div>
          <p className="text-sm text-text-secondary dark:text-text-darkSecondary leading-relaxed">
            Dual front-end capturing RF carrier waves via tuned LC tank coil and optical photons via BPW34 photodiode, demodulating through envelope detection into LM386 audio amplifier.
          </p>
          <div className="p-3 rounded-2xl bg-white/40 dark:bg-white/5 text-xs text-text-primary dark:text-text-darkPrimary font-medium border border-white/40">
            RF Rx / BPW34 Photodiode $\rightarrow$ Envelope Demodulator $\rightarrow$ LM386 Audio Power Amp $\rightarrow$ Speaker
          </div>
        </GlassCard>
      </div>

      {/* Interactive Diagram Placeholder for Phase 2 */}
      <GlassCard variant="default" rounded="rounded-card" className="p-8 text-center space-y-4">
        <Sparkles className="w-8 h-8 text-accent mx-auto animate-pulse" />
        <h3 className="text-xl font-bold text-text-primary dark:text-text-darkPrimary">
          Interactive Signal-Chain Explorer Coming in Phase 2
        </h3>
        <p className="text-sm text-text-secondary dark:text-text-darkSecondary max-w-xl mx-auto">
          In Phase 2, this section will render the full clickable 11-stage hardware signal diagram with complete circuit schematics, pinouts, and test point waveforms from components.json.
        </p>
        <div className="pt-2">
          <PillButton to="/comparison" variant="ghost" size="sm">
            View RF vs Optical Comparison
          </PillButton>
        </div>
      </GlassCard>
    </div>
  );
}
