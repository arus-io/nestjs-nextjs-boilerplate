///<reference types="webpack-env" />
import { InfraModule } from './modules/infra/infra.module';

require('./modules/infra/config/_loadEnvironment');
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as Sentry from '@sentry/node';
import path from 'path';

import { AppModule } from './modules/app.module';
import initializeNextApp from './old-code-integration';

const port = parseInt(process.env.PORT, 10) || 3000;
const helmet = require('helmet');
const compression = require('compression');

import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';

import { AppLogger } from './modules/infra/logger/app.logger';
import { LoggerInterceptor } from './modules/infra/logger/logger.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  await initializeNextApp();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: false,
  });
  const logger = await app.resolve(AppLogger);
  app.useLogger(logger);

  const loggerInt = await app.resolve(LoggerInterceptor);
  app.useGlobalInterceptors(loggerInt);

  const configService = app.select(InfraModule).get(ConfigService);

  if (configService.get('SENTRY_DSN')) {
    Sentry.init({
      dsn: configService.get('SENTRY_DSN'),
      environment: configService.get('ENV_NAME'),
    });
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false, // we should...
      exceptionFactory: (errors: ValidationError[]) => {
        // what we return here goes into the message. We'd need to do a custom Error here
        // and then add a filter to serialize it correctly.
        // For now we just display the 1st error (unless we start using it more)
        return new BadRequestException(Object.values(errors[0].constraints)[0]);
      },
    }),
  );

  const dev = process.env.NODE_ENV !== 'production';
  if (!dev) {
    // app.enable('trust proxy');
    app.use(helmet());
    app.use(compression());
  }
  app.enableCors({
    exposedHeaders: ['AuthToken'],
  });
  app.useStaticAssets(path.join(__dirname, '.', 'static'));

  // app.setGlobalPrefix('v2');
  await app.listen(port, () => {
    logger.log(`Api is ready at port ${port}`);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
