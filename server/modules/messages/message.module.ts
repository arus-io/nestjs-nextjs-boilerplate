import { Module } from '@nestjs/common';

import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';

@Module({
  imports: [],
  providers: [MessageService, MessageResolver],
  controllers: [],
  exports: [],
})
export class MessageModule {}
