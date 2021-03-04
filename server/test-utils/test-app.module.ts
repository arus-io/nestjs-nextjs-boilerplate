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

import App from '../_core/app';
import { RedisService } from '../modules/infra/cache/redis.service';
import config from '../modules/infra/config';
import { AppLogger } from '../modules/infra/logger/app.logger';
import { LoggerInterceptor } from '../modules/infra/logger/logger.interceptor';
import { LoggerModule } from '../modules/infra/logger/logger.module';
import { CompanyModule } from '../modules/company/company.module';
import { Company } from '../modules/company/models/company.entity';
import { DBModule } from '../modules/db.module';
import { Plan } from '../modules/plan/models/plan.entity';
import { PayCalc, PayPeriodLength } from '../modules/schedule/models/paycalc.entity';
import { PayCalcItem, PayCalcItemType } from '../modules/schedule/models/paycalcItem.entity';
import {
  PayCalcItemLength,
  PayCalcItemTemplate,
  ProrationMethod,
} from '../modules/schedule/models/paycalcItemTemplate.entity';
import { Step } from '../modules/step/models/step.entity';
import { AuthService } from '../modules/user/auth.service';
import { AuthMiddleware } from '../modules/user/lib/auth.middleware';
import { AuthUtils } from '../modules/user/lib/authUtils';
import { CompanyMiddleware } from '../modules/user/lib/company.middleware';
import { User } from '../modules/user/models/user.entity';
import { UserAccess } from '../modules/user/models/useraccess.entity';
import { UserModule } from '../modules/user/user.module';
import { File } from '../v2/files/file.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
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
        if (!App.getInstance().models) {
          App.getInstance()
            .initAsync()
            .then(() => next());
        } else {
          next();
        }
      })
      .forRoutes('*');
    consumer.apply(CompanyMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes('*');
    consumer.apply(App.getServicesMiddleware()).forRoutes('*'); // some in-migration routes
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
  async createBasicData(): Promise<{ user: User; admin: User; company: Company; hrUser: User }> {
    return createBasicData(this.app);
  }

  async createTestPlan(
    companyId,
  ): Promise<{ plan: Plan; employee: User; manager: User; hrUser: User; payCalcItemTemplate: PayCalcItemTemplate }> {
    return createPlan(this.app, companyId) as any;
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
    createdAt: new Date(), // there's a bug with curr version
    supportEmail: 'a@a.com',
    logo: 'http://domain.com/logo.png',
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
  });

  const hrUser = userModel.create({
    email: 'hremp@a.com',
    firstName: 'hrUserName',
    lastName: 'hrUserLast',
    password: await AuthUtils.hashPassword('123'),
    createdAt: new Date(), // there's a bug with curr version
  });

  await userModel.save([admin, user, hrUser]);

  const uaModel = connection.getRepository(UserAccess);
  await uaModel.save([
    {
      userId: user.id,
      companyId: company.id,
    },
    {
      userId: hrUser.id,
      companyId: company.id,
    },
  ]);

  return { admin, user, hrUser, company };
};

