import React from 'react';
import Button from '../../components/Button';
import styles from './NotFoundPage.module.scss';

const NotFound = () => (
  <div className={styles.container}>
    <h1>404 Not Found</h1>
    <Button href="/">Go Home</Button>
  </div>
);

export default NotFound;
