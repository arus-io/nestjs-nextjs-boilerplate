import PropTypes from 'prop-types';
import React from 'react';

import colors from '../../constants/colors';

interface IProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  fill?: string;
}

const Undo = ({ size, fill, ...props }: IProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={fill} viewBox="0 0 455 455" {...props}>
    <g fill="none">
      <g fill={fill}>
        <path
          d="M404.908,283.853c0,94.282-76.71,170.986-170.986,170.986h-60.526c-10.03,0-18.158-8.127-18.158-18.157v-6.053
		c0-10.031,8.127-18.158,18.158-18.158h60.526c70.917,0,128.618-57.701,128.618-128.618c0-70.917-57.701-128.618-128.618-128.618
		H122.255l76.905,76.905c8.26,8.257,8.26,21.699,0,29.956c-8.015,8.009-21.964,7.997-29.961,0L56.137,149.031
		c-4.001-4.001-6.206-9.321-6.206-14.981c0-5.656,2.205-10.979,6.206-14.978L169.205,6.002c7.997-8.003,21.958-8.003,29.956,0
		c8.26,8.255,8.26,21.699,0,29.953l-76.905,76.911h111.666C328.198,112.866,404.908,189.573,404.908,283.853z"
        />
      </g>
    </g>
  </svg>
);

Undo.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

Undo.defaultProps = {
  size: 16,
  fill: colors.primary,
};

export default Undo;
