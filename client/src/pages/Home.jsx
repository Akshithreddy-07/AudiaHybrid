import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import TelemetryMeter from '../components/TelemetryMeter';
import SectionHeader from '../components/SectionHeader';

// 11-Stage Analog Signal Chain Data
const signalStages = [
  { id: 'mic', name: 'Electret Microphone', tag: 'Transducer', desc: 'Converts acoustic speech into low-level electrical signals (2-10 mV).' },
  { id: 'preamp', name: 'LM741 Audio Pre-Amp', tag: 'Gain Stage', desc: 'Low-noise voltage amplification with closed-loop gain ~40 dB.' },
  { id: 'filter', name: 'RC Bandpass Filter', tag: 'Active Filter', desc: 'Restricts frequency response to human vocal band (300 Hz – 3.4 kHz).' },
  { id: 'buffer', name: 'Impedance Buffer', tag: 'Isolation', desc: 'High input impedance / low output impedance stage prevents loading.' },
  { id: 'tone', name: 'Active Tone Control', tag: 'Equalization', desc: 'Baxandall bass/treble boost & cut tailored for hearing loss compensation.' },
  { id: 'mod', name: 'AM Modulator', tag: 'Modulator', desc: 'Multiplies filtered analog voice onto high-frequency carrier.' },
  { id: 'tx', name: 'RF & LED Transmitters', tag: 'Dual Emitter', desc: 'Concurrent transmission via 100MHz LC oscillator and high-output LED array.' },
  { id: 'rx', name: 'Tuned Coil & Photodiode', tag: 'Dual Detector', desc: 'Captures EM waves via ferrite antenna and photons via BPW34 photodiode.' },
  { id: 'demod', name: 'Envelope Demodulator', tag: 'Demodulation', desc: 'Schottky diode detector and RC lowpass extracts audio baseband.' },
  { id: 'amp', name: 'LM386 Audio Power Amp', tag: 'Power Stage', desc: 'Drives low-impedance headphones/speaker with up to 1 Watt output.' },
  { id: 'speaker', name: 'Acoustic Transducer', tag: 'Output', desc: 'Direct acoustic reproduction into hearing aid ear mold or headphones.' },
];

const environmentScenarios = [
  {
    id: 'classroom',
    name: 'Smart Classroom & Lecture Hall',
    recommended: 'Hybrid Dual-Carrier (RF + Optical)',
    badgeVariant: 'hybrid',
    summary: 'Non-line-of-sight RF penetrates student desks and partitions, while front-row Optical provides noise-immune clarity.',
    rfScore: '95%',
    opticalScore: '88%',
    emNoiseRisk: 'Moderate (Campus Wi-Fi)',
  },
  {
    id: 'hospital',
    name: 'Hospital ICU & MRI Imaging Zone',
    recommended: 'Optical Transmission (Pure LOS)',
    badgeVariant: 'optical',
    summary: 'Zero RF electromagnetic emissions eliminates interference with sensitive EEG/MRI monitoring equipment. Complete room privacy.',
    rfScore: '15% (Prohibited)',
    opticalScore: '99%',
    emNoiseRisk: 'Severe (Medical telemetry sensitive)',
  },
  {
    id: 'museum',
    name: 'Museum & Multi-Zone Tour',
    recommended: 'Localized Optical Exhibit Nodes',
    badgeVariant: 'optical',
    summary: 'Exhibits feature dedicated high-brightness LED beacons for pinpoint audio without bleed into adjacent rooms.',
    rfScore: '60% (Overarching Hall Broadcast)',
    opticalScore: '98%',
    emNoiseRisk: 'Low (Acoustic bleed prevention)',
  },
  {
    id: 'courtroom',
    name: 'Confidential Hearing & Courtroom',
    recommended: 'Optical Confined Link',
    badgeVariant: 'optical',
    summary: 'Light photons cannot penetrate opaque walls, creating an inherently eavesdropping-proof physical security perimeter.',
    rfScore: '30% (Bleeds through walls)',
    opticalScore: '99%',
    emNoiseRisk: 'Security / Confidentiality priority',
  },
];

