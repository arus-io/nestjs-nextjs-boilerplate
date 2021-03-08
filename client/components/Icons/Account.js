import PropTypes from 'prop-types';
import React from 'react';

import colors from '../../constants/colors';

const AccountIcon = ({ fill, size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 30 30" fill={fill}>
    <path d="M15 0C6.8 0 0 6.8 0 15 0 23.3 6.8 30 15 30 23.3 30 30 23.3 30 15 30 6.8 23.3 0 15 0ZM22.7 23.1C21.9 21.8 20.4 21.2 18.8 20.6 17.4 20.3 17.1 19.5 16.9 18.4 18.9 17.6 20.6 15.6 20.6 13.1 20.6 9.9 18.2 7.5 15 7.5 11.8 7.5 9.4 9.9 9.4 13.1 9.4 15.6 10.9 17.6 13.1 18.4 12.9 19.5 12.6 20.3 11.3 20.6 9.6 21.2 8.1 21.8 7.3 23.1 5.1 21 3.8 18.2 3.8 15 3.8 8.8 8.8 3.8 15 3.8 21.2 3.8 26.3 8.8 26.3 15 26.3 18.2 24.9 21 22.7 23.1Z" />
  </svg>
);

AccountIcon.propTypes = {
  fill: PropTypes.string,
  size: PropTypes.number,
};

AccountIcon.defaultProps = {
  fill: colors.lightText,
  size: 30,
};

export default AccountIcon;
