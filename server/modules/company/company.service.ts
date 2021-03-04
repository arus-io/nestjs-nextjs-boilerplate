import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../user/models/user.entity';
import { UserService } from '../user/user.service';
import { Company } from './models/company.entity';


@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private userService: UserService,
  ) {}

  async findAll(): Promise<Company[]> {
    return this.companyRepo.find({
      relations: [],
      order: {
        name: 'ASC',
      },
    });
  }

  findOne(id: string): Promise<Company> {
    return this.companyRepo.findOne(id);
  }

  async getIdFromSubdomain(subdomain: string): Promise<number> {
    const comp = await this.companyRepo.findOne({ subdomain }, { select: ['id'] });
    return comp?.id
  }

  async updateTwoFactor(twoFactorEnabled, companyId): Promise<UpdateResult> {
    return await this.companyRepo.update(companyId, { twoFactorEnabled });
  }

  async findAllCompanyUsers(companyId: string): Promise<User[]> {
    return this.userService.findAllFromCompany(companyId);
  }
}
