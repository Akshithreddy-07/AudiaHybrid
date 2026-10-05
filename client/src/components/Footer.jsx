import React from 'react';
import { Link } from 'react-router-dom';
import { Radio } from 'lucide-react';

const CURRENT_YEAR = '2026';

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Tier: Academic Brand & Project Metadata */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                AudiaHybrid Telemetry Platform
              </div>
              <div className="text-[11px] text-slate-500">
                Department of Electronics & Communication Engineering • KL University
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Course: 25SC2008E (FSWD)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Analog AM 1MHz + Optical TSAL6100
            </span>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Quick Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © {CURRENT_YEAR} AudiaHybrid Platform • Course Code: 25SC2008E
          </div>

          <div className="flex items-center gap-6">
            <Link to="/architecture" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              11-Stage Pipeline
            </Link>
            <Link to="/comparison" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              RF vs. Optical
            </Link>
            <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Instrumentation
            </Link>
            <Link to="/feedback" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Evaluation
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
