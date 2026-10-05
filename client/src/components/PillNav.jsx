import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  ChevronDown,
  Menu,
  X,
  ArrowLeftRight,
  Compass,
  History,
  Boxes,
  MessageSquare,
  User,
  Shield,
} from 'lucide-react';

export const primaryNavItems = [
  { name: 'Home', path: '/' },
  { name: 'Architecture', path: '/architecture' },
  { name: 'Dashboard', path: '/dashboard' },
];

export const moreNavItems = [
  { name: 'Comparison', path: '/comparison', icon: ArrowLeftRight },
  { name: 'Applications', path: '/applications', icon: Compass },
  { name: 'History', path: '/history', icon: History },
  { name: 'Bill of Materials', path: '/bom', icon: Boxes },
  { name: 'Feedback', path: '/feedback', icon: MessageSquare },
  { name: 'Login / Account', path: '/login', icon: User },
  { name: 'Admin Console', path: '/admin', icon: Shield },
];

export default function PillNav() {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const moreButtonRef = useRef(null);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isDropdownOpen) {
        setIsDropdownOpen(false);
        moreButtonRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDropdownOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        moreButtonRef.current &&
        !moreButtonRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Check if any "More" item is currently active
  const isMoreActive = moreNavItems.some((item) => location.pathname === item.path);

  return (
    <nav aria-label="Main" className="relative z-40">
      {/* Desktop Pill Bar (>= 1024px) */}
      <div className="hidden lg:inline-flex items-center p-1 rounded-pill bg-white dark:bg-card-dark border border-hairline-light dark:border-hairline-dark shadow-subtle">
        {primaryNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-1.5 rounded-pill text-xs font-semibold tracking-tight transition-all duration-200 ${
                isActive
                  ? 'bg-ink text-white dark:bg-white dark:text-ink shadow-subtle'
                  : 'text-ink dark:text-ink-dark hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {item.name}
            </Link>
          );
        })}

        {/* "More" Dropdown Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            ref={moreButtonRef}
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            aria-label="More navigation options"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-xs font-semibold tracking-tight transition-all duration-200 ${
              isMoreActive || isDropdownOpen
                ? 'bg-ink text-white dark:bg-white dark:text-ink shadow-subtle'
                : 'text-ink dark:text-ink-dark hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <span>More</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Desktop Dropdown Card */}
          {isDropdownOpen && (
            <div
              className="absolute left-0 mt-2 w-56 rounded-card bg-white dark:bg-card-dark border border-hairline-light dark:border-hairline-dark shadow-floating p-2 space-y-1 animate-fade-up z-50"
              role="menu"
            >
              {moreNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    role="menuitem"
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-ink text-white dark:bg-white dark:text-ink font-semibold'
                        : 'text-ink dark:text-ink-dark hover:bg-surface-subtle dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 text-ink-secondary dark:text-ink-secondaryDark" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Trigger (< 1024px) */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-pill bg-ink text-white dark:bg-white dark:text-ink text-xs font-bold shadow-subtle active:scale-95"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </button>
      </div>

      {/* Mobile Navigation Sheet */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end animate-fade-up">
          <div className="w-full bg-white dark:bg-card-dark rounded-t-panel border-t border-hairline-light dark:border-hairline-dark p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-hairline-light dark:border-hairline-dark pb-3">
              <span className="text-sm font-bold uppercase tracking-wider text-ink dark:text-ink-dark">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-full text-ink-secondary hover:text-ink dark:text-ink-secondaryDark dark:hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* All Links List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[...primaryNavItems, ...moreNavItems].map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-ink text-white dark:bg-white dark:text-ink'
                        : 'bg-surface-subtle dark:bg-surface-subtleDark text-ink dark:text-ink-dark hover:border-ink'
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
