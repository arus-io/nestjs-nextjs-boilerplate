import React from 'react';

import Button from '../../../../components/Button';
import styles from './styles.module.scss';

interface IProps {
  loading: boolean;
  onTotpClick: () => void;
  onSMSClick: () => void;
}

const MethodSelector = ({ loading, onTotpClick, onSMSClick }: IProps) => {
  return (
    <>
      <p className={styles.introText}>
        Your company has forced all employees to enable Two Step Verification. Please select an authentication method:
      </p>
      <div className={styles.buttonsWrapper}>
        <Button color="primary" className={styles.button} loading={loading} onClick={onTotpClick}>
          Authenticator App
        </Button>
        <hr className={styles.divider} />
        <Button color="primary" className={styles.button} loading={loading} onClick={onSMSClick}>
          Phone Code (SMS)
        </Button>
      </div>
    </>
  );
};

export default MethodSelector;
