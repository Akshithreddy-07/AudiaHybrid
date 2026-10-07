/**
 * @typedef {'optical' | 'rf' | 'both' | 'none'} RecommendedLink
 */

/**
 * @typedef {Object} HysteresisState
 * @property {RecommendedLink} currentRecommendation
 * @property {RecommendedLink} candidateRecommendation
 * @property {number} candidateCount
 */

/**
 * @typedef {Object} RecommendationResult
 * @property {RecommendedLink} recommendedLink
 * @property {string} plainReason
 * @property {string} adviceNote
 * @property {number} opticalPercentage
 * @property {number} rfPercentage
 * @property {boolean} isStale
 * @property {HysteresisState} nextState
 */

/** @type {HysteresisState} */
export const INITIAL_HYSTERESIS_STATE = {
  currentRecommendation: 'optical',
  candidateRecommendation: 'optical',
  candidateCount: 0,
};

/**
 * Computes recommendation with 3-second consecutive hysteresis
 * @param {number} [opticalCount=0]
 * @param {number} [rfCount=0]
 * @param {boolean} [isStale=false]
 * @param {HysteresisState} [prevState=INITIAL_HYSTERESIS_STATE]
 * @param {number} [thresholdCount=20]
 * @returns {RecommendationResult}
 */
export function evaluateLinkRecommendation(
  opticalCount = 0,
  rfCount = 0,
  isStale = false,
  prevState = INITIAL_HYSTERESIS_STATE,
  thresholdCount = 20
) {
  const ADVICE_NOTE = 'The physical link is chosen by the jumper on the receiver.';

  if (isStale) {
    return {
      recommendedLink: 'none',
      plainReason: 'Telemetry feed is stale; receiver link status cannot be verified.',
      adviceNote: ADVICE_NOTE,
      opticalPercentage: 0,
      rfPercentage: 0,
      isStale: true,
      nextState: {
        currentRecommendation: 'none',
        candidateRecommendation: 'none',
        candidateCount: 0,
      },
    };
  }

  const safeOptical = Math.max(0, opticalCount ?? 0);
  const safeRf = Math.max(0, rfCount ?? 0);

  const optPct = Math.round((safeOptical / 4095) * 100);
  const rfPct = Math.round((safeRf / 4095) * 100);

  let rawWinner = 'none';

  const optAbove = safeOptical >= thresholdCount;
  const rfAbove = safeRf >= thresholdCount;

  if (!optAbove && !rfAbove) {
    rawWinner = 'none';
  } else if (optAbove && !rfAbove) {
    rawWinner = 'optical';
  } else if (!optAbove && rfAbove) {
    rawWinner = 'rf';
  } else {
    // Both are above threshold. Check if one is >20% stronger than the other.
    if (safeOptical > safeRf * 1.2) {
      rawWinner = 'optical';
    } else if (safeRf > safeOptical * 1.2) {
      rawWinner = 'rf';
    } else {
      rawWinner = 'both';
    }
  }

  // Apply 3-reading hysteresis filter
  const state = prevState || INITIAL_HYSTERESIS_STATE;
  let newCurrent = state.currentRecommendation || 'optical';
  let newCandidate = state.candidateRecommendation || 'optical';
  let newCount = state.candidateCount || 0;

  if (rawWinner === state.currentRecommendation) {
    newCandidate = rawWinner;
    newCount = 0;
  } else {
    if (rawWinner === state.candidateRecommendation) {
      newCount = (state.candidateCount || 0) + 1;
      if (newCount >= 3) {
        newCurrent = rawWinner;
        newCount = 0;
      }
    } else {
      newCandidate = rawWinner;
      newCount = 1;
    }
  }

  // Generate plain English reason
  let plainReason = '';
  switch (newCurrent) {
    case 'optical':
      if (rfAbove) {
        plainReason = 'Optical clear and >20% stronger than RF; line-of-sight optimal.';
      } else {
        plainReason = 'RF below threshold; Optical carrying speech with zero EM noise.';
      }
      break;
    case 'rf':
      if (optAbove) {
        plainReason = 'RF >20% stronger; Optical experiencing shadowing/attenuation.';
      } else {
        plainReason = 'Optical blocked; RF carrying audio through non-line-of-sight path.';
      }
      break;
    case 'both':
      plainReason = 'Both links operating with balanced, strong signal margins.';
      break;
    case 'none':
    default:
      plainReason = 'Both links below squelch threshold; check transmitter power.';
      break;
  }

  return {
    recommendedLink: newCurrent,
    plainReason,
    adviceNote: ADVICE_NOTE,
    opticalPercentage: optPct,
    rfPercentage: rfPct,
    isStale: false,
    nextState: {
      currentRecommendation: newCurrent,
      candidateRecommendation: newCandidate,
      candidateCount: newCount,
    },
  };
}
