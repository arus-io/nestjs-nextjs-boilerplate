import { Field, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class Company {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  subdomain: string;

  @Field(() => String, { nullable: true })
  supportEmail: string;

  @Field(() => Boolean)
  twoFactorEnabled: boolean;

  @Field(() => String, { nullable: true })
  logo: string | null;
}
