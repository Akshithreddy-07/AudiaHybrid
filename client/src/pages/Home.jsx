import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Mic,
  Radio,
  Sun,
  ArrowRight,
  Info,
  ArrowLeftRight,
  MessageSquare,
  Activity,
  CheckCircle2,
  AlertCircle,
  Zap,
  ShieldCheck,
  Clock,
  Sparkles,
  ChevronRight,
  Layers,
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import PillButton from '../components/PillButton';
import PillBar from '../components/PillBar';
import RoundIconButton from '../components/RoundIconButton';
import StatChip from '../components/StatChip';
import Meter from '../components/Meter';
import LogoBadge from '../components/LogoBadge';
import SectionHeader from '../components/SectionHeader';
import recommendationsData from '../data/recommendations.json';

// 11-stage analog signal chain items
const signalStages = [
  { id: 'mic', name: 'Electret Mic', role: 'Acoustic Capture', tag: 'Transducer' },
  { id: 'preamp', name: 'LM741 Pre-Amp', role: 'Low-Noise Gain', tag: 'Op-Amp' },
  { id: 'filter', name: 'RC Filter', role: 'Bandpass (300Hz-3.4kHz)', tag: 'Passive' },
  { id: 'buffer', name: 'Buffer Stage', role: 'Impedance Match', tag: 'Isolation' },
  { id: 'tone', name: 'Tone Control', role: 'Bass / Treble EQ', tag: 'Active Filter' },
  { id: 'mod', name: 'AM Modulator', role: 'Carrier Multiplication', tag: 'Modulation' },
  { id: 'tx', name: 'RF / LED Tx', role: 'Dual Transmitters', tag: 'Emitters' },
  { id: 'rx', name: 'RF Rx / Photodiode', role: 'Dual Receivers', tag: 'Detectors' },
  { id: 'demod', name: 'Envelope Detector', role: 'AM Demodulation', tag: 'Diode+RC' },
  { id: 'amp', name: 'LM386 Power Amp', role: 'Audio Amplification', tag: 'Power Amp' },
  { id: 'speaker', name: 'Speaker / Output', role: 'Direct Acoustic Delivery', tag: 'Transducer' },
];

