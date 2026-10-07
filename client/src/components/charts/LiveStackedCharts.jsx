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
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { convertCount } from '../../lib/units.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function LiveStackedCharts({
  points = [],
  linkFocus = 'both',
  displayUnit = 'counts',
  yAxisMode = 'fixed',
  threshold = 20,
}) {
  // Shared X-Axis Labels (formatted as HH:MM:SS)
  const labels = useMemo(() => {
    return (points || []).map((p) => {
      if (!p?.ts) return '';
      const d = typeof p.ts === 'string' ? new Date(p.ts) : new Date(p.ts);
      return d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    });
  }, [points]);

  // Scaled Y-max based on unit and mode
  const yMax = useMemo(() => {
    if (yAxisMode === 'fixed') {
      if (displayUnit === 'percent') return 100;
      if (displayUnit === 'mv') return 3300;
      return 4095;
    }
    return undefined;
  }, [yAxisMode, displayUnit]);

  // Converted threshold value for chart display
  const convertedThreshold = useMemo(() => {
    return convertCount(threshold, displayUnit).numericValue;
  }, [threshold, displayUnit]);

  // Optical Chart Data
  const opticalData = useMemo(() => {
    const vals = (points || []).map((p) => convertCount(p?.optical ?? 0, displayUnit).numericValue);
    const thresholdLine = (points || []).map(() => convertedThreshold);

    return {
      labels,
      datasets: [
        {
          label: 'Optical Level (BPW34 / Phototransistor)',
          data: vals,
          borderColor: '#EF9F27',
          backgroundColor: '#EF9F27',
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.1,
        },
        {
          label: `Threshold (${convertedThreshold} ${displayUnit})`,
          data: thresholdLine,
          borderColor: '#EF9F27',
          borderWidth: 1,
          borderDash: [4, 4],
          pointRadius: 0,
        },
      ],
    };
  }, [points, labels, displayUnit, convertedThreshold]);

  // RF Chart Data
  const rfData = useMemo(() => {
    const vals = (points || []).map((p) => convertCount(p?.rf ?? 0, displayUnit).numericValue);
    const thresholdLine = (points || []).map(() => convertedThreshold);

    return {
      labels,
      datasets: [
        {
          label: 'RF Level (433 MHz Demodulated Carrier)',
          data: vals,
          borderColor: '#378ADD',
          backgroundColor: '#378ADD',
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.1,
        },
        {
          label: `Threshold (${convertedThreshold} ${displayUnit})`,
          data: thresholdLine,
          borderColor: '#378ADD',
          borderWidth: 1,
          borderDash: [4, 4],
          pointRadius: 0,
        },
      ],
    };
  }, [points, labels, displayUnit, convertedThreshold]);

  // Wi-Fi RSSI Chart Data
  const rssiData = useMemo(() => {
    const vals = (points || []).map((p) => Math.round(p?.rssi ?? -60));
    return {
      labels,
      datasets: [
        {
          label: 'Wi-Fi RSSI (ESP32 to router)',
          data: vals,
          borderColor: '#5DCAA5',
          backgroundColor: '#5DCAA5',
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.1,
        },
      ],
    };
  }, [points, labels]);

  // Base Chart Options (Optimized for 60 FPS without animation jank)
  const getChartOptions = (yUnit, yMinVal = 0, yMaxVal) => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#8A919A',
          font: { family: 'IBM Plex Mono', size: 10 },
          boxWidth: 10,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#151A1D',
        titleColor: '#E6E3DA',
        bodyColor: '#8A919A',
        borderColor: '#262D31',
        borderWidth: 1,
        bodyFont: { family: 'IBM Plex Mono', size: 11 },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#8A919A',
          font: { family: 'IBM Plex Mono', size: 9 },
          maxTicksLimit: 8,
        },
        grid: { color: '#1C2226' },
      },
      y: {
        min: yMinVal,
        max: yMaxVal,
        title: {
          display: true,
          text: yUnit,
          color: '#8A919A',
          font: { family: 'IBM Plex Mono', size: 9 },
        },
        ticks: {
          color: '#8A919A',
          font: { family: 'IBM Plex Mono', size: 9 },
        },
        grid: { color: '#1C2226' },
      },
    },
  });

  const showOptical = linkFocus === 'both' || linkFocus === 'optical';
  const showRf = linkFocus === 'both' || linkFocus === 'rf';

  return (
    <div className="space-y-4">
      {/* Chart 1: Optical Level */}
      {showOptical && (
        <div className="bg-[#151A1D] border border-[#262D31] rounded p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-[#EF9F27] uppercase">
              1. Optical Intensity Stream (BPW34 / PIN)
            </span>
            <span className="text-[#8A919A]">Unit: {displayUnit}</span>
          </div>
          <div className="h-44 w-full">
            <Line
              data={opticalData}
              options={getChartOptions(displayUnit, 0, yMax)}
            />
          </div>
        </div>
      )}

      {/* Chart 2: RF Level */}
      {showRf && (
        <div className="bg-[#151A1D] border border-[#262D31] rounded p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-[#378ADD] uppercase">
              2. RF Signal Strength (433 MHz Demodulated Carrier)
            </span>
            <span className="text-[#8A919A]">Unit: {displayUnit}</span>
          </div>
          <div className="h-44 w-full">
            <Line
              data={rfData}
              options={getChartOptions(displayUnit, 0, yMax)}
            />
          </div>
        </div>
      )}

      {/* Chart 3: Wi-Fi RSSI (ESP32 to router) */}
      <div className="bg-[#151A1D] border border-[#262D31] rounded p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-[#5DCAA5] uppercase">
            3. Wi-Fi RSSI (ESP32 to router)
          </span>
          <span className="text-[#8A919A]">Unit: dBm</span>
        </div>
        <div className="h-44 w-full">
          <Line
            data={rssiData}
            options={getChartOptions('dBm', -100, -30)}
          />
        </div>
      </div>
    </div>
  );
}

LiveStackedCharts.propTypes = {
  points: PropTypes.arrayOf(
    PropTypes.shape({
      ts: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      optical: PropTypes.number,
      rf: PropTypes.number,
      rssi: PropTypes.number,
    })
  ),
  linkFocus: PropTypes.oneOf(['both', 'optical', 'rf']),
  displayUnit: PropTypes.oneOf(['counts', 'percent', 'mv']),
  yAxisMode: PropTypes.oneOf(['fixed', 'auto']),
  threshold: PropTypes.number,
};
