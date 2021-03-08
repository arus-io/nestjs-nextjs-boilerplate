import React from 'react';

import styles from './AllComponentStyles.module.scss';

export const PageTitle = (props: { title: any; children?: any }) => (
  <div className={styles.header}>
    <div className={styles.titleContainer}>
      <h2 className={styles.title}>{props.title}</h2>
    </div>
    <div className={styles.btnsContainer}>{props.children}</div>
  </div>
);
