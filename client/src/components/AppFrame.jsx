import React from 'react';
import IconRail from './IconRail';
import BottomNav from './BottomNav';
import SkipLink from './SkipLink';

/**
 * AppFrame component
 * Main layout shell wrapping all views in a rounded floating glass frame with responsive margins.
 */
export default function AppFrame({ children }) {
  return (
    <div className="min-h-screen bg-page-light dark:bg-page-dark transition-colors duration-300 p-2 sm:p-4 lg:p-6 flex flex-col items-center justify-center">
      <SkipLink />

      {/* Desktop Vertical Icon Rail */}
      <IconRail />

      {/* Mobile Floating Bottom Nav */}
      <BottomNav />

      {/* Master Outer Glass Frame */}
      <div className="w-full max-w-7xl rounded-frame-mobile lg:rounded-frame glass-panel border-white/80 dark:border-white/20 shadow-2xl overflow-hidden flex flex-col relative min-h-[92vh] lg:pl-16">
        
        {/* Main Content Area */}
        <main id="main-content" className="flex-1 w-full focus:outline-none pb-20 lg:pb-0">
          {children}
        </main>

        {/* Slim Glass Footer Bar */}
        <footer className="w-full glass-panel border-t border-white/50 dark:border-white/10 px-6 py-4 mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary dark:text-text-darkSecondary font-medium">
            <div className="flex items-center gap-2">
              <span className="font-bold text-text-primary dark:text-text-darkPrimary">AudiaHybrid</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-pill bg-primary-dark/10 dark:bg-white/10 font-semibold text-primary-dark dark:text-white">
                Course: 25SC2008E
              </span>
            </div>
            <div>
              <span>ECE Project – Hybrid RF & Optical Assistive Listening System</span>
            </div>
            <div>
              <span>KL University • Team 07</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
