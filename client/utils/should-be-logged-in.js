import hoistNonReactStatics from 'hoist-non-react-statics';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { Router } from '../router';

const shouldBeLoggedIn = (BaseComponent) => {
  class ShouldBeLoggedIn extends React.Component {
    componentDidUpdate() {
      const { loggedIn } = this.props;
      if (!loggedIn) {
        Router.push('/login');
      }
    }

    render() {
      // Filter dispatch and loggedIn props...why?
      const {
        loggedIn, // eslint-disable-line
        dispatch, // eslint-disable-line
        ...rest
      } = this.props;

      return React.createElement(BaseComponent, rest);
    }
  }

  ShouldBeLoggedIn.propTypes = {
    loggedIn: PropTypes.bool,
  };

  const ShouldBeLoggedInConnected = compose(
    withRouter,
    connect(({ auth }) => ({
      loggedIn: !!auth.me,
    })),
  )(ShouldBeLoggedIn);

  hoistNonReactStatics(ShouldBeLoggedInConnected, BaseComponent);

  ShouldBeLoggedInConnected.getInitialProps = async (props) => {
    const { res, req, store } = props;
    let state = store.getState();
    let passProps = {};
    if (state.auth.me) {
      if (BaseComponent.getInitialProps) {
        passProps = await BaseComponent.getInitialProps(props);
      } else {
        return {};
      }
    }
    state = store.getState();

    if (state.auth.me) {
      return passProps;
    }
    const backTo = !req || req.url === '/' ? '' : `?backTo=${encodeURIComponent(req.originalUrl)}`;
    if (res) {
      res.writeHead(302, {
        Location: `http://${req.subdomain || 'admin'}.${process.env.SITE_DOMAIN || 'localhost:3000'}/login${backTo}`,
      });
      res.end();
    } else {
      Router.push(`/login${backTo}`);
    }
    return {};
  };

  return ShouldBeLoggedInConnected;
};

export default shouldBeLoggedIn;
