/**
 * Pure Digital Signal Processing (DSP) Filter Functions
 * Models analog RC bandpass and Sallen-Key active filter stages.
 */

/**
 * Calculates RC filter cutoff frequency: fc = 1 / (2 * pi * R * C)
 * @param {number} rOhms - Resistor value in Ohms (e.g. 4700 for 4.7 kΩ)
 * @param {number} cFarads - Capacitor value in Farads (e.g. 10e-9 for 10 nF)
 * @returns {number} Cutoff frequency in Hz
 */
export function calculateRcCutoff(rOhms, cFarads) {
  if (rOhms <= 0 || cFarads <= 0) {
    throw new Error('Component values must be positive non-zero numbers.');
  }
  return 1 / (2 * Math.PI * rOhms * cFarads);
}

/**
 * Simulates speech bandpass attenuation (300 Hz – 3400 Hz)
 * @param {number} frequencyHz - Input signal frequency in Hz
 * @param {number} lowCutoff - Low-pass / high-pass lower boundary (default 300 Hz)
 * @param {number} highCutoff - Upper cutoff boundary (default 3400 Hz)
 * @returns {number} Normalized amplitude gain multiplier (0.0 to 1.0)
 */
export function calculateBandpassGain(frequencyHz, lowCutoff = 300, highCutoff = 3400) {
  if (frequencyHz <= 0) return 0;
  
  // High-pass transfer function (1st order)
  const hpGain = frequencyHz / Math.sqrt(frequencyHz * frequencyHz + lowCutoff * lowCutoff);
  
  // Low-pass transfer function (1st order)
  const lpGain = highCutoff / Math.sqrt(frequencyHz * frequencyHz + highCutoff * highCutoff);
  
  return hpGain * lpGain;
}

/**
 * Generates test audio sweep array (time-domain waveform points)
 * @param {number} durationSeconds 
 * @param {number} sampleRate 
 * @param {number} startFreq 
 * @param {number} endFreq 
 * @returns {Float32Array}
 */
export function generateSineSweep(durationSeconds = 1.0, sampleRate = 44100, startFreq = 100, endFreq = 4000) {
  const numSamples = Math.floor(durationSeconds * sampleRate);
  const buffer = new Float32Array(numSamples);
  
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const currentFreq = startFreq + (endFreq - startFreq) * (t / durationSeconds);
    buffer[i] = Math.sin(2 * Math.PI * currentFreq * t);
  }
  
  return buffer;
}
