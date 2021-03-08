import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import useSWR from 'swr';

import { getApiDataAction } from '../../../_core/api';
import BackButton from '../../../components/BackButton';
import shouldBeLoggedIn from '../../../utils/should-be-logged-in';
import { FormFieldsMapped } from '../../Hr/newLeave/mapFormDataToFields';
import { ILeaveFormDataVM, IUserLeaveVM } from '../../Hr/types';

const PolicyDetailsPage = ({ getApiData, router }) => {
  const { companyId } = router.query;

  const { data: policy, error: fetchLeaveDataError } = useSWR<{
    policyData: IUserLeaveVM;
    policyForm: ILeaveFormDataVM;
  }>(`/admin/companies/${companyId}/policy`, getApiData);

  if (!policy) {
    return <div>Loading...</div>;
  }

  if (fetchLeaveDataError) {
    return <div>Error getting profile information</div>;
  }

  const { policyData, policyForm } = policy;

  policyForm.initialValues = policyData;

  return (
    <>
      <BackButton href={`/companies/company?companyId=${companyId}`} />
      <FormFieldsMapped fields={policyForm.fields} formValues={policyData} formData={policyForm} />
    </>
  );
};

PolicyDetailsPage.propTypes = {
  getApiData: PropTypes.func,
  router: PropTypes.object,
};

const PolicyDetailsPageEnhanced = compose(
  withRouter,
  connect(null, {
    getApiData: getApiDataAction,
  }),
)(PolicyDetailsPage);

export default shouldBeLoggedIn(PolicyDetailsPageEnhanced);
