import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { LoggerModule } from '../infra/logger/logger.module';
import { CompanyModule } from '../company/company.module';
import { MessageModule } from '../messages/message.module';
import { MessageService } from '../messages/message.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './lib/auth.guard';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { InfraModule } from '../infra/infra.module';

@Module({
  imports: [
    LoggerModule,
    InfraModule,
    MessageModule,
    forwardRef(() => CompanyModule),
  ],
  providers: [
    AuthService,
    MessageService,
    {
      provide: APP_GUARD, // this is global
      useClass: AuthGuard,
    },
    UserService,
    UserResolver,
  ],
  controllers: [UserController, AuthController],
  exports: [AuthService, UserService],
})
export class UserModule {}
