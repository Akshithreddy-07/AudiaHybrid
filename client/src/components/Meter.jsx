import React from 'react';
import PropTypes from 'prop-types';
import TelemetryMeter from './TelemetryMeter';

/**
 * Meter alias pointing to TelemetryMeter
 */
export default function Meter(props) {
  return <TelemetryMeter {...props} />;
}

Meter.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
  unit: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  channel: PropTypes.string,
  showTicks: PropTypes.bool,
  status: PropTypes.string,
  className: PropTypes.string,
};
