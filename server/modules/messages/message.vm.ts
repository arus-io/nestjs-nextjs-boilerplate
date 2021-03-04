import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Medium } from './models/message.entity';
import { User } from '../user/user.vm';

@ObjectType()
export class Message {
  @Field((type) => Int)
  id: number;

  @Field((type) => User, { nullable: true })
  initiator: User;

  @Field((type) => User, { nullable: true })
  receiver: User;

  @Field({ nullable: false })
  code: string;

  @Field()
  to: string;

  @Field()
  from: string;

  @Field()
  subject: string;

  @Field()
  body: string;

  @Field({ nullable: false })
  sentDate: Date;

  @Field()
  medium: string; // @TODO use enum

  @Field({ nullable: true })
  error: string;

  // error
}
