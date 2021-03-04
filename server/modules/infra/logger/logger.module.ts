import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppLogger } from './app.logger';
import { LoggerInterceptor } from './logger.interceptor';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [AppLogger, LoggerInterceptor],
  exports: [AppLogger, LoggerInterceptor],
})
export class LoggerModule {}
