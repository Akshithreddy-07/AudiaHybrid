import { useState, useEffect, useRef, useCallback } from 'react';
import { getLiveSocket } from '../lib/socket.js';
import { api } from '../lib/api.js';
import { useControls } from '../context/ControlsContext.jsx';

/**
 * @typedef {import('../lib/stats.js').Reading} Reading
 * @typedef {import('../lib/api.js').LinkStatus} LinkStatus
 */

/**
 * @typedef {Object} EventLogEntry
 * @property {string} id
 * @property {string} timestamp
 * @property {'LINK_SWITCH' | 'STALE_WARNING' | 'RECOVERY' | 'CONNECTION'} type
 * @property {string} message
 */

/**
 * @typedef {Object} UseSensorDataReturn
 * @property {Reading[]} points
 * @property {Reading|null} latest
 * @property {LinkStatus} status
 * @property {'connected' | 'reconnecting' | 'offline'} connection
 * @property {boolean} paused
 * @property {number} pendingCount
 * @property {EventLogEntry[]} events
 * @property {() => void} clearEvents
 * @property {number} reconnectCount
 */

const MAX_BUFFER_POINTS = 3600; // 1 hour at 1 Hz

const INITIAL_STATUS = {
  optical: false,
  rf: false,
  overall: 'none',
  stale: true,
  activeTransport: 'socket',
};

/**
 * Core Sensor Data Stream Hook
 * @returns {UseSensorDataReturn}
 */
