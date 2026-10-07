/**
 * @typedef {'counts' | 'percent' | 'mv'} DisplayUnit
 */

/**
 * @typedef {Object} FormattedReading
 * @property {string} valueText
 * @property {string} unitText
 * @property {number} numericValue
 */

/**
 * Converts raw ADC count (0 - 4095) to the requested display unit
 * @param {number|null|undefined} count 12-bit ADC count (0 - 4095)
 * @param {DisplayUnit} [unit='counts'] Display unit ('counts' | 'percent' | 'mv')
 * @param {number} [decimals=1] Optional decimal precision
 * @returns {FormattedReading}
 */
export function convertCount(count, unit = 'counts', decimals = 1) {
  if (count === null || count === undefined || isNaN(count)) {
    return {
      valueText: '---',
      unitText: unit === 'mv' ? 'approx. mV' : unit === 'percent' ? '%' : 'counts',
      numericValue: 0,
    };
  }

  const clamped = Math.max(0, Math.min(4095, count));

  switch (unit) {
    case 'percent': {
      const pct = (clamped / 4095) * 100;
      return {
        valueText: pct.toFixed(decimals),
        unitText: '%',
        numericValue: Number(pct.toFixed(decimals)),
      };
    }
    case 'mv': {
      // 3.3V reference mapped to 4095 counts (~0.8058 mV/count)
      const mv = (clamped * 3300) / 4095;
      return {
        valueText: mv.toFixed(decimals),
        unitText: 'approx. mV',
        numericValue: Number(mv.toFixed(decimals)),
      };
    }
    case 'counts':
    default:
      return {
        valueText: Math.round(clamped).toString(),
        unitText: 'counts',
        numericValue: Math.round(clamped),
      };
  }
}

/**
 * Formats Wi-Fi RSSI in dBm
 * @param {number|null|undefined} rssi
 * @returns {{ valueText: string, unitText: string }}
 */
export function formatRssi(rssi) {
  if (rssi === null || rssi === undefined || isNaN(rssi)) {
    return { valueText: '---', unitText: 'dBm' };
  }
  return {
    valueText: Math.round(rssi).toString(),
    unitText: 'dBm',
  };
}
