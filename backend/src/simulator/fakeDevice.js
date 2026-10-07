import { ingestLocalReading } from '../services/mqttService.js';
import { config } from '../config.js';

let step = 0;
let timerId = null;

/**
 * Generates a realistic telemetry frame based on simulated physics and breadboard circuit behaviour.
 * @returns {{ ts: string, deviceId: string, optical: number, rf: number, rssi: number }}
 */
export function generateSimulatedReading() {
  step++;
  const t = step * 0.1;

  // Optical channel: high SNR when line-of-sight is clear (~2400-3400 ADC counts).
  // Simulate an occasional line-of-sight blockage every 45 steps for 8 steps.
  const isBlocked = (step % 45) >= 30 && (step % 45) < 38;
  const opticalBase = isBlocked ? 350 : 2600 + Math.sin(t * 0.5) * 500;
  const opticalNoise = (Math.random() - 0.5) * 80;
  const optical = Math.max(0, Math.min(4095, Math.round(opticalBase + opticalNoise)));

  // RF 433 MHz channel: consistent signal (~1900-2600 ADC counts) with occasional EM noise dip.
  const isRfDip = (step % 60) >= 48 && (step % 60) < 54;
  const rfBase = isRfDip ? 800 : 2100 + Math.cos(t * 0.3) * 400;
  const rfNoise = (Math.random() - 0.5) * 120;
  const rf = Math.max(0, Math.min(4095, Math.round(rfBase + rfNoise)));

  // ESP32 Wi-Fi RSSI to access point (-65 to -48 dBm)
  const rssiBase = -58 + Math.sin(t * 0.05) * 8;
  const rssiNoise = (Math.random() - 0.5) * 3;
  const rssi = Math.max(-100, Math.min(-30, Math.round(rssiBase + rssiNoise)));

  return {
    ts: new Date().toISOString(),
    deviceId: config.deviceId,
    optical,
    rf,
    rssi,
  };
}

/**
 * Starts the internal continuous telemetry generator.
 * @param {number} [intervalMs=1000]
 */
export function startSimulator(intervalMs = 1000) {
  if (timerId) return;
  console.log(`[Simulator] Starting automated telemetry engine at 1 Hz (${intervalMs}ms interval)`);

  timerId = setInterval(async () => {
    try {
      const data = generateSimulatedReading();
      await ingestLocalReading(data);
    } catch (err) {
      console.error('[Simulator] Ingest cycle error:', err.message);
    }
  }, intervalMs);
}

/**
 * Stops the simulator timer.
 */
export function stopSimulator() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}
