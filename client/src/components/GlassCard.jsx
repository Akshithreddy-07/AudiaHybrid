import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

/**
 * GlassCard alias pointing to standard Card component
 */
export default function GlassCard(props) {
  return <Card {...props} />;
}

GlassCard.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.string,
  hover: PropTypes.bool,
  as: PropTypes.elementType,
};
