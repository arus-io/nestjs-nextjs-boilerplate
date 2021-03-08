import React, { useEffect, useState } from 'react';

import Button from '../../../../../components/Button';

interface IProps {
  defaultButtonLabel: string;
  onButtonClick: () => void;
  disabled?: boolean;
  className?: string;
}

const ResendButton = ({ onButtonClick, defaultButtonLabel, disabled, className }: IProps) => {
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    if (!counter) return;

    const intervalId = setInterval(() => {
      setCounter(counter - 1);
    }, 1000);

    // cleanup
    return () => clearInterval(intervalId);
  }, [counter]);

  function onClick() {
    setCounter(59);

    onButtonClick();
  }

  const buttonLabel = counter === 0 ? defaultButtonLabel : counter.toString();

  return (
    <Button
      color="primary"
      className={className ? className : null}
      onClick={onClick}
      disabled={counter !== 0 || disabled}
    >
      {buttonLabel}
    </Button>
  );
};

export default ResendButton;
