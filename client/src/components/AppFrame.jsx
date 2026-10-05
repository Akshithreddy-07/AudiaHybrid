import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import PillNav from './PillNav';
import PillButton from './PillButton';
import AccessibilityPopover from './AccessibilityPopover';
import SkipLink from './SkipLink';
import LogoBadge from './LogoBadge';

/**
 * Editorial AppFrame Component
 * Centered 1360px white frame with 28px radius on #D9DEE4 background.
 */
export default function AppFrame({ children }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-page-light dark:bg-page-dark transition-colors duration-200 p-2 sm:p-4 lg:p-6 flex flex-col items-center justify-center">
      <SkipLink />

      {/* Centered Master Frame (1360px max width, 28px radius) */}
      <div className="w-full max-w-[1360px] rounded-frame bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark shadow-subtle overflow-hidden flex flex-col relative min-h-[92vh]">
        
        {/* Top Header for Inner Pages */}
        {!isHome && (
          <header className="w-full px-6 py-4 flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark bg-white dark:bg-surface-dark relative z-30">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2.5 group" aria-label="AudiaHybrid Home">
                <LogoBadge size="sm" />
                <span className="font-bold tracking-tight text-sm text-ink dark:text-ink-dark hidden sm:inline">
                  AudiaHybrid
                </span>
              </Link>
              <PillNav />
            </div>

            <div className="flex items-center gap-2.5">
              <AccessibilityPopover size="md" />
              <PillButton
                to="/feedback"
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Contact us
              </PillButton>
            </div>
          </header>
        )}

        {/* Main Content Area */}
        <main
          id="main-content"
          className={`flex-1 w-full focus:outline-none ${!isHome ? 'bg-surface-subtle dark:bg-surface-subtleDark' : ''}`}
        >
          {children}
        </main>

        {/* Slim Editorial Footer */}
        <footer className="w-full border-t border-hairline-light dark:border-hairline-dark px-6 py-4 bg-white dark:bg-surface-dark">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-secondary dark:text-ink-secondaryDark font-medium">
            <div className="flex items-center gap-2">
              <span className="font-bold text-ink dark:text-ink-dark">AudiaHybrid</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-pill bg-surface-subtle dark:bg-white/10 font-semibold text-ink dark:text-ink-dark border border-hairline-light dark:border-hairline-dark">
                25SC2008E
              </span>
            </div>
            <div>
              <span>RF + Optical Assistive Listening System (Analog Signal Processing)</span>
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
