import { prisma } from '../prisma.js';

/**
 * @typedef {Object} ReadingInput
 * @property {Date|string|number} [ts]
 * @property {string} deviceId
 * @property {number} optical
 * @property {number} rf
 * @property {number} rssi
 */

/**
 * @typedef {Object} ReadingRecord
 * @property {number} id
 * @property {Date} ts
 * @property {string} deviceId
 * @property {number} optical
 * @property {number} rf
 * @property {number} rssi
 * @property {Date} createdAt
 */

/**
 * Persists a telemetry reading in the database.
 * @param {ReadingInput} data
 * @returns {Promise<ReadingRecord>}
 */
export async function createReading(data) {
  return prisma.reading.create({
    data: {
      ts: data.ts ? new Date(data.ts) : new Date(),
      deviceId: data.deviceId || 'AUDIA-ESP32-01',
      optical: Math.round(data.optical),
      rf: Math.round(data.rf),
      rssi: Math.round(data.rssi),
    },
  });
}

/**
 * Retrieves the most recent readings according to filter options.
 * @param {Object} options
 * @param {number} [options.limit=60]
 * @param {string|Date} [options.since]
 * @param {string} [options.deviceId]
 * @returns {Promise<ReadingRecord[]>}
 */
export async function getRecentReadings({ limit = 60, since, deviceId } = {}) {
  const where = {};
  if (deviceId) where.deviceId = deviceId;
  if (since) where.ts = { gte: new Date(since) };

  const records = await prisma.reading.findMany({
    where,
    orderBy: { ts: 'desc' },
    take: Math.min(Math.max(1, limit), 1000),
  });

  return records.reverse();
}

/**
 * Retrieves downsampled/bucketed historical readings over a specified hour window.
 * @param {Object} options
 * @param {number} [options.hours=1]
 * @param {number} [options.bucketSeconds=10]
 * @param {string} [options.deviceId]
 * @returns {Promise<Array<{ ts: string, deviceId: string, optical: number, rf: number, rssi: number }>>}
 */
export async function getHistory({ hours = 1, bucketSeconds = 10, deviceId } = {}) {
  const cutoff = new Date(Date.now() - hours * 3600 * 1000);
  const where = { ts: { gte: cutoff } };
  if (deviceId) where.deviceId = deviceId;

  const records = await prisma.reading.findMany({
    where,
    orderBy: { ts: 'asc' },
  });

  if (records.length === 0) return [];

  // Group by bucket time
  const bucketMs = Math.max(1, bucketSeconds) * 1000;
  const buckets = new Map();

  for (const r of records) {
    const timeMs = new Date(r.ts).getTime();
    const bucketKey = Math.floor(timeMs / bucketMs) * bucketMs;

    if (!buckets.has(bucketKey)) {
      buckets.set(bucketKey, {
        ts: new Date(bucketKey).toISOString(),
        deviceId: r.deviceId,
        opticalSum: 0,
        rfSum: 0,
        rssiSum: 0,
        count: 0,
      });
    }

    const b = buckets.get(bucketKey);
    b.opticalSum += r.optical;
    b.rfSum += r.rf;
    b.rssiSum += r.rssi;
    b.count += 1;
  }

  return Array.from(buckets.values()).map((b) => ({
    ts: b.ts,
    deviceId: b.deviceId,
    optical: Math.round(b.opticalSum / b.count),
    rf: Math.round(b.rfSum / b.count),
    rssi: Math.round(b.rssiSum / b.count),
  }));
}

/**
 * Calculates statistical metrics (min, mean, max, count) over a given hour window.
 * @param {Object} options
 * @param {number} [options.hours=24]
 * @param {string} [options.deviceId]
 * @returns {Promise<{
 *   count: number,
 *   optical: { min: number, mean: number, max: number },
 *   rf: { min: number, mean: number, max: number },
 *   rssi: { min: number, mean: number, max: number }
 * }>}
 */
