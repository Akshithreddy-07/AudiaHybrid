import React, { useState } from 'react';
import {
  Activity,
  Radio,
  Sun,
  Volume2,
  Wifi,
  Pause,
  Play,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import TelemetryMeter from '../components/TelemetryMeter';

export default function Dashboard() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Stream Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              SignalDash Real-Time Telemetry Pipeline
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Live Telemetry Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            MQTT → Express → Socket.io live streaming console for analog RF, optical intensity, and audio levels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsPaused((prev) => !prev)}
            variant={isPaused ? 'success' : 'outline'}
            size="sm"
            icon={isPaused ? Play : Pause}
          >
            {isPaused ? 'Resume Stream' : 'Pause Stream'}
          </Button>
          <Badge variant="hybrid" size="lg" dot>
            HYBRID ACTIVE
          </Badge>
        </div>
      </div>

      {/* 4 Telemetry Channel Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Channel 1: RF Level */}
        <Card variant="default" className="border-t-4 border-t-blue-500 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">CHANNEL 01 • RF LEVEL</span>
            <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Radio className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              78.4
            </span>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">%</span>
          </div>
          <TelemetryMeter value={78.4} color="rf" showValue={false} />
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Peak: 86.2%</span>
            <span>Min: 64.0%</span>
          </div>
        </Card>

        {/* Channel 2: RF RSSI */}
        <Card variant="default" className="border-t-4 border-t-emerald-500 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">CHANNEL 02 • RF RSSI</span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wifi className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              -54
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">dBm</span>
          </div>
          <TelemetryMeter value={68} color="audio" showValue={false} />
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Floor: -92 dBm</span>
            <span>SNR: +38 dB</span>
          </div>
        </Card>

        {/* Channel 3: Optical Level */}
        <Card variant="default" className="border-t-4 border-t-amber-500 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">CHANNEL 03 • OPTICAL LEVEL</span>
            <div className="w-6 h-6 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sun className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              62.1
            </span>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">%</span>
          </div>
          <TelemetryMeter value={62.1} color="optical" showValue={false} />
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Peak: 94.5%</span>
            <span>BPW34 PIN</span>
          </div>
        </Card>

        {/* Channel 4: Audio Level */}
        <Card variant="default" className="border-t-4 border-t-purple-500 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">CHANNEL 04 • AUDIO ENVELOPE</span>
            <div className="w-6 h-6 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Volume2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              71.0
            </span>
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">%</span>
          </div>
          <TelemetryMeter value={71.0} color="hybrid" showValue={false} />
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>LM386 Output: 0.7V</span>
            <span>THD: &lt;1.2%</span>
          </div>
        </Card>

      </div>

      {/* Real-Time Waveform / Recharts Streaming Container */}
      <Card variant="default" className="p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Rolling 60-Second Multi-Channel Stream
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">Sample Rate: 1 Hz (MQTT Bridge)</span>
        </div>

        {/* Visual Chart Placeholder Canvas */}
        <div className="h-64 sm:h-72 w-full rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <Activity className="w-8 h-8 text-brand-500 animate-pulse" />
          <div className="space-y-1 max-w-md">
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Live Recharts Connection Establishing in Phase 6
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              When the Phase 6 pipeline is initialized, real-time Socket.io messages on rooms <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">rf_level</code>, <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">optical_level</code>, and <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">audio_level</code> will stream dynamic line plots here.
            </p>
          </div>
        </div>

        {/* Stream Metrics Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs font-mono">
          <div>
            <span className="text-slate-500">Broker:</span> <span className="font-bold text-slate-900 dark:text-white">broker.hivemq.com</span>
          </div>
          <div>
            <span className="text-slate-500">Protocol:</span> <span className="font-bold text-slate-900 dark:text-white">MQTT over TCP (1883)</span>
          </div>
          <div>
            <span className="text-slate-500">WebSocket:</span> <span className="font-bold text-emerald-600">Socket.io Connected</span>
          </div>
          <div>
            <span className="text-slate-500">DB Batch:</span> <span className="font-bold text-slate-900 dark:text-white">5s Interval (pg)</span>
          </div>
        </div>
      </Card>

    </div>
  );
}
