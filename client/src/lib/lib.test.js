import { describe, it, expect } from 'vitest';
import { convertCount, formatRssi } from './units.js';
import { calculateTelemetryStats } from './stats.js';
import { evaluateLinkRecommendation, INITIAL_HYSTERESIS_STATE } from './recommendation.js';
import { generateCsv } from './csv.js';

describe('Units Conversion (units.js)', () => {
  it('formats raw 12-bit ADC counts accurately', () => {
    const res = convertCount(2048, 'counts');
    expect(res.valueText).toBe('2048');
    expect(res.unitText).toBe('counts');
    expect(res.numericValue).toBe(2048);
  });

  it('formats percentage of full scale (0-4095)', () => {
    const res = convertCount(4095, 'percent', 1);
    expect(res.valueText).toBe('100.0');
    expect(res.unitText).toBe('%');

    const half = convertCount(2048, 'percent', 1);
    expect(half.valueText).toBe('50.0');
  });

  it('formats approximate mV using 3.3V reference (counts * 3300 / 4095)', () => {
    const res = convertCount(4095, 'mv', 1);
    expect(res.valueText).toBe('3300.0');
    expect(res.unitText).toBe('approx. mV');

    const zero = convertCount(0, 'mv', 1);
    expect(zero.valueText).toBe('0.0');
  });

  it('handles null/undefined gracefully', () => {
    const res = convertCount(null, 'mv');
    expect(res.valueText).toBe('---');
  });

  it('formats Wi-Fi RSSI in dBm', () => {
    const res = formatRssi(-62.4);
    expect(res.valueText).toBe('-62');
    expect(res.unitText).toBe('dBm');
  });
});

describe('Statistical Metrics (stats.js)', () => {
  const mockReadings = [
    { ts: 1000, optical: 100, rf: 200, rssi: -60 },
    { ts: 2000, optical: 150, rf: 250, rssi: -58 },
    { ts: 3000, optical: 200, rf: 300, rssi: -55 },
    { ts: 6000, optical: 300, rf: 400, rssi: -50 }, // 3s gap (> 2s dropped interval)
  ];

  it('detects dropped packet intervals (> 2s)', () => {
    const stats = calculateTelemetryStats(mockReadings);
    expect(stats.droppedIntervals).toBe(1);
    expect(stats.messageCount).toBe(4);
  });

  it('calculates min, mean, max and signal-to-floor ratios', () => {
    const stats = calculateTelemetryStats(mockReadings);
    expect(stats.optical.min).toBe(100);
    expect(stats.optical.max).toBe(300);
    expect(stats.optical.mean).toBeCloseTo(187.5, 1);
    expect(stats.optical.signalToFloorRatio).toBeGreaterThan(1);
  });
});

describe('Hysteresis Link Recommendation (recommendation.js)', () => {
  it('switches to Optical after 3 consecutive readings where Optical is >20% stronger', () => {
    let state = INITIAL_HYSTERESIS_STATE;

    // Reading 1: Optical = 500, RF = 200 (>20% stronger)
    let res = evaluateLinkRecommendation(500, 200, false, state, 20);
    expect(res.recommendedLink).toBe('optical'); // initial is optical
    state = res.nextState;

    // Simulate starting from RF
    state = {
      currentRecommendation: 'rf',
      candidateRecommendation: 'rf',
      candidateCount: 0,
    };

    // Candidate 1: Optical > RF
    res = evaluateLinkRecommendation(500, 200, false, state, 20);
    expect(res.recommendedLink).toBe('rf'); // Still RF (count = 1)
    state = res.nextState;

    // Candidate 2: Optical > RF
    res = evaluateLinkRecommendation(520, 200, false, state, 20);
    expect(res.recommendedLink).toBe('rf'); // Still RF (count = 2)
    state = res.nextState;

    // Candidate 3: Optical > RF
    res = evaluateLinkRecommendation(550, 200, false, state, 20);
    expect(res.recommendedLink).toBe('optical'); // Switched to optical on 3rd count!
  });

  it('flags stale state immediately when isStale is true', () => {
    const res = evaluateLinkRecommendation(500, 200, true, INITIAL_HYSTERESIS_STATE, 20);
    expect(res.recommendedLink).toBe('none');
    expect(res.isStale).toBe(true);
    expect(res.plainReason).toContain('stale');
  });
});

describe('CSV Generation (csv.js)', () => {
  const readings = [
    { ts: '2026-10-06T12:00:00.000Z', deviceId: 'ESP32-NODE-01', optical: 500, rf: 600, rssi: -55 },
  ];

  it('generates standard compliant CSV with header and units', () => {
    const csv = generateCsv(readings, 'counts', { generatedAt: '2026-10-06T12:00:00.000Z' });
    expect(csv).toContain('timestamp_iso,device_id,optical_level_adc_counts,rf_level_adc_counts,wifi_rssi_dbm_esp32_to_router');
    expect(csv).toContain('"2026-10-06T12:00:00.000Z","ESP32-NODE-01",500,600,-55');
  });
});