export async function getSummary({ hours = 24, deviceId } = {}) {
  const cutoff = new Date(Date.now() - hours * 3600 * 1000);
  const where = { ts: { gte: cutoff } };
  if (deviceId) where.deviceId = deviceId;

  const records = await prisma.reading.findMany({
    where,
    select: { optical: true, rf: true, rssi: true },
  });

  if (records.length === 0) {
    return {
      count: 0,
      optical: { min: 0, mean: 0, max: 0 },
      rf: { min: 0, mean: 0, max: 0 },
      rssi: { min: 0, mean: 0, max: 0 },
    };
  }

  let optMin = Infinity, optMax = -Infinity, optSum = 0;
  let rfMin = Infinity, rfMax = -Infinity, rfSum = 0;
  let rssiMin = Infinity, rssiMax = -Infinity, rssiSum = 0;

  for (const r of records) {
    if (r.optical < optMin) optMin = r.optical;
    if (r.optical > optMax) optMax = r.optical;
    optSum += r.optical;

    if (r.rf < rfMin) rfMin = r.rf;
    if (r.rf > rfMax) rfMax = r.rf;
    rfSum += r.rf;

    if (r.rssi < rssiMin) rssiMin = r.rssi;
    if (r.rssi > rssiMax) rssiMax = r.rssi;
    rssiSum += r.rssi;
  }

  const n = records.length;
  return {
    count: n,
    optical: {
      min: optMin,
      mean: Math.round(optSum / n),
      max: optMax,
    },
    rf: {
      min: rfMin,
      mean: Math.round(rfSum / n),
      max: rfMax,
    },
    rssi: {
      min: rssiMin,
      mean: Math.round(rssiSum / n),
      max: rssiMax,
    },
  };
}

/**
 * Persists a hardware reading in the database.
 * @param {Object} data
 * @param {number} data.optical
 * @param {number} data.rf
 * @param {number} data.rssi
 * @param {string} data.active
 * @param {string} data.preferred
 * @returns {Promise<Object>}
 */
export async function createHardwareReading(data) {
  return prisma.hardwareReading.create({
    data: {
      optical: Math.round(data.optical ?? 0),
      rf: Math.round(data.rf ?? 0),
      rssi: Math.round(data.rssi ?? 0),
      active: String(data.active || 'none'),
      preferred: String(data.preferred || 'optical'),
    },
  });
}

/**
 * Retrieves the latest hardware readings.
 * @param {Object} [options]
 * @param {number} [options.limit=100]
 * @returns {Promise<Array<Object>>}
 */
export async function getHardwareReadings({ limit = 100 } = {}) {
  const take = Math.min(Math.max(1, limit), 1000);
  return prisma.hardwareReading.findMany({
    orderBy: { createdAt: 'desc' },
    take,
  });
}

/**
 * Persists a text message in the database.
 * @param {Object} data
 * @param {string} [data.sent]
 * @param {string} [data.received]
 * @param {string} [data.link]
 * @param {boolean} [data.ok=true]
 * @returns {Promise<Object>}
 */
export async function createTextMessage(data) {
  return prisma.textMessage.create({
    data: {
      sent: data.sent !== undefined && data.sent !== null ? String(data.sent) : null,
      received: data.received !== undefined && data.received !== null ? String(data.received) : null,
      link: data.link ? String(data.link).toUpperCase() : null,
      ok: data.ok !== undefined ? Boolean(data.ok) : true,
    },
  });
}

/**
 * Retrieves the most recent text messages.
 * @param {Object} [options]
 * @param {number} [options.limit=20]
 * @returns {Promise<Array<Object>>}
 */
export async function getTextMessages({ limit = 20 } = {}) {
  const take = Math.min(Math.max(1, limit), 100);
  return prisma.textMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take,
  });
}

/**
 * Updates a text message row by ID (received text, link, ok status).
 * @param {number} id
 * @param {Object} data
 * @param {string} [data.received]
 * @param {string} [data.link]
 * @param {boolean} [data.ok]
 * @returns {Promise<Object>}
 */
export async function updateTextMessageById(id, { received, link, ok }) {
  const linkVal = link ? String(link).toUpperCase() : 'NONE';
  const okVal = ok !== undefined ? Boolean(ok) : linkVal !== 'NONE';

  return prisma.textMessage.update({
    where: { id: Number(id) },
    data: {
      received: received !== undefined && received !== null ? String(received) : undefined,
      link: linkVal,
      ok: okVal,
    },
  });
}


