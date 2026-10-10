-- CreateTable
CREATE TABLE "Reading" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ts" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deviceId" TEXT NOT NULL DEFAULT 'AUDIA-ESP32-01',
    "optical" INTEGER NOT NULL,
    "rf" INTEGER NOT NULL,
    "rssi" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "HardwareReading" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "optical" INTEGER NOT NULL,
    "rf" INTEGER NOT NULL,
    "rssi" INTEGER NOT NULL,
    "active" TEXT NOT NULL,
    "preferred" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TextMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent" TEXT,
    "received" TEXT,
    "link" TEXT,
    "ok" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE INDEX "Reading_ts_idx" ON "Reading"("ts");

-- CreateIndex
CREATE INDEX "Reading_deviceId_idx" ON "Reading"("deviceId");

-- CreateIndex
CREATE INDEX "HardwareReading_createdAt_idx" ON "HardwareReading"("createdAt");

-- CreateIndex
CREATE INDEX "TextMessage_createdAt_idx" ON "TextMessage"("createdAt");
