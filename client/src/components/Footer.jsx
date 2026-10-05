import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, Cpu, ExternalLink, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Abstract */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
                <Radio className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                AudiaHybrid
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Design and development of a hybrid RF–optical assistive listening system using analog signal processing. Live telemetry monitoring platform conforming to the course curriculum for Full Stack Web Development (25SC2008E).
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span>Department of ECE</span>
              <span>•</span>
              <span>KL University</span>
            </div>
          </div>

          {/* Quick Technical Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              System Architecture
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/architecture" className="hover:text-brand-600 dark:hover:text-brand-400">11-Stage Analog Chain</Link></li>
              <li><Link to="/comparison" className="hover:text-brand-600 dark:hover:text-brand-400">RF vs Optical Physics</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-600 dark:hover:text-brand-400">Live Telemetry HUD</Link></li>
              <li><Link to="/bom" className="hover:text-brand-600 dark:hover:text-brand-400">Bill of Materials (BOM)</Link></li>
            </ul>
          </div>

          {/* Compliance & Administration */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Course & Admin
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/applications" className="hover:text-brand-600 dark:hover:text-brand-400">Deployment Scenarios</Link></li>
              <li><Link to="/history" className="hover:text-brand-600 dark:hover:text-brand-400">PostgreSQL Data Logs</Link></li>
              <li><Link to="/feedback" className="hover:text-brand-600 dark:hover:text-brand-400">Stakeholder Feedback</Link></li>
              <li><Link to="/admin" className="hover:text-brand-600 dark:hover:text-brand-400">Admin Console</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} AudiaHybrid Platform • Course Code: 25SC2008E
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              SignalDash Real-Time Pipeline
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
