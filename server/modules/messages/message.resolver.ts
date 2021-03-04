import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { formatDateGql } from '../../_core/util/dateFormatter';
import { Protected } from '../user/lib/auth.decorator';
import { MessageService } from './message.service';
import { Message } from './message.vm';

@Resolver((of) => Message)
export class MessageResolver {
  constructor(private messageService: MessageService) {}

  @Query((returns) => [Message])
  @Protected('superuser')
  async messages() {
    return this.messageService.findAll();
  }

  @ResolveField()
  async sentDate(@Parent() p: Message) {
    return formatDateGql(p, 'createdAt');
  }
}
