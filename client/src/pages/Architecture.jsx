import React from 'react';
import { Cpu, Layers, Radio, Sun, Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';

const txModules = [
  { stage: 'Stage 01', name: 'Electret Microphone Input', ic: 'CUI CMEJ-0415', purpose: 'Acoustic voice capture with internal JFET impedance converter.' },
  { stage: 'Stage 02', name: 'Low-Noise Audio Pre-Amplifier', ic: 'LM741CN / NE5532', purpose: 'Voltage amplification with adjustable closed-loop gain (20 dB to 40 dB).' },
  { stage: 'Stage 03', name: 'Vocal Bandpass Active Filter', ic: 'RC Sallen-Key', purpose: 'Attenuates low rumble (<300 Hz) and high-frequency hiss (>3.4 kHz).' },
  { stage: 'Stage 04', name: 'Impedance Buffer Stage', ic: 'LM741 Voltage Follower', purpose: 'Isolates filter network from tone control loading.' },
  { stage: 'Stage 05', name: 'Active Baxandall Tone Control', ic: 'Active RC EQ', purpose: 'Tailors frequency response for specific audiogram hearing loss profiles.' },
  { stage: 'Stage 06', name: 'AM Balanced Modulator', ic: 'Analog Multiplier / Diode Ring', purpose: 'Modulates filtered speech onto RF and optical carrier frequencies.' },
  { stage: 'Stage 07', name: 'Dual Driver Transmitters', ic: 'LC Tank & LED Array', purpose: 'Transmits RF via tuned ferrite antenna and optical light via high-output LEDs.' },
];

const rxModules = [
  { stage: 'Stage 08', name: 'Dual-Channel Front End', ic: 'Tuned LC + BPW34', purpose: 'Simultaneous capture of RF magnetic field and optical photon flux.' },
  { stage: 'Stage 09', name: 'Envelope Demodulator', ic: '1N4148 / BAT41 + RC', purpose: 'Extracts baseband audio envelope from RF/Optical AM carriers.' },
  { stage: 'Stage 10', name: 'LM386 Audio Power Amplifier', ic: 'LM386N-1', purpose: 'Amplifies demodulated speech to drive 8Ω / 32Ω headphones or hearing loop.' },
  { stage: 'Stage 11', name: 'Acoustic Output Transducer', ic: 'Earphone / Speaker', purpose: 'Reproduces acoustic audio directly to the user ear canal.' },
];

export default function Architecture() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="text-xs font-mono font-bold text-brand-600 uppercase">Hardware Circuit Specifications</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          System Circuit Architecture
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Detailed breakdown of the 11-stage analog signal processing pipeline from acoustic capture to dual transmission and reception.
        </p>
      </div>

      {/* Module A: Transmitter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Transmitter Unit (Tx Module)
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">Stages 01 through 07 • Microphone to Dual Carriers</span>
            </div>
          </div>
          <Badge variant="rf" size="sm">7 Analog Stages</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {txModules.map((m) => (
            <Card key={m.stage} variant="default" className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-brand-600 dark:text-brand-400">{m.stage}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">{m.ic}</span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {m.name}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {m.purpose}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Module B: Receiver */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Receiver Unit (Rx Module)
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">Stages 08 through 11 • Detection to Acoustic Output</span>
            </div>
          </div>
          <Badge variant="optical" size="sm">4 Analog Stages</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rxModules.map((m) => (
            <Card key={m.stage} variant="default" className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-amber-600 dark:text-amber-400">{m.stage}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">{m.ic}</span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {m.name}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {m.purpose}
              </p>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
