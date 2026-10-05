import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

/**
 * PillButton alias pointing to standard Button
 */
export default function PillButton(props) {
  return <Button {...props} />;
}

PillButton.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string,
  href: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.element]),
  iconPosition: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  ariaLabel: PropTypes.string,
};
