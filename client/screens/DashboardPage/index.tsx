import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import LayoutContent from '../../components/LayoutContent';
import shouldBeLoggedIn from '../../utils/should-be-logged-in';

const DashboardPage = ({ plans, me, toDoForm, pendingApproval }) => {


  return (
    <LayoutContent>
      <h1>Welcome</h1>
    </LayoutContent>
  );
};

DashboardPage.propTypes = {
  me: PropTypes.object,
};

const DashboardPageEnhanced = compose(
  connect(
    ({ auth: { me } }) => ({
      me,
    }),
    {},
  ),
)(DashboardPage);


export default shouldBeLoggedIn(DashboardPageEnhanced);
