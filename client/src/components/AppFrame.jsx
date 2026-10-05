import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Footer from './Footer';
import SkipLink from './SkipLink';

/**
 * AppFrame Component
 * Production layout wrapper providing sticky Navbar, structured main container, and Footer.
 */
export default function AppFrame({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <SkipLink />
      
      {/* Universal Top Navigation Header */}
      <Navbar />

      {/* Main Page Content */}
      <main id="main-content" className="flex-1 w-full focus:outline-none">
        {children}
      </main>

      {/* Engineering Footer */}
      <Footer />
    </div>
  );
}

AppFrame.propTypes = {
  children: PropTypes.node.isRequired,
};
