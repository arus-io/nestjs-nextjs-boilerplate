import React from 'react';

import Box from '../../components/Box';
import Logo from '../../components/Logo';
import styles from './AuthLayout.module.scss';

// eslint-disable-next-line react/prop-types
export const AuthLayout: React.FC = ({ children }) => (
  <div className={styles.container}>
    <div className={styles.header}>
      <Logo height={32} width={116} />
    </div>
    {children}
  </div>
);

interface LayoutWithCardProps {
  children: React.ReactNode;
  title: string;
  description?: string | React.ReactNode;
  footer: any;
}
export const AuthLayoutWithCard = (p: LayoutWithCardProps) => (
  <AuthLayout>
    <Box className={styles.boxContainer}>
      <h1>{p.title}</h1>
      {p.description ? <p> {p.description} </p> : ''}
      {p.children}
    </Box>
    <div className={styles.footer}>{p.footer}</div>
  </AuthLayout>
);
