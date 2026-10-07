import React, { useRef, useEffect } from 'react';
import { Radio, Sun, Wifi, Cpu, ArrowRightLeft, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAudiaLive } from '../hooks/useAudiaLive.js';

export function LiveHardwarePanel() {
  const { brokerUp, deviceOnline, latest, history } = useAudiaLive();
  const canvasRef = useRef(null);

  const optical = latest?.optical ?? 0;
  const rf = latest?.rf ?? 0;
  const rssi = latest?.rssi ?? 0;
  const optOk = latest ? latest.opt_ok : false;
  const rfOk = latest ? latest.rf_ok : false;
  const preferred = latest?.preferred || 'optical';
  const active = latest?.active || (deviceOnline ? 'none' : 'none');

  // Mini live chart rendering on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Background grid line (threshold level ~300 in sim or ~40 in hardware)
    ctx.strokeStyle = '#262D31';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    const threshY = height - (300 / 4095) * (height - 12) - 6;
    ctx.beginPath();
    ctx.moveTo(0, threshY);
    ctx.lineTo(width, threshY);
    ctx.stroke();
    ctx.setLineDash([]);

    if (!history || history.length < 2) {
      ctx.fillStyle = '#5B6068';
      ctx.font = '11px monospace';
      ctx.fillText('Awaiting live telemetry packets...', 10, height / 2 + 4);
      return;
    }

    const maxVal = 4095;
    const pointsCount = history.length;

    // 1. Draw Optical Series (#EF9F27)
    ctx.strokeStyle = '#EF9F27';
    ctx.lineWidth = 2;
    ctx.beginPath();
    history.forEach((pt, idx) => {
      const x = (idx / (MAX_CANVAS_POINTS - 1)) * width;
      const normalized = Math.min(Math.max((pt.optical || 0) / maxVal, 0), 1);
      const y = height - normalized * (height - 12) - 6;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 2. Draw RF Series (#378ADD)
    ctx.strokeStyle = '#378ADD';
    ctx.lineWidth = 2;
    ctx.beginPath();
    history.forEach((pt, idx) => {
      const x = (idx / (MAX_CANVAS_POINTS - 1)) * width;
      const normalized = Math.min(Math.max((pt.rf || 0) / maxVal, 0), 1);
      const y = height - normalized * (height - 12) - 6;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [history]);

  const MAX_CANVAS_POINTS = 60;

  return (
    <section
      aria-label="Live Hardware Link Monitor"
      className="bg-[#151A1D] border border-[#262D31] rounded-lg p-4 sm:p-5 space-y-4 shadow-lg shadow-black/20"
    >
      {/* Header with status badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#262D31]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-[#1C2226] border border-[#262D31] text-[#5DCAA5]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-[#E6E3DA] tracking-tight">
                Live ESP32 Hardware Link
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1C2226] text-[#8A919A] border border-[#262D31]">
                MQTT 500ms
              </span>
            </div>
            <p className="text-xs text-[#8A919A]">
              Direct WSS connection to HiveMQ broker • Live telemetry & failover switch
            </p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2">
          {/* Broker Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium border ${
              brokerUp
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                : 'bg-rose-950/40 text-rose-400 border-rose-800/60'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                brokerUp ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            {brokerUp ? 'Broker Connected' : 'Broker Disconnected'}
          </span>

          {/* Device Online Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium border ${
              deviceOnline
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                : 'bg-zinc-900 text-zinc-400 border-zinc-700/60'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                deviceOnline ? 'bg-emerald-400' : 'bg-zinc-500'
              }`}
            />
            {deviceOnline ? 'ESP32 Online' : 'ESP32 Offline'}
          </span>
        </div>
      </div>

      {/* Main Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Card 1: Active Output Link */}
        <div className="bg-[#101416] border border-[#262D31] rounded p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[#8A919A] text-xs font-mono uppercase">
            <span>Active Channel</span>
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-baseline justify-between">
            <span
              className={`text-2xl font-mono font-bold uppercase tracking-tight ${
                active === 'optical'
                  ? 'text-[#EF9F27]'
                  : active === 'rf'
                  ? 'text-[#378ADD]'
                  : 'text-rose-400'
              }`}
            >
              {active}
            </span>
            <span className="text-[11px] font-mono text-[#8A919A]">
              Pref: {preferred.toUpperCase()}
            </span>
          </div>
          <div className="text-[11px] font-mono text-[#8A919A] pt-1 border-t border-[#1C2226] flex items-center justify-between">
            <span>Failover State:</span>
            <span className={active === preferred ? 'text-[#5DCAA5]' : 'text-amber-400'}>
              {active === preferred ? 'Normal (Primary)' : active === 'none' ? 'Dead (No Link)' : 'Failover Active'}
            </span>
          </div>
        </div>

        {/* Card 2: Optical Sensor (ADC 34) */}
        <div className="bg-[#101416] border border-[#262D31] border-l-4 border-l-[#EF9F27] rounded p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[#8A919A] text-xs font-mono uppercase">
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-[#EF9F27]" />
              Optical Link (GPIO34)
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                optOk
                  ? 'bg-[#EF9F27]/15 text-[#EF9F27] border border-[#EF9F27]/30'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {optOk ? 'ALIVE' : 'DEAD'}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-[#E6E3DA] tabular-nums">
              {latest ? optical : '---'}
            </span>
            <span className="text-xs font-mono text-[#8A919A]">0-4095 ADC</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#1C2226] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#EF9F27] h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (optical / 4095) * 100)}%` }}
            />
          </div>
        </div>

        {/* Card 3: RF Sensor (ADC 35) */}
        <div className="bg-[#101416] border border-[#262D31] border-l-4 border-l-[#378ADD] rounded p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[#8A919A] text-xs font-mono uppercase">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[#378ADD]" />
              RF Link (GPIO35)
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                rfOk
                  ? 'bg-[#378ADD]/15 text-[#378ADD] border border-[#378ADD]/30'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {rfOk ? 'ALIVE' : 'DEAD'}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-[#E6E3DA] tabular-nums">
              {latest ? rf : '---'}
            </span>
            <span className="text-xs font-mono text-[#8A919A]">0-4095 ADC</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#1C2226] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#378ADD] h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (rf / 4095) * 100)}%` }}
            />
          </div>
        </div>

        {/* Card 4: Wi-Fi RSSI */}
        <div className="bg-[#101416] border border-[#262D31] border-l-4 border-l-[#8A919A] rounded p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[#8A919A] text-xs font-mono uppercase">
            <span className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-[#8A919A]" />
              Wi-Fi RSSI
            </span>
            <span className="text-[10px] font-mono text-[#8A919A]">ESP32 STA</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-[#E6E3DA] tabular-nums">
              {latest ? `${rssi} dBm` : '---'}
            </span>
            <span className="text-xs font-mono text-[#5DCAA5]">
              {rssi >= -65 ? 'Good' : rssi >= -80 ? 'Fair' : 'Weak'}
            </span>
          </div>
          {/* RSSI bar */}
          <div className="w-full bg-[#1C2226] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#5DCAA5] h-full transition-all duration-300"
              style={{
                width: `${Math.max(0, Math.min(100, ((rssi + 100) / 70) * 100))}%`,
              }}
            />
          </div>
        </div>

      </div>

      {/* Small live chart showing rolling 60 points */}
      <div className="bg-[#101416] border border-[#262D31] rounded p-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#8A919A]">
          <span className="font-semibold text-[#E6E3DA]">
            Live Link Flux Real-Time Stream (Last {history.length} / 60 Samples)
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#EF9F27]">
              <span className="w-2.5 h-0.5 bg-[#EF9F27] rounded" /> Optical Level
            </span>
            <span className="flex items-center gap-1.5 text-[#378ADD]">
              <span className="w-2.5 h-0.5 bg-[#378ADD] rounded" /> RF Level
            </span>
            <span className="text-[10px] text-[#5B6068]">Dashed = Alive Threshold (300/40)</span>
          </div>
        </div>

        <div className="w-full h-20 relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={80}
            className="w-full h-full block rounded bg-[#0D1012]"
          />
        </div>
      </div>
    </section>
  );
}
