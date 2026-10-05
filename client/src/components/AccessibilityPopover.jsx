import React, { useState, useRef, useEffect } from 'react';
import { Settings2, Check, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import RoundIconButton from './RoundIconButton';
import Card from './Card';

/**
 * Editorial Accessibility & Settings Popover
 */
export default function AccessibilityPopover({ size = 'md', className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleDark, isHighContrast, toggleHighContrast, isLargeText, toggleLargeText } = useTheme();
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

  // Close on Outside Click
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
          icon={Settings2}
          onClick={() => setIsOpen((prev) => !prev)}
          size={size}
          variant="black"
          active={isOpen}
          badge={isHighContrast || isLargeText}
          ariaLabel="Settings & Accessibility Options"
          title="Settings & Accessibility"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        />
      </div>

      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="Display & Accessibility settings"
          className="absolute right-0 mt-2 w-72 z-50 animate-fade-up"
        >
          <Card
            variant="default"
            rounded="rounded-card"
            className="p-4 shadow-floating border border-hairline-light dark:border-hairline-dark space-y-4"
          >
            <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-lime shrink-0" aria-hidden="true" />
                <h3 className="text-xs font-bold uppercase tracking-label text-ink dark:text-ink-dark">
                  Display Settings
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                className="p-1 rounded-full text-ink-secondary hover:text-ink dark:text-ink-secondaryDark dark:hover:text-white"
                aria-label="Close settings"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {/* Light / Dark Mode Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={isDark}
                onClick={toggleDark}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-surface-subtle dark:bg-surface-subtleDark hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-left transition-all"
              >
                <div className="flex items-center gap-2.5">
                  {isDark ? <Moon className="w-4 h-4 text-ink dark:text-ink-dark" /> : <Sun className="w-4 h-4 text-ink" />}
                  <div>
                    <div className="text-xs font-bold text-ink dark:text-ink-dark">Dark Theme</div>
                    <div className="text-[11px] text-ink-secondary dark:text-ink-secondaryDark">High-contrast dark mode</div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isDark ? 'bg-ink text-white dark:bg-white dark:text-ink border-transparent' : 'border-hairline-light'}`}>
                  {isDark && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              {/* High Contrast Mode Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={isHighContrast}
                onClick={toggleHighContrast}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-surface-subtle dark:bg-surface-subtleDark hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-left transition-all"
              >
                <div>
                  <div className="text-xs font-bold text-ink dark:text-ink-dark">High Contrast</div>
                  <div className="text-[11px] text-ink-secondary dark:text-ink-secondaryDark">Solid white/black & 2px borders</div>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isHighContrast ? 'bg-ink text-white dark:bg-white dark:text-ink border-transparent' : 'border-hairline-light'}`}>
                  {isHighContrast && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              {/* Large Text Mode Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={isLargeText}
                onClick={toggleLargeText}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-surface-subtle dark:bg-surface-subtleDark hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-left transition-all"
              >
                <div>
                  <div className="text-xs font-bold text-ink dark:text-ink-dark">Large Text (125%)</div>
                  <div className="text-[11px] text-ink-secondary dark:text-ink-secondaryDark">Enlarged readable typography</div>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isLargeText ? 'bg-ink text-white dark:bg-white dark:text-ink border-transparent' : 'border-hairline-light'}`}>
                  {isLargeText && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
