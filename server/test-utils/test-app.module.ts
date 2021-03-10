import {
  BadRequestException,
  INestApplication,
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { Connection, ObjectType, Repository } from 'typeorm';

import { RedisService } from '../modules/infra/cache/redis.service';
import { AppLogger } from '../modules/infra/logger/app.logger';
import { LoggerInterceptor } from '../modules/infra/logger/logger.interceptor';
import { LoggerModule } from '../modules/infra/logger/logger.module';
import { CompanyModule } from '../modules/company/company.module';
import { Company } from '../modules/company/models/company.entity';
import { DBModule } from '../modules/db.module';
import { AuthService } from '../modules/user/auth.service';
import { AuthMiddleware } from '../modules/user/lib/auth.middleware';
import { AuthUtils } from '../modules/user/lib/authUtils';
import { CompanyMiddleware } from '../modules/user/lib/company.middleware';
import { User } from '../modules/user/models/user.entity';
import { UserModule } from '../modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
    }),
    DBModule,
    LoggerModule,
    UserModule,
    CompanyModule,
  ],
})
export class TestAppModule implements NestModule {
  public static subdomain = 'test'; // didn't find a better way to set this
  public static async boostrap(tm: TestingModule): Promise<INestApplication> {
    // moduleRef.
    const app = tm.createNestApplication();

    const logger = await app.resolve(AppLogger);
    app.useLogger(logger);

    const loggerInt = await app.resolve(LoggerInterceptor);
    app.useGlobalInterceptors(loggerInt);

    // @NOTE - keep up to sync with main.ts file, copy what's important to test only
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false, // we should...
        exceptionFactory: (errors: ValidationError[]) => {
          return new BadRequestException(Object.values(errors[0].constraints)[0]);
        },
      }),
    );

    await app.init();
    return app;
  }
  constructor() {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        (req as any).subdomain = TestAppModule.subdomain;
        (req as any).companyId = '1';
        next();
      })
      .forRoutes('*');
    consumer.apply(CompanyMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}

export class TestHelper {
  app: INestApplication;
  api;
  async init(tm: TestingModule) {
    this.app = await TestAppModule.boostrap(tm);
    this.api = this.app.getHttpServer();
  }
  async clearDatabase() {
    await clearDatabase(this.app);
  }
  async createBasicData(): Promise<{ user: User; admin: User; company: Company; }> {
    return createBasicData(this.app);
  }

  getRepo<T>(entity: ObjectType<T>): Repository<T> {
    return getRepo<T>(this.app, entity);
  }

  async query(query, token): Promise<{ errors: { message: string; extensions: any[] }[]; data: any }> {
    const r = request(this.api).post(`/graphql`);
    r.set({ 'Content-type': 'application/json' });
    if (token) {
      r.set(await getAuthHeaders(this.app, token));
    }
    const res = await r.send({ query });
    return res.body;
  }
  async close() {
    this.app.close();
  }
}

export const getRepo = <T>(app: INestApplication, entity: ObjectType<T>) => {
  const connection = app.get(Connection);
  return connection.getRepository(entity);
};

// @TODO - move all this code to dataFixture
export const createBasicData = async (app: INestApplication) => {
  const connection = app.get(Connection);
  const userModel = connection.getRepository(User);

  const companyModel = connection.getRepository(Company);
  const company = await companyModel.save({
    subdomain: 'test',
    name: 'test',
    supportEmail: 'a@a.com',
    logo: 'http://domain.com/logo.png',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const admin = userModel.create({
    email: 'admin@a.com',
    firstName: 'adminName',
    lastName: 'adminLast',
    password: await AuthUtils.hashPassword('123'),
    superuser: true,
    createdAt: new Date(), // there's a bug with curr version
  });

  const user = userModel.create({
    email: 'emp@a.com',
    firstName: 'userName',
    lastName: 'userLast',
    password: await AuthUtils.hashPassword('123'),
    createdAt: new Date(), // there's a bug with curr version
    company: company
  });

  await userModel.save([admin, user]);

  return { admin, user, company };
};


export const clearDatabase = async (app: INestApplication) => {
  const cache = app.get(RedisService);
  const connection = app.get(Connection);
  await connection.synchronize(true);
  await cache.flushAll();
  await Promise.all(
    [
      'users',
      'companies',
      'messages',
    ].map((t) => connection.query(`truncate table "${t}" RESTART IDENTITY cascade`)),
  );
};

export const getAuthHeaders = async (app: INestApplication, t, companyId = '1') => {
  const authService = app.get(AuthService);
  t.companyId = companyId;
  return {
    'x-access-token': await authService.grantAccessToken(t, 100000),
  };
};
