import { HttpException, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RavenInterceptor, RavenModule } from 'nest-raven';
import { Connection } from 'typeorm';

import { LoggerModule } from './infra/logger/logger.module';
import { CompanyModule } from './company/company.module';
import { DBModule } from './db.module';
import { GqlModule } from './gql.module';
import { MessageModule } from './messages/message.module';
import { UserModule } from './user/user.module';
import { getAsMiddleware } from '../old-code-integration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DBModule,
    GqlModule,
    RavenModule,
    LoggerModule,
    UserModule,
    CompanyModule,
    MessageModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor({
        filters: [{ type: HttpException, filter: (exception: HttpException) =>  exception.getStatus() < 500 }],
      }),
    },
  ],
})

//@TODO: migrate

export class AppModule implements NestModule {
  constructor(private connection: Connection) {}

  configure(consumer: MiddlewareConsumer) {
    getAsMiddleware(consumer);
  }
}
