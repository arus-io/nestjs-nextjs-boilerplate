import {Resolver, Args, Mutation, Context} from '@nestjs/graphql';

import {AuthService} from "./auth.service";
import {AuthResult, ChangePasswordResult} from "./auth.vm";

@Resolver((of) => AuthResult)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation((returns) => AuthResult)
  async login(@Args('email') email: string, @Args('password') password: string, @Context() c) {
    return await this.authService.login({ email, password}, {
      subdomain: c.req.subdomain,
      companyId: c.req.companyId,
    });
  }

  @Mutation((returns) => ChangePasswordResult)
  async changePassword(@Args('newPassword') newPassword: string, @Context() c) {
    return await this.authService.changePassword(c.req.user, newPassword);
  }
}