export function useSensorData() {
  const { isPaused, timeRange, deviceId, smoothing, transport } = useControls();

  // Primary data state: status initialized to {optical:false, rf:false, overall:"none", stale:true}, latest to null
  const [points, setPoints] = useState([]);
  const [latest, setLatest] = useState(null);
  const [status, setStatus] = useState({
    ...INITIAL_STATUS,
    activeTransport: transport,
  });
  const [connection, setConnection] = useState('offline');
  const [pendingCount, setPendingCount] = useState(0);
  const [events, setEvents] = useState([]);
  const [reconnectCount, setReconnectCount] = useState(0);

  // References for live stream without triggering extra re-renders
  const ringBufferRef = useRef([]);
  const statusRef = useRef({ ...INITIAL_STATUS, activeTransport: transport });
  const isPausedRef = useRef(isPaused);
  const pendingCountRef = useRef(0);
  const lastSyncTimeRef = useRef(0);
  const lastRawReadingRef = useRef(null);
  const prevOverallRef = useRef('none');
  const prevStaleRef = useRef(true);

  // Keep isPausedRef updated
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const addEvent = useCallback((type, message) => {
    const newEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      type,
      message,
    };
    setEvents((prev) => [newEntry, ...prev.slice(0, 199)]);
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  // Compute moving average for smoothed rendering
  const applySmoothing = useCallback((buffer) => {
    if (smoothing !== 'moving_avg' || !buffer || buffer.length < 2) return buffer || [];
    const windowSize = 5;
    return buffer.map((pt, idx) => {
      const start = Math.max(0, idx - windowSize + 1);
      const slice = buffer.slice(start, idx + 1);
      const avgOptical = slice.reduce((sum, s) => sum + (s.optical ?? 0), 0) / slice.length;
      const avgRf = slice.reduce((sum, s) => sum + (s.rf ?? 0), 0) / slice.length;
      return {
        ...pt,
        optical: Math.round(avgOptical),
        rf: Math.round(avgRf),
      };
    });
  }, [smoothing]);

  // Sync buffer to React state (throttled to at most once per second)
  const flushToState = useCallback(() => {
    if (isPausedRef.current) return;

    let rangeSeconds = 60;
    if (timeRange === '5m') rangeSeconds = 300;
    else if (timeRange === '1h') rangeSeconds = 3600;
    else if (timeRange === '24h') rangeSeconds = 86400;

    const cutoff = Date.now() - rangeSeconds * 1000;
    const filtered = ringBufferRef.current.filter((p) => {
      const t = typeof p.ts === 'string' ? new Date(p.ts).getTime() : p.ts;
      return t >= cutoff;
    });

    const smoothed = applySmoothing(filtered);
    setPoints(smoothed);
    if (lastRawReadingRef.current) {
      setLatest(lastRawReadingRef.current);
    }
    setStatus(statusRef.current || INITIAL_STATUS);
    setPendingCount(0);
    pendingCountRef.current = 0;
  }, [timeRange, applySmoothing]);

  // Initial load from /api/readings/history or snapshot
  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const fetchInitialSnapshot = async () => {
      try {
        const hours = timeRange === '24h' ? 24 : timeRange === '1h' ? 1 : 0.1;
        const bucket = timeRange === '24h' ? 60 : timeRange === '1h' ? 5 : 1;
        const initialData = await api.getHistory({ hours, bucketSeconds: bucket, deviceId }, controller.signal);
        
        if (active && initialData && Array.isArray(initialData)) {
          const formatted = initialData.map((d) => ({
            ts: d.ts,
            deviceId: d.deviceId || 'ESP32-NODE-01',
            optical: Number(d.optical) || 0,
            rf: Number(d.rf) || 0,
            rssi: Number(d.rssi) || -60,
          }));

          ringBufferRef.current = formatted.slice(-MAX_BUFFER_POINTS);
          if (formatted.length > 0) {
            lastRawReadingRef.current = formatted[formatted.length - 1];
          }
          flushToState();
        }
      } catch (err) {
        // Safe fallback
        console.warn('Initial reading fetch fallback:', err.message);
        if (active && ringBufferRef.current.length === 0) {
          flushToState();
        }
      }
    };

    fetchInitialSnapshot();
    return () => {
      active = false;
      controller.abort();
    };
  }, [timeRange, deviceId, flushToState]);

  // Ingestion handler for incoming raw readings
  const handleIncomingReading = useCallback(
    (reading, incomingStatus) => {
      if (!reading) return;

      const validPoint = {
        ts: reading.ts || new Date().toISOString(),
        deviceId: reading.deviceId || 'ESP32-NODE-01',
        optical: typeof reading.optical === 'number' ? reading.optical : 0,
        rf: typeof reading.rf === 'number' ? reading.rf : 0,
        rssi: typeof reading.rssi === 'number' ? reading.rssi : -60,
      };

      lastRawReadingRef.current = validPoint;
      ringBufferRef.current.push(validPoint);

      if (ringBufferRef.current.length > MAX_BUFFER_POINTS) {
        ringBufferRef.current.shift();
      }

      if (incomingStatus) {
        statusRef.current = {
          ...INITIAL_STATUS,
          ...incomingStatus,
        };
        if (incomingStatus.overall && incomingStatus.overall !== prevOverallRef.current) {
          addEvent('LINK_SWITCH', `Link changed to ${incomingStatus.overall.toUpperCase()}`);
          prevOverallRef.current = incomingStatus.overall;
        }
        if (incomingStatus.stale && !prevStaleRef.current) {
          addEvent('STALE_WARNING', 'Telemetry feed is stale (no packet in >5s)');
          prevStaleRef.current = true;
        } else if (!incomingStatus.stale && prevStaleRef.current) {
          addEvent('RECOVERY', 'Telemetry feed recovered (live stream active)');
          prevStaleRef.current = false;
        }
      }

      if (isPausedRef.current) {
        pendingCountRef.current += 1;
        setPendingCount(pendingCountRef.current);
      } else {
        const now = Date.now();
        if (now - lastSyncTimeRef.current >= 1000) {
          lastSyncTimeRef.current = now;
          flushToState();
        }
      }
    },
    [addEvent, flushToState]
  );

  // Transport: Socket.io
  useEffect(() => {
    if (transport !== 'socket') return;

    const socket = getLiveSocket();
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      setConnection('connected');
      addEvent('CONNECTION', 'Socket.io connected to /live');
    };

    const onDisconnect = () => {
      setConnection('offline');
      addEvent('CONNECTION', 'Socket.io disconnected');
    };

    const onReconnectAttempt = () => {
      setConnection('reconnecting');
      setReconnectCount((prev) => prev + 1);
    };

    const onSnapshot = (snapshot) => {
      if (Array.isArray(snapshot) && snapshot.length > 0) {
        const formatted = snapshot.map((s) => ({
          ts: s.ts,
          deviceId: s.deviceId,
          optical: Number(s.optical) || 0,
          rf: Number(s.rf) || 0,
          rssi: Number(s.rssi) || -60,
        }));
        ringBufferRef.current = formatted.slice(-MAX_BUFFER_POINTS);
        lastRawReadingRef.current = formatted[formatted.length - 1];
        flushToState();
      }
    };

    const onReading = (payload) => {
      if (payload?.reading) {
        handleIncomingReading(payload.reading, payload.status);
      }
    };

    const onStatus = (newStatus) => {
      if (newStatus) {
        statusRef.current = {
          ...INITIAL_STATUS,
          ...newStatus,
        };
        setStatus(statusRef.current);
      }
    };

    socket.on?.('connect', onConnect);
    socket.on?.('disconnect', onDisconnect);
    socket.io?.on?.('reconnect_attempt', onReconnectAttempt);
    socket.on?.('snapshot', onSnapshot);
    socket.on?.('reading', onReading);
    socket.on?.('status', onStatus);

    return () => {
      socket.off?.('connect', onConnect);
      socket.off?.('disconnect', onDisconnect);
      socket.io?.off?.('reconnect_attempt', onReconnectAttempt);
      socket.off?.('snapshot', onSnapshot);
      socket.off?.('reading', onReading);
      socket.off?.('status', onStatus);
    };
  }, [transport, handleIncomingReading, addEvent, flushToState]);

  // Transport: SSE Stream
  useEffect(() => {
    if (transport !== 'sse') return;

    let eventSource = null;
    const sseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '') + '/api/stream';

    try {
      eventSource = new EventSource(sseUrl);
      eventSource.onopen = () => {
        setConnection('connected');
        addEvent('CONNECTION', 'SSE Stream connected to /api/stream');
      };

      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data?.reading) {
            handleIncomingReading(data.reading, data.status);
          }
        } catch (parseErr) {
          console.warn('SSE parse error:', parseErr.message);
        }
      };

      eventSource.onerror = () => {
        setConnection('reconnecting');
        setReconnectCount((prev) => prev + 1);
      };
    } catch (sseErr) {
      console.warn('SSE stream error:', sseErr.message);
      setConnection('offline');
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [transport, handleIncomingReading, addEvent]);

  // Handle Pause / Resume Flush
  useEffect(() => {
    if (!isPaused) {
      flushToState();
    }
  }, [isPaused, flushToState]);

  return {
    points: points || [],
    latest: latest || null,
    status: status || INITIAL_STATUS,
    connection: connection || 'offline',
    paused: isPaused,
    pendingCount,
    events,
    clearEvents,
    reconnectCount,
  };
}
