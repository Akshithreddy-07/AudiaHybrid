import React, { useState, useMemo } from 'react';
import {
  Mic,
  Radio,
  Sun,
  Clock,
  ArrowRight,
  Mouse,
  ChevronRight,
} from 'lucide-react';
import Card from '../components/Card';
import PillButton from '../components/PillButton';
import PillNav from '../components/PillNav';
import RoundIconButton from '../components/RoundIconButton';
import AccessibilityPopover from '../components/AccessibilityPopover';
import HeroIllustration from '../components/HeroIllustration';
import ScenarioCarousel, { scenarios } from '../components/ScenarioCarousel';
import FloatingChip from '../components/FloatingChip';
import TagPill from '../components/TagPill';
import SectionHeader from '../components/SectionHeader';

// 11-Stage Analog Signal Chain Breakdown
const txStages = [
  { id: 'mic', name: 'Electret Mic', role: 'Acoustic Capture', stage: '01' },
  { id: 'preamp', name: 'LM741 Pre-Amp', role: 'Low-Noise Gain', stage: '02' },
  { id: 'filter', name: 'RC Filter', role: 'Bandpass (300Hz-3.4kHz)', stage: '03' },
  { id: 'buffer', name: 'Buffer Stage', role: 'Impedance Match', stage: '04' },
  { id: 'tone', name: 'Tone Control', role: 'Bass / Treble EQ', stage: '05' },
  { id: 'mod', name: 'AM Modulator', role: 'Carrier Multiplication', stage: '06' },
  { id: 'tx', name: 'RF & LED Tx', role: 'Dual Carrier Emitters', stage: '07' },
];

const rxStages = [
  { id: 'rx', name: 'RF Rx & BPW34', role: 'Dual Detectors', stage: '08' },
  { id: 'demod', name: 'Envelope Demod', role: 'Diode + RC Filter', stage: '09' },
  { id: 'amp', name: 'LM386 Audio Amp', role: 'Power Output', stage: '10' },
  { id: 'speaker', name: 'Speaker / Output', role: 'Acoustic Delivery', stage: '11' },
];

const tagsList = ['RF', 'Optical', 'Analog', 'AM', 'Hybrid', 'Secure', 'Low latency'];

