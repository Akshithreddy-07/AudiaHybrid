import React, { useState, useMemo } from 'react';
import { Boxes, Search, ArrowUpDown, IndianRupee, FileText } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

const bomData = [
  { id: 1, part: 'Electret Microphone Capsule (CMEJ-0415)', category: 'Audio Input', quantity: 1, min: 25, max: 40, notes: 'Omnidirectional condenser mic with integrated JFET buffer' },
  { id: 2, part: 'LM741CN Operational Amplifier IC', category: 'Analog Signal Chain', quantity: 2, min: 30, max: 50, notes: 'Low-noise audio pre-amplifier and active buffer stages' },
  { id: 3, part: 'High-Brightness White/IR LED Array (5mm)', category: 'Optical Transmitter', quantity: 4, min: 40, max: 70, notes: 'Wide-angle intensity-modulated optical emitter' },
  { id: 4, part: 'BPW34 Silicon PIN Photodiode', category: 'Optical Receiver', quantity: 2, min: 80, max: 120, notes: 'High-speed optical radiation detector with 7.5mm² radiant sensitive area' },
  { id: 5, part: 'LM386N-1 Low Voltage Audio Power Amp', category: 'Audio Output', quantity: 1, min: 35, max: 60, notes: 'Drives 8Ω speaker / 32Ω headphones with up to 1W power output' },
  { id: 6, part: 'RF Inductor / Ferrite Tuning Coil & Variable Cap', category: 'RF Tank Circuit', quantity: 1, min: 60, max: 100, notes: 'Tuned LC resonant tank for ~100 MHz carrier selection' },
  { id: 7, part: '1N4148 / BAT41 High-Speed Schottky Diodes', category: 'Demodulation', quantity: 4, min: 15, max: 30, notes: 'AM envelope detector and RF signal rectification' },
  { id: 8, part: 'Passive Component Kit (Resistors & Ceramic Caps)', category: 'Passives', quantity: 24, min: 50, max: 80, notes: 'RC filter networks, Sallen-Key tuning, and bypass decoupling' },
  { id: 9, part: 'Double-Sided FR4 Copper Clad PCB / Breadboard', category: 'Prototyping', quantity: 1, min: 70, max: 120, notes: 'Substrate for analog signal path and RF ground planes' },
];

export default function Bom() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Audio Input', 'Analog Signal Chain', 'Optical Transmitter', 'Optical Receiver', 'Audio Output', 'RF Tank Circuit', 'Passives', 'Prototyping'];

  const filteredBom = useMemo(() => {
    return bomData.filter((item) => {
      const matchesSearch = item.part.toLowerCase().includes(searchTerm.toLowerCase()) || item.notes.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const totalMin = filteredBom.reduce((sum, item) => sum + item.min, 0);
  const totalMax = filteredBom.reduce((sum, item) => sum + item.max, 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs font-mono font-bold text-brand-600 uppercase">Hardware Procurement & Costing</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Bill of Materials (BOM)
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Component parts breakdown, unit costs in Indian Rupees (₹), and hardware budgeting for the AudiaHybrid prototype.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800">
          <div className="text-[10px] font-mono text-brand-600 uppercase">Total Estimated Hardware Budget</div>
          <div className="text-xl font-bold font-mono text-brand-700 dark:text-brand-300">
            ₹{totalMin} – ₹{totalMax}
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search parts, ICs, or circuit roles..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* BOM Table Card */}
      <Card variant="default" className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px] text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-white">
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">Component & Part Number</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4">Est. Cost (₹)</th>
                <th className="py-3 px-4">Circuit Function / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBom.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{item.part}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold">{item.quantity}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                    ₹{item.min} – ₹{item.max}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
