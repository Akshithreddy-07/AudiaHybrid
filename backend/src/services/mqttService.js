import mqtt from 'mqtt';
import { z } from 'zod';
import { config } from '../config.js';
import {
  createReading,
  createHardwareReading,
  createTextMessage,
  updateTextMessageById,
} from '../repositories/readingsRepository.js';
import { updateLatestReading, getLinkStatus } from './statusService.js';
import { broadcastReading, broadcastTextMessage } from './socketService.js';
import { broadcastSseReading, broadcastSseTextMessage } from './sseService.js';

let mqttClient = null;
let isBrokerConnected = false;
let lastHardwareSaveTime = 0;

const telemetryPacketSchema = z.object({
  ts: z.union([z.string(), z.number()]).optional(),
  deviceId: z.string().default('AUDIA-ESP32-01'),
  optical: z.number().min(0).max(4095),
  rf: z.number().min(0).max(4095),
  rssi: z.number().min(-120).max(10).default(0),
  opt_ok: z.boolean().optional(),
  rf_ok: z.boolean().optional(),
  preferred: z.string().optional().default('optical'),
  active: z.string().optional().default('none'),
});

/**
 * Initializes MQTT client and starts listening on the telemetry topic.
 */
export function initMqttService() {
  console.log(`[MQTT] Connecting to broker at ${config.mqttBrokerUrl}...`);

  try {
    mqttClient = mqtt.connect(config.mqttBrokerUrl, {
      reconnectPeriod: 5000,
      connectTimeout: 10000,
      clean: true,
      clientId: `audia-backend-${Math.random().toString(16).substring(2, 8)}`,
    });

    mqttClient.on('connect', () => {
      isBrokerConnected = true;
      console.log(`[MQTT] Connected to broker. Subscribing to "${config.mqttTopic}", "${config.mqttStatusTopic}", "${config.mqttCmdTopic}"`);
      mqttClient.subscribe([config.mqttTopic, config.mqttStatusTopic, config.mqttCmdTopic], (err) => {
        if (err) console.error('[MQTT] Subscription error:', err);
      });
    });

    mqttClient.on('message', async (topic, message) => {
      if (topic === config.mqttStatusTopic) {
        const statusStr = message.toString().trim();
        console.log(`[MQTT] Device status update: ${statusStr}`);
        return;
      }

      if (topic !== config.mqttTopic) return;

      try {
        const raw = JSON.parse(message.toString());

        // When a telemetry message has both "id" and "msg", update the row with that id
        if (raw.id !== undefined && raw.id !== null && raw.msg !== undefined && raw.msg !== null) {
          const msgId = Number(raw.id);
          if (!isNaN(msgId)) {
            const linkStr = raw.link ? String(raw.link).toUpperCase() : 'NONE';
            const isOk = linkStr !== 'NONE';

            try {
              const updatedRow = await updateTextMessageById(msgId, {
                received: String(raw.msg),
                link: linkStr,
                ok: isOk,
              });
              broadcastTextMessage(updatedRow);
              broadcastSseTextMessage(updatedRow);
            } catch (err) {
              console.warn(`[MQTT] Could not update TextMessage #${msgId}:`, err.message);
            }
          }
        }

        // Handle analog sensor reading if present
        if (typeof raw.optical === 'number' && typeof raw.rf === 'number') {
          const parsed = telemetryPacketSchema.parse(raw);

          // Throttle hardware database storage to at most 1 row per second
          const now = Date.now();
          if (now - lastHardwareSaveTime >= 1000) {
            lastHardwareSaveTime = now;
            await createHardwareReading({
              optical: parsed.optical,
              rf: parsed.rf,
              rssi: parsed.rssi,
              active: parsed.active,
              preferred: parsed.preferred,
            }).catch((dbErr) => {
              console.warn('[MQTT] Error saving hardware reading:', dbErr.message);
            });
          }

          // Also persist to general readings buffer & broadcast via Socket/SSE
          const saved = await createReading({
            ts: parsed.ts,
            deviceId: parsed.deviceId,
            optical: parsed.optical,
            rf: parsed.rf,
            rssi: parsed.rssi,
          });

          updateLatestReading(saved);
          const status = getLinkStatus();

          broadcastReading(saved, status);
          broadcastSseReading(saved, status);
        }
      } catch (err) {
        console.warn('[MQTT] Error processing telemetry packet:', err.message);
      }
    });

    mqttClient.on('error', (err) => {
      console.warn('[MQTT] Broker connection error:', err.message);
      isBrokerConnected = false;
    });

    mqttClient.on('offline', () => {
      isBrokerConnected = false;
    });
  } catch (e) {
    console.warn('[MQTT] Could not initialize MQTT client:', e.message);
  }
}

/**
 * Ingests a locally produced reading (e.g. from internal simulator)
 * @param {Object} data
 */
export async function ingestLocalReading(data) {
  try {
    const parsed = telemetryPacketSchema.parse(data);
    const saved = await createReading(parsed);
    updateLatestReading(saved);
    const status = getLinkStatus();

    broadcastReading(saved, status);
    broadcastSseReading(saved, status);
    return saved;
  } catch (err) {
    console.warn('[Ingest] Validation error on local packet:', err.message);
    throw err;
  }
}

/**
 * Publishes a command message to the MQTT cmd topic.
 * @param {Object|string} cmd
 * @returns {boolean}
 */
export function publishCmdMessage(cmd) {
  if (mqttClient && isBrokerConnected) {
    const payload = typeof cmd === 'string' ? cmd : JSON.stringify(cmd);
    mqttClient.publish(config.mqttCmdTopic, payload, { qos: 0 }, (err) => {
      if (err) console.warn('[MQTT] Error publishing cmd:', err.message);
      else console.log(`[MQTT] Published command to ${config.mqttCmdTopic}: ${payload}`);
    });
    return true;
  }
  return false;
}

/**
 * Returns MQTT connection health.
 * @returns {boolean}
 */
export function isMqttConnected() {
  return isBrokerConnected;
}


