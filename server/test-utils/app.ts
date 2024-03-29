import { AuthMiddleware } from '../modules/user/lib/auth.middleware';

const express = require('express');
const errorHandler = require('../lib/errors/error-handler');

const createApp = ({ subdomain, companyId }) => {
  const app = express();

  app.subdomain = subdomain;
  app.companyId = companyId;
  app.use((req, res, next) => {
    req.subdomain = app.subdomain;
    req.companyId = app.companyId;
    next();
  });
  app.use(errorHandler);

  return app;
};

module.exports = createApp({
  companyId: 1,
  subdomain: 'test',
});

module.exports.createApp = createApp;
