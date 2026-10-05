import { useEffect } from 'react';

/**
 * Custom hook to update the document title per page route
 * @param {string} title - Page title prefix
 */
export function usePageTitle(title) {
  useEffect(() => {
    const defaultTitle = 'AudiaHybrid – Dual RF-Optical Assistive Platform';
    if (title) {
      document.title = `${title} | AudiaHybrid`;
    } else {
      document.title = defaultTitle;
    }
  }, [title]);
}

export default usePageTitle;
