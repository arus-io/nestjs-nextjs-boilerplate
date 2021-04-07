import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { connect } from 'react-redux';

import { doLoginAction } from '../../_core/api';
import Button from '../../components/Button';
import FormError from '../../components/Forms/Error';
import Input from '../../components/Forms/Input';
import { AuthLayoutWithCard } from '../../layouts/AuthLayout';
import { Link } from '../../router';
import { getMeAction } from '../../store/auth/actions';
import guestPage from '../../utils/guest-page';
import { fieldRequired, validEmail } from '../../utils/validators';
import styles from './LoginPage.module.scss';
import TwoFactorPage from './TwoFactorPage';
import TwoFactorVerifyPage from './TwoFactorVerifyPage';
import {AuthResult, LoginMutationResult, useLoginMutation} from "../../_gen/graphql";
import {saveTokenClient} from "../../utils/cookies";

interface LoginProps {
  getMe: (any) => Promise<any>;
}

enum LOGIN_PHASE {
  NOT_AUTH,
  NEEDS_SECOND_FACTOR,
  NEEDS_CONFIGURE_2FA,
}
const Login = ({ getMe }: LoginProps) => {
  const [loginError, setLoginError] = useState('');
  const [loginPhase, setLoginPhase] = useState(LOGIN_PHASE.NOT_AUTH);
  const [loginData, setLoginData] = useState<AuthResult>();

  const [loginMutation] = useLoginMutation();

  const completeLogin = () => {
    // this completes redux store, and detects we're logged in
    return new Promise((resolve) => getMe({ resolve, reject: resolve }));
  };

  if (loginPhase === LOGIN_PHASE.NEEDS_CONFIGURE_2FA) {
    return <TwoFactorPage maskedPhone={loginData.existingPhone} onVerified={completeLogin} />;
  } else if (loginPhase === LOGIN_PHASE.NEEDS_SECOND_FACTOR) {
    return (
      <TwoFactorVerifyPage mfaType={loginData.type} maskedPhone={loginData.existingPhone} onVerified={completeLogin} />
    );
  }

  // LOGIN_PHASE.NOT_AUTH
  return (
    <AuthLayoutWithCard
      title="Login"
      footer={
        <Link href="/reset-password">
          <a>Forgot password?</a>
        </Link>
      }
    >
      <Formik
        initialValues={{ email: '', password: '' }}
        validate={(values) => {
          // @TODO:replace by schema validation
          const errors = {} as any;
          let error = fieldRequired(values.email) || validEmail(values.email);
          if (error) {
            errors.email = error;
          }
          error = fieldRequired(values.password);
          if (error) {
            errors.password = error;
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setLoginError('');
            // This call will set the response token in the store
            const { data: { login } } = await loginMutation({ variables: { email: values.email, password:values.password}});
            setLoginData(login);
            saveTokenClient(login.token)
            if (!login.needs2fa) {
              // done
              return completeLogin();
            }

            if (login.has2faVerified) {
              setLoginPhase(LOGIN_PHASE.NEEDS_SECOND_FACTOR);
              // Router.push(`/two-factor-verify?type=${response.type}`);
            } else {
              setLoginPhase(LOGIN_PHASE.NEEDS_CONFIGURE_2FA);
            }
          } catch (e) {
            setLoginError(e?.response?.message || (e?.message ?? 'There was a server error'));
          }
          setSubmitting(false);
        }}
      >
        {({
          isSubmitting,
          isValid,
          values,
          /* and other goodies */
        }) => (
          <Form>
            <FormError error={loginError} />
            <Field name="email">
              {({ field, meta }) => (
                <Input label="Email" id="email" type="email" input={field} meta={meta} autoComplete="email" />
              )}
            </Field>
            <Field name="password">
              {({ field, meta }) => (
                <Input label="Password" id="password" type="password" input={field} meta={meta} autoComplete="off" />
              )}
            </Field>
            <Button
              color="primary"
              className={styles.button}
              type="submit"
              loading={isSubmitting}
              disabled={!isValid || !values.email}
            >
              Log In
            </Button>
          </Form>
        )}
      </Formik>
    </AuthLayoutWithCard>
  );
};

const LoginPage = connect(null, {
  getMe: getMeAction,
})(Login);

export default guestPage(LoginPage);
