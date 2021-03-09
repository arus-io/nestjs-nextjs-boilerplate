/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
// require('dotenv').config({ silent: true });
import * as Sentry from '@sentry/node';
const next = require('next');
const url = require('url');

// @TODO - this code has a lot of stuff commented out -> we need to make sure it's migrated to Nest.js
const dev = process.env.NODE_ENV !== 'production';

// default is empty
let nextApp = {
  getRequestHandler: (req) => (req, res) => {
    console.log(req.originalUrl);
    throw new Error('BE is in dev mode');
  },
  render: (req, res) => {
    console.log(req.originalUrl);
    res.status(204).end();
  },
} as any;
export default getApp;
async function getApp() {
  // const handle = nextApp.getRequestHandler();
  if (process.env.NO_FE) {
    console.log('NOT running FE - FOR DEV ONLY ATM');
    return;
  }
  nextApp = next({ dev, dir: './client' });
  await nextApp.prepare();
}

import { MiddlewareConsumer } from '@nestjs/common';

import { AuthMiddleware } from './modules/user/lib/auth.middleware';
import { CompanyMiddleware } from './modules/user/lib/company.middleware';

const NEW_API_PREFIX = '/v2';

export function getAsMiddleware(consumer: MiddlewareConsumer) {
  // need to run health before all of the inherited middleware junk
  consumer
    .apply((req, res) => {
      res.status(200).json({ healthy: true });
    })
    .forRoutes('/health');
  consumer.apply(CompanyMiddleware).forRoutes('*');
  consumer.apply(AuthMiddleware).exclude('/v2/auth/login').forRoutes('*');

  const handle = nextApp?.getRequestHandler(); // not initialized in tests

  consumer
    .apply((req, res, next) => {
      const parsedUrl = url.parse(req.originalUrl, true);

      if (parsedUrl.pathname.indexOf(NEW_API_PREFIX) === 0 || parsedUrl.pathname.indexOf('/graphql') === 0) {
        return next(); // let it through
      }
      // server with Next.js
      req.url = req.originalUrl; // it likes it this way
      const { pathname, query } = parsedUrl;
      if (req.subdomain === 'admin') {
        nextApp.render(req, res, `/admin${pathname === '/' ? '' : pathname}`, query);
      } else {
        handle(req, res, parsedUrl);
      }
    })
    .forRoutes('*');
}
