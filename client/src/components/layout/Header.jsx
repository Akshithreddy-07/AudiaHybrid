import React from 'react';
import { NavLink } from 'react-router-dom';
import { Radio } from 'lucide-react';
import { useSensorData } from '../../hooks/useSensorData.js';

export function Header() {
  const { connection } = useSensorData();

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Telemetry', path: '/telemetry' },
    { name: 'Records', path: '/records' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header role="banner" className="w-full bg-[#0F1214] border-b border-[#262D31] text-[#E6E3DA]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Brand & Sub-Rack Identity */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-[#151A1D] border border-[#262D31] flex items-center justify-center text-[#5DCAA5]">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-[#E6E3DA] uppercase font-mono">
                AudiaHybrid
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#151A1D] border border-[#262D31] text-[#8A919A]">
                RX-CONSOLE
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#8A919A] hidden sm:block">
              25SC2008E • Dual-Medium Assistive Listening
            </div>
          </div>
        </div>

        {/* 4 Main Navigation Tabs */}
        <nav aria-label="Primary Navigation" className="flex items-center gap-1 sm:gap-2 text-xs font-mono">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded transition-colors ${
                  isActive
                    ? 'bg-[#151A1D] text-[#5DCAA5] border border-[#262D31] font-bold'
                    : 'text-[#8A919A] hover:text-[#E6E3DA] border border-transparent'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Connection Status Pill */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div
            className={`px-2.5 py-1 rounded border flex items-center gap-1.5 text-[11px] ${
              connection === 'connected'
                ? 'bg-[#5DCAA5]/10 border-[#5DCAA5]/40 text-[#5DCAA5]'
                : connection === 'reconnecting'
                ? 'bg-[#EF9F27]/10 border-[#EF9F27]/40 text-[#EF9F27]'
                : 'bg-[#E5484D]/10 border-[#E5484D]/40 text-[#E5484D]'
            }`}
            aria-live="polite"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                connection === 'connected'
                  ? 'bg-[#5DCAA5] animate-pulse'
                  : connection === 'reconnecting'
                  ? 'bg-[#EF9F27]'
                  : 'bg-[#E5484D]'
              }`}
            />
            <span className="uppercase font-bold">
              {connection === 'connected' ? 'LIVE' : connection === 'reconnecting' ? 'RECONNECTING' : 'OFFLINE'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
