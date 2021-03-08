import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './PlainInput.module.scss';

const PlainInput = ({ className, id, as: As, ...props }) => (
  <As id={id} name={id} className={cx(styles.input, className)} {...props} />
);

PlainInput.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  as: PropTypes.string,
};

PlainInput.defaultProps = {
  as: 'input',
};

export default PlainInput;

const RefInput = ({ className, id, ...rest }, forwardedRef) => (
  <input ref={forwardedRef} id={id} className={cx(styles.input, className)} {...rest} />
);

RefInput.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export const PlainInputWithRef = React.forwardRef(RefInput);
