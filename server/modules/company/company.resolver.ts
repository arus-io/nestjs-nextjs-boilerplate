import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Protected } from '../user/lib/auth.decorator';
import { CurrentUser } from '../user/lib/auth.guard';
import { User } from '../user/user.vm';
import { CompanyService } from './company.service';
import { Company } from './company.vm';

@Resolver((of) => Company)
export class CompanyResolver {
  constructor(private companyService: CompanyService) {}

  @Query((returns) => [Company])
  @Protected('superuser')
  async companies() {
    return this.companyService.findAll();
  }

  @Query((returns) => [User])
  @Protected()
  async companyUsers(@CurrentUser() user) {
    return this.companyService.findAllCompanyUsers(user.companyId);
  }
}
