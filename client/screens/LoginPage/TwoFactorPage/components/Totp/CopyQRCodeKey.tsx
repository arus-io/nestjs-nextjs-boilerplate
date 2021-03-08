import React, { useRef } from 'react';

import Duplicate from '../../../../../components/Icons/Duplicate';
import { PlainInputWithRef } from '../../../../../components/PlainInput/PlainInput';
import styles from '../styles.module.scss';

interface IProps {
  qrCodeValue: string;
}

const CopyQRCodeKey = ({ qrCodeValue }: IProps) => {
  const qrCodeValueInput = useRef(null);

  function onCopyQRCodeURL() {
    qrCodeValueInput.current.select();
    document.execCommand('copy');
  }

  return (
    <>
      <p>Or copy the following URL:</p>
      <div className={styles.qrCopyURLContent}>
        <PlainInputWithRef
          readOnly
          ref={qrCodeValueInput}
          id="qr-code-url-value"
          as="input"
          value={qrCodeValue}
          className=""
        />
        <div className={styles.copyIconContainer} onClick={onCopyQRCodeURL}>
          <Duplicate width={30} height={33} />
        </div>
      </div>
    </>
  );
};

export default CopyQRCodeKey;
