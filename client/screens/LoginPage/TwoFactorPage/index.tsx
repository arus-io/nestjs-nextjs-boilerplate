import React, { useState } from 'react';
import { connect } from 'react-redux';

import { enable2faMethodAction, ITwoFactorEnableVM } from '../../../_core/api';
import FormError from '../../../components/Forms/Error';
import { AuthLayoutWithCard } from '../../../layouts/AuthLayout';
import MethodSelector from './components/MethodSelector';
import SMSVerification from './components/SMS/SMSVerification';
import QRCodeDisplay from './components/Totp/QRCode';
import VerifyCode from './components/VerifyCode';
import styles from './TwoFactorPage.module.scss';

export enum TWO_FA_METHODS {
  TOTP = 'totp',
  SMS = 'sms',
}

enum STEPS {
  METHOD_SELECT = 'METHOD_SELECT',
  TOTP = 'TOTP',
  SMS = 'SMS',
  ADD_PHONE = 'ADD_PHONE',
}

interface IProps {
  enableTwoFactorAuthMethod: (method: TWO_FA_METHODS, newPhone?: string) => Promise<ITwoFactorEnableVM>;
  maskedPhone: string;
  onVerified: () => void;
}

const TwoFactorComponent = ({ enableTwoFactorAuthMethod, maskedPhone, onVerified }: IProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [step, setStep] = useState<STEPS>(STEPS.METHOD_SELECT);
  const [qrCodeValue, setQrCodeValue] = useState<string>();
  const [error, setError] = useState<string>();

  async function onTotpSelected() {
    setLoading(true);

    try {
      const totpRes = await enableTwoFactorAuthMethod(TWO_FA_METHODS.TOTP);

      setQrCodeValue(totpRes.otpauthURL);
      setStep(STEPS.TOTP);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
    setLoading(false);
  }

  async function onSMSSelected() {
    // we don't immediately send a code, let the user set up his phone
    setStep(STEPS.SMS);
  }

  async function requestSMSCode(newPhone?: string) {
    setLoading(true);
    try {
      await enableTwoFactorAuthMethod(TWO_FA_METHODS.SMS, newPhone);
    } catch (error) {
      console.error(error);
      setError(error.response.message);
    }
    setLoading(false);
  }

  return (
    <AuthLayoutWithCard
      title="Two Step Verification"
      footer={
        step !== STEPS.METHOD_SELECT ? (
          <a className={styles.footerText} onClick={() => setStep(STEPS.METHOD_SELECT)}>
            Pick Another Method
          </a>
        ) : null
      }
    >
      <div className={styles.contentWrapper}>
        {step === STEPS.METHOD_SELECT ? (
          <MethodSelector loading={loading} onSMSClick={onSMSSelected} onTotpClick={onTotpSelected} />
        ) : null}
        {step === STEPS.TOTP && !loading ? (
          <div className={styles.totpContent}>
            <p>
              You need to install an Authenticator Application capable of genarating secure 2-step Verification codes.
              Then set it up by scanning the QR Code:
            </p>
            <QRCodeDisplay qrCodeValue={qrCodeValue} />
            <hr className={styles.divider} />
            <VerifyCode
              onVerified={onVerified}
              buttonLabel="Activate"
              label="Get a valid code from the Application and enter the 6 digits below:"
            />
          </div>
        ) : null}
        {step === STEPS.SMS ? (
          <SMSVerification sendSMSCode={requestSMSCode} maskedPhone={maskedPhone} loading={loading}>
            <div className={styles.totpContent}>
              <VerifyCode
                onVerified={onVerified}
                buttonLabel="Activate"
                label="Once you get the code, please enter the 6 digits below:"
                tokenType="sms"
              />
            </div>
          </SMSVerification>
        ) : null}
        {error ? <FormError error={error} /> : null}
      </div>
    </AuthLayoutWithCard>
  );
};

const TwoFactorPage = connect(null, {
  enableTwoFactorAuthMethod: enable2faMethodAction,
})(TwoFactorComponent);

export default TwoFactorPage;