export const createPlan = async (app: INestApplication, companyId) => {
  const connection = app.get(Connection);
  const userModel = connection.getRepository(User);

  const employee = await userModel.save({
    email: 'employee@gmail.com',
    firstName: 'Max',
    lastName: 'Power',
  });
  const manager = await userModel.save({
    email: 'manager@gmail.com',
    firstName: 'Tha',
    lastName: 'Boss',
  });
  const hrUser = await userModel.save({
    email: 'hrUser@gmail.com',
    firstName: 'Hr',
    lastName: 'hr',
  });
  const uaModel = connection.getRepository(UserAccess);
  await uaModel.save({ userId: employee.id, companyId });
  await uaModel.save({ userId: manager.id, companyId });
  await uaModel.save({ userId: hrUser.id, companyId });

  const plan = await getRepo(app, Plan).save({
    title: 'title',
    employeeId: employee.id,
    managerId: manager.id,
    companyId,
    dueDate: new Date(),
    returnDate: new Date(),
  });
  await getRepo(app, Step).save([
    {
      title: 'Step 1',
      description: 'Step Description 1',
      url: 'http://www.example.com/url',
      videoLink: 'http://www.example.com/videolink',
      category: 1,
      chapter: 1,
      done: false,
      attachments: [],
      order: 1,
      planId: plan.id,
    },
    {
      title: 'Step 2',
      description: 'Step Description 1',
      url: 'http://www.example.com/url',
      videoLink: 'http://www.example.com/videolink',
      category: 1,
      chapter: 1,
      done: false,
      attachments: [],
      order: 2,
      planId: plan.id,
    },
    {
      title: 'Deleted Step', // shouldn't show
      description: '',
      url: '',
      videoLink: '',
      category: 1,
      chapter: 1,
      done: false,
      attachments: [],
      order: 1,
      deletedAt: new Date(),
      planId: plan.id,
    },
  ] as any);

  await getRepo(app, PayCalc).save({
    planId: plan.id,
    notes: '',
    startDate: '2020-11-16',
    endDate: '2021-03-15',
    payPeriodLength: PayPeriodLength.MONTHLY,
    salary: 2000,
  });
  const payCalcItemTemplate = await getRepo(app, PayCalcItemTemplate).save({
    color: 'red',
    payPerPeriod: 0,
    type: PayCalcItemType.GENERIC,
    title: 'Pay Calc Item Template 1',
    payPeriodLength: PayCalcItemLength.PAY_PERIOD,
    prorationMethod: ProrationMethod.WORKING_DAYS,
  });
  const item = {
    type: PayCalcItemType.GENERIC,
    payPercentage: 0,
    planId: plan.id,
    title: 'Pay Calc Item 1',
    payPerPeriod: 0,
    payPeriodLength: PayCalcItemLength.PAY_PERIOD,
    prorationMethod: ProrationMethod.WORKING_DAYS,
  };
  await getRepo(app, PayCalcItem).save([
    {
      ...item,
      from: '2020-12-16',
      to: '2020-12-19',
      title: 'Pay Calc Item 1',
    },
    {
      ...item,
      from: '2020-12-19',
      to: '2020-12-21',
      title: 'Pay Calc Item 2',
      payCalcItemTemplateId: payCalcItemTemplate.id,
    },
    {
      ...item,
      from: '2020-12-21',
      to: '2020-12-25',
      title: 'Pay Calc Item 3',
    },
    {
      ...item,
      from: '2020-12-24',
      to: '2021-01-19',
      title: 'Pay Calc Item 4',
    },
  ]);

  await getRepo(app, File).save([
    {
      title: 'file1',
      url: 'http://www.example.com/file1.pdf',
      extension: 'pdf',
      sharedWithHr: true,
      sharedId: employee.id,
      planId: plan.id,
    },
    {
      title: 'file2',
      url: 'http://www.example.com/file2.pdf',
      extension: 'pdf',
      sharedWithHr: false,
      sharedId: manager.id,
      planId: plan.id,
    },
  ]);

  return { plan, employee, manager, hrUser, payCalcItemTemplate };
};

export const clearDatabase = async (app: INestApplication) => {
  const cache = app.get(RedisService);
  const connection = app.get(Connection);
  // @TODO - we would like to just truncate, but we have issues with the order and sequelize
  return Promise.all([connection.synchronize(true), cache.flushAll()]);
  // await Promise.all(
  //   [
  //     'users',
  //     'userAccesses',
  //     'companies',
  //     'plans',
  //     'files',
  //     'steps',
  //     'stepTemplates',
  //     'leaves',
  //     'notifications',
  //     'policies',
  //   ].map((t) => connection.query(`truncate table "${t}" RESTART IDENTITY cascade`)),
  // );
};

export const getAuthHeaders = async (app: INestApplication, t, companyId = '1') => {
  const authService = app.get(AuthService);
  t.companyId = companyId;
  return {
    'x-access-token': await authService.grantAccessToken(t, 100000),
  };
};
