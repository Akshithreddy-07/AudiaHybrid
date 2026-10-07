import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Copy,
  Check,
  Pause,
  Play,
  Database,
  BarChart2,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useSensorData } from '../hooks/useSensorData.js';
import { useControls } from '../context/ControlsContext.jsx';
import { calculateTelemetryStats } from '../lib/stats.js';
import { convertCount } from '../lib/units.js';
import { api } from '../lib/api.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Telemetry() {
  const { points = [], status = {}, connection = 'offline', paused = false, reconnectCount = 0 } = useSensorData();
  const {
    linkFocus = 'both',
    displayUnit = 'counts',
    transport = 'socket',
    setTransport,
    togglePaused,
  } = useControls();

  const [backendHealth, setBackendHealth] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fetch backend /api/health
  useEffect(() => {
    let active = true;
    const checkHealth = async () => {
      try {
        const h = await api.getHealth();
        if (active) setBackendHealth(h);
      } catch (err) {
        if (active) setBackendHealth(null);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // Compute Statistical Diagnostics from current buffer
  const stats = useMemo(() => {
    return calculateTelemetryStats(points || []);
  }, [points]);

  // Distribution Histogram (0-4095 split into 10 buckets)
  const histogramData = useMemo(() => {
    const bucketCount = 10;
    const bucketSize = 4096 / bucketCount;
    const optBuckets = new Array(bucketCount).fill(0);
    const rfBuckets = new Array(bucketCount).fill(0);

    (points || []).forEach((p) => {
      const optIdx = Math.min(bucketCount - 1, Math.floor((p?.optical ?? 0) / bucketSize));
      const rfIdx = Math.min(bucketCount - 1, Math.floor((p?.rf ?? 0) / bucketSize));
      optBuckets[optIdx]++;
      rfBuckets[rfIdx]++;
    });

    const labels = Array.from({ length: bucketCount }, (_, i) => {
      const start = convertCount(i * bucketSize, displayUnit).valueText;
      const end = convertCount((i + 1) * bucketSize - 1, displayUnit).valueText;
      return `${start}-${end}`;
    });

    const datasets = [];
    if (linkFocus === 'both' || linkFocus === 'optical') {
      datasets.push({
        label: 'Optical Frequency',
        data: optBuckets,
        backgroundColor: '#EF9F27',
      });
    }
    if (linkFocus === 'both' || linkFocus === 'rf') {
      datasets.push({
        label: 'RF Frequency',
        data: rfBuckets,
        backgroundColor: '#378ADD',
      });
    }

    return { labels, datasets };
  }, [points, linkFocus, displayUnit]);

  // Latest 50 messages
  const rawFeed = useMemo(() => {
    return (points || []).slice(-50).reverse();
  }, [points]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(rawFeed, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isStale = status?.stale ?? true;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* 1. Pipeline Hop Diagnostic Strip */}
      <section aria-labelledby="pipeline-heading" className="bg-[#151A1D] border border-[#262D31] rounded p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262D31] pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#5DCAA5]" />
            <h2 id="pipeline-heading" className="text-xs font-mono font-bold text-[#E6E3DA] uppercase tracking-wider">
              Telemetry Transport Pipeline & Measurable Hops
            </h2>
          </div>

          {/* Transport Switch [Socket.io | SSE] */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#8A919A]">Transport:</span>
            <div className="flex rounded border border-[#262D31] bg-[#0F1214] p-0.5">
              <button
                onClick={() => setTransport('socket')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  transport === 'socket' ? 'bg-[#262D31] text-[#5DCAA5]' : 'text-[#8A919A]'
                }`}
              >
                Socket.io
              </button>
              <button
                onClick={() => setTransport('sse')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  transport === 'sse' ? 'bg-[#262D31] text-[#EF9F27]' : 'text-[#8A919A]'
                }`}
              >
                SSE Stream
              </button>
            </div>
            <span className="text-[10px] text-[#8A919A]">(Reconnects: {reconnectCount})</span>
          </div>
        </div>

        {/* 5-Hop Flow Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs font-mono">
          {/* Hop 1: ESP32 Hardware */}
          <div className="p-2.5 bg-[#0F1214] border border-[#262D31] rounded space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#E6E3DA]">1. ESP32 Node</span>
              <span className={`w-2 h-2 rounded-full ${isStale ? 'bg-[#E5484D]' : 'bg-[#5DCAA5]'}`} />
            </div>
            <div className="text-[10px] text-[#8A919A]">ADC Sampling 1 Hz</div>
            <div className="text-[10px] text-[#5DCAA5]">{isStale ? 'Stale (>5s)' : 'Active Pulse'}</div>
          </div>

          {/* Hop 2: MQTT Broker */}
          <div className="p-2.5 bg-[#0F1214] border border-[#262D31] rounded space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#E6E3DA]">2. MQTT Broker</span>
              <span className="text-[9px] px-1 bg-[#262D31] rounded text-[#8A919A]">TCP:1883</span>
            </div>
            <div className="text-[10px] text-[#8A919A]">HiveMQ Cluster</div>
            <div className="text-[10px] text-[#8A919A]">not measurable from browser</div>
          </div>

          {/* Hop 3: Node.js Backend */}
          <div className="p-2.5 bg-[#0F1214] border border-[#262D31] rounded space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#E6E3DA]">3. Express REST</span>
              <span
                className={`w-2 h-2 rounded-full ${backendHealth?.status === 'ok' ? 'bg-[#5DCAA5]' : 'bg-[#EF9F27]'}`}
              />
            </div>
            <div className="text-[10px] text-[#8A919A]">/api/health</div>
            <div className="text-[10px] text-[#5DCAA5]">
              {backendHealth ? `Up ${backendHealth.uptimeSeconds}s` : 'Offline / Proxy Standby'}
            </div>
          </div>

          {/* Hop 4: Real-time Pipe */}
          <div className="p-2.5 bg-[#0F1214] border border-[#262D31] rounded space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#E6E3DA]">4. {String(transport).toUpperCase()}</span>
              <span className={`w-2 h-2 rounded-full ${connection === 'connected' ? 'bg-[#5DCAA5]' : 'bg-[#E5484D]'}`} />
            </div>
            <div className="text-[10px] text-[#8A919A]">Channel /live</div>
            <div className="text-[10px] text-[#5DCAA5]">{String(connection).toUpperCase()}</div>
          </div>

          {/* Hop 5: Client Ring Buffer */}
          <div className="p-2.5 bg-[#0F1214] border border-[#262D31] rounded space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#E6E3DA]">5. Buffer Window</span>
              <span className="text-[10px] font-bold text-[#5DCAA5]">{points.length} pts</span>
            </div>
            <div className="text-[10px] text-[#8A919A]">Ref-backed Ring</div>
            <div className="text-[10px] text-[#5DCAA5]">{stats.messagesPerMinute} msg/min</div>
          </div>
        </div>
      </section>

      {/* 2. Pipeline Numerical Diagnostics Metric Grid */}
      <section aria-labelledby="metrics-heading" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <h2 id="metrics-heading" className="sr-only">Diagnostic Numerical Metrics</h2>

        <div className="p-3 bg-[#151A1D] border border-[#262D31] rounded space-y-1 text-xs font-mono">
          <span className="text-[#8A919A] text-[11px]">MESSAGE RATE</span>
          <div className="text-xl font-bold text-[#E6E3DA] tabular-nums">{stats.messagesPerMinute ?? 0}</div>
          <span className="text-[10px] text-[#8A919A]">msgs / minute</span>
        </div>

        <div className="p-3 bg-[#151A1D] border border-[#262D31] rounded space-y-1 text-xs font-mono">
          <span className="text-[#8A919A] text-[11px]">MEAN INTERVAL</span>
          <div className="text-xl font-bold text-[#5DCAA5] tabular-nums">{stats.meanIntervalMs ?? 0}</div>
          <span className="text-[10px] text-[#8A919A]">ms between packets</span>
        </div>

        <div className="p-3 bg-[#151A1D] border border-[#262D31] rounded space-y-1 text-xs font-mono">
          <span className="text-[#8A919A] text-[11px]">PACKET JITTER</span>
          <div className="text-xl font-bold text-[#EF9F27] tabular-nums">{stats.jitterMs ?? 0}</div>
          <span className="text-[10px] text-[#8A919A]">ms mean deviation</span>
        </div>

        <div className="p-3 bg-[#151A1D] border border-[#262D31] rounded space-y-1 text-xs font-mono">
          <span className="text-[#8A919A] text-[11px]">DROPPED GAPS</span>
          <div className="text-xl font-bold text-[#E5484D] tabular-nums">{stats.droppedIntervals ?? 0}</div>
          <span className="text-[10px] text-[#8A919A]">intervals &gt; 2.0s</span>
        </div>

        <div className="p-3 bg-[#151A1D] border border-[#262D31] rounded space-y-1 text-xs font-mono">
          <span className="text-[#8A919A] text-[11px]">OPTICAL SNR/FLOOR</span>
          <div className="text-xl font-bold text-[#EF9F27] tabular-nums">{stats.optical?.signalToFloorRatio ?? 1}x</div>
          <span className="text-[10px] text-[#8A919A]">P5 Floor: {stats.optical?.p5 ?? 0}</span>
        </div>

        <div className="p-3 bg-[#151A1D] border border-[#262D31] rounded space-y-1 text-xs font-mono">
          <span className="text-[#8A919A] text-[11px]">RF SNR/FLOOR</span>
          <div className="text-xl font-bold text-[#378ADD] tabular-nums">{stats.rf?.signalToFloorRatio ?? 1}x</div>
          <span className="text-[10px] text-[#8A919A]">P5 Floor: {stats.rf?.p5 ?? 0}</span>
        </div>
      </section>

      {/* 3. Distribution Histogram */}
      <section aria-labelledby="hist-heading" className="bg-[#151A1D] border border-[#262D31] rounded p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#262D31] pb-2">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#378ADD]" />
            <h2 id="hist-heading" className="text-xs font-mono font-bold text-[#E6E3DA] uppercase">
              Signal Level Frequency Distribution (ADC Histogram)
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8A919A]">10 Equidistant Buckets</span>
        </div>

        <div className="h-48 w-full">
          <Bar
            data={histogramData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: false,
              plugins: {
                legend: {
                  labels: { color: '#8A919A', font: { family: 'IBM Plex Mono', size: 10 } },
                },
              },
              scales: {
                x: {
                  ticks: { color: '#8A919A', font: { family: 'IBM Plex Mono', size: 9 } },
                  grid: { color: '#1C2226' },
                },
                y: {
                  ticks: { color: '#8A919A', font: { family: 'IBM Plex Mono', size: 9 } },
                  grid: { color: '#1C2226' },
                  title: { display: true, text: 'Packet Count', color: '#8A919A', font: { size: 9 } },
                },
              },
            }}
          />
        </div>
      </section>

      {/* 4. Monospace Raw Feed Table (Latest 50 Messages) */}
      <section aria-labelledby="feed-heading" className="bg-[#151A1D] border border-[#262D31] rounded p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262D31] pb-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#5DCAA5]" />
            <h2 id="feed-heading" className="text-xs font-mono font-bold text-[#E6E3DA] uppercase">
              Latest 50 Discrete Packets Raw Ingestion Feed
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={togglePaused}
              className="px-2.5 py-1 text-xs font-mono rounded bg-[#0F1214] border border-[#262D31] text-[#E6E3DA] hover:bg-[#1C2226] flex items-center gap-1.5"
            >
              {paused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              <span>{paused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              onClick={handleCopyJson}
              className="px-2.5 py-1 text-xs font-mono rounded bg-[#0F1214] border border-[#262D31] text-[#E6E3DA] hover:bg-[#1C2226] flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3 h-3 text-[#5DCAA5]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy as JSON'}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-64 overflow-y-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#262D31] text-[#8A919A] sticky top-0 bg-[#151A1D]">
                <th className="py-1.5 px-3">Timestamp (ISO)</th>
                <th className="py-1.5 px-3">Device ID</th>
                <th className="py-1.5 px-3 text-[#EF9F27]">Optical Level</th>
                <th className="py-1.5 px-3 text-[#378ADD]">RF Level</th>
                <th className="py-1.5 px-3 text-[#5DCAA5]">Wi-Fi RSSI (ESP32 to router)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2226] text-[#E6E3DA]">
              {rawFeed.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#8A919A]">
                    No discrete telemetry packets currently buffered.
                  </td>
                </tr>
              ) : (
                rawFeed.map((r, idx) => (
                  <tr key={`${r.ts}-${idx}`} className="hover:bg-[#1C2226]/50">
                    <td className="py-1 px-3 text-[#8A919A] whitespace-nowrap text-[11px]">
                      {typeof r.ts === 'string' ? r.ts : new Date(r.ts).toISOString()}
                    </td>
                    <td className="py-1 px-3 text-[11px] text-[#8A919A]">{r.deviceId || 'ESP32-NODE-01'}</td>
                    <td className="py-1 px-3 font-semibold text-[#EF9F27] tabular-nums">
                      {convertCount(r.optical, displayUnit).valueText} {convertCount(r.optical, displayUnit).unitText}
                    </td>
                    <td className="py-1 px-3 font-semibold text-[#378ADD] tabular-nums">
                      {convertCount(r.rf, displayUnit).valueText} {convertCount(r.rf, displayUnit).unitText}
                    </td>
                    <td className="py-1 px-3 text-[#5DCAA5] tabular-nums">{Math.round(r.rssi ?? -60)} dBm</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
