import { io } from 'socket.io-client';

/** @type {import('socket.io-client').Socket | null} */
let socketInstance = null;

/**
 * Returns the shared Socket.io connection singleton
 * @returns {import('socket.io-client').Socket}
 */
export function getLiveSocket() {
  if (!socketInstance) {
    const socketUrl = (import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '');
    socketInstance = io(socketUrl ? `${socketUrl}/live` : '/live', {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }
  return socketInstance;
}
