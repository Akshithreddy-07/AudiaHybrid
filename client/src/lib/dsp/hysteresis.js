/**
 * Hysteresis Link Arbitration Engine
 * Prevents rapid flapping between Optical and RF channels in boundary conditions.
 */

export const LINK_STATES = {
  OPTICAL: 'OPTICAL',
  RF: 'RF',
  NONE: 'NONE',
};

/**
 * Arbitrates optimal link using hysteresis margins
 * @param {number} opticalMv - Instantaneous optical level in mV
 * @param {number} rfMv - Instantaneous RF level in mV
 * @param {string} currentLink - Current active link ('OPTICAL' | 'RF' | 'NONE')
 * @param {object} config - Threshold parameters
 * @returns {{ activeLink: string, reason: string }}
 */
export function arbitrateLink(
  opticalMv,
  rfMv,
  currentLink = LINK_STATES.NONE,
  config = {
    opticalMinThreshold: 200, // Below 200 mV, Optical considered obstructed
    rfMinThreshold: 150,      // Below 150 mV, RF is in squelch
    hysteresisMarginMv: 50,   // Optical must beat RF by 50 mV to switch back
  }
) {
  const { opticalMinThreshold, rfMinThreshold, hysteresisMarginMv } = config;

  // 1. If both are below squelch thresholds
  if (opticalMv < opticalMinThreshold && rfMv < rfMinThreshold) {
    return {
      activeLink: LINK_STATES.NONE,
      reason: 'Both channels below minimum squelch thresholds.',
    };
  }

  // 2. Optical is strong and exceeds RF + hysteresis margin
  if (opticalMv >= opticalMinThreshold) {
    if (currentLink === LINK_STATES.RF) {
      if (opticalMv > rfMv + hysteresisMarginMv) {
        return {
          activeLink: LINK_STATES.OPTICAL,
          reason: `Optical exceeded RF by +${opticalMv - rfMv} mV (hysteresis threshold met).`,
        };
      }
      return {
        activeLink: LINK_STATES.RF,
        reason: 'Holding RF link to prevent rapid channel flapping.',
      };
    }
    return {
      activeLink: LINK_STATES.OPTICAL,
      reason: 'Optical line-of-sight confirmed with zero RF electromagnetic interference.',
    };
  }

  // 3. Optical is obstructed, fallback to RF if above squelch
  if (rfMv >= rfMinThreshold) {
    return {
      activeLink: LINK_STATES.RF,
      reason: 'Optical line-of-sight lost (< 200 mV); switched to non-line-of-sight RF.',
    };
  }

  return {
    activeLink: currentLink,
    reason: 'Maintaining current link state.',
  };
}

/**
 * Named parameter step runner for interactive simulators
 */
export function runHysteresisStep({
  opticalLevelMv = 0,
  rfLevelMv = 0,
  currentLink = LINK_STATES.OPTICAL,
  upperThreshold = 200,
  lowerThreshold = 150,
} = {}) {
  let nextLink = currentLink;
  let switched = false;
  let reason = '';

  if (currentLink === LINK_STATES.OPTICAL) {
    if (opticalLevelMv < lowerThreshold) {
      nextLink = rfLevelMv >= lowerThreshold ? LINK_STATES.RF : LINK_STATES.NONE;
      switched = true;
      reason = `Optical signal dropped below ${lowerThreshold} mV threshold. Switched to ${nextLink}.`;
    }
  } else if (currentLink === LINK_STATES.RF) {
    if (opticalLevelMv >= upperThreshold) {
      nextLink = LINK_STATES.OPTICAL;
      switched = true;
      reason = `Optical signal recovered above ${upperThreshold} mV threshold. Switched to OPTICAL.`;
    } else if (rfLevelMv < lowerThreshold) {
      nextLink = LINK_STATES.NONE;
      switched = true;
      reason = 'Both RF and Optical signals below carrier thresholds.';
    }
  } else {
    // Current is NONE
    if (opticalLevelMv >= upperThreshold) {
      nextLink = LINK_STATES.OPTICAL;
      switched = true;
      reason = 'Optical carrier detected.';
    } else if (rfLevelMv >= upperThreshold) {
      nextLink = LINK_STATES.RF;
      switched = true;
      reason = 'RF carrier detected.';
    }
  }

  return {
    nextLink,
    switched,
    reason,
  };
}
