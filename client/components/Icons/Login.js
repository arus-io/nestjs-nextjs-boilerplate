import PropTypes from 'prop-types';
import React from 'react';
import colors from '../../constants/colors';

const Login = ({ size, fill }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20">
    <g fill={fill}>
      <path d="M11.1 8.5L10 7.4C9.5 6.8 9.5 5.9 10 5.3 10.6 4.7 11.6 4.7 12.2 5.3L15.8 8.9C16.3 9.5 16.3 10.5 15.8 11.1L12.2 14.7C11.6 15.3 10.6 15.3 10 14.7 9.5 14.1 9.5 13.2 10 12.6L11.1 11.5 1.5 11.5C0.7 11.5 0 10.8 0 10 0 9.2 0.7 8.5 1.5 8.5L11.1 8.5ZM17 3L8 3 8 5.4C8 6.2 7.3 6.9 6.5 6.9 5.7 6.9 5 6.2 5 5.4L5 2.7C5 1.2 6.2 0 7.7 0L17.3 0C18.8 0 20 1.2 20 2.7L20 17.3C20 18.8 18.8 20 17.3 20L7.7 20C6.2 20 5 18.8 5 17.3L5 14.6C5 13.8 5.7 13.1 6.5 13.1 7.3 13.1 8 13.8 8 14.6L8 17 17 17 17 3Z" />
    </g>
  </svg>
);

Login.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

Login.defaultProps = {
  size: 20,
  fill: colors.primary,
};

export default Login;
