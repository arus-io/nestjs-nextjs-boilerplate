import React, { useState } from 'react';
import { connect } from 'react-redux';

import { IVerifyTwoStepMethodVM, verify2faMethodAction } from '../../../../_core/api';
import Button from '../../../../components/Button';
import FormError from '../../../../components/Forms/Error';
import PlainInput from '../../../../components/PlainInput/PlainInput';
import styles from './styles.module.scss';

interface IProps {
  label: string;
  buttonLabel: string;
  verifyTwoFactorAuthMethod: (payload: IVerifyTwoStepMethodVM) => Promise<string>;
  onVerified: () => void;
  tokenType: 'sms' | 'totp';
}

const VerifyCodeComponent = ({
  verifyTwoFactorAuthMethod,
  buttonLabel,
  label,
  tokenType = 'totp',
  onVerified,
}: IProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [error, setError] = useState<string>(null);

  function onCodeValueChanged(e) {
    setVerificationCode(e.target.value);
  }

  async function onActivate() {
    setLoading(true);
    error && setError(null);

    try {
      await verifyTwoFactorAuthMethod({
        token2fa: verificationCode,
        tokenType,
      });

      await onVerified();
    } catch (error) {
      console.error(error);
      setError(error.message || 'Something went wrong, please try again later.');
    }
    setLoading(false);
  }

  return (
    <>
      <p>{label}</p>
      <PlainInput
        type="number"
        id="qrCodeValue"
        value={verificationCode}
        onChange={onCodeValueChanged}
        as="input"
        className={styles.codeInput}
        min={0}
        max={10000}
      />
      <Button
        color="primary"
        className={styles.button}
        loading={loading}
        onClick={onActivate}
        disabled={!verificationCode || verificationCode.length !== 6}
      >
        {buttonLabel}
      </Button>

      <FormError error={error} />
    </>
  );
};

const VerifyCode = connect(null, {
  verifyTwoFactorAuthMethod: verify2faMethodAction,
})(VerifyCodeComponent);

export default VerifyCode;
