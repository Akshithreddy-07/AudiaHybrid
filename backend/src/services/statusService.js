import { config } from '../config.js';

/**
 * @typedef {Object} LinkStatus
 * @property {boolean} optical
 * @property {boolean} rf
 * @property {'optical' | 'rf' | 'both' | 'none'} overall
 * @property {boolean} stale
 */

/** @type {import('../repositories/readingsRepository.js').ReadingRecord | null} */
let latestReading = null;
let lastUpdateTs = 0;

/**
 * Updates the latest stored telemetry reading.
 * @param {import('../repositories/readingsRepository.js').ReadingRecord} reading
 */
export function updateLatestReading(reading) {
  latestReading = reading;
  lastUpdateTs = Date.now();
}

/**
 * Returns the latest stored telemetry reading.
 * @returns {import('../repositories/readingsRepository.js').ReadingRecord | null}
 */
export function getLatestReading() {
  return latestReading;
}

/**
 * Evaluates current link health, link selection, and staleness.
 * @returns {LinkStatus}
 */
export function getLinkStatus() {
  const isStale = !latestReading || (Date.now() - lastUpdateTs > 5000);

  if (isStale || !latestReading) {
    return {
      optical: false,
      rf: false,
      overall: 'none',
      stale: true,
    };
  }

  const opticalHealthy = latestReading.optical >= config.threshold;
  const rfHealthy = latestReading.rf >= config.threshold;

  let overall = 'none';
  if (opticalHealthy && rfHealthy) overall = 'both';
  else if (opticalHealthy) overall = 'optical';
  else if (rfHealthy) overall = 'rf';

  return {
    optical: opticalHealthy,
    rf: rfHealthy,
    overall,
    stale: false,
  };
}
