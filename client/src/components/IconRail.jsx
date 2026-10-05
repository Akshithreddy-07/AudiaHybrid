import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Home,
  Cpu,
  ArrowLeftRight,
  Compass,
  Activity,
  History,
  Boxes,
  MessageSquare,
  User,
  Shield,
} from 'lucide-react';
import RoundIconButton from './RoundIconButton';
import ThemeToggle from './ThemeToggle';
import AccessibilityPopover from './AccessibilityPopover';

export const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Architecture', path: '/architecture', icon: Cpu },
  { name: 'Comparison', path: '/comparison', icon: ArrowLeftRight },
  { name: 'Applications', path: '/applications', icon: Compass },
  { name: 'Dashboard', path: '/dashboard', icon: Activity },
  { name: 'History', path: '/history', icon: History },
  { name: 'BOM', path: '/bom', icon: Boxes },
  { name: 'Feedback', path: '/feedback', icon: MessageSquare },
];

/**
 * Desktop vertical floating icon rail
 */
export default function IconRail() {
  const location = useLocation();

  return (
    <nav
      aria-label="Main Navigation"
      className="hidden lg:flex flex-col items-center gap-4 fixed left-6 top-1/2 -translate-y-1/2 z-40 select-none"
    >
      {/* Primary Navigation Pill */}
      <div className="glass-panel rounded-full p-2 flex flex-col items-center gap-2 shadow-glass border-white/70 dark:border-white/20 backdrop-blur-glass">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div key={item.path} className="relative group flex items-center">
              <RoundIconButton
                icon={item.icon}
                to={item.path}
                active={isActive}
                size="md"
                ariaLabel={`Navigate to ${item.name}`}
                title={item.name}
                className={
                  isActive
                    ? 'shadow-md'
                    : 'text-text-primary dark:text-text-darkPrimary hover:text-accent'
                }
              />
              {/* Tooltip on hover / focus */}
              <div className="absolute left-full ml-3.5 px-3 py-1 rounded-pill bg-primary-dark text-white text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 shadow-lg z-50">
                {item.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Controls Pill (Auth, Accessibility, Theme) */}
      <div className="glass-panel rounded-full p-2 flex flex-col items-center gap-2 shadow-glass border-white/70 dark:border-white/20 backdrop-blur-glass">
        <div className="relative group flex items-center">
          <RoundIconButton
            icon={User}
            to="/login"
            active={location.pathname === '/login' || location.pathname === '/register'}
            size="md"
            ariaLabel="Login or User Profile"
            title="Account / Login"
            className="text-text-primary dark:text-text-darkPrimary hover:text-accent"
          />
          <div className="absolute left-full ml-3.5 px-3 py-1 rounded-pill bg-primary-dark text-white text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 shadow-lg z-50">
            Account
          </div>
        </div>

        <AccessibilityPopover size="md" />

        <ThemeToggle size="md" />
      </div>
    </nav>
  );
}
