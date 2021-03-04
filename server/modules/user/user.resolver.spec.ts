import { Test } from '@nestjs/testing';

import { getRepo, TestAppModule, TestHelper } from '../../test-utils/test-app.module';
import { Company } from '../company/models/company.entity';
import { GqlModule } from '../gql.module';
import { Plan } from '../plan/models/plan.entity';
import { User } from './models/user.entity';
import { UserModule } from './user.module';

const meQuery = () => `{
  me {
    id
    firstName
    lastName
    email
    company {
      id
      name
      logo
      subdomain
      twoFactorEnabled
      supportEmail
    }
  }
}`;
const globalSearchQuery = () => `{
  globalSearch(query : "test") {
    entity
    id
    label
  }
}`;

describe('gql#user', () => {
  let t: TestHelper;
  let ds: { user: User; admin: User; company: Company };

  afterAll(async () => {
    await t.close();
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestAppModule, UserModule, GqlModule],
    }).compile();

    t = new TestHelper();
    await t.init(moduleRef);
    await t.clearDatabase();
    ds = await t.createBasicData();
  });

  describe('me() query', () => {
    it('should return my data', async () => {
      const { user, company } = ds;
      const { data, errors } = await t.query(meQuery(), user);
      expect(data.me).toStrictEqual({
        company: {
          id: company.id,
          name: company.name,
          supportEmail: company.supportEmail,
          logo: company.logo,
          subdomain: company.subdomain,
          twoFactorEnabled: false,
        },
        email: 'emp@a.com',
        firstName: 'userName',
        id: ds.user.id,
        lastName: 'userLast',
      });
      expect(errors).toBeUndefined();
    });
  });

  describe('globalSearch() query', () => {
    it('should be admin only', async () => {
      const { data, errors } = await t.query(globalSearchQuery(), ds.user);
      expect(errors[0].message).toBe('Not enough privileges');
      expect(data).toStrictEqual(null);
    });

    it('should return matching plans and companies', async () => {
      const companySubdomainMatch = await getRepo(t.app, Company).save({
        subdomain: 'test2',
        name: 'Company2',
        supportEmail: 'a@a.com',
      });
      const companyDoesntMatch = await getRepo(t.app, Company).save({
        subdomain: 'notthis',
        name: 'Not this company',
        supportEmail: 'b@b.com',
      });
      const planMatch = await getRepo(t.app, Plan).save({
        title: 'testing',
        managerId: ds.user.id,
        employeeId: ds.user.id,
        companyId: ds.company.id,
        dueDate: new Date(),
        returnDate: new Date(),
      });
      const planDoesnMatch = await getRepo(t.app, Plan).save({
        title: 'another name',
        managerId: ds.user.id,
        employeeId: ds.user.id,
        companyId: ds.company.id,
        dueDate: new Date(),
        returnDate: new Date(),
      });
      const { data, errors } = await t.query(globalSearchQuery(), ds.admin);

      expect(errors).toBeUndefined();
      expect(data.globalSearch).toStrictEqual([
        { entity: 'Company', id: companySubdomainMatch.id.toString(), label: companySubdomainMatch.name },
        { entity: 'Company', id: ds.company.id.toString(), label: ds.company.name },
        { entity: 'Plan', id: planMatch.id.toString(), label: planMatch.title },
      ]);
    });
  });
});
