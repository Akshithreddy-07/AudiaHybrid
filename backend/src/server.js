import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config.js';
import apiRoutes from './routes/apiRoutes.js';
import { initSocketService } from './services/socketService.js';
import { initMqttService } from './services/mqttService.js';
import { startSimulator } from './simulator/fakeDevice.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const server = http.createServer(app);

// Security & Logging Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Permit local websockets & inline styles for dashboard tools
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API Routes
app.use('/api', apiRoutes);

// Fallback & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize Real-time Transport Services
initSocketService(server);
initMqttService();

// Start Simulated ESP32 Telemetry Engine if enabled
if (config.enableSimulator) {
  startSimulator(1000);
}

// Start HTTP Server
server.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`AudiaHybrid Hardware Telemetry Bridge`);
  console.log(`Server listening on http://localhost:${config.port}`);
  console.log(`Socket.io namespace: /live`);
  console.log(`SSE endpoint:        http://localhost:${config.port}/api/stream`);
  console.log(`Health check:        http://localhost:${config.port}/api/health`);
  console.log(`=======================================================`);
});
