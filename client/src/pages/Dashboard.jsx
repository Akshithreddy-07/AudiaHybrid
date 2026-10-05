import React from 'react';
import { Activity, Radio, Sun, Volume2, Wifi } from 'lucide-react';
import Card from '../components/Card';
import Meter from '../components/Meter';

export default function Dashboard() {
  return (
    <div className="w-full flex flex-col px-4 sm:px-6 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-hairline-light dark:border-hairline-dark">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-accent-lime shrink-0" />
            <span className="text-xs font-bold uppercase tracking-label text-ink dark:text-ink-dark">
              Live Hardware Telemetry
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-headline text-ink dark:text-ink-dark">
            SignalDash Dashboard
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark max-w-2xl leading-relaxed">
            Real-time monitoring of RF signal strength, optical photodiode intensity, and audio envelope levels.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-pill bg-white dark:bg-card-dark border border-hairline-light dark:border-hairline-dark shadow-subtle text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-status-ok animate-pulse" />
          <span className="text-ink dark:text-ink-dark">Bridge Live (Simulated)</span>
        </div>
      </div>

      {/* 4 Telemetry Channels (RF #2F6FED, Optical #F2A33A, Audio #0B0B0C, RSSI #2FBF71) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card variant="default" rounded="rounded-card" className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-label text-ink-secondary dark:text-ink-secondaryDark">
              RF Level
            </span>
            <Radio className="w-4 h-4 text-badge-rf" />
          </div>
          <div className="text-3xl font-semibold tracking-headline text-ink dark:text-ink-dark">
            78.4%
          </div>
          <Meter label="Carrier Strength" value={78} unit="%" color="rf" showValue={false} />
          <div className="text-[11px] text-ink-secondary dark:text-ink-secondaryDark">Rolling 60s window</div>
        </Card>

        <Card variant="default" rounded="rounded-card" className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-label text-ink-secondary dark:text-ink-secondaryDark">
              RF RSSI
            </span>
            <Wifi className="w-4 h-4 text-status-ok" />
          </div>
          <div className="text-3xl font-semibold tracking-headline text-ink dark:text-ink-dark">
            -54 dBm
          </div>
          <Meter label="Noise Floor" value={68} unit="%" color="ok" showValue={false} />
          <div className="text-[11px] text-ink-secondary dark:text-ink-secondaryDark">High SNR link</div>
        </Card>

        <Card variant="default" rounded="rounded-card" className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-label text-ink-secondary dark:text-ink-secondaryDark">
              Optical Level
            </span>
            <Sun className="w-4 h-4 text-badge-optical" />
          </div>
          <div className="text-3xl font-semibold tracking-headline text-ink dark:text-ink-dark">
            62.1%
          </div>
          <Meter label="Photodiode Current" value={62} unit="%" color="optical" showValue={false} />
          <div className="text-[11px] text-ink-secondary dark:text-ink-secondaryDark">BPW34 active detector</div>
        </Card>

        <Card variant="default" rounded="rounded-card" className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-label text-ink-secondary dark:text-ink-secondaryDark">
              Audio Output
            </span>
            <Volume2 className="w-4 h-4 text-ink dark:text-ink-dark" />
          </div>
          <div className="text-3xl font-semibold tracking-headline text-ink dark:text-ink-dark">
            71.0%
          </div>
          <Meter label="LM386 Envelope" value={71} unit="%" color="ink" showValue={false} />
          <div className="text-[11px] text-ink-secondary dark:text-ink-secondaryDark">Demodulated speech</div>
        </Card>
      </div>

      {/* Chart Roadmap Card */}
      <Card variant="default" rounded="rounded-card" className="p-8 text-center space-y-4">
        <Activity className="w-8 h-8 text-ink dark:text-ink-dark mx-auto" />
        <h3 className="text-xl font-bold tracking-headline text-ink dark:text-ink-dark">
          Real-Time Recharts Stream Connecting in Phase 6
        </h3>
        <p className="text-xs sm:text-sm text-ink-secondary dark:text-ink-secondaryDark max-w-xl mx-auto leading-relaxed">
          In Phase 6, the live MQTT broker bridge and Socket.io pipeline will populate rolling 60-second charts with dynamic link switching indicators.
        </p>
      </Card>
    </div>
  );
}
