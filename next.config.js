const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');

module.exports = withPlugins([[withImages]], {
  env: {
    // Will be available on both server and client
    SITE_DOMAIN: process.env.SITE_DOMAIN,
    API_DOMAIN: process.env.API_DOMAIN,
    INTERCOM_ID: process.env.INTERCOM_ID,
    GTM_ID: process.env.GTM_ID,
  },
  async redirects() {
    return [
      {
        source: '/hrdashboard',
        destination: '/hr/dashboard',
        permanent: true,
      },
    ];
  },
});
