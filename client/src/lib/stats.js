/**
 * @typedef {Object} Reading
 * @property {number|string} ts
 * @property {string} [deviceId]
 * @property {number} optical
 * @property {number} rf
 * @property {number} rssi
 */

/**
 * @typedef {Object} MetricSummary
 * @property {number} min
 * @property {number} mean
 * @property {number} max
 * @property {number} p5
 * @property {number} p95
 * @property {number} signalToFloorRatio
 */

/**
 * @typedef {Object} TelemetryStats
 * @property {number} messageCount
 * @property {number} messagesPerMinute
 * @property {number} meanIntervalMs
 * @property {number} jitterMs
 * @property {number} droppedIntervals
 * @property {MetricSummary} optical
 * @property {MetricSummary} rf
 * @property {MetricSummary} rssi
 */

/**
 * @param {number[]} sortedArr
 * @param {number} p
 * @returns {number}
 */
function calculatePercentile(sortedArr, p) {
  if (sortedArr.length === 0) return 0;
  const index = (p / 100) * (sortedArr.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  if (lower === upper) return sortedArr[lower];
  return sortedArr[lower] * (1 - weight) + sortedArr[upper] * weight;
}

/**
 * @param {number[]} arr
 * @returns {MetricSummary}
 */
function summarizeArray(arr) {
  if (!arr || arr.length === 0) {
    return { min: 0, mean: 0, max: 0, p5: 0, p95: 0, signalToFloorRatio: 1 };
  }

  const sorted = [...arr].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, val) => acc + val, 0);
  const mean = sum / sorted.length;
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const p5 = calculatePercentile(sorted, 5);
  const p95 = calculatePercentile(sorted, 95);
  const noiseFloor = Math.max(1, p5);
  const signalToFloorRatio = Number((mean / noiseFloor).toFixed(2));

  return {
    min: Math.round(min),
    mean: Number(mean.toFixed(1)),
    max: Math.round(max),
    p5: Number(p5.toFixed(1)),
    p95: Number(p95.toFixed(1)),
    signalToFloorRatio,
  };
}

/**
 * Calculates telemetry statistical indicators over an array of readings
 * @param {Reading[]} readings
 * @returns {TelemetryStats}
 */
export function calculateTelemetryStats(readings) {
  if (!readings || readings.length === 0) {
    const emptyMetric = { min: 0, mean: 0, max: 0, p5: 0, p95: 0, signalToFloorRatio: 1 };
    return {
      messageCount: 0,
      messagesPerMinute: 0,
      meanIntervalMs: 0,
      jitterMs: 0,
      droppedIntervals: 0,
      optical: emptyMetric,
      rf: emptyMetric,
      rssi: emptyMetric,
    };
  }

  const intervals = [];
  let droppedCount = 0;

  for (let i = 1; i < readings.length; i++) {
    const tPrev = typeof readings[i - 1].ts === 'string' ? new Date(readings[i - 1].ts).getTime() : readings[i - 1].ts;
    const tCurr = typeof readings[i].ts === 'string' ? new Date(readings[i].ts).getTime() : readings[i].ts;
    const dt = Math.abs(tCurr - tPrev);
    if (!isNaN(dt) && dt > 0) {
      intervals.push(dt);
      if (dt > 2000) {
        droppedCount++;
      }
    }
  }

  const meanInterval = intervals.length > 0
    ? intervals.reduce((a, b) => a + b, 0) / intervals.length
    : 1000;

  let jitterSum = 0;
  for (let i = 1; i < intervals.length; i++) {
    jitterSum += Math.abs(intervals[i] - intervals[i - 1]);
  }
  const jitter = intervals.length > 1 ? jitterSum / (intervals.length - 1) : 0;

  const firstTs = typeof readings[0].ts === 'string' ? new Date(readings[0].ts).getTime() : readings[0].ts;
  const lastTs = typeof readings[readings.length - 1].ts === 'string'
    ? new Date(readings[readings.length - 1].ts).getTime()
    : readings[readings.length - 1].ts;
  const totalSpanMinutes = Math.max(0.1, (lastTs - firstTs) / 60000);
  const messagesPerMinute = Math.round(readings.length / totalSpanMinutes);

  const opticalVals = readings.map((r) => r.optical ?? 0);
  const rfVals = readings.map((r) => r.rf ?? 0);
  const rssiVals = readings.map((r) => r.rssi ?? -60);

  return {
    messageCount: readings.length,
    messagesPerMinute,
    meanIntervalMs: Math.round(meanInterval),
    jitterMs: Number(jitter.toFixed(1)),
    droppedIntervals: droppedCount,
    optical: summarizeArray(opticalVals),
    rf: summarizeArray(rfVals),
    rssi: summarizeArray(rssiVals),
  };
}
