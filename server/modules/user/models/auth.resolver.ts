import {Info, Parent, Query, ResolveField, Resolver, Args, Mutation, Context} from '@nestjs/graphql';

import { CurrentUser } from './lib/auth.guard';
import { User as UserEntity } from './models/user.entity';
import { UserService } from './user.service';
import {GlobalSearchResult, LoginArgs, User} from './user.vm';
import { Protected } from './lib/auth.decorator';
import {AuthService} from "./auth.service";

@Resolver((of) => User)
export class AuthResolver {
  constructor(private userService: UserService, private authService: AuthService) {}

  @Query((returns) => [GlobalSearchResult])
  @Protected('superuser')
  async globalSearch(@Args('query', { nullable: false }) query: string) {
    if (query.trim() != '') {
      return this.userService.globalSearch(query);
    } else {
      return []
    }
  }

  @Query((returns) => User)
  @Protected()
  async me(@CurrentUser() user, @Info() info) {
    return this.userService.findOne(user.id);
  }

  @Mutation((returns) => User)
  async login(@Args('args') loginArgs: LoginArgs, @Context() c) {
    return await this.authService.login(loginArgs, {
      subdomain: c.req.subdomain,
      companyId: c.req.companyId,
    });
  }

}
