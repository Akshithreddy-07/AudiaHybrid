import { Server } from 'socket.io';
import { getRecentReadings } from '../repositories/readingsRepository.js';
import { getLinkStatus } from './statusService.js';

/** @type {import('socket.io').Namespace | null} */
let liveNamespace = null;
let activeClientsCount = 0;

/**
 * Initializes Socket.io attached to the HTTP server.
 * @param {import('http').Server} httpServer
 */
export function initSocketService(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    path: '/socket.io',
  });

  liveNamespace = io.of('/live');

  liveNamespace.on('connection', async (socket) => {
    activeClientsCount++;
    console.log(`[Socket.io] Client connected (${socket.id}). Active count: ${activeClientsCount}`);

    try {
      // Send historical snapshot of the last 60 readings
      const snapshot = await getRecentReadings({ limit: 60 });
      socket.emit('snapshot', snapshot);

      // Send initial link status
      const status = getLinkStatus();
      socket.emit('status', status);
    } catch (err) {
      console.error('[Socket.io] Error sending connection snapshot:', err);
    }

    socket.on('disconnect', () => {
      activeClientsCount = Math.max(0, activeClientsCount - 1);
      console.log(`[Socket.io] Client disconnected (${socket.id}). Active count: ${activeClientsCount}`);
    });
  });
}

/**
 * Broadcasts a new telemetry reading and computed status to all connected clients.
 * @param {Object} reading
 * @param {Object} status
 */
export function broadcastReading(reading, status) {
  if (liveNamespace) {
    liveNamespace.emit('reading', { reading, status });
    liveNamespace.emit('status', status);
  }
}

/**
 * Broadcasts status changes.
 * @param {Object} status
 */
export function broadcastStatus(status) {
  if (liveNamespace) {
    liveNamespace.emit('status', status);
  }
}

/**
 * Broadcasts a text message to all connected clients.
 * @param {Object} message
 */
export function broadcastTextMessage(message) {
  if (liveNamespace) {
    liveNamespace.emit('text_message', message);
  }
}

/**
 * Returns current active client count.
 * @returns {number}
 */
export function getActiveClientsCount() {
  return activeClientsCount;
}

