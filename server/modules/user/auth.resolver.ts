import {Resolver, Args, Mutation, Context} from '@nestjs/graphql';

import {AuthService} from "./auth.service";
import {AuthResult, ChangePasswordResult} from "./auth.vm";
import { Protected } from './lib/auth.decorator';

@Resolver((of) => AuthResult)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation((returns) => AuthResult)
  async login(@Args('email') email: string, @Args('password') password: string, @Context() c) {
    const { subdomain, companyId } = c.req;
    return await this.authService.login({ email, password}, { subdomain, companyId });
  }

  @Mutation((returns) => ChangePasswordResult)
  @Protected()
  async changePassword(@Args('newPassword') newPassword: string, @Context() c) {
    return await this.authService.changePassword(c.req.user, newPassword);
  }

  @Mutation((returns) => ChangePasswordResult)
  async resetPassword(@Args('email') email: string, @Args('resetToken') resetToken: string, @Args('newPassword') newPassword: string, @Context() c) {
    const { subdomain, companyId } = c.req;
    return await this.authService.changePasswordWithToken({ email, resetToken, newPassword }, { subdomain, companyId });
  }

  @Mutation((returns) => ChangePasswordResult)
  async forgotPassword(@Args('email') email: string, @Context() c) {
    const { subdomain, companyId } = c.req;
    return await this.authService.forgotPassword({ email }, { subdomain, companyId });
  }

}
