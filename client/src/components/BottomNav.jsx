import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Home,
  Cpu,
  ArrowLeftRight,
  Activity,
  MoreHorizontal,
  Compass,
  History,
  Boxes,
  MessageSquare,
  User,
  Shield,
  X,
} from 'lucide-react';
import RoundIconButton from './RoundIconButton';
import ThemeToggle from './ThemeToggle';
import AccessibilityPopover from './AccessibilityPopover';
import GlassCard from './GlassCard';

export default function BottomNav() {
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Top 4 mobile quick links + "More"
  const quickItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Architecture', path: '/architecture', icon: Cpu },
    { name: 'Comparison', path: '/comparison', icon: ArrowLeftRight },
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
  ];

  const moreItems = [
    { name: 'Applications', path: '/applications', icon: Compass },
    { name: 'History', path: '/history', icon: History },
    { name: 'Bill of Materials', path: '/bom', icon: Boxes },
    { name: 'Feedback', path: '/feedback', icon: MessageSquare },
    { name: 'Admin Console', path: '/admin', icon: Shield },
    { name: 'Account / Login', path: '/login', icon: User },
  ];

  return (
    <>
      {/* Floating Bottom Nav Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md select-none"
      >
        <div className="glass-panel rounded-pill px-4 py-2 flex items-center justify-between shadow-2xl border-white/70 dark:border-white/20 backdrop-blur-glass">
          {quickItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <RoundIconButton
                key={item.path}
                icon={item.icon}
                to={item.path}
                active={isActive}
                size="md"
                ariaLabel={`Navigate to ${item.name}`}
                title={item.name}
                className={
                  isActive
                    ? 'shadow-md'
                    : 'text-text-primary dark:text-text-darkPrimary'
                }
              />
            );
          })}

          {/* More Action Button */}
          <RoundIconButton
            icon={isMoreOpen ? X : MoreHorizontal}
            onClick={() => setIsMoreOpen((prev) => !prev)}
            active={isMoreOpen}
            size="md"
            ariaLabel="Open navigation menu"
            title="More pages"
            className="text-text-primary dark:text-text-darkPrimary"
          />
        </div>
      </nav>

      {/* Slide-up Glass Sheet for Extra Links */}
      {isMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md">
            <GlassCard
              variant="default"
              rounded="rounded-3xl"
              className="p-6 shadow-2xl border-2 border-white/60 dark:border-white/20 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
                <h3 className="text-base font-bold text-text-primary dark:text-text-darkPrimary">
                  Navigation & Settings
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMoreOpen(false)}
                  className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary dark:text-text-darkSecondary"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {moreItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMoreOpen(false)}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-primary-dark text-white font-bold shadow-md'
                          : 'bg-white/40 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 text-text-primary dark:text-text-darkPrimary'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-accent" />
                      <span className="text-xs font-semibold truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Utility Toggles Row */}
              <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10">
                <span className="text-xs font-medium text-text-secondary dark:text-text-darkSecondary">
                  Theme & Accessibility
                </span>
                <div className="flex items-center gap-2">
                  <AccessibilityPopover size="sm" />
                  <ThemeToggle size="sm" />
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </>
  );
}
