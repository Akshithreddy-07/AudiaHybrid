import React from 'react';
import { Activity, Radio, Sun, Volume2, Wifi, Pause, Play } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Meter from '../components/Meter';
import StatChip from '../components/StatChip';
import PillButton from '../components/PillButton';

export default function Dashboard() {
  return (
    <div className="w-full flex flex-col px-4 sm:px-6 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="relative rounded-3xl hero-sky-bg p-6 sm:p-10 mb-8 overflow-hidden shadow-glass border border-white/70 dark:border-white/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-pill bg-white/60 dark:bg-black/40 border border-white/60 text-xs font-bold uppercase tracking-wider text-primary-dark dark:text-accent mb-3">
              <Activity className="w-3.5 h-3.5" /> SignalDash Real-Time Telemetry
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-primary-dark dark:text-white tracking-tight">
              Live Link <span className="font-semibold text-accent">Dashboard</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-text-primary dark:text-text-darkPrimary leading-relaxed">
              Real-time monitoring of analog RF signal strength, optical photodiode intensity, and audio
              envelope levels over WebSocket.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-status-success/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-status-success/40">
              <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse" />
              <span>Bridge Online (Simulated)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Live Telemetry Channel Shells */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <GlassCard variant="default" rounded="rounded-card" className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-text-secondary dark:text-text-darkSecondary">RF Level</span>
            <Radio className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">78.4%</div>
          <Meter label="Carrier Strength" value={78} unit="%" color="accent" showValue={false} />
          <div className="text-[11px] text-text-secondary dark:text-text-darkSecondary">Rolling 60s window active</div>
        </GlassCard>

        <GlassCard variant="default" rounded="rounded-card" className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-text-secondary dark:text-text-darkSecondary">RF RSSI</span>
            <Wifi className="w-4 h-4 text-primary-dark dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">-54 dBm</div>
          <Meter label="Signal Noise" value={68} unit="%" color="primary" showValue={false} />
          <div className="text-[11px] text-text-secondary dark:text-text-darkSecondary">Excellent SNR link</div>
        </GlassCard>

        <GlassCard variant="default" rounded="rounded-card" className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-text-secondary dark:text-text-darkSecondary">Optical Level</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">62.1%</div>
          <Meter label="Photodiode Current" value={62} unit="%" color="warning" showValue={false} />
          <div className="text-[11px] text-text-secondary dark:text-text-darkSecondary">BPW34 active detector</div>
        </GlassCard>

        <GlassCard variant="default" rounded="rounded-card" className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-text-secondary dark:text-text-darkSecondary">Audio Output</span>
            <Volume2 className="w-4 h-4 text-status-success" />
          </div>
          <div className="text-2xl font-bold text-text-primary dark:text-text-darkPrimary">71.0%</div>
          <Meter label="LM386 Envelope" value={71} unit="%" color="success" showValue={false} />
          <div className="text-[11px] text-text-secondary dark:text-text-darkSecondary">Demodulated speech</div>
        </GlassCard>
      </div>

      {/* Chart Section Placeholder */}
      <GlassCard variant="default" rounded="rounded-card" className="p-8 text-center space-y-4">
        <Activity className="w-8 h-8 text-accent mx-auto animate-pulse" />
        <h3 className="text-xl font-bold text-text-primary dark:text-text-darkPrimary">
          Live Recharts Stream Connecting in Phase 6
        </h3>
        <p className="text-sm text-text-secondary dark:text-text-darkSecondary max-w-xl mx-auto">
          In Phase 6, the real-time MQTT $\rightarrow$ Express $\rightarrow$ Socket.io pipeline will populate rolling 60-second line charts with live RF/Optical fallback triggers.
        </p>
      </GlassCard>
    </div>
  );
}
