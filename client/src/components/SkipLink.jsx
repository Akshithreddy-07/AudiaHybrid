import React from 'react';
import PropTypes from 'prop-types';

/**
 * Accessible SkipLink Component
 */
export default function SkipLink({ targetId = 'main-content', text = 'Skip to main content' }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-lg shadow-lg border-2 border-white focus:outline-none"
    >
      {text}
    </a>
  );
}

SkipLink.propTypes = {
  targetId: PropTypes.string,
  text: PropTypes.string,
};
