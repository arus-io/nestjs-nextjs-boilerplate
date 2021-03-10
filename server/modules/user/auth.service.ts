import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { RedisService } from '../infra/cache/redis.service';
import { AppLogger } from '../infra/logger/app.logger';
import { TwoFactorAuthenticationRequiredException } from '../../lib/customExceptions';
import { MessageService } from '../messages/message.service';
import { ILoginResponse } from './auth.controller';
import { AuthUtils } from './lib/authUtils';
import { User } from './models/user.entity';
import { ForgotPasswordDto, ImpersonateDto, ResetPassworddDto, type2fa, Verify2faDto } from './user.dto';
import { ConfigService } from '@nestjs/config';
import { Company } from '../company/models/company.entity';
import { logger } from '../infra/logger';

const TOKEN_EXPIRATION_SEC = 60 * 60 * 24;
const TOKEN_REFRESH_SEC = 1;

export interface AccessToken {
  companyId: string | number;
  id: string | number;
  superuser?: boolean;
  impersonating?: boolean;
  needs2fa?: boolean;
  has2fa?: boolean;
  // decoded token comes with these
  exp?: number;
  iat?: number;
}
@Injectable()
export class AuthService {
  private logContext = 'AuthController';
  TOKEN_REVOKE_DELAY_SEC = 30;
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly cache: RedisService,
    private readonly logger: AppLogger,
    private readonly messageService: MessageService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: [] });
  }

  async login(
    { email, password }: { email: string; password: string },
    { companyId, subdomain },
  ): Promise<ILoginResponse> {
    const isAdmin = subdomain === 'admin';
    const { user, company } = await this.getBasicAuthDataByEmail(isAdmin ? 0 : companyId, email);

    if (!user) {
      throw new BadRequestException('Invalid user or password.');
    }

    const validPassword = await AuthUtils.comparePassword(password, user.password);
    if (!validPassword) {
      throw new BadRequestException('Invalid user or password.');
    }

    const needs2fa = this.twoFactorEnabled(company);
    const token = await this.grantAccessToken({ ...user, companyId, needs2fa }, TOKEN_EXPIRATION_SEC);
    const smsEnabled = !!user.twoFactorEnabledSMS;

    if (needs2fa && smsEnabled) {
      // we need to make sure we cycle the code
      await this.sendNextSMS(user);
    }

    return {
      token,
      needs2fa,
      has2faVerified: !!user.twoFactorEnabledTOTP || smsEnabled,
      type: smsEnabled ? 'sms' : 'totp',
      existingPhone: user.phone ? `(***) ***-${user.phone.slice(-4)}` : undefined,
    };
  }

  async validateAccessToken(userToken: AccessToken): Promise<any> {
    try {
      const payload = await AuthUtils.verifyJwt(this.configService.get('SECRET_TOKEN'), userToken);
      if (!payload) return;
      const isTokenAuthorized = await this.isAccessTokenAuthorized(payload);
      if (!isTokenAuthorized) {
        this.logger.warn({ message: 'Token has been revoked', payload }, this.logContext);
        return;
      }
      return payload;
    } catch (e) {
      this.logger.warn({ message: "Couldn't verify token", error: e }, this.logContext);
    }
  }

  async logout(userToken: AccessToken) {
    await this.revokeAccessToken(userToken as any);
    return {};
  }

  async refreshToken(companyId: string, userToken: AccessToken, rawToken: string): Promise<{ token: string }> {
    // If company enabled 2fa, we can't refresh
    if (!userToken.has2fa) {
      // dont trust userToken.needs2fa as it might have been changed in the company
      const { company } = await this.getBasicAuthData(userToken.companyId, ['u.id = :id', userToken]);
      if (this.twoFactorEnabled(company)) {
        throw new TwoFactorAuthenticationRequiredException();
      }
    }
    // If impersonating, or token is too new, we return the same token
    const { exp, iat } = userToken;
    const now = Math.floor(Date.now() / 1000);
    const canRefresh = now - iat >= TOKEN_REFRESH_SEC;
    if (userToken.impersonating || !canRefresh) {
      // don't refresh
      return { token: rawToken };
    }

    await this.revokeAccessToken(userToken as any, this.TOKEN_REVOKE_DELAY_SEC); // attend old requests
    const token = await this.grantAccessToken({ ...userToken, companyId }, TOKEN_EXPIRATION_SEC);

    return { token };
  }

  async verifyToken2FA(userToken: AccessToken, t: Verify2faDto) {
    const { user } = await this.getBasicAuthData(userToken.companyId, ['u.id = :id', userToken]);

    if ((user.twoFactorEnabledTOTP && t.tokenType === 'sms') || (user.twoFactorEnabledSMS && t.tokenType === 'totp')) {
      throw new BadRequestException('You can only activate one mechanism');
    }

    let matches;
    if (t.tokenType === 'sms') {
      matches = AuthUtils.verify2FANumber(user.twoFactorSecret, user.twoFactorCounter, t.token2fa);
      if (!user.twoFactorEnabledSMS && matches) {
        await this.usersRepository.update(user.id, { twoFactorEnabledSMS: true });
      }
    } else {
      matches = AuthUtils.verify2FAToken(user.twoFactorSecret, t.token2fa);
      if (!user.twoFactorEnabledTOTP && matches) {
        await this.usersRepository.update(user.id, { twoFactorEnabledTOTP: true });
      }
    }
    if (!matches) {
      throw new BadRequestException('The code is incorrect, please try again');
    }

    await this.revokeAccessToken(userToken as any);
    const token = await this.grantAccessToken({ ...userToken, has2fa: true }, TOKEN_EXPIRATION_SEC);
    return { token };
  }

  async enable2fa(userToken: AccessToken, twoFactorType: type2fa, newPhone?: string) {
    const { user, company } = await this.getBasicAuthData(userToken.companyId, ['u.id = :id', userToken]);
    if (!this.twoFactorEnabled(company)) {
      // we might remove this restriction in the future, and users may opt in
      throw new BadRequestException('Two Factor is not enabled');
    }

    if (user.twoFactorEnabledTOTP || user.twoFactorEnabledSMS) {
      throw new BadRequestException('Two Factor is already enabled.');
    }

    // regenerate the secret while it's not in use
    const secret = await AuthUtils.generate2FASecret();

    if (twoFactorType === type2fa.totp) {
      await this.usersRepository.update(user.id, { twoFactorSecret: secret.base32 });
      return {
        type: type2fa.totp,
        otpauthURL: secret.otpauth_url,
        success: true,
      };
    } else {
      // If no new phone provided and user has no phone throw an error
      const phone = newPhone || user.phone;
      if (!phone) {
        throw new BadRequestException({
          message: "User doesn't have a phone number. Can't set SMS verification.",
          error: 'NEEDS_PHONE',
        });
      }
      const _user: QueryDeepPartialEntity<User> = {
        twoFactorSecret: secret.base32,
        twoFactorCounter: 1,
      };
      if (newPhone) {
        _user.phone = newPhone;
      }
      await this.usersRepository.update(user.id, _user);
      const number = AuthUtils.generate2FANumber(_user.twoFactorSecret as string, _user.twoFactorCounter as number);
      // send SMS, and update twoFactorCounter
      await this.messageService.sendSmsTwoFactor(user.id, phone, number);

      return {
        type: type2fa.sms,
        success: true,
      };
    }
  }

  async requestSMS(userToken: AccessToken) {
    const { user, company } = await this.getBasicAuthData(userToken.companyId, ['u.id = :id', userToken]);
    if (!this.twoFactorEnabled(company) || !user.twoFactorEnabledSMS) {
      throw new BadRequestException('Two Factor SMS is not enabled');
    }
    await this.sendNextSMS(user);

    return {
      type: type2fa.sms,
      success: true,
    };
  }

  async impersonate(dto: ImpersonateDto) {
    const { user, company } = await this.getBasicAuthData(dto.companyId, ['u.id = :userId', dto]);
    if (!user || !company || dto.companyId != company.id) {
      throw new BadRequestException('Invalid User or Company.');
    }

    const token = await this.grantAccessToken(
      {
        id: user.id,
        companyId: company.id,
        needs2fa: false,
        has2fa: true,
        impersonating: true,
        superuser: false,
      },
      60 * 60, // 1h
    );
    return {
      site: `http://${company.subdomain}.${this.configService.get('BASE_URL')}`, //@TODO: Fix
      token,
    };
  }

  private async sendNextSMS(user) {
    const number = AuthUtils.generate2FANumber(user.twoFactorSecret, user.twoFactorCounter + 1);
    await this.messageService.sendSmsTwoFactor(user.id, user.phone, number);
    await this.usersRepository.update(user.id, { twoFactorCounter: user.twoFactorCounter + 1 });
  }

  private async getBasicAuthDataByEmail(companyId, email: string) {
    return this.getBasicAuthData(companyId, ['LOWER(u.email) = LOWER(:email)', { email }]);
  }

  private async getBasicAuthData(companyId, where) {
    const userQ = this.usersRepository
      .createQueryBuilder('u')
      .select([
        'u.superuser',
        'u.id',
        'u.password',
        'u.phone',
        'u.twoFactorEnabledTOTP',
        'u.twoFactorEnabledSMS',
        'u.twoFactorSecret',
        'u.twoFactorCounter',
        'u.email',
        'u.verificationToken',
      ]);
    const isAdmin = !companyId;
    if (isAdmin) {
      userQ.andWhere('u.superuser = :superuser', { superuser: true });
    } else {
      userQ
        .innerJoinAndSelect('u.company', 'company')
    }
    const user: User = await userQ.where(where[0], where[1]).getOne();
    return { user, company: user?.company };
  }

  public async grantAccessToken(c: AccessToken, expiresInSec): Promise<string> {
    const tokenInfo = await this.generateAccessToken(c, expiresInSec);
    await this.authorizeAccessToken(c.id, tokenInfo);
    return tokenInfo.token;
  }

  public async authorizeAccessToken(id: any, { exp, iat }) {
    const key = `at-${id}-${exp}`;
    // assuming it's been just issued
    const expiration = exp - iat + 60 * 5; // (we can let it a few mins, just in case)
    await this.cache.set(key, '1', expiration);
  }

  private async revokeAccessToken({ id, exp }, delaySec = 0) {
    const key = `at-${id}-${exp}`;
    if (delaySec) {
      await this.cache.expire(key, delaySec);
    } else {
      await this.cache.del(key);
    }
  }

  private async isAccessTokenAuthorized({ id, exp }) {
    const key = `at-${id}-${exp}`;
    return this.cache.get(key);
  }

  private async generateAccessToken(
    { id, companyId, superuser = false, needs2fa = false, has2fa = false, impersonating = false },
    expiresInSec,
  ) {
    const SECRET = this.configService.get('SECRET_TOKEN');
    const payload = { companyId, id } as AccessToken;
    // only add what's true
    if (superuser) payload.superuser = true;
    if (needs2fa) payload.needs2fa = true;
    if (has2fa) payload.has2fa = true;
    if (impersonating) payload.impersonating = true;

    return AuthUtils.signJwt(SECRET, payload as AccessToken, expiresInSec);
  }

  private async generateResetToken(
    { id, companyId },
    expiresInSec,
  ): Promise<{ token: string; iat: number; exp: number }> {
    const SECRET = this.configService.get('SECRET_TOKEN');
    return AuthUtils.signJwt(SECRET, { id, companyId }, expiresInSec);
  }

  private twoFactorEnabled(company?: Company) {
    if (company) {
      return company.twoFactorEnabled;
    } else {
      return this.configService.get('ADMIN_TWO_FACTOR') === 'true';
    }
  }

  public async forgotPassword({ email }: ForgotPasswordDto, { companyId, subdomain }) {
    const isAdmin = subdomain === 'admin';
    const { user } = await this.getBasicAuthDataByEmail(isAdmin ? 0 : companyId, email);
    if (!user) {
      logger.info('Forgot password - email not found.', { email });
      return { success: true };
    }
    const tokenInfo = await this.generateResetToken({ id: user.id, companyId }, 60 * 60 * 2);
    await this.usersRepository.update(user.id, { verificationToken: tokenInfo.token });
    const baseUrl = this.configService.get('BASE_URL')
    const link = `https://${subdomain}.${baseUrl}/reset-password?email=${encodeURIComponent(email)}&resetToken=${tokenInfo.token}`;
    await this.messageService.sendForgotPassword(user.id, user.email, link);
    return { success: true };
  }

  public async changePasswordWithToken(
    { email, resetToken, newPassword }: ResetPassworddDto,
    { companyId, subdomain },
  ) {
    const isAdmin = subdomain === 'admin';
    const { user } = await this.getBasicAuthDataByEmail(isAdmin ? 0 : companyId, email);
    if (!user) {
      throw new BadRequestException('Invalid user.');
    }
    let validToken = false;
    try {
      const payload = await AuthUtils.verifyJwt(this.configService.get('SECRET_TOKEN'), resetToken);
      if (payload && user.verificationToken === resetToken) {
        validToken = true;
      }
    } catch (e) {
      logger.info('Reset password error', e);
    }
    if (!validToken) {
      throw new BadRequestException('Token invalid or already used. Please, start a new reset password request.');
    }
    await this.changePassword(user, newPassword);
    return { success: true };
  }

  public async changePassword(user: User, newPassword) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
    if (!newPassword.match(passwordRegex)) {
      throw new BadRequestException(
        'Password must be minimum 8 characters, must contain an uppercase letter, ' +
          'a lower case letter, at least one number and one special character.',
      );
    }
    await this.usersRepository.update(user.id, {
      password: await AuthUtils.hashPassword(newPassword),
      verificationToken: '',
    });
    return { success: true };
  }
}
