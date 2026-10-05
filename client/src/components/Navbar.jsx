import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Radio,
  Sun,
  User,
  Menu,
  X,
  Settings,
  Moon,
  Check,
  LogOut,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import {
  toggleTheme,
  toggleHighContrast,
  toggleLargeText,
  selectIsDark,
  selectHighContrast,
  selectLargeText,
} from '../features/ui/uiSlice';
import {
  logout,
  selectUser,
  selectIsAuthenticated,
  selectRole,
} from '../features/auth/authSlice';
import useToast from '../hooks/useToast';
import { navLinks } from '../data/navLinks';

export default function Navbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isDark = useSelector(selectIsDark);
  const isHighContrast = useSelector(selectHighContrast);
  const isLargeText = useSelector(selectLargeText);

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectRole);

  const handleLogout = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    showToast('Successfully logged out', 'info');
  };

  const getInitials = (name) => {
    if (!name) return 'AU';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group focus:outline-none shrink-0" aria-label="AudiaHybrid Home">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
                  AudiaHybrid
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  25SC2008E
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                RF + Optical Assistive Telemetry
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
                  } ${link.highlight ? 'relative font-semibold' : ''}`}
                >
                  {link.highlight && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Hardware Telemetry Live Ping Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] font-mono font-medium text-emerald-700 dark:text-emerald-300 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>MQTT: Active</span>
          </div>

          {/* Settings & Accessibility Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setSettingsOpen((prev) => !prev);
                setUserDropdownOpen(false);
              }}
              aria-label="Display & Accessibility settings"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-64 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 space-y-2 text-xs">
                <div className="font-semibold text-slate-900 dark:text-white pb-1 border-b border-slate-100 dark:border-slate-800">
                  Display & Accessibility
                </div>

                <button
                  type="button"
                  onClick={() => dispatch(toggleTheme())}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {isDark ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <span>Dark Theme</span>
                  </div>
                  {isDark && <Check className="w-4 h-4 text-blue-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => dispatch(toggleHighContrast())}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>High Contrast</span>
                  {isHighContrast && <Check className="w-4 h-4 text-blue-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => dispatch(toggleLargeText())}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>Large Text (125%)</span>
                  {isLargeText && <Check className="w-4 h-4 text-blue-500" />}
                </button>
              </div>
            )}
          </div>

          {/* Theme Quick Toggle */}
          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle color theme"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Profile Area (Authenticated vs Guest) */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setUserDropdownOpen((prev) => !prev);
                  setSettingsOpen(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                aria-label="User account menu"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                  {getInitials(user.name)}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight truncate max-w-[100px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {userRole}
                  </span>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 space-y-2 text-xs">
                  <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {user.email}
                    </div>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      {userRole === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                      <span>Role: {userRole}</span>
                    </div>
                  </div>

                  {userRole === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                      <span>Admin Console</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <span>{link.name}</span>
                {link.highlight && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </Link>
            );
          })}
          
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {isAuthenticated && user ? (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {user.name} ({userRole})
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {user.email}
                    </div>
                  </div>
                </div>

                {userRole === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-semibold"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Open Admin Console</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Admin Console</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
