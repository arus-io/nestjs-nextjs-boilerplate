import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { locationChangeAction } from '../store/history';

class RouterHistory extends React.Component {
  componentDidUpdate(oldProps) {
    const {
      locationChange,
      router: { pathname },
    } = this.props;
    if (pathname !== oldProps.router.pathname) {
      locationChange(oldProps.router.pathname);
    }
  }

  render() {
    return null;
  }
}

RouterHistory.propTypes = {
  router: PropTypes.object,
  locationChange: PropTypes.func,
};

export default compose(
  withRouter,
  connect(null, {
    locationChange: locationChangeAction,
  }),
)(RouterHistory);