export default function Home() {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [activeTag, setActiveTag] = useState('Hybrid');

  const currentScenario = scenarios[activeScenarioIndex];

  // Dynamic live recommendation based on active scenario and selected filter tag
  const recommendationText = useMemo(() => {
    if (currentScenario.id === 'Hospital') {
      return 'Hospital ICU Mode: Optical link active. Zero electromagnetic radiation ensures safety around MRI/EEG equipment with guaranteed room privacy.';
    }
    if (currentScenario.id === 'Museum') {
      return 'Museum Multi-Zone: Dedicated LED beacons deliver localized audio per exhibit with zero bleed; RF handles general hall announcements.';
    }
    return 'Smart Classroom: Hybrid dual-carrier active. Non-line-of-sight RF coverage penetrates student desks while optical provides noise-immune front-row clarity.';
  }, [currentScenario]);

  const handleScrollDown = () => {
    document.getElementById('below-hero')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col">
      {/* ========================================================================= */}
      {/* SECTION 1: SPLIT HERO SECTION (DESKTOP >= 1024PX SPLIT 40/60)             */}
      {/* ========================================================================= */}
      <section
        aria-label="Split Hero Overview"
        className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[90vh] bg-white dark:bg-surface-dark relative"
      >
        {/* =================================================================== */}
        {/* LEFT COLUMN (~40% on desktop)                                       */}
        {/* =================================================================== */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative z-20">
          
          {/* Top: Pill Nav Bar & Brand */}
          <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
            <PillNav />
          </div>

          {/* Center: Giant Editorial Headline */}
          <div className="my-auto py-4 sm:py-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[62px] xl:text-[70px] font-semibold text-ink dark:text-ink-dark tracking-headline leading-headline">
              Bridging <br />
              <span className="inline-flex items-center gap-2">
                <span>The Sound Gap</span>
                {/* 3 Overlapping Circular Avatar/Transducer Chips */}
                <span className="hidden sm:inline-flex items-center -space-x-2 pl-1 select-none" aria-hidden="true">
                  <span className="w-8 h-8 rounded-full bg-surface-subtle dark:bg-card-dark border-2 border-white dark:border-surface-dark flex items-center justify-center text-ink dark:text-ink-dark shadow-subtle">
                    <Mic className="w-3.5 h-3.5" />
                  </span>
                  <span className="w-8 h-8 rounded-full bg-badge-rf border-2 border-white dark:border-surface-dark flex items-center justify-center text-white shadow-subtle">
                    <Radio className="w-3.5 h-3.5" />
                  </span>
                  <span className="w-8 h-8 rounded-full bg-badge-optical border-2 border-white dark:border-surface-dark flex items-center justify-center text-white shadow-subtle">
                    <Sun className="w-3.5 h-3.5" />
                  </span>
                </span>
              </span>
              <br />
              With Hybrid <br />
              <span className="text-ink-secondary dark:text-ink-secondaryDark">RF & Optical</span>
            </h1>

            {/* Dashed Hairline with Interactive Scroll Pill */}
            <div className="my-8 relative flex items-center justify-center">
              <div className="w-full border-t border-dashed border-hairline-light dark:border-hairline-dark" />
              <button
                type="button"
                onClick={handleScrollDown}
                className="absolute px-3 py-1 rounded-pill bg-white dark:bg-card-dark border border-hairline-light dark:border-hairline-dark text-[11px] font-semibold text-ink-secondary dark:text-ink-secondaryDark flex items-center gap-1.5 shadow-subtle hover:border-ink transition-all cursor-pointer"
                aria-label="Scroll down to system overview"
              >
                <Mouse className="w-3 h-3 text-ink dark:text-ink-dark" />
                <span>Scroll</span>
              </button>
            </div>

            {/* Uppercase Paragraph with Tiny Lime Square Bullet */}
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 bg-accent-lime shrink-0 mt-1" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-label text-ink dark:text-ink-dark leading-relaxed max-w-md">
                DIRECT, CLEAR AUDIO TRANSMISSION POWERED BY PURE ANALOG SIGNAL PROCESSING FOR
                INDIVIDUALS WITH HEARING IMPAIRMENT.
              </p>
            </div>
          </div>

          {/* Bottom-Left: Decorative "+++" Marks */}
          <div className="hidden sm:flex items-center gap-1 text-ink-secondary/50 dark:text-ink-secondaryDark/50 text-xs font-mono select-none pt-4" aria-hidden="true">
            <span>+</span>
            <span>+</span>
            <span>+</span>
            <span className="text-[10px] uppercase font-sans tracking-label ml-2">Analog Assistive System</span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN (~60% on desktop) - HERO ILLUSTRATION PANEL           */}
        {/* =================================================================== */}
        <div className="lg:col-span-7 p-3 sm:p-4 lg:p-4 flex flex-col relative">
          <div className="relative w-full h-full min-h-[460px] lg:min-h-[580px] rounded-panel overflow-hidden border border-hairline-light dark:border-hairline-dark shadow-subtle flex flex-col justify-between p-4 sm:p-6">
            
            {/* Background Illustration */}
            <HeroIllustration className="absolute inset-0 z-0" />

            {/* TOP BAR OVER ILLUSTRATION */}
            <div className="relative z-10 flex items-start justify-between w-full">
              {/* Vertical Label at Top-Left */}
              <div className="flex flex-col items-center gap-2">
                <div className="px-3 py-1 rounded-pill bg-white text-ink font-bold text-[10px] tracking-wider uppercase shadow-subtle border border-hairline-light">
                  AUDIAHYBRID
                </div>
                <RoundIconButton
                  icon={ArrowRight}
                  to="/architecture"
                  size="sm"
                  variant="black"
                  ariaLabel="Explore circuit architecture"
                  title="View Architecture"
                />
              </div>

              {/* Top-Right Notch Controls (Accessibility & Contact) */}
              <div className="flex items-center gap-2 bg-white dark:bg-card-dark p-1.5 rounded-pill shadow-subtle border border-hairline-light dark:border-hairline-dark">
                <AccessibilityPopover size="sm" />
                <PillButton
                  to="/feedback"
                  variant="outline"
                  size="sm"
                  className="!px-3 !py-1 text-xs"
                >
                  Contact us
                </PillButton>
              </div>
            </div>

            {/* FLOATING TELEMETRY CHIPS */}
            <div className="relative z-10 flex flex-wrap gap-2.5 max-w-lg my-auto pt-6">
              <FloatingChip
                icon={Radio}
                label="RF level"
                value="78%"
                animation="float-slow"
              />
              <FloatingChip
                icon={Sun}
                label="Optical level"
                value="62%"
                animation="float-slow-alt"
              />
              <FloatingChip
                icon={Clock}
                label="Digital delay"
                value="0 ms"
                animation="float-slow"
                className="hidden sm:inline-flex"
              />
            </div>

            {/* BOTTOM SECTION OVER ILLUSTRATION */}
            <div className="relative z-10 space-y-3 pt-4">
              
              {/* Live Recommendation Scrim Box */}
              <div className="p-3 rounded-2xl bg-white/90 dark:bg-card-dark/90 border border-white/60 dark:border-hairline-dark text-xs text-ink dark:text-ink-dark shadow-subtle">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <span className="w-2 h-2 bg-accent-lime shrink-0" />
                  <span>Recommendation:</span>
                </div>
                <p className="text-xs text-ink-secondary dark:text-ink-secondaryDark leading-relaxed">
                  {recommendationText}
                </p>
              </div>

              {/* Bottom Row: Scenario Carousel (Left) & Tag Filter Pills (Right) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                {/* Scenario Carousel */}
                <div className="md:col-span-8 lg:col-span-8">
                  <ScenarioCarousel
                    activeIndex={activeScenarioIndex}
                    onChange={setActiveScenarioIndex}
                  />
                </div>

                {/* Filter Tag Pills (Bottom-Right) */}
                <div className="md:col-span-4 lg:col-span-4 flex flex-wrap gap-1.5 justify-start md:justify-end">
                  {tagsList.map((tag) => (
                    <TagPill
                      key={tag}
                      label={tag}
                      active={activeTag === tag}
                      onClick={() => setActiveTag(tag)}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: BELOW THE HERO (WHITE CARDS ON #F5F5F3)                        */}
      {/* ========================================================================= */}
      <div id="below-hero" className="w-full bg-surface-subtle dark:bg-surface-subtleDark py-12 px-4 sm:px-6 lg:px-10 space-y-12">
        
        {/* =================================================================== */}
        {/* PROBLEM VS SOLUTION (TWO EDITORIAL CARDS WITH LIME BULLETS)        */}
        {/* =================================================================== */}
        <section className="max-w-7xl mx-auto w-full">
          <SectionHeader
            badge="Engineering Rationale"
            title="Why Hybrid Analog Transmission?"
            subtitle="Comparing conventional single-channel assistive listening loops with the zero-latency AudiaHybrid architecture."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Problem */}
            <Card variant="default" rounded="rounded-card" hover className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 bg-accent-lime shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-label text-status-danger">
                  The Problem
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-headline text-ink dark:text-ink-dark">
                Digital Buffering Lag & Single-Link Vulnerability
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-ink dark:text-ink-dark">•</span>
                  <span><strong>DSP Lip-Sync Lag (20–50 ms):</strong> Digital audio conversion buffers sound, creating disorienting echo between speaker lips and heard speech.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-ink dark:text-ink-dark">•</span>
                  <span><strong>RF Electromagnetic Noise:</strong> Fluorescent ballasts, electric motors, and Wi-Fi introduce severe buzz into pure RF hearing loops.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-ink dark:text-ink-dark">•</span>
                  <span><strong>Optical Line-of-Sight Blockage:</strong> Pure infrared systems drop out completely when people walk across the line of sight.</span>
                </li>
              </ul>
            </Card>

            {/* The Solution */}
            <Card variant="default" rounded="rounded-card" hover className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 bg-accent-lime shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-label text-status-ok">
                  The AudiaHybrid Solution
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold tracking-headline text-ink dark:text-ink-dark">
                Instantaneous Pure Analog Dual Link
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-ink dark:text-ink-dark">•</span>
                  <span><strong>Zero Digital Buffering (0 ms Delay):</strong> Pure analog pre-amp and AM modulation deliver instant speech synchronization.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-ink dark:text-ink-dark">•</span>
                  <span><strong>Optical Noise Immunity:</strong> High-brightness LED transmission is 100% immune to electromagnetic interference.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-ink dark:text-ink-dark">•</span>
                  <span><strong>RF Redundant Coverage:</strong> When optical line of sight is obstructed, tuned RF carrier penetrates partitions without sound drops.</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 11-STAGE SIGNAL CHAIN STRIP (TX & RX LABELED GROUPS)                */}
        {/* =================================================================== */}
        <section className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-accent-lime shrink-0" />
              <h2 className="text-xl sm:text-2xl font-semibold tracking-headline text-ink dark:text-ink-dark">
                11-Stage Analog Signal Chain
              </h2>
            </div>
            <PillButton to="/architecture" variant="outline" size="sm" icon={ChevronRight} iconPosition="right">
              Stage Architecture
            </PillButton>
          </div>

          <Card variant="default" rounded="rounded-card" className="p-6 overflow-hidden">
            {/* Transmitter Group */}
            <div className="mb-6">
              <div className="text-[11px] font-bold uppercase tracking-label text-ink-secondary dark:text-ink-secondaryDark mb-3">
                Transmitter Chain (Tx)
              </div>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {txStages.map((stage, idx) => (
                  <React.Fragment key={stage.id}>
                    <div className="px-4 py-3 rounded-2xl bg-surface-subtle dark:bg-surface-subtleDark border border-hairline-light dark:border-hairline-dark shrink-0 w-36 sm:w-40 space-y-1">
                      <div className="text-[10px] font-bold text-ink-secondary dark:text-ink-secondaryDark">
                        STAGE {stage.stage}
                      </div>
                      <div className="text-xs font-bold text-ink dark:text-ink-dark truncate">
                        {stage.name}
                      </div>
                      <div className="text-[11px] text-ink-secondary dark:text-ink-secondaryDark truncate">
                        {stage.role}
                      </div>
                    </div>
                    {idx < txStages.length - 1 && (
                      <span className="text-hairline-light dark:text-hairline-dark shrink-0 font-mono text-xs">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Receiver Group */}
            <div className="pt-4 border-t border-hairline-light dark:border-hairline-dark">
              <div className="text-[11px] font-bold uppercase tracking-label text-ink-secondary dark:text-ink-secondaryDark mb-3">
                Receiver Chain (Rx)
              </div>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {rxStages.map((stage, idx) => (
                  <React.Fragment key={stage.id}>
                    <div className="px-4 py-3 rounded-2xl bg-surface-subtle dark:bg-surface-subtleDark border border-hairline-light dark:border-hairline-dark shrink-0 w-36 sm:w-40 space-y-1">
                      <div className="text-[10px] font-bold text-ink-secondary dark:text-ink-secondaryDark">
                        STAGE {stage.stage}
                      </div>
                      <div className="text-xs font-bold text-ink dark:text-ink-dark truncate">
                        {stage.name}
                      </div>
                      <div className="text-[11px] text-ink-secondary dark:text-ink-secondaryDark truncate">
                        {stage.role}
                      </div>
                    </div>
                    {idx < rxStages.length - 1 && (
                      <span className="text-hairline-light dark:text-hairline-dark shrink-0 font-mono text-xs">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* =================================================================== */}
        {/* THREE HIGHLIGHT CARDS                                               */}
        {/* =================================================================== */}
        <section className="max-w-7xl mx-auto w-full">
          <SectionHeader
            badge="Core Pillars"
            title="Complementary Physical Properties"
            subtitle="Built on the foundational strengths of RF penetration, optical isolation, and pure analog speed."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: RF Non-Line-of-Sight */}
            <Card variant="default" rounded="rounded-card" hover className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-badge-rf text-white flex items-center justify-center">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-headline text-ink dark:text-ink-dark">
                  RF: Non-Line-of-Sight
                </h3>
                <p className="text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark leading-relaxed">
                  Penetrates drywall, partitions, and human obstacles across a 30+ meter radius, allowing unrestricted listener movement.
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-hairline-light dark:border-hairline-dark">
                <span className="text-xs font-bold text-badge-rf">30m+ NLOS Coverage</span>
                <RoundIconButton icon={ArrowRight} to="/comparison" size="sm" variant="white" ariaLabel="Compare RF" />
              </div>
            </Card>

            {/* Card 2: Optical Interference-Free */}
            <Card variant="default" rounded="rounded-card" hover className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-badge-optical text-white flex items-center justify-center">
                  <Sun className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-headline text-ink dark:text-ink-dark">
                  Optical: Interference-Free
                </h3>
                <p className="text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark leading-relaxed">
                  100% immune to electromagnetic fields and Wi-Fi noise. Confined to physical room boundaries for medical and confidential listening.
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-hairline-light dark:border-hairline-dark">
                <span className="text-xs font-bold text-badge-optical">0% EM Noise Bleed</span>
                <RoundIconButton icon={ArrowRight} to="/comparison" size="sm" variant="white" ariaLabel="Compare Optical" />
              </div>
            </Card>

            {/* Card 3: Analog Zero Digital Delay */}
            <Card variant="default" rounded="rounded-card" hover className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-ink text-white dark:bg-white dark:text-ink flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-headline text-ink dark:text-ink-dark">
                  Analog: Zero Digital Delay
                </h3>
                <p className="text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark leading-relaxed">
                  Continuous analog AM modulation and envelope demodulation eliminate ADC/DAC buffering for natural speech synchronization.
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-hairline-light dark:border-hairline-dark">
                <span className="text-xs font-bold text-ink dark:text-ink-dark">&lt; 0.1 ms Latency</span>
                <RoundIconButton icon={ArrowRight} to="/architecture" size="sm" variant="white" ariaLabel="View Circuitry" />
              </div>
            </Card>
          </div>
        </section>

      </div>
    </div>
  );
}
