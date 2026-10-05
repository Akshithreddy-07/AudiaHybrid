import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import RoundIconButton from './RoundIconButton';

/**
 * ThemeToggle component
 * Switches between Light and Dark modes.
 */
export default function ThemeToggle({ size = 'md', className = '' }) {
  const { isDark, toggleDark } = useTheme();

  return (
    <RoundIconButton
      icon={isDark ? Sun : Moon}
      onClick={toggleDark}
      size={size}
      ariaLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`text-accent hover:text-white dark:text-accent dark:hover:text-white ${className}`}
    />
  );
}
