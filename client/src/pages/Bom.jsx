import React from 'react';
import { Boxes, IndianRupee, Search, ArrowUpDown, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import SectionHeader from '../components/SectionHeader';
import PillButton from '../components/PillButton';

export default function Bom() {
  const sampleBom = [
    { part: 'Electret Microphone Capsule', quantity: 1, min: 25, max: 40, notes: 'Omnidirectional condenser mic' },
    { part: 'LM741 Operational Amplifier IC', quantity: 2, min: 30, max: 50, notes: 'Low-noise audio pre-amplifier' },
    { part: 'High-Brightness White/IR LED Array', quantity: 4, min: 40, max: 70, notes: 'Optical transmitter source' },
    { part: 'BPW34 Silicon PIN Photodiode', quantity: 2, min: 80, max: 120, notes: 'High-speed optical receiver' },
    { part: 'LM386 Low Voltage Audio Power Amp', quantity: 1, min: 35, max: 60, notes: 'Headphone / speaker amplifier' },
    { part: 'Tuning Coil & Variable Capacitor', quantity: 1, min: 60, max: 100, notes: 'RF tuned tank circuit' },
  ];

  const totalMin = sampleBom.reduce((sum, item) => sum + item.min, 0);
  const totalMax = sampleBom.reduce((sum, item) => sum + item.max, 0);

  return (
    <div className="w-full flex flex-col px-4 sm:px-6 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="relative rounded-3xl hero-sky-bg p-6 sm:p-10 mb-8 overflow-hidden shadow-glass border border-white/70 dark:border-white/20">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-pill bg-white/60 dark:bg-black/40 border border-white/60 text-xs font-bold uppercase tracking-wider text-primary-dark dark:text-accent mb-3">
            <Boxes className="w-3.5 h-3.5" /> Component Budgeting
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-primary-dark dark:text-white tracking-tight">
            Bill of <span className="font-semibold text-accent">Materials (BOM)</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-text-primary dark:text-text-darkPrimary max-w-2xl leading-relaxed">
            Component cost breakdown, part quantities, and estimated hardware budget for building the AudiaHybrid prototype.
          </p>
        </div>
      </div>

      {/* Cost Summary & Preview Table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <GlassCard variant="default" rounded="rounded-card" className="p-6 space-y-2">
          <span className="text-xs font-bold uppercase text-text-secondary dark:text-text-darkSecondary">Estimated Total</span>
          <div className="text-2xl sm:text-3xl font-bold text-primary-dark dark:text-accent">
            ₹{totalMin} – ₹{totalMax}
          </div>
          <p className="text-xs text-text-secondary dark:text-text-darkSecondary">Low-cost accessible analog design</p>
        </GlassCard>

        <div className="lg:col-span-3">
          <GlassCard variant="default" rounded="rounded-card" className="p-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-black/10 dark:border-white/10 font-bold uppercase tracking-wider text-text-primary dark:text-text-darkPrimary text-[11px]">
                    <th className="py-2.5 px-3">Component</th>
                    <th className="py-2.5 px-3">Qty</th>
                    <th className="py-2.5 px-3">Est. Cost (₹)</th>
                    <th className="py-2.5 px-3">Function</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {sampleBom.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/40 dark:hover:bg-white/5">
                      <td className="py-3 px-3 font-semibold text-text-primary dark:text-text-darkPrimary">{item.part}</td>
                      <td className="py-3 px-3">{item.quantity}</td>
                      <td className="py-3 px-3 font-medium">₹{item.min} – ₹{item.max}</td>
                      <td className="py-3 px-3 text-text-secondary dark:text-text-darkSecondary text-xs">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 text-xs text-text-secondary dark:text-text-darkSecondary text-center">
              Interactive sorting, live search filtering, and REST API integration will be added in Phase 3.
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
