import { Body, Controller, Get, HttpCode, Param, Put, Req, Request, Query } from '@nestjs/common';

import { Protected } from '../user/lib/auth.decorator';
import { CompanyService } from './company.service';
import { Company } from './models/company.entity';

@Controller('v2/companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompanyService) {}

  @Get()
  @Protected()
  findAll(): Promise<Company[]> {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @Protected()
  findOne(@Param('id') id: string): Promise<Company> {
    return this.companiesService.findOne(id);
  }

  @Put('/two-factor')
  @HttpCode(200)
  @Protected()
  async updateTwoFactor(@Body() body: { twoFactorEnabled: boolean }, @Req() req: Request): Promise<Company> {
    await this.companiesService.updateTwoFactor(body.twoFactorEnabled, (req as any).companyId);
    return this.companiesService.findOne((req as any).companyId);
  }

}
