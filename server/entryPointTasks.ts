import dotenv from 'dotenv';
import path from 'path';

// require('./infrastructure/config/_loadEnvironment');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { NestFactory } from '@nestjs/core';

import { AppLogger } from './modules/infra/logger/app.logger';
import { AppModule } from './modules/app.module';

// const logger = console;
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    // logger: false,
  });
  const logger = await app.resolve(AppLogger);
  app.useLogger(logger);
  // application logic...
  logger.debug('Start task');
  let code = 0;

  try {
    const [bin, taskEntryPoint, taskName, ...args] = process.argv;
    logger.log({ message: `Executing task ${taskName}`, date: new Date().toISOString() });
    // sentry.configureScope((scope) => {
    //   scope.setTag('task', taskName);
    // });
    // tslint:disable-next-line: variable-name
    const classes = require(path.resolve(__dirname, './tasks/', taskName));
    const TaskClass = classes.default || Object.values(classes)[0];

    const task = new TaskClass(app, `[${taskName}]`);

    const hrstart = process.hrtime();

    await task.doWork(args);
    const hrend = process.hrtime(hrstart);
    logger.log({ message: `Task finished, Execution time ${hrend[0]}s ${Math.round(hrend[1] / 1000000)}ms` });
  } catch (err) {
    // sentry.captureException(err);
    logger.error('Task error: ', err);
    code = -1;
  }

  let ok = false;
  logger.log('Closing app');
  setTimeout(() => {
    if (!ok) {
      logger.log('Needed to kill');
      process.exit(-2);
    }
  }, 3000);
  await app.close();
  logger.log('finished gracefully');
  ok = true;
  process.exit(0); // this is not graceful until we cleanup sequelize
}
bootstrap();
