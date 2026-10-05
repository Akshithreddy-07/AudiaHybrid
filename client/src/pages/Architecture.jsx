import React from 'react';
import { Cpu, Layers } from 'lucide-react';
import Card from '../components/Card';
import PillButton from '../components/PillButton';

export default function Architecture() {
  return (
    <div className="w-full flex flex-col px-4 sm:px-6 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-hairline-light dark:border-hairline-dark pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 bg-accent-lime shrink-0" />
          <span className="text-xs font-bold uppercase tracking-label text-ink dark:text-ink-dark">
            Hardware & Circuit Architecture
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-headline text-ink dark:text-ink-dark">
          System Architecture
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark max-w-2xl leading-relaxed">
          Transmitter and receiver module breakdowns with an 11-stage analog signal chain.
        </p>
      </div>

      {/* Module Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="default" rounded="rounded-card" hover className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-badge-rf text-white flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-label text-badge-rf">Module A</span>
              <h2 className="text-xl font-bold tracking-headline text-ink dark:text-ink-dark">
                Transmitter Unit (Tx)
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark leading-relaxed">
            Converts acoustic microphone input into concurrent RF electromagnetic waves and optical intensity-modulated light via analog filtering, buffer stages, and AM modulation.
          </p>
          <div className="p-3 rounded-2xl bg-surface-subtle dark:bg-surface-subtleDark text-xs text-ink dark:text-ink-dark font-medium border border-hairline-light dark:border-hairline-dark">
            Mic → LM741 Pre-amp → RC Filter → Buffer → Tone → AM Modulator → RF / LED Output
          </div>
        </Card>

        <Card variant="default" rounded="rounded-card" hover className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-badge-optical text-white flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-label text-badge-optical">Module B</span>
              <h2 className="text-xl font-bold tracking-headline text-ink dark:text-ink-dark">
                Receiver Unit (Rx)
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark leading-relaxed">
            Dual front-end capturing RF carrier waves via tuned LC coil and optical photons via BPW34 photodiode, demodulating through envelope detection into LM386 audio amplifier.
          </p>
          <div className="p-3 rounded-2xl bg-surface-subtle dark:bg-surface-subtleDark text-xs text-ink dark:text-ink-dark font-medium border border-hairline-light dark:border-hairline-dark">
            RF Rx / BPW34 Photodiode → Envelope Demodulator → LM386 Audio Power Amp → Speaker
          </div>
        </Card>
      </div>

      {/* Interactive Diagram Roadmap Card */}
      <Card variant="default" rounded="rounded-card" className="p-8 text-center space-y-4">
        <div className="w-10 h-10 rounded-2xl bg-ink text-white dark:bg-white dark:text-ink mx-auto flex items-center justify-center">
          <Cpu className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold tracking-headline text-ink dark:text-ink-dark">
          Interactive Signal-Chain Explorer Connecting in Phase 2
        </h3>
        <p className="text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark max-w-xl mx-auto leading-relaxed">
          In Phase 2, this section will render the complete clickable 11-stage hardware signal diagram with circuit schematics, pinouts, and test point waveforms from components.json.
        </p>
        <div className="pt-2">
          <PillButton to="/comparison" variant="outline" size="sm">
            View RF vs Optical Comparison
          </PillButton>
        </div>
      </Card>
    </div>
  );
}
