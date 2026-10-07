import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for complete WCAG 2.2 AA accessibility preferences and speech synthesis
 */
export function useAccessibility() {
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('audia_high_contrast') === 'true';
  });

  const [fontScale, setFontScale] = useState(() => {
    return localStorage.getItem('audia_font_scale') || '100';
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    if (localStorage.getItem('audia_reduced_motion') !== null) {
      return localStorage.getItem('audia_reduced_motion') === 'true';
    }
    return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  // Apply DOM classes on changes
  useEffect(() => {
    const root = document.documentElement;

    if (highContrast) {
      root.classList.add('high-contrast');
      localStorage.setItem('audia_high_contrast', 'true');
    } else {
      root.classList.remove('high-contrast');
      localStorage.setItem('audia_high_contrast', 'false');
    }

    // Font scaling
    root.classList.remove('text-scale-125', 'text-scale-150');
    if (fontScale === '125') root.classList.add('text-scale-125');
    if (fontScale === '150') root.classList.add('text-scale-150');
    localStorage.setItem('audia_font_scale', fontScale);

    localStorage.setItem('audia_reduced_motion', String(reducedMotion));
  }, [highContrast, fontScale, reducedMotion]);

  // Speech synthesis read-aloud
  const speakText = useCallback((text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    highContrast,
    setHighContrast,
    toggleHighContrast: () => setHighContrast((prev) => !prev),
    fontScale,
    setFontScale,
    reducedMotion,
    setReducedMotion,
    toggleReducedMotion: () => setReducedMotion((prev) => !prev),
    speakText,
    stopSpeaking,
    isSpeaking,
  };
}

export default useAccessibility;
