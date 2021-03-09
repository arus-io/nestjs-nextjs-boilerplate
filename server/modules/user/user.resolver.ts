import { Info, Parent, Query, ResolveField, Resolver, Args } from '@nestjs/graphql';

import { CurrentUser } from './lib/auth.guard';
import { User as UserEntity } from './models/user.entity';
import { UserService } from './user.service';
import { GlobalSearchResult, User } from './user.vm';
import { Protected } from './lib/auth.decorator';

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}

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

}
