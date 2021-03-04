import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { TwoFactorAuthenticationRequiredException } from '../../../lib/customExceptions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('arus-auth', context.getHandler());

    if (!roles) {
      return true;
    }

    let request = context.switchToHttp().getRequest();
    if (!request) {
      const gqlContext = GqlExecutionContext.create(context);
      request = gqlContext.getContext().req;
    }
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Missing or Invalid credentials');
    }

    let valid2fa = !user.needs2fa || user.has2fa;
    let role = roles.length ? roles[0] : 'authenticated';

    if (role === 'skip_2fa') {
      // we don't validate 2fa, because we need to enable it in these endpoints
      role = 'authenticated';
      valid2fa = true;
    }

    if (!valid2fa) {
      throw new TwoFactorAuthenticationRequiredException();
    }
    switch (role) {
      case 'authenticated': {
        if (user) return true;
        throw new UnauthorizedException('Missing or Invalid credentials');
      }
      case 'superuser': {
        const hasRole = !!user[role];
        if (hasRole) return true;
        throw new UnauthorizedException('Not enough privileges');
      }
      default: {
        throw new UnauthorizedException('Unknown role');
      }
    }
  }
}

// for GQL
export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  return ctx.getContext().req.user;
});
