import { Field, Form, Formik } from 'formik';
import { withRouter } from 'next/router';
import React, { useState } from 'react';
import compose from 'recompose/compose';
import withProps from 'recompose/withProps';

import Button from '../../components/Button';
import FormError from '../../components/Forms/Error';
import Input from '../../components/Forms/Input';
import guestPage from '../../utils/guest-page';
import { fieldRequired, validEmail } from '../../utils/validators';
import styles from '../ResetPassword/ResetPasswordPage.module.scss';
import { ResetPageLayout } from '../ResetPassword/components/ResetPageLayout';
import { useForgotPasswordMutation } from '../../_gen/graphql';
import { toast } from 'react-toastify';

interface CompProps {
  email: string;
}

const PasswordPage = ({ email }: CompProps) => {
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const [forgotPasswordMutation] = useForgotPasswordMutation();

  const submitForgotPassword = async (values, { setSubmitting, resetForm }) => {
    const { email } = values;
    try {
      await forgotPasswordMutation({
        variables: {
          email
        }
      });
      resetForm();
      toast.success('Email was sent!');
    } catch (e) {
      setResetError(e.message || 'Please try again.');
    }
    setSubmitting(false);
  }

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
          initialValues={{ email: email || '' }}
          validate={(values) => {
            // @TODO:replace by schema validation
            const errors = {} as any;
            const error = fieldRequired(values.email) || validEmail(values.email);
            if (error) {
              errors.email = error;
            }
            return errors;
          }}
          onSubmit={submitForgotPassword}
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
};

const ForgotPasswordPage = compose(
  withRouter,
  withProps((ownProps) => ({
    ...ownProps,
    email: ownProps.router.query?.email,
  })),
)(PasswordPage);

export default guestPage(ForgotPasswordPage);
