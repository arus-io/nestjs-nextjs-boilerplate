import QRCode from 'qrcode.react';
import React from 'react';

import colors from '../../../../../constants/colors';
import styles from '../styles.module.scss';

interface IProps {
  qrCodeValue: string;
}

const QRCodeDisplay = ({ qrCodeValue }: IProps) => {
  return (
    <QRCode
      value={qrCodeValue}
      size={128}
      bgColor={'#fff'}
      fgColor={colors.primary}
      level={'L'}
      includeMargin={false}
      renderAs={'svg'}
      className={styles.qrCode}
      imageSettings={{
        x: null,
        y: null,
        height: 24,
        width: 24,
        excavate: true,
      }}
    />
  );
};

export default QRCodeDisplay;
