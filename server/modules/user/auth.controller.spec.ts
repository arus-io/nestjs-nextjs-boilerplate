import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { getRepository } from 'typeorm';

import { clearDatabase, createBasicData, getAuthHeaders, TestAppModule } from '../../test-utils/test-app.module';
import { Company } from '../company/models/company.entity';
import { MessageService } from '../messages/message.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthUtils } from './lib/authUtils';
import { User } from './models/user.entity';
import { UserModule } from './user.module';

describe('#Auth', () => {
  let app: INestApplication;
  let api;
  let data: { user: User; admin: User; company: Company };
  let customConfig = {};
  let configService, messageService;

  afterAll(async () => {
    await app.close();
    jest.restoreAllMocks();
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestAppModule, UserModule],
    }).compile();
    configService = moduleRef.get<ConfigService>(ConfigService);

    messageService = moduleRef.get<MessageService>(MessageService);

    app = await TestAppModule.boostrap(moduleRef);
    api = app.getHttpServer();
    await clearDatabase(app);
    data = await createBasicData(app);
  });

  afterEach(() => (customConfig = {}));

  it(`#companyMiddleware: should validate companies`, async () => {
    TestAppModule.subdomain = 'acme';
    const res = await request(api)
      .post('/v2/auth/login')
      .send({
        email: 'a',
        password: '123',
      })
      .expect(404);
    TestAppModule.subdomain = 'test';
  });

  describe('login', () => {
    it(`should login regular users`, async (done) => {
      const { body } = await request(api)
        .post('/v2/auth/login')
        .send({
          email: data.user.email,
          password: '123',
        })
        .expect(200);

      expect(body.token).toBeDefined();
      expect(body.needs2fa).toBe(false);

      const tokenContent = await AuthUtils.verifyJwt(process.env.SECRET_TOKEN, body.token);
      expect(tokenContent.id).toBe(data.user.id);
      expect(!!tokenContent.impersonating).toBe(false);
      expect(!!tokenContent.superuser).toBe(false);
      expect(!!tokenContent.needs2fa).toBe(false);

      // token works
      const res = await request(api).post('/v2/auth/refresh').set({ 'x-access-token': body.token }).expect(200);
      expect(res.body.token).toBeDefined();

      done();
    });

    it(`should login admin on admin subdomain only`, async (done) => {
      TestAppModule.subdomain = 'admin';
      const res = await request(api)
        .post('/v2/auth/login')
        .send({
          email: data.admin.email,
          password: '123',
        })
        .expect(200);

      TestAppModule.subdomain = 'test';
      const { body } = await request(api)
        .post('/v2/auth/login')
        .send({
          email: data.admin.email,
          password: '123',
        })
        .expect(400);
      done();
    });

    it(`should reject login if no access`, async () => {
      const userModel = getRepository(User);
      await userModel.update(data.user.id, {
        company: null
      });

      const res = await request(api)
        .post('/v2/auth/login')
        .send({
          email: data.user.email,
          password: '123',
        })
        .expect(400);
      expect(res.body.message).toContain('Invalid user');
      await userModel.update(data.user.id, {
        company: data.company
      });
    });

    it('should handle errors correctly', async (done) => {
      const res1 = await request(api)
        .post('/v2/auth/login')
        .send({
          email: '123',
        })
        .expect(400);
      expect(res1.body.message).toBe('Please provide a valid email address.');

      const res2 = await request(api)
        .post('/v2/auth/login')
        .send({
          email: 'a@a.com',
        })
        .expect(400);
      expect(res2.body.message).toBe('Please provide a valid password.');

      const res3 = await request(api)
        .post('/v2/auth/login')
        .send({
          email: 'noemail',
          password: '123',
        })
        .expect(400);
      expect(res3.body.message).toBe('Please provide a valid email address.');

      const res4 = await request(api)
        .post('/v2/auth/login')
        .send({
          email: 'noemail@a.com',
          password: '123',
        })
        .expect(400);
      expect(res4.body.message).toBe('Invalid user or password.');
      done();
    });
  });

  describe('logout', () => {
    it(`should invalidate token`, async (done) => {
      const t = await getAuthHeaders(app, data.user);

      await request(api).post('/v2/auth/logout').set(t).expect(200);

      await request(api).post('/v2/auth/refresh').set(t).expect(401);
      done();
    });
  });

  describe('refresh', () => {
    it('should not refresh a token until its 2hours old', async (done) => {
      // @TODO - this junks fails randomly.. need to debug
      const headers = await getAuthHeaders(app, data.user);
      const res = await request(api).post('/v2/auth/refresh').set(headers).expect(200);
      expect(res.body.token).toBeDefined();

      expect(headers['x-access-token']).toBe(res.body.token);
      done();
    });

    it('should refresh a token after 2hours, and revoke old one', async (done) => {
      const iat = Math.floor(Date.now() / 1000) - 60 * 60 * 2 - 1;
      const exp = Math.floor(Date.now() / 1000) + 10000;
      const token = await new Promise<string>((resolve) =>
        jwt.sign({ id: data.user.id, companyId: '1', iat, exp }, process.env.SECRET_TOKEN, (err, token) => {
          resolve(token);
        }),
      );
      const AuthServ = await app.resolve(AuthService);
      await AuthServ.authorizeAccessToken(data.user.id, { exp, iat });
      AuthServ.TOKEN_REVOKE_DELAY_SEC = 0;

      const headers = { 'x-access-token': token };
      const res = await request(api).post('/v2/auth/refresh').set(headers).expect(200);

      expect(token).not.toBe(res.body.token);
      const tokenContent = await AuthUtils.verifyJwt(process.env.SECRET_TOKEN, res.body.token);
      expect(tokenContent.id).toBe(data.user.id);
      expect(tokenContent.companyId).toBe(data.company.id);
      expect(tokenContent.iat).toEqual(tokenContent.exp - 60 * 60 * 24); // 1 day

      await request(api).post('/v2/auth/refresh').set(headers).expect(401);
      headers['x-access-token'] = res.body.token;
      const res3 = await request(api).post('/v2/auth/refresh').set(headers).expect(200);
      expect(res.body.token).toBeDefined();

      done();
    });

    it('should revoke old token', async (done) => {
      const headers = await getAuthHeaders(app, data.user);
      (await app.resolve(AuthService)).TOKEN_REVOKE_DELAY_SEC = 0;
      const res = await request(api).post('/v2/auth/refresh').set(headers).expect(200);
      expect(res.body.token).toBeDefined();

      // token invalidated

      done();
    });

    it('should not refresh impersonated tokens', async (done) => {
      const headers = await getAuthHeaders(app, { ...data.user, impersonating: true });
      const res = await request(api).post('/v2/auth/refresh').set(headers).expect(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.token).toBe(headers['x-access-token']);
      done();
    });

    it('should deny non authorized request', async (done) => {
      const res = await request(api)
        .post('/v2/auth/refresh')
        // .set(await getAuthHeaders(data.user))
        .expect(401);
      expect(res.body.message).toBe('Missing or Invalid credentials');
      done(); // @NOTE - there's a weird bug... last test has to have this 'done' :facepalm:
    });
  });

  describe('2fa', () => {
    it(`login: should make a special token, and block access to protected routes`, async (done) => {
      await getRepository(Company).update(data.company.id, { twoFactorEnabled: true });
      await data.company;
      const { body } = await request(api)
        .post('/v2/auth/login')
        .send({
          email: data.user.email,
          password: '123',
        })
        .expect(200);
      expect(body.token).toBeDefined();
      expect(body.needs2fa).toBe(true);

      // revert - keep test data clean
      // await getRepository(Company).update(data.company.id, { twoFactorEnabled: false });

      const tokenContent = await AuthUtils.verifyJwt(process.env.SECRET_TOKEN, body.token);
      expect(tokenContent.needs2fa).toBe(true);

      const res = await request(api).post('/v2/auth/refresh').set({ 'x-access-token': body.token }).expect(403);
      expect(res.body.message).toContain('Two Factor Authentication');

      done();
    });

    it(`login: admin should make a special token, and block access to protected routes`, async (done) => {
      configService.internalConfig['ADMIN_TWO_FACTOR'] = 'true';
      TestAppModule.subdomain = 'admin';
      const { body } = await request(api)
        .post('/v2/auth/login')
        .send({
          email: data.admin.email,
          password: '123',
        })
        .expect(200);
      expect(body.token).toBeDefined();
      expect(body.needs2fa).toBe(true);
      const tokenContent = await AuthUtils.verifyJwt(process.env.SECRET_TOKEN, body.token);
      expect(tokenContent.needs2fa).toBe(true);
      const res = await request(api).post('/v2/auth/refresh').set({ 'x-access-token': body.token }).expect(403);
      expect(res.body.message).toContain('Two Factor Authentication');
      done();
    });

    it('refresh should not refresh if company enabled 2auth', async (done) => {
      const tokenWithout2fa = await getAuthHeaders(app, data.user);
      await getRepository(Company).update(data.company.id, { twoFactorEnabled: true });

      const res = await request(api).post('/v2/auth/refresh').set(tokenWithout2fa).expect(403);
      expect(res.body.message).toContain('Two Factor');

      await getRepository(Company).update(data.company.id, { twoFactorEnabled: false });

      done();
    });

    describe('enable 2fa', () => {
      it('should reject if company 2fa not enabled', async (done) => {
        const token = await getAuthHeaders(app, data.user);
        await getRepository(Company).update(data.company.id, { twoFactorEnabled: false });
        const res = await request(api).post('/v2/auth/2fa/enable/totp').set(token).expect(400);
        expect(res.body.message).toContain('not enabled');
        done();
      });

      it('should reject if admin 2fa not enabled', async (done) => {
        configService.internalConfig['ADMIN_TWO_FACTOR'] = 'false';
        const token = await getAuthHeaders(app, data.admin, null);
        const res = await request(api).post('/v2/auth/2fa/enable/totp').set(token).expect(400);
        expect(res.body.message).toContain('not enabled');
        done();
      });

      it('should accept if admin 2fa is enabled', async (done) => {
        configService.internalConfig['ADMIN_TWO_FACTOR'] = 'true';
        const token = await getAuthHeaders(app, data.admin, null);
        const res = await request(api).post('/v2/auth/2fa/enable/totp').set(token).expect(200);
        expect(res.body.type).toEqual('totp');
        expect(res.body.success).toEqual(true);
        done();
      });

      it('should reject if user has a 2fa type enabled', async (done) => {
        const token = await getAuthHeaders(app, data.user);
        await getRepository(Company).update(data.company.id, { twoFactorEnabled: true });

        await getRepository(User).update(data.user.id, { twoFactorEnabledTOTP: true, twoFactorEnabledSMS: false });
        const res1 = await request(api).post('/v2/auth/2fa/enable/totp').set(token).expect(400);
        expect(res1.body.message).toContain('already enabled');

        await getRepository(User).update(data.user.id, { twoFactorEnabledTOTP: false, twoFactorEnabledSMS: true });
        const res2 = await request(api).post('/v2/auth/2fa/enable/totp').set(token).expect(400);
        expect(res2.body.message).toContain('already enabled');
        done();
      });

      it('totp: should generate a secret and be verified', async (done) => {
        const token = await getAuthHeaders(app, { ...data.user, needs2fa: true });
        await getRepository(Company).update(data.company.id, { twoFactorEnabled: true });
        await getRepository(User).update(data.user.id, { twoFactorEnabledTOTP: false, twoFactorEnabledSMS: false });

        const res1 = await request(api).post('/v2/auth/2fa/enable/totp').set(token).expect(200);
        expect(res1.body.type).toEqual('totp');
        expect(res1.body.success).toEqual(true);

        expect(res1.body.otpauthURL).toContain('otpauth://totp/backend%20platform?secret=');
        const secret = res1.body.otpauthURL.split('=')[1];

        const token2fa = AuthUtils.__generate2FAToken(secret);
        const res2 = await request(api)
          .post('/v2/auth/2fa/verify')
          .send({ tokenType: 'totp', token2fa })
          .set(token)
          .expect(200);

        const newToken = res2.body.token;
        expect(newToken).toBeDefined();
        const decoded = await AuthUtils.verifyJwt(process.env.SECRET_TOKEN, newToken);
        expect(decoded.id).toBe(data.user.id);
        expect(decoded.companyId).toBe(String(data.company.id));
        expect(decoded.needs2fa).toBe(true);
        expect(decoded.has2fa).toBe(true);

        const dbUser2 = await getRepository(User).findOne(data.user.id);
        expect(dbUser2.twoFactorEnabledSMS).toEqual(false);
        expect(dbUser2.twoFactorEnabledTOTP).toEqual(true);

        // old token
        await request(api).post('/v2/auth/refresh').set(token).expect(401);
        // new token
        await request(api).post('/v2/auth/refresh').set({ 'x-access-token': newToken }).expect(200);

        done();
      });

      it('sms: should generate a secret and be verified', async (done) => {
        // avoiding copy-paste as we know there's shared code, test sms stuff here
        const token = await getAuthHeaders(app, { ...data.user, needs2fa: true });
        await getRepository(Company).update(data.company.id, { twoFactorEnabled: true });
        await getRepository(User).update(data.user.id, {
          twoFactorEnabledTOTP: false,
          twoFactorEnabledSMS: false,
          twoFactorCounter: 0,
        });

        const spy = jest.spyOn(messageService.smsClient, 'sendMessage');

        const res1 = await request(api).post('/v2/auth/2fa/enable/sms').set(token).expect(400);
        expect(res1.body.message).toContain("User doesn't have a phone number. Can't set SMS verification.");

        await getRepository(User).update(data.user.id, { phone: '123' });
        const res2 = await request(api).post('/v2/auth/2fa/enable/sms').set(token).expect(200);
        expect(res2.body.type).toEqual('sms');
        expect(res2.body.success).toEqual(true);

        expect(spy.mock.calls.length).toBe(1);

        const dbUser = await getRepository(User).findOne(data.user.id);
        expect(dbUser.twoFactorCounter).toBeGreaterThan(0);

        const code = AuthUtils.generate2FANumber(dbUser.twoFactorSecret, dbUser.twoFactorCounter);
        expect(spy.mock.calls[0][0].to).toEqual('123');
        expect(spy.mock.calls[0][0].body).toEqual(`${code} is your verification code from backend.`);

        const res3 = await request(api)
          .post('/v2/auth/2fa/verify')
          .send({ tokenType: 'sms', token2fa: code })
          .set(token)
          .expect(200);

        const newToken = res3.body.token;
        expect(newToken).toBeDefined();
        const decoded = await AuthUtils.verifyJwt(process.env.SECRET_TOKEN, newToken);
        expect(decoded.id).toBe(data.user.id);
        expect(decoded.has2fa).toBe(true);

        const dbUser2 = await getRepository(User).findOne(data.user.id);
        expect(dbUser2.twoFactorEnabledSMS).toEqual(true);
        expect(dbUser2.twoFactorEnabledTOTP).toEqual(false);

        done();
      });
    });
  });

  describe('impersonate', () => {
    it('should let admin impersonate a user', async (done) => {
      const res = await request(api)
        .post('/v2/auth/impersonate')
        .set(await getAuthHeaders(app, data.admin))
        .send({ userId: data.user.id, companyId: data.company.id })
        .expect(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.site).toBe(`http://${data.company.subdomain}.${process.env.BASE_URL}`);

      const tokenContent = await AuthUtils.verifyJwt(process.env.SECRET_TOKEN, res.body.token);
      expect(tokenContent.id).toBe(data.user.id);
      expect(tokenContent.companyId).toBe(data.company.id);
      expect(tokenContent.impersonating).toBe(true);
      expect(tokenContent.iat).toEqual(tokenContent.exp - 60 * 60); // 60mins
      done();
    });
    it('should fail gracefully user', async (done) => {
      await request(api)
        .post('/v2/auth/impersonate')
        .set(await getAuthHeaders(app, data.admin))
        .send({ userId: data.user.id })
        .expect(400);
      await request(api)
        .post('/v2/auth/impersonate')
        .set(await getAuthHeaders(app, data.admin))
        .send({ userId: data.user.id, companyId: 77 })
        .expect(400);

      await request(api)
        .post('/v2/auth/impersonate')
        .set(await getAuthHeaders(app, data.user))
        .send({ userId: data.user.id, companyId: data.company.id })
        .expect(401);

      done();
    });
  });

  describe('forgot and reset Password', () => {
    it('should not leak info to non-existing emails and just return ok', async () => {
      const res = await request(api)
        .post('/v2/auth/forgot-password')
        .set(await getAuthHeaders(app, data.admin))
        .send({ email: 'anyvalidemail@gmail.com' })
        .expect(200);
    });

    it('should send an email with a valid token to reset the password', async () => {
      TestAppModule.subdomain = 'test';
      const email = data.user.email;
      const spy = jest.spyOn(messageService, 'sendForgotPassword');
      const res = await request(api).post('/v2/auth/forgot-password').send({ email }).expect(200);

      expect(res.body).toStrictEqual({ success: true });
      expect(spy.mock.calls.length).toBe(1);
      // expect(spy.mock.calls[0][0]).toBe(user.id);
      expect(spy.mock.calls[0][1]).toBe(data.user.email);
      const url = spy.mock.calls[0][2] as string;
      expect(url).toContain(`https://${data.company.subdomain}.${process.env.BASE_URL}`);
      const resetToken = /.*resetToken=(.*)/.exec(url)[1];

      // reset the password
      const newPassword = 'Aa123456!';
      const res2 = await request(api)
        .post('/v2/auth/reset-password')
        .send({ email, resetToken, newPassword })
        .expect(200);
      expect(res2.body).toStrictEqual({ success: true });
      spy.mockRestore();
    });

    it('should reject invalid tokens during reset', async () => {
      const email = data.user.email;
      const resetToken = '123456';
      TestAppModule.subdomain = 'test';
      const newPassword = 'Aa123456!';
      const res = await request(api)
        .post('/v2/auth/reset-password')
        .send({ email, resetToken, newPassword })
        .expect(400);
      expect(res.body).toStrictEqual({
        error: 'Bad Request',
        message: 'Token invalid or already used. Please, start a new reset password request.',
        statusCode: 400,
      });
    });
  });

  describe('change Password', () => {
    it('should change the password and be able to login', async () => {
      const newPassword = 'Aa123456!';
      const res = await request(api)
        .put('/v2/auth/me/change-password')
        .set(await getAuthHeaders(app, data.user))
        .send({ newPassword })
        .expect(200);
      expect(res.body).toStrictEqual({ success: true });

      await request(api)
        .post('/v2/auth/login')
        .send({
          email: data.user.email,
          password: newPassword,
        })
        .expect(200);
    });

    it(' should not allow invalid passwords', async () => {
      const newPassword = '123';
      const res = await request(api)
        .put('/v2/auth/me/change-password')
        .set(await getAuthHeaders(app, data.user))
        .send({ newPassword })
        .expect(400);
      expect(res.body.message).toEqual(
        'Password must be minimum 8 characters, must contain an uppercase letter, a lower case letter, at least one number and one special character.',
      );
    });
  });
});
