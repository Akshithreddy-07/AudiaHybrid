import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';

const MQTT_URL = import.meta.env.VITE_MQTT_URL || 'wss://broker.hivemq.com:8884/mqtt';
const TOPIC_TELEMETRY = 'audiahybrid/cyril-raj/telemetry';
const TOPIC_STATUS = 'audiahybrid/cyril-raj/status';
const MAX_HISTORY = 60;

/**
 * Custom React hook that connects directly to the MQTT broker over WebSocket,
 * subscribes to AudiaHybrid ESP32 telemetry and status topics,
 * and maintains real-time state and a 60-reading rolling history buffer.
 *
 * @returns {{
 *   brokerUp: boolean,
 *   deviceOnline: boolean,
 *   latest: {
 *     optical: number,
 *     rf: number,
 *     opt_ok: boolean,
 *     rf_ok: boolean,
 *     preferred: 'optical' | 'rf',
 *     active: 'optical' | 'rf' | 'none',
 *     rssi: number,
 *     ts: number
 *   } | null,
 *   history: Array<{
 *     optical: number,
 *     rf: number,
 *     opt_ok: boolean,
 *     rf_ok: boolean,
 *     preferred: string,
 *     active: string,
 *     rssi: number,
 *     ts: number
 *   }>
 * }}
 */
export function useAudiaLive() {
  const [brokerUp, setBrokerUp] = useState(false);
  const [deviceOnline, setDeviceOnline] = useState(false);
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);

  // Ref to hold client instance
  const clientRef = useRef(null);

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
            // Receiving live telemetry also confirms device is transmitting
            setDeviceOnline(true);

            setHistory((prev) => {
              const updated = [...prev, reading];
              if (updated.length > MAX_HISTORY) {
                return updated.slice(updated.length - MAX_HISTORY);
              }
              return updated;
            });
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

  return {
    brokerUp,
    deviceOnline,
    latest,
    history,
  };
}
