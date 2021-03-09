import hoistNonReactStatics from 'hoist-non-react-statics';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { Router } from '../router';

const guestPage = (BaseComponent) => {
  class GuestPage extends React.Component {
    componentDidUpdate() {
      const { me, router } = this.props;
      if (me) {
        const nextUrl = router.query.backTo ?? '/';
        Router.push(nextUrl);
      }
    }

    render() {
      return React.createElement(BaseComponent, this.props);
    }
  }

  GuestPage.propTypes = {
    me: PropTypes.object,
    router: PropTypes.object,
  };

  const GuestPageConnected = compose(
    withRouter,
    connect(({ auth }) => ({
      me: auth.me,
    })),
  )(GuestPage);

  hoistNonReactStatics(GuestPageConnected, BaseComponent);

  GuestPageConnected.getInitialProps = (props) => {
    const { res, req, store } = props;
    const state = store.getState();
    if (!state.auth.me) {
      if (BaseComponent.getInitialProps) {
        return BaseComponent.getInitialProps(props);
      }
      return {};
    }
    const hrRedirect = '/';
    if (res) {
      res.writeHead(302, {
        Location: `http://${req.subdomain}.${process.env.SITE_DOMAIN}${hrRedirect}`,
      });
      res.end();
    } else {
      Router.push(hrRedirect);
    }
    return {};
  };

  return GuestPageConnected;
};

export default guestPage;
