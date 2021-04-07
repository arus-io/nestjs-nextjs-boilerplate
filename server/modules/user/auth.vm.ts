import {Field, InputType, Int, ObjectType} from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

import { Company } from '../company/company.vm';

@ObjectType()
export class AuthResult {
  @Field(() => Company, { nullable: true })
  company: Company;

  @Field()
  token: string;

  @Field()
  needs2fa: boolean;

  @Field()
  has2faVerified: boolean;

  @Field({ nullable: true })
  type: 'sms' | 'totp';

  @Field({ nullable: true })
  existingPhone: string;
}

@InputType()
export class LoginArgs {
  @Field()
  email: string;

  @Field()
  password: string;
}

