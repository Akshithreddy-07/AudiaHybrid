import React from 'react';
import { Sun, Radio, Wifi, Volume2 } from 'lucide-react';
import { useSensorData } from '../hooks/useSensorData.js';
import { useControls } from '../context/ControlsContext.jsx';
import { InstrumentTile } from '../components/tiles/InstrumentTile.jsx';
import { RecommendationTile } from '../components/tiles/RecommendationTile.jsx';
import { LiveStackedCharts } from '../components/charts/LiveStackedCharts.jsx';
import { LiveAudioPanel } from '../components/audio/LiveAudioPanel.jsx';
import { EventLogTable } from '../components/ui/EventLogTable.jsx';
import { LiveHardwarePanel } from '../components/LiveHardwarePanel.jsx';

export default function Dashboard() {
  const { points = [], latest = null, status = {}, events = [], clearEvents } = useSensorData();
  const { linkFocus = 'both', displayUnit = 'counts', yAxisMode = 'fixed', threshold = 20 } = useControls();

  // Extract sparkline history arrays safely
  const opticalHistory = (points || []).map((p) => p?.optical ?? 0);
  const rfHistory = (points || []).map((p) => p?.rf ?? 0);
  const rssiHistory = (points || []).map((p) => p?.rssi ?? -60);

  const optVal = latest ? latest.optical : null;
  const rfVal = latest ? latest.rf : null;
  const rssiVal = latest ? latest.rssi : null;
  const isStale = status?.stale ?? true;
  const linkStatus = status?.overall || 'none';

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Live Hardware Link Monitor (ESP32 / Wokwi MQTT Stream) */}
      <LiveHardwarePanel />

      {/* 1. Row of 4 Instrument Tiles */}
      <section aria-label="Key Instrument Tiles" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Optical Level */}
        <InstrumentTile
          channel="optical"
          title="Channel 01 • Optical Flux"
          icon={Sun}
          rawValue={optVal}
          displayUnit={displayUnit}
          isStale={isStale}
          historySparkline={opticalHistory}
          linkFocus={linkFocus}
          threshold={threshold}
        />

        {/* Tile 2: RF Level */}
        <InstrumentTile
          channel="rf"
          title="Channel 02 • RF Level"
          icon={Radio}
          rawValue={rfVal}
          displayUnit={displayUnit}
          isStale={isStale}
          historySparkline={rfHistory}
          linkFocus={linkFocus}
          threshold={threshold}
        />

        {/* Tile 3: Wi-Fi RSSI (ESP32 to router) */}
        <InstrumentTile
          channel="rssi"
          title="Wi-Fi RSSI (ESP32 to router)"
          icon={Wifi}
          rawValue={rssiVal}
          displayUnit={displayUnit}
          isStale={isStale}
          historySparkline={rssiHistory}
          linkFocus={linkFocus}
          threshold={threshold}
        />

        {/* Tile 4: Active Link State */}
        <InstrumentTile
          channel="link"
          title="Receiver Link Selection"
          icon={Volume2}
          linkStatus={linkStatus}
          isStale={isStale}
          historySparkline={opticalHistory}
          linkFocus={linkFocus}
          threshold={threshold}
        />
      </section>

      {/* 2. Link Recommendation Tile (Hysteresis-Filtered) */}
      <RecommendationTile
        opticalCount={optVal ?? 0}
        rfCount={rfVal ?? 0}
        isStale={isStale}
        threshold={threshold}
      />

      {/* 3. Three Stacked Line Charts */}
      <section aria-label="Multi-Channel Time-Series Charts">
        <LiveStackedCharts
          points={points}
          linkFocus={linkFocus}
          displayUnit={displayUnit}
          yAxisMode={yAxisMode}
          threshold={threshold}
        />
      </section>

      {/* 4. Two Column Bottom Grid: Audio Panel (Left) & Event Log (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <LiveAudioPanel />
        </div>
        <div className="lg:col-span-5">
          <EventLogTable events={events} onClear={clearEvents} />
        </div>
      </div>

    </div>
  );
}
