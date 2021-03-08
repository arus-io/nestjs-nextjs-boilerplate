import { Field, Form, Formik } from 'formik';
import React from 'react';
import { connect } from 'react-redux';

import { updateCompanyForceTwoFactorAction } from '../../../_core/api';
import { useMyCompanyQuery } from '../../../_gen/graphql';
import Button from '../../../components/Button';
import Checkbox from '../../../components/Forms/Checkbox';
import FormError from '../../../components/Forms/Error';
import colors from '../../../constants/colors';
import shouldBeLoggedIn from '../../../utils/should-be-logged-in';
import styles from './CompanySettings.module.scss';

interface IWrapperProps {
  updateCompanyForceTwoFactor: (twoFactorEnabled: boolean) => (dispatch: any, getState: any) => Promise<any>;
}

interface IProps extends IWrapperProps {
  twoFactorEnabled: boolean;
}

const CompanySettings = ({ twoFactorEnabled, updateCompanyForceTwoFactor }: IProps) => {
  return (
    <Formik
      initialValues={{ twoFactorEnabled }}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          setSubmitting(true);
          await updateCompanyForceTwoFactor(values.twoFactorEnabled);
        } catch (e) {
          console.error(e);
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, isValid, errors }) => (
        <Form>
          <FormError error={errors.twoFactorEnabled} />
          <Field name="twoFactorEnabled">
            {({ field, meta }) => (
              <Checkbox
                text="Enforce Two Factor Authentication for all company users"
                id="twoFactorEnabled"
                input={field}
                meta={meta}
                fill={colors.primary}
              />
            )}
          </Field>
          <Button
            color="primary"
            className={styles.saveButton}
            type="submit"
            loading={isSubmitting}
            disabled={!isValid}
          >
            Save
          </Button>
        </Form>
      )}
    </Formik>
  );
};

const CompanySettingsWrapped = (props: IWrapperProps) => {
  const { data, loading, error } = useMyCompanyQuery({
    fetchPolicy: 'network-only',
  });

  if (error) return <div>There was an error fetching your information.</div>;
  if (loading || !data) return <div>Loading...</div>;
  const { twoFactorEnabled } = data.me.company;
  return <CompanySettings twoFactorEnabled={twoFactorEnabled} {...props} />;
};

const CompanySettingsTab = connect(null, {
  updateCompanyForceTwoFactor: updateCompanyForceTwoFactorAction,
})(CompanySettingsWrapped);

export default shouldBeLoggedIn(CompanySettingsTab);
