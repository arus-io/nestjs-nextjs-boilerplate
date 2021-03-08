import React, { useState } from 'react';
import { connect } from 'react-redux';

import { ITwoFactorEnableVM, request2faSMSAction } from '../../../_core/api';
import { AuthLayoutWithCard } from '../../../layouts/AuthLayout';
import { TWO_FA_METHODS } from '../TwoFactorPage';
import CounterButton from '../TwoFactorPage/components/SMS/CounterButton';
import VerifyCode from '../TwoFactorPage/components/VerifyCode';
import styles from './TwoFactorVerifyPage.module.scss';

interface IProps {
  mfaType: TWO_FA_METHODS;
  maskedPhone?: string;
  request2faSMS: () => Promise<ITwoFactorEnableVM>;
  onVerified: () => any;
}

const TwoFactorVerifyPage = ({ mfaType, request2faSMS, maskedPhone, onVerified }: IProps) => {
  const [verifying, setVerifying] = useState<boolean>(false);

  function onVerifiedSuccess() {
    setVerifying(true);

    try {
      onVerified();
    } catch (error) {
      console.error(error);
      setVerifying(false);
    }
  }

  async function requestSMSCode() {
    try {
      await request2faSMS();
    } catch (error) {
      console.error(error);
      // Swallow error and make user wait 1 minute until requesting again
      // setError(error.response.message); @TODO - this was inside the Verify, do we show?
    }
  }

  const isSMSMfaType = mfaType === 'sms';
  const description = isSMSMfaType ? (
    <>
      A 6-digit code was sent to the following phone:
      <p className={styles.verifyCodeContent}>
        <b>{maskedPhone}</b>
      </p>
    </>
  ) : (
    'Enter a valid 6-digit code to complete log in.'
  );

  return (
    <AuthLayoutWithCard title="2 Step verification" description={description} footer={null}>
      <div className={styles.verifyCodeContent}>
        <VerifyCode buttonLabel="Login" label="" tokenType={mfaType} onVerified={onVerifiedSuccess} />
        {mfaType === 'sms' ? (
          <>
            <hr className={styles.divider} />
            <div>
              {`Didn't get the message?`}
              <CounterButton
                defaultButtonLabel="Resend"
                disabled={verifying}
                onButtonClick={requestSMSCode}
                className={styles.resendButton}
              />
            </div>
          </>
        ) : null}
      </div>
    </AuthLayoutWithCard>
  );
};

const TwoFactorVerifyPageEnhanced = connect(null, {
  request2faSMS: request2faSMSAction,
})(TwoFactorVerifyPage);

export default TwoFactorVerifyPageEnhanced;
