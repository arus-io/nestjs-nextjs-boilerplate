import PropTypes from 'prop-types';
import React from 'react';

import colors from '../../constants/colors';

const EnvelopeIcon = ({ fill }) => (
  <svg height="30" viewBox="0 0 480 480" width="30" xmlns="http://www.w3.org/2000/svg" fill={fill}>
    <path d="m434.146 59.882h-389.234c-24.766 0-44.912 20.146-44.912 44.912v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159l-200.355 173.649-200.356-173.649c1.769-.736 3.704-1.159 5.738-1.159zm0 299.411h-389.234c-8.26 0-14.971-6.71-14.971-14.971v-251.648l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z" />
  </svg>
);

EnvelopeIcon.propTypes = {
  fill: PropTypes.string,
};

EnvelopeIcon.defaultProps = {
  fill: colors.lightText,
};

export default EnvelopeIcon;
