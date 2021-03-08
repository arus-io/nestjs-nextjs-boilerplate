import PropTypes from 'prop-types';
import React from 'react';
import colors from '../../constants/colors';

const LinkIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <path d="M8.2 7.8C7.8 7.4 7.8 6.8 8.2 6.4 8.6 6 9.2 6 9.6 6.4 11.3 8 11.3 10.7 9.6 12.4L7.8 14.3C6.1 15.9 3.4 15.9 1.7 14.3 0.1 12.6 0.1 9.9 1.8 8.2L3.4 6.6C3.8 6.3 4.4 6.3 4.8 6.7 5.2 7 5.2 7.7 4.8 8.1L3.1 9.6C2.3 10.5 2.3 12 3.1 12.9 4 13.7 5.5 13.7 6.4 12.9L8.2 11C9.1 10.1 9.1 8.7 8.2 7.8ZM7.8 8.2C8.2 8.6 8.2 9.2 7.8 9.6 7.4 10 6.8 10 6.4 9.6 4.7 8 4.7 5.3 6.4 3.6L8.2 1.7C9.9 0.1 12.6 0.1 14.3 1.7 15.9 3.4 15.9 6.1 14.2 7.8L12.6 9.4C12.2 9.7 11.6 9.7 11.2 9.3 10.8 9 10.8 8.3 11.2 7.9L12.9 6.4C13.7 5.5 13.7 4 12.9 3.1 12 2.3 10.5 2.3 9.6 3.1L7.8 5C6.9 5.9 6.9 7.3 7.8 8.2Z" />
  </svg>
);

LinkIcon.propTypes = {
  fill: PropTypes.string,
  className: PropTypes.string,
};

LinkIcon.defaultProps = {
  fill: colors.text,
};

export default LinkIcon;
