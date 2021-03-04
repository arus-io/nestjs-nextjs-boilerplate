import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Company } from './company/models/company.entity';
import { Message } from './messages/models/message.entity';
import { User } from './user/models/user.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        url: configService.get('DATABASE_URL'),
        type: 'postgres',
        keepConnectionAlive: true, // for HMR
        autoLoadEntities: true,
        synchronize: false, // configService.get('NODE_ENV') === 'test', // -> conflicts with sequelize
        maxQueryExecutionTime: 1000,
        logging: configService.get('LOG_LEVEL') === 'debug' || ['error', 'warn'],
        // logger: new MyCustomLogger() // @TODO we might use our appLogger..
      }),
    }),
    TypeOrmModule.forFeature([
      User,
      Company,
      Message,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DBModule {}
