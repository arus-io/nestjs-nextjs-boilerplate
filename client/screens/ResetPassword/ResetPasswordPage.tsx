import { withRouter } from 'next/router';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';

import AccountPasswordForm from '../../components/AccountPasswordForm/AccountPasswordForm';
import Button from '../../components/Button';
import guestPage from '../../utils/guest-page';
import styles from './ResetPasswordPage.module.scss';
import { ResetPageLayout } from './components/ResetPageLayout';

interface CompProps {
  setNewPassword: (v: any) => any;
  email: string;
  resetToken: string;
  isWelcome: boolean;
}

const ResetPage = ({ setNewPassword, email, resetToken, isWelcome }: CompProps) => {
  const title = isWelcome ? 'Set Your Password' : 'Reset Your Password';
  const description = isWelcome
    ? 'Enter a password to access your account'
    : 'Enter your new password to recover your account';
  return (
    <ResetPageLayout
      title={title}
      // description={resetSuccess ? '' : description}
      // success={resetSuccess}
      successMessage={
        <p className={styles.successMessage}>
          Your password has been updated. Login below.
          <br />
          <br />
          <Button color="primary" className={styles.button} type="submit" href={'/login'}>
            Login
          </Button>
        </p>
      }
    >
      <AccountPasswordForm email={email} resetToken={resetToken} />
    </ResetPageLayout>
  );
};

const ResetPasswordPage = compose(
  withRouter,
  withProps((ownProps) => ({
    ...ownProps,
    email: ownProps.router.query?.email,
    resetToken: ownProps.router.query?.resetToken,
    isWelcome: ownProps.router.query?.welcome == 1,
  })),
  connect(null, {}),
)(ResetPage);

export default guestPage(ResetPasswordPage);
