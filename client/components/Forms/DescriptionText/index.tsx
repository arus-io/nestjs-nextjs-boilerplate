import React from 'react';

import styles from './DescriptionText.module.scss';

const DescriptionText = ({ children, ...rest }: React.HTMLAttributes<HTMLSpanElement>) => (
  <div className={styles.descriptionTextWrapper}>
    <span className={styles.helpText} {...rest}>
      {children}
    </span>
  </div>
);

export default DescriptionText;
