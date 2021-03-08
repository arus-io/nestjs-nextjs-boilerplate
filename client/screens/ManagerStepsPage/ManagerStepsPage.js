import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import shouldBeLoggedIn from '../../utils/should-be-logged-in';
import { fetchPlansAction } from '../../store/plans';
import ManagerStepsList from '../../components/ManagerStepsList';
import styles from './ManagerStepsPage.module.scss';

const ManagerStepsPage = ({ plans }) => {
  const content = plans && plans.length ? plans.map((plan) => <ManagerStepsList key={plan.id} plan={plan} />) : null;

  return (
    <>
      <div className={styles.header}>{plans && plans.length ? <h2>All My Steps</h2> : <h1>No Steps Found</h1>}</div>
      {content}
    </>
  );
};

ManagerStepsPage.propTypes = {
  plans: PropTypes.array,
};

const ManagerStepsPageEnhanced = compose(
  connect(({ plans, auth: { me } }) => {
    const allPlans = plans.all.map((id) => plans.byId[id]);
    const managerPlans = allPlans.filter((plan) => plan.managerId === me.id);

    return {
      plans: managerPlans,
      me,
    };
  }, {}),
)(ManagerStepsPage);

ManagerStepsPageEnhanced.getInitialProps = async ({ store }) => {
  await new Promise((resolve) => {
    store.dispatch(
      fetchPlansAction({
        resolve,
        reject: resolve,
      }),
    );
  });
  return {};
};

export default shouldBeLoggedIn(ManagerStepsPageEnhanced);
