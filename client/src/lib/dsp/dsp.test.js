import { describe, it, expect } from 'vitest';
import { calculateRcCutoff, calculateBandpassGain } from './filters';
import { calculateRfChannel, calculateOpticalChannel } from './channel';
import { arbitrateLink, LINK_STATES } from './hysteresis';

describe('Analog DSP Calculations', () => {
  it('calculates RC cutoff accurately for as-built 4.7kΩ and 10nF components (~3.386 kHz)', () => {
    const fc = calculateRcCutoff(4700, 10e-9);
    expect(fc).toBeCloseTo(3386.27, 1);
  });

  it('rejects speech frequencies above 10 kHz through bandpass gain filter', () => {
    const voiceBandGain = calculateBandpassGain(1000); // 1 kHz voice
    const ultrasonicGain = calculateBandpassGain(15000); // 15 kHz noise
    expect(voiceBandGain).toBeGreaterThan(0.7);
    expect(ultrasonicGain).toBeLessThan(0.3);
  });
});

describe('Physical Channel Modeling', () => {
  it('attenuates RF signal with increasing distance and partition walls', () => {
    const clearNear = calculateRfChannel(5, 0);
    const wallDistant = calculateRfChannel(25, 2);
    expect(clearNear.levelMv).toBeGreaterThan(wallDistant.levelMv);
    expect(wallDistant.pathLossDb).toBeGreaterThan(clearNear.pathLossDb);
  });

  it('drops Optical level to near zero when beam is obstructed', () => {
    const clearOpt = calculateOpticalChannel(0, 0);
    const blockedOpt = calculateOpticalChannel(95, 0);
    expect(clearOpt.levelMv).toBeGreaterThan(500);
    expect(blockedOpt.levelMv).toBeLessThan(50);
    expect(blockedOpt.isLineOfSight).toBe(false);
  });
});

describe('Hysteresis Link Arbitration', () => {
  it('switches to Optical when Optical clearly exceeds RF by hysteresis margin', () => {
    const result = arbitrateLink(450, 300, LINK_STATES.RF);
    expect(result.activeLink).toBe(LINK_STATES.OPTICAL);
  });

  it('holds RF without flapping when Optical margin is too low', () => {
    const result = arbitrateLink(320, 300, LINK_STATES.RF); // Diff only 20 mV (< 50 mV margin)
    expect(result.activeLink).toBe(LINK_STATES.RF);
  });

  it('falls back to RF when Optical is obstructed below threshold', () => {
    const result = arbitrateLink(120, 350, LINK_STATES.OPTICAL);
    expect(result.activeLink).toBe(LINK_STATES.RF);
  });
});