export default function Home() {
  const [selectedScenario, setSelectedScenario] = useState(environmentScenarios[0]);

  return (
    <div className="w-full flex flex-col">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: ENGINEERING HUD & PLATFORM OVERVIEW                      */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 bg-grid-slate py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Mission & Core Spec */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                <span>ECE CAPSTONE PROJECT • COURSE 25SC2008E</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Hybrid RF–Optical <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-channel-optical">
                  Assistive Listening Platform
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
                An analog signal processing architecture combining long-range non-line-of-sight <strong>Radio Frequency</strong> with noise-immune <strong>Optical LED–Photodiode</strong> transmission to deliver instantaneous, zero-latency audio for hearing-impaired individuals.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button to="/dashboard" variant="primary" size="lg" icon={Activity} iconPosition="left">
                  Live Telemetry Dashboard
                </Button>
                <Button to="/architecture" variant="outline" size="lg" icon={Cpu} iconPosition="left">
                  System Architecture
                </Button>
                <Button to="/comparison" variant="ghost" size="lg" icon={ArrowRight} iconPosition="right">
                  RF vs. Optical Specs
                </Button>
              </div>

              {/* Fast Spec Bar */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <div className="text-slate-500 dark:text-slate-400 font-mono">DIGITAL DELAY</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white font-mono">&lt; 0.1 ms (Pure Analog)</div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400 font-mono">RF CARRIER</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white font-mono">~100 MHz AM Band</div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400 font-mono">OPTICAL DETECTOR</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white font-mono">BPW34 Photodiode</div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Hardware Telemetry HUD Card */}
            <div className="lg:col-span-5">
              <Card variant="default" className="shadow-lg border-slate-300/80 dark:border-slate-800 space-y-5">
                
                {/* HUD Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Live Telemetry HUD
                    </span>
                  </div>
                  <Badge variant="hybrid" size="sm" dot>
                    HYBRID MODE ACTIVE
                  </Badge>
                </div>

                {/* Live Channel Gauges */}
                <div className="space-y-3.5">
                  <TelemetryMeter
                    label="RF Carrier Level (100 MHz Tank)"
                    value={78.4}
                    unit="%"
                    color="rf"
                  />
                  <TelemetryMeter
                    label="RF Signal Strength (RSSI)"
                    value={68.0}
                    unit="%"
                    color="rf"
                  />
                  <TelemetryMeter
                    label="Optical Intensity (BPW34 Detector)"
                    value={62.1}
                    unit="%"
                    color="optical"
                  />
                  <TelemetryMeter
                    label="Demodulated Audio Envelope (LM386)"
                    value={71.0}
                    unit="%"
                    color="audio"
                  />
                </div>

                {/* Circuit Operating Points */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-500 dark:text-slate-400">Primary Audio Link:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Radio Frequency (High SNR)</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-500 dark:text-slate-400">Optical Path Status:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">Line-of-Sight Valid</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-slate-500 dark:text-slate-400">Signal-to-Noise Ratio:</span>
                    <span className="font-bold text-slate-900 dark:text-white">+42 dB</span>
                  </div>
                </div>

                {/* Link to Full Live Dashboard */}
                <Button to="/dashboard" variant="secondary" size="md" className="w-full" icon={ChevronRight} iconPosition="right">
                  Open Comprehensive Telemetry Monitor
                </Button>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PROBLEM VS. SOLUTION: ECE TECHNICAL RATIONALE                         */}
      {/* ========================================================================= */}
      <section className="w-full py-16 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <SectionHeader
            badge="Engineering Analysis"
            title="Overcoming Conventional Assistive Audio Constraints"
            subtitle="Comparing typical single-channel assistive audio systems with the AudiaHybrid dual-link analog architecture."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Problems in Single-Mode Systems */}
            <Card variant="default" className="border-rose-200 dark:border-rose-900/40 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-rose-600 uppercase">Single-Channel Vulnerabilities</div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Conventional Limitations</h3>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span><strong>DSP Buffer Latency (20–50 ms):</strong> Digital audio processing introduces latency between speaker lip movement and heard sound, disorienting hearing aid users.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span><strong>RF Electromagnetic Susceptibility:</strong> Power transformers, motors, fluorescent ballasts, and Wi-Fi induce hum and RF noise in pure RF hearing loops.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                  <span><strong>Optical Line-of-Sight Dropouts:</strong> Pure infrared/optical links cut out completely when people or room furniture obstruct the optical beam.</span>
                </li>
              </ul>
            </Card>

            {/* AudiaHybrid Solution */}
            <Card variant="default" className="border-emerald-200 dark:border-emerald-900/40 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-600 uppercase">AudiaHybrid Innovation</div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dual-Channel Hybrid Resilience</h3>
                </div>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span><strong>Zero Digital Delay (&lt;0.1 ms):</strong> Pure analog pre-amplification, RC filtering, and AM modulation eliminate ADC/DAC conversion latency entirely.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span><strong>100% Optical Noise Immunity:</strong> High-brightness LED transmission operates with zero susceptibility to RF and electromagnetic noise.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span><strong>Concurrent RF Non-LOS Redundancy:</strong> When optical line of sight is obstructed, tuned RF carrier sustains seamless audio across physical barriers.</span>
                </li>
              </ul>
            </Card>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. 11-STAGE HARDWARE SIGNAL CHAIN                                         */}
      {/* ========================================================================= */}
      <section className="w-full py-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold text-brand-600 uppercase">Hardware Circuit Architecture</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                11-Stage Analog Signal Processing Pipeline
              </h2>
            </div>
            <Button to="/architecture" variant="outline" size="sm" icon={ChevronRight} iconPosition="right">
              View Circuit Schematics & Pinouts
            </Button>
          </div>

          {/* Signal Chain Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {signalStages.map((stage, idx) => (
              <div
                key={stage.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-brand-500 dark:hover:border-brand-500 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-brand-600 dark:text-brand-400">
                    STAGE {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300">
                    {stage.tag}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {stage.name}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE DEPLOYMENT SCENARIO PLANNER                                */}
      {/* ========================================================================= */}
      <section className="w-full py-16 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <SectionHeader
            badge="Environment Selector"
            title="Real-World Deployment Link Matrix"
            subtitle="Explore how the system dynamically provisions RF, Optical, or Hybrid links based on physical environment constraints."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Scenario Selection Tabs (Left) */}
            <div className="lg:col-span-5 space-y-2">
              {environmentScenarios.map((sc) => {
                const isSelected = selectedScenario.id === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setSelectedScenario(sc)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800 border-brand-500 shadow-sm ring-1 ring-brand-500/50'
                        : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {sc.name}
                      </span>
                      <Badge variant={sc.badgeVariant} size="sm">
                        {sc.badgeVariant.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {sc.summary}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Scenario Detailed Panel (Right) */}
            <div className="lg:col-span-7">
              <Card variant="default" className="p-6 sm:p-8 space-y-5 h-full flex flex-col justify-between">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400">RECOMMENDED TRANSMISSION MODE</div>
                      <h3 className="text-xl font-bold text-brand-600 dark:text-brand-400">
                        {selectedScenario.recommended}
                      </h3>
                    </div>
                    <Badge variant={selectedScenario.badgeVariant} size="lg" dot>
                      OPTIMAL MATCH
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedScenario.summary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                      <div className="text-[10px] font-mono text-slate-500">RF RELIABILITY</div>
                      <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">{selectedScenario.rfScore}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                      <div className="text-[10px] font-mono text-slate-500">OPTICAL FIDELITY</div>
                      <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">{selectedScenario.opticalScore}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
                      <div className="text-[10px] font-mono text-slate-500">ENVIRONMENT RISK</div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">{selectedScenario.emNoiseRisk}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Curriculum Course 25SC2008E • Full Stack Telemetry
                  </span>
                  <Button to="/applications" variant="outline" size="sm" icon={ExternalLink} iconPosition="right">
                    Full Scenario Deep Dive
                  </Button>
                </div>

              </Card>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
