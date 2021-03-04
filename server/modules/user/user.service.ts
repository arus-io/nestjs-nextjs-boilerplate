import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './models/user.entity';
import { GlobalSearchResult } from './user.vm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findOne(userId: string, companyId: string): Promise<User> {
    const result: User = await this.userRepo
      .createQueryBuilder('u')
      .innerJoinAndSelect('u.company', 'c')
      .addSelect('ua.userId')
      .where('u.id = :userId', { userId })
      .getOne();
    return result;
  }

  async findAllFromCompany(companyId: string): Promise<User[]> {
    const result: User[] = await this.userRepo
      .createQueryBuilder('u')
      .where(`u.companyId = :companyId`, { companyId })
      .getMany();
    return result;
  }

  async globalSearch(query: string): Promise<GlobalSearchResult[]> {
    const tsConfig = 'simple';
    const sqlUser = `
      SELECT
        'User' as entity,
        title as label,
        id
      FROM users
      WHERE
        to_tsvector($1, firstName || ' ' || lastName) @@ to_tsquery($1, $2)
        AND "deletedAt" IS NULL`;
    const sqlCompany = `
      SELECT
        'Company' as entity,
        name as label,
        id
      FROM companies
      WHERE
        to_tsvector($1, name || ' ' || subdomain) @@ to_tsquery($1, $2)
        AND "deletedAt" IS NULL
      ORDER BY 1, 2
    `;
    return this.userRepo.query(`${sqlUser} UNION ${sqlCompany}`, [tsConfig, `${query}:*`]);
  }
}
