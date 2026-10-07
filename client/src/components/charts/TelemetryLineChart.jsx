import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js core components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * High-Precision Technical Telemetry Line Chart
 * Designed to look like a hardware oscilloscope trace with threshold limits and grid markings.
 */
export default function TelemetryLineChart({
  title,
  subtitle,
  points = [],
  dataKey = 'opticalMv',
  color = '#EF9F27',
  unit = 'mV',
  minY = 0,
  maxY = 650,
  threshold = null,
  thresholdLabel = 'Threshold',
  height = 190,
  isDark = true,
}) {
  const chartData = useMemo(() => {
    const labels = points.map((p, idx) => {
      const remaining = points.length - 1 - idx;
      return remaining === 0 ? 'Now' : `-${remaining}s`;
    });

    const values = points.map((p) => (p[dataKey] !== undefined ? p[dataKey] : null));

    const datasets = [
      {
        label: `${title} (${unit})`,
        data: values,
        borderColor: color,
        backgroundColor: `${color}18`,
        borderWidth: 1.75,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.15,
        fill: true,
      },
    ];

    // Optional horizontal threshold line dataset
    if (threshold !== null) {
      datasets.push({
        label: `${thresholdLabel} (${threshold} ${unit})`,
        data: points.map(() => threshold),
        borderColor: '#E5484D',
        borderWidth: 1.25,
        borderDash: [4, 4],
        pointRadius: 0,
        fill: false,
      });
    }

    return { labels, datasets };
  }, [points, dataKey, color, title, unit, threshold, thresholdLabel]);

  const options = useMemo(() => {
    const gridColor = isDark ? 'rgba(38, 45, 49, 0.7)' : 'rgba(217, 212, 199, 0.7)';
    const textColor = isDark ? '#8A919A' : '#5B6068';

    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: false, // Pure real-time instrumentation rendering without lag
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 10,
            boxHeight: 2,
            color: textColor,
            font: {
              family: '"IBM Plex Mono", Menlo, monospace',
              size: 10,
            },
            padding: 8,
          },
        },
        tooltip: {
          backgroundColor: isDark ? '#1C2226' : '#FFFFFF',
          titleColor: isDark ? '#E6E3DA' : '#14181C',
          bodyColor: isDark ? '#E6E3DA' : '#14181C',
          borderColor: isDark ? '#262D31' : '#D9D4C7',
          borderWidth: 1,
          padding: 8,
          titleFont: { family: '"IBM Plex Mono", monospace', size: 10 },
          bodyFont: { family: '"IBM Plex Mono", monospace', size: 11, weight: 'bold' },
          displayColors: false,
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} ${unit}`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: gridColor,
            drawTicks: false,
          },
          ticks: {
            color: textColor,
            font: { family: '"IBM Plex Mono", monospace', size: 9 },
            maxTicksLimit: 6,
          },
        },
        y: {
          min: minY,
          max: maxY,
          grid: {
            color: gridColor,
            drawTicks: false,
          },
          ticks: {
            color: textColor,
            font: { family: '"IBM Plex Mono", monospace', size: 9 },
            callback: (val) => `${val} ${unit}`,
            stepSize: (maxY - minY) / 4,
          },
        },
      },
    };
  }, [isDark, minY, maxY, unit]);

  return (
    <div className="w-full bg-[#151A1D] dark:bg-[#151A1D] border border-[#262D31] rounded-[4px] p-4 flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#262D31] gap-1">
        <div>
          <h3 className="text-xs font-semibold text-[#E6E3DA] font-mono tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-[#8A919A]">
              {subtitle}
            </p>
          )}
        </div>
        <div className="text-[10px] font-mono text-[#8A919A]">
          WINDOW: 60 s • RATE: 1 Hz
        </div>
      </div>

      <div style={{ height: `${height}px` }} className="relative w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

TelemetryLineChart.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  points: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataKey: PropTypes.string.isRequired,
  color: PropTypes.string,
  unit: PropTypes.string,
  minY: PropTypes.number,
  maxY: PropTypes.number,
  threshold: PropTypes.number,
  thresholdLabel: PropTypes.string,
  height: PropTypes.number,
  isDark: PropTypes.bool,
};
