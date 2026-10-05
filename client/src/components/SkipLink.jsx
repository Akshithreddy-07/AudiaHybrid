import React from 'react';

/**
 * Accessible Skip to Content Link
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-dark focus:text-white focus:rounded-pill focus:shadow-xl focus:border-2 focus:border-accent font-semibold text-sm transition-all"
    >
      Skip to main content
    </a>
  );
}
