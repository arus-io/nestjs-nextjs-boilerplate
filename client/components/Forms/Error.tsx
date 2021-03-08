import cx from 'classnames';
import React from 'react';

import styles from './Error.module.scss';

type FormErrorProps = {
  error: any;
  className?: string;
};

const FormError = ({ error, className, ...props }: FormErrorProps) => {
  if (!error) {
    return null;
  }

  return (
    <div className={cx(styles.error, className)} {...props}>
      {error}
    </div>
  );
};
export default FormError;
