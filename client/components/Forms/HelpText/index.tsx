import React from 'react';

import styles from './HelpText.module.scss';

const HelpText = ({ children, ...rest }: React.HTMLAttributes<HTMLSpanElement>) => (
  <div className={styles.helpTextWrapper}>
    <span className={styles.helpText} {...rest}>
      {children}
    </span>
  </div>
);

export default HelpText;
