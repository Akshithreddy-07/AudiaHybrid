import dotenv from 'dotenv';
dotenv.config();

/**
 * Backend runtime configuration object.
 */
export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  mqttBrokerUrl: process.env.MQTT_BROKER_URL || 'mqtt://broker.hivemq.com:1883',
  mqttTopic: process.env.MQTT_TOPIC || 'audiahybrid/cyril-raj/telemetry',
  mqttStatusTopic: process.env.MQTT_STATUS_TOPIC || 'audiahybrid/cyril-raj/status',
  mqttCmdTopic: process.env.MQTT_CMD_TOPIC || 'audiahybrid/cyril-raj/cmd',
  deviceId: process.env.DEVICE_ID || 'AUDIA-ESP32-01',
  enableSimulator: process.env.ENABLE_INTERNAL_SIMULATOR === 'true',
  threshold: 1500, // ADC swing threshold for link active determination
};
