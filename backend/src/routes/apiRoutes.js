import { Router } from 'express';
import { z } from 'zod';
import {
  getRecentReadings,
  getHistory,
  getSummary,
  getHardwareReadings,
} from '../repositories/readingsRepository.js';
import { getLinkStatus } from '../services/statusService.js';
import { handleSseConnection } from '../services/sseService.js';
import { getActiveClientsCount } from '../services/socketService.js';
import { isMqttConnected, ingestLocalReading } from '../services/mqttService.js';
import { prisma } from '../prisma.js';

const router = Router();
const serverStartTime = Date.now();

// 1. GET /api/readings
const readingsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(1000).default(60),
  since: z.string().optional(),
  deviceId: z.string().optional(),
});

router.get('/readings', async (req, res, next) => {
  try {
    const query = readingsQuerySchema.parse(req.query);
    const data = await getRecentReadings(query);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// 2. GET /api/readings/history
const historyQuerySchema = z.object({
  hours: z.coerce.number().min(0.01).max(720).default(1),
  bucketSeconds: z.coerce.number().min(1).max(3600).default(10),
  deviceId: z.string().optional(),
});

router.get('/readings/history', async (req, res, next) => {
  try {
    const query = historyQuerySchema.parse(req.query);
    const data = await getHistory(query);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// 3. GET /api/readings/summary
const summaryQuerySchema = z.object({
  hours: z.coerce.number().min(0.01).max(720).default(24),
  deviceId: z.string().optional(),
});

router.get('/readings/summary', async (req, res, next) => {
  try {
    const query = summaryQuerySchema.parse(req.query);
    const data = await getSummary(query);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// 4. GET /api/status
router.get('/status', (req, res) => {
  const status = getLinkStatus();
  res.json(status);
});

// 5. GET /api/health
router.get('/health', async (req, res) => {
  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (_) {
    dbOk = false;
  }

  const brokerConnected = isMqttConnected();
  const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);

  let status = 'ok';
  if (!dbOk) status = 'error';
  else if (!brokerConnected) status = 'degraded';

  res.json({
    status,
    uptimeSeconds,
    brokerConnected,
    dbConnected: dbOk,
    activeClients: getActiveClientsCount(),
    timestamp: new Date().toISOString(),
  });
});

// 6. GET /api/stream (SSE)
router.get('/stream', handleSseConnection);

// 7. POST /api/telemetry (Direct ingest)
const postTelemetrySchema = z.object({
  optical: z.number().min(0).max(4095),
  rf: z.number().min(0).max(4095),
  rssi: z.number().min(-120).max(0),
  deviceId: z.string().optional(),
  ts: z.union([z.string(), z.number()]).optional(),
});

router.post('/telemetry', async (req, res, next) => {
  try {
    const body = postTelemetrySchema.parse(req.body);
    const saved = await ingestLocalReading(body);
    res.status(201).json({ status: 'ok', reading: saved });
  } catch (err) {
    next(err);
  }
});

// 8. GET /api/hardware/readings
const hardwareReadingsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(1000).default(100),
});

router.get('/hardware/readings', async (req, res, next) => {
  try {
    const query = hardwareReadingsQuerySchema.parse(req.query);
    const data = await getHardwareReadings(query);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;

