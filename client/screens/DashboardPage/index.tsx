import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import LayoutContent from '../../components/LayoutContent';
import shouldBeLoggedIn from '../../utils/should-be-logged-in';

const DashboardPage = ({ me }) => {


  return (
    <LayoutContent>
      <h1>Welcome { me.firstName }  { me.lastName }</h1>
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
