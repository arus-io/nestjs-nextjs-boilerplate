export type TConfiguration = {
  IS_TEST: boolean;
  NODE_ENV: string;
  ENV_NAME: string;
  SERVER_PORT: string;
  SITE_DOMAIN: string;
  SECRET_TOKEN: string;
  DATABASE_URL: string;
  LOG_LEVEL: 'debug' | 'info' | 'warn';
  EMAIL_SUPPORT: string;
  REDIS_URL: string;
  sentry: {
    dsn: string;
  };
  email: {
    provider: string;
    from: string;
    sendgrid: {
      apiKey: string;
    };
  };
  sms: {
    provider: string;
    from: string;
    twilio: {
      accountSid: string;
      authToken: string;
    };
  };
};

const configuration = () =>
  ({
    IS_TEST: process.env.NODE_ENV == 'test',
    NODE_ENV: process.env.NODE_ENV || 'development',
    ENV_NAME: process.env.ENV_NAME || 'local',
    SERVER_PORT: process.env.SERVER_PORT || 'not used',
    SITE_DOMAIN: process.env.SITE_DOMAIN,
    SECRET_TOKEN: process.env.SECRET_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    EMAIL_SUPPORT: process.env.EMAIL_SUPPORT,
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    sentry: {
      dsn: process.env.SERVER_SENTRY_DSN || '',
    },
    email: {
      provider: process.env.EMAIL_CLIENT || 'sendgrid',
      from: process.env.EMAIL_FROM || 'Backend <sender@backend.com>',
      whitelist: process.env.EMAIL_WHITELIST || '',
      sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY,
      },
    },
    sms: {
      provider: process.env.SMS_CLIENT || 'twilio',
      from: process.env.SMS_FROM || '+19704490699',
      twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
      },
    },
  } as TConfiguration);
export default configuration;
