import React, { useState, useMemo } from 'react';
import {
  Database,
  Download,
  AlertCircle,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useHistory } from '../hooks/useHistory.js';
import { useControls } from '../context/ControlsContext.jsx';
import { convertCount } from '../lib/units.js';
import { generateCsv, downloadCsv } from '../lib/csv.js';
import { calculateTelemetryStats } from '../lib/stats.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Records() {
  const { displayUnit = 'counts', threshold = 20 } = useControls();

  const [presetRange, setPresetRange] = useState('24h');
  const [bucketSize, setBucketSize] = useState(60);
  const [onlyActive, setOnlyActive] = useState(false);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState('ts');
  const [sortOrder, setSortOrder] = useState('desc');

  const hoursQuery = presetRange === '7d' ? 168 : presetRange === '24h' ? 24 : 1;

  const { data: rawData = [], loading, error, refetch } = useHistory({
    hours: hoursQuery,
    bucketSeconds: bucketSize,
  });

  // Filter only active periods if checked
  const filteredData = useMemo(() => {
    let list = rawData || [];
    if (onlyActive) {
      list = list.filter((p) => (p?.optical ?? 0) >= threshold || (p?.rf ?? 0) >= threshold);
    }
    return list;
  }, [rawData, onlyActive, threshold]);

  // Statistics summary strip
  const stats = useMemo(() => {
    return calculateTelemetryStats(filteredData);
  }, [filteredData]);

  // Active time percentages
  const activeMetrics = useMemo(() => {
    if (filteredData.length === 0) return { optPct: 0, rfPct: 0, dropouts: 0 };
    const optCount = filteredData.filter((p) => (p?.optical ?? 0) >= threshold).length;
    const rfCount = filteredData.filter((p) => (p?.rf ?? 0) >= threshold).length;
    const dropCount = filteredData.filter((p) => (p?.optical ?? 0) < threshold && (p?.rf ?? 0) < threshold).length;
    return {
      optPct: Math.round((optCount / filteredData.length) * 100),
      rfPct: Math.round((rfCount / filteredData.length) * 100),
      dropouts: dropCount,
    };
  }, [filteredData, threshold]);

  // Sorted data for Table
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let valA = a?.[sortField];
      let valB = b?.[sortField];

      if (sortField === 'ts') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortOrder]);

  // Pagination (50 rows per page)
  const pageSize = 50;
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const pageRows = sortedData.slice((page - 1) * pageSize, page * pageSize);

  // Chart Data
  const chartData = useMemo(() => {
    const labels = filteredData.map((d) => {
      const date = new Date(d.ts || 0);
      return presetRange === '7d'
        ? `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`
        : date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' });
    });

    const optVals = filteredData.map((d) => convertCount(d?.optical ?? 0, displayUnit).numericValue);
    const rfVals = filteredData.map((d) => convertCount(d?.rf ?? 0, displayUnit).numericValue);

    return {
      labels,
      datasets: [
        {
          label: 'Optical Level',
          data: optVals,
          borderColor: '#EF9F27',
          backgroundColor: '#EF9F27',
          borderWidth: 1.5,
          pointRadius: 0,
        },
        {
          label: 'RF Level',
          data: rfVals,
          borderColor: '#378ADD',
          backgroundColor: '#378ADD',
          borderWidth: 1.5,
          pointRadius: 0,
        },
      ],
    };
  }, [filteredData, presetRange, displayUnit]);

  const handleExportCsv = () => {
    if (filteredData.length === 0) return;
    const csvStr = generateCsv(filteredData, displayUnit);
    downloadCsv(csvStr, `audiahv-records-${presetRange}`);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* 1. Header & Filters Toolbar */}
      <section aria-labelledby="records-heading" className="bg-[#151A1D] border border-[#262D31] rounded p-4 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#262D31] pb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#8A919A] tracking-wider uppercase">
              <Database className="w-4 h-4 text-[#378ADD]" />
              <span>Historical Query Engine • PostgreSQL Archive</span>
            </div>
            <h1 id="records-heading" className="text-xl sm:text-2xl font-bold font-mono text-[#E6E3DA] mt-0.5">
              Time-Series Records & Aggregated Archives
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Range Presets */}
            <div className="flex rounded border border-[#262D31] bg-[#0F1214] p-0.5">
              {['1h', '24h', '7d'].map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setPresetRange(r);
                    setPage(1);
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                    presetRange === r ? 'bg-[#262D31] text-[#E6E3DA]' : 'text-[#8A919A]'
                  }`}
                >
                  {r === '1h' ? 'Last Hour' : r === '24h' ? '24 Hours' : '7 Days'}
                </button>
              ))}
            </div>

            {/* Bucket Size Selector */}
            <select
              value={bucketSize}
              onChange={(e) => {
                setBucketSize(Number(e.target.value));
                setPage(1);
              }}
              className="px-2.5 py-1 bg-[#0F1214] border border-[#262D31] rounded text-[#E6E3DA] focus:outline-none"
              aria-label="Bucket resolution"
            >
              <option value={1}>1 s (Raw)</option>
              <option value={10}>10 s Bucket</option>
              <option value={60}>1 min Bucket</option>
              <option value={300}>5 min Bucket</option>
            </select>

            {/* Active Link Only Toggle */}
            <label className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0F1214] border border-[#262D31] rounded cursor-pointer text-[#8A919A] hover:text-[#E6E3DA]">
              <input
                type="checkbox"
                checked={onlyActive}
                onChange={(e) => setOnlyActive(e.target.checked)}
                className="accent-[#5DCAA5]"
              />
              <span>Active Links Only</span>
            </label>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCsv}
              disabled={filteredData.length === 0}
              className="px-3 py-1 bg-[#262D31] border border-[#262D31] text-[#E6E3DA] hover:bg-[#1C2226] rounded flex items-center gap-1.5 disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5 text-[#5DCAA5]" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-2.5 bg-[#0F1214] border border-[#262D31] rounded">
            <span className="text-[#8A919A] block text-[10px]">RECORD COUNT</span>
            <span className="text-base font-bold text-[#E6E3DA] tabular-nums">{filteredData.length}</span>
          </div>
          <div className="p-2.5 bg-[#0F1214] border border-[#262D31] rounded">
            <span className="text-[#8A919A] block text-[10px]">OPTICAL MEAN</span>
            <span className="text-base font-bold text-[#EF9F27] tabular-nums">{stats.optical?.mean ?? 0}</span>
          </div>
          <div className="p-2.5 bg-[#0F1214] border border-[#262D31] rounded">
            <span className="text-[#8A919A] block text-[10px]">RF MEAN</span>
            <span className="text-base font-bold text-[#378ADD] tabular-nums">{stats.rf?.mean ?? 0}</span>
          </div>
          <div className="p-2.5 bg-[#0F1214] border border-[#262D31] rounded">
            <span className="text-[#8A919A] block text-[10px]">OPTICAL UPTIME</span>
            <span className="text-base font-bold text-[#EF9F27] tabular-nums">{activeMetrics.optPct ?? 0}%</span>
          </div>
          <div className="p-2.5 bg-[#0F1214] border border-[#262D31] rounded">
            <span className="text-[#8A919A] block text-[10px]">RF UPTIME</span>
            <span className="text-base font-bold text-[#378ADD] tabular-nums">{activeMetrics.rfPct ?? 0}%</span>
          </div>
          <div className="p-2.5 bg-[#0F1214] border border-[#262D31] rounded">
            <span className="text-[#8A919A] block text-[10px]">TOTAL DROPOUTS</span>
            <span className="text-base font-bold text-[#E5484D] tabular-nums">{activeMetrics.dropouts ?? 0}</span>
          </div>
        </div>
      </section>

      {/* 2. Optical vs RF Historical Comparison Chart */}
      <section aria-labelledby="hist-chart-title" className="bg-[#151A1D] border border-[#262D31] rounded p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#262D31] pb-2 text-xs font-mono">
          <h2 id="hist-chart-title" className="font-bold text-[#E6E3DA] uppercase">
            Optical vs. RF Multi-Hour Comparison Plot
          </h2>
          <span className="text-[#8A919A]">Unit: {displayUnit}</span>
        </div>

        <div className="h-64 w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs font-mono text-[#8A919A]">
              Loading historical readings from PostgreSQL archive...
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-xs font-mono text-[#E5484D] space-y-2">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => refetch()}
                className="px-3 py-1 bg-[#262D31] text-[#E6E3DA] rounded hover:bg-[#1C2226]"
              >
                Retry Request
              </button>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs font-mono text-[#8A919A]">
              No readings in this range.
            </div>
          ) : (
            <Line
              data={chartData}
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
                    ticks: { color: '#8A919A', font: { family: 'IBM Plex Mono', size: 9 }, maxTicksLimit: 12 },
                    grid: { color: '#1C2226' },
                  },
                  y: {
                    ticks: { color: '#8A919A', font: { family: 'IBM Plex Mono', size: 9 } },
                    grid: { color: '#1C2226' },
                  },
                },
              }}
            />
          )}
        </div>
      </section>

      {/* 3. Paginated Historical Data Table */}
      <section aria-labelledby="table-title" className="bg-[#151A1D] border border-[#262D31] rounded p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262D31] pb-2 text-xs font-mono">
          <h2 id="table-title" className="font-bold text-[#E6E3DA] uppercase">
            Tabular Reading Archive (Page {page} of {totalPages})
          </h2>
          <span className="text-[#8A919A]">Capped at 10,000 rows max buffer</span>
        </div>

        <div className="overflow-x-auto max-h-72 overflow-y-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#262D31] text-[#8A919A] sticky top-0 bg-[#151A1D]">
                <th
                  onClick={() => handleSort('ts')}
                  className="py-1.5 px-3 cursor-pointer hover:text-[#E6E3DA]"
                >
                  Timestamp {sortField === 'ts' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="py-1.5 px-3">Device</th>
                <th
                  onClick={() => handleSort('optical')}
                  className="py-1.5 px-3 text-[#EF9F27] cursor-pointer hover:underline"
                >
                  Optical ({displayUnit}) {sortField === 'optical' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('rf')}
                  className="py-1.5 px-3 text-[#378ADD] cursor-pointer hover:underline"
                >
                  RF ({displayUnit}) {sortField === 'rf' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('rssi')}
                  className="py-1.5 px-3 text-[#5DCAA5] cursor-pointer hover:underline"
                >
                  Wi-Fi RSSI (ESP32 to router) {sortField === 'rssi' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2226] text-[#E6E3DA]">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#8A919A]">
                    No historical records available.
                  </td>
                </tr>
              ) : (
                pageRows.map((r, i) => (
                  <tr key={`${r.ts}-${i}`} className="hover:bg-[#1C2226]/50">
                    <td className="py-1 px-3 text-[#8A919A] whitespace-nowrap text-[11px]">
                      {r.ts ? new Date(r.ts).toLocaleString([], { hour12: false }) : '—'}
                    </td>
                    <td className="py-1 px-3 text-[11px] text-[#8A919A]">{r.deviceId || 'ESP32-NODE-01'}</td>
                    <td className="py-1 px-3 font-semibold text-[#EF9F27] tabular-nums">
                      {convertCount(r.optical, displayUnit).valueText}
                    </td>
                    <td className="py-1 px-3 font-semibold text-[#378ADD] tabular-nums">
                      {convertCount(r.rf, displayUnit).valueText}
                    </td>
                    <td className="py-1 px-3 text-[#5DCAA5] tabular-nums">{Math.round(r.rssi ?? -60)} dBm</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-[#262D31] text-xs font-mono">
          <span className="text-[#8A919A]">
            Showing {sortedData.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, sortedData.length)} of {sortedData.length} records
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-2.5 py-1 rounded bg-[#0F1214] border border-[#262D31] text-[#E6E3DA] hover:bg-[#1C2226] disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-2 text-[#8A919A]">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-2.5 py-1 rounded bg-[#0F1214] border border-[#262D31] text-[#E6E3DA] hover:bg-[#1C2226] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
