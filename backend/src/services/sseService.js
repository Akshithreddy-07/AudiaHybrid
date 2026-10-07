import { getRecentReadings } from '../repositories/readingsRepository.js';
import { getLinkStatus } from './statusService.js';

/** @type {Set<import('express').Response>} */
const sseClients = new Set();

/**
 * Registers an HTTP response stream for Server-Sent Events.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function handleSseConnection(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  res.write(': heartbeat\n\n');
  sseClients.add(res);

  try {
    const snapshot = await getRecentReadings({ limit: 60 });
    const status = getLinkStatus();
    res.write(`event: snapshot\ndata: ${JSON.stringify(snapshot)}\n\n`);
    res.write(`event: status\ndata: ${JSON.stringify(status)}\n\n`);
  } catch (err) {
    console.error('[SSE] Error sending initial payload:', err);
  }

  req.on('close', () => {
    sseClients.delete(res);
  });
}

/**
 * Broadcasts a reading and status update to all active SSE subscribers.
 * @param {Object} reading
 * @param {Object} status
 */
export function broadcastSseReading(reading, status) {
  const payload = JSON.stringify({ reading, status });
  const statusPayload = JSON.stringify(status);

  for (const client of sseClients) {
    client.write(`event: reading\ndata: ${payload}\n\n`);
    client.write(`event: status\ndata: ${statusPayload}\n\n`);
  }
}
