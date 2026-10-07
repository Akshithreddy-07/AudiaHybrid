import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api.js';

/**
 * @typedef {import('../lib/stats.js').Reading} Reading
 * @typedef {import('../lib/api.js').HistoryQueryOptions} HistoryQueryOptions
 */

/**
 * Hook for loading historical aggregated readings
 * @param {HistoryQueryOptions} [options={}]
 * @returns {{ data: Reading[], loading: boolean, error: string|null, refetch: () => void }}
 */
export function useHistory(options = {}) {
  const { hours, bucketSeconds, deviceId } = options;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const controller = new AbortController();

    try {
      const readings = await api.getHistory({ hours, bucketSeconds, deviceId }, controller.signal);
      const points = (readings || []).map((r) => ({
        ts: r.ts,
        deviceId: r.deviceId || 'ESP32-NODE-01',
        optical: Number(r.optical) || 0,
        rf: Number(r.rf) || 0,
        rssi: Number(r.rssi) || -60,
      }));
      setData(points);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message || 'Failed to load historical records');
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [hours, bucketSeconds, deviceId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data: data || [], loading, error, refetch: fetchData };
}
