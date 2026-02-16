import { io } from 'socket.io-client';
import { API_BASE } from './api';

// strip trailing /api if present; when running on a serverless platform
// (e.g. Vercel) there won't be a socket endpoint available, so this will
// resolve to an empty string and the library will fall back to the current
// origin.  Connection attempts will then fail (they're harmless) and are
// logged by the `connect_error` handler below.
const SOCKET_URL = API_BASE.replace(/\/api\/?$/, '');

export const socket = io(SOCKET_URL);

// optional helper to wait for connection
socket.on('connect_error', (err) => {
  console.warn('socket connect error', err.message);
});
