import { INestApplication, INestApplicationContext } from '@nestjs/common';
import { Connection, DeepPartial, ObjectType } from 'typeorm';

import { RedisService } from '../modules/infra/cache/redis.service';
import { Company } from '../modules/company/models/company.entity';
import { AuthUtils } from '../modules/user/lib/authUtils';
import { User } from '../modules/user/models/user.entity';

export class DataFixture {
  private connection: Connection;
  constructor(private app: INestApplicationContext) {
    this.connection = app.get(Connection);
  }
  async clearDatabase() {
    const cache = this.app.get(RedisService);
    const connection = this.app.get(Connection);
    return Promise.all([connection.synchronize(true), cache.flushAll()]);
  }

  private getRepo = <T>(entity: ObjectType<T>) => {
    return this.connection.getRepository(entity);
  };

  async localDevDataset() {
    const companyModel = this.getRepo(Company);
    const userModel = this.getRepo(User);

    await this.insertMigrations();
    const companies = await companyModel.save([
      {
        subdomain: 'demo',
        name: 'demo',
        logo: 'https://logo.jpg',
        createdAt: new Date(),
      },
    ]);

    const password = await AuthUtils.hashPassword('123');
    await userModel.save([
      {
        email: 'admin@mail.com',
        firstName: 'Admin Name',
        lastName: 'Admin Last',
        password,
        superuser: true,
        createdAt: new Date(),
      },
    ]);
    await userModel.save(
      Array.from({ length: 10 }, (v, index) => ({
        email: `user${index + 1}@mail.com`,
        firstName: `User${index + 1} Name`,
        lastName: `User${index + 1} Last`,
        password,
        createdAt: new Date(),
        company: companies[0]
      })),
    );
  }

  insertMigrations = async () => {
    const s = this.app.get(Connection);
    await s.showMigrations(); // Create migration table if doesnt exist yet
    for (const value of Object.values(s.migrations)) {
      const migrationName = (value as any).constructor.name;
      const migrationTimestamp = parseInt(migrationName.substr(-13), 10);
      await s.query(`INSERT INTO migrations (timestamp, name) VALUES (${migrationTimestamp}, '${migrationName}')`);
    }
    // await s.close();
  };
}
