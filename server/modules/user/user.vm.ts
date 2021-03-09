import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

import { Company } from '../company/company.vm';

@ObjectType()
export class User {
  @Field((type) => Int)
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  phone: string;

  @Field(() => Company, { nullable: true })
  company: Company;

}

@ObjectType()
export class GlobalSearchResult {
  @Field()
  entity: string;

  @Field()
  id: string;

  @Field()
  label: string;
}