export default function Home() {
  const [environment, setEnvironment] = useState('Classroom');
  const [mode, setMode] = useState('Hybrid');
  const [range, setRange] = useState('10–30 m');

  // Compute live recommendation from local state & rules
  const activeRecommendation = useMemo(() => {
    const match = recommendationsData.rules.find(
      (r) =>
        r.environment === environment &&
        r.mode === mode &&
        r.range === range
    );
    if (match) return match.recommendation;

    // Fallback search by environment or default
    const envMatch = recommendationsData.rules.find((r) => r.environment === environment);
    return envMatch ? envMatch.recommendation : recommendationsData.default;
  }, [environment, mode, range]);

  return (
    <div className="w-full flex flex-col">
      {/* ========================================================================= */}
      {/* HERO SECTION WITH SKY GRADIENT AND DECORATIVE ANALOG/OPTICAL BEAM LAYER   */}
      {/* ========================================================================= */}
      <section
        aria-label="Hero Introduction"
        className="relative hero-sky-bg min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-between p-4 sm:p-6 lg:p-10 rounded-b-[36px] overflow-hidden"
      >
        {/* =========================================================================
            PROTOTYPE PHOTO / BACKGROUND SPOT:
            To replace the decorative SVG layer with real breadboard prototype photos later,
            place an <img src="/images/prototype.jpg" className="absolute inset-0 object-cover opacity-20 pointer-events-none" /> here.
           ========================================================================= */}

        {/* Decorative Translucent SVG Analog Waves & Optical Beam */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 dark:opacity-25" aria-hidden="true">
          <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
            {/* Ambient Optical Light Rays */}
            <path d="M-100 450 L1540 100 L1540 800 Z" fill="url(#heroLightBeam)" opacity="0.4" />
            <circle cx="720" cy="800" r="400" fill="url(#heroWarmGlow)" />
            
            {/* Analog Sinusoidal Sound Waves */}
            <path
              d="M-50 480 C 200 350, 400 620, 720 480 C 1040 340, 1240 600, 1500 470"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeDasharray="12 12"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M-50 520 C 180 390, 440 650, 720 520 C 1000 390, 1280 640, 1500 510"
              stroke="#F59E6C"
              strokeWidth="3"
              fill="none"
              opacity="0.75"
            />
            <path
              d="M-50 560 C 240 430, 480 680, 720 560 C 960 440, 1200 670, 1500 550"
              stroke="#25196B"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />

            <defs>
              <linearGradient id="heroLightBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#F59E6C" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8FB3E8" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="heroWarmGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFB88A" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#FFB88A" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* TOP: Floating Pill Bar */}
        <div className="relative z-20 flex justify-center w-full pt-2">
          <PillBar
            environment={environment}
            setEnvironment={setEnvironment}
            mode={mode}
            setMode={setMode}
            range={range}
            setRange={setRange}
          />
        </div>

        {/* CENTER: Hero Typography */}
        <div className="relative z-10 max-w-4xl mx-auto text-center my-auto py-6 sm:py-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-white/50 dark:bg-black/30 backdrop-blur-md border border-white/60 dark:border-white/20 shadow-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-primary-dark dark:text-accent">
              Hybrid RF–Optical Assistive Listening
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-primary-dark dark:text-white tracking-tight leading-[1.1] drop-shadow-sm">
            Bridging the Sound Gap <br />
            <span className="font-semibold text-primary-dark dark:text-accent drop-shadow-sm">
              with Hybrid RF & Optical
            </span>
          </h1>

          {/* Subtitle with contrast scrim */}
          <div className="mt-5 max-w-2xl mx-auto px-4 py-2 rounded-2xl bg-white/30 dark:bg-black/25 backdrop-blur-sm">
            <p className="text-sm sm:text-base md:text-lg text-text-primary dark:text-text-darkPrimary font-normal leading-relaxed">
              Direct, clear audio transmission powered by pure analog signal processing
              for individuals with hearing impairment.
            </p>
          </div>
        </div>

        {/* BOTTOM: Dual Interactive Glass Cards + Central LogoBadge */}
        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-5 items-end max-w-6xl mx-auto w-full pt-4">
          
          {/* Bottom-Left Glass Card: Find the Right Link */}
          <div className="lg:col-span-6">
            <GlassCard
              variant="default"
              rounded="rounded-card"
              className="p-6 border-white/80 dark:border-white/20 shadow-xl flex flex-col justify-between h-full space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <h2 className="text-base font-bold text-text-primary dark:text-text-darkPrimary">
                    Find the Right Link
                  </h2>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-pill bg-accent/20 text-accent-dark font-semibold">
                  {environment}
                </span>
              </div>

              {/* Dynamic live recommendation */}
              <p className="text-xs sm:text-sm text-text-secondary dark:text-text-darkSecondary leading-relaxed min-h-[44px]">
                {activeRecommendation}
              </p>

              {/* Stat & Action Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary-dark dark:text-accent tracking-tight">
                    0 ms
                  </span>
                  <span className="text-[11px] text-text-secondary dark:text-text-darkSecondary font-medium">
                    digital processing delay
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Row of 3 mini icon chips */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    <span className="w-7 h-7 rounded-full bg-white/60 dark:bg-white/10 flex items-center justify-center text-text-primary dark:text-white" title="Electret Microphone">
                      <Mic className="w-3.5 h-3.5" />
                    </span>
                    <span className="w-7 h-7 rounded-full bg-white/60 dark:bg-white/10 flex items-center justify-center text-accent" title="RF Carrier Waves">
                      <Radio className="w-3.5 h-3.5" />
                    </span>
                    <span className="w-7 h-7 rounded-full bg-white/60 dark:bg-white/10 flex items-center justify-center text-amber-500" title="Optical LED">
                      <Sun className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <RoundIconButton
                    icon={ArrowRight}
                    to="/architecture"
                    variant="primary"
                    size="md"
                    ariaLabel="Explore Architecture and circuit stages"
                    title="View System Architecture"
                  />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Center LogoBadge Anchor (Desktop Overlapping Badge) */}
          <div className="hidden lg:flex lg:col-span-1 justify-center -mb-4 z-30">
            <LogoBadge size="md" />
          </div>

          {/* Bottom-Right Glass Card: Live Link Status */}
          <div className="lg:col-span-5">
            <GlassCard
              variant="default"
              rounded="rounded-card"
              className="p-6 border-white/80 dark:border-white/20 shadow-xl space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent" />
                  <h2 className="text-base font-bold text-text-primary dark:text-text-darkPrimary">
                    Live Link Status
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-pill bg-status-success/20 text-emerald-800 dark:text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-status-success animate-pulse-subtle" />
                  <span>Demo data</span>
                </div>
              </div>

              {/* Active Link Indicator */}
              <div className="flex items-center justify-between py-1 bg-white/40 dark:bg-white/5 px-3 rounded-xl">
                <span className="text-xs text-text-secondary dark:text-text-darkSecondary font-medium">
                  Active Channel
                </span>
                <span className="text-xs font-bold text-primary-dark dark:text-accent px-2 py-0.5 rounded-md bg-white/80 dark:bg-white/10 border border-white/60">
                  RF Transmitter (Primary)
                </span>
              </div>

              {/* 3 Mini Meters */}
              <div className="space-y-2">
                <Meter label="RF Signal Level" value={78} unit="%" color="accent" />
                <Meter label="Optical Photodiode" value={62} unit="%" color="primary" />
                <Meter label="Audio Power Envelope" value={71} unit="%" color="success" />
              </div>

              {/* Meta Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] px-2 py-0.5 rounded-pill bg-black/5 dark:bg-white/10 text-text-secondary dark:text-text-darkSecondary font-medium">
                  AM modulation
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-pill bg-black/5 dark:bg-white/10 text-text-secondary dark:text-text-darkSecondary font-medium">
                  LM741 pre-amp
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-pill bg-black/5 dark:bg-white/10 text-text-secondary dark:text-text-darkSecondary font-medium">
                  LM386 output
                </span>
              </div>

              {/* Bottom Row of 3 Round Action Icons */}
              <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <RoundIconButton
                    icon={Info}
                    to="/architecture"
                    size="sm"
                    variant="ghost"
                    ariaLabel="Circuit Architecture details"
                    title="Circuit Architecture"
                  />
                  <RoundIconButton
                    icon={ArrowLeftRight}
                    to="/comparison"
                    size="sm"
                    variant="ghost"
                    ariaLabel="RF vs Optical Comparison matrix"
                    title="Compare Technologies"
                  />
                  <RoundIconButton
                    icon={MessageSquare}
                    to="/feedback"
                    size="sm"
                    variant="ghost"
                    ariaLabel="Submit System Feedback"
                    title="User Feedback"
                  />
                </div>

                <PillButton
                  to="/dashboard"
                  variant="primary"
                  size="sm"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Live Dashboard
                </PillButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: PROBLEM VS SOLUTION (GLASS CARDS)                              */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-12 py-12 md:py-16 max-w-7xl mx-auto w-full">
        <SectionHeader
          badge="System Rationale"
          title="Solving the Core Challenges of Assistive Audio"
          subtitle="Conventional hearing aids and single-mode assistive loops suffer from latency, interference, or line-of-sight dropouts. AudiaHybrid solves all three."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* The Problem */}
          <GlassCard
            variant="default"
            rounded="rounded-card"
            hover
            className="border-red-200/50 dark:border-red-900/30 shadow-lg space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-status-danger">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-status-danger">The Problem</span>
                <h3 className="text-xl font-bold text-text-primary dark:text-text-darkPrimary">
                  Digital Latency & Single-Link Vulnerability
                </h3>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-text-secondary dark:text-text-darkSecondary">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-status-danger mt-2 shrink-0" />
                <span><strong>DSP Buffering Delay (20–50 ms):</strong> Digital audio processing introduces latency between speaker lip movement and heard sound, disorienting hearing-impaired users.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-status-danger mt-2 shrink-0" />
                <span><strong>RF Noise Susceptibility:</strong> Motors, fluorescent ballasts, and Wi-Fi introduce buzz and severe electromagnetic interference in pure RF receivers.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-status-danger mt-2 shrink-0" />
                <span><strong>Optical Line-of-Sight Blockage:</strong> Pure infrared/optical links drop completely whenever a person or object crosses the visual path.</span>
              </li>
            </ul>
          </GlassCard>

          {/* The Solution */}
          <GlassCard
            variant="default"
            rounded="rounded-card"
            hover
            className="border-emerald-200/50 dark:border-emerald-900/30 shadow-lg space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-status-success">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-status-success">The AudiaHybrid Solution</span>
                <h3 className="text-xl font-bold text-text-primary dark:text-text-darkPrimary">
                  Zero-Latency Analog Dual Transmission
                </h3>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-text-secondary dark:text-text-darkSecondary">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success mt-2 shrink-0" />
                <span><strong>Zero Digital Buffering (0 ms Delay):</strong> Pure analog pre-amplification, filtering, and AM modulation deliver instantaneous real-time acoustic feedback.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success mt-2 shrink-0" />
                <span><strong>Optical Noise Immunity:</strong> High-brightness LED transmission is 100% immune to electromagnetic fields and Wi-Fi noise, perfect for quiet medical zones.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success mt-2 shrink-0" />
                <span><strong>Simultaneous RF Redundancy:</strong> When optical line-of-sight is obstructed, the tuned RF carrier maintains uninterrupted audio across partitions.</span>
              </li>
            </ul>
          </GlassCard>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: 11-STAGE ANALOG SIGNAL CHAIN STRIP                             */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-12 py-10 max-w-7xl mx-auto w-full bg-black/5 dark:bg-white/5 rounded-3xl my-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Analog Signal Flow</span>
            <h2 className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary mt-1">
              Complete 11-Stage Hardware Pipeline
            </h2>
          </div>
          <PillButton
            to="/architecture"
            variant="ghost"
            size="sm"
            icon={ChevronRight}
            iconPosition="right"
          >
            Explore Stage Deep Dive
          </PillButton>
        </div>

        {/* Scrollable Signal Stages Strip */}
        <div className="overflow-x-auto pb-4 pt-2 -mx-2 px-2 scrollbar-thin">
          <div className="flex items-center gap-3 min-w-max">
            {signalStages.map((stage, idx) => (
              <React.Fragment key={stage.id}>
                <div className="glass-panel rounded-2xl p-4 w-44 shrink-0 border-white/60 dark:border-white/10 hover:border-accent transition-all duration-200">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-accent mb-1.5">
                    <span>Stage {idx + 1}</span>
                    <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[10px] text-text-secondary dark:text-text-darkSecondary">
                      {stage.tag}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-text-primary dark:text-text-darkPrimary">
                    {stage.name}
                  </div>
                  <div className="text-xs text-text-secondary dark:text-text-darkSecondary mt-1">
                    {stage.role}
                  </div>
                </div>

                {idx < signalStages.length - 1 && (
                  <div className="shrink-0 text-text-secondary dark:text-text-darkSecondary/60" aria-hidden="true">
                    <ArrowRight className="w-4 h-4 text-accent" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: THREE HIGHLIGHT CARDS                                          */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-12 py-12 md:py-16 max-w-7xl mx-auto w-full">
        <SectionHeader
          badge="Core Advantages"
          title="Engineered for Uncompromising Reliability"
          subtitle="Combining the complementary physical properties of electromagnetic waves, optical photons, and analog speed."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: RF Non-Line-of-Sight */}
          <GlassCard variant="default" rounded="rounded-card" hover className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-primary-dark dark:text-indigo-300">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-text-primary dark:text-text-darkPrimary">
              RF: Non-Line-of-Sight
            </h3>
            <p className="text-sm text-text-secondary dark:text-text-darkSecondary leading-relaxed">
              Penetrates interior walls, partitions, and moving obstacles over a 30+ meter radius,
              allowing listeners to move freely throughout multi-room environments without audio drops.
            </p>
            <div className="pt-2">
              <StatChip label="Coverage" value="30m+ NLOS" variant="primary" size="sm" />
            </div>
          </GlassCard>

          {/* Card 2: Optical Interference-Free */}
          <GlassCard variant="default" rounded="rounded-card" hover className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-text-primary dark:text-text-darkPrimary">
              Optical: Interference-Free
            </h3>
            <p className="text-sm text-text-secondary dark:text-text-darkSecondary leading-relaxed">
              Photodiode transmission is 100% immune to Wi-Fi, cell towers, and power line noise. Confined
              strictly to room boundaries for confidential listening in medical and institutional facilities.
            </p>
            <div className="pt-2">
              <StatChip label="EM Noise" value="0% Susceptibility" variant="accent" size="sm" />
            </div>
          </GlassCard>

          {/* Card 3: Analog Zero Digital Delay */}
          <GlassCard variant="default" rounded="rounded-card" hover className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-text-primary dark:text-text-darkPrimary">
              Analog: Zero Digital Delay
            </h3>
            <p className="text-sm text-text-secondary dark:text-text-darkSecondary leading-relaxed">
              Continuous analog amplitude modulation and direct envelope demodulation bypass ADC/DAC buffers,
              guaranteeing authentic, natural speech synchronization with zero lip-sync lag.
            </p>
            <div className="pt-2">
              <StatChip label="Latency" value="< 0.1 ms Delay" variant="success" size="sm" />
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
