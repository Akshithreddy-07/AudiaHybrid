import React from 'react';
import PropTypes from 'prop-types';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import { GlobalControlBar } from './GlobalControlBar.jsx';
import { ShortcutsModal } from './ShortcutsModal.jsx';
import { useSensorData } from '../../hooks/useSensorData.js';

export function AppFrame({ children }) {
  const { pendingCount } = useSensorData();

  return (
    <div className="min-h-screen flex flex-col bg-[#0F1214] text-[#E6E3DA] transition-colors font-sans antialiased">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 px-3 py-2 bg-[#5DCAA5] text-black font-mono font-bold text-xs rounded"
      >
        Skip to main content
      </a>

      {/* 1. Header Landmark */}
      <Header />

      {/* 2. Global Control Bar */}
      <GlobalControlBar pendingCount={pendingCount} />

      {/* 3. Main Content Landmark */}
      <main id="main-content" tabIndex={-1} className="flex-1 w-full focus:outline-none">
        {children}
      </main>

      {/* 4. Footer Landmark */}
      <Footer />

      {/* Global Shortcuts Dialog */}
      <ShortcutsModal />
    </div>
  );
}

AppFrame.propTypes = {
  children: PropTypes.node.isRequired,
};
