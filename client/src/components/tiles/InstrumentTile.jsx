import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { convertCount, formatRssi } from '../../lib/units.js';

export function InstrumentTile({
  channel,
  title,
  icon: Icon,
  rawValue = null,
  displayUnit = 'counts',
  linkStatus = 'NONE',
  isStale = false,
  lastUpdatedAgeSeconds = 0,
  historySparkline = [],
  linkFocus = 'both',
  threshold = 20,
}) {
  const sparklineCanvasRef = useRef(null);

  // Determine if this tile is dimmed by link focus
  const isDimmed =
    (linkFocus === 'optical' && channel === 'rf') ||
    (linkFocus === 'rf' && channel === 'optical');

  // Determine channel accent colors
  let accentColor = '#5DCAA5';
  let borderLeftClass = 'border-l-[#5DCAA5]';
  if (channel === 'optical') {
    accentColor = '#EF9F27';
    borderLeftClass = 'border-l-[#EF9F27]';
  } else if (channel === 'rf') {
    accentColor = '#378ADD';
    borderLeftClass = 'border-l-[#378ADD]';
  } else if (channel === 'rssi') {
    accentColor = '#8A919A';
    borderLeftClass = 'border-l-[#8A919A]';
  }

  // Draw miniature sparkline
  useEffect(() => {
    const canvas = sparklineCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (!historySparkline || historySparkline.length < 2 || isStale) {
      ctx.strokeStyle = '#262D31';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      return;
    }

    const minVal = Math.min(...historySparkline, 0);
    const maxVal = Math.max(...historySparkline, 4095);
    const range = maxVal - minVal || 1;

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    for (let i = 0; i < historySparkline.length; i++) {
      const x = (i / (historySparkline.length - 1)) * width;
      const normalized = ((historySparkline[i] ?? 0) - minVal) / range;
      const y = height - normalized * (height - 4) - 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [historySparkline, isStale, accentColor]);

  // Formatted main value and units
  let valueText = '---';
  let unitText = '';
  if (channel === 'rssi') {
    const formatted = formatRssi(rawValue);
    valueText = formatted.valueText;
    unitText = formatted.unitText;
  } else if (channel === 'link') {
    valueText = (linkStatus || 'NONE').toUpperCase();
    unitText = linkStatus && linkStatus !== 'none' ? 'ACTIVE' : 'NO LINK';
  } else {
    const formatted = convertCount(rawValue, displayUnit);
    valueText = formatted.valueText;
    unitText = formatted.unitText;
  }

  return (
    <article
      className={`bg-[#151A1D] border border-[#262D31] border-l-4 ${borderLeftClass} rounded p-4 space-y-3 transition-opacity ${
        isDimmed ? 'opacity-30' : 'opacity-100'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono tracking-wider text-[#8A919A] uppercase">
            {title}
          </span>
        </div>
        {Icon && <Icon className="w-4 h-4" style={{ color: isStale ? '#5B6068' : accentColor }} />}
      </div>

      {isStale ? (
        <div className="py-2 text-center text-xs font-mono text-[#E5484D] bg-[#E5484D]/10 rounded border border-[#E5484D]/30">
          No data for 5 s (Stale)
        </div>
      ) : (
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-mono font-bold tracking-tight text-[#E6E3DA] tabular-nums">
              {valueText}
            </span>
            <span className="text-xs font-mono text-[#8A919A]">{unitText}</span>
          </div>
          <span className="text-[10px] font-mono text-[#8A919A] tabular-nums">
            {lastUpdatedAgeSeconds <= 1 ? '< 1s ago' : `${(lastUpdatedAgeSeconds ?? 0).toFixed(1)}s ago`}
          </span>
        </div>
      )}

      {/* Sparkline & Status Footprint */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1C2226]">
        <canvas
          ref={sparklineCanvasRef}
          width={100}
          height={20}
          className="h-5 w-24 opacity-80"
          aria-hidden="true"
        />
        <div className="text-[10px] font-mono text-[#8A919A]">
          {channel === 'optical' && (
            <span>Threshold: {threshold ?? 20} counts</span>
          )}
          {channel === 'rf' && (
            <span>Threshold: {threshold ?? 20} counts</span>
          )}
          {channel === 'rssi' && (
            <span>Wi-Fi RSSI (ESP32 to router)</span>
          )}
          {channel === 'link' && (
            <span className="text-[#5DCAA5]">Jumper Selectable</span>
          )}
        </div>
      </div>
    </article>
  );
}

InstrumentTile.propTypes = {
  channel: PropTypes.oneOf(['optical', 'rf', 'rssi', 'link']).isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  rawValue: PropTypes.number,
  displayUnit: PropTypes.oneOf(['counts', 'percent', 'mv']),
  linkStatus: PropTypes.string,
  isStale: PropTypes.bool,
  lastUpdatedAgeSeconds: PropTypes.number,
  historySparkline: PropTypes.arrayOf(PropTypes.number),
  linkFocus: PropTypes.oneOf(['both', 'optical', 'rf']),
  threshold: PropTypes.number,
};
