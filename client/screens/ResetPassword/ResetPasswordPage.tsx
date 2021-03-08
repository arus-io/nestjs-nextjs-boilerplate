import { Field, Form, Formik } from 'formik';
import { withRouter } from 'next/router';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';

import { requestForgotPassword, setNewPassword } from '../../_core/api';
import { PasswordForm } from '../../components/AccountPasswordForm/AccountPasswordForm';
import Button from '../../components/Button';
import FormError from '../../components/Forms/Error';
import Input from '../../components/Forms/Input';
import { AuthLayoutWithCard } from '../../layouts/AuthLayout';
import guestPage from '../../utils/guest-page';
import { fieldRequired, validEmail } from '../../utils/validators';
import styles from './ResetPasswordPage.module.scss';

interface CompProps {
  requestForgotPassword: (v: any) => any;
  setNewPassword: (v: any) => any;
  email: string;
  resetToken: string;
  isWelcome: boolean;
}

const ResetPageLayout = ({ title, description, success, successMessage, children }: any) => {
  return (
    <AuthLayoutWithCard
      title={title}
      description={description}
      footer={
        <p>
          Need help?{' '}
          <a target="_blank" rel="noopener noreferrer">
            Contact us!
          </a>
        </p>
      }
    >
      {success ? <div style={{ paddingTop: 20, paddingBottom: 20 }}>{successMessage} </div> : children}
    </AuthLayoutWithCard>
  );
};

const ResetPage = ({ requestForgotPassword, setNewPassword, email, resetToken, isWelcome }: CompProps) => {
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const isForgotPage = !email;
  const onFormSubmit = async (formValues: any) => {
    const handler = isForgotPage
      ? (formVals) => requestForgotPassword(formVals)
      : ({ newPassword }) => setNewPassword({ email, resetToken, newPassword });

    setResetError('');
    setResetSuccess(false);
    let res;
    try {
      res = await handler(formValues);
    } catch (e) {
      setResetError(e?.message || 'Internal error');
      throw e;
    }
    if (res.success) {
      setResetSuccess(true);
    } else {
      setResetError(res.message || 'Please try again.');
      throw new Error(res.message); // avoid the form to reset
    }
  };

  if (isForgotPage) {
    return (
      <ResetPageLayout
        title="Forgot Password"
        description="Enter the email address associated with your account and we'll send you an message to reset your password"
        success={resetSuccess}
        successMessage={
          <p className={styles.successMessage}>
            A message has been sent to your email. Please follow instructions to continue
          </p>
        }
      >
        <Formik
          initialValues={{ email: '' }}
          validate={(values) => {
            // @TODO:replace by schema validation
            const errors = {} as any;
            const error = fieldRequired(values.email) || validEmail(values.email);
            if (error) {
              errors.email = error;
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await onFormSubmit(values);
            } catch (e) {
              /* */
            }
            // setTimeout(() => setSubmitting(false), 10);
          }}
        >
          {({ isSubmitting, isValid, values }) => (
            <Form>
              <FormError error={resetError} />
              <Field name="email">
                {({ field, meta }) => <Input label="Email" id="email" type="email" input={field} meta={meta} />}
              </Field>
              <Button
                color="primary"
                className={styles.button}
                type="submit"
                loading={isSubmitting}
                disabled={!isValid || !values.email || resetSuccess}
              >
                Reset
              </Button>
            </Form>
          )}
        </Formik>
      </ResetPageLayout>
    );
  }
  // else
  const title = isWelcome ? 'Set Your Password' : 'Reset Your Password';
  const description = isWelcome
    ? 'Enter a password to access your account'
    : 'Enter your new password to recover your account';
  return (
    <ResetPageLayout
      title={title}
      description={resetSuccess ? '' : description}
      success={resetSuccess}
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
      <PasswordForm handler={onFormSubmit} error={resetError} />
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
  connect(null, {
    requestForgotPassword,
    setNewPassword,
  }),
)(ResetPage);

export default guestPage(ResetPasswordPage);
