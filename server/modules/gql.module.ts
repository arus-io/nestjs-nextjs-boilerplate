import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { join } from 'path';

import { AppLogger } from './infra/logger/app.logger';
import { LoggerModule } from './infra/logger/logger.module';

@Global()
@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [LoggerModule, ConfigModule],
      inject: [AppLogger, ConfigService],
      useFactory: async (loggerService: AppLogger, configService: ConfigService) => ({
        debug: true,
        playground: true,
        introspection: configService.get('ENV_NAME') !== 'prod',
        // logger: loggerService as any,
        autoSchemaFile: join(process.cwd(), 'server/schema.gql'),
        sortSchema: true,
        context: ({ req }) => ({ req }),
        formatError: (error: GraphQLError) => {
          const realError = error.extensions?.exception;
          const graphQLFormattedError: GraphQLFormattedError = {
            message: realError?.message || error.message,
            extensions: realError?.response,
          };
          return graphQLFormattedError;
        },
      }),
    }),
  ],
  // exports: [TypeOrmModule],
})
export class GqlModule {}
