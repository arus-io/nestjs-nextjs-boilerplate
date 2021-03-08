import React, { useState } from 'react';

import PlainPhoneNumberInput from '../../../../../components/Forms/PhoneField/PlainPhoneField';
import { validPhone } from '../../../../../utils/validators';
import styles from '../styles.module.scss';
import CounterButton from './CounterButton';

interface IProps {
  maskedPhone: string;
  sendSMSCode: any;
  children: any;
  loading: any;
}

const SMSVerificationComponent = ({ sendSMSCode, maskedPhone, children, loading }: IProps) => {
  const [phone, setPhone] = useState<string>('');

  function onSendSMSCode() {
    sendSMSCode(phone);
  }

  const isValid = validPhone(phone) === undefined;

  const introText = maskedPhone ? (
    <span>
      We{"'"}ll send you a 6-digit code to the following phone:
      <p>
        <b>{maskedPhone}</b>
      </p>
      Or you can enter a new number (optional)
    </span>
  ) : (
    'Enter your mobile phone to receive a secure code.'
  );

  return (
    <div className={styles.smsVerificationToken}>
      <div>{introText}</div>
      <PlainPhoneNumberInput
        alwaysShowMask
        className={styles.phoneInput}
        id="phone"
        disabled={loading}
        value={phone}
        onChange={setPhone}
      />
      <CounterButton
        onButtonClick={onSendSMSCode}
        disabled={loading || !isValid || (!phone && !maskedPhone)}
        defaultButtonLabel="Send"
        className={styles.button}
      />
      {children}
    </div>
  );
};

export default SMSVerificationComponent;
