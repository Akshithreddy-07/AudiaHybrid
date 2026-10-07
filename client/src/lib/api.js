/**
 * @typedef {Object} ReadingItem
 * @property {number|string} [id]
 * @property {string|number} ts
 * @property {string} deviceId
 * @property {number} optical
 * @property {number} rf
 * @property {number} rssi
 */

/**
 * @typedef {Object} LinkStatus
 * @property {boolean} optical
 * @property {boolean} rf
 * @property {'optical' | 'rf' | 'both' | 'none'} overall
 * @property {boolean} stale
 * @property {'socket' | 'sse'} [activeTransport]
 */

/**
 * @typedef {Object} HealthResponse
 * @property {'ok' | 'degraded' | 'error'} status
 * @property {number} uptimeSeconds
 * @property {boolean} brokerConnected
 * @property {boolean} dbConnected
 * @property {number} activeClients
 * @property {string} timestamp
 */

/**
 * @typedef {Object} HistoryQueryOptions
 * @property {number} [hours]
 * @property {number} [bucketSeconds]
 * @property {string} [deviceId]
 * @property {string} [since]
 * @property {number} [limit]
 */

export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} [status=500]
   * @param {string} [code]
   */
  constructor(message, status = 500, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// Derive API Base URL (defaulting to /api for Vite proxy, or VITE_API_URL for production)
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '') + '/api';

/**
 * Generic fetch wrapper with timeout / abort signal support
 * @template T
 * @param {string} endpoint
 * @param {RequestInit} [options={}]
 * @param {AbortSignal} [signal]
 * @returns {Promise<T>}
 */
async function fetchJson(endpoint, options = {}, signal) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal,
    });

    if (!res.ok) {
      let errorMessage = `HTTP Error ${res.status}: ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData?.message) errorMessage = errorData.message;
      } catch (_) {
        // Fallback to status text
      }
      throw new ApiError(errorMessage, res.status);
    }

    return await res.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('Request aborted by caller', 0, 'ABORTED');
    }
    const message = err instanceof Error ? err.message : 'Network failure';
    throw new ApiError(message, 0, 'NETWORK_ERROR');
  }
}

export const api = {
  /**
   * Fetches latest discrete readings with optional limit, device filter, or timestamp cutoff
   * @param {HistoryQueryOptions} [params={}]
   * @param {AbortSignal} [signal]
   * @returns {Promise<ReadingItem[]>}
   */
  async getReadings(params = {}, signal) {
    const query = new URLSearchParams();
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.since) query.set('since', params.since);
    if (params.deviceId) query.set('deviceId', params.deviceId);
    const qs = query.toString();
    return fetchJson(`/readings${qs ? `?${qs}` : ''}`, {}, signal);
  },

  /**
   * Fetches time-bucketed historical aggregates (1h, 24h, 7d)
   * @param {HistoryQueryOptions} [params={}]
   * @param {AbortSignal} [signal]
   * @returns {Promise<ReadingItem[]>}
   */
  async getHistory(params = {}, signal) {
    const query = new URLSearchParams();
    if (params.hours) query.set('hours', params.hours.toString());
    if (params.bucketSeconds) query.set('bucketSeconds', params.bucketSeconds.toString());
    if (params.deviceId) query.set('deviceId', params.deviceId);
    const qs = query.toString();
    return fetchJson(`/readings/history${qs ? `?${qs}` : ''}`, {}, signal);
  },

  /**
   * Fetches pre-computed summary metrics (min/mean/max per link)
   * @param {{ hours?: number, deviceId?: string }} [params={}]
   * @param {AbortSignal} [signal]
   * @returns {Promise<Record<string, unknown>>}
   */
  async getSummary(params = {}, signal) {
    const query = new URLSearchParams();
    if (params.hours) query.set('hours', params.hours.toString());
    if (params.deviceId) query.set('deviceId', params.deviceId);
    const qs = query.toString();
    return fetchJson(`/readings/summary${qs ? `?${qs}` : ''}`, {}, signal);
  },

  /**
   * Fetches link status flags and staleness
   * @param {AbortSignal} [signal]
   * @returns {Promise<LinkStatus>}
   */
  async getStatus(signal) {
    return fetchJson('/status', {}, signal);
  },

  /**
   * Health endpoint for pipeline diagnostic strip
   * @param {AbortSignal} [signal]
   * @returns {Promise<HealthResponse>}
   */
  async getHealth(signal) {
    return fetchJson('/health', {}, signal);
  },
};
