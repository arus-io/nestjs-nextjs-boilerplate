import { Test } from '@nestjs/testing';

import { TestAppModule, TestHelper } from '../../test-utils/test-app.module';
import { GqlModule } from '../gql.module';
import { User } from './models/user.entity';
import { UserModule } from './user.module';

describe('gql#auth', () => {
  let t: TestHelper;
  let ds: { user: User; admin: User; };

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

    it('should change the password', async () => {
      const resChangePassword = await t.query(`
      mutation {
        changePassword(newPassword: "P4ssw0rd2!"){
          success
        }
      }`, ds.admin);
      expect(resChangePassword.data.changePassword.success).toStrictEqual(true);
      expect(resChangePassword.errors).toBeUndefined();

      const resLogin = await t.query(`
        mutation {
          login(email: "admin@a.com", password: "P4ssw0rd2!"){
            token
            needs2fa
          }
        }`, ds.admin);
      expect(resLogin.data.login.company).toStrictEqual(true);
    });
});
