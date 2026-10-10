import { useState, useEffect, useRef, useCallback } from 'react';
import mqtt from 'mqtt';
import { api } from '../lib/api.js';

const MQTT_URL = import.meta.env.VITE_MQTT_URL || 'wss://broker.hivemq.com:8884/mqtt';
const TOPIC_TELEMETRY = 'audiahybrid/cyril-raj/telemetry';
const TOPIC_STATUS = 'audiahybrid/cyril-raj/status';
const TOPIC_CMD = 'audiahybrid/cyril-raj/cmd';
const MAX_HISTORY = 60;

/**
 * Custom React hook that connects directly to the MQTT broker over WebSocket,
 * subscribes to AudiaHybrid ESP32 telemetry and status topics,
 * and maintains real-time sensor state, 60-reading rolling history,
 * and bidirectional Text Link messaging.
 */
export function useAudiaLive() {
  const [brokerUp, setBrokerUp] = useState(false);
  const [deviceOnline, setDeviceOnline] = useState(false);
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);

  // Text Link state
  const [latestReceived, setLatestReceived] = useState(null);
  const [lastSent, setLastSent] = useState(null);
  const [textHistory, setTextHistory] = useState([]);
  const [textMetrics, setTextMetrics] = useState({
    optOk: 0,
    rfOk: 0,
    loss: 0,
    activeLink: 'NONE',
  });
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  // Ref to hold MQTT client instance
  const clientRef = useRef(null);

  // Load initial text message history from database
  useEffect(() => {
    let isMounted = true;
    api.getTextMessages({ limit: 20 })
      .then((data) => {
        if (!isMounted || !Array.isArray(data)) return;
        setTextHistory(data);

        // Populate latest received / sent if available in historical data
        const latestRx = data.find((m) => m && m.received);
        if (latestRx) {
          setLatestReceived({
            msg: latestRx.received,
            link: latestRx.link || 'UNKNOWN',
            ok: latestRx.ok ?? true,
            optOk: 0,
            rfOk: 0,
            loss: 0,
            ts: new Date(latestRx.createdAt).getTime(),
          });
        }
        const latestTx = data.find((m) => m && m.sent);
        if (latestTx) {
          setLastSent({
            text: latestTx.sent,
            ts: new Date(latestTx.createdAt).getTime(),
          });
        }
      })
      .catch((err) => {
        console.warn('[useAudiaLive] Error loading initial text history:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const clientId = `audia-web-${Math.random().toString(16).substring(2, 10)}`;

    try {
      const client = mqtt.connect(MQTT_URL, {
        clientId,
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 3000,
      });

      clientRef.current = client;

      client.on('connect', () => {
        if (!isMounted) return;
        setBrokerUp(true);
        client.subscribe([TOPIC_TELEMETRY, TOPIC_STATUS], { qos: 0 }, (err) => {
          if (err) {
            console.warn('[MQTT Live] Subscription error:', err);
          }
        });
      });

      client.on('reconnect', () => {
        if (!isMounted) return;
        setBrokerUp(false);
      });

      client.on('close', () => {
        if (!isMounted) return;
        setBrokerUp(false);
      });

      client.on('offline', () => {
        if (!isMounted) return;
        setBrokerUp(false);
      });

      client.on('error', (err) => {
        console.warn('[MQTT Live] Connection error:', err.message);
        if (!isMounted) return;
        setBrokerUp(false);
      });

      client.on('message', (topic, payload) => {
        if (!isMounted) return;

        if (topic === TOPIC_STATUS) {
          const statusStr = payload.toString().trim().toLowerCase();
          setDeviceOnline(statusStr === 'online');
          return;
        }

        if (topic === TOPIC_TELEMETRY) {
          try {
            const raw = JSON.parse(payload.toString());

            // Telemetry received confirms device is actively communicating
            setDeviceOnline(true);

            // 1. Parse Analog Sensor Readings (if present)
            if (typeof raw.optical === 'number' || typeof raw.rf === 'number') {
              const reading = {
                optical: typeof raw.optical === 'number' ? raw.optical : 0,
                rf: typeof raw.rf === 'number' ? raw.rf : 0,
                opt_ok: Boolean(raw.opt_ok),
                rf_ok: Boolean(raw.rf_ok),
                preferred: raw.preferred === 'rf' ? 'rf' : 'optical',
                active: raw.active || 'none',
                rssi: typeof raw.rssi === 'number' ? raw.rssi : 0,
                ts: Date.now(),
              };

              setLatest(reading);

              setHistory((prev) => {
                const updated = [...prev, reading];
                if (updated.length > MAX_HISTORY) {
                  return updated.slice(updated.length - MAX_HISTORY);
                }
                return updated;
              });
            }

            // 2. Parse Text Link Telemetry & Metrics
            // Format e.g. {"msg":"HELLO","link":"OPTICAL","optOk":9,"rfOk":7,"loss":10}
            const hasMsg = raw.msg !== undefined && raw.msg !== null && String(raw.msg).trim() !== '';
            const hasTextMetrics = raw.optOk !== undefined || raw.rfOk !== undefined || raw.loss !== undefined || (raw.link && typeof raw.link === 'string');

            if (hasMsg || hasTextMetrics) {
              const linkStr = raw.link
                ? String(raw.link).toUpperCase()
                : raw.active
                ? String(raw.active).toUpperCase()
                : 'OPTICAL';

              const optOkVal = typeof raw.optOk === 'number'
                ? raw.optOk
                : typeof raw.opt_ok === 'number'
                ? raw.opt_ok
                : raw.opt_ok ? 1 : 0;

              const rfOkVal = typeof raw.rfOk === 'number'
                ? raw.rfOk
                : typeof raw.rf_ok === 'number'
                ? raw.rf_ok
                : raw.rf_ok ? 1 : 0;

              const lossVal = typeof raw.loss === 'number' ? raw.loss : 0;
              const isOk = raw.ok !== undefined ? Boolean(raw.ok) : lossVal < 100;

              // Update success rates and active link
              setTextMetrics((prev) => ({
                optOk: optOkVal !== undefined ? optOkVal : prev.optOk,
                rfOk: rfOkVal !== undefined ? rfOkVal : prev.rfOk,
                loss: lossVal !== undefined ? lossVal : prev.loss,
                activeLink: linkStr !== 'UNKNOWN' ? linkStr : (raw.active ? String(raw.active).toUpperCase() : prev.activeLink),
              }));

              // If a decoded message is attached, update Received state & history
              if (hasMsg) {
                const msgStr = String(raw.msg);
                const rxEntry = {
                  msg: msgStr,
                  link: linkStr,
                  optOk: optOkVal,
                  rfOk: rfOkVal,
                  loss: lossVal,
                  ok: isOk,
                  ts: Date.now(),
                };
                setLatestReceived(rxEntry);

                // Add to history table
                const newHistoryItem = {
                  id: `rx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                  createdAt: new Date().toISOString(),
                  sent: null,
                  received: msgStr,
                  link: linkStr,
                  ok: isOk,
                };

                setTextHistory((prev) => {
                  const filtered = prev.filter((p) => p && !(p.received === msgStr && Math.abs(new Date(p.createdAt).getTime() - Date.now()) < 500));
                  return [newHistoryItem, ...filtered].slice(0, 20);
                });
              }
            }
          } catch (e) {
            console.warn('[MQTT Live] Failed to parse telemetry payload:', e);
          }
        }
      });
    } catch (err) {
      console.warn('[MQTT Live] Failed to initialize MQTT client:', err);
    }

    return () => {
      isMounted = false;
      if (clientRef.current) {
        try {
          clientRef.current.end(true);
        } catch (_) {}
      }
    };
  }, []);

  /**
   * Transmits a text message:
   * 1. Publishes {"msg": "<text>"} to MQTT topic audiahybrid/cyril-raj/cmd
   * 2. Persists to backend database via POST /api/text
   * 3. Updates local UI state and history
   *
   * @param {string} textToSend
   */
  const sendTextMessage = useCallback(async (textToSend) => {
    const trimmed = String(textToSend || '').slice(0, 32);
    if (!trimmed.trim()) {
      return;
    }

    setIsSending(true);
    setSendError(null);

    const now = Date.now();
    const payload = JSON.stringify({ msg: trimmed });

    try {
      // 1. Direct publish to MQTT topic
      if (clientRef.current && clientRef.current.connected) {
        clientRef.current.publish(TOPIC_CMD, payload, { qos: 0 }, (err) => {
          if (err) console.warn('[MQTT Cmd] Publish error:', err);
        });
      } else {
        console.warn('[MQTT Cmd] Direct client not connected; backend fallback will transmit');
      }

      // 2. Persist to Backend API
      const res = await api.sendTextMessage(trimmed);
      const savedRecord = (res?.id ? res : res?.data) || {
        id: `sent-${now}`,
        createdAt: new Date(now).toISOString(),
        sent: trimmed,
        received: null,
        link: null,
        ok: true,
      };


      setLastSent({
        text: trimmed,
        ts: now,
      });

      setTextHistory((prev) => {
        const updated = [savedRecord, ...prev.filter((p) => p.id !== savedRecord.id)];
        return updated.slice(0, 20);
      });

      return savedRecord;
    } catch (err) {
      console.error('[SendText] Error:', err);
      setSendError(err.message || 'Failed to send message');
      throw err;
    } finally {
      setIsSending(false);
    }
  }, []);

  return {
    brokerUp,
    deviceOnline,
    latest,
    history,
    // Text Link State & Actions
    latestReceived,
    lastSent,
    textHistory,
    textMetrics,
    isSending,
    sendError,
    sendTextMessage,
  };
}

