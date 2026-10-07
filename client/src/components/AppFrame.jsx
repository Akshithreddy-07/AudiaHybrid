import React from 'react';
import PropTypes from 'prop-types';
import Header from './layout/Header';
import Footer from './layout/Footer';
import SkipLink from './SkipLink';

export default function AppFrame({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1214] text-[#E6E3DA] transition-colors">
      <SkipLink targetId="main-content" text="Skip to main telemetry console" />
      
      {/* Precision Instrument Header */}
      <Header />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 w-full focus:outline-none">
        {children}
      </main>

      {/* Technical Datasheet Footer */}
      <Footer />
    </div>
  );
}

AppFrame.propTypes = {
  children: PropTypes.node.isRequired,
};
