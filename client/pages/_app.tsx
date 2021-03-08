import '../scss/main.scss';

import { ApolloProvider } from '@apollo/client';
import jwt_decode from 'jwt-decode';
import withReduxSaga from 'next-redux-saga';
import withRedux from 'next-redux-wrapper';
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import React from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import compose from 'recompose/compose';
import { SWRConfig } from 'swr';
import RouterHistory from '../components/RouterHistory';

import { refreshTokenAction } from '../_core/api';
import { initializeApollo } from '../lib/apollo-client';
import { setSubdomainAction } from '../store/app';
import { getMeAction } from '../store/auth/actions';
import { getToken, readTokenFromRequest } from '../utils/cookies';
import createStore from '../store';

const client = typeof window !== 'undefined';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', (url: string) => {
  // Send custom 'pageview' event to GTM that will update the GA info
  (window as any)?.dataLayer?.push({
    event: 'pageview',
    page: url,
  });
  NProgress.done();
  window.scrollTo(0, 0);
});
Router.events.on('routeChangeError', () => NProgress.done());
const TOKEN_REFRESH_SEC = 60;

let apolloClient;
class MyApp extends App<any> {
  static async doServerInit(ctx) {
    const { store, req, res } = ctx;
    let subdomain = client ? window.location.host.split('.')[0] : req.subdomain;
    if (! subdomain) subdomain = 'admin';
    store.dispatch(setSubdomainAction(subdomain));

    const token = readTokenFromRequest(req, res, subdomain);

    if (token) {
      return new Promise((resolve) => {
        store.dispatch(getMeAction({ resolve, reject: resolve }));
      });
    }
  }

  static async refreshSession(ctx) {
    const token = getToken(); // ctx.store.getState().auth.token;

    if (!token) return;
    const { exp, iat } = jwt_decode(token);
    const now = Math.floor(Date.now() / 1000);
    if (now - iat >= TOKEN_REFRESH_SEC) {
      await ctx.store.dispatch(refreshTokenAction());
    }
  }

  static async getInitialProps({ Component, ctx }): Promise<any> {
    let pageProps;
    try {
      if (ctx.req) {
        // 1st server side rendered page
        await this.doServerInit(ctx);
      } else {
        // only refresh in Client so we don't have to modify cookie in Server
        await this.refreshSession(ctx);
      }
    } catch (e) {
      // continue so other pieces are inited too. If it was an auth error, we won't have a token and app will fail gracefully
      console.info('Initialization error', e);
    }
    try {
      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps({ ...ctx });
      }
      return { pageProps };
    } catch (e) {
      console.error(e);
      return {
        error: e.message || 'Something Went Wrong',
      };
    }
  }

  render() {
    const { Component, pageProps, store, error } = this.props;
    apolloClient = apolloClient ?? initializeApollo(pageProps?.initialApolloState, store);

    if (error) {
      return <h1>{error}</h1>;
    }

    const getLayout = Component.getLayout || ((page) => page);

    return (
      <Provider store={store}>
        <ApolloProvider client={apolloClient}>
          <Head>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link href="https://fonts.googleapis.com/css?family=Nunito:400,600,700,800&display=swap" rel="stylesheet" />
            <title>Boilerplate App</title>
          </Head>
          <SWRConfig
            value={{
              revalidateOnFocus: false,
              shouldRetryOnError: false,
            }}
          >
            {getLayout(<Component {...pageProps} />)}
          </SWRConfig>
          <RouterHistory />
        </ApolloProvider>
        <ToastContainer />
      </Provider>
    );
  }
}

export default compose(withRedux(createStore), withReduxSaga)(MyApp);
