/**
 * Physical Channel Propagation & Noise Models
 * Pure functions modeling RF free-space path loss, multipath echoes, and optical beam occlusion.
 */

/**
 * Calculates RF signal attenuation in millivolts
 * @param {number} distanceMeters - Distance between Tx and Rx (1 to 50 m)
 * @param {number} wallCount - Number of intervening partition walls (0 to 3)
 * @param {number} noiseFloorDb - Thermal/EM noise floor in dBm (e.g. -90 dBm)
 * @returns {{ levelMv: number, snrDb: number, pathLossDb: number }}
 */
export function calculateRfChannel(distanceMeters = 10, wallCount = 0, noiseFloorDb = -90) {
  const d = Math.max(1, distanceMeters);
  const wallAttenuationDb = wallCount * 8.5; // ~8.5 dB per drywall partition
  
  // Log-distance path loss model: PL(d) = PL0 + 20*log10(d) + walls
  const baseLossDb = 20 * Math.log10(d) + wallAttenuationDb;
  const txPowerDbm = 10; // +10 dBm transmit power
  const receivedDbm = txPowerDbm - baseLossDb;
  
  const snrDb = Math.max(0, receivedDbm - noiseFloorDb);
  
  // Convert received RF envelope to demodulated millivolts (0 to 650 mV scale)
  const normalizedGain = Math.max(0, Math.min(1, (receivedDbm + 85) / 75));
  const levelMv = Math.round(normalizedGain * 580);
  
  return {
    levelMv,
    snrDb: Math.round(snrDb),
    pathLossDb: Math.round(baseLossDb),
  };
}

/**
 * Named parameter wrapper for RF Link calculation
 */
export function calculateRfLink({
  distanceMeters = 10,
  walls = 0,
  multipathTaps = 3,
  emInterference = 0,
} = {}) {
  const channel = calculateRfChannel(distanceMeters, walls, -90 + emInterference);
  return {
    rfLevelMv: channel.levelMv,
    snrDb: channel.snrDb,
    pathLossDb: channel.pathLossDb,
  };
}

/**
 * Calculates Optical signal level based on line-of-sight obstruction and ambient light
 * @param {number} obstructionPercent - Physical beam blockage (0 to 100%)
 * @param {number} angleDegrees - Off-axis receiver tilt angle (0 to 45 deg)
 * @param {number} ambientHumPercent - 100 Hz fluorescent lighting ripple (0 to 100%)
 * @returns {{ levelMv: number, isLineOfSight: boolean, humNoiseMv: number }}
 */
export function calculateOpticalChannel(obstructionPercent = 0, angleDegrees = 0, ambientHumPercent = 10) {
  const obstruction = Math.max(0, Math.min(100, obstructionPercent)) / 100;
  const angleRad = (Math.max(0, Math.min(60, angleDegrees)) * Math.PI) / 180;
  
  // Lambertian cosine radiation pattern: I = I0 * cos(theta)
  const angularFactor = Math.max(0, Math.cos(angleRad));
  const clearBeamGain = (1 - obstruction) * angularFactor;
  
  const peakCleanMv = 620;
  const baseSignalMv = Math.round(clearBeamGain * peakCleanMv);
  const humNoiseMv = Math.round((ambientHumPercent / 100) * 45);
  
  const totalReceivedMv = Math.max(0, baseSignalMv);
  
  return {
    levelMv: totalReceivedMv,
    isLineOfSight: obstruction < 0.65 && angleDegrees < 40,
    humNoiseMv,
  };
}

/**
 * Named parameter wrapper for Optical Link calculation
 */
export function calculateOpticalLink({
  distanceMeters = 3,
  obstructionFraction = 0,
  ambientHum100Hz = 0.05,
  alignmentAngleDeg = 0,
} = {}) {
  const obstructionPct = obstructionFraction * 100;
  const humPct = ambientHum100Hz * 100;
  const channel = calculateOpticalChannel(obstructionPct, alignmentAngleDeg, humPct);
  
  // Apply inverse square law with distance
  const distanceAtten = 1 / Math.max(1, (distanceMeters / 2) ** 1.8);
  const opticalLevelMv = Math.round(channel.levelMv * distanceAtten);

  return {
    opticalLevelMv,
    isLineOfSight: channel.isLineOfSight,
    humNoiseMv: channel.humNoiseMv,
  };
}
