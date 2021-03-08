import React from 'react';
import PropTypes from 'prop-types';

const Image = ({ width = 'initial', height = 'initial', className, src, alt, ...rest }) => (
  <img
    className={className}
    alt={alt}
    title={alt}
    src={src}
    style={{
      width,
      height,
    }}
    {...rest}
  />
);

Image.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
  src: PropTypes.string,
  alt: PropTypes.string,
};

export default Image;
