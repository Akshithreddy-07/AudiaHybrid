import { convertCount } from './units.js';

/**
 * @typedef {import('./stats.js').Reading} Reading
 * @typedef {import('./units.js').DisplayUnit} DisplayUnit
 */

/**
 * Generates an RFC 4180 compliant CSV string from an array of telemetry readings
 * @param {Reading[]} readings
 * @param {DisplayUnit} [unit='counts']
 * @param {{ deviceId?: string, generatedAt?: string }} [metadata={}]
 * @returns {string}
 */
export function generateCsv(readings, unit = 'counts', metadata = {}) {
  const generatedAt = metadata.generatedAt || new Date().toISOString();
  const unitLabel = unit === 'mv' ? 'approx_mV' : unit === 'percent' ? 'percent_FS' : 'adc_counts';

  const header = [
    'timestamp_iso',
    'device_id',
    `optical_level_${unitLabel}`,
    `rf_level_${unitLabel}`,
    'wifi_rssi_dbm_esp32_to_router',
  ].join(',');

  const rows = (readings || []).map((r) => {
    const isoTime = typeof r.ts === 'string' ? new Date(r.ts).toISOString() : new Date(r.ts).toISOString();
    const dev = r.deviceId || metadata.deviceId || 'ESP32-NODE-01';
    const optVal = convertCount(r.optical, unit).valueText;
    const rfVal = convertCount(r.rf, unit).valueText;
    const rssiVal = Math.round(r.rssi ?? -60).toString();

    return `"${isoTime}","${dev}",${optVal},${rfVal},${rssiVal}`;
  });

  return [
    `# AudiaHybrid Telemetry Export - Generated: ${generatedAt}`,
    `# Units: ${unitLabel}`,
    `# Notice: rssi column is Wi-Fi RSSI (ESP32 to router), not 433 MHz strength.`,
    header,
    ...rows,
  ].join('\r\n');
}

/**
 * Initiates browser file download for generated CSV
 * @param {string} csvContent
 * @param {string} [filenamePrefix='audiahv-telemetry']
 */
export function downloadCsv(csvContent, filenamePrefix = 'audiahv-telemetry') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  link.download = `${filenamePrefix}-${timestamp}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
