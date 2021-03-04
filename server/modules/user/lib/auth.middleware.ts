import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction } from 'express';

import { AppLogger } from '../../infra/logger/app.logger';
import { TwoFactorAuthenticationRequiredException } from '../../../lib/customExceptions';
import { AuthService } from '../auth.service';
import { AuthUtils } from './authUtils';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private logger: AppLogger, private service: AuthService) {}

  async use(_req: Request, res: Response, next: NextFunction) {
    const req: { user: any; userToken: string; companyId: any } = _req as any;
    const token = _req.headers['x-access-token'];
    if (!token) {
      return next();
    }

    const payload = await this.service.validateAccessToken(token);
    if (!payload) {
      return next(new UnauthorizedException());
    }
    req.user = payload;

    req.userToken = token;
    if (req.user.superuser) {
      return next();
    }
    if (String(req.companyId) !== String(payload.companyId)) {
      this.logger.warn({
        message: 'Invalid token, it was not generated for this company',
        companyId: req.companyId,
        payload,
      });
      return next(new UnauthorizedException());
    }
    return next();
  }
}

const valid2fa = (req) => !req.user.needs2fa || req.user.has2fa;

export const loggedIn = async (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedException());
  }
  if (!valid2fa(req)) {
    return next(new TwoFactorAuthenticationRequiredException());
  }
  return next();
};

export const isSuperUser = async (req, res, next) => {
  if (!req.user || !req.user.superuser) {
    return next(new UnauthorizedException());
  }
  if (!valid2fa(req)) {
    return next(new TwoFactorAuthenticationRequiredException());
  }
  return next();
};


const middlewares = {
  AuthMiddleware,
  loggedIn,
  isSuperUser,
};

module.exports = middlewares;
