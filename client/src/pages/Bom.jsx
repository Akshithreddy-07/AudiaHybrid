import React from 'react';
import Card from '../components/Card';

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
    <div className="w-full flex flex-col px-4 sm:px-6 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-hairline-light dark:border-hairline-dark pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 bg-accent-lime shrink-0" />
          <span className="text-xs font-bold uppercase tracking-label text-ink dark:text-ink-dark">
            Component Cost Breakdown
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-headline text-ink dark:text-ink-dark">
          Bill of Materials (BOM)
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark max-w-2xl leading-relaxed">
          Hardware component quantities and estimated budget for building the AudiaHybrid prototype.
        </p>
      </div>

      {/* Cost Summary & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card variant="default" rounded="rounded-card" className="p-6 space-y-2 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-label text-ink-secondary dark:text-ink-secondaryDark">
              Estimated Total
            </span>
            <div className="text-3xl font-bold tracking-headline text-ink dark:text-ink-dark">
              ₹{totalMin} – ₹{totalMax}
            </div>
          </div>
          <p className="text-xs text-ink-secondary dark:text-ink-secondaryDark">
            Low-cost accessible analog hardware design.
          </p>
        </Card>

        <div className="lg:col-span-3">
          <Card variant="default" rounded="rounded-card" className="p-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-hairline-light dark:border-hairline-dark font-bold uppercase tracking-label text-ink dark:text-ink-dark text-[11px]">
                    <th className="py-2.5 px-3">Component</th>
                    <th className="py-2.5 px-3">Qty</th>
                    <th className="py-2.5 px-3">Est. Cost</th>
                    <th className="py-2.5 px-3">Function</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline-light dark:divide-hairline-dark">
                  {sampleBom.map((item, idx) => (
                    <tr key={idx} className="hover:bg-surface-subtle dark:hover:bg-white/5">
                      <td className="py-3 px-3 font-semibold text-ink dark:text-ink-dark">{item.part}</td>
                      <td className="py-3 px-3">{item.quantity}</td>
                      <td className="py-3 px-3 font-bold">₹{item.min} – ₹{item.max}</td>
                      <td className="py-3 px-3 text-ink-secondary dark:text-ink-secondaryDark text-xs">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 pt-3 border-t border-hairline-light dark:border-hairline-dark text-xs text-ink-secondary dark:text-ink-secondaryDark text-center">
              Interactive sorting, live search filtering, and REST API integration will be added in Phase 3.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
