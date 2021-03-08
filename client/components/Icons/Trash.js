import PropTypes from 'prop-types';
import React from 'react';
import colors from '../../constants/colors';

const TrashIcon = ({ fill, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill={fill} {...props}>
    <path d="M5.1 4.6L5.1 1.5C5.1 0.6 5.7 0 6.5 0L13.5 0C14.3 0 15 0.6 15 1.5L15 4.6 18.6 4.6C19.4 4.6 20 5.2 20 6 20 6.8 19.4 7.5 18.6 7.5L1.4 7.5C0.6 7.5 0 6.8 0 6 0 5.2 0.6 4.6 1.4 4.6L5.1 4.6ZM8 4.6L12.1 4.6 12.1 2.9 8 2.9 8 4.6ZM2.4 9.7C2.4 8.9 3.1 8.2 3.9 8.2 4.7 8.2 5.3 8.9 5.3 9.7L5.3 18.1C5.3 18.7 5.7 19.1 6.3 19.1L13.7 19.1C14.3 19.1 14.7 18.7 14.7 18.1L14.7 9.7C14.7 8.9 15.3 8.2 16.1 8.2 16.9 8.2 17.6 8.9 17.6 9.7L17.6 18.1C17.6 20.3 15.9 22 13.7 22L6.3 22C4.1 22 2.4 20.3 2.4 18.1L2.4 9.7Z" />
  </svg>
);

TrashIcon.propTypes = {
  fill: PropTypes.string,
};

TrashIcon.defaultProps = {
  fill: colors.accentDark,
};

export default TrashIcon;
