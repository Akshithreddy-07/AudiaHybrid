import React, { useState, useRef, useEffect } from 'react';
import { Eye, Check, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import RoundIconButton from './RoundIconButton';
import GlassCard from './GlassCard';

/**
 * AccessibilityPopover component
 * Popover offering High Contrast and Large Text switches with keyboard accessibility.
 */
export default function AccessibilityPopover({ size = 'md', className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isHighContrast, toggleHighContrast, isLargeText, toggleLargeText } = useTheme();
  const popoverRef = useRef(null);
  const triggerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`relative inline-block ${className}`}>
      <div ref={triggerRef}>
        <RoundIconButton
          icon={Eye}
          onClick={() => setIsOpen((prev) => !prev)}
          size={size}
          active={isOpen || isHighContrast || isLargeText}
          ariaLabel="Accessibility settings: High Contrast & Large Text"
          title="Accessibility settings"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          badge={isHighContrast || isLargeText}
        />
      </div>

      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="Accessibility options"
          className="absolute bottom-12 left-0 sm:left-auto sm:bottom-auto sm:top-0 sm:left-14 z-50 w-72 animate-fade-in"
        >
          <GlassCard
            variant="default"
            rounded="rounded-2xl"
            className="shadow-2xl border-2 border-primary-dark/20 dark:border-white/30 p-4 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-accent" aria-hidden="true" />
                <h3 className="text-sm font-bold text-text-primary dark:text-text-darkPrimary">
                  Accessibility
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                className="p-1 rounded-full text-text-secondary hover:text-text-primary dark:hover:text-white"
                aria-label="Close accessibility settings"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* High Contrast Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={isHighContrast}
                onClick={toggleHighContrast}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                  isHighContrast
                    ? 'bg-primary-dark text-white border-white/40 font-bold'
                    : 'bg-white/40 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-white/70 text-text-primary dark:text-text-darkPrimary'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">High Contrast</div>
                  <div className="text-[11px] opacity-80 font-normal">Solid panels & sharp borders</div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    isHighContrast ? 'bg-accent border-accent text-primary-dark' : 'border-gray-400'
                  }`}
                >
                  {isHighContrast && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              {/* Large Text Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={isLargeText}
                onClick={toggleLargeText}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                  isLargeText
                    ? 'bg-primary-dark text-white border-white/40 font-bold'
                    : 'bg-white/40 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-white/70 text-text-primary dark:text-text-darkPrimary'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">Large Text (125%)</div>
                  <div className="text-[11px] opacity-80 font-normal">Scales all typography for readability</div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                    isLargeText ? 'bg-accent border-accent text-primary-dark' : 'border-gray-400'
                  }`}
                >
                  {isLargeText && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
