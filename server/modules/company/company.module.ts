import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { InfraModule } from '../infra/infra.module';
import { CompanyResolver } from './company.resolver';
import { CompaniesController } from './company.controller';
import { CompanyService } from './company.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [InfraModule, HttpModule, forwardRef(() => UserModule)],
  providers: [CompanyService, CompanyResolver],
  controllers: [CompaniesController],
  exports: [CompanyService],
})
export class CompanyModule {}
